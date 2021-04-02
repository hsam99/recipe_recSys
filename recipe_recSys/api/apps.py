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

class RecipeSearchConfig(AppConfig):
    name = 'api'

    a = time.time()
    # create path to models
    title_word2vec_path = os.path.join(settings.WORD2VEC_MODEL, 'title_word2vec_model.bin')
    ingr_word2vec_path = os.path.join(settings.WORD2VEC_MODEL, 'ingr_word2vec_model.bin')
    combined_word2vec_path = os.path.join(settings.WORD2VEC_MODEL, 'combine_word2vec.bin')
    lda_model_path = os.path.join(settings.LDA_MODEL, 'lda_model')
    corpus_dict_path = os.path.join(settings.LDA_MODEL, 'gensim_dict.json')
 
    # load models into separate variables
    # these will be accessible via this class
    title_word2vec_model = Word2Vec.load(title_word2vec_path)
    ingr_word2vec_model = Word2Vec.load(ingr_word2vec_path)
    combined_word2vec_model = Word2Vec.load(combined_word2vec_path)
    lda_model = LdaMulticore.load(lda_model_path)
    corpus_dict = gensim.corpora.dictionary.Dictionary.load(corpus_dict_path)
    recipes = RecipeEmbeddings.objects.values_list('index', 'combined_vec', 'topic')[0:200000]
    recipe_list = np.array([(recipe[0], np.array(ast.literal_eval(recipe[1])), recipe[2]) for recipe in recipes], dtype=object)
    print('Elapsed_time: {}'.format(time.strftime("%H:%M:%S", time.gmtime(time.time()-a))))