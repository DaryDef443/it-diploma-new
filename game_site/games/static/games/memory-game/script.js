
$(document).ready(function() {
    const pairs = [
        { en: 'dog', ru: 'sobaka' },
        { en: 'cat', ru: 'koshka' },
        { en: 'sun', ru: 'solnce' },
        { en: 'house', ru: 'dom' },
        { en: 'book', ru: 'kniga' },
        { en: 'fish', ru: 'riba' },
        { en: 'bird', ru: 'ptica' }
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
                    card1.add(card2).addClass('matched');
                    score += 10;
                    $('#score').text(score);
                } else {
                    card1.removeClass('flipped');
                    card2.removeClass('flipped');
                }

                flippedCards = [];
                canClick = true;

                if ($('.matched').length === gameCards.length) {
                    setTimeout(function() {
                        alert('Win! Score: ' + score);
                    }, 500);
                }
            }, 800);
        }
    });
});