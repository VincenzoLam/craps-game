let betOn6TimerStart, betOn6Attempts = 0, betOn6Correct = 0, betOn6Streak = 0, betOn6HighestStreak = 0;
let hornBetTimerStart, hornBetAttempts = 0, hornBetCorrect = 0, hornBetStreak = 0, hornBetHighestStreak = 0;
let betAmount, correctPayout, hornBetAmount, hornCorrectPayout, diceValues;
let activeInput = null;

function openTab(evt, tabName) {
    let tabContents = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].style.display = "none";
    }

    let tabButtons = document.getElementsByClassName("tab-button");
    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].className = tabButtons[i].className.replace(" active", "");
    }

    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";

    if (tabName === 'BetOn6') {
        generateNewBet();
        activeInput = document.getElementById('betOn6Payout');
    } else if (tabName === 'HornBet') {
        generateNewHornBet();
        activeInput = document.getElementById('hornBetPayout');
    }
}

function startTimer(timerType) {
    if (timerType === "betOn6") {
        betOn6TimerStart = new Date();
    } else if (timerType === "hornBet") {
        hornBetTimerStart = new Date();
    }
}

function stopTimer(timerType) {
    let elapsedTime = (new Date() - (timerType === "betOn6" ? betOn6TimerStart : hornBetTimerStart)) / 1000;
    if (timerType === "betOn6") {
        document.getElementById('betOn6Timer').innerText = `Time: ${elapsedTime.toFixed(2)} sec`;
    } else if (timerType === "hornBet") {
        document.getElementById('hornBetTimer').innerText = `Time: ${elapsedTime.toFixed(2)} sec`;
    }
}

function updateAccuracy(section) {
    if (section === "betOn6") {
        let accuracy = (betOn6Correct / betOn6Attempts) * 100;
        document.getElementById('betOn6Accuracy').innerText = `Accuracy: ${accuracy.toFixed(2)}%`;
        document.getElementById('betOn6Streak').innerText = `Highest Streak: ${betOn6HighestStreak}`;
    } else if (section === "hornBet") {
        let accuracy = (hornBetCorrect / hornBetAttempts) * 100;
        document.getElementById('hornBetAccuracy').innerText = `Accuracy: ${accuracy.toFixed(2)}%`;
        document.getElementById('hornBetStreak').innerText = `Highest Streak: ${hornBetHighestStreak}`;
    }
}

function generateNewBet() {
    startTimer("betOn6");
    betAmount = Math.floor(Math.random() * 20 + 1) * 6;
    correctPayout = betAmount * 7 / 6;
    document.getElementById('betOn6BetAmount').innerText = `Bet Amount: $${betAmount}`;
    drawChips(betAmount, 'betOn6ChipsCanvas');
    document.getElementById('betOn6Payout').value = '';
}

function checkBetOn6Payout() {
    stopTimer("betOn6");
    betOn6Attempts++;
    let userPayout = parseFloat(document.getElementById('betOn6Payout').value);
    if (Math.abs(userPayout - correctPayout) < 0.01) {
        betOn6Correct++;
        betOn6Streak++;
        if (betOn6Streak > betOn6HighestStreak) {
            betOn6HighestStreak = betOn6Streak;
        }
        document.getElementById('betOn6Feedback').innerText = "Correct!";
        document.getElementById('betOn6Feedback').style.color = "green";
        document.getElementById('betOn6CorrectPayout').innerText = '';
    } else {
        betOn6Streak = 0;
        document.getElementById('betOn6Feedback').innerText = "Incorrect";
        document.getElementById('betOn6Feedback').style.color = "red";
        document.getElementById('betOn6CorrectPayout').innerHTML = `Correct payout is <b>$${correctPayout.toFixed(2)}</b>. Units/Cap: ${betAmount / 6}`;
    }
    updateAccuracy("betOn6");
    generateNewBet();
}

function generateNewHornBet() {
    startTimer("hornBet");
    hornBetAmount = Math.floor(Math.random() * 25 + 1) * 4;
    diceValues = rollDice();
    hornCorrectPayout = calculateHornPayout(hornBetAmount, diceValues);
    document.getElementById('hornBetAmount').innerText = `Horn Bet Amount: $${hornBetAmount}`;
    drawDice(diceValues, 'hornBetDiceCanvas');
    document.getElementById('hornBetPayout').value = '';
}

