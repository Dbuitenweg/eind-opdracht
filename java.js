let timerInterval;
let seconds = 0;
let minutes = 0;
let hours = 0;

function startTimer() {
    timerInterval = setInterval(incrementTimer, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function incrementTimer() {
    seconds++;

    if (seconds === 60) {
        seconds = 0;
        minutes++;

        if (minutes === 60) {
            minutes = 0;
            hours++;
        }
    }

    updateTimerDisplay();
}

function updateTimerDisplay() {
    const timerDisplay = document.getElementById("timer");
    timerDisplay.textContent = formatTime(hours) + ":" + formatTime(minutes) + ":" + formatTime(seconds);
}

function formatTime(time) {
    return time < 10 ? "0" + time : time;
}