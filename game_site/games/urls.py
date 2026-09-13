from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('memory-game/', views.memory_game, name='memory_game'),
    path('quiz/', views.quiz, name='quiz'),
    path('kitchen-rush/', views.kitchen_rush, name='kitchen_rush'),
    path('api/save-score/', views.save_score, name='save_score'),
    path('api/get-scores/', views.get_scores, name='get_scores'),
    path('scores/', views.scores_page, name='scores'),
]