from rest_framework import serializers
import ast
from .models import RecipeDetails, RecipeRating, RecipeSave, RecipeEmbeddings
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
    instructions = serializers.SerializerMethodField()
    tfidf_weight = serializers.SerializerMethodField() # Test
    cleaned_ingrs = serializers.SerializerMethodField() # Test
    cleaned_title = serializers.SerializerMethodField() # Test

    class Meta:
        model = RecipeDetails
        fields = ['index', 'title', 'images', 'ingredients', 'instructions', 'rating', 'avg_rating', 'rating_count', 'saved', 'healthiness_label', 'tfidf_weight', 'cleaned_ingrs', 'cleaned_title']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['images'] = ast.literal_eval(data['images'])
        data['ingredients'] = ast.literal_eval(data['ingredients'])
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
            return True
        else:
            return False

    def get_tfidf_weight(self, obj): 
        return RecipeEmbeddings.objects.get(index=obj.index).tfidf_weight

    def get_cleaned_ingrs(self, obj): 
        return RecipeEmbeddings.objects.get(index=obj.index).cleaned_ingrs

    def get_cleaned_title(self, obj): 
        return RecipeEmbeddings.objects.get(index=obj.index).cleaned_title

    def get_instructions(self, obj):
        instructions = ast.literal_eval(obj.instructions)
        cleaned_instructions = [instruction for instruction in instructions if len(instruction['text']) > 3]
        return cleaned_instructions


class RecipeDisplaySerializer(serializers.ModelSerializer):
    count = serializers.SerializerMethodField()
    similarity = serializers.SerializerMethodField()
    avg_rating = serializers.SerializerMethodField()
    rating_count = serializers.SerializerMethodField()

    class Meta:
        model = RecipeDetails
        fields = ['index', 'title', 'images', 'healthiness_label', 'count', 'similarity', 'avg_rating', 'rating_count']
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

    def get_similarity(self, obj): 
        obj_idx = obj.index
        similarity_list = self.context['similarity']
        similarity_score = next((v[1] for v in similarity_list if v[0] == obj_idx), None)

        return similarity_score

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