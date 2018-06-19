# -*- coding: iso-8859-1 -*-
import telegram
import os
import json

"""JSON folder location"""
server_dir = os.path.dirname(os.path.abspath(__file__))
server_root = os.path.sep.join(server_dir.split(os.path.sep)[:-1])
json_dir = server_root + "/json/"

"""global variables"""
data = {}  # {chat_id:1, chat_id2: 3}
users = {}
password = []


def start(bot, update):
    """/start starts the register process"""
    global data, users
    chat_id = int(float(update.message.chat_id))

    if registered(chat_id):
        bot.sendMessage(chat_id, "Du bist schon registriert")
    else:
        # Variable to check how far the register process is and weather it is a change of data or the register
        data[chat_id] = {"id": 0, "edit": False}
        if chat_id not in list(users.keys()):
            # Variable where the user json format is initialised
            # Generates an unique id and saves the chat ID
            users[chat_id] = {"id": get_new_id(), "firstname": "", "lastname": "", "email": None, "password": None,
                              "contact": {"name": None, "postcode": None, "street": None, "city": None,
                                          "nr": None, "phone": None, "chat_id": chat_id}}
        bot.sendMessage(chat_id, "Geben Sie bitte Ihren Vornamen ein", reply_markup=telegram.ForceReply(True))


def reply(bot, update):
    """Is called, when somebody reply to an message"""
    """Checks the value that should be inserted or changed"""
    global data, users
    chat_id = update.message.chat_id

    # if user is at this point
    #   saves the input to variable
    #   if it is not an change
    #      the next question is asked
    #      register progress is changed

    # Vorname
    if data[chat_id]["id"] == 0:
        users[chat_id]["firstname"] = update.message.text
        if not data[chat_id]["edit"]:
            bot.sendMessage(chat_id, "Bitte geben Sie Ihren Nachnamen ein", reply_markup=telegram.ForceReply(True))
            data[chat_id]["id"] = 1

    # Nachname
    elif data[chat_id]["id"] == 1:
        users[chat_id]["lastname"] = update.message.text
        if not data[chat_id]["edit"]:
            bot.sendMessage(chat_id, "Was ist Ihre E-Mail Adresse?", reply_markup=telegram.ForceReply(True))
            data[chat_id]["id"] = 2

    # Email
    elif data[chat_id]["id"] == 2:
        users[chat_id]["email"] = update.message.text
        if not data[chat_id]["edit"]:
            bot.sendMessage(chat_id, "Vergeben Sie bitte ein sicheres Passwort", reply_markup=telegram.ForceReply(True))
            data[chat_id]["id"] = 3

    # Password
    elif data[chat_id]["id"] == 3:
        users[chat_id]["password"] = update.message.text
        if not data[chat_id]["edit"]:
            bot.sendMessage(chat_id, "In welcher Stadt haben Sie Ihren Wohnsitz?",
                            reply_markup=telegram.ForceReply(True))
            data[chat_id]["id"] = 4

    # Stadt
    elif data[chat_id]["id"] == 4:
        users[chat_id]["contact"]["city"] = update.message.text
        if not data[chat_id]["edit"]:
            bot.sendMessage(chat_id, "Wie lautet die Postleitzahl Ihres Wohnortes?",
                            reply_markup=telegram.ForceReply(True))
            data[chat_id]["id"] = 5

    # PLZ
    elif data[chat_id]["id"] == 5:
        users[chat_id]["contact"]["postcode"] = int(float(update.message.text))
        if not data[chat_id]["edit"]:
            bot.sendMessage(chat_id, "In welcher Straße wohnen Sie? (ohne Hausnummer)",
                            reply_markup=telegram.ForceReply(True))
            data[chat_id]["id"] = 6

    # Strasse
    elif data[chat_id]["id"] == 6:
        users[chat_id]["contact"]["street"] = update.message.text
        if not data[chat_id]["edit"]:
            bot.sendMessage(chat_id, "Hausnummer", reply_markup=telegram.ForceReply(True))
            data[chat_id]["id"] = 7

    # Nr
    elif data[chat_id]["id"] == 7:
        users[chat_id]["contact"]["nr"] = update.message.text
        if not data[chat_id]["edit"]:
            bot.sendMessage(chat_id, "Unter welcher Nummer sind Sie erreichbar?",
                            reply_markup=telegram.ForceReply(True))
            data[chat_id]["id"] = 8

    # Phone
    elif data[chat_id]["id"] == 8:
        users[chat_id]["contact"]["phone"] = update.message.text
        if not data[chat_id]["edit"]:
            bot.sendMessage(chat_id, "Danke!")
            data[chat_id]["id"] = 9

    # Auto generates the name, from first ans last name
    users[chat_id]["contact"]["name"] = users[chat_id]["firstname"] + " " + users[chat_id]["lastname"]
    data[chat_id]["edit"] = False

    # Saves the progress/changes to the "customers.json"
    with open(json_dir + "customers.json", "r") as f:
        json_data = json.load(f)

    found = False
    for i in range(0, len(json_data)):
        if chat_id == json_data[i]["contact"]["chat_id"]:
            json_data[i] = users[chat_id]
            found = True
            break

    if not found:
        json_data.append(users[chat_id])

    with open(json_dir + "customers.json", "w") as f:
        f.write(json.dumps(json_data))


