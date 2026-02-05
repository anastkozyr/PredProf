let currentTask = 1;
let tasksCompleted = 0;
let totalTasks = 4;
let currentImage = 'start_page.jpeg';
let stickerSent = false;
let messageSent = false;
let modalAction = null;
let memeberButtons = {
    first: false,
    second: false
};


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
    }, 'final.jpeg': {
        areas: [
            {
                id: 'final-basic',
                top: '1%',
                left: '0%',
                width: '10%',
                height: '5%',
                action: 'Back'
            }
        ]
    },'start.jpeg': {
        areas: [
            {
                id: 'start-advanced',
                top: '1%',
                left: '90%',
                width: '10%',
                height: '5%',
                action: 'Plus'
            }
        ]
    },'new.jpeg': {
        areas: [
            {
                id: 'new-chat',
                top: '7%',
                left: '2%',
                width: '80%',
                height: '5%',
                action: 'CreateChat'
            }
        ]
    }, 'choose_members.jpeg': {
        areas: []
    }, 'rename.jpeg': {
        areas: [
            {
                id: 'rename-chat',
                top: '46%',
                left: '0%',
                width: '98%',
                height: '7%',
                action: 'CreateName'
            }
        ]
    }, 'new_chat.jpeg': {
        areas: [
            {
                id: 'choose-sticker',
                top: '89%',
                left: '0%',
                width: '10%',
                height: '5%',
                action: 'ShowStickers'
            }
        ]
    }, 'choose_sticker.jpeg': {
        areas: [
            {
                id: 'choose-sticker',
                top: '70%',
                left: '0%',
                width: '20%',
                height: '15%',
                action: 'CompleteTrain'
            }
        ]
    },
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

    if (imageName === 'choose_members.jpeg') {
        memberButtonsClicked = { first: false, second: false };
    }


    const config = screenConfigs[imageName];

    // Загружаем фотографию
    document.getElementById('appScreen').innerHTML =
        `<img src="/images/max/${imageName}" alt="Экран приложения"
              onload="initClickableAreas()">`;

    if (imageName === 'hello_sticker.jpeg') {
        addMessageInputField();
    }
    if (imageName === 'rename.jpeg'){
        addNameInput();
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

function addNameInput() {
    const inputContainer = document.createElement('div');
    inputContainer.id = 'InputName';
    inputContainer.style.cssText = `
        position: absolute;
        bottom: 65%;
        left: 2%;
        width: 95%;
        display: flex;
        gap: 10px;
        z-index: 200;
        pointer-events: all;
    `;

    const inputField = document.createElement('input');
    inputField.id = 'nameInput';
    inputField.type = 'text';
    inputField.placeholder = 'Введите название...';
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

    inputField.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            CreateName();
        }
    });
    inputContainer.appendChild(inputField);
    document.getElementById('appScreen').appendChild(inputContainer);

    setTimeout(() => {
        inputField.focus();
    }, 300);
}

// Отправить текстовое сообщение
function sendTextMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();

    if (message.toLowerCase() === 'добрый вечер') {
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

function CreateName() {
    const messageInput = document.getElementById('nameInput');
    const message = messageInput.value.trim();

    if (message.toLowerCase() === 'день рождения') {
        messageSent = true;
        const container = document.getElementById('InputName');
        if (container) {
            container.remove();
        }

        // Переключаем на следующий экран
        setTimeout(() => {
            loadScreen('new_chat.jpeg');
        }, 10);
    } else {
        showNotification('Назовите группу "День рождения"');
        messageInput.focus();
    }
}

// Инициализация кликабельных областей после загрузки изображения
function initClickableAreas() {
    const config = screenConfigs[currentImage];

    if (currentImage === 'choose_members.jpeg') {
        initChooseMembersAreas();
        return;
    }

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

function initChooseMembersAreas() {
    document.getElementById('interactiveOverlay').innerHTML = '';

    const firstButton = document.createElement('div');
    firstButton.className = 'clickable-area active';
    firstButton.innerHTML = '';
    firstButton.style.top = '15%';
    firstButton.style.left = '1%';
    firstButton.style.width = '10%';
    firstButton.style.height = '5%';
    firstButton.id = 'first-member-btn';
    firstButton.onclick = () => handleFirstMemberButton();

    const secondButton = document.createElement('div');
    secondButton.className = 'clickable-area active';
    secondButton.innerHTML = '';
    secondButton.style.top = '38%';
    secondButton.style.left = '0%';
    secondButton.style.width = '10%';
    secondButton.style.height = '5%';
    secondButton.id = 'second-member-btn';
    secondButton.onclick = () => handleSecondMemberButton();

    document.getElementById('interactiveOverlay').appendChild(firstButton);
    document.getElementById('interactiveOverlay').appendChild(secondButton);

    if (memberButtonsClicked.first && memberButtonsClicked.second) {
        const thirdButton = document.createElement('div');
        thirdButton.className = 'clickable-area active';
        thirdButton.innerHTML = '';
        thirdButton.style.top = '86%';
        thirdButton.style.left = '2%';
        thirdButton.style.width = '95%';
        thirdButton.style.height = '7%';
        thirdButton.id = 'third-member-btn';
        thirdButton.onclick = () => handleThirdMemberButton();

        document.getElementById('interactiveOverlay').appendChild(thirdButton);
    }
}

function handleFirstMemberButton() {
    memberButtonsClicked.first = true;
    const firstBtn = document.getElementById('first-member-btn');

    if (memberButtonsClicked.first && memberButtonsClicked.second) {
        initChooseMembersAreas();
    }
}

function handleSecondMemberButton() {
    memberButtonsClicked.second = true;
    const secondBtn = document.getElementById('second-member-btn');

    if (memberButtonsClicked.first && memberButtonsClicked.second) {
        initChooseMembersAreas();
    }
}

function handleThirdMemberButton() {
    Например: loadScreen('rename.jpeg');
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
            }showNotification('Перейдите к следующему заданию');
            break;

        case 'Plus':
            loadScreen('new.jpeg');
            break;

        case 'CreateChat':
            loadScreen('choose_members.jpeg');
            break;

        case 'Back':
            loadScreen('start.jpeg');
            break;

        case 'CreateName':
            CreateName();
            break;

        case 'ShowStickers':
            loadScreen('choose_sticker.jpeg');
            break;

        case 'CompleteTrain':
            loadScreen('final_advanced.jpeg');
            if (currentTask === 4) {
                completeTask(4);
            }showNotification('Тренинг завершен');
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

// Завершить задание
async function completeTask(taskNum) {
    tasksCompleted++;
    updateProgress();

    await saveProgress(taskNum);

    document.getElementById('next-btn').classList.add('active');
    showNotification(`Задание ${taskNum} выполнено!`);

    if (tasksCompleted === totalTasks) {
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
                loadScreen('hello_sticker.jpeg');
                break;
            case 3:
                loadScreen('hello_text.jpeg');
                break;

            case 4:
                loadScreen('final.jpeg');
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