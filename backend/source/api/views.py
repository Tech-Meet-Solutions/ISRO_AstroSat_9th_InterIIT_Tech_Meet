from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.core import serializers
from django.http.response import JsonResponse

from source.models import Source
from source.api.serializers import SourceSerializer, PublicationSerializer


# Get Source Info
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
        publications = []
        
        source = Source.objects.get(id=pk)
        data['id'] = source.id
        data['Name'] = source.Name
        data['RA'] = source.RA
        data['Dec'] = source.Dec
        data['category'] = source.category
        data['isObserved'] = source.isObserved
        # loop over the publications for this source 
        for i in source.Publications.all():
            publications.append([i.identifier,i.Name,i.URL])
        data['publications'] = publications

        return Response(data, status=status.HTTP_200_OK)
###################################################################
