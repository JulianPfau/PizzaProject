import json

import PythonCfg.server as server

messages = {}  # {"Drivers_ID": {"message": messages, "sendTo": []}}


def get(bot, update):
    response = json.loads(server.jsondata({"file": "driver"}))

    if response["STATUS"] == "OK":
        location = None
        json_data = response["jsonData"]
        chat_id = None
        if update.edited_message:
            chat_id = update.edited_message.chat.id
            location = update.edited_message.location
        elif update.message:
            chat_id = update.message.chat.id
            location = update.message.location

        if str(chat_id) in list(json_data.keys()):
            messages[chat_id]["message"] = update
            for to_id in messages[chat_id]["sendTo"]:
                if messages[chat_id]["sendTo"][to_id]:
                    print(messages[chat_id]["sendTo"][to_id])
                    bot.editMessageLiveLocation(chat_id=to_id,
                                                message_id=messages[chat_id]["sendTo"][to_id]["message_id"],
                                                latitude=location.latitude, longitude=location.longitude)
                else:
                    messages[chat_id]["sendTo"][to_id] = bot.sendLocation(chat_id=to_id, latitude=location.latitude,
                                                                          longitude=location.longitude,
                                                                          disable_notification=True, live_period=2700)


def stop_send_live_location_for(bot, chat_id, message_id):
    bot.stopMessageLiveLocation(chat_id=chat_id, message_id=message_id)


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


get_drivers_for_all_order()
