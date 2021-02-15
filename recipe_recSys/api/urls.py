from django.urls import path
from .views import (login_view, SignUpView, logout_view, session_view, recipe_query, RecipeView, get_recipe_detail, recipe_rating_view)

urlpatterns = [
    path('login/', login_view, name='api-login'),
    path('signup/', SignUpView.as_view(), name='api-signup'),
    path('logout/', logout_view, name='api-logout'),
    path('session/', session_view, name='api-session'),
    path('search/<str:q>/', recipe_query, name='recipe-query'),
    path('recipe/<int:idx>/', get_recipe_detail, name='recipe-det'),
    path('rate/', recipe_rating_view, name='rate-recipe')
]