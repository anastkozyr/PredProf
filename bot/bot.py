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

button_1 = KeyboardButton(text='В задании, которое сейчас прохожу')
button_2 = KeyboardButton(text='Узнать, как пользоваться сайтом')

task_1 = KeyboardButton(text='Основы смартфона')
task_2 = KeyboardButton(text='MAX')
task_3 = KeyboardButton(text='Госуслуги')
task_4 = KeyboardButton(text='Пятерочка')

BASE_DIR = Path(__file__).parent

keyboard = ReplyKeyboardMarkup(keyboard=[[button_1, button_2]], resize_keyboard=True)
tasks_keyboard = ReplyKeyboardMarkup(keyboard=[[task_1, task_2, task_3, task_4]], resize_keyboard=True)


@dp.message(CommandStart())
async def start_command(message: Message):
    await message.answer(
        text='Приветствую! В чем Вы бы хотели получить помощь?',
        reply_markup=keyboard
    )


@dp.message(F.text == 'В задании, которое сейчас прохожу')
async def process_yes_answer(message: Message):
    await message.answer(
        text='С каким заданием возникают трудности?',
        reply_markup=tasks_keyboard
    )


@dp.message(F.text == 'Узнать, как пользоваться сайтом')
async def process_no_answer(message: Message):
    # ПОМЕНЯТЬ НА НУЖНОЕ ВИДЕО
    video = FSInputFile(path=f'{BASE_DIR}/videos/os.mp4')
    await bot.send_video(
        chat_id=message.chat.id,
        video=video,
        caption='Видеоинструкция по использованию сайта',
        reply_markup=ReplyKeyboardRemove()
    )


@dp.message(F.text == 'Основы смартфона')
async def os_video(message: Message):
    # ПОМЕНЯТЬ НА НУЖНОЕ ВИДЕО
    video = FSInputFile(path=f'{BASE_DIR}/videos/os.mp4')
    await bot.send_video(
        chat_id=message.chat.id,
        video=video,
        caption='Видеоинструкция по основам смартфона',
        reply_markup=ReplyKeyboardRemove()
    )


@dp.message(F.text == 'MAX')
async def max_video(message: Message):
    # ПОМЕНЯТЬ НА НУЖНОЕ ВИДЕО
    video = FSInputFile(path=f'{BASE_DIR}/videos/os.mp4')
    await bot.send_video(
        chat_id=message.chat.id,
        video=video,
        caption='Видеоинструкция по MAX',
        reply_markup=ReplyKeyboardRemove()
    )


@dp.message(F.text == 'Госуслуги')
async def gos_video(message: Message):
    # ПОМЕНЯТЬ НА НУЖНОЕ ВИДЕО
    video = FSInputFile(path=f'{BASE_DIR}/videos/os.mp4')
    await bot.send_video(
        chat_id=message.chat.id,
        video=video,
        caption='Видеоинструкция по Госуслугам',
        reply_markup=ReplyKeyboardRemove()
    )


@dp.message(F.text == 'Пятерочка')
async def five_video(message: Message):
    # ПОМЕНЯТЬ НА НУЖНОЕ ВИДЕО
    video = FSInputFile(path=f'{BASE_DIR}/videos/os.mp4')
    await bot.send_video(
        chat_id=message.chat.id,
        video=video,
        caption='Видеоинструкция по Пятерочке',
        reply_markup=ReplyKeyboardRemove()
    )


async def run_bot():
    await dp.start_polling(bot)


if __name__ == '__main__':
    asyncio.run(run_bot())
