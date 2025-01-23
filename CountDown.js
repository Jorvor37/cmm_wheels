const display = document.getElementById("display");
let timer = null;
let startTime = 0;
let isRunning = false;
let countdownDuration = 0;
let remainingTime = 0;

function start() {
    if (!isRunning) {
        if (remainingTime === 0) {
            // First time starting or if the countdown is reset, calculate the countdown duration
            let min = parseInt(document.getElementById('min').textContent) || 0;
            let sec = parseInt(document.getElementById('sec').textContent) || 0;
            let mil = parseInt(document.getElementById('mil').textContent) || 0;
            countdownDuration = (min * 60 * 1000) + (sec * 1000) + mil;
            remainingTime = countdownDuration;
        }
        startTime = Date.now();
        timer = setInterval(update, 10); // Update every 0.1 second
        isRunning = true;
    }
}

function stop() {
    if (isRunning) {
        clearInterval(timer);
        remainingTime -= Date.now() - startTime; // Adjust the remaining time
        isRunning = false;
    }
}

function update() {
    const currentTime = Date.now();
    let elapsedTime = currentTime - startTime;
    let timeLeft = remainingTime - elapsedTime;

    if (timeLeft <= 0) {
        clearInterval(timer);
        timeLeft = 0;
        isRunning = false;
    }

    let minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
    let seconds = Math.floor((timeLeft / 1000) % 60);
    let mil = Math.floor((timeLeft % 1000) / 10);

    minutes = String(minutes).padStart(2, "0");
    seconds = String(seconds).padStart(2, "0");
    mil = String(mil).padStart(2, "0");

    display.textContent = `${minutes}:${seconds}:${mil}`;
}

function reset() {
    clearInterval(timer);
    isRunning = false;
    remainingTime = 0;
    countdownDuration = 0;
    display.textContent = "00:00:00";

    // Reset the input fields to allow new values
    const min = document.getElementById('min');
    const sec = document.getElementById('sec');
    const mil = document.getElementById('mil');

    min.textContent = "00";
    sec.textContent = "00";
    mil.textContent = "00";

    // Make sure the fields are editable again
    min.setAttribute('contenteditable', 'true');
    sec.setAttribute('contenteditable', 'true');
    mil.setAttribute('contenteditable', 'true');

    //location.reload();  // Reloads the current page
}

function validateInput(element, max) {
    let content = element.textContent;
    content = content.replace(/\D/g, '');

    if (content.length > 2) {
        content = content.slice(0, 2);
    }

    if (parseInt(content, 10) > max) {
        content = max.toString().padStart(2, '0');
    }

    element.textContent = content;

    let range = document.createRange();
    let sel = window.getSelection();
    range.setStart(element.childNodes[0], content.length);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('min').addEventListener('input', function (e) {
        validateInput(e.target, 60);
    });

    document.getElementById('sec').addEventListener('input', function (e) {
        validateInput(e.target, 60);
    });

    document.getElementById('mil').addEventListener('input', function (e) {
        validateInput(e.target, 999); // Milliseconds should be up to 999
    });
});
