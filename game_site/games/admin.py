from django.contrib import admin
from .models import GameScore


# Register your models here.
@admin.register(GameScore)
class GameScoreAdmin(admin.ModelAdmin):
    list_display = ('player_name', 'score', 'game', 'created_at')
    list_filter = ('game',)
    search_fields = ('player_name',)