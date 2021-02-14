from rest_framework import serializers
import ast
from .models import RecipeDetails
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



