from django.urls import path
from .views import recipe_query, RecipeView

urlpatterns = [
    path('search/', recipe_query, name='recipe_query'),
    path('recipe/', RecipeView.as_view(), name='recipe_det'),
]