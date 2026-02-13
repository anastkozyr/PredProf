from pathlib import Path

from aiogram import Bot, Dispatcher, F
from aiogram.filters import CommandStart
from aiogram.types import (
    Message,
    KeyboardButton,
    ReplyKeyboardMarkup,
    ReplyKeyboardRemove, FSInputFile
)
import asyncio

bot_token = '8336363394:AAFgiTERZYZJdd6lxNBNN_kfa3afpCD9DZ4'

bot = Bot(token=bot_token)

dp = Dispatcher()

waiting = set()
ADMIN_CHAT_ID = 2034513673
to_admin = {}

button_1 = KeyboardButton(text='В задании, которое сейчас прохожу')
button_2 = KeyboardButton(text='Узнать, как пользоваться сайтом')

level_1 = KeyboardButton(text='Базовый')
level_2 = KeyboardButton(text='Расширенный')

task_1 = KeyboardButton(text='Основы смартфона, базовый уровень')
task_2 = KeyboardButton(text='MAX, базовый уровень')
task_3 = KeyboardButton(text='Госуслуги, базовый уровень')
task_4 = KeyboardButton(text='Пятерочка, базовый уровень')

adv_1 = KeyboardButton(text='Основы смартфона, расширенный уровень')
adv_2 = KeyboardButton(text='MAX, расширенный уровень')
adv_3 = KeyboardButton(text='Госуслуги, расширенный уровень')
adv_4 = KeyboardButton(text='Пятерочка, расширенный уровень')

help_1 = KeyboardButton(text='Задание не переходит на следующее')
help_2 = KeyboardButton(text='Сменить уровень обучения')
help_3 = KeyboardButton(text='Выйти из аккаунта')
help_4 = KeyboardButton(text='Другой вопрос')

BASE_DIR = Path(__file__).parent

keyboard = ReplyKeyboardMarkup(keyboard=[[button_1, button_2]], resize_keyboard=True)
tasks_keyboard = ReplyKeyboardMarkup(keyboard=[[task_1, task_2, task_3, task_4]], resize_keyboard=True)
help_keyboard = ReplyKeyboardMarkup(keyboard=[[help_1, help_2, help_3, help_4]], resize_keyboard=True)
level_keyboard = ReplyKeyboardMarkup(keyboard=[[level_1, level_2]], resize_keyboard=True)
adv_keyboard = ReplyKeyboardMarkup(keyboard=[[adv_1, adv_2, adv_3, adv_4]], resize_keyboard=True)

@dp.message(CommandStart())
async def start_command(message: Message):
    await message.answer(
        text='Приветствую! В чем Вы бы хотели получить помощь?',
        reply_markup=keyboard
    )


@dp.message(F.text == 'В задании, которое сейчас прохожу')
async def process_yes_answer(message: Message):
    await message.answer(
        text='На каком вы уровне обучения?',
        reply_markup=level_keyboard
    )

@dp.message(F.text == 'Базовый')
async def process_yes_answer_basic(message: Message):
    await message.answer(
        text='С каким заданием возникают трудности?',
        reply_markup=tasks_keyboard
    )

@dp.message(F.text == 'Расширенный')
async def process_yes_answer(message: Message):
    await message.answer(
        text='С каким заданием возникают трудности?',
        reply_markup=adv_keyboard
    )

@dp.message(F.text == 'Узнать, как пользоваться сайтом')
async def process_no_answer(message: Message):
    # ПОМЕНЯТЬ НА НУЖНОЕ ВИДЕО
    await message.answer(
        text='С чем требуется помощь?',
        reply_markup=help_keyboard
    )


@dp.message(F.text == 'Основы смартфона, базовый уровень')
async def os_video_basic(message: Message):
    await message.answer(
        text='Отправляем видео...',
        reply_markup=keyboard
    )
    video = 'BAACAgIAAxkBAAICK2mIten_z01no19JC4zA6r4m63_RAAJUlwAC8LBJSGGeubfb3U58OgQ'
    await bot.send_video(
        chat_id=message.chat.id,
        video=video,
        caption='Видеоинструкция по основам смартфона для базового уровня'
    )


@dp.message(F.text == 'Основы смартфона, расширенный уровень')
async def os_video(message: Message):
    await message.answer(
        text='Отправляем видео...',
        reply_markup=keyboard
    )
    video = 'BAACAgIAAxkBAAICLGmIthqcRirqqAjWdD8NQvHwNOyiAAJXlwAC8LBJSB5rE4qzovGBOgQ'
    await bot.send_video(
        chat_id=message.chat.id,
        video=video,
        caption='Видеоинструкция по основам смартфона для расширенного уровня'
    )

@dp.message(F.text == 'MAX, базовый уровень')
async def max_video_basic(message: Message):
    # ПОМЕНЯТЬ НА НУЖНОЕ ВИДЕО
    await message.answer(
        text='Отправляем видео...',
        reply_markup=keyboard
    )
    video = 'BAACAgIAAxkBAAICX2mIxlzr9GQoeSklbywpkQoTAp7NAAIjmQAC8LBJSLyvrt-mNjagOgQ'
    await bot.send_video(
        chat_id=message.chat.id,
        video=video,
        caption='Видеоинструкция по MAX для базового уровня'
    )

@dp.message(F.text == 'MAX, расширенный уровень')
async def max_video(message: Message):
    # ПОМЕНЯТЬ НА НУЖНОЕ ВИДЕО
    await message.answer(
        text='Отправляем видео...',
        reply_markup=keyboard
    )
    video = 'BAACAgIAAxkBAAICXGmIvy-Zb-dhCl01gbPajKqIjtfmAAJ0mAAC8LBJSHWXuMRB1ktwOgQ'
    await bot.send_video(
        chat_id=message.chat.id,
        video=video,
        caption='Видеоинструкция по MAX для расширенного уровня'
    )

