import threading
import asyncio
import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))


def start_flask():
    from main import app
    app.run(debug=True, port=8028, host='127.0.0.1', use_reloader=False)


def start_telegram_bot():
    from bot.bot import run_bot
    asyncio.run(run_bot())


if __name__ == '__main__':
    flask_thread = threading.Thread(target=start_flask, daemon=True)
    flask_thread.start()
    import time

    time.sleep(3)
    start_telegram_bot()



#ffmpeg -i os.mp4 -vcodec libx264 -crf 28 -preset ultrafast -vf scale=640:-1 -acodec aac -b:a 64k -movflags +faststart -y os_fast.mp4