import threading
import asyncio
import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))


def start_flask():
    from main import app
    port = int(os.environ.get("PORT", 10000))
    app.run(host='0.0.0.0', port=port)


def start_telegram_bot():
    from bot.bot import run_bot
    asyncio.run(run_bot())


if __name__ == '__main__':
    flask_thread = threading.Thread(target=start_flask, daemon=True)
    flask_thread.start()
    import time

    time.sleep(5)
    start_telegram_bot()



#ffmpeg -i os.mp4 -vcodec libx264 -crf 28 -preset ultrafast -vf scale=640:-1 -acodec aac -b:a 64k -movflags +faststart -y os_fast.mp4