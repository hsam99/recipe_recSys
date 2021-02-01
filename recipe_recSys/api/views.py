from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import ast
from nltk.tokenize import RegexpTokenizer
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .apps import RecipeSearchConfig
from .models import (RecipeDetails, RecipeEmbeddings)
from .serializers import (RecipeSearchSerializer, RecipeDetailsSerializer)

import time
from rest_framework import generics, status

class RecipeView(generics.ListAPIView):
    queryset = RecipeDetails.objects.all()
    serializer_class = RecipeDetailsSerializer

@api_view(['POST'])
def recipe_query(request):
    search_serializer = RecipeSearchSerializer(data=request.data)
    if search_serializer.is_valid(raise_exception=True):
        query = search_serializer.data.get('query')
    else:
        return Response('Invalid query')
    query_vec = vectorize_query(query)
    top_n_recipes = compute_similarity(query_vec)

    recipe_objects = RecipeDetails.objects.filter(id__in=top_n_recipes)
    recipe_det_serializer = RecipeDetailsSerializer(recipe_objects, many=True)
    return Response(recipe_det_serializer.data, status=status.HTTP_200_OK)


def vectorize_query(query):
    stop_words = set(stopwords.words('english'))
    lemmatizer = WordNetLemmatizer()
    tokenizer = RegexpTokenizer(r'[a-zA-Z]{2,}')

    cleaned_string = query.strip().lower()
    tokenized_string = tokenizer.tokenize(cleaned_string)
    tokens_without_sw = [word for word in tokenized_string if not word in stop_words]
    cleaned_query = [lemmatizer.lemmatize(w) for w in tokens_without_sw]
    if not query or not cleaned_query:
        return -1

    title_word2vec_model = RecipeSearchConfig.title_word2vec_model
    query_vec = (sum(title_word2vec_model[cleaned_query])/len(cleaned_query)).reshape(1, -1)

    return query_vec


def compute_similarity(query_vec):
    n = 20
    recipes = RecipeEmbeddings.objects.values_list('id', 'title_vec').order_by('?')[:100]
    similarity_list = []
    start_time = time.time()
    for id, title_vec in recipes:
        if title_vec is None:
            similarity = 0
        else:
            similarity = cosine_similarity(query_vec, np.array(ast.literal_eval(title_vec))).item()
        similarity_list.append((id, similarity))
    elapsed_time = time.time() - start_time
    print('Elapsed_time: {}'.format(time.strftime("%H:%M:%S", time.gmtime(elapsed_time))))
    similarity_list = sorted(similarity_list, key=lambda x: x[1], reverse=True)
    top_n_recipes = [recipe[0] for recipe in similarity_list[0:n]]

    return top_n_recipes
