import telegram
import json
import os
import datetime

server_dir = os.path.dirname(os.path.abspath(__file__))
server_root = os.path.sep.join(server_dir.split(os.path.sep)[:-1])
json_dir = server_root + "/json/"


def order(bot, update):
    """
    Prints out the Buttons to select Drinks/Food

    Args:
        bot (telegram.Bot) - The bot that is running
        update (telegram.Update) - Incoming Update
    """
    global foodDict, drinksDict
    foodDict = {}
    drinksDict = {}

    # Appends all types from json to variable types
    types = []
    with open(json_dir + 'menu.json') as f:
        data = json.load(f)
    for p in data:
        if p["types"] not in types:
            types.append(p["types"])

    # List of Buttons
    button_list = [
        telegram.InlineKeyboardButton(types[0], callback_data='pizzen'),
        telegram.InlineKeyboardButton(types[1], callback_data='getraenke')]

    # Sending Message and ButtonList
    reply_markup = telegram.InlineKeyboardMarkup(build_menu(button_list, n_cols=2))
    bot.send_message(chat_id=update.message.chat.id, text="Bitte wählen", reply_markup=reply_markup)


def add_to_food_list(chat_id, food):
    """
    Adds an Element to the FoodList of a specific ChatID

    Args:
        chat_id (int) - The ID from the message sender
        food (str) - The food witch should be added to the basket
    """
    if chat_id in foodDict:
        temp_list = foodDict[chat_id]
        temp_list.append(food.replace("_", " | "))
        foodDict[chat_id] = temp_list
    else:
        foodDict[chat_id] = [food.replace("_", " | ")]


def add_to_drinks_list(chat_id, drink):
    """
    Adds an Element to the Drink List of a specific ChatID

    Args:
        chat_id (int) - The ID from the message sender
        drink (str) - The drink witch should be added to the basket
    """
    if chat_id in drinksDict:
        temp_list = drinksDict[chat_id]
        temp_list.append(drink.replace("_", " | "))
        drinksDict[chat_id] = temp_list
    else:
        drinksDict[chat_id] = [drink.replace("_", " | ")]


