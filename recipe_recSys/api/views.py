from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import random
import ast
from nltk.tokenize import RegexpTokenizer
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .apps import RecipeSearchConfig
from .models import (RecipeDetails, RecipeEmbeddings)
from .serializers import (RecipeDetailSerializer, RecipeDisplaySerializer)

import time
from rest_framework import generics, status

class RecipeView(generics.ListAPIView):
    queryset = RecipeDetails.objects.all()
    serializer_class = RecipeDisplaySerializer

@api_view(['GET'])
def recipe_query(request, q):
    print('incoming...')
    # search_serializer = RecipeSearchSerializer(data=request.data)
    # if search_serializer.is_valid(raise_exception=True):
    #     query = search_serializer.data.get('query')
    # else:
    #     return Response('Invalid query')
    query_vec = vectorize_query(q)
    top_n_recipes = compute_similarity(query_vec)

    recipe_objects = RecipeDetails.objects.filter(index__in=top_n_recipes)
    recipe_det_serializer = RecipeDisplaySerializer(recipe_objects, many=True)
    return Response(recipe_det_serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_recipe_detail(request, idx):
    print('incoming...')
    # search_serializer = RecipeSearchSerializer(data=request.data)
    # if search_serializer.is_valid(raise_exception=True):
    #     query = search_serializer.data.get('query')
    # else:
    #     return Response('Invalid query')
    target_recipe = RecipeDetails.objects.get(index=idx)
    recipe_det_serializer = RecipeDetailSerializer(target_recipe)
    return Response(recipe_det_serializer.data, status=status.HTTP_200_OK)

def vectorize_query(query):
    stop_words = set(stopwords.words('english'))
    lemmatizer = WordNetLemmatizer()
    tokenizer = RegexpTokenizer(r'[a-zA-Z]{2,}')
    title_word2vec_model = RecipeSearchConfig.title_word2vec_model

    cleaned_string = query.strip().lower()
    tokenized_string = tokenizer.tokenize(cleaned_string)
    tokens_without_sw = [word for word in tokenized_string if not word in stop_words]
    cleaned_query = [lemmatizer.lemmatize(w) for w in tokens_without_sw]
    if not query or not cleaned_query:
        return -1

    for i in range(len(cleaned_query)):
      similar_word = title_word2vec_model.wv.most_similar(positive=cleaned_query[i], topn=1)[0]
      if similar_word[1] > 0.85:
        cleaned_query.append(similar_word[0])
    
    query_vec = (sum(title_word2vec_model[cleaned_query])).reshape(1, -1)

    return query_vec


def compute_similarity(query_vec):
    n = 20
    final_results = []
    random_index = random.sample(range(1, 402324), 402323)
    a = time.time()
    for num in range(10):
        index = random_index[num*2000:(num+1)*2000]
        recipes = RecipeEmbeddings.objects.filter(index__in=index).values_list('index', 'weighted_title_vec')
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
        top_recipes = [recipe[0] for recipe in similarity_list if recipe[1] > 0.80 * (0.97**num)] # above threshold
        # top_recipes = [recipe[0] for recipe in similarity_list[0:n]] # top n recipes
        final_results.extend(top_recipes)
        print(final_results)
        if len(final_results) > n:
            break
    elapsed_time = time.time() - a
    print('Elapsed_time: {}'.format(time.strftime("%H:%M:%S", time.gmtime(elapsed_time))))
    return final_results


# def compute_similarity(query_vec):
#     n = 20
#     recipes = RecipeEmbeddings.objects.values_list('index', 'weighted_title_vec').order_by('?')[:10000]
#     similarity_list = []
#     start_time = time.time()
#     for idx, title_vec in recipes:
#         if title_vec is None:
#             similarity = 0
#         else:
#             similarity = cosine_similarity(query_vec, np.array(ast.literal_eval(title_vec))).item()
#         similarity_list.append((idx, similarity))
#     elapsed_time = time.time() - start_time
#     print('Elapsed_time: {}'.format(time.strftime("%H:%M:%S", time.gmtime(elapsed_time))))
#     similarity_list = sorted(similarity_list, key=lambda x: x[1], reverse=True)
#     top_n_recipes = [recipe[0] for recipe in similarity_list[0:n]]
#     print(similarity_list[0:50])

#     return top_n_recipes