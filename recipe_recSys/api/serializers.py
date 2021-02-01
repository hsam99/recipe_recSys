from rest_framework import serializers
import ast
from .models import RecipeDetails

class RecipeSearchSerializer(serializers.Serializer):
    query = serializers.CharField(max_length=400)


class RecipeDisplaySerializer(serializers.ModelSerializer):

    class Meta:
        model = RecipeDetails
        fields = ['id', 'title', 'images']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['images'] = ast.literal_eval(data['images'])
        return data