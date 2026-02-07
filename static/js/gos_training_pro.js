let audioUnlocked = false;
let soundEnabled = false;
const soundPlayer = new Audio();
soundPlayer.volume = 1;

// Создаем кнопку управления озвучкой
function createSoundControl() {
    const soundControl = document.createElement('div');
    soundControl.id = 'soundControl';
    soundControl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
    `;

    const soundBtn = document.createElement('button');
    soundBtn.id = 'soundToggleBtn';
    soundBtn.innerHTML = '<i class="bi bi-volume-up"></i> Озвучить тренинг';
    soundBtn.style.cssText = `
        background: linear-gradient(135deg, #007AFF, #00b4ff);
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 25px;
        cursor: pointer;
        font-size: 16px;
        font-weight: bold;
        display: flex;
        align-items: center;
        gap: 8px;
        box-shadow: 0 4px 15px rgba(0, 122, 255, 0.3);
        transition: all 0.3s;
    `;

    const statusIndicator = document.createElement('div');
    statusIndicator.id = 'soundStatus';
    statusIndicator.innerHTML = '🔇 Озвучка выключена';
    statusIndicator.style.cssText = `
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 14px;
        display: none;
    `;

    soundBtn.onclick = function() {
        if (!soundEnabled) {
            enableSound();
        } else {
            disableSound();
        }
    };

    soundControl.appendChild(soundBtn);
    soundControl.appendChild(statusIndicator);
    document.body.appendChild(soundControl);
}

function enableSound() {
    if (!audioUnlocked) {
        unlockAudio();
        return;
    }

    soundEnabled = true;
    const soundBtn = document.getElementById('soundToggleBtn');
    const statusIndicator = document.getElementById('soundStatus');

    soundBtn.innerHTML = '<i class="bi bi-volume-mute"></i> Выключить озвучку';
    soundBtn.style.background = 'linear-gradient(135deg, #28a745, #20c997)';

    statusIndicator.innerHTML = '🔊 Озвучка включена';
    statusIndicator.style.display = 'block';

    playCurrentTaskSound();

    setTimeout(() => {
        statusIndicator.style.display = 'none';
    }, 3000);

    showNotification('Озвучка включена');
}

function disableSound() {
    soundEnabled = false;
    const soundBtn = document.getElementById('soundToggleBtn');
    const statusIndicator = document.getElementById('soundStatus');

    soundBtn.innerHTML = '<i class="bi bi-volume-up"></i> Озвучить тренинг';
    soundBtn.style.background = 'linear-gradient(135deg, #007AFF, #00b4ff)';

    statusIndicator.innerHTML = '🔇 Озвучка выключена';
    statusIndicator.style.display = 'block';

    soundPlayer.pause();
    soundPlayer.currentTime = 0;

    setTimeout(() => {
        statusIndicator.style.display = 'none';
    }, 3000);

    showNotification('Озвучка выключена');
}

function unlockAudio() {
    if (audioUnlocked) return;

    soundPlayer.src = '/static/sounds/gos_pro/gos_pro_task1.mp3';
    soundPlayer.volume = 0;

    soundPlayer.play()
        .then(() => {
            audioUnlocked = true;
            soundPlayer.pause();
            soundPlayer.currentTime = 0;
            soundPlayer.volume = 1;
            enableSound();
        })
        .catch(() => {
            showNotification('Нажмите на кнопку "Озвучить тренинг" для включения звука');
        });
}

function playSound(soundName) {
    if (!soundEnabled || !audioUnlocked) return;

    soundPlayer.src = `/static/sounds/gos_pro/${soundName}`;
    soundPlayer.currentTime = 0;
    soundPlayer.play().catch(err => {
        console.warn('Sound play blocked:', err);
    });
}

function playCurrentTaskSound() {
    if (!soundEnabled) return;

    if (currentTask === 1) {
        playSound('gos_pro_task1.mp3');
    } else if (currentTask === 2) {
        playSound('gos_pro_task2.mp3');
    } else if (currentTask === 3) {
        playSound('gos_pro_task3.mp3');
    }
}

// Сохраняем оригинальные функции
const originalCompleteTask = window.completeTask;
const originalNextTask = window.nextTask;
const originalToggleHelp = window.toggleHelp;
const originalRestartTraining = window.restartTraining;
const originalCompleteTraining = window.completeTraining;
const originalShowNotification = window.showNotification;

window.showNotification = function(message, type = '') {
    if (originalShowNotification) {
        originalShowNotification(message, type);
    }
    console.log('Notification:', message);
};

window.completeTask = function(taskNum) {
    if (originalCompleteTask) {
        originalCompleteTask(taskNum);
    }

    // НЕ воспроизводим звук следующего задания здесь!
    // Звук следующего задания будет в nextTask()
};

window.nextTask = function() {
    if (originalNextTask) {
        originalNextTask();
    }

    // Воспроизводим звук нового задания ПОСЛЕ нажатия кнопки
    if (soundEnabled) {
        setTimeout(() => {
            playCurrentTaskSound(); // Звук текущего задания
        }, 500);
    }
};

window.toggleHelp = function(taskNum) {
    if (originalToggleHelp) {
        originalToggleHelp(taskNum);
    }

    if (soundEnabled) {
        if (taskNum == 1) {
            playSound('gos_pro_task1_help.mp3');
        } else if (taskNum == 2) {
            playSound('gos_pro_task2_help.mp3');
        } else if (taskNum == 3) {
            playSound('gos_pro_task3_help.mp3');
        }
    }
};

window.restartTraining = function() {
    if (originalRestartTraining) {
        originalRestartTraining();
    }

    if (soundEnabled) {
        setTimeout(() => {
            playSound('gos_pro_task1.mp3');
        }, 500);
    }
};

window.completeTraining = function() {
    // Воспроизводим финальный звук ТОЛЬКО если озвучка включена
    if (audioUnlocked) {
        playSound('gos_final.mp3');
    }

    if (originalCompleteTraining) {
        originalCompleteTraining();
    }
};

function setupAudioUnlock() {
    const loginButton = document.getElementById('login-btn');
    const registerButton = document.getElementById('register-btn');
    const clickableAreas = document.querySelectorAll('.clickable-area');
    const formButtons = document.querySelectorAll('.form-btn, .button-start, .button-continue, .button-select, .button-next');
    const helpButtons = document.querySelectorAll('.help-btn-big');
    const nextButton = document.getElementById('next-btn');

    if (loginButton) {
        loginButton.addEventListener('click', function() {
            if (!audioUnlocked) {
                unlockAudio();
            }
        }, { once: true });
    }

    if (registerButton) {
        registerButton.addEventListener('click', function() {
            if (!audioUnlocked) {
                unlockAudio();
            }
        }, { once: true });
    }

    clickableAreas.forEach(area => {
        area.addEventListener('click', function() {
            if (!audioUnlocked) {
                unlockAudio();
            }
        }, { once: true });
    });

    formButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (!audioUnlocked) {
                unlockAudio();
            }
        }, { once: true });
    });

    if (helpButtons.length > 0) {
        helpButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                if (!audioUnlocked) {
                    unlockAudio();
                }
            }, { once: true });
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', function() {
            if (!audioUnlocked) {
                unlockAudio();
            }
        }, { once: true });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    createSoundControl();
    setupAudioUnlock();

    setTimeout(() => {
        const statusIndicator = document.getElementById('soundStatus');
        statusIndicator.innerHTML = '🎧 Нажмите "Озвучить тренинг" для включения звука';
        statusIndicator.style.display = 'block';

        setTimeout(() => {
            statusIndicator.style.display = 'none';
        }, 5000);
    }, 1000);
});