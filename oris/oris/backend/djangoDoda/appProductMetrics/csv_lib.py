"""Reading and Fetching data from csv files"""
import pandas as pd

def getAppData(key, appName):
    path = "appProductMetrics/parameter_file.csv"
    df = pd.read_csv(path)
    filtered_data = df[df[key] == appName]
    data_dict = filtered_data.to_dict('records')
    if data_dict:
        return data_dict[0]
    else:
        return {}