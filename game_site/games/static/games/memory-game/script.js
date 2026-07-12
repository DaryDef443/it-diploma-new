/**
 * @file memory-game.js
 * @description игра для развития памяти
 * @module memoryGame
 * Правила игры:
 * - Пользователь открывает карточки парами
 * - Если карточки совпадают - +10 баллов
 * - Если не совпадают - карточки переворачиваются обратно
 * - Игра заканчиваются, когда все пары угаданы
 * 
 * Зависимости:
 * - jQuery (для манипуляций с DOM)
 * - FontAwesome(для иконок, опционально)
 * 
 * Интеграции с Django:
 * - подключить в шаблоне {% static 'games/memory-game/script.js' %}
 * - CSS стили {% static 'games/memory-game/style.css' %}
 */

$(document).ready(function() {
    /**const symbols - доступные символы для карточек */
    const symbols = ['🐈', '🐟', '🐎', '🐬', '🐓', '🦆', '🦌'];

    /** @type {jQuery} gameBoard - Игровое поле (контейнер для карточек) */
    const gameBoard = $('.game-board');

    /** @type {jQuery[]} flippedCards - Массив перевёрнутых карточек (максимум 2) */
    let flippedCards = [];

    /** @type {number} score - Текущий счёт игрока */
    let score = 0;

    /** @type {boolean} canClick - Флаг блокировки кликов (анимация переворота) */
    let canClick = true;

    /**
 * Создаёт и отображает карточки на игровом поле
 * @param {string[]} symbols - Массив символов для карточек
 */

    
    
    // Создаём колоду: каждый символ встречается дважды
    const gameCards = [...symbols, ...symbols].sort(() => Math.random() - 0.5);

    // Отображаем каждую карточку на поле
    gameCards.forEach(symbol => {
        gameBoard.append(`
            <div class="card">
                <div class="card-inner">
                    <div class="card-front">${symbol}</div>
                    <div class="card-back"></div>
                </div>
            </div>
        `)
    });

   
 
    // Проверяем, можно ли кликнуть:
    // - не заблокирована ли игра (canClick)
    // - не перевёрнута ли уже карточка
    // - не открыто ли уже 2 карточки

    $('.card').click(function() {
        if (!canClick || $(this).hasClass('flipped') || flippedCards.length >= 2) return;

        $(this).addClass('flipped');
        flippedCards.push($(this));

        // Если открыто 2 карточки - проверяем совпадение
        if (flippedCards.length == 2) {
            canClick = false;
            let card1 = flippedCards[0];
            let card2 = flippedCards[1];
            let match = card1.find('.card-front').text() === card2.find('.card-front').text();

             // Даём время посмотреть на карточки перед решением
            setTimeout(() => {
                if (match) {
                     // Помечаем карточки как найденные
                    card1.add(card2).addClass('matched');
                    score += 10;
                    $('#score').text(score);
                } else {
                   //Обрабатывает несовпадение карточек
                    card1.removeClass('flipped');
                    card2.removeClass('flipped');
                }

                // Сбрасываем состояние
                flippedCards = [];
                canClick = true;

                // Проверяет условия победы (все пары найдены)
                if ($('.matched').length === gameCards.length) {
                    setTimeout(() => {
                        alert(`Congratulations! Final score: ${score}`);
                    }, 500);
                }
            }, 800);
        }
    });

/**
 * Создаёт плавающий фон с анимированными иконками
 * @param {string[]} symbols - Массив символов для фона
 * @param {number} count - Количество иконок
 */
    for (let i = 0; i < 20; i++) {
        // Выбираем случайный символ
        let randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
         // Случайное положение по горизонтали (0-100%)
        let randomLeft = Math.random() * 100;
         // Случайная задержка анимации (отрицательная для синхронизации)
        let randomDelay = -Math.random() * 10;

        $('.floating-background').append(`
            <div class="floating-symbol" style="left:${randomLeft}%; animation-delay:${randomDelay}s">
                ${randomSymbol}
            </div>
        `)
    }
});