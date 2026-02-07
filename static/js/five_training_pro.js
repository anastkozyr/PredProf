let audioUnlocked = false;
let soundEnabled = false;
const soundPlayer = new Audio();
soundPlayer.volume = 1;

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
        background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
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
        box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
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
    soundBtn.style.background = 'linear-gradient(135deg, #ff6b6b, #ff8e8e)';

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

    soundPlayer.src = '/static/sounds/five_pro/five_pro_task1.mp3';
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

    soundPlayer.src = `/static/sounds/five_pro/${soundName}`;
    soundPlayer.currentTime = 0;
    soundPlayer.play().catch(err => {
        console.warn('Sound play blocked:', err);
    });
}

function playCurrentTaskSound() {
    if (!soundEnabled) return;

    switch(currentTask) {
        case 1:
            playSound('five_pro_task1.mp3');
            break;
        case 2:
            playSound('five_pro_task2.mp3');
            break;
        case 3:
            playSound('five_pro_task3.mp3');
            break;
        case 4:
            playSound('five_pro_task4.mp3');
            break;
        case 5:
            playSound('five_pro_task5.mp3');
            break;
        case 6:
            playSound('five_pro_task6.mp3');
            break;
        case 7:
            playSound('five_pro_task7.mp3');
            break;
    }
}

// Сохраняем оригинальные функции
const originalCompleteTask = window.completeTask;
const originalNextTask = window.nextTask;
const originalToggleHelp = window.toggleHelp;
const originalRestartTraining = window.restartTraining;
const originalShowNotification = window.showNotification;
const originalHandleAreaClick = window.handleAreaClick;
const originalInitClickableAreas = window.initClickableAreas;
const originalCompleteTraining = window.completeTraining;

// Ищем оригинальную функцию completeTraining и переопределяем ее
window.completeTraining = function() {
    // Воспроизводим финальный звук если озвучка включена
    if (audioUnlocked) {
        playSound('five_final.mp3');
    }

    // Вызываем оригинальную функцию
    if (originalCompleteTraining) {
        originalCompleteTraining();
    }
};

window.showNotification = function(message) {
    if (originalShowNotification) {
        originalShowNotification(message);
    }
    console.log('Notification:', message);
};

window.completeTask = function(taskNum) {
    if (originalCompleteTask) {
        originalCompleteTask(taskNum);
    }

    // НЕ воспроизводим звук следующего задания здесь!
    // Финальный звук будет в completeTraining()
};

window.nextTask = function() {
    if (originalNextTask) {
        originalNextTask();
    }

    // Воспроизводим звук нового задания ПОСЛЕ нажатия кнопки
    if (soundEnabled) {
        setTimeout(() => {
            playCurrentTaskSound();
        }, 500);
    }
};

window.toggleHelp = function(taskNum) {
    if (originalToggleHelp) {
        originalToggleHelp(taskNum);
    }

    if (soundEnabled) {
        switch(taskNum) {
            case 1:
                playSound('five_pro_task1_help.mp3');
                break;
            case 2:
                playSound('five_pro_task2_help.mp3');
                break;
            case 3:
                playSound('five_pro_task3_help.mp3');
                break;
            case 4:
                playSound('five_pro_task4_help.mp3');
                break;
            case 5:
                playSound('five_pro_task5_help.mp3');
                break;
            case 6:
                playSound('five_pro_task6_help.mp3');
                break;
            case 7:
                playSound('five_pro_task7_help.mp3');
                break;
        }
    }
};

window.restartTraining = function() {
    if (originalRestartTraining) {
        originalRestartTraining();
    }

    if (soundEnabled) {
        setTimeout(() => {
            playSound('five_pro_task1.mp3');
        }, 500);
    }
};

window.handleAreaClick = function(action, value) {
    if (!audioUnlocked) {
        unlockAudio();
    }

    if (originalHandleAreaClick) {
        originalHandleAreaClick(action, value);
    }
};

window.initClickableAreas = function() {
    if (originalInitClickableAreas) {
        originalInitClickableAreas();
    }

    const clickableAreas = document.querySelectorAll('.clickable-area, .input-area');
    clickableAreas.forEach(area => {
        area.addEventListener('click', function() {
            if (!audioUnlocked) {
                unlockAudio();
            }
        }, { once: true });
    });
};

function setupAudioUnlock() {
    const appScreen = document.getElementById('appScreen');
    const interactiveOverlay = document.getElementById('interactiveOverlay');
    const helpButtons = document.querySelectorAll('.help-btn-big');
    const nextButton = document.getElementById('next-btn');

    if (appScreen) {
        appScreen.addEventListener('click', function() {
            if (!audioUnlocked) {
                unlockAudio();
            }
        }, { once: true });
    }

    if (interactiveOverlay) {
        interactiveOverlay.addEventListener('click', function() {
            if (!audioUnlocked) {
                unlockAudio();
            }
        }, { once: true });
    }

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

window.playSound = playSound;
window.playCurrentTaskSound = playCurrentTaskSound;