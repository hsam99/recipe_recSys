from rest_framework import serializers
import ast
from .models import RecipeDetails, RecipeRating
from django.contrib.auth.models import User
import django.contrib.auth.password_validation as validators


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True)


class SignUpSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('email', 'username', 'password')

    def validate_password(self, data):
        validators.validate_password(password=data)
        return data
    
    def create(self, validated_data):
        email       = validated_data.pop('email')
        username    = validated_data.pop('username')
        password    = validated_data.pop('password')
        user        = User.objects.create_user(username=username, email=email, password=password)
        return user


class RecipeDetailSerializer(serializers.ModelSerializer):
    rating = serializers.SerializerMethodField()
    avg_rating = serializers.SerializerMethodField()
    rating_count = serializers.SerializerMethodField()

    class Meta:
        model = RecipeDetails
        fields = ['index', 'title', 'images', 'ingredients', 'instructions', 'rating', 'avg_rating', 'rating_count']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['images'] = ast.literal_eval(data['images'])
        data['ingredients'] = ast.literal_eval(data['ingredients'])
        data['instructions'] = ast.literal_eval(data['instructions'])
        return data

    def get_rating(self, obj):
        user = self.context['request'].user
        if user in obj.rating.all():
            return RecipeRating.objects.get(recipe=obj, user=user).rating
        else:
            return 0

    def get_avg_rating(self, obj):
        total_rating = 0
        all_ratings = RecipeRating.objects.filter(recipe=obj)

        if len(all_ratings) == 0:
            return None
        else:
            for recipe_rating in all_ratings:
                total_rating += recipe_rating.rating
            return total_rating/len(all_ratings)

    def get_rating_count(self, obj):
        return len(RecipeRating.objects.filter(recipe=obj))

class RecipeDisplaySerializer(serializers.ModelSerializer):

    class Meta:
        model = RecipeDetails
        fields = ['index', 'title', 'images']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['images'] = ast.literal_eval(data['images'])
        return data


class RecipeRatingSerializer(serializers.Serializer):
    recipe_idx = serializers.IntegerField(required=True)
    rating    = serializers.IntegerField(required=True)

