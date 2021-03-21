from django.contrib import admin
from .models import Publication, SourceA, SourceB

# Register your models here.
admin.site.register(Publication)
admin.site.register(SourceA)
admin.site.register(SourceB)
