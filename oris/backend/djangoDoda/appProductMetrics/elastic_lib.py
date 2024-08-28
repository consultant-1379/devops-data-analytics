from collections import defaultdict
from elasticsearch import Elasticsearch
import appProductMetrics.utils as util
import copy
import appProductMetrics.csv_lib as csvlib
import appProductMetrics.json_lib as jsonlib
import statistics
# Helpful for debugging
import pdb


class appProductMetrics:

    def __init__(self):
        self.appStagingTwnetyDayDeliveries = {}
        self.es_url = 'https://elastic.hahn130.rnd.gic.ericsson.se'
        self.es_username = 'EIAPREG100'
        self.es_password = 'CztvYwveBHUp8A2UQtBxDxsB'
        self.es = Elasticsearch([self.es_url], http_auth=(self.es_username, self.es_password), verify_certs=False)

    def getIndexData(self, indices):
        indexList = str(indices[0]).split(",")
        es = self.es
        wholeData = {}
        teamsData = self.getTeamsData(es)
        for index in indexList:
            try:
                indexLabel, indexType, field, mustQuery, dataFormat = jsonlib.getParametersFromJson(index)
                query = self.elasticQuery(field, mustQuery)
                result = es.search(index=index, body=query, size=0)
                queryData = result["aggregations"]["by_application"]["buckets"]
                data = self.dataFormating(dataFormat, queryData, indexType, teamsData)
                data = self.doubleDataFormatting(data, indexType)
            except Exception as e:
                data = []
                return e
            wholeData[indexLabel] = data
        return wholeData

    def doubleDataFormatting(self, data, indexType):
        combined_data = defaultdict(lambda: {
            "applicationName": [],
            "appLabel": None,
            "teams": [],
            "teamCount": 0,
            "yesterdayData": defaultdict(int),
            "twentyDaysData": defaultdict(int, dayWiseCounts=defaultdict(int)),
        })

        parameters = ["totalPipelineDeliveries", "totalSuccessCount", "totalFailedCount", "cfr", "ltc"]

        for each in data:
            repeated_label = each["appLabel"]
            combined = combined_data[repeated_label]
            combined["appLabel"] = each["appLabel"]
            combined["teams"] = each["teams"]
            combined["teamCount"] = each["teamCount"]
            combined["applicationName"].append(each["applicationName"])
            for parameter in parameters:
                combined["yesterdayData"][parameter] += each["yesterdayData"][parameter]
                combined["twentyDaysData"][parameter] += each["twentyDaysData"][parameter]
            try:
                day_data_pairs = [(each["day"], each["value"]) for each in each["twentyDaysData"]["dayWiseCounts"]]
                if day_data_pairs : 
                    dayDef, dataDef = zip(*day_data_pairs)
                    for i in range(len(dayDef)):
                        combined["twentyDaysData"]["dayWiseCounts"][dayDef[i]] += dataDef[i]
            except Exception as e:
                print(f"No data found in {each['applicationName']} \n {e}")
            combined["twentyDaysData"]["movingMedianLTC"] += each["twentyDaysData"]["movingMedianLTC"]
        for each in dict(combined_data).values():
            self.flatFormatting2(each, indexType, "twentyDaysData")
            self.flatFormatting2(each, indexType, "yesterdayData")
            if indexType == "app":
                self.appStagingTwnetyDayDeliveries[each["appLabel"]] = each["twentyDaysData"]["totalPipelineDeliveries"]

            combined = combined_data["Total"]
            combined["appLabel"] = "Total"
            combined["applicationName"].append(each["applicationName"])
            combined["teams"] += each["teams"]
            combined["teamCount"] += each["teamCount"]
            for parameter in parameters:
                combined["yesterdayData"][parameter] += each["yesterdayData"][parameter]
                combined["twentyDaysData"][parameter] += each["twentyDaysData"][parameter]
        

        combined_data = {
            key: {
                k: {
                    **value[k],
                    "deliveriesColor": self.getDeliveriesColor(value[k]["totalPipelineDeliveries"], value["teamCount"] if k == "twentyDaysData" else value["twentyDaysData"]["totalPipelineDeliveries"], indexType),
                    "cfr": self.percentageCal(value[k].get("totalFailedCount", 0), (value[k].get("totalFailedCount", 1) + value[k].get("totalSuccessCount", 0))),
                    "cfrColor": self.getCFRColor(self.percentageCal(value[k].get("totalFailedCount", 0), (value[k].get("totalFailedCount", 1) + value[k].get("totalSuccessCount", 0))), indexType),
                    "ltc": self.ltcValue(value[k].get("ltc", 0), len(value["applicationName"])),
                    "ltcColor": self.getLTCColor(self.ltcValue(value[k].get("ltc", 0), len(value["applicationName"])), indexType),
                } if k == "yesterdayData" or k == "twentyDaysData" else v
                for k, v in value.items()

            } if value["appLabel"] == "Total" else value
            for key, value in combined_data.items()
        }
        return list(combined_data.values())
    
    def ltcValue(self, x, y):
        return (x / y) if y > 0 else 0
    
    def percentageCal(self, x, y):
        return (x / y) * 100 if y > 0 else 0


    def dataFormating(self, dataStructure, queryData, indexType, teamsData):
        data = []
        for eachData in queryData:
            dataFormat = copy.deepcopy(dataStructure)
            dataFormat["applicationName"] = eachData["key"]
            label = self.appLabel(eachData["key"], indexType)
            dataFormat["appLabel"] = label
            if label in teamsData:
                dataFormat["teams"] = teamsData[label]['teams']
                dataFormat["teamCount"] = len(dataFormat["teams"])
            if dataFormat["teamCount"] == 0: continue

            #Order matters here
            self.flatFormatting(dataFormat, eachData, "twentyDaysData")
            self.flatFormatting(dataFormat, eachData, "yesterdayData")

            data.append(dataFormat)
        return data
    
    def flatFormatting2(self, dataFormat, indexType, param):
        dataFormat[param]["cfr"] = self.cfrCal(dataFormat, param)
        appLen = len(dataFormat["applicationName"]) if len(dataFormat["applicationName"]) > 0 else 1
        ltcVal = dataFormat[param]["ltc"] if param == "yesterdayData" else dataFormat[param]["movingMedianLTC"]
        dataFormat[param]["ltc"] = float("{:.0f}".format(ltcVal / (60000 * appLen)))
        dataFormat[param]["ltcColor"] = self.getLTCColor(dataFormat[param]["ltc"], indexType)

        if param == "twentyDaysData" :
            dayWiseDeliveriesUpdated = [each for each in dict(dataFormat[param]["dayWiseCounts"]).values()]
            dayWiseDeliveriesUpdated += [0] * (20 - len(dayWiseDeliveriesUpdated))
            dataFormat[param]["totalPipelineDeliveries"] =  self.calMovingMedian(dayWiseDeliveriesUpdated)

            self.setFinalColor(dataFormat, indexType, param, dataFormat["teamCount"])
        else :
            self.setFinalColor(dataFormat, indexType, param, dataFormat["twentyDaysData"]["totalPipelineDeliveries"])
    
    def flatFormatting(self, dataFormat, eachData, param):
        lteValue = eachData[param]["successful_status"]["total_avg_succeeded"]["value"]
        if param == "twentyDaysData":
            dayWiseCounts = [{ "day": each["key_as_string"], "value": each["doc_count"] } for each in eachData[param]["docs_per_day"]["buckets"]]
            ltcDaywise = [each["key"] for each in eachData[param]["successful_status"]["each_pipeline_duration"]["buckets"]]
            dataFormat[param]["movingMedianLTC"] = self.calMovingMedian(ltcDaywise)
            dataFormat[param]["dayWiseCounts"] = dayWiseCounts
            dataFormat[param]["ltcDaywise"] = ltcDaywise
        dataFormat[param]["ltc"] = 0 if lteValue == None else lteValue
        dataFormat[param]["totalPipelineDeliveries"] = eachData[param]["doc_count"]
        data = eachData[param]["by_status"]["buckets"]
        self.passAndFailCalcualtion(data, dataFormat, param)
        dataFormat[param]["cfr"] = 0

    def calMovingMedian(self, dataset):
        try: 
            return statistics.median(dataset)
        except:
            return 0

    def passAndFailCalcualtion(self, data, dataFormat, parameter):
        for bucket in data:
            if bucket:
                if "key" in bucket and bucket["key"] == "SUCCEEDED":
                    if bucket["doc_count"] != 0:
                        dataFormat[parameter]["totalSuccessCount"] = bucket["doc_count"]
                elif "key" in bucket and bucket["key"] == "TERMINAL":
                    if bucket["doc_count"] != 0:
                        dataFormat[parameter]["totalFailedCount"] = bucket["doc_count"]
    
    def cfrCal(self, dataFormat, parameter):
        try:
            cfr = (dataFormat[parameter]["totalFailedCount"] /
                        dataFormat[parameter]["totalPipelineDeliveries"]) * 100
        except ZeroDivisionError:
            cfr = 0
        return cfr

    def setFinalColor(self, dataFormat, indexType, param, count):
        if indexType == "product" and param == "twentyDaysData" :
            deliveriesColor = self.getDeliveriesColor(dataFormat[param]["totalPipelineDeliveries"], self.appStagingTwnetyDayDeliveries[dataFormat["appLabel"]], indexType)
        else: 
            deliveriesColor = self.getDeliveriesColor(dataFormat[param]["totalPipelineDeliveries"], count, indexType)
        cfrColor = self.getCFRColor(dataFormat[param]["cfr"], indexType)
        dataFormat[param]["deliveriesColor"], dataFormat[param]["cfrColor"] = deliveriesColor, cfrColor

    def getLTCColor(self, ltc, indexType):
        threshold = 80.4 if indexType == "app" else 60.4
        # threshold = 50.5
        return "GREEN" if ltc <= threshold else "RED"

    def getDeliveriesColor(self, x, y, indexType):
        # threshold = 80.00 if indexType == "app" else 85.00
        threshold = 80.00
        try:
            percentage = (x / y) * 100
            return self.getColor(percentage, threshold)
        except ZeroDivisionError:
            return "GREEN" if x > 0 else "RED"
    
    def getCFRColor(self, percentage, indexType):
        # cfrThreshold = 20.5 if indexType == "app" else 15.5
        cfrThreshold = 20.5
        if percentage >= 0 and percentage <= cfrThreshold:
            return "GREEN"
        elif percentage > cfrThreshold + 1 and percentage <= 25.00 : 
            return "AMBER"
        else:
            return "RED"

    def getColor(self, percentage, threshold):
        if percentage >= threshold:
            return "GREEN"
        elif percentage > 50.00 and percentage < threshold - 1 : 
            return "AMBER"
        else:
            return "RED"

    def elasticQuery(self, field, mustQuery):
        yesterdayStartDate, yesterdayEndDate, twentyStartDate = util.getTimeDuration()
        query = {"size": 0,
                "query": {"bool": mustQuery},
                "aggs": {"by_application": {"terms": {"field": field, "size": 50},
                    "aggs": {
                        "yesterdayData": {
                            "filter": {"range": {"pipeline.endTime": {"gte": yesterdayStartDate,"lte": yesterdayEndDate}}},
                            "aggs": {
                                "by_status": {"terms": {"field": "pipeline.status.keyword"}},
                                 "successful_status": {
                                    "filter": {
                                        "term": {
                                        "pipeline.status.keyword": "SUCCEEDED"
                                        }
                                    },
                                    "aggs": {
                                         "total_sum_succeeded": {
                                            "sum": {
                                                "field": "pipeline.duration"
                                            }
                                        },
                                        "total_avg_succeeded": {
                                            "avg": {
                                                "field": "pipeline.duration"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "twentyDaysData": {
                            "filter": {"range": {"pipeline.endTime": {"gte": twentyStartDate,"lte": yesterdayEndDate}}},
                            "aggs": {
                                "docs_per_day": {
                                    "date_histogram": {
                                        "field": "pipeline.endTime",
                                        "fixed_interval": "1d"
                                    },
                                },
                                "by_status": {"terms": {"field": "pipeline.status.keyword"}},
                                 "successful_status": {
                                    "filter": {
                                        "term": {
                                        "pipeline.status.keyword": "SUCCEEDED"
                                        }
                                    },
                                    "aggs": {
                                        "each_pipeline_duration": {
                                            "terms": {
                                                "field": "pipeline.duration",
                                                "size": 300
                                            }
                                        },
                                        "docs_by_successful_duration": {
                                            "date_histogram": {
                                                "field": "pipeline.endTime",
                                                "fixed_interval": "1d"
                                            },
                                            "aggs": {
                                                "sum_per_day": {
                                                       "sum": {
                                                            "field": "pipeline.duration"
                                                        } 
                                                }
                                            },
                                        },
                                        "total_sum_succeeded": {
                                            "sum": {
                                                "field": "pipeline.duration"
                                            }
                                        },
                                         "total_avg_succeeded": {
                                            "avg": {
                                                "field": "pipeline.duration"
                                            }
                                        }
                                    }
                                }
                            }
                            }
                            }}}
                            }
        return query
    
    def getTeamsData(self, es):
        query = {"query": {"match_all": {}}}
        try:
            result = es.search(index="teams-data", body=query, size = 200)
            teamsData = {}
            for doc in result['hits']['hits']:
                teams = []
                for team in doc["_source"]["teamsData"]:
                    teams.append(team["teamName"])
                teamsData[doc["_source"]["id"]] = {"teams": teams}
            return teamsData
        except:
            return {}

    def appLabel(self, appName, indexType):
        if indexType == "app":
            appname = str(appName).replace("-", " ")
            if ("e2e" in appname and "base-platform" not in appName):
                label = str(appname).split("e2e")[0][:-1].upper()
                dic = csvlib.getAppData("chartLabel", label)
                if dic:
                    label = dic["labelAlias"]
                else:
                    label = label
            elif("e2e" in appname and "base-platform" in appName):
                label = "BASE PLATFORM"
                dic = csvlib.getAppData("chartLabel", label)
                if dic:
                    label = dic["labelAlias"]
                else:
                    label = label       
            else:
                label = appName
        else:
            dic = csvlib.getAppData("chartName", appName)
            if dic:
                label = dic["labelAlias"]
            else:
                label = appName
        #TODO: This should be handled
        if label == "OS":
            label = "Oran Support"
        if appName == "ml-execution-env":
            label = appName
        return label
    
    def getFeedbackData(self, feedbackData):
        es = self.es
        response = es.index(index="doda-user-feedback", document=feedbackData)
        return response

    def storeUserLog(self, userlog):
        es = self.es
        response = es.index(index="doda-usage-tracker", document=userlog)
        return response