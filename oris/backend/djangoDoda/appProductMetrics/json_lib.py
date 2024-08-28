import json

def getParametersFromJson(index):
    with open(f"appProductMetrics/querries.json", "r") as file:
        data = json.load(file)
        if index in data["indices"]:
            indexLabel = data["indices"][index]["label"]
            indexType = data["indices"][index]["indexType"]
            field = data["indices"][index]["fieldQuery"]
            mustQuery = data["indices"][index]["mustQuery"]
        else:
            return index, "", "", {}, {}
        dataFormat = data["dataFormat"]
        return indexLabel, indexType, field, mustQuery, dataFormat