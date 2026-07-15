from django.test import TestCase, Client
from django.urls import reverse

# Create your tests here.
class GamePagesTests(TestCase):
    """Тесты для проверки доступности страниц игр"""
    def setUp(self):
        """Создание тестового клиента перед каждым новым тестом"""
        self.client = Client()

    def test_index_page(self):
        """Проверка главной страницы"""
        response = self.client.get(reverse('index'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'games/index.html')
        self.assertContains(response, 'Игровой портал')
    
    def test_memory_game_page(self):
        """Проверка страницы Memory Match"""
        response = self.client.get(reverse('memory_game'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'games/memory-game.html')
        self.assertContains(response, 'Memory match')
    
    def test_quiz_page(self):
        """Проверка страницы Quiz"""
        response = self.client.get(reverse('quiz'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'games/quiz.html')
        self.assertContains(response, 'Начать Quiz')
    
    def test_kitchen_rush_page(self):
        """Проверка страницы kitchen rush"""
        response = self.client.get(reverse('kitchen_rush'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'games/kitchen-rush.html')
        self.assertContains(response, 'Старт')
    
    def test_all_static_pages_loaded(self):
        """Проверка загрузки статических файлов"""
        pages = [
            ('index', 'lobby.css'),
            ('memory_game', 'games/memory-game/style.css'), 
            ('quiz', 'games/quiz/style.css'), 
            ('kitchen_rush', 'games/kitchen-rush/style.css')
        ]
        for url_name, css_path in pages:
            response = self.client.get(reverse(url_name))
            self.assertEqual(response.status_code, 200)
    
    def test_404_page(self):
        """Проверка несущетсвующей страницы"""
        response = self.client.get('/non-existent-page/')
        self.assertEqual(response.status_code, 404)

class UrlsTests(TestCase):
    """Тесты для проверки маршрутов"""
    def setUp(self):
        self.client = Client()
    
    def test_urls_exist(self):
        """Все маршруты доступны"""
        urls = [
            '/',
            '/memory-game/',
            '/quiz/',
            '/kitchen-rush/'
        ]
        for url in urls:
            response = self.client.get(url)
            self.assertEqual(
                response.status_code, 200,
                f'Страница {url} недоступна, код {response.status_code}'
            )
    
    def test_url_names(self):
        """Проверка имён маршрутов"""
        self.assertEqual(reverse('index'), '/')
        self.assertEqual(reverse('memory_game'), '/memory-game/')
        self.assertEqual(reverse('quiz'), '/quiz/')
        self.assertEqual(reverse('kitchen_rush'), '/kitchen-rush/')