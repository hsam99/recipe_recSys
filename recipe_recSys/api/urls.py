from django.urls import path
from .views import recipe_query, RecipeView, get_recipe_detail

urlpatterns = [
    path('search/<str:q>/', recipe_query, name='recipe_query'),
    path('recipe/<int:idx>/', get_recipe_detail, name='recipe_det'),
]