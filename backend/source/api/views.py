from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.core import serializers
from django.http.response import JsonResponse

from source.models import SourceA, SourceB
from source.api.serializers import SourceASerializer,SourceBSerializer, PublicationSerializer
from rest_framework.renderers import JSONRenderer

# Get Source Info
@api_view(['GET', ])
def get_source_list(request):
    if request.method == 'GET':
        data = {}
        all_entries = SourceA.objects.all()
        serializer = SourceASerializer(all_entries, many=True)
        data["sources"] = serializer.data
        #data["SourcesA"] = JSONRenderer().render(serializer.data)
        
        return Response(data, status=status.HTTP_200_OK)
###################################################################


# Get Source Info
@api_view(['GET', ])
def get_source_info(request, pk):
    if request.method == 'GET':
        data = {}
        publications = []
        
        source = SourceA.objects.get(id=pk)
        
        data['id'] = source.id
        data['Name'] = source.Name
        data['RA'] = source.RA
        data['Dec'] = source.Dec
        data['category'] = source.category
        data['isObserved_uvit'] = source.isObserved_uvit
        data['isObserved_sxt'] = source.isObserved_sxt
        data['isObserved_laxpc'] = source.isObserved_laxpc
        data['isObserved_czti'] = source.isObserved_czti
        
        #data['CatalogA_data'] = data
        czti = []
        if source.isObserved_czti:
            for i in source.czti.all():
                czti.append({
                    "id" : i.id,
                    "Name" : i.Name,
                    "RA" : i.RA,
                    "Dec" : i.Dec,
                    "category" : i.category
                })


        data["czti"] = czti

        sxt = []
        if source.isObserved_sxt:
            for i in source.sxt.all():
                sxt.append({
                    "id" : i.id,
                    "Name" : i.Name,
                    "RA" : i.RA,
                    "Dec" : i.Dec,
                    "category" : i.category
                })


        data["sxt"] = sxt

        laxpc = []
        if source.isObserved_laxpc:
            for i in source.laxpc.all():
                laxpc.append({
                    "id" : i.id,
                    "Name" : i.Name,
                    "RA" : i.RA,
                    "Dec" : i.Dec,
                    "category" : i.category
                })


        data["laxpc"] = laxpc

        uvit = []
        if source.isObserved_uvit:
            for i in source.uvit.all():
                uvit.append({
                    "id" : i.id,
                    "Name" : i.Name,
                    "RA" : i.RA,
                    "Dec" : i.Dec,
                    "category" : i.category
                })


        data["uvit"] = uvit

        # loop over the publications for this source 
        for i in source.Publications.all():
            publications.append([i.identifier,i.Name,i.URL])
        data['publications'] = publications

        return Response(data, status=status.HTTP_200_OK)
###################################################################

