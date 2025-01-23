// script.js
let isWorkMode = true;
let timer;
let timeLeft = 25 * 60; // 25 minutes
let totalTime = 25 * 60; // Total time for progress calculation

const toggleButton = document.getElementById('toggle-mode');
const timerDisplay = document.getElementById('timer');
const startStopButton = document.getElementById('start-stop');
const resetButton = document.getElementById('reset');
const modeLabel = document.getElementById('mode-label');
const progressRing = document.querySelector('.progress-ring-circle');
const workIcon = document.querySelector('.work-icon');
const breakIcon = document.querySelector('.break-icon');

// Calculate the progress ring circumference
const radius = progressRing.r.baseVal.value;
const circumference = radius * 2 * Math.PI;
progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
progressRing.style.strokeDashoffset = circumference;

function setProgress(percent) {
    const offset = circumference - (percent / 100 * circumference);
    progressRing.style.strokeDashoffset = offset;
}

function toggleMode() {
    isWorkMode = !isWorkMode;
    timeLeft = isWorkMode ? 25 * 60 : 5 * 60;
    totalTime = timeLeft;
    updateTimerDisplay();
    
    // Update UI elements
    if (isWorkMode) {
        modeLabel.textContent = 'Focus Mode';
        workIcon.style.display = 'block';
        breakIcon.style.display = 'none';
        document.documentElement.style.setProperty('--primary-color', '#4F46E5');
        progressRing.style.stroke = '#4F46E5';
    } else {
        modeLabel.textContent = 'Break Mode';
        workIcon.style.display = 'none';
        breakIcon.style.display = 'block';
        document.documentElement.style.setProperty('--primary-color', '#EC4899');
        progressRing.style.stroke = '#EC4899';
    }
    
    setProgress(100);
}

function startStopTimer() {
    if (timer) {
        clearInterval(timer);
        timer = null;
        startStopButton.innerHTML = '<i class="fas fa-play"></i><span>Start</span>';
        document.querySelector('.timer-circle').classList.remove('timer-active');
    } else {
        timer = setInterval(countdown, 1000);
        startStopButton.innerHTML = '<i class="fas fa-pause"></i><span>Pause</span>';
        document.querySelector('.timer-circle').classList.add('timer-active');
    }
}

function countdown() {
    if (timeLeft <= 0) {
        clearInterval(timer);
        timer = null;
        startStopButton.innerHTML = '<i class="fas fa-play"></i><span>Start</span>';
        document.querySelector('.timer-circle').classList.remove('timer-active');
        
        // Play notification sound
        const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
        audio.play();
        
        setTimeout(() => {
            alert(isWorkMode ? 'Time to take a break!' : 'Time to focus!');
            toggleMode();
        }, 500);
    } else {
        timeLeft--;
        updateTimerDisplay();
        const progressPercent = (timeLeft / totalTime) * 100;
        setProgress(progressPercent);
    }
}

function resetTimer() {
    clearInterval(timer);
    timer = null;
    timeLeft = isWorkMode ? 25 * 60 : 5 * 60;
    totalTime = timeLeft;
    updateTimerDisplay();
    startStopButton.innerHTML = '<i class="fas fa-play"></i><span>Start</span>';
    document.querySelector('.timer-circle').classList.remove('timer-active');
    setProgress(100);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Event Listeners
toggleButton.addEventListener('click', toggleMode);
startStopButton.addEventListener('click', startStopTimer);
resetButton.addEventListener('click', resetTimer);

// Initialize progress ring
setProgress(100);