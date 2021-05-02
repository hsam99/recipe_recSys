from django.apps import AppConfig
from django.conf import settings
import os
import gensim
from gensim.models import Word2Vec
from gensim.models import LdaMulticore
from .models import RecipeEmbeddings
import time
import numpy as np
import ast
import json

class RecipeSearchConfig(AppConfig):
    name = 'api'

    a = time.time()

    with open(os.path.join(settings.WORD2VEC_MODEL, 'idf_dict.json'), 'r') as f:
        idf_dict = json.load(f)

    combined_word2vec_path = os.path.join(settings.WORD2VEC_MODEL, 'combine_word2vec.bin')
    lda_model_path = os.path.join(settings.LDA_MODEL, 'lda_model')
    corpus_dict_path = os.path.join(settings.LDA_MODEL, 'gensim_dict.json')
 
    # load models into separate variables
    combined_word2vec_model = Word2Vec.load(combined_word2vec_path)
    lda_model = LdaMulticore.load(lda_model_path)
    corpus_dict = gensim.corpora.dictionary.Dictionary.load(corpus_dict_path)
    
    recipes = RecipeEmbeddings.objects.values_list('index', 'combined_vec', 'topic')[0:200000]
    recipe_list = np.array([(recipe[0], np.array(ast.literal_eval(recipe[1])), recipe[2]) for recipe in recipes], dtype=object)
    print('Elapsed_time: {}'.format(time.strftime("%H:%M:%S", time.gmtime(time.time()-a))))