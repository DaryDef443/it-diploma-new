from django.db import models

# Create your models here.
class GameScore(models.Model):
    GAME_CHOICES = [
        ('memory', 'Memory Match'),
        ('quiz', 'English Quiz'),
        ('kitchen', 'Kitchen Rush'),
    ]

    player_name = models.CharField(max_length=50, verbose_name="Имя игрока", default="Гость")
    score = models.IntegerField(verbose_name="Очки")
    game = models.CharField(max_length=20, choices=GAME_CHOICES, verbose_name="Игра")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата")

    class Meta:
        ordering = ['-score']
        verbose_name = "Рекорд"
        verbose_name_plural = "Рекорды"

    def __str__(self):
        return f"{self.player_name} - {self.score} ({self.game})"