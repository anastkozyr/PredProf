// max_training_basic.js - скрипт тренинга Макса с озвучкой
let currentTask = 1;
let tasksCompleted = 0;
let totalTasks = 3;
let currentImage = 'start_page.jpeg';
let stickerSent = false;
let messageSent = false;
let modalAction = null;
const buttonsToHide = document.querySelectorAll('.hide-on-complete');

// Переменные для озвучки
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
        background: linear-gradient(135deg, #8b5cf6, #a78bfa);
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
        box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
        transition: all 0.3s;
    `;

    const statusIndicator = document.createElement('div');
    statusIndicator.id = 'soundStatus';
    statusIndicator.innerHTML = '🔇 Озвучка выключена';
    statusIndicator.style.cssText = `
        background: rgba(75, 85, 99, 0.9);
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 14px;
        display: none;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
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
    soundBtn.style.background = 'linear-gradient(135deg, #8b5cf6, #a78bfa)';

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

    soundPlayer.src = '/static/sounds/max/task_1.mp3';
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

    soundPlayer.src = `/static/sounds/max/${soundName}`;
    soundPlayer.currentTime = 0;
    soundPlayer.play().catch(err => {
        console.warn('Sound play blocked:', err);
    });
}

function playCurrentTaskSound() {
    if (!soundEnabled) return;

    if (currentTask === 1) {
        playSound('task_1.mp3');
    } else if (currentTask === 2) {
        playSound('task_2.mp3');
    } else if (currentTask === 3) {
        playSound('task_3.mp3');
    }
}

const screenConfigs = {
    'start_page.jpeg': {
        areas: [
            {
                id: 'contact-btn',
                top: '87%',
                left: '3%',
                width: '18%',
                height: '8%',
                action: 'openContacts'
            }
        ],
    },
    'contacts.jpeg': {
        areas: [
            {
                id: 'contact',
                top: '23%',
                left: '1%',
                width: '81%',
                height: '6%',
                action: 'openChat'
            }
        ]
    },
    'empty_chat.jpeg': {
        areas: [
            {
                id: 'mushroom_sticker',
                top: '30%',
                left: '15%',
                width: '70%',
                height: '40%',
                action: 'sendSticker'
            }
        ]
    },
    'hello_sticker.jpeg': {
        areas: []
    },
    'hello_text.jpeg': {
        areas: [
            {
                id: 'send-photo',
                top: '88.5%',
                left: '67%',
                width: '13%',
                height: '6%',
                action: 'sendPhoto'
            }
        ],
    },
    'gallery.jpeg': {
        areas: [
            {
                id: 'choose-photo',
                top: '38%',
                left: '30%',
                width: '42%',
                height: '20%',
                action: 'choosePhoto'
            }
        ]
    },
    'send_photo.jpeg': {
        areas: [
            {
                id: 'send-photo',
                top: '88.5%',
                left: '91%',
                width: '11%',
                height: '5.5%',
                action: 'sharePhoto'
            }
        ]
    },
    'final.jpeg': {
        areas: []
    }
};

// Загрузка данных пользователя
document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    loadScreen('start_page.jpeg');

    createSoundControl();
    setupAudioUnlock();
});

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

async function loadUserData() {
    try {
        const response = await fetch('/api/get-user-level');
        if (response.ok) {
            const data = await response.json();
            document.getElementById('userStatus').innerHTML =
                `👤 ${data.name} | Уровень: ${data.level}`;
            document.getElementById('userStatus').classList.add('active');
        }
    } catch (error) {
        console.error('Ошибка загрузка данных:', error);
    }
}

// Загрузка экрана с фотографией
function loadScreen(imageName) {
    currentImage = imageName;
    const config = screenConfigs[imageName];

    // Загружаем фотографию
    document.getElementById('appScreen').innerHTML =
        `<img src="/images/max/${imageName}" alt="Экран приложения"
              onload="initClickableAreas()">`;

    if (imageName === 'hello_sticker.jpeg') {
        addMessageInputField();
    }
}

