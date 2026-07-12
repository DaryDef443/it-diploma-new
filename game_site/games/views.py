from django.shortcuts import render

# Create your views here.
def index(request):
    return render(request, 'games/index.html')

def memory_game(request):
    return render(request, 'games/memory-game.html')

def quiz(request):
    return render(request, 'games/quiz.html')

def kitchen_rush(request):
    return render(request, 'games/kitchen-rush.html')