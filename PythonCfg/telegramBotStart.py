import sys
import threading


chat_id = None


def start(bot, update, user_data):
    global chat_id
    chat_id = update.message.chat_id

    update.message.reply_text('START!')
    update.message.reply_text('Guten Tag bei dem PizzaBot!\nDeine Chat_ID ist: ' + str(chat_id))







