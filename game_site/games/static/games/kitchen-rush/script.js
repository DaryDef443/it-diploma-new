// элементы DOM
const kitchenArea = document.getElementById('kitchenArea');
const plate = document.getElementById('plate');
const plateItems = document.getElementById('plateItems');
const startBtn = document.getElementById('startBtn');
const scoreElement = document.getElementById('score')
const livesElement = document.getElementById('lives')
const timmerElement = document.getElementById('timer')
const orderText = document.getElementById('orderText')
const orderIngredients = document.getElementById('orderIngredients')
const progressFill = document.getElementById('progressFill')
const customerEmoji = document.getElementById('customer')
const bgMusic = new Audio('/static/games/sounds/kitchen-bg.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.25;
const catchSound = new Audio('/static/games/sounds/catch.mp3');
const wrongSound = new Audio('/static/games/sounds/wrong.mp3');
const completeSound = new Audio('/static/games/sounds/correct-quiz.mp3');
const winSound = new Audio('/static/games/sounds/win.mp3');
catchSound.volume = 0.8;
wrongSound.volume = 0.8;
completeSound.volume = 0.5;
winSound.volume = 0.6;
// рецепты
const recipes = [
    {
        name: 'Burger',
        customer: '😊',
        text: 'I want a burger!',
        needs: ['🍞', '🥩', '🥒', '🧀']
    },

    {
        name: 'Salad',
        customer: '😀',
        text: 'I would like a salad!',
        needs: ['🍅', '🥬', '🥒']
    },

    {
        name: 'Sandwich',
        customer: '🤩',
        text: 'Can I have a sandwich?',
        needs: ['🍞', '🧀', '🍅']
    },

    {
        name: 'Omlette',
        customer: '😋',
        text: 'Omlette for me!',
        needs: ['🥚', '🧀', '🍅']
    },

    {
        name: 'Fruit Bowl',
        customer: '😇',
        text: 'You have a new fruit salad, don`t you?',
        needs: ['🍓', '🍑', '🍒']
    }
]

// все возможные ингредиенты, включая неправильные
const allIngredients = [
    '🍞', '🥩', '🥒', '🧀', '🥚', '🍅', '🥬', 
    '🍓', '🍑', '🍒', '🍇', '🍖', '🌽', '🥦'
];

// переменные игры
let score = 0;
let lives = 3;
let timeLeft = 60;
let currentRecipe = null;
let collected =[]; //уже собранные ингредиенты
let gameInterval, timerInterval, spawnInterval;
let gameSpeed = 2500; //начальная скорость падения (мс)
let isGameRunning = false;

//запуск игры
function startGame() {
    bgMusic.play();
    //сброс
    score = 0
    lives = 3
    timeLeft = recipes.length * 25; // 5 рецептов × 25 = 125 секунд
    gameSpeed = 2500
    isGameRunning = true
    usedRecipes = []

    //обновить интерфейс
    scoreElement.textContent = '0'
    livesElement.textContent = '❤️❤️❤️'
    timmerElement.textContent = timeLeft;
    progressFill.style.width = '0%'
    startBtn.disabled = true
    startBtn.textContent = 'Готовим'

    // очистить поле
    kitchenArea.innerHTML = ''
    plateItems.innerHTML = ''

    //первый заказ
    newOrder()

    //интервалы
    spawnInterval = setInterval(spawnIngredient, gameSpeed)
    timerInterval = setInterval(updateTimer, 1000)

    //ускорение игры казждые 10 сек
    gameInterval = setInterval(() => {
        if (gameSpeed > 1000) {
            gameSpeed -= 200;
            clearInterval(spawnInterval);
            spawnInterval = setInterval(spawnIngredient, gameSpeed);
        }
    }, 10000);
}

// новый звказ
function newOrder() {
    // Если все рецепты использованы — победа!
    if (usedRecipes.length >= recipes.length) {
        victoryScreen();
        return;
    }

    // Выбрать случайный рецепт из ещё не использованных
    const availableRecipes = recipes.filter((_, index) => !usedRecipes.includes(index));
    const randomIndex = Math.floor(Math.random() * availableRecipes.length);
    const recipe = availableRecipes[randomIndex];
    
    // Найти оригинальный индекс рецепта
    currentRecipe = recipe;
    collected = [];

    // Добавить индекс в использованные
    const originalIndex = recipes.indexOf(recipe);
    usedRecipes.push(originalIndex);

    // обновить интерфейс заказа
    orderText.textContent = `"${currentRecipe.text}"`;
    customerEmoji.textContent = currentRecipe.customer;

    // показать нужные ингредиенты
    orderIngredients.innerHTML = currentRecipe.needs.map(item =>
        `<span class="need-item">${item}</span>`
    ).join('');

    plateItems.innerHTML = '';
    progressFill.style.width = '0%';
}

// появление ингредиентов
function spawnIngredient(){
    if(!isGameRunning || !currentRecipe) return;

    const ingredient = document.createElement('div')
    ingredient.className = 'ingredient'
    // 30% шанс, что выпадет нужный ингредиент
    if (Math.random() < 0.3 && currentRecipe) {
        // Выбрать ингредиент, который ещё не собран
        const missing = currentRecipe.needs.filter(item => !collected.includes(item));
        if (missing.length > 0) {
            ingredient.textContent = missing[Math.floor(Math.random() * missing.length)];
        } else {
            ingredient.textContent = allIngredients[Math.floor(Math.random() * allIngredients.length)];
        }
    } else {
        ingredient.textContent = allIngredients[Math.floor(Math.random() * allIngredients.length)];
    }

    ingredient.style.left = Math.random() * 540 + 'px';
    ingredient.style.animationDuration = (gameSpeed / 1000 * 3) + 's';

    // drag and drop
    ingredient.draggable = true;
    ingredient.addEventListener('dragstart', function(e) {
        e.dataTransfer.setData('text/plain', ingredient.textContent);
        ingredient.classList.add('dragging');
    });
    ingredient.addEventListener('dragend', function() {
        ingredient.classList.remove('dragging');
    });

    // клик (альтернатива drag & drop)
    ingredient.addEventListener('click', function() {
        if (!ingredient.classList.contains('caught')) {
            catchIngredient(ingredient);
        }
    });

    // когда анимация падения закончилась
    ingredient.addEventListener('animationend', function() {
        if (!ingredient.classList.contains('caught') && ingredient.parentNode) {
            ingredient.remove();
        }
    });

    kitchenArea.appendChild(ingredient);
}

// тарелка drag & drop
plate.addEventListener('dragover', function(e) {
    e.preventDefault()
    plate.style.transform = 'scale(1.1)'
});

plate.addEventListener('dragleave', function() {
    plate.style.transform = 'scale(1)'
});

plate.addEventListener('drop', function(e) {
    e.preventDefault()
    plate.style.transform = 'scale(1)'
    const emoji = e.dataTransfer.getData('text/plain')

    //найти перетаскиваемый элемент
    const dragged = document.querySelector('.ingredient.dragging')
    if (dragged) {
        processIngredient(emoji, dragged)
    }
});

//обработка ингредиента
function catchIngredient(element){
    const emoji = element.textContent
    processIngredient(emoji, element)
}

function processIngredient(emoji, element) {
    if(!currentRecipe) return;

    //проверка правильный ли элемент
    if(currentRecipe.needs.includes(emoji) && !collected.includes(emoji)) {
        catchSound.play();
        //если ингредиент правильный
        collected.push(emoji)
        score += 20
        scoreElement.textContent = score

        //анимация "поймано"
        element.classList.add('caught')
        setTimeout(()=> {
            if(element.parentNode) element.remove()
        }, 500)

        // обновить прогресс-бар
        const progress = (collected.length / currentRecipe.needs.length) * 100
        progressFill.style.width = progress + '%'

        //отметить в списке заказов
        const needItems = orderIngredients.querySelectorAll('.need-item')
        let found = false
        needItems.forEach(item =>{
            if(item.textContent === emoji && !item.classList.contains('done') && !found) {
                item.classList.add('done')
                found = true
            }
        });

        //обновить тарелку
        plateItems.textContent = collected.join('')

        // проверить все ли собрано
        if(collected.length === currentRecipe.needs.length) {
            completeSound.play();
            score += 50
            scoreElement.textContent = score
            //эффект успеха
            plate.style.background = '#c8e6c9'
            setTimeout(()=> {
                plate.style.background = '#fff'
                newOrder()
            }, 1500);
        }
    } else if (currentRecipe.needs.includes(emoji) && collected.includes(emoji)) {
        //уже собрали этот ингредиент
        element.style.opacity = '0.5'
        setTimeout(()=> {
            if(element.parentNode) element.remove()
        }, 300);
    } else {
        wrongSound.play();
        //неправильный ингредиент
        lives--;
        updateLives();

        //анимация ошибки
        element.style.color = '#ff0000'
        element.style.transform = 'scale(0.5)'
        setTimeout(()=> {
            if (element.parentNode) element.remove()
    }, 300);

        //тряска тарелки
        plate.style.animation = 'shake 0.5 ease'
        setTimeout(()=> {
            plate.style.animation = ''
        }, 500);

        if(lives <= 0) gameOver()
    }
}

//часть с жизнями
function updateLives() {
    livesElement.textContent = '❤️'.repeat(lives) + '🖤'.repeat(3 - lives)
}

//таймер
function updateTimer() {
    timeLeft--;
    timmerElement.textContent = timeLeft

    if (timeLeft <= 10) {
        timmerElement.style.color = '#ff0000'
    }

    if (timeLeft <= 0) {
        gameOver()
    }
}

// конец игры
function gameOver() {
    bgMusic.pause();
    bgMusic.currentTime = 0;
    isGameRunning = false

    clearInterval(spawnInterval)
    clearInterval(timerInterval)
    clearInterval(gameInterval)

    startBtn.disabled = false
    startBtn.textContent = 'Играть снова'

    // показать результат
    orderText.textContent = 'Смена окончена'
    customerEmoji.textContent = score >= 200 ? '🎉' : '😢';

    // очистить поле
    setTimeout(()=> {
        document.querySelectorAll('.ingredient').forEach(el => el.remove())
    }, 1000)

    timmerElement.style.color = '#333'
}

// shake анимация
const shakeStyle = document.createElement('style')
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25%% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(shakeStyle)

//кнопка "старт"
startBtn.addEventListener('click', startGame)
// экран победы
function victoryScreen() {
    winSound.play();
    bgMusic.pause();
    bgMusic.currentTime = 0;
    winSound.play();
    isGameRunning = false;

    clearInterval(spawnInterval);
    clearInterval(timerInterval);
    clearInterval(gameInterval);

    startBtn.disabled = false;
    startBtn.textContent = 'Играть снова';

    // Показать победный текст
    orderText.textContent = 'Все заказы выполнены!';
    customerEmoji.textContent = '🏆';
    orderIngredients.innerHTML = '';

    // Очистить поле
    setTimeout(() => {
        document.querySelectorAll('.ingredient').forEach(el => el.remove());
    }, 1000);

    // Показать финальный счёт
    plateItems.textContent = '⭐';
    plate.style.background = '#ffd700';
    setTimeout(() => {
        plate.style.background = '#f5deb3';
        plateItems.textContent = '';
    }, 2000);

    timmerElement.style.color = '#ffd700';
    timmerElement.textContent = 'WIN!';
}