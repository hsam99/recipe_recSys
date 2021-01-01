from django.urls import path
from .views import recipe_query

urlpatterns = [
    path('search/', recipe_query, name='recipe_query'),
]