@dp.message(F.text == 'Госуслуги, базовый уровень')
async def gos_video_basic(message: Message):
    # ПОМЕНЯТЬ НА НУЖНОЕ ВИДЕО
    await message.answer(
        text='Отправляем видео...',
        reply_markup=keyboard
    )
    video = 'BAACAgIAAxkBAAICXmmIxgeVSoncy5ZtV1Q7oXoqsTXFAAIUmQAC8LBJSIVs-NueZygoOgQ'
    await bot.send_video(
        chat_id=message.chat.id,
        video=video,
        caption='Видеоинструкция по Госуслугам для базового уровня'
    )

@dp.message(F.text == 'Госуслуги, расширенный уровень')
async def gos_video(message: Message):
    # ПОМЕНЯТЬ НА НУЖНОЕ ВИДЕО
    await message.answer(
        text='Отправляем видео...',
        reply_markup=keyboard
    )
    video = 'BAACAgIAAxkBAAICVWmIvjdF6JT85f311qRQXCf_d9J4AAJWmAAC8LBJSNSnlkxgbaZAOgQ'
    await bot.send_video(
        chat_id=message.chat.id,
        video=video,
        caption='Видеоинструкция по Госуслугам для расширенного уровня'
    )


@dp.message(F.text == 'Пятерочка, базовый уровень')
async def five_video_basic(message: Message):
    # ПОМЕНЯТЬ НА НУЖНОЕ ВИДЕО
    await message.answer(
        text='Отправляем видео...',
        reply_markup=keyboard
    )
    video = 'BAACAgIAAxkBAAICTmmIvOv52X-E1BwyygRhPERGj7LCAAIomAAC8LBJSMAX3XBR9OVhOgQ'
    await bot.send_video(
        chat_id=message.chat.id,
        video=video,
        caption='Видеоинструкция по Пятерочке для базового уровня'
    )

@dp.message(F.text == 'Пятерочка, расширенный уровень')
async def five_video(message: Message):
    # ПОМЕНЯТЬ НА НУЖНОЕ ВИДЕО
    await message.answer(
        text='Отправляем видео...',
        reply_markup=keyboard
    )
    video = 'BAACAgIAAxkBAAICaGmIy6mK5Ux5WsYWbsREAcEluyJ2AAJ9mQAC8LBJSNu-6RIHwxZbOgQ'
    await bot.send_video(
        chat_id=message.chat.id,
        video=video,
        caption='Видеоинструкция по Пятерочке для расширенного уровня'
    )


@dp.message(F.text == 'Задание не переходит на следующее')
async def help_with_path(message: Message):
    # ПОМЕНЯТЬ НА НУЖНОЕ ВИДЕО
    await message.answer(
        text='Попробуйте выйти из тренинга и пройти его заново. Обратите внимание, что после выполнения каждого задания появляется кнопка "Следующее задание". Её нужно нажать, чтобы тренинг продолжился корректно. ',
        reply_markup=keyboard
    )


@dp.message(F.text == 'Сменить уровень обучения')
async def help_change_level(message: Message):
    # ПОМЕНЯТЬ НА НУЖНОЕ ВИДЕО
    await message.answer(
        text='Чтобы сменить уровень обучения, вернитесь к выбору тренинга и нажмите кнопку "Перейти в аккаунт" в правом верхнем углу. В открывшемся профиле есть кнопки выбора уровня, используйте их. Выбранный уровень будет подсвечиваться, поменять его можно в любое время.',
        reply_markup=keyboard
    )


@dp.message(F.text == 'Выйти из аккаунта')
async def help_logout(message: Message):
    # ПОМЕНЯТЬ НА НУЖНОЕ ВИДЕО
    await message.answer(
        text='Чтобы выйти из аккаунта, вернитесь к выбору тренинга и нажмите кнопку "Перейти в аккаунт" в правом верхнем углу. В открывшемся профиле пролистните страницу вниз. Там вы найдете кнопку "Выйти из аккаунта", используйте её.',
        reply_markup=keyboard
    )


@dp.message(F.text == 'Другой вопрос')
async def other_question(message: Message):
    waiting.add(message.chat.id)

    await message.answer(
        text='Напишите свой вопрос, я передам его специалисту...',
        reply_markup=ReplyKeyboardRemove()
    )

@dp.message(F.text & ~F.text.startswith('/') & ~F.text.startswith('+'))
async def question(message: Message):
    admin_message = await bot.send_message(
        ADMIN_CHAT_ID,
        f'новый вопрос от пользователя\n'
        f'ID: {message.chat.id}\n {message.from_user.full_name}\n'
        f'вопрос: {message.text}'
    )
    to_admin[admin_message.message_id] = message.chat.id

    await message.answer(
        text='Спасибо, на Ваш вопрос скоро ответят!',
        reply_markup=keyboard
    )


@dp.message(F.text & F.text.startswith('+'))
async def admin_send(message: Message):
    if message.chat.id != ADMIN_CHAT_ID:
        return
    text = message.text[1:]
    if ':' in text:
        s = text.split(':', 1)
        user_id = s[0].strip()
        reply = s[1].strip()
        await bot.send_message(user_id, f'Ответ специалиста: \n{reply}')
        await message.answer("Ответ отправлен")


async def run_bot():
    await bot.delete_webhook(drop_pending_updates=True)
    await dp.start_polling(bot)


if __name__ == '__main__':
    asyncio.run(run_bot())
