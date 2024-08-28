from datetime import datetime, timedelta


def getTimeDuration():
    today = datetime.today()
    yesterdayBackDate = today - timedelta(days=1)
    twentyBackDate = today - timedelta(days=20)
    yesterdayStartDate = yesterdayBackDate.replace(hour=0, minute=0, second=0, microsecond=0)
    twentyStartDate = twentyBackDate.replace(hour=0, minute=0, second=0, microsecond=0)
    yesterdayEndDate = yesterdayBackDate.replace(hour=23, minute=59, second=59, microsecond=999)
    return yesterdayStartDate, yesterdayEndDate, twentyStartDate