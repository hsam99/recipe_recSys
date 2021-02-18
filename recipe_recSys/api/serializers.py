from rest_framework import serializers
import ast
from .models import RecipeDetails, RecipeRating, RecipeSave
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
    saved = serializers.SerializerMethodField()

    class Meta:
        model = RecipeDetails
        fields = ['index', 'title', 'images', 'ingredients', 'instructions', 'rating', 'avg_rating', 'rating_count', 'saved', 'healthiness_label']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['images'] = ast.literal_eval(data['images'])
        data['ingredients'] = ast.literal_eval(data['ingredients'])
        data['instructions'] = ast.literal_eval(data['instructions'])
        data['healthiness_label'] = ast.literal_eval(data['healthiness_label'])
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

    def get_saved(self, obj):
        user = self.context['request'].user
        if user in obj.saved.all():
            print('True')
            return True
        else:
            print('False')
            return False


class RecipeDisplaySerializer(serializers.ModelSerializer):
    count = serializers.SerializerMethodField()

    class Meta:
        model = RecipeDetails
        fields = ['index', 'title', 'images', 'healthiness_label', 'count']
        ordering = ['count']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['images'] = ast.literal_eval(data['images'])
        data['healthiness_label'] = ast.literal_eval(data['healthiness_label'])
        return data

    def get_count(self, obj):
        healthiness_label = obj.healthiness_label
        healthiness_label = ast.literal_eval(healthiness_label)
        green_count = 0
        for label in healthiness_label:
            if label[0] == 1:
                green_count += 1
            else:
                pass

        return green_count


class RecipeRatingSerializer(serializers.Serializer):
    recipe_idx = serializers.IntegerField(required=True)
    rating    = serializers.IntegerField(required=True)


class RecipeSaveSerializer(serializers.Serializer):
    recipe_idx = serializers.IntegerField(required=True)
    save    = serializers.BooleanField(required=True)


class ViewSavedRecipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecipeSave
        fields = [('recipe')]