from rest_framework import serializers
from source.models import Publication, SourceA, SourceB


class PublicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publication
        fields = ('identifier',
                  'Name',
                  'URL')


class SourceASerializer(serializers.ModelSerializer):
    class Meta:
        model = SourceA
       
        fields = ('id',
                  'Name',
                  'RA',
                  'Dec',
                  'isObserved_uvit',
                  'isObserved_sxt',
                  'isObserved_laxpc',
                  'isObserved_czti',
                  'Publications',
                  'category',
                  'common_uvit'
                  'common_sxt'
                  'common_laxpc'
                  'common_czti')


class SourceBSerializer(serializers.ModelSerializer):
    class Meta:
        model = SourceB
       
        fields = ('id',
                  'Name',
                  'RA',
                  'Dec',
                  'category')
