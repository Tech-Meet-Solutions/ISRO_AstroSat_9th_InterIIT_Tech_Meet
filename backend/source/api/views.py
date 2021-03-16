from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.conf import settings
from source.models import Source
from source.api.serializers import SourceSerializer
MEDIA_ROOT = settings.MEDIA_ROOT
from django.core import serializers
from django.http.response import JsonResponse


# Get Sample Info
@api_view(['GET', ])
def get_source_list(request):
    if request.method == 'GET':
        data = {}      
        all_entries = Source.objects.all()
        serializer = SourceSerializer(all_entries, many=True)
        data["sources"] = serializer.data
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
