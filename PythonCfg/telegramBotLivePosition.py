import json
import os
import ajaxGoogleAPI
import telegram

# JSON directory
server_dir = os.path.dirname(os.path.abspath(__file__))
server_root = os.path.sep.join(server_dir.split(os.path.sep)[:-1])
json_dir = server_root + "/json/"

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
    """
    Writes a string to a json file.

    Args:
        filename (str): filename
        data (dict): data in form of a json string

    Returns:
        boolean:     Successful: True, else: False
    """
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
    # Saves the location and the chat ID
    location = None
    chat_id = None
    if update.edited_message:
        chat_id = update.edited_message.chat.id
        location = update.edited_message.location
    elif update.message:
        chat_id = update.message.chat.id
        location = update.message.location

    # Saves the orders
    orders = get_json("orders")["jsonData"]
    # Loops all orders
    for item in orders:
        # If the order has an chat ID, a driver and isn't delivered yet
        if item["contact"]["chat_id"] is not None and item["driver"] is None and not item["delivered"]:
            # Saves all drivers
            drivers = get_json("driver")["jsonData"]
            # Loops all drivers
            for driver in drivers:
                # if driver is available
                if drivers[driver]["available"]:
                    # Adds a driver to an order
                    item["driver"] = driver
                    drivers[driver]["available"] = False
                    drivers[driver]["order_id"] = item["id"]
                    # Sends the Live Location from the driver to the customer
                    tmp = []
                    tmp.append(bot.sendLocation(chat_id=item["contact"]["chat_id"], latitude=location.latitude,
                                                longitude=location.longitude,
                                                disable_notification=True,
                                                live_period=2700)['message_id'])
                    tmp.append(item["contact"]["chat_id"])
                    active_deliverys[chat_id] = tmp
                    bot.send_message(chat_id=driver,
                                     text="Die nächste Bestellung hat die Bestellnummer {}.\n{}\nTo mark as delivered, "
                                          "type: \n'/delivered {}'".format(item["id"],
                                                                           pp_address(item), item["id"]))
                    break
            # Saves the drivers
            write_json("driver", drivers)
    # Saves the orders
    write_json("orders", orders)

    # Keeps the Live Location live
    bot.editMessageLiveLocation(chat_id=active_deliverys[chat_id][1], message_id=active_deliverys[chat_id][0],
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
    global active_deliverys
    # Checks if sender is an driver and has send an order number
    if is_driver(update.message.chat.id) and args:
        # Gets the orders
        order_number = args[0]
        response = get_json("orders")
        if response["STATUS"] == "OK":
            # Saves the orders
            json_data = response["jsonData"]
            # Loops the orders
            for order in json_data:
                # Search the correct order
                if order["id"] == order_number and not order["delivered"]:
                    # Marks the order as delivered
                    order["delivered"] = True

                    # Sets the driver as free
                    drivers = get_json("driver")["jsonData"]
                    driver = drivers[order["driver"]]
                    driver["available"] = True
                    driver["order_id"] = None

                    # Informs the user and stops the Live Location
                    bot.send_message(chat_id=order["contact"]["chat_id"], text="Pizza wurde geliefert.")
                    bot.stopMessageLiveLocation(chat_id=order["contact"]["chat_id"],
                                                message_id=active_deliverys[int(order["driver"])][0])
                    active_deliverys.pop(int(order["driver"]), None)

                    # Saves the driver
                    write_json("driver", drivers)
        # Saves the orders
        write_json("orders", json_data)


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
    # Loops all orders
    for order in orders['jsonData']:  # loop trough all oders
        # get all orders assigned to driver and check if they are already finished
        if order['driver'] == chat_id and not order['delivered']:
            related_orders.append(order)
    # If has orders
    if len(related_orders) != 0:
        # Has one stop
        if len(waypoints) == 1:
            # gets the distance to the destination
            distance = ajaxGoogleAPI.calcDriveDuration("88045+Fallenbrunnen", [], str(
                related_orders[0]["contact"]["postcode"] + "+" + related_orders[0]["contact"]["street"]))
        else:
            # Loops all stops
            for o in related_orders:
                # Add stop to list
                waypoints.append(
                    str(o["contact"]["postcode"] + "+" + o["contact"]["street"] + "+" + o["contact"]["nr"]))
            distance = ajaxGoogleAPI.calcDriveDuration("88045+Fallenbrunnen", waypoints, waypoints[len(waypoints) - 1])
        # Sends the route
        bot.sendMessage(chat_id,
                        ajaxGoogleAPI.calcDriveWay("88045+Fallenbrunnen+2", waypoints, "88045+Fallenbrunnen+2"))
        bot.sendMessage(chat_id, "Die vorraussichtliche Fahrzeit beträgt: " + distance)
    else:
        bot.sendMessage(chat_id, "Aktuell sind keine Bestellungen zugewiesen.")


def add_driver_to_order(bot, update):
    """Connects a driver with an user"""
    drivers = get_json("driver")
    button_list = []
    data = {"type": "driver"}
    # Loops all drivers
    for d in drivers["jsonData"]:
        # Creates for each a button
        data["id"] = d
        button = telegram.InlineKeyboardButton(str(drivers["jsonData"][d]["name"]), callback_data=json.dumps(data))
        button_list.append(button)
    # Send the Keyboard witch all drivers
    reply_markup = telegram.InlineKeyboardMarkup([button_list])
    update.message.reply_text('Please choose: ', reply_markup=reply_markup)


def request_order(bot, update):
    """Is called when a driver is selected to add him to an order"""
    q_data = json.loads(update.callback_query.data)
    orders = get_json("orders")

    # Checks if callback is for this function
    if q_data["type"] == "driver":
        button_list = []
        data = {}
        data["type"] = "order"
        data["id"] = q_data["id"]
        # Loops all orders without an driver and that are not delivered
        for i in range(0, len(orders["jsonData"])):
            if not orders["jsonData"][i]['driver'] and not orders["jsonData"][i]['delivered']:
                # Adds those orders to the keyboard
                data["order_id"] = orders["jsonData"][i]["id"]
                button = telegram.InlineKeyboardButton(str(orders["jsonData"][i]["contact"]["name"]),
                                                       callback_data=json.dumps(data))
                button_list.append(button)
        # IF Keyboard isn't empty
        if len(button_list) > 0:
            # Sends orders as keyboard
            reply_markup = telegram.InlineKeyboardMarkup([button_list])
            bot.editMessageText(chat_id=update.callback_query.message.chat.id,
                                message_id=update.callback_query.message.message_id,
                                text="Select an order", reply_markup=reply_markup)
        else:
            # Sends no order there
            bot.editMessageText(chat_id=update.callback_query.message.chat.id,
                                message_id=update.callback_query.message.message_id, text="No open orders")

    elif q_data["type"] == "order":
        driver_id = q_data["id"]
        order_id = q_data["order_id"]
        # Loops all orders
        for i in range(0, len(orders["jsonData"])):
            # Adds driver to order
            if orders["jsonData"][i]["id"] == order_id:
                orders["jsonData"][i]["driver"] = driver_id
        write_json("orders", orders["jsonData"])
        bot.editMessageText(chat_id=update.callback_query.message.chat.id,
                            message_id=update.callback_query.message.message_id,
                            text="Order " + order_id + " wurde dem Fahrer " + driver_id + " zugewiesen")
