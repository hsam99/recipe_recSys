from django.apps import AppConfig
from django.conf import settings
import os
import gensim
from gensim.models import Word2Vec
from gensim.models import LdaMulticore


class RecipeSearchConfig(AppConfig):
    name = 'api'

    # create path to models
    title_word2vec_path = os.path.join(settings.WORD2VEC_MODEL, 'title_word2vec_model.bin')
    ingr_word2vec_path = os.path.join(settings.WORD2VEC_MODEL, 'ingr_word2vec_model.bin')
    lda_model_path = os.path.join(settings.LDA_MODEL, 'lda_model')
    corpus_dict_path = os.path.join(settings.LDA_MODEL, 'gensim_dict.json')
 
    # load models into separate variables
    # these will be accessible via this class
    title_word2vec_model = Word2Vec.load(title_word2vec_path)
    ingr_word2vec_model = Word2Vec.load(ingr_word2vec_path)
    lda_model = LdaMulticore.load(lda_model_path)
    corpus_dict = gensim.corpora.dictionary.Dictionary.load(corpus_dict_path)
