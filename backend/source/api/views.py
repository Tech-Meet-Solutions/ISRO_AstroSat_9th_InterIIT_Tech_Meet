from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.core import serializers
from django.http.response import JsonResponse

from source.models import SourceA, SourceB, Refs
from source.api.serializers import SourceASerializer,SourceBSerializer, PublicationSerializer
from rest_framework.renderers import JSONRenderer

# Get Source Info
@api_view(['GET', ])
def get_source_list(request):
    # id,name,ra,dec
    if request.method == 'GET':
        data = {}
        #all_entries =SourceA.objects.all()
        fields = ('id','Name','Type','RA','Dec','GLON','GLAT','Class')
        all_entries = SourceA.objects.all().only('id','Name','Type','RA','Dec','GLON','GLAT','Class')
    
        data["sources"] = SourceASerializer(all_entries, many=True, fields=fields).data
        
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
        data['Type'] = source.Type
        data['RA'] = source.RA
        data['Dec'] = source.Dec
        data['GLON'] = source.GLON
        data['GLAT'] = source.GLAT
        data['Opt'] = source.Opt
        data['r_Opt'] = source.r_Opt
        data['Vmag'] = source.Vmag
        data['B_V'] = source.B_V
        data['U_B'] = source.U_B
        data['E_BV'] = source.E_BV
        data['r_Vmag'] = source.r_Vmag
        data['Fx'] = source.Fx
        data['Range'] = source.Range
        data['r_Fx'] = source.r_Fx
        data['Porb'] = source.Porb
        data['Porb2'] = source.Porb2
        data['Ppulse'] = source.Ppulse
        data['r_Ppulse'] = source.r_Ppulse
        data['Cat'] = source.Cat
        data['SpType'] = source.SpType
        data['Class'] = source.Class
        
        refs = set()
        # Preprocess refs data to send references
        if not source.r_Opt=="":
            for i in source.r_Opt.split(','):
                refs.add(i)
        if not source.r_Fx=="":
            for i in source.r_Fx.split(','):
                refs.add(i)
        if not source.r_Vmag=="":
            for i in source.r_Vmag.split(','):
                refs.add(i)
        if not source.r_Ppulse=="":
            for i in source.r_Ppulse.split(','):
                refs.add(i)
        refs_list=[]
        for ref in refs:
            r = Refs.objects.get(id=ref+"_"+source.Class)
            refs_list.append({
                "id":r.id[:-5],
                "bib":r.bib,
                "Name":r.Name,
                "desc":r.desc
            })

        data["refs"] = refs_list
        
        
        
        
        #data['CatalogA_data'] = data
        czti = []
        if source.isObserved_czti:
            for i in source.czti.all():
                czti.append({
                    "id" : i.id,
                    "Object" : i.Object,
                    "obsid" : i.obsid,
                    "RA" : i.RA,
                    "Dec" : i.Dec,
                    "instrument" : i.instrument,
                    "date_time" : i.date_time,
                    "proposal_id" : i.proposal_id,
                    "target_id" : i.target_id,
                    "observer" : i.observer,
                    "abstract" : i.abstract
                    
                    
                })


        data["czti"] = czti

        sxt = []
        if source.isObserved_sxt:
            for i in source.sxt.all():
                sxt.append({
                    "id" : i.id,
                    "Object" : i.Object,
                    "obsid" : i.obsid,
                    "RA" : i.RA,
                    "Dec" : i.Dec,
                    "instrument" : i.instrument,
                    "date_time" : i.date_time,
                    "proposal_id" : i.proposal_id,
                    "target_id" : i.target_id,
                    "observer" : i.observer,
                    "abstract" : i.abstract
                })


        data["sxt"] = sxt

        laxpc = []
        if source.isObserved_laxpc:
            for i in source.laxpc.all():
                laxpc.append({
                    "id" : i.id,
                    "Object" : i.Object,
                    "obsid" : i.obsid,
                    "RA" : i.RA,
                    "Dec" : i.Dec,
                    "instrument" : i.instrument,
                    "date_time" : i.date_time,
                    "proposal_id" : i.proposal_id,
                    "target_id" : i.target_id,
                    "observer" : i.observer,
                    "abstract" : i.abstract
                })


        data["laxpc"] = laxpc

        uvit = []
        if source.isObserved_uvit:
            for i in source.uvit.all():
                uvit.append({
                    "id" : i.id,
                    "Object" : i.Object,
                    "obsid" : i.obsid,
                    "RA" : i.RA,
                    "Dec" : i.Dec,
                    "instrument" : i.instrument,
                    "date_time" : i.date_time,
                    "proposal_id" : i.proposal_id,
                    "target_id" : i.target_id,
                    "observer" : i.observer,
                    "abstract" : i.abstract
                })


        data["uvit"] = uvit

        # loop over the publications for this source 
        for i in source.Publications.all():
            publications.append({"identifier":i.identifier,
                                "Name":  i.Name,
                                "Bib" : i.Bib,
                                "Authors": i.Authors,
                                "Keywords":i.Keywords,
                                "Abstract":i.Abstract})
        data['publications'] = publications

        return Response(data, status=status.HTTP_200_OK)
###################################################################



