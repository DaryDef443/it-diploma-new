from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import GameScore
import json

def index(request):
    return render(request, 'games/index.html')

def memory_game(request):
    return render(request, 'games/memory-game.html')

def quiz(request):
    return render(request, 'games/quiz.html')

def kitchen_rush(request):
    return render(request, 'games/kitchen-rush.html')

@csrf_exempt
def save_score(request):
    """API для сохранения рекорда"""
    if request.method == 'POST':
        data = json.loads(request.body)
        score = data.get('score', 0)
        game = data.get('game', 'memory')
        player_name = data.get('player_name', 'Гость')
        
        GameScore.objects.create(
            player_name=player_name,
            score=score,
            game=game
        )
        
        return JsonResponse({'status': 'ok', 'message': 'Рекорд сохранён'})
    
    return JsonResponse({'status': 'error', 'message': 'Метод не поддерживается'})

def get_scores(request):
    """API для получения рекордов"""
    game = request.GET.get('game', 'memory')
    scores = GameScore.objects.filter(game=game)[:10]
    scores_list = [
        {
            'player_name': s.player_name,
            'score': s.score,
            'date': s.created_at.strftime('%d.%m.%Y')
        }
        for s in scores
    ]
    return JsonResponse({'scores': scores_list})

def scores_page(request):
    """Страница с рекордами из базы данных"""
    scores = GameScore.objects.all()[:20]
    return render(request, 'games/scores.html', {'scores': scores})