def button(bot, update):
    """
    Is called on callback

    Args:
        bot (telegram.Bot) - The bot that is running
        update (telegram.Update) - Incoming Update
    """
    # Pizzen
    if update.callback_query.data == "pizzen":
        # Sends all pizzas
        bot.editMessageReplyMarkup(chat_id=update.callback_query.message.chat.id,
                                   message_id=update.callback_query.message.message_id,
                                   text="Bitte wählen sie ihre Pizza",
                                   reply_markup=generate_pizza_button_markup())
    # Getränke
    elif update.callback_query.data == "getraenke":
        # Sends all drinks
        bot.editMessageReplyMarkup(chat_id=update.callback_query.message.chat.id,
                                   message_id=update.callback_query.message.message_id,
                                   text="Bitte wählen sie ihr Getränk",
                                   reply_markup=generate_drinks_buttons_markup())
    # Drinks
    elif update.callback_query.data.startswith('D:'):
        # adds the drink to the order
        add_to_drinks_list(update.callback_query.message.chat.id, update.callback_query.data[2:])
        bot.editMessageText(chat_id=update.callback_query.message.chat.id,
                            message_id=update.callback_query.message.message_id,
                            text="Getränk " + update.callback_query.data[2:] + " erfolgreich hinzugefügt",
                            reply_markup=generate_drinks_buttons_markup())
    # Pizzen
    elif update.callback_query.data.startswith('P:'):
        # adds the pizza to the order
        add_to_food_list(update.callback_query.message.chat.id, update.callback_query.data[2:])
        bot.editMessageText(chat_id=update.callback_query.message.chat.id,
                            message_id=update.callback_query.message.message_id,
                            text="Pizza " + update.callback_query.data[2:] + " erfolgreich hinzugefügt",
                            reply_markup=generate_pizza_button_markup())
    # Submit
    elif update.callback_query.data == 'finish':
        # Summaries the order and calculates the total price
        chat_id = update.callback_query.message.chat.id
        summary = 'Zusammenfassung der Bestellung:\n'
        total = 0.0
        if chat_id in drinksDict:
            summary += 'Getränke:\n'
            for d in drinksDict[chat_id]:
                split = d.split(" | ")
                total += float(split[len(split) - 1][:-1])
                summary += d + '\n'

        if chat_id in foodDict:
            summary += 'Essen:\n'
            for f in foodDict[chat_id]:
                split = f.split(" | ")
                total += float(split[len(split) - 1][:-1])
                summary += f + '\n'

        summary += "Total: " + str(total) + "€"
        button_list = [
            telegram.InlineKeyboardButton('Abbrechen/Neustarten', callback_data="reset"),
            telegram.InlineKeyboardButton('Bestellung abschicken', callback_data="order")
        ]
        # Sends the keyboard and the summary
        reply_markup = telegram.InlineKeyboardMarkup(build_menu(button_list, n_cols=2))
        bot.editMessageText(chat_id=update.callback_query.message.chat.id,
                            message_id=update.callback_query.message.message_id, text=summary,
                            reply_markup=reply_markup)

    elif update.callback_query.data == 'reset':
        # Abort the order process
        bot.editMessageText(chat_id=update.callback_query.message.chat.id,
                            message_id=update.callback_query.message.message_id,
                            text='Zum Neustarten der Bestellung /order eingeben')
    elif update.callback_query.data == 'order':
        # Completes the order
        chat_id = update.callback_query.message.chat.id
        bot.editMessageText(chat_id=chat_id, message_id=update.callback_query.message.message_id,
                            text='Vielen Dank für ihre Bestellung :)')

        # Generates the json for the "order.json"
        timestamp = datetime.datetime.now()
        order_dict = {}
        if chat_id in drinksDict:
            order_dict['drinks'] = drinksDict[chat_id]
        if chat_id in foodDict:
            order_dict['food'] = foodDict[chat_id]
        order_dict['chat_id'] = chat_id
        order_dict['date'] = str(timestamp.date())
        order_dict['time'] = str(timestamp.time())

        # sets the id of the order
        d = datetime.datetime.now()
        id_of_order = str(d.year) + str(d.month) + str(d.day) + str(d.hour) + str(d.minute) + str(d.second)

        # Adds all Items
        items = []
        # Loops all drinks
        if chat_id in list(drinksDict.keys()):
            for p in drinksDict[chat_id]:
                split = p.split('|')
                items = add_to_items(items, split[0][:-1], split[1][1:-1], split[2][1:-1])

        # Loops all food
        if chat_id in list(foodDict.keys()):
            for p in foodDict[chat_id]:
                split = p.split('|')
                items = add_to_items(items, split[0][:-1], split[1][1:-1], split[2][1:-1])

        # Calculates and sends the total price
        total = round(get_total_price(items), 2)
        bot.editMessageReplyMarkup(chat_id=update.callback_query.message.chat.id,
                                   message_id=update.callback_query.message.message_id,
                                   text='Der Gesamtpreis beträgt ' + str(total) + '€')
        # Combines all to the json and appends it to the "orders.json"
        to_json = {'id': id_of_order, 'items': items, 'contact': get_contact_date(chat_id), 'total': str(total),
                   'delivered': False, 'driver': None}
        with open(json_dir + "orders.json", "r") as file:
            tmp_json = json.loads(file.read())
        tmp_json.append(to_json)

        with open(json_dir + "orders.json", "w") as file:
            file.write(json.dumps(tmp_json))


def generate_pizza_button_markup():
    """
    Generates the Buttons for the Pizza Menu

    Returns:
        reply_markup (telegram.ReplyMarkup) - The reply markup for all pizzas in basket
    """
    with open(json_dir + 'menu.json') as f:
        data = json.load(f)
    pizzen = []
    # Loops all pizzas in menu
    for p in data:
        if p["types"] == "Pizza":
            # Appends them to the the "pizzen" variable
            for x in range(len(p["sizes"])):
                app_string = str(p['name']) + '_' + str(p['sizes'][x]) + ' | ' + str(p['prices'][x]) + '€'
                pizzen.append(app_string)
    button_list = []
    # Adds all pizzas to to a keyboard
    for p in pizzen:
        txt = "P:" + p
        button_list.append(
            telegram.InlineKeyboardButton(text=p, callback_data=txt))

    # Footer Buttons
    finish_button = telegram.InlineKeyboardButton("FERTIG", callback_data='finish')
    drink_button = telegram.InlineKeyboardButton("Getränke", callback_data='getraenke')

    # generate ReplyMarkup
    reply_markup = telegram.InlineKeyboardMarkup(
        build_menu(button_list, n_cols=2, footer_buttons=[drink_button, finish_button]))

    return reply_markup


