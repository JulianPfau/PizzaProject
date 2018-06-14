import json
import os
import ajaxGoogleAPI

server_dir = os.path.dirname(os.path.abspath(__file__))
server_root = os.path.sep.join(server_dir.split(os.path.sep)[:-1])
img_dir = server_root + "/img/"
json_dir = server_root + "/json/"
pdf_dir = server_root + "/pdf/"

active_deliverys = {}

def get_json(file):
    try:
        with open(json_dir + file + ".json") as json_data:
            d = json.load(json_data)
        response = {
            'STATUS': 'OK',
            'jsonData': d
        }
        return response
    except IOError:
        return False

def write_json(filename, data):
    try:
        with open(json_dir + filename + ".json", "w") as json_data:
            json.dump(data, json_data)
        return True
    except IOError:
        return False

def get(bot, update):
    location = None
    chat_id = None
    if update.edited_message:
        chat_id = update.edited_message.chat.id
        location = update.edited_message.location
    elif update.message:
        chat_id = update.message.chat.id
        location = update.message.location
    
    orders = get_json("orders")["jsonData"]
    for item in orders:
        if item["contact"]["chat_id"] is not None and item["driver"] is None and not item["delivered"]:
            drivers = get_json("driver")["jsonData"]

            for driver in drivers:
                if drivers[driver]["available"]:
                    item["driver"] = driver
                    drivers[driver]["available"] = False
                    drivers[driver]["order_id"] = item["id"]
                    active_deliverys[chat_id] = bot.sendLocation(chat_id=chat_id, latitude=location.latitude,
                                                                      longitude=location.longitude,
                                                                      disable_notification=True, live_period=2700)['message_id']
                    break
    
    
    
            write_json("driver", drivers)
    write_json("orders", orders)
    
    bot.editMessageLiveLocation(chat_id=chat_id, message_id = active_deliverys[chat_id] ,latitude=location.latitude, longitude=location.longitude)
    
def is_driver(chat_id):
    response = get_json("driver")

    if response["STATUS"] == "OK":
        json_data = response["jsonData"]
        return str(chat_id) in list(json_data.keys())

def deliver(bot, update, args):
    if is_driver(update.message.chat.id) and args:
        order_number = args[0]
        response = get_json("orders")
        if response["STATUS"] == "OK":
            json_data = response["jsonData"]
            for order in json_data:
                if order["id"] == order_number and not order["delivered"]:
                    order["delivered"] = True
                    
                    drivers = get_json("driver")["jsonData"]
                    driver = drivers[order["driver"]]
                    driver["available"] = True
                    driver["order_id"] = None
                    
                    bot.send_message(chat_id=order["contact"]["chat_id"], text="Pizza wurde geliefert.")
                    chat_id = order["contact"]["chat_id"]
                    bot.stopMessageLiveLocation(chat_id=chat_id, message_id = active_deliverys[chat_id] )
                    active_deliverys.pop(chat_id, None)
                    write_json("driver", drivers) 
        write_json("orders", json_data)

def delivery_time(bot, update, args):
    chat_id = update.message.chat.id
    orders = get_json("orders")
    waypoints = []
    related_orders = []
    for order in orders['jsonData']: # loop trough all oders
        if order['driver'] == chat_id and not order['delivered']: # get all orders assigned to driver and check if they are already finished
            related_orders.append(order)
    if len(related_orders) != 0:
        if len(waypoints) == 1:
            distance = ajaxGoogleAPI.calcDriveDuration("88045+Fallenbrunnen", [], str(related_orders[0]["contact"]["postcode"] + "+" + related_orders[0]["contact"]["street"]))
        else:
            for o in related_orders:
                waypoints.append(str(o["contact"]["postcode"] + "+" + o["contact"]["street"] + "+" + o["contact"]["nr"]))
            distance = ajaxGoogleAPI.calcDriveDuration("88045+Fallenbrunnen", waypoints, waypoints[len(waypoints) - 1])
        bot.sendMessage(chat_id, ajaxGoogleAPI.calcDriveWay("88045+Fallenbrunnen+2", waypoints, "88045+Fallenbrunnen+2"))
        bot.sendMessage(chat_id, "Die vorraussichtliche Fahrzeit beträgt: " + distance)
    else:
        bot.sendMessage(chat_id, "Aktuell sind keine Bestellungen zugewiesen.")
