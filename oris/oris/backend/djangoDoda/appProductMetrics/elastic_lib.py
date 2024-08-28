from elasticsearch import Elasticsearch
import appProductMetrics.utils as util
import copy
import appProductMetrics.csv_lib as csvlib
import appProductMetrics.json_lib as jsonlib


class appProductMetrics:

    def __init__(self):
        self.es_url = 'https://elastic.hahn130.rnd.gic.ericsson.se'
        self.es_username = 'EIAPREG100'
        self.es_password = 'CztvYwveBHUp8A2UQtBxDxsB'
        self.es = Elasticsearch([self.es_url], http_auth=(self.es_username, self.es_password), verify_certs=False)

    def getIndexData(self, indices):
        indexList = str(indices[0]).split(",")
        es = self.es
        wholeData = {}
        for index in indexList:
            try:
                indexLabel, indexType, field, mustQuery, dataFormat = jsonlib.getParametersFromJson(index)
                query = self.elasticQuery(field, mustQuery)
                result = es.search(index=index, body=query, size=0)
                queryData = result["aggregations"]["by_application"]["buckets"]
                data = self.dataFormating(dataFormat, queryData, indexType)
            except Exception as e:
                data = []
            wholeData[indexLabel] = data
        return wholeData

    def dataFormating(self, dataStructure, queryData, indexType):
        data = []
        for eachData in queryData:
            dataFormat = copy.deepcopy(dataStructure)
            dataFormat["applicationName"] = eachData["key"]
            label, teamCount = self.appLabel(eachData["key"], indexType)
            dataFormat["appLabel"] = label
            dataFormat["teamCount"] = teamCount
            dataFormat["twentyDaysData"]["totalPipelineDeliveries"] = eachData["twentyDaysData"]["doc_count"]
            lastTwentyData = eachData["twentyDaysData"]["by_status"]["buckets"]
            dataFormat, twentyDaysPassRate = self.passRateCalcualtion(lastTwentyData, dataFormat, "twentyDaysData")
            dataFormat["twentyDaysData"]["passRate"] = twentyDaysPassRate
            dataFormat["yesterdayData"]["totalPipelineDeliveries"] = eachData["yesterdayData"]["doc_count"]
            lastTwoData = eachData["yesterdayData"]["by_status"]["buckets"]
            dataFormat, yesterdayPassRate = self.passRateCalcualtion(lastTwoData, dataFormat, "yesterdayData")
            dataFormat["yesterdayData"]["passRate"] = yesterdayPassRate
            dataFormat = self.getApplicationColor(indexType, dataFormat,"yesterdayData")
            dataFormat = self.getApplicationColor(indexType, dataFormat, "twentyDaysData")
            dataFormat = self.getProductColor(indexType, dataFormat, "yesterdayData")
            dataFormat = self.getProductColor(indexType, dataFormat, "twentyDaysData")
            data.append(dataFormat)
        return data

    def appLabel(self, appName, indexType):
        if indexType == "app":
            appName = str(appName).replace("-", " ")
            if "e2e" in appName:
                label = str(appName).split("e2e")[0][:-1].upper()
                dic = csvlib.getAppData("chartLabel", label)
                if dic:
                    label = dic["labelAlias"]
                    teamCount = dic["teamCount"]
                else:
                    teamCount = 1
        else:
            dic = csvlib.getAppData("chartName", appName)
            if dic:
                label = dic["labelAlias"]
                teamCount = dic["teamCount"]
            else:
                label = appName
                teamCount = 0
        return label, teamCount

    def passRateCalcualtion(self, data, dataFormat, parameter):
        for bucket in data:
            if bucket:
                if "key" in bucket and bucket["key"] == "SUCCEEDED":
                    if bucket["doc_count"] != 0:
                        dataFormat[parameter]["totalSuccessCount"] = bucket["doc_count"]
                elif "key" in bucket and bucket["key"] == "TERMINAL":
                    if bucket["doc_count"] != 0:
                        dataFormat[parameter]["totalFailedCount"] = bucket["doc_count"]
        try:
            passRate = (dataFormat[parameter]["totalSuccessCount"] / 
                                dataFormat[parameter]["totalPipelineDeliveries"]) * 100
        except ZeroDivisionError:
            passRate = 0

        return dataFormat, passRate

    def elasticQuery(self, field, mustQuery):
        yesterdayStartDate, yesterdayEndDate, twentyStartDate = util.getTimeDuration()
        query = {"size": 0,
                "query": {"bool": mustQuery},
                "aggs": {"by_application": {"terms": {"field": field},
                    "aggs": {
                        "yesterdayData": {
                            "filter": {"range": {"pipeline.endTime": {"gte": yesterdayStartDate,"lte": yesterdayEndDate}}},
                            "aggs": {"by_status": {"terms": {"field": "pipeline.status.keyword"}}}},
                        "twentyDaysData": {
                            "filter": {"range": {"pipeline.endTime": {"gte": twentyStartDate,"lte": yesterdayEndDate}}},
                            "aggs": {"by_status": {"terms": {"field": "pipeline.status.keyword"}}}}
                            }}}
                            }
        return query

    def getApplicationColor(self, indexType, dataFormat, param):
        teamCount = dataFormat["teamCount"]
        types = ["deliveries", "passRate"]
        averageCount = teamCount*20

        for type in types:
            # Deliveries Datacolor set for Yesterday and 20 day
            if param == "yesterdayData" and indexType == "app" and type == "deliveries":
                if dataFormat["yesterdayData"]["totalPipelineDeliveries"] >= teamCount:
                    dataFormat["yesterdayData"]["deliveriesColor"] = "GREEN"
                else:
                    dataFormat["yesterdayData"]["deliveriesColor"] = "RED"
            if param == "twentyDaysData" and indexType == "app" and type == "deliveries":
                if dataFormat["twentyDaysData"]["totalPipelineDeliveries"] >= averageCount:
                    dataFormat["twentyDaysData"]["deliveriesColor"] = "GREEN"
                else:
                    dataFormat["twentyDaysData"]["deliveriesColor"] = "RED"

        # PassRate Datacolor set for Yesterday and 20 day
            if param == "yesterdayData" and indexType == "app" and type == "passRate":
                if dataFormat["yesterdayData"]["totalSuccessCount"] >= teamCount:
                    dataFormat["yesterdayData"]["passRateColor"] = "GREEN"
                else:
                    dataFormat["yesterdayData"]["passRateColor"] = "RED"
            if param == "twentyDaysData" and indexType == "app" and type == "passRate":
                if dataFormat["twentyDaysData"]["totalSuccessCount"] >= averageCount:
                    dataFormat["twentyDaysData"]["passRateColor"] = "GREEN"
                else:
                    dataFormat["twentyDaysData"]["passRateColor"] = "RED"
        return dataFormat


    def getProductColor(self, indexType, dataFormat, param):
        types = ["deliveries", "passRate"]
        for type in types:
            # Deliveries Datacolor set for Yesterday and 20 day
            if param == "yesterdayData" and indexType == "product" and type == "deliveries":
                if dataFormat["yesterdayData"]["passRate"] >= 85.00:
                    dataFormat["yesterdayData"]["deliveriesColor"] = "GREEN"
                else:
                    dataFormat["yesterdayData"]["deliveriesColor"] = "RED"
            if param == "twentyDaysData" and indexType == "product" and type == "deliveries":
                if dataFormat["twentyDaysData"]["passRate"] >= 85.00:
                    dataFormat["twentyDaysData"]["deliveriesColor"] = "GREEN"
                else:
                    dataFormat["twentyDaysData"]["deliveriesColor"] = "RED"

            # PassRate Datacolor set for Yesterday and 20 day
            if param == "yesterdayData" and indexType == "product" and type == "passRate":
                if dataFormat["yesterdayData"]["passRate"] >= 85.00:
                    dataFormat["yesterdayData"]["passRateColor"] = "GREEN"
                else:
                    dataFormat["yesterdayData"]["passRateColor"] = "RED"
            if param == "twentyDaysData" and indexType == "product" and type == "passRate":
                if dataFormat["twentyDaysData"]["passRate"] >= 85.00:
                    dataFormat["twentyDaysData"]["passRateColor"] = "GREEN"
                else:
                    dataFormat["twentyDaysData"]["passRateColor"] = "RED"
        return dataFormat


    def getFeedbackData(self, feedbackData):
        es = self.es
        response = es.index(index="zkoldav-feedback", document=feedbackData)
        return response
    
    def storeUserLog(self, userlog):
        es = self.es
        response = es.index(index="test-usage-tracker", document=userlog)
        return response