def edit(bot, update):
    """Starts the progress to change a user data"""
    # Generates the Keyboard
    button_list = [
        # Keyboard button             Text to be displayed     data to be send on click
        #                                                      type to define the function
        #                                                      id the actual needed value
        telegram.InlineKeyboardButton('Vorname', callback_data=json.dumps({'type': 'reg', "id": '0'})),
        telegram.InlineKeyboardButton('Nachname', callback_data=json.dumps({'type': 'reg', "id": '1'})),
        telegram.InlineKeyboardButton('E-Mail', callback_data=json.dumps({'type': 'reg', "id": '2'})),
        telegram.InlineKeyboardButton('Passwort', callback_data=json.dumps({'type': 'reg', "id": '3'})),
        telegram.InlineKeyboardButton('Stadt', callback_data=json.dumps({'type': 'reg', "id": '4'})),
        telegram.InlineKeyboardButton('PLZ', callback_data=json.dumps({'type': 'reg', "id": '5'})),
        telegram.InlineKeyboardButton('Straße', callback_data=json.dumps({'type': 'reg', "id": '6'})),
        telegram.InlineKeyboardButton('Hausnummer', callback_data=json.dumps({'type': 'reg', "id": '7'})),
        telegram.InlineKeyboardButton('Handy Nummer', callback_data=json.dumps({'type': 'reg', "id": '8'})),
        telegram.InlineKeyboardButton('Delete', callback_data=json.dumps({"type": "reg", "id": 'del'}))
    ]

    # Generates a nice keyboard style and adds it to the reply markup
    reply_markup = telegram.InlineKeyboardMarkup(build_menu(button_list, n_cols=2))
    # Sends the keyboard
    bot.sendMessage(update.message.chat.id, "Was möchten sie ändern?", reply_markup=reply_markup)


def change(bot, update):
    """Called on callback query fot changes of user data"""
    global data

    chat_id = update.callback_query.message.chat.id
    int_id = int(float(update.callback_query.data))

    # Adds user to working variables if not there
    if chat_id not in list(users.keys()):
        with(open(json_dir + "customers.json")) as file:
            json_data = json.loads(file.read())

        for i in range(0, len(json_data)):
            if chat_id == json_data[i]["contact"]["chat_id"]:
                users[chat_id] = json_data[i]
                break

    # changes the progress of the registration and send the request for the new value
    if chat_id not in list(data.keys()):
        data[chat_id] = {"id": int_id, "edit": True}
    else:
        data[chat_id]["id"] = int_id
        data[chat_id]["edit"] = True

    bot.sendMessage(chat_id, "Bitte schreib mir deine Änderung nun!", reply_markup=telegram.ForceReply(True))


def get_new_id():
    """Generates new unique ID"""
    with open(json_dir + "customers.json", "r") as f:
        json_data = json.load(f)

    ids = []

    for customer in json_data:
        ids.append(customer["id"])

    customer_id = 1
    while customer_id in ids:
        customer_id += 1

    return customer_id


def build_menu(buttons, n_cols, header_buttons=None, footer_buttons=None):
    """Function to generate a nice keyboard style"""
    # Creates a 2D Array, based on n_cols as column count
    menu = [buttons[i:i + n_cols] for i in range(0, len(buttons), n_cols)]
    if header_buttons:
        menu.insert(0, header_buttons)
    if footer_buttons:
        menu.append(footer_buttons)
    return menu


def registered(chat_id):
    """Checks weather the user with this chat ID is registered or not"""
    # Reads the json file
    with open(json_dir + "customers.json", "r") as f:
        json_data = json.load(f)

    # Loops the json file until found or end
    reg = False
    for entry in json_data:
        if entry["contact"]['chat_id'] == chat_id:
            reg = True
            break
    return reg