function addMessageInputField() {
    const inputContainer = document.createElement('div');
    inputContainer.id = 'messageInputContainer';
    inputContainer.style.cssText = `
        position: absolute;
        bottom: 5%;
        left: 5%;
        width: 90%;
        display: flex;
        gap: 10px;
        z-index: 200;
        pointer-events: all;
    `;

    const inputField = document.createElement('input');
    inputField.id = 'messageInput';
    inputField.type = 'text';
    inputField.placeholder = 'Введите сообщение...';
    inputField.style.cssText = `
        flex: 1;
        padding: 12px 15px;
        border: 2px solid #5e72e4;
        border-radius: 25px;
        font-size: 16px;
        background: rgba(255, 255, 255, 0.95);
        outline: none;
        box-shadow: 0 4px 15px rgba(94, 114, 228, 0.2);
    `;

    const sendButton = document.createElement('button');
    sendButton.id = 'realSendButton';
    sendButton.innerHTML = '<i class="bi bi-send-fill"></i>';
    sendButton.style.cssText = `
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #4f6af5 0%, #825ee4 100%);
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 15px rgba(94, 114, 228, 0.3);
        transition: all 0.3s;
    `;

    sendButton.onclick = function() {
        sendTextMessage();
    };

    inputField.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendTextMessage();
        }
    });

    inputField.addEventListener('focus', function() {
        if (!audioUnlocked) {
            unlockAudio();
        }
    });

    inputContainer.appendChild(inputField);
    inputContainer.appendChild(sendButton);

    document.getElementById('appScreen').appendChild(inputContainer);

    setTimeout(() => {
        inputField.focus();
    }, 300);
}

function sendTextMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();

    if (message.toLowerCase() === 'добрый вечер') {
        messageSent = true;
        showNotification('Перейдите к следующему заданию');

        const container = document.getElementById('messageInputContainer');
        if (container) {
            container.remove();
        }

        setTimeout(() => {
            loadScreen('hello_text.jpeg');
            if (currentTask === 2) {
                completeTask(2);
            }
        }, 10);
    } else {
        showNotification('Напишите "Добрый вечер"');
        messageInput.focus();
    }
}

function initClickableAreas() {
    const config = screenConfigs[currentImage];

    document.getElementById('interactiveOverlay').innerHTML = '';

    if (config && config.areas) {
        config.areas.forEach(area => {
            const clickableArea = document.createElement('div');
            clickableArea.className = 'clickable-area active';
            clickableArea.innerHTML = '';

            clickableArea.style.top = area.top;
            clickableArea.style.left = area.left;
            clickableArea.style.width = area.width;
            clickableArea.style.height = area.height;
            clickableArea.id = area.id;

            clickableArea.onclick = () => {
                if (!audioUnlocked) {
                    unlockAudio();
                }
                handleAreaClick(area.action);
            };

            document.getElementById('interactiveOverlay').appendChild(clickableArea);
        });
    }
}

function handleAreaClick(action) {
    console.log('Клик по области:', action);

    switch(action) {
        case 'openContacts':
            loadScreen('contacts.jpeg');
            break;

        case 'openChat':
            loadScreen('empty_chat.jpeg');
            break;

        case 'sendSticker':
            stickerSent = true;
            loadScreen('hello_sticker.jpeg');
            if (currentTask === 1) {
                completeTask(1);
            }
            showNotification('Перейдите к следующему заданию');
            break;

        case 'focusMessageInput':
            const inputField = document.getElementById('messageInput');
            if (inputField) {
                inputField.focus();
            }
            break;

        case 'sendMessage':
            sendTextMessage();
            break;

        case 'sendPhoto':
            loadScreen('gallery.jpeg');
            break;

        case 'choosePhoto':
            loadScreen('send_photo.jpeg');
            break;

        case 'sharePhoto':
            loadScreen('final.jpeg');
            if (currentTask === 3) {
                completeTask(3);
            }
            showNotification('Тренинг успешно пройден!');
            break;
    }
}

async function saveProgress(taskId) {
    try {
        await fetch('/api/save-progress', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                task_id: taskId,
                progress: tasksCompleted,
                total_tasks: totalTasks
            })
        });
    } catch (error) {
        console.error('Ошибка сохранения:', error);
    }
}

