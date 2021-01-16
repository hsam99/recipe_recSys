from django.contrib import admin

# Register your models here.
from .models import RecipeDetails, RecipeEmbeddings
admin.site.register(RecipeDetails)
admin.site.register(RecipeEmbeddings)