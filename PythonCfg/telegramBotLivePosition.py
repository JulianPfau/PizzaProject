import json

import PythonCfg.server as server

messages = {}  # {"Drivers_ID": {"message": messages, "sendTo": {}}}


def get(bot, update):
    get_drivers_for_all_order()
    location = None
    chat_id = None
    if update.edited_message:
        chat_id = update.edited_message.chat.id
        location = update.edited_message.location
    elif update.message:
        chat_id = update.message.chat.id
        location = update.message.location

    if is_driver(chat_id):
        messages[chat_id]["message"] = update
        for to_id in messages[chat_id]["sendTo"]:
            if messages[chat_id]["sendTo"][to_id]:
                bot.editMessageLiveLocation(chat_id=to_id,
                                            message_id=messages[chat_id]["sendTo"][to_id]["message_id"],
                                            latitude=location.latitude, longitude=location.longitude)
            else:
                messages[chat_id]["sendTo"][to_id] = bot.sendLocation(chat_id=to_id, latitude=location.latitude,
                                                                      longitude=location.longitude,
                                                                      disable_notification=True, live_period=2700)


def deliver(bot, update, args):
    if is_driver(update.message.chat.id) and args:
        order_number = args[0]

        response = json.loads(server.jsondata({"file": "orders"}))
        if response["STATUS"] == "OK":
            json_data = response["jsonData"]
            for order in json_data:
                if order["id"] == order_number:
                    order["delivered"] = True
                    if messages[update.message.chat.id]["sendTo"][order["contact"]["chat_id"]] is None:
                        bot.stopMessageLiveLocation(chat_id=order["contact"]["chat_id"])
                    else:
                        messages[update.message.chat.id]["sendTo"].pop(order["contact"]["chat_id"])
                        bot.stopMessageLiveLocation(chat_id=order["contact"]["chat_id"],
                                                    message_id=messages[update.message.chat.id]["sendTo"][
                                                        order["contact"]["chat_id"]])
                    break


def get_drivers_for_all_order():
    response = json.loads(server.jsondata({"file": "orders"}))
    if response["STATUS"] == "OK":
        orders = response["jsonData"]
        for order in orders:
            if not order["delivered"]:
                if order["driver"]:
                    if not order["driver"] in list(messages.keys()):
                        messages[order["driver"]] = {"message": None, "sendTo": {}}

                    if order["contact"]["chat_id"]:
                        messages[order["driver"]]["sendTo"][order["contact"]["chat_id"]] = None
    # print(messages)


def is_driver(chat_id):
    response = json.loads(server.jsondata({"file": "driver"}))

    if response["STATUS"] == "OK":
        json_data = response["jsonData"]
        return str(chat_id) in list(json_data.keys())