async function completeTrainingtodb() {
    if (tasksCompleted === totalTasks) {
        fetch("/messenger_training", {method: "POST"});
    }
}

// Ищем оригинальную функцию completeTraining и переопределяем ее
const originalCompleteTraining = window.completeTraining;

window.completeTraining = function() {
    // Воспроизводим финальный звук если озвучка включена
    if (audioUnlocked) {
        playSound('max_final.mp3');
    }

    // Вызываем оригинальную функцию
    if (originalCompleteTraining) {
        originalCompleteTraining();
    }
};

// Завершить задание
async function completeTask(taskNum) {
    tasksCompleted++;
    updateProgress();

    await saveProgress(taskNum);

    document.getElementById('next-btn').classList.add('active');
    showNotification(`Задание ${taskNum} выполнено!`);

    // НЕ воспроизводим звук следующего задания здесь!
    // Звук следующего задания будет в nextTask()

    if (tasksCompleted === totalTasks) {
        completeTraining();
        completeTrainingtodb();
        setTimeout(() => {
            document.getElementById('complete-screen').classList.add('active');
            document.getElementById('task' + currentTask).classList.remove('active');
            document.getElementById('next-btn').classList.remove('active');
            document.getElementById('score').textContent = `${totalTasks}/${totalTasks}`;
            saveProgress('final');
            buttonsToHide.forEach(button => {button.style.display = 'none';});
        }, 10);
    }
}

// Следующее задание
function nextTask() {
    document.getElementById('task' + currentTask).classList.remove('active');
    document.getElementById('next-btn').classList.remove('active');
    document.querySelectorAll('.help-content').forEach(help => {
        help.classList.remove('active');
    });

    currentTask++;

    if (currentTask <= totalTasks) {
        document.getElementById('task' + currentTask).classList.add('active');
        showNotification(`Начато задание ${currentTask}`);

        // Обновляем экран в зависимости от задания
        switch(currentTask) {
            case 1:
                loadScreen('start_page.jpeg');
                break;
            case 2:
                loadScreen('hello_sticker.jpeg');
                break;
            case 3:
                loadScreen('hello_text.jpeg');
                break;
        }

        // Воспроизводим звук нового задания ПОСЛЕ нажатия кнопки
        if (soundEnabled) {
            setTimeout(() => {
                playCurrentTaskSound();
            }, 500);
        }
    }
}

function updateProgress() {
    const progress = (tasksCompleted / totalTasks) * 100;
    document.getElementById('progress').style.width = progress + '%';
}

// Показать/скрыть помощь
function toggleHelp(taskNum) {
    const help = document.getElementById('help' + taskNum);
    help.classList.toggle('active');

    // Звук помощи
    if (soundEnabled) {
        if (taskNum == 1) {
            playSound('help_1.mp3');
        } else if (taskNum == 2) {
            playSound('help_2.mp3');
        } else if (taskNum == 3) {
            playSound('help_3.mp3');
        }
    }
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

async function restartTraining() {
    currentTask = 1;
    tasksCompleted = 0;
    stickerSent = false;
    messageSent = false;

    const inputContainer = document.getElementById('messageInputContainer');
    if (inputContainer) {
        inputContainer.remove();
    }

    document.getElementById('complete-screen').classList.remove('active');
    document.querySelectorAll('.task').forEach(task => {
        task.classList.remove('active');
    });
    document.getElementById('task1').classList.add('active');
    document.getElementById('next-btn').classList.remove('active');
    document.querySelectorAll('.help-content').forEach(help => {
        help.classList.remove('active');
    });

    loadScreen('start_page.jpeg');
    updateProgress();
    await saveProgress('reset');
    showNotification('Тренинг начат заново!');

    // Воспроизводим звук первого задания при рестарте
    if (soundEnabled) {
        setTimeout(() => {
            playSound('task_1.mp3');
        }, 500);
    }
}

document.getElementById('inputField').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        // Для других модальных окон
    }
});