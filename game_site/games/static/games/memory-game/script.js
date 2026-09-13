const clickSound = new Audio('/static/games/sounds/click.mp3');
const matchSound = new Audio('/static/games/sounds/correct.mp3');
const winSound = new Audio('/static/games/sounds/win.mp3');
const wrongSound = new Audio('/static/games/sounds/incorrect.mp3');
$(document).ready(function() {
    const pairs = [
        { en: 'dog', ru: 'собака' },
        { en: 'cat', ru: 'кошка' },
        { en: 'sun', ru: 'солнце' },
        { en: 'house', ru: 'дом' },
        { en: 'book', ru: 'книга' },
        { en: 'fish', ru: 'рыба' },
        { en: 'bird', ru: 'птица' },
        { en: 'deer', ru: 'олень'}
    ];

    const gameBoard = $('.game-board');
    let flippedCards = [];
    let score = 0;
    let canClick = true;

    let gameCards = [];
    pairs.forEach(pair => {
        gameCards.push({ text: pair.en, pairId: pair.en });
        gameCards.push({ text: pair.ru, pairId: pair.en });
    });

    gameCards.sort(() => Math.random() - 0.5);

    gameCards.forEach(card => {
        gameBoard.append(
            '<div class=\"card\" data-pair=\"' + card.pairId + '\">' +
                '<div class=\"card-inner\">' +
                    '<div class=\"card-front\">' + card.text + '</div>' +
                    '<div class=\"card-back\">?</div>' +
                '</div>' +
            '</div>'
        );
    });

    $('.card').click(function() {
        clickSound.play();
        if (!canClick || $(this).hasClass('flipped') || flippedCards.length >= 2) return;

        $(this).addClass('flipped');
        flippedCards.push($(this));

        if (flippedCards.length == 2) {
            canClick = false;
            let card1 = flippedCards[0];
            let card2 = flippedCards[1];
            let match = card1.data('pair') === card2.data('pair');

            setTimeout(function() {
                if (match) {
                    matchSound.play();
                    card1.add(card2).addClass('matched');
                    score += 10;
                    $('#score').text(score);
                } else {
                    wrongSound.play();
                    card1.removeClass('flipped');
                    card2.removeClass('flipped');
                }

                flippedCards = [];
                canClick = true;

                if ($('.matched').length === gameCards.length) {
                    setTimeout(() => {
                        alert('Поздравляю! Твой счёт: ' + parseInt($('#score').text()));
                        saveMemoryScore();
                    }, 500);
                }
            }, 800);
        }
    });

    $(document).on('click', '#restartBtn', function() {
    location.reload();
});
function saveMemoryScore() {
    fetch('/api/save-score/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            score: parseInt($('#score').text()) || 0,
            game: 'memory',
            player_name: 'Гость'
         })
    })
    .then(function(r) { return r.json(); })
    .then(function(data) { console.log('Рекорд сохранён:', data); })
    .catch(function(err) { console.error('Ошибка:', err); });
}
});
