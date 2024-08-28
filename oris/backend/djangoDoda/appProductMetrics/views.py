from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.decorators import api_view
from appProductMetrics.elastic_lib import appProductMetrics

@api_view(['GET'])
def index(request):
    indices = request.GET.getlist('indices')
    app = appProductMetrics()
    data = app.getIndexData(indices)
    return Response(data)

@api_view(['POST'])
def feedback(request:Request):
    app = appProductMetrics()
    feedbackResponse = app.getFeedbackData(request.data)
    return Response(feedbackResponse)

@api_view(['POST'])
def usagetracker(request:Request):
    app = appProductMetrics()
    feedbackResponse = app.storeUserLog(request.data)
    return Response(feedbackResponse)