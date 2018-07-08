from telegram.ext import Updater, CommandHandler, MessageHandler, Filters, CallbackQueryHandler
import json
import threading
import logging

import telegramBotLivePosition
import telegramBotOrder
import telegramBotStart

# Token für den Telegram Bot
TOKEN = "INSERT KEY HERE"

updater = Updater(TOKEN)
logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')


def close_bot(bot, update):
    """
    Function to open the closing-Function in a new thread

    Args:
        bot (telegram.Bot) - The bot that is running
        update (telegram.Update) - Incoming Update
        
    Return:
    """
    update.message.reply_text('Der Bot wird geschlossen. Bis bald!')
    # Opens new thread to stop
    threading.Thread(target=shutdown).start()


def shutdown():
    """
    Closing Function to kill the bot
    
    Args:
    
    Return:
    """
    global updater
    updater.stop()
    updater.is_idle = False


def callback(bot, update):
    """
    Manage the different callback queries

    Args:
        bot (telegram.Bot) - The bot that is running
        update (telegram.Update) - Incoming Update
    
    Return:
    """
    try:
        call = json.loads(update.callback_query.data)
        # Register
        if call["type"] == "reg":
            up = update
            up.callback_query.data = call["id"]
            telegramBotStart.change(bot, up)
        # Driver to order
        elif call["type"] == "driver" or call["type"] == "order":
            telegramBotLivePosition.request_order(bot, update)
    except ValueError:
        # Order
        telegramBotOrder.button(bot, update)


"""Command Handler"""
updater.dispatcher.add_handler(CommandHandler("start", telegramBotStart.start))
updater.dispatcher.add_handler(CommandHandler("order", telegramBotOrder.order))
updater.dispatcher.add_handler(CommandHandler("closeBot", close_bot))
updater.dispatcher.add_handler(CommandHandler("edit", telegramBotStart.edit))
updater.dispatcher.add_handler(CommandHandler("delivered", telegramBotLivePosition.deliver, pass_args=True))
updater.dispatcher.add_handler(CommandHandler("driver", telegramBotLivePosition.add_driver_to_order))
updater.dispatcher.add_handler(CommandHandler("deliverytime", telegramBotLivePosition.delivery_time))

"""Callback query handler"""
updater.dispatcher.add_handler(CallbackQueryHandler(callback))

"""Message handler"""
updater.dispatcher.add_handler(MessageHandler(Filters.location, telegramBotLivePosition.get, edited_updates=True))
updater.dispatcher.add_handler(MessageHandler(Filters.reply, telegramBotStart.reply, edited_updates=True))

updater.start_polling()

print("Bot is running here https://t.me/" + updater.bot.getMe()["username"])
