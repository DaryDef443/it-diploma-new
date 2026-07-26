// получаем все необходимые элементы
const start_btn = document.querySelector(".start_btn button");
const info_box = document.querySelector(".info_box");
const exit_btn = info_box.querySelector(".buttons .quit");
const continue_btn = info_box.querySelector(".buttons .restart");
const quiz_box = document.querySelector(".quiz_box");
const timeCount = document.querySelector(".quiz_box .timer .timer_sec")
const timeLine = document.querySelector(".quiz_box header .time_line")
const timeOff = document.querySelector(".quiz_box header .time_text")
const option_list = document.querySelector(".option_list");
const bgMusic = document.getElementById('bgMusic');
const correctSound = document.getElementById('correctSound');
const wrongSound = document.getElementById('wrongSound');
if (correctSound) correctSound.volume = 0.5;
if (wrongSound) wrongSound.volume = 0.5;
if (bgMusic) {
    bgMusic.volume = 0.3;
}

// нажать на старт
start_btn.onclick = () =>{
    info_box.classList.add("activeInfo"); //показать info_box
}

// нажать на выход
exit_btn.onclick = () =>{
    info_box.classList.remove("activeInfo"); //скрыть info_box
}

// нажать на продолжить
continue_btn.onclick = () =>{
    if (bgMusic) bgMusic.play();
    info_box.classList.remove("activeInfo");
    quiz_box.classList.add("activeQuiz");
    showQuestions(0);
    queCounter(1);
    startTimer(15);
    startTimerLine(0)
}

let que_count = 0;
let que_numb = 1;
let counter;
let counterLine;
let timeValue = 15;
let widthValue = 0
let userScore = 0 

const next_btn = quiz_box.querySelector(".next_btn")
const result_box = document.querySelector(".result_box")
const restart_quiz = result_box.querySelector(".buttons .restart")
const quit_quiz = result_box.querySelector(".buttons .quit")

restart_quiz.onclick = () => {
    if (bgMusic) bgMusic.play();
    quiz_box.classList.add("activeQuiz")
    result_box.classList.remove("activeResult")
    let que_count = 0;
    let que_numb = 1;
    let timeValue = 15;
    let widthValue = 0
    let userScore = 0 
    showQuestions(que_count);
    queCounter(que_numb);
    clearInterval(counter);
    startTimer(timeValue);
    clearInterval(counterLine);
    startTimerLine(widthValue);
    next_btn.style.display = "none";
    timeOff.textContent = "Time left"
}

quit_quiz.onclick = () => {
    window.location.reload()
}
// нажимаем на продолжить
next_btn.onclick = ()=>{
    if (que_count < questions.length - 1) {
        que_count++;
        que_numb++;
        showQuestions(que_count);
        queCounter(que_numb);
        clearInterval(counter);
        startTimer(timeValue);
        clearInterval(counterLine);
        startTimerLine(widthValue);
        next_btn.style.display = "none";
        timeOff.textContent = "Time left"
    }else{
        clearInterval(counter);
        clearInterval(counterLine);
        console.log("Вопросы пройдены")
        showResultBox();
    }
}

// получаем вопросы и ответы
function showQuestions(index){
    const que_text = document.querySelector(".que_text");
    let que_tag = '<span>'+ questions[index].numb + "." + questions[index].question + '</span>';
    let option_tag = '<div class="option">' + questions[index].options[0] + '<span></span></div>'
                        + '<div class="option">' + questions[index].options[1] + '<span></span></div>'
                        + '<div class="option">' + questions[index].options[2] + '<span></span></div>'
                        + '<div class="option">' + questions[index].options[3] + '<span></span></div>';
    que_text.innerHTML = que_tag;
    option_list.innerHTML = option_tag;
    const option = option_list.querySelectorAll(".option");
    for (let i = 0; i < option.length; i++) {
        option[i].setAttribute("onclick", "optionSelected(this)")
        
    }
}

