from telegram import Bot, Update, BotCommand, WebAppInfo, ReplyKeyboardMarkup, KeyboardButton
from telegram.ext import Application, CommandHandler, CallbackContext

# Masukkan Token API dari BotFather
TOKEN = "8108942648:AAE9qSze9st-eo2-Nj4OWf71WUqQa5DF4Iw"

# URL GitHub Pages untuk Mini Apps
WEB_APP_URL = "https://irhambitz.github.io/noearn/"

# Fungsi untuk menangani /start
async def start(update: Update, context: CallbackContext):
    chat_id = update.message.chat_id
    
    # Tombol Web App
    keyboard = [[KeyboardButton(text="Buka Mini Apps", web_app=WebAppInfo(url=WEB_APP_URL))]]
    reply_markup = ReplyKeyboardMarkup(keyboard, resize_keyboard=True)

    await context.bot.send_message(
        chat_id=chat_id,
        text="Klik tombol di bawah untuk membuka Mini Apps:",
        reply_markup=reply_markup
    )

# Jalankan bot
app = Application.builder().token(TOKEN).build()
app.add_handler(CommandHandler("start", start))

print("Bot sedang berjalan...")
app.run_polling()
