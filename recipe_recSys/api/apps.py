from django.apps import AppConfig
from django.conf import settings
import os
from gensim.models import Word2Vec


class RecipeSearchConfig(AppConfig):
    name = 'api'

    # create path to models
    title_word2vec_path = os.path.join(settings.WORD2VEC_MODEL, 'title_word2vec_model.bin')
    ingr_word2vec_path = os.path.join(settings.WORD2VEC_MODEL, 'ingr_word2vec_model.bin')
 
    # load models into separate variables
    # these will be accessible via this class
    title_word2vec_model = Word2Vec.load(title_word2vec_path)
    ingr_word2vec_model = Word2Vec.load(ingr_word2vec_path)
