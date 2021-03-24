from rest_framework import serializers
from source.models import Publication, SourceA, SourceB, Refs

class DynamicFieldsModelSerializer(serializers.ModelSerializer):
    """
    A ModelSerializer that takes an additional `fields` argument that
    controls which fields should be displayed.
    """

    def __init__(self, *args, **kwargs):
        # Don't pass the 'fields' arg up to the superclass
        fields = kwargs.pop('fields', None)

        # Instantiate the superclass normally
        super(DynamicFieldsModelSerializer, self).__init__(*args, **kwargs)

        if fields is not None:
            # Drop any fields that are not specified in the `fields` argument.
            allowed = set(fields)
            existing = set(self.fields.keys())
            for field_name in existing - allowed:
                self.fields.pop(field_name)




class PublicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publication
        fields = ('identifier',
                  'Name',
                  'Bib',
                  'Authors',
                  'Keywords',
                  'Abstract')


class RefsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Refs
       
        fields = ('id',
                  'bib',
                  'Name',
                  'desc')

class SourceBSerializer(serializers.ModelSerializer):
    class Meta:
        model = SourceB
       
        fields = ('id',
                'Object',
                'obsid',
                'RA',
                'Dec',
                'instrument',
                'date_time',
                'proposal_id',
                'target_id',
                'observer',
                'abstract'
                  )

class SourceASerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = SourceA
       
        fields = ('id',
                  'Name',
                  'Type',
                  'RA',
                  'Dec',
                  'GLON',
                  'GLAT',
                  'Opt',
                  'r_Opt',
                  'Vmag',
                  'B_V',
                  'U_B',
                  'E_BV',
                  'r_Vmag',
                  'Fx',
                  'Range',
                  'r_Fx',
                  'Porb',
                   'Porb2',
                  'Ppulse',
                  'r_Ppulse',
                  'Cat',
                  'SpType',
                  'Class',
                  'isObserved_uvit',
                  'isObserved_sxt',
                  'isObserved_laxpc',
                  'isObserved_czti',
                  'uvit',
                  'sxt',
                  'laxpc',
                  'czti',
                  'Publications'
                  )


