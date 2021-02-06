from django.urls import path
from .views import index

urlpatterns = [
    path('', index, name='index_page'),
    path('recipe/<int:id>/', index, name='detail_page'),
    path('search/<str:q>/', index, name='search_result_page'),
]