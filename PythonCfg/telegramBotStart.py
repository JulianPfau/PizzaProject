# -*- coding: iso-8859-1 -*-
import telegram
import os
import json

server_dir = os.path.dirname(os.path.abspath(__file__))
server_root = os.path.sep.join(server_dir.split(os.path.sep)[:-1])
json_dir = server_root + "/json/"

data = {}  # {chat_id:1, chat_id2: 3}
users = {}
password = []


def start(bot, update):
    global data, users, registered
    chat_id = update.message.chat_id

    with open(json_dir + "customers.json", "r") as f:
        json_data = json.load(f)

    for entry in json_data:
            if entry['chat_id'] == chat_id:
                registered = True
                break
            else:
                registered = False

    if registered:
        bot.sendMessage(chat_id, "Du bist schon registriert")
    else:
        bot.sendMessage(chat_id, "Geben Sie bitte Ihren Vornamen ein", reply_markup=telegram.ForceReply(True))
        data[chat_id] = 0
        if chat_id not in list(users.keys()):
            users[chat_id] = {
                "id": None,
                "firstname": None,
                "lastname": None,
                "email": None,
                "password": None,
                "chat_id": chat_id,
                "contact": {
                    "name": None,
                    "postcode": None,
                    "street": None,
                    "city": None,
                    "nr": None,
                    "phone": None
                }
            }


def reply(bot, update):
    global data, users
    chat_id = update.message.chat_id

    # Vorname
    if data[chat_id] == 0:
        users[chat_id]["firstname"] = update.message.text
        bot.sendMessage(chat_id, "Bitte geben Sie Ihren Nachnamen ein", reply_markup=telegram.ForceReply(True))
        data[chat_id] = 1

    # Nachname
    elif data[chat_id] == 1:
        users[chat_id]["lastname"] = update.message.text
        bot.sendMessage(chat_id, "Was ist Ihre E-Mail Adresse?", reply_markup=telegram.ForceReply(True))
        data[chat_id] = 2

    # Email
    elif data[chat_id] == 2:
        users[chat_id]["email"] = update.message.text
        bot.sendMessage(chat_id, "Vergeben Sie bitte ein sicheres Passwort", reply_markup=telegram.ForceReply(True))
        data[chat_id] = 3

    # Password
    elif data[chat_id] == 3:
        users[chat_id]["password"] = update.message.text
        bot.sendMessage(chat_id, "In welcher Stadt haben Sie Ihren Wohnsitz?", reply_markup=telegram.ForceReply(True))
        data[chat_id] = 4

    # Stadt
    elif data[chat_id] == 4:
        users[chat_id]["contact"]["city"] = update.message.text
        bot.sendMessage(chat_id, "Wie lautet die Postleitzahl Ihres Wohnortes?", reply_markup=telegram.ForceReply(True))
        data[chat_id] = 5

    # PLZ
    elif data[chat_id] == 5:
        users[chat_id]["contact"]["postcode"] = update.message.text
        bot.sendMessage(chat_id, "In welcher Straße wohnen Sie? (ohne Hausnummer)", reply_markup=telegram.ForceReply(True))
        data[chat_id] = 6

    # Strasse
    elif data[chat_id] == 6:
        users[chat_id]["contact"]["street"] = update.message.text
        bot.sendMessage(chat_id, "Hausnummer", reply_markup=telegram.ForceReply(True))
        data[chat_id] = 7

    # Nr
    elif data[chat_id] == 7:
        users[chat_id]["contact"]["nr"] = update.message.text
        bot.sendMessage(chat_id, "Unter welcher Nummer sind Sie erreichbar?", reply_markup=telegram.ForceReply(True))
        data[chat_id] = 8

    # Phone
    elif data[chat_id] == 8:
        users[chat_id]["contact"]["phone"] = update.message.text
        users[chat_id]["id"] = get_new_id()
        users[chat_id]["contact"]["name"] = users[chat_id]["firstname"] + " " + users[chat_id]["lastname"]
        bot.sendMessage(chat_id, "Danke!")

        with open(json_dir + "customers.json", "r") as f:
            json_data = json.load(f)

        json_data.append(users[chat_id])

        with open(json_dir + "customers.json", "w") as f:
            f.write(json.dumps(json_data))

        data[chat_id] = 9

    # ELSE
    else:
        bot.sendMessage(chat_id, "Du bist schon registriert")

    print(users)


'''
    Reads json and generates new unused ID
'''


def get_new_id():
    with open(json_dir + "customers.json", "r") as f:
        json_data = json.load(f)

    ids = []

    for customer in json_data:
        ids.append(customer["id"])

    customer_id = 1
    while customer_id in ids:
        customer_id += 1

    return customer_id

