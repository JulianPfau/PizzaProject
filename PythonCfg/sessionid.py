# used for the random generated sessionID
# only used to check the system
import json
import os
import random
# used to get the timestamp
import time

# 24h maximum lifetime of the sessionID
SESSIONIDLIFETIME = 86400

server_dir = os.path.dirname(os.path.abspath(__file__))
server_root = os.path.sep.join(server_dir.split(os.path.sep)[:-1])
json_dir = server_root + "/json/"

# when the user sucessully logged in to the system,
# a session ID should be created. Its a random number
# that is stored in the user data base (json) and in
# the sesseionStorage of the user. Also a timestamp should be
# stored so after 1 Day the sessionID is invaild.
# After each connection
# the Session ID's should be compared. If its equal the user
# is still logged in.

# contains every stored sessionID in an array
file = open(json_dir + "sessionIDs.json")
# JSON SessionID database array
oldsessionIDs = json.load(file)


# creates a random number between 100 000 and 2 147 483 648
def createSessionID():
    sid = random.randrange(100000, 2147483648)
    ts = getTimeStamp()

    # write the sid in the data base
    file = open(json_dir + "sessionIDs.json")
    jsonfile = json.load(file)
    appenddata = {"sessionID": sid, "timestamp": ts}
    jsonfile.append(appenddata)

    file = open(json_dir + "sessionIDs.json", "w")
    file.write(json.dumps(jsonfile))

    return sid

# removes the sid in the database
def logout(sid):
    # write the sid in the data base
    file = open(json_dir + "sessionIDs.json")
    jsonfile = json.load(file)
    pos = 0
    for id in jsonfile:
        if str(id["sessionID"]) in str(sid):
            break
        pos += 1
    del jsonfile[pos]

    file = open(json_dir + "sessionIDs.json", "w")
    file.write(json.dumps(jsonfile))

    response = {
        'STATUS': 'OK'
    }
    return json.dumps(response)


# returns the current timestamp
# to read the timestamp in a YYYY-MM-DD HH:MM:SS format
# use this: datetime.datetime.fromtimestamp(TIMESTAMP).strftime('%Y-%m-%d %H:%M:%S')
# ! important: you have to import the datetime module
def getTimeStamp():
    return time.time()


# a function to check if the user is still logged in or not
# it will return true if the user is logged in, otherwise false
# check if the SessionID is already stored in the database
# the reason for that is ever use has his own and unique sessionID
# so during the sessionID check the Client don't have to send data of the user.
def checkSessionID(sessionID):
    file = open(json_dir + "sessionIDs.json")
    oldsessionIDs = json.load(file)

    # if the sessionID is stored
    i = 0
    while i < len(oldsessionIDs):
        if str(oldsessionIDs[i]["sessionID"]) == str(sessionID):
            sessiontimestamp = oldsessionIDs[i]["timestamp"]
            currenttimestamp = getTimeStamp()

            print("found sid")

            # check if the session is still the lifetime range
            if sessiontimestamp + SESSIONIDLIFETIME > currenttimestamp:
                # sessionID and timestamp is valid (User is logged in)
                print("and sid is valid")
                response = {
                    'STATUS': 'OK'
                }
                return json.dumps(response)

        i += 1

    # sessionID and timestamp is invalid (User is no longer logged in)
    response = {
        'STATUS': 'ERROR'
    }
    return json.dumps(response)