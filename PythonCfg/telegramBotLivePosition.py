import json
import os
import ajaxGoogleAPI

server_dir = os.path.dirname(os.path.abspath(__file__))
server_root = os.path.sep.join(server_dir.split(os.path.sep)[:-1])
img_dir = server_root + "/img/"
json_dir = server_root + "/json/"
pdf_dir = server_root + "/pdf/"

active_deliveries = {}  # { "driver_id" : ["mesage_id", customer_id]}


def get_json(filename):
    """
    Reads a json file basend on the filename

    Args:
        filename (str): filename

    Returns:
        dict: STATUS:OK and d:String of the file
    """
    try:
        with open(json_dir + filename + ".json") as json_data:
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
    """
    Assigns Orders to drivers ans send the customer the live locations.
    Updates the location of the driver if a new one is send.

    Args:
        bot (class): Class of the bot in use
        update (dict?): last update of the bot

    Returns:
    """
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
                    tmp = [bot.sendLocation(chat_id=item["contact"]["chat_id"], latitude=location.latitude,
                                            longitude=location.longitude,
                                            disable_notification=True, live_period=2700)['message_id'],
                           item["contact"]["chat_id"]]
                    active_deliveries[chat_id] = tmp
                    bot.send_message(chat_id=driver,
                                     text="Die nächste Bestellung hat die Bestellnummer {}.\n{}\nTo mark as delivered, "
                                          "type: \n'/delivered {}'".format(item["id"], pp_address(item), item["id"]))
                    break

            write_json("driver", drivers)
    write_json("orders", orders)

    bot.editMessageLiveLocation(chat_id=active_deliveries[chat_id][1], message_id=active_deliveries[chat_id][0],
                                latitude=location.latitude, longitude=location.longitude)


def pp_address(order):
    """
    Returns a nice to look version of adress formations

    Args:
        order (dict): contains all the informations about the order

    Returns:
        str: pretty printed informations
    """
    return "Kontakt ist {},\nTel. {},\nDie Addresse ist \n{} {},\n{} {},\nZahlung: {}".format(order["contact"]["name"],
                                                                                              order["contact"]["phone"],
                                                                                              order["contact"][
                                                                                                  "street"],
                                                                                              order["contact"]["nr"],
                                                                                              order["contact"][
                                                                                                  "postcode"],
                                                                                              order["contact"]["city"],
                                                                                              order["contact"][
                                                                                                  "zahlung"])


def is_driver(chat_id):
    """
    test ist the user who wrote the bot is a driver.

    Args:
        chat_id (str): chat_id of messager

    Returns:
        boolean: Driver true, no driver: false
    """
    response = get_json("driver")

    if response["STATUS"] == "OK":
        json_data = response["jsonData"]
        return str(chat_id) in list(json_data.keys())


def deliver(bot, update, args):
    """
    Deletes a Order form tmp storage, stops the live location, marks the order as delivered,
    sends the customer a notification.
    Reassigns a ne order.

    Args:
        bot (class): Class of the bot in use
        update (dict?): last update of the bot
        args (list): fist element should contain the orderid

    Returns:
        message to customer that pizza is delivered
    """
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
                    bot.stopMessageLiveLocation(chat_id=chat_id, message_id=active_deliveries[chat_id])
                    active_deliveries.pop(chat_id, None)
                    write_json("driver", drivers)
            write_json("orders", json_data)
    get(bot, update)


def delivery_time(bot, update):
    """
    Sends the driver a estimated deliverytime and the best route to drive (based on google maps api)

    Args:
        bot (class): Class of the bot in use
        update (dict?): last update of the bot

    Returns:
    """
    chat_id = update.message.chat.id
    orders = get_json("orders")
    waypoints = []
    related_orders = []
    for order in orders['jsonData']:  # loop trough all oders
        # get all orders assigned to driver and check if they are already finished
        if order['driver'] == chat_id and not order['delivered']:
            related_orders.append(order)
    if len(related_orders) != 0:
        if len(waypoints) == 1:
            distance = ajaxGoogleAPI.calcDriveDuration("88045+Fallenbrunnen", [], str(
                related_orders[0]["contact"]["postcode"] + "+" + related_orders[0]["contact"]["street"]))
        else:
            for o in related_orders:
                waypoints.append(
                    str(o["contact"]["postcode"] + "+" + o["contact"]["street"] + "+" + o["contact"]["nr"]))
            distance = ajaxGoogleAPI.calcDriveDuration("88045+Fallenbrunnen", waypoints, waypoints[len(waypoints) - 1])
        bot.sendMessage(chat_id,
                        ajaxGoogleAPI.calcDriveWay("88045+Fallenbrunnen+2", waypoints, "88045+Fallenbrunnen+2"))
        bot.sendMessage(chat_id, "Die vorraussichtliche Fahrzeit beträgt: " + distance)
    else:
        bot.sendMessage(chat_id, "Aktuell sind keine Bestellungen zugewiesen.")
