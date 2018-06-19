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
        telegram.InlineKeyboardButton(types[0], callback_data="pizzen"),
        telegram.InlineKeyboardButton(types[1], callback_data="getraenke")]

    # Sending Message and ButtonList
    reply_markup = telegram.InlineKeyboardMarkup(build_menu(button_list, n_cols=2))
    bot.send_message(chat_id=update.message.chat.id, text="Bitte wählen", reply_markup=reply_markup)


# adds an Element to the FoodList of a specific ChatID
def add_to_food_list(chat_id, food):
    if chat_id in foodDict:
        temp_list = foodDict[chat_id]
        temp_list.append(str(food).split('_')[0])
        foodDict[chat_id] = temp_list
    else:
        foodDict[chat_id] = [str(food).split('_')[0]]


# adds an Element to the Drink List of a specific ChatID
def add_to_drinks_list(chat_id, drink):
    if chat_id in drinksDict:
        # print('Added Drink; exisitng ID')
        temp_list = drinksDict[chat_id]
        temp_list.append(str(drink).split('_')[0])
        # print(str(drink).split('_'))
        drinksDict[chat_id] = temp_list
    else:
        # print("added drink, new id")
        drinksDict[chat_id] = [str(drink).split('_')[0]]


# processes the Callbacks
def button(bot, update):
    if update.callback_query.data == "pizzen":
        bot.send_message(chat_id=update.callback_query.message.chat.id, text="Bitte wählen sie ihre Pizza",
                         reply_markup=generate_pizza_button_markup())
    if update.callback_query.data == "getraenke":
        bot.send_message(chat_id=update.callback_query.message.chat.id, text="Bitte wählen sie ihr Getränk",
                         reply_markup=generate_drinks_buttons_markup())
    if update.callback_query.data.startswith('D:'):
        add_to_drinks_list(update.callback_query.message.chat.id, update.callback_query.data[2:])
        bot.send_message(chat_id=update.callback_query.message.chat.id,
                         text="Getränk " + update.callback_query.data[2:] + " erfolgreich hinzugefügt",
                         reply_markup=generate_drinks_buttons_markup())
    if update.callback_query.data.startswith('P:'):
        add_to_food_list(update.callback_query.message.chat.id, update.callback_query.data[2:])
        bot.send_message(chat_id=update.callback_query.message.chat.id,
                         text="Pizza " + update.callback_query.data[2:] + " erfolgreich hinzugefügt",
                         reply_markup=generate_pizza_button_markup())

    if update.callback_query.data == 'finish':
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
            telegram.InlineKeyboardButton('Abbrechen/Neustarten', callback_data='reset'),
            telegram.InlineKeyboardButton('Bestellung abschicken', callback_data='order')
        ]

        reply_markup = telegram.InlineKeyboardMarkup(build_menu(button_list, n_cols=2))
        bot.send_message(chat_id=update.callback_query.message.chat.id, text=summary, reply_markup=reply_markup)

    if update.callback_query.data == 'reset':
        # del food[:]
        # del drinks[:]
        # t.clear()
        bot.send_message(chat_id=update.callback_query.message.chat.id,
                         text='Zum Neustarten der Bestellung /order eingeben')
    if update.callback_query.data == 'order':
        bot.send_message(chat_id=update.callback_query.message.chat.id,
                         text='Vielen Dank für ihre Bestellung :)')
        chat_id = update.callback_query.message.chat.id
        timestamp = datetime.datetime.now()
        order_dict = {}
        if chat_id in drinksDict:
            order_dict['drinks'] = drinksDict[chat_id]
        if chat_id in foodDict:
            order_dict['food'] = foodDict[chat_id]
        order_dict['chat_id'] = chat_id
        order_dict['date'] = str(timestamp.date())
        order_dict['time'] = str(timestamp.time())

        real = {
            "id": str(timestamp.date()).replace("-", "") + str(timestamp.hour) + str(timestamp.minute),
            "items": [
                {
                    "name": "Salami",
                    "extras": [],
                    "size": "klein",
                    "count": "9",
                    "price": 4.99
                }
            ],
            "contact": {
                "name": "Max Musterman",
                "postcode": "88048",
                "street": "a",
                "city": "Friedrichshafen",
                "nr": "1",
                "phone": "123",
                "zahlung": "American Express",
                "chat_id": chat_id
            },
            "total": 0.0,
            "delivered": False
        }

        filename = str(chat_id) + str(timestamp.date()) + '_' + str(timestamp.time().hour) + '-' + str(
            timestamp.time().minute) + '.json'
        file = open(json_dir + filename, 'w')
        json.dump(order_dict, file)


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
        button_list.append(telegram.InlineKeyboardButton(p, callback_data='P:' + p))

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
        button_list.append(telegram.InlineKeyboardButton(d, callback_data='D:' + d))
    finish_button = telegram.InlineKeyboardButton("FERTIG", callback_data='finish')
    pizza_button = telegram.InlineKeyboardButton("Pizzen", callback_data='pizzen')

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
