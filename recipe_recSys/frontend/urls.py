from django.urls import path
from .views import index

urlpatterns = [
    path('', index, name='index_page'),
    path('recipe/<int:id>/', index, name='detail_page'),
    path('search/<str:q>/', index, name='search_result_page'),
    path('signin/', index, name='sign_in_page'),
    path('signup/', index, name='sign_up_page'),
    path('saved/', index, name='saved_recipe_page'),
]