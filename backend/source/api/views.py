from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.conf import settings


MEDIA_ROOT = settings.MEDIA_ROOT


# Get Sample Info
@api_view(['GET', ])
def get_source_list(request):
    if request.method == 'GET':
        data = {}
        data['works'] = 'get_source_list works'

        return Response(data, status=status.HTTP_200_OK)
###################################################################


# Get Source Info
@api_view(['GET', ])
def get_source_info(request, pk):
    if request.method == 'GET':
        data = {}
        data['works'] = 'get_source_info works'
        data['id'] = pk

        return Response(data, status=status.HTTP_200_OK)
###################################################################
