from rest_framework import serializers
from source.models import Publication, Source


class PublicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publication
        fields = ('identifier',
                  'Name',
                  'URL')


class SourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Source
        # fields = ('Name',
        #          'RA',
        #          'Dec',
        #          'category')
        fields = ('id',
                  'Name',
                  'RA',
                  'Dec',
                  'isObserved',
                  'Publications',
                  'category')
