from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('memory-game/', views.memory_game, name='memory_game'),
    path('quiz/', views.quiz, name='quiz'),
    path('kitchen-rush/', views.kitchen_rush, name='kitchen_rush'),
]