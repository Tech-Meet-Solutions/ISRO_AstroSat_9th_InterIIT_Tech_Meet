from django.urls import path

from source.api.views import (get_source_info, get_source_list)

app_name = 'source'
urlpatterns = [
    path('', get_source_list, name='source-api-list'),
    path('info/<int:pk>/', get_source_info, name='source-api-info'),
]
