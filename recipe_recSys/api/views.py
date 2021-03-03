from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import random
import ast
from nltk.tokenize import RegexpTokenizer
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .apps import RecipeSearchConfig
from .models import (RecipeDetails, RecipeEmbeddings, RecipeRating, RecipeSave, UserProfile)
from .serializers import (
    RecipeDetailSerializer,
    RecipeDisplaySerializer,
    LoginSerializer,
    SignUpSerializer,
    RecipeRatingSerializer,
    RecipeSaveSerializer,
    ViewSavedRecipeSerializer,
)
import time
from rest_framework import generics, status, permissions
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated


@api_view(['POST'])
def login_view(request):
    login_serializer = LoginSerializer(data=request.data)
    if login_serializer.is_valid(raise_exception=True):
        username = login_serializer.data.get('username')
        password = login_serializer.data.get('password')

    if username is None or password is None:
        return JsonResponse({'detail': 'Please provide username and password.'}, status=400)

    user = authenticate(username=username, password=password)

    if user is None:
        return JsonResponse({'detail': 'Wrong username or password.'}, status=400)

    login(request, user)
    return JsonResponse({'detail': 'Successfully logged in.'})


class SignUpView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = User.objects.all()
    serializer_class = SignUpSerializer


def logout_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({'detail': 'You\'re not logged in.'}, status=400)

    logout(request)
    return JsonResponse({'detail': 'Successfully logged out.'})


@ensure_csrf_cookie
def session_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({'isAuthenticated': False})

    return JsonResponse({'isAuthenticated': True})


