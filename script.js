// Streak, Accuracy, Timer Variables
let streak = 0;
let correctAnswers = 0;
let totalAttempts = 0;
let startTime;

// Dice roll function
function diceRoll() {
    return [2, 3, 7, 11, 12][Math.floor(Math.random() * 5)];
}

// Function to generate a valid bet amount based on bet type
function getValidBet(betType) {
    let bet;
    if (betType === "Horn High" || betType === "Whirl") {
        bet = (Math.floor(Math.random() * 20) + 1) * 5; // Bet divisible by 5
    } else {
        bet = Math.floor(Math.random() * 100) + 1; // Any bet amount
    }
    return bet;
}

// Horn High Payout Calculation
function calculateHornHighPayout(bet, highNumber, roll) {
    const H = bet * 0.4;
    const R = bet * 0.2;
    const payoutRatios = {2: 30, 12: 30, 3: 15, 11: 15};

    let payout = (roll === highNumber)
        ? (H * payoutRatios[roll]) - (3 * R)
        : (R * payoutRatios[roll]) - (H + 2 * R);

    return { 
        payout, 
        explanation: `(${H.toFixed(2)} × ${payoutRatios[roll]}) - (${(3 * R).toFixed(2)}) = ${payout.toFixed(2)}` 
    };
}

// Whirl Bet Payout Calculation
function calculateWhirlPayout(bet, roll) {
    const oneFifthBet = bet / 5;
    const payoutRatios = {2: 30, 12: 30, 3: 15, 11: 15, 7: 4};

    let payout = (oneFifthBet * payoutRatios[roll]) - (oneFifthBet * 4);
    let explanation = `(${oneFifthBet.toFixed(2)} × ${payoutRatios[roll]}) - (${oneFifthBet.toFixed(2)} × 4) = ${payout.toFixed(2)}`;

    if (roll === 7) {
        payout = 0; // Whirl bet is a push on 7
        explanation = `(${oneFifthBet.toFixed(2)} × ${payoutRatios[roll]}) - (${oneFifthBet.toFixed(2)} × 4) = Push (0)`;
    }

    return { payout, explanation };
}

// Hi-Lo Split Payout Calculation
function calculateHiLoPayout(bet, roll) {
    const halfBet = bet / 2;

    let payout, explanation;
    if ([2, 3, 11, 12].includes(roll)) {
        payout = ((bet + halfBet) * 10) - Math.floor(halfBet);
        explanation = `(${bet} + ${halfBet.toFixed(2)}) × 10 - (${Math.floor(halfBet)}) = ${payout.toFixed(2)}`;
    } else {
        payout = bet;
        explanation = `((${bet} + ${halfBet.toFixed(2)}) × 0) = ${payout.toFixed(2)}`;
    }

    return { payout, explanation };
}

// Multiplication Quiz Calculation
function calculateMultiplication(bet) {
    const multipliers = [4, 7, 9, 15, 30];
    const multiplier = multipliers[Math.floor(Math.random() * multipliers.length)];
    const payout = bet * multiplier;

    return {
        payout,
        explanation: `${bet} × ${multiplier} = ${payout}`,
        betType: `Multiplication (${multiplier}×)`
    };
}

function generateQuiz() {
    let quizData, betType, roll, betAmount;

    let questionType = Math.random();
    if (questionType < 0.25) {
        // Horn High
        roll = diceRoll();
        const highNumber = [2, 3, 11, 12][Math.floor(Math.random() * 4)];
        betType = `Horn High ${highNumber}`;
        betAmount = getValidBet("Horn High");
        quizData = calculateHornHighPayout(betAmount, highNumber, roll);
    } else if (questionType < 0.50) {
        // Whirl
        roll = diceRoll();
        betType = "Whirl";
        betAmount = getValidBet("Whirl");
        quizData = calculateWhirlPayout(betAmount, roll);
    } else if (questionType < 0.75) {
        // Hi-Lo
        roll = diceRoll();
        betType = "Hi-Lo Split";
        betAmount = getValidBet("Hi-Lo");
        quizData = calculateHiLoPayout(betAmount, roll);
    } else {
        // Multiplication
        betType = "Multiplication";
        betAmount = getValidBet("Multiplication");
        quizData = calculateMultiplication(betAmount);
        betType = quizData.betType; // Ensure correct naming
    }

    // **Fix: Assign the correct bet amount to the quiz data object**
    quizData.bet = betAmount;

    // **Fix: Now properly displaying the bet amount**
    document.getElementById("bet-info").textContent = `You placed a $${betAmount} ${betType} bet.`;
    document.getElementById("roll-info").textContent = roll ? `The roll is: ${roll}` : "";
    document.getElementById("user-guess").value = '';
    document.getElementById("result").textContent = '';
    document.getElementById("explanation").textContent = '';

    window.quizData = quizData;
    startTime = Date.now();
}

// Check Answer
function checkAnswer() {
    const userGuess = parseFloat(document.getElementById("user-guess").value) || 0;
    const correctPayout = window.quizData.payout;

    totalAttempts++;
    let timeTaken = ((Date.now() - startTime) / 1000).toFixed(1);
    document.getElementById("timer-info").textContent = `⏳ Time: ${timeTaken}s`;

    if (Math.abs(userGuess - correctPayout) < 0.01) {
        streak++;
        correctAnswers++;
        document.getElementById("result").textContent = "✅ Correct!";
    } else {
        streak = 0;
        document.getElementById("result").textContent = `❌ Wrong. Correct payout: $${correctPayout.toFixed(2)}`;
    }

    document.getElementById("explanation").textContent = window.quizData.explanation;
    updateStats();
}

// Update Streak and Accuracy
function updateStats() {
    let accuracy = totalAttempts > 0 ? ((correctAnswers / totalAttempts) * 100).toFixed(1) : 0;
    document.getElementById("streak-info").textContent = `🔥 Streak: ${streak}`;
    document.getElementById("accuracy-info").textContent = `📊 Accuracy: ${accuracy}%`;
}

// Number Pad Functions
function appendNumber(num) {
    document.getElementById("user-guess").value += num;
}

function clearInput() {
    document.getElementById("user-guess").value = '';
}

// Initialize the first question
generateQuiz();
