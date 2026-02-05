let currentTask = 1;
let tasksCompleted = 0;
let totalTasks = 3;
let currentImage = 'start_page.jpeg';
let stickerSent = false;
let messageSent = false;
let modalAction = null;

// Координаты
const screenConfigs = {
    'start_page.jpeg': {
        areas: [
            {
                id: 'contact-btn',
                top: '87%',     // Внизу экрана
                left: '3%',     // Слева
                width: '18%',   // Ширина
                height: '8%',   // Высота
                action: 'openContacts'
            }
        ]
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
    'hello_text.jpeg': {
        areas: [
            {
                id: 'send-photo',
                top: '90%',
                left: '70%',
                width: '7%',
                height: '5%',
                action: 'sendPhoto'
            }
        ]
    },
    'gallery.jpeg': {
        areas: [
            {
                id: 'choose-photo',
                top: '37%',
                left: '0%',
                width: '33%',
                height: '18%',
                action: 'choosePhoto'
            }
        ]
    }, 'send_photo.jpeg': {
        areas: [
            {
                id: 'send-photo',
                top: '89%',
                left: '90%',
                width: '10%',
                height: '5%',
                action: 'sharePhoto'
            }
        ]
    }
};

// Загрузка данных пользователя
document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    loadScreen('start_page.jpeg');

});

// Загрузка данных пользователя
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
        console.error('Ошибка загрузки данных:', error);
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

// Добавить поле для ввода сообщения
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

    // Поддержка Enter для отправки
    inputField.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendTextMessage();
        }
    });

    inputContainer.appendChild(inputField);
    inputContainer.appendChild(sendButton);

    document.getElementById('appScreen').appendChild(inputContainer);

    // Фокусируем поле ввода
    setTimeout(() => {
        inputField.focus();
    }, 300);
}

// Отправить текстовое сообщение
function sendTextMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();

    if (message.toLowerCase() === 'добрый вечер') {
        messageSent = true;
        showNotification('Перейдите к следующему заданию');

        // Удаляем поле ввода
        const container = document.getElementById('messageInputContainer');
        if (container) {
            container.remove();
        }

        // Переключаем на следующий экран
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

// Инициализация кликабельных областей после загрузки изображения
function initClickableAreas() {
    const config = screenConfigs[currentImage];

    // Очищаем старые области
    document.getElementById('interactiveOverlay').innerHTML = '';

    // Добавляем новые области
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

            clickableArea.onclick = () => handleAreaClick(area.action);

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
            }showNotification('Перейдите к следующему заданию');
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
            }showNotification('Тренинг успешно пройден!');
            break;
    }
}

// Сохранение прогресса
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

function completeTraining() {
    if (tasksCompleted === totalTasks) {
    // Перенаправить на страницу обновления прогресса
       fetch("/messenger_training", {method: "POST"});
    }
}

// Завершить задание
async function completeTask(taskNum) {
    tasksCompleted++;
    updateProgress();

    await saveProgress(taskNum);

    document.getElementById('next-btn').classList.add('active');
    showNotification(`Задание ${taskNum} выполнено!`);

    if (tasksCompleted === totalTasks) {
        completeTraining();
        setTimeout(() => {
            document.getElementById('complete-screen').classList.add('active');
            document.getElementById('task' + currentTask).classList.remove('active');
            document.getElementById('next-btn').classList.remove('active');
            document.getElementById('score').textContent = `${totalTasks}/${totalTasks}`;
            saveProgress('final');
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
                // Показываем экран со стикером для отправки сообщения
                loadScreen('hello_sticker.jpeg');
                break;
            case 3:
                // Показываем экран с текстовым сообщением для отправки фото
                loadScreen('hello_text.jpeg');
                break;
        }
    }
}

// Обновить прогресс
function updateProgress() {
    const progress = (tasksCompleted / totalTasks) * 100;
    document.getElementById('progress').style.width = progress + '%';
}

// Показать/скрыть помощь
function toggleHelp(taskNum) {
    const help = document.getElementById('help' + taskNum);
    help.classList.toggle('active');
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
}

// Поддержка клавиши Enter в модальном окне
document.getElementById('inputField').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        // Для других модальных окон
    }
});