function checkHornPayout() {
    stopTimer("hornBet");
    hornBetAttempts++;
    let userPayout = parseFloat(document.getElementById('hornBetPayout').value);
    if (Math.abs(userPayout - hornCorrectPayout) < 0.01) {
        hornBetCorrect++;
        hornBetStreak++;
        if (hornBetStreak > hornBetHighestStreak) {
            hornBetHighestStreak = hornBetStreak;
        }
        document.getElementById('hornBetFeedback').innerText = "Correct!";
        document.getElementById('hornBetFeedback').style.color = "green";
        document.getElementById('hornBetCorrectPayout').innerText = '';
    } else {
        hornBetStreak = 0;
        document.getElementById('hornBetFeedback').innerText = "Incorrect";
        document.getElementById('hornBetFeedback').style.color = "red";
        document.getElementById('hornBetCorrectPayout').innerHTML = `Correct payout is <b>$${hornCorrectPayout.toFixed(2)}</b>`;
    }
    updateAccuracy("hornBet");
    generateNewHornBet();
}

function rollDice() {
    const diceCombinations = [
        [1, 1], [1, 2], [2, 1], [5, 6], [6, 5], [6, 6]
    ];
    return diceCombinations[Math.floor(Math.random() * diceCombinations.length)];
}

function calculateHornPayout(betAmount, diceValues) {
    if (diceValues[0] === diceValues[1]) {  // High side
        return betAmount * 7 - (betAmount / 4);
    } else {  // Low side
        return betAmount * 3;
    }
}

function drawDice(diceValues, canvasId) {
    let canvas = document.getElementById(canvasId);
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const dicePositions = [[50, 25], [120, 25]];
    diceValues.forEach((value, index) => {
        drawSingleDie(ctx, dicePositions[index][0], dicePositions[index][1], value);
    });
}

function drawSingleDie(ctx, x, y, value) {
    const size = 50;
    const offset = 10;
    ctx.fillStyle = 'white';
    ctx.fillRect(x, y, size, size);
    ctx.strokeRect(x, y, size, size);

    const pips = [
        [[x + size / 2, y + size / 2]],  // 1
        [[x + offset, y + offset], [x + size - offset, y + size - offset]],  // 2
        [[x + offset, y + offset], [x + size / 2, y + size / 2], [x + size - offset, y + size - offset]],  // 3
        [[x + offset, y + offset], [x + size - offset, y + size - offset], [x + offset, y + size - offset], [x + size - offset, y + offset]],  // 4
        [[x + offset, y + offset], [x + size - offset, y + size - offset], [x + size / 2, y + size / 2], [x + offset, y + size - offset], [x + size - offset, y + offset]],  // 5
        [[x + offset, y + offset], [x + size - offset, y + size - offset], [x + offset, y + size / 2], [x + size - offset, y + size / 2], [x + offset, y + size - offset], [x + size - offset, y + offset]]  // 6
    ];

    ctx.fillStyle = 'black';
    pips[value - 1].forEach(pip => {
        ctx.beginPath();
        ctx.arc(pip[0], pip[1], 5, 0, Math.PI * 2);
        ctx.fill();
    });
}

function drawChips(betAmount, canvasId) {
    let canvas = document.getElementById(canvasId);
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const chipWidth = 30;
    const chipHeight = 10;

    let numGreen = Math.floor(betAmount / 25);
    let remainder = betAmount % 25;
    let numRed = Math.floor(remainder / 5);
    let numWhite = remainder % 5;

    for (let i = 0; i < numGreen; i++) {
        ctx.fillStyle = 'green';
        ctx.fillRect(85, 190 - i * (chipHeight + 2), chipWidth, chipHeight);
    }

    let offset = numGreen * (chipHeight + 2);
    for (let i = 0; i < numRed; i++) {
        ctx.fillStyle = 'red';
        ctx.fillRect(85, 190 - offset - i * (chipHeight + 2), chipWidth, chipHeight);
    }

    offset += numRed * (chipHeight + 2);
    for (let i = 0; i < numWhite; i++) {
        ctx.fillStyle = 'white';
        ctx.fillRect(85, 190 - offset - i * (chipHeight + 2), chipWidth, chipHeight);
    }
}

function numpadClick(number) {
    if (activeInput) {
        activeInput.value += number;
    }
}

function numpadClear() {
    if (activeInput) {
        activeInput.value = '';
    }
}

function numpadEnter() {
    if (activeInput) {
        if (activeInput.id === 'betOn6Payout') {
            checkBetOn6Payout();
        } else if (activeInput.id === 'hornBetPayout') {
            checkHornPayout();
        }
    }
}

// Initial call to set the first tab as active
document.addEventListener("DOMContentLoaded", function() {
    document.querySelector('.tab-button').click();
});
