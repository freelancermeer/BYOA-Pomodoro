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
const themeSwitch = document.getElementById('theme-switch');
const appContainer = document.querySelector('.pomodoro-app');
const themeLabel = document.getElementById('theme-label');
let currentTheme = localStorage.getItem('theme') || 'dark';

// Calculate the progress ring circumference
const radius = progressRing.r.baseVal.value;
const circumference = radius * 2 * Math.PI;
progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
progressRing.style.strokeDashoffset = circumference;

function setProgress(percent) {
    const offset = circumference - (percent / 100 * circumference);
    progressRing.style.strokeDashoffset = offset;
}

function updateTabTitle(timeString) {
    document.title = `${timeString} - ${isWorkMode ? 'Focus' : 'Break'} - Pomodoro`;
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.querySelector('.pomodoro-app').setAttribute('data-theme', theme);
    themeLabel.textContent = theme === 'dark' ? 'Dark Mode' : 'Light Mode';
    localStorage.setItem('theme', theme);
}

function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(currentTheme);
    
    document.querySelector('.pomodoro-app').setAttribute('data-theme', currentTheme);
}

function toggleMode() {
    isWorkMode = !isWorkMode;
    const app = document.querySelector('.pomodoro-app');
    
    // Remove both classes first
    app.classList.remove('work-mode', 'break-mode');
    // Add the appropriate class
    app.classList.add(isWorkMode ? 'work-mode' : 'break-mode');
    
    timeLeft = isWorkMode ? 25 * 60 : 5 * 60;
    totalTime = timeLeft;
    
    if (isWorkMode) {
        modeLabel.textContent = 'Focus Mode';
        document.documentElement.style.setProperty('--primary-color', '#4F46E5');
        progressRing.style.stroke = '#4F46E5';
    } else {
        modeLabel.textContent = 'Break Mode';
        document.documentElement.style.setProperty('--primary-color', '#EC4899');
        progressRing.style.stroke = '#EC4899';
    }
    
    setProgress(100);
    updateTimerDisplay();
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
    const timeString = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    timerDisplay.textContent = timeString;
    updateTabTitle(timeString);
}

// Event Listeners
toggleButton.addEventListener('click', toggleMode);
startStopButton.addEventListener('click', startStopTimer);
resetButton.addEventListener('click', resetTimer);
themeSwitch.addEventListener('click', toggleTheme);

// Initialize progress ring
setProgress(100);

// Initialize theme
setTheme(currentTheme);

// Wait for DOM to be ready for element manipulation
document.addEventListener('DOMContentLoaded', () => {
    const app = document.querySelector('.pomodoro-app');
    
    // Initialize mode
    app.classList.add('work-mode');
    
    // Initialize theme
    app.setAttribute('data-theme', currentTheme);
});