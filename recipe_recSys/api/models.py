# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey has `on_delete` set to the desired behavior.
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models
from django.conf import settings
import random

User = settings.AUTH_USER_MODEL


class UserProfile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    prototype_vector = models.TextField(blank=True, null=True)

class RecipeRating(models.Model):
    recipe = models.ForeignKey('RecipeDetails', on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.SmallIntegerField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)


class RecipeSave(models.Model):
    recipe = models.ForeignKey('RecipeDetails', on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)


class RecipeDetails(models.Model):
    index = models.AutoField(primary_key=True)
    title = models.TextField(blank=True, null=True)
    url = models.TextField(blank=True, null=True)
    partition = models.TextField(blank=True, null=True)
    ingredients = models.TextField(blank=True, null=True)
    images = models.TextField(blank=True, null=True)
    id = models.TextField(blank=True, null=True)
    instructions = models.TextField(blank=True, null=True)
    rating = models.ManyToManyField(User, related_name='user_rating', blank=True, through=RecipeRating)
    saved = models.ManyToManyField(User, related_name='user_saved', blank=True, through=RecipeSave)
    healthiness_label = models.TextField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'recipe_details'


class RecipeEmbeddings(models.Model):
    index = models.AutoField(primary_key=True)
    cleaned_title = models.TextField(blank=True, null=True)
    cleaned_ingrs = models.TextField(blank=True, null=True)
    title_vec = models.TextField(blank=True, null=True)
    weighted_ingr_vec = models.TextField(blank=True, null=True)
    id = models.TextField(blank=True, null=True)
    tfidf_weight = models.TextField(blank=True, null=True)
    weighted_title_vec = models.TextField(blank=True, null=True)
    ingr_vec = models.TextField(blank=True, null=True)
    topic = models.IntegerField(blank=True, null=True)
    combined_vec = models.TextField(blank=True, null=True)
    recipe_embedding = models.TextField(blank=True, null=True)
    
    class Meta:
        managed = True
        db_table = 'recipe_embeddings'
