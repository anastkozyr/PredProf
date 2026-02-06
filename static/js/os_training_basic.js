// os_training_basic.js - ОЗВУЧКА с кнопкой управления
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

    // Воспроизводим текущее задание
    playCurrentTaskSound();

    // Скрываем статус через 3 секунды
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

    // Останавливаем воспроизведение
    soundPlayer.pause();
    soundPlayer.currentTime = 0;

    // Скрываем статус через 3 секунды
    setTimeout(() => {
        statusIndicator.style.display = 'none';
    }, 3000);

    showNotification('Озвучка выключена');
}

function unlockAudio() {
    if (audioUnlocked) return;

    soundPlayer.src = '/static/sounds/os_basic/os_task1.mp3';
    soundPlayer.volume = 0;

    soundPlayer.play()
        .then(() => {
            audioUnlocked = true;
            soundPlayer.pause();
            soundPlayer.currentTime = 0;
            soundPlayer.volume = 1;
            enableSound(); // Автоматически включаем озвучку после разблокировки
        })
        .catch(() => {
            showNotification('Нажмите на кнопку "Озвучить тренинг" для включения звука');
        });
}

function playSound(soundName) {
    if (!soundEnabled || !audioUnlocked) return;

    soundPlayer.src = `/static/sounds/os_basic/${soundName}`;
    soundPlayer.currentTime = 0;
    soundPlayer.play().catch(err => {
        console.warn('Sound play blocked:', err);
    });
}

function playCurrentTaskSound() {
    if (!soundEnabled) return;

    if (currentTask === 1) {
        playSound('os_task1.mp3');
    } else if (currentTask === 2) {
        playSound('os_task2.mp3');
    }
}

// Сохраняем оригинальные функции
const originalCompleteTask = window.completeTask;
const originalNextTask = window.nextTask;
const originalToggleHelp = window.toggleHelp;
const originalRestartTraining = window.restartTraining;
const originalCompleteTraining = window.completeTraining;
const originalShowNotification = window.showNotification;

// Переопределяем showNotification для красивого отображения
window.showNotification = function(message) {
    if (originalShowNotification) {
        originalShowNotification(message);
    }

    // Также выводим в консоль для отладки
    console.log('Notification:', message);
};

// Переопределяем функции для добавления озвучки
window.completeTask = function(taskNum) {
    // Вызываем оригинальную функцию
    if (originalCompleteTask) {
        originalCompleteTask(taskNum);
    }

    // Воспроизводим звук следующего задания при завершении
    if (soundEnabled && taskNum === 1) {
        setTimeout(() => {
            playSound('os_task2.mp3');
        }, 1000);
    }
};

window.nextTask = function() {
    // Вызываем оригинальную функцию
    if (originalNextTask) {
        originalNextTask();
    }

    // Воспроизводим звук нового задания
    if (soundEnabled) {
        setTimeout(() => {
            playCurrentTaskSound();
        }, 500);
    }
};

window.toggleHelp = function(taskNum) {
    // Вызываем оригинальную функцию
    if (originalToggleHelp) {
        originalToggleHelp(taskNum);
    }

    // Воспроизводим звук подсказки
    if (soundEnabled) {
        if (taskNum == 1) {
            playSound('os_task1_help.mp3');
        } else if (taskNum == 2) {
            playSound('os_task2_help.mp3');
        }
    }
};

window.restartTraining = function() {
    // Вызываем оригинальную функцию
    if (originalRestartTraining) {
        originalRestartTraining();
    }

    // Воспроизводим звук первого задания при рестарте
    if (soundEnabled) {
        setTimeout(() => {
            playSound('os_task1.mp3');
        }, 500);
    }
};

window.completeTraining = function() {
    // Воспроизводим финальный звук (всегда, независимо от настроек)
    playSound('os_final.mp3');

    // Вызываем оригинальную функцию
    if (originalCompleteTraining) {
        originalCompleteTraining();
    }
};

// Автоматическая разблокировка аудио при первом клике на любую кнопку телефона
function setupAudioUnlock() {
    const phoneButtons = document.querySelectorAll('.volume-up, .volume-down, .power-btn');
    phoneButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (!audioUnlocked) {
                unlockAudio();
            }
        }, { once: true });
    });
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    // Создаем кнопку управления звуком
    createSoundControl();

    // Настраиваем авторазблокировку при нажатии кнопок телефона
    setupAudioUnlock();

    // Показываем инструкцию
    setTimeout(() => {
        const statusIndicator = document.getElementById('soundStatus');
        statusIndicator.innerHTML = '🎧 Нажмите "Озвучить тренинг" для включения звука';
        statusIndicator.style.display = 'block';

        setTimeout(() => {
            statusIndicator.style.display = 'none';
        }, 5000);
    }, 1000);
});