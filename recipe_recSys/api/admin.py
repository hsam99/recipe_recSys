from django.contrib import admin

# Register your models here.
from .models import RecipeDetails, RecipeEmbeddings, RecipeRating, RecipeSave
admin.site.register(RecipeDetails)
admin.site.register(RecipeEmbeddings)
admin.site.register(RecipeRating)
admin.site.register(RecipeSave)