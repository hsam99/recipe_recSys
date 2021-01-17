from django.urls import path
from .views import index

urlpatterns = [
    path('', index, name='index_page'),
    path('detail/', index, name='detail_page'),
]