class RecipeView(generics.ListAPIView):
    queryset = RecipeDetails.objects.all()
    serializer_class = RecipeDisplaySerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def recipe_query(request, q):
    print('incoming...')
    # search_serializer = RecipeSearchSerializer(data=request.data)
    # if search_serializer.is_valid(raise_exception=True):
    #     query = search_serializer.data.get('query')
    # else:
    #     return Response('Invalid query')
    query_vec = vectorize_query(q)
    if query_vec is None:
        return Response({'detail': "Could not find '{}'.".format(q)}, status=status.HTTP_400_BAD_REQUEST)
    else:
        top_n_recipes, similarity_list = compute_similarity(query_vec, 1)

        recipe_objects = RecipeDetails.objects.filter(index__in=top_n_recipes)
        recipe_det_serializer = RecipeDisplaySerializer(recipe_objects, context={'similarity': similarity_list}, many=True)
        return Response(recipe_det_serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def automatic_recommendation_view(request):
    ingr_word2vec_model = RecipeSearchConfig.ingr_word2vec_model
    user = request.user
    has_user_profile = True
    print(ingr_word2vec_model.most_similar(positive=['rice'], topn=5))
    try:
        prototype_vector = ast.literal_eval(UserProfile.objects.get(user=user).prototype_vector)
        
        if np.array_equal(prototype_vector, np.zeros((1, 100))):
            has_user_profile = False
    except:
        has_user_profile = False
        print('bye')

    # print(ingr_word2vec_model.similar_by_vector(np.array(prototype_vector).reshape(-1), topn=10))
    highly_rated_recipe = get_high_rated_recipes()
    
    if has_user_profile:
        recipe_recipe_recommendation = find_similar_recipes(user)
        top_n_recipes, similarity_list = compute_similarity(prototype_vector, 0)

        recipe_objects = RecipeDetails.objects.filter(index__in=top_n_recipes)
        recipe_det_serializer = RecipeDisplaySerializer(recipe_objects, context={'similarity': similarity_list}, many=True)
        explanation_sections = [{'explanation': 'From recipes that you have rated in the past, these recipes are recommended', 'recipes': recipe_det_serializer.data, 'index': None, 'link': False},
                                recipe_recipe_recommendation, 
                                highly_rated_recipe]
        valid_explanation_sections = []

        for section in range(len(explanation_sections)):
            if explanation_sections[section] is None:
                pass
            else:
                valid_explanation_sections.append(explanation_sections[section])

        return JsonResponse(
            valid_explanation_sections, 
            status=status.HTTP_200_OK, 
            safe=False
        )
    else:
        return JsonResponse(
            [highly_rated_recipe],
            status=status.HTTP_200_OK,
            safe=False
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_recipe_detail(request, idx):
    print(request.user)
    print('incoming...')
    target_recipe = RecipeDetails.objects.get(index=idx)
    recipe_det_serializer = RecipeDetailSerializer(target_recipe, context={'request': request})
    return Response(recipe_det_serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def recipe_rating_view(request):
    rating_serializer = RecipeRatingSerializer(data=request.data)
    if rating_serializer.is_valid(raise_exception=True):
        recipe_idx = rating_serializer.data.get('recipe_idx')
        rating = rating_serializer.data.get('rating')
    else:
        return JsonResponse({'detail': 'Invalid input'})
    recipe = RecipeDetails.objects.get(index=recipe_idx)
    user = request.user
    if user in recipe.rating.all():
        if rating == 0:
            recipe.rating.remove(user)
        else:
            update_recipe = RecipeRating.objects.get(recipe=recipe, user=user)
            update_recipe.rating = rating
            update_recipe.save()
    else:
        if rating == 0:
            pass
        else:
            RecipeRating.objects.create(recipe=recipe, user=user, rating=rating)

    if UserProfile.objects.filter(user=user).exists():
        prototype_vector(user, 1) # update prototype vector
    else:
        prototype_vector(user, 0) # create prototype vector

    return JsonResponse({'detail': 'Rating updated'})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def recipe_save_view(request):
    save_serializer = RecipeSaveSerializer(data=request.data)
    if save_serializer.is_valid(raise_exception=True):
        recipe_idx = save_serializer.data.get('recipe_idx')
        save = save_serializer.data.get('save')
    else:
        return JsonResponse({'detail': 'Invalid input'})
    recipe = RecipeDetails.objects.get(index=recipe_idx)
    user = request.user

    if user in recipe.saved.all():
        recipe.saved.remove(user)
    else:
        recipe.saved.add(user)

    return JsonResponse({'detail': 'Save updated'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_saved_recipe(request):
    saved_recipe_id = []
    rated_recipe_id = []
    user = request.user
    saved_recipes = RecipeSave.objects.filter(user=user).values('recipe')
    rated_recipes = RecipeRating.objects.filter(user=user).values('recipe')
    for recipe in saved_recipes:
        saved_recipe_id.append(recipe['recipe'])
    
    for recipe in rated_recipes:
        rated_recipe_id.append(recipe['recipe'])

    recipe_objects_saved = RecipeDetails.objects.filter(index__in=saved_recipe_id)
    recipe_det_serializer_saved = RecipeDisplaySerializer(recipe_objects_saved, context={'similarity': []}, many=True)
    recipe_objects_rated = RecipeDetails.objects.filter(index__in=rated_recipe_id)
    recipe_det_serializer_rated = RecipeDisplaySerializer(recipe_objects_rated, context={'similarity': []}, many=True)

    return Response([recipe_det_serializer_saved.data, recipe_det_serializer_rated.data], status=status.HTTP_200_OK)


def prototype_vector(user, flag):
    positive_rating_threshold = 3
    all_positive_recipe = list(RecipeRating.objects.filter(user=user, rating__gte=positive_rating_threshold).values_list('recipe', 'rating'))
    all_negative_recipe = list(RecipeRating.objects.filter(user=user, rating__lt=positive_rating_threshold).values_list('recipe', 'rating'))
    positive_prototype = np.zeros((1,100))
    negative_prototype = np.zeros((1,100))

    if len(all_positive_recipe) != 0:
        for recipe in all_positive_recipe:
            positive_prototype = positive_prototype + (np.array(ast.literal_eval(RecipeEmbeddings.objects.get(index=recipe[0]).weighted_ingr_vec)) * int(recipe[1] - 2))

    if len(all_negative_recipe) != 0:    
        for recipe in all_negative_recipe:
            negative_prototype = negative_prototype + (np.array(ast.literal_eval(RecipeEmbeddings.objects.get(index=recipe[0]).weighted_ingr_vec)) * int(2/recipe[1]))
    
    positive_prototype = positive_prototype / (1 if len(all_positive_recipe) == 0 else len(all_positive_recipe))
    negative_prototype = negative_prototype / (1 if len(all_negative_recipe) == 0 else len(all_negative_recipe))
    
    prototype_vector = np.array2string(0.85*positive_prototype - 0.5*negative_prototype, separator=', ')
    if flag == 0:
        print(0)
        UserProfile.objects.create(user=user, prototype_vector=prototype_vector) 

    elif flag == 1:
        print(1)
        target_user = UserProfile.objects.get(user=user)
        target_user.prototype_vector = prototype_vector
        target_user.save()


def vectorize_query(query):
    stop_words = set(stopwords.words('english'))
    lemmatizer = WordNetLemmatizer()
    tokenizer = RegexpTokenizer(r'[a-zA-Z]{2,}')
    title_word2vec_model = RecipeSearchConfig.title_word2vec_model

    cleaned_string = query.strip().lower()
    tokenized_string = tokenizer.tokenize(cleaned_string)
    tokens_without_sw = [word for word in tokenized_string if not word in stop_words]
    cleaned_query = [lemmatizer.lemmatize(w) for w in tokens_without_sw]
    try:
        test_word = title_word2vec_model[cleaned_query]
    except:
        return None

    if not query or not cleaned_query:
        return None

    for i in range(len(cleaned_query)):
      similar_word = title_word2vec_model.wv.most_similar(positive=cleaned_query[i], topn=1)[0]
      if similar_word[1] > 0.85:
        cleaned_query.append(similar_word[0])
    query_vec = (sum(title_word2vec_model[cleaned_query])).reshape(1, -1)

    return query_vec


# def compute_similarity(query_vec, query):
#     final_results = []
#     random_index = random.sample(range(1, 402324), 402323)
#     a = time.time()
#     for num in range(10):
#         index = random_index[num*2500:(num+1)*2500]
#         if query == 1:
#             n = 50
#             recipes = RecipeEmbeddings.objects.filter(index__in=index).values_list('index', 'weighted_title_vec')
#         elif query == 0:
#             n = 10
#             recipes = RecipeEmbeddings.objects.filter(index__in=index).values_list('index', 'weighted_ingr_vec')
#         similarity_list = []
#         start_time = time.time()
#         for idx, title_vec in recipes:
#             if title_vec is None:
#                 similarity = 0
#             else:
#                 similarity = cosine_similarity(query_vec, np.array(ast.literal_eval(title_vec))).item()
#             similarity_list.append((idx, similarity))
#         elapsed_time = time.time() - start_time
#         print('Elapsed_time: {}'.format(time.strftime("%H:%M:%S", time.gmtime(elapsed_time))))
#         similarity_list = sorted(similarity_list, key=lambda x: x[1], reverse=True)
#         top_recipes = [recipe[0] for recipe in similarity_list if recipe[1] > 0.75 * (0.97**num)] # above threshold
#         # top_recipes = [recipe[0] for recipe in similarity_list[0:n]] # top n recipes
#         final_results.extend(top_recipes)
#         print(final_results)
#         if len(final_results) > n:
#             break
#     elapsed_time = time.time() - a
#     print('Elapsed_time: {}'.format(time.strftime("%H:%M:%S", time.gmtime(elapsed_time))))
#     return final_results, similarity_list[0:n]


def compute_similarity(query_vec, query):
    if query == 1:
        n = 50
        recipes = RecipeEmbeddings.objects.values_list('index', 'weighted_title_vec')[:5000]
    elif query == 0:
        n = 10
        recipes = RecipeEmbeddings.objects.values_list('index', 'weighted_ingr_vec')[:5000]
    similarity_list = []
    start_time = time.time()
    for idx, title_vec in recipes:
        if title_vec is None:
            similarity = 0
        else:
            similarity = cosine_similarity(query_vec, np.array(ast.literal_eval(title_vec))).item()
        similarity_list.append((idx, similarity))
    elapsed_time = time.time() - start_time
    print('Elapsed_time: {}'.format(time.strftime("%H:%M:%S", time.gmtime(elapsed_time))))
    similarity_list = sorted(similarity_list, key=lambda x: x[1], reverse=True)
    top_n_recipes = [recipe[0] for recipe in similarity_list[0:n]]
    print(similarity_list[0:50])

    return top_n_recipes, similarity_list[0:n]


def find_similar_recipes(user):
    try:
        highly_rated_recipe = RecipeRating.objects.filter(user=user, rating__gte=3).order_by('?')[0]
    except:
        return None
    recipe_rating = highly_rated_recipe.rating
    recipe_title = highly_rated_recipe.recipe.title
    recipe_idx = highly_rated_recipe.recipe.index
    recipe_embedding = ast.literal_eval(RecipeEmbeddings.objects.get(index=recipe_idx).weighted_ingr_vec)

    top_n_recipes, similarity_list = compute_similarity(recipe_embedding, 0)
    recipe_objects = RecipeDetails.objects.filter(index__in=top_n_recipes)
    recipe_det_serializer = RecipeDisplaySerializer(recipe_objects, context={'similarity': similarity_list}, many=True)
    recipe_list = recipe_det_serializer.data
    for i in range(len(recipe_list)):
        if recipe_list[i]['index'] == recipe_idx:
            print('they pop')
            a = recipe_list.pop(i)
            break

    return({
        'explanation': 'Recipes similar to :{};, which you have rated {}'.format(recipe_title, recipe_rating), 
        'recipes': recipe_list,
        'index': recipe_idx,
        'link': True
    })


def get_high_rated_recipes():
    high_rating_recipe = list(set(RecipeRating.objects.filter(rating__gte=4).values_list('recipe', flat=True)))
    recipe_objects = RecipeDetails.objects.filter(index__in=high_rating_recipe)
    recipe_det_serializer = RecipeDisplaySerializer(recipe_objects, context={'similarity': []}, many=True)
    recipe_list = []
    for recipe in recipe_det_serializer.data:
        if recipe['avg_rating'] < 4:
            pass
        else:
            recipe_list.append(recipe)
    random.shuffle(recipe_list)

    return({
        'explanation': 'Recipes Rated 4 and Above', 
        'recipes': recipe_list[0:10], 
        'index': None, 
        'link': False
    })