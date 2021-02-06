from rest_framework import serializers
import ast
from .models import RecipeDetails

class RecipeDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecipeDetails
        fields = ['index', 'title', 'images', 'ingredients', 'instructions']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['images'] = ast.literal_eval(data['images'])
        data['ingredients'] = ast.literal_eval(data['ingredients'])
        data['instructions'] = ast.literal_eval(data['instructions'])
        return data


class RecipeDisplaySerializer(serializers.ModelSerializer):

    class Meta:
        model = RecipeDetails
        fields = ['index', 'title', 'images']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['images'] = ast.literal_eval(data['images'])
        return data