let tickIcon = '<div class="icon tick"><i class="fas fa-check"></i></div>';
let crossIcon = '<div class="icon cross"><i class="fas fa-times"></i></div>';

function optionSelected(answer){
    clearInterval(counter);
    clearInterval(counterLine);
    let userAns = answer.textContent;
    let correctAns = questions[que_count].answer;
    let allOptions = option_list.children.length;
    if(userAns == correctAns){
        userScore += 1;
        if (correctSound) correctSound.play();
        console.log(userScore)
        answer.classList.add("correct")
        console.log("Правильный ответ")
        answer.insertAdjacentHTML("beforeend", tickIcon)
    }else{
        if (wrongSound) wrongSound.play();
        answer.classList.add("incorrect")
        console.log("Неверный ответ")
        answer.insertAdjacentHTML("beforeend", crossIcon)

        // если выбран неправильный ответ - автоматически выбирается новый
        for (let i = 0; i < allOptions; i++) {
            if (option_list.children[i].textContent == correctAns){
                option_list.children[i].setAttribute("class", "option correct")
                option_list.children[i].insertAdjacentHTML("beforeend", tickIcon)
            }
    }}
    
    //once user selected disabled all options
    for (let i = 0; i < allOptions; i++) {
        option_list.children[i].classList.add("disabled")
        
    }
    next_btn.style.display = "block";
}

function showResultBox(){
    if (bgMusic) {
        bgMusic.pause();
        bgMusic.currentTime = 0;
    }
    info_box.classList.remove("activeInfo");
    quiz_box.classList.remove("activeQuiz");
    result_box.classList.add("activeResult");
    const scoreText = result_box.querySelector(".score_text")
    if(userScore > 3){
        let scoreTag = '<span style="display:flex; justify-content:center; align-items:center; width:100%; padding: 0 20px;">Поздравляю! Ты получил <p>' + userScore + '</p> из <p>' + questions.length + '</p></span>';
        scoreText.innerHTML = scoreTag;
    }
    else if(userScore > 1){
        let scoreTag = '<span style="display:flex; justify-content:center; align-items:center; width:100%; padding: 0 20px;">Неплохо! Ты получил <p>' + userScore + '</p> из <p>' + questions.length + '</p></span>';
        scoreText.innerHTML = scoreTag;
    }
    else{
        let scoreTag = '<span style="display:flex; justify-content:center; align-items:center; width:100%; padding: 0 20px;">К сожалению, ты получил только <p>' + userScore + '</p> из <p>' + questions.length + '</p></span>';
        scoreText.innerHTML = scoreTag;
    }
}

function startTimer(time){
    counter = setInterval(timer, 1000);
    function timer(){
        timeCount.textContent = time;
        time--;
        if(time < 9){
            let addZero = timeCount.textContent
            timeCount.textContent = "0" + addZero
        }
        if (time < 0){
            clearInterval(counter);
            timeCount.textContent = "00";
            timeOff.textContent = "Time Off"

            let correctAns = questions[que_count].answer;
            let allOptions = option_list.children.length;

            for (let i = 0; i < allOptions; i++) {
            if (option_list.children[i].textContent == correctAns){
                option_list.children[i].setAttribute("class", "option correct")
                option_list.children[i].insertAdjacentHTML("beforeend", tickIcon)
            }
    }
            for (let i = 0; i < allOptions; i++) {
            option_list.children[i].classList.add("disabled")
        
            }
            next_btn.style.display = "block";
        }
    }
}

function startTimerLine(time){
    counterLine = setInterval(timer, 29);
    function timer(){
        time += 1
        timeLine.style.width = time + "px"
        if (time > 549){
            clearInterval(counterLine);
        }
    }
}





function queCounter(index){
    const bottom_ques_counter = quiz_box.querySelector(".total_que");
    let totalQueCounterTag = '<span><p>' + index + '</p>из<p>' + questions.length + '</p>Вопросов</span>';
    bottom_ques_counter.innerHTML = totalQueCounterTag;
}