def generate_drinks_buttons_markup():
    """
    Generates the List of the Buttons for the drinks Menu

    Returns:
        reply_markup (telegram.ReplyMarkup) - The reply markup for all drinks in basket
    """
    with open(json_dir + 'menu.json') as f:
        data = json.load(f)
    drinks = []
    # Loops all drinkes from menus
    for p in data:
        if p["types"] == "Getr\u00e4nk":
            # Adds all drinks to "drinks" variable
            for x in range(len(p["sizes"])):
                app_string = str(p['name']) + '_' + str(p['sizes'][x]) + ' | ' + str(p['prices'][x]) + '€'
                drinks.append(app_string)

    button_list = []
    # Adds all drinks to the keyboard
    for d in drinks:
        txt = 'D:' + d
        button_list.append(
            telegram.InlineKeyboardButton(d, callback_data=txt))

    # Footer Buttons
    finish_button = telegram.InlineKeyboardButton("FERTIG",
                                                  callback_data='finish')
    pizza_button = telegram.InlineKeyboardButton("PIZZEN",
                                                 callback_data='pizzen')

    reply_markup = telegram.InlineKeyboardMarkup(
        build_menu(button_list, n_cols=2, footer_buttons=[pizza_button, finish_button]))
    return reply_markup


def build_menu(buttons, n_cols, header_buttons=None, footer_buttons=None):
    """
    Function to generate a nice keyboard style

    Args:
        buttons ([]) - A list of Buttons, that should be rearranged
        n_cols (int) - The number of columns
        header_buttons ([]) - OPTIONAL The buttons that should be in the first row
        footer_buttons ([]) - OPTIONAL The buttons that should be in the last row

    Returns:
        menu ([[]]) - A 2D List rearranged as in Args defined
    """
    # Creates a 2D Array, based on n_cols as column count
    menu = [buttons[i:i + n_cols] for i in range(0, len(buttons), n_cols)]
    if header_buttons:
        menu.insert(0, header_buttons)
    if footer_buttons:
        menu.append(footer_buttons)
    return menu


def add_to_items(items, name, size, price):
    """
    Creates the item dict for the items in orders.json

    Args:
        items ([]) - The list of items
        name (str) - Name of the item
        size (str) - Size of the item
        price (str) - Price of the item

    Returns:
         items ([]) - The list with the generated item dict
    """
    index = items_contains_name(items, name)
    if index == 0:
        temp = {'name': name, 'size': size, 'count': 1, 'price': price}
        items.append(temp)
    else:
        items[index]['count'] = items[index]['count'] + 1
    return items


def items_contains_name(items, name):
    """
    Checks if an item contains name

    Args:
        items ([]) - The list of items in which should be searched
        name (str) - The name which should be searched

    Returns:
        ret (bool) - Weather the name was found or not
    """
    ret = 0
    # Loops all items and saves the searched one
    for x in range(len(items)):
        if items[x]['name'] == name:
            ret = x
    return ret


def get_total_price(items):
    """
    Calculates a total price

    Args:
        items ([]) - List of items, which should be looped

    Returns:
        total (float) - The total price of all items
    """
    total = 0
    # Loops all items and add the price to total
    for i in items:
        total += float(i['price'])
    return total


def get_contact_date(chat_id):
    """
    Creates the dict for the contact from order.json

    Args:
        chat_id (int) - The chat ID of contact that should be searched

    Returns:
        contact (dict) - The dict of the contact
    """
    # Reads the customers.json
    with open(json_dir + 'customers.json') as f:
        data = json.load(f)
    contact = None
    for d in data:
        # Searches the correct customer and returns all his values
        if d['contact']['chat_id'] == chat_id:
            contact = {'name': d['contact']['name'], 'postcode': d['contact']['postcode'],
                       'street': d['contact']['street'], 'city': d['contact']['city'], 'nr': d['contact']['nr'],
                       'phone': d['contact']['phone'], 'chat_id': d['contact']['chat_id']}
            break

    return contact
