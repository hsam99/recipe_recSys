from rest_framework import serializers
from .models import RecipeDetails

class RecipeSearchSerializer(serializers.Serializer):
    query = serializers.CharField(max_length=400)


class RecipeDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecipeDetails
        fields = ['id', 'title', 'ingredients', 'images', 'instructions']