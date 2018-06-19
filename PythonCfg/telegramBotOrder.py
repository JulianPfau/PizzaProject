import telegram
import json
import os
import datetime

server_dir = os.path.dirname(os.path.abspath(__file__))
server_root = os.path.sep.join(server_dir.split(os.path.sep)[:-1])
json_dir = server_root + "/json/"


# Order-Command, # prints out the Buttons to select Drinks/Food
def order(bot, update):
    global foodDict, drinksDict
    foodDict = {}
    drinksDict = {}

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


# adds an Element to the FoodList of a specific ChatID
def add_to_food_list(chat_id, food):
    if chat_id in foodDict:
        temp_list = foodDict[chat_id]
        temp_list.append(food.replace("_", " | "))
        foodDict[chat_id] = temp_list
    else:
        foodDict[chat_id] = [food.replace("_", " | ")]


# adds an Element to the Drink List of a specific ChatID
def add_to_drinks_list(chat_id, drink):
    if chat_id in drinksDict:
        # print('Added Drink; exisitng ID')
        temp_list = drinksDict[chat_id]
        temp_list.append(drink.replace("_", " | "))
        # print(str(drink).split('_'))
        drinksDict[chat_id] = temp_list
    else:
        # print("added drink, new id")
        drinksDict[chat_id] = [drink.replace("_", " | ")]


# processes the Callbacks
def button(bot, update):
    if update.callback_query.data == "pizzen":
        bot.send_message(chat_id=update.callback_query.message.chat.id, text="Bitte wählen sie ihre Pizza",
                         reply_markup=generate_pizza_button_markup())
    elif update.callback_query.data == "getraenke":
        bot.send_message(chat_id=update.callback_query.message.chat.id, text="Bitte wählen sie ihr Getränk",
                         reply_markup=generate_drinks_buttons_markup())
    elif update.callback_query.data.startswith('D:'):
        add_to_drinks_list(update.callback_query.message.chat.id, update.callback_query.data[2:])
        bot.send_message(chat_id=update.callback_query.message.chat.id,
                         text="Getränk " + update.callback_query.data[2:] + " erfolgreich hinzugefügt",
                         reply_markup=generate_drinks_buttons_markup())
    elif update.callback_query.data.startswith('P:'):
        add_to_food_list(update.callback_query.message.chat.id, update.callback_query.data[2:])
        bot.send_message(chat_id=update.callback_query.message.chat.id,
                         text="Pizza " + update.callback_query.data[2:] + " erfolgreich hinzugefügt",
                         reply_markup=generate_pizza_button_markup())

    elif update.callback_query.data == 'finish':
        chat_id = update.callback_query.message.chat.id
        summary = 'Zusammenfassung der Bestellung:\n'
        # print(drinksDict)
        if chat_id in drinksDict:
            summary += 'Getränke:\n'
            for d in drinksDict[chat_id]:
                # print("here")
                summary += d + '\n'
        if chat_id in foodDict:
            summary += 'Essen:\n'
            for f in foodDict[chat_id]:
                summary += f + '\n'
        button_list = [
            telegram.InlineKeyboardButton('Abbrechen/Neustarten', callback_data="reset"),
            telegram.InlineKeyboardButton('Bestellung abschicken', callback_data="order")
        ]

        reply_markup = telegram.InlineKeyboardMarkup(build_menu(button_list, n_cols=2))
        bot.send_message(chat_id=update.callback_query.message.chat.id, text=summary, reply_markup=reply_markup)

    elif update.callback_query.data == 'reset':
        # del food[:]
        # del drinks[:]
        # t.clear()
        bot.send_message(chat_id=update.callback_query.message.chat.id,
                         text='Zum Neustarten der Bestellung /order eingeben')
    elif update.callback_query.data == 'order':
        chat_id = update.callback_query.message.chat.id
        bot.send_message(chat_id=chat_id,
                         text='Vielen Dank für ihre Bestellung :)')
        timestamp = datetime.datetime.now()
        order_dict = {}
        if chat_id in drinksDict:
            order_dict['drinks'] = drinksDict[chat_id]
        print(order_dict)
        if chat_id in foodDict:
            order_dict['food'] = foodDict[chat_id]
        order_dict['chat_id'] = chat_id
        order_dict['date'] = str(timestamp.date())
        order_dict['time'] = str(timestamp.time())

        d = datetime.datetime.now()
        user_id = str(d.year) + str(d.month) + str(d.day) + str(d.hour) + str(d.minute) + str(d.second)

        items = []
        print(chat_id in list(drinksDict.keys()))
        if chat_id in list(drinksDict.keys()):
            for p in drinksDict[chat_id]:
                split = p.split('|')
                items = add_to_items(items, split[0][:-1], split[1][1:-1], split[2][1:-1])

        if chat_id in list(foodDict.keys()):
            for p in foodDict[chat_id]:
                split = p.split('|')
                items = add_to_items(items, split[0][:-1], split[1][1:-1], split[2][1:-1])
        print("ASD")
        total = round(get_total_price(items), 2)
        print(total)
        bot.send_message(chat_id=update.callback_query.message.chat.id,
                         text='Der Gesamtpreis beträgt ' + str(total) + '€')

        to_json = {'id': user_id, 'items': items, 'contact': get_contact_date(chat_id), 'total': str(total),
                   'delivered': False, 'driver': None}
        print(to_json)
        with open(json_dir + "orders.json", "r") as file:
            tmp_json = json.loads(file.read())

        tmp_json.append(to_json)

        with open(json_dir + "orders.json", "w") as file:
            file.write(json.dumps(tmp_json))


# Generates the Buttons for the Pizza Menu
def generate_pizza_button_markup():
    with open(json_dir + 'menu.json') as f:
        data = json.load(f)
    pizzen = []
    for p in data:
        if p["types"] == "Pizza":
            for x in range(len(p["sizes"])):
                app_string = str(p['name']) + '_' + str(p['sizes'][x]) + ' | ' + str(p['prices'][x]) + '€'
                pizzen.append(app_string)
    button_list = []
    for p in pizzen:
        # txt = json.dumps({"type": "bestell", "id": ("P:" + p)})
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


# Generates the List of the Buttons for the drinks Menu
def generate_drinks_buttons_markup():
    with open(json_dir + 'menu.json') as f:
        data = json.load(f)
    drinks = []
    for p in data:
        if p["types"] == "Getr\u00e4nk":
            for x in range(len(p["sizes"])):
                app_string = str(p['name']) + '_' + str(p['sizes'][x]) + ' | ' + str(p['prices'][x]) + '€'
                drinks.append(app_string)

    button_list = []
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


# helper Function for Building the InlineButtons
def build_menu(buttons,
               n_cols,
               header_buttons=None,
               footer_buttons=None):
    menu = [buttons[i:i + n_cols] for i in range(0, len(buttons), n_cols)]
    if header_buttons:
        menu.insert(0, header_buttons)
    if footer_buttons:
        menu.append(footer_buttons)
    return menu


def add_to_items(items, name, size, price):
    index = items_contains_name(items, name)
    if index == 0:
        temp = {'name': name, 'size': size, 'count': 1, 'price': price}
        items.append(temp)
    else:
        items[index]['count'] = items[index]['count'] + 1
    return items


def items_contains_name(items, name):
    ret = 0
    for x in range(len(items)):
        if items[x]['name'] == name:
            ret = x
    return ret


def get_total_price(items):
    total = 0
    for i in items:
        print(i)
        total += float(i['price'])
    return total


def get_contact_date(chat_id):
    with open(json_dir + 'customers.json') as f:
        data = json.load(f)
    found = False
    for d in data:
        if d['contact']['chat_id'] == chat_id:
            found = True
            contact = {'name': d['contact']['name'], 'postcode': d['contact']['postcode'],
                       'street': d['contact']['street'], 'city': d['contact']['city'], 'nr': d['contact']['nr'],
                       'phone': d['contact']['phone'], 'chat_id': d['contact']['chat_id']}

    if found:
        return contact
    else:
        return "No Data"

