let gameSeq = [];
let userSeq = [];
let btns = ["yellow", "red", "green", "blue"];
let started = false;
let level = 0;
let h2 = document.querySelector("h2");
let count=1;
document.addEventListener("keypress", function () {
    if (!started) {
        started = true;
        levelup();
    }
});

function gameFlash(btn) {
    btn.classList.add("flash");
    setTimeout(function () {
        btn.classList.remove("flash");
    }, 250);
}

function userFlash(btn) {
    btn.classList.add("userflash");
    setTimeout(function () {
        btn.classList.remove("userflash");
    }, 250);
}

//function for level up 

function levelup() {
    userSeq = [];
    level++;
    h2.innerText = `Level ${level}`;
    let randIdx = Math.floor(Math.random() * 4);
    let randColor = btns[randIdx];
    let randbtn = document.querySelector(`.${randColor}`);
    gameSeq.push(randColor);
    gameFlash(randbtn);
}

//function to match the order 

function checkAns(idx) {
    if (userSeq[idx] === gameSeq[idx]) {
        if (userSeq.length === gameSeq.length) {
            setTimeout(levelup, 1000);
        }
    } else {
        showPopup(level);
        document.querySelector("body").style.backgroundColor = "red";
        setTimeout(function () {
            document.querySelector("body").style.backgroundColor = "black";
        }, 150);
        highscore(level)
        reset();
    }
}

//function for score popup after end of game

function showPopup(score) {
    const popup = document.getElementById('popup');
    const scoreDisplay = document.getElementById('score');
    scoreDisplay.innerText = score;
    popup.style.display = 'flex';
}

function closePopup() {
    const popup = document.getElementById('popup');
    popup.style.display = 'none';
    reset();
}

function reset() {
    started = false;
    userSeq = [];
    gameSeq = [];
    level = 0;
    h2.innerText = "Press any key to start";
}

//function for button : whenever user presses any button green color is flashed incase of correct match
function btnPress() {
    let btn = this;
    userFlash(btn);
    let usercolor = btn.getAttribute("id");
    userSeq.push(usercolor);
    checkAns(userSeq.length - 1);
}

let allbtns = document.querySelectorAll(".btn");
allbtns.forEach(btn => {
    btn.addEventListener("click", btnPress);
});


function highscore(level) {
    let highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    let score = level * 15;
    
    highScores.push({ level: level, score: score });
    highScores.sort((a, b) => b.score - a.score);
    highScores = highScores.slice(0, 5);

    localStorage.setItem('highScores', JSON.stringify(highScores));
    updateHighScoresTable(highScores);
}

function updateHighScoresTable(highScores) {
    const tableBody = document.getElementById('highscore-table');
    const rows = tableBody.getElementsByTagName('tr');

    highScores.forEach((highScore, index) => {
        if (rows[index]) {
            rows[index].children[1].innerText = highScore.level;
            rows[index].children[2].innerText = highScore.score;
        }
    });

    // Clear any remaining rows if less than 5 scores
    for (let i = highScores.length; i < rows.length; i++) {
        rows[i].children[1].innerText = '';
        rows[i].children[2].innerText = '';
    }
}

function populateHighScores() {
    let highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    updateHighScoresTable(highScores);
}

// Call populateHighScores function if the element exists (i.e., on the second page)
if (document.getElementById('highscore-table')) {
    populateHighScores();
}