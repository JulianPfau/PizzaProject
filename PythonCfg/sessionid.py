# used for the random generated sessionID
# only used to check the system
import json
import os
import random
# used to get the timestamp
import time

# 24h maximum lifetime of the sessionID
SESSION_ID_LIFETIME = 86400

server_dir = os.path.dirname(os.path.abspath(__file__))
server_root = os.path.sep.join(server_dir.split(os.path.sep)[:-1])
json_dir = server_root + "/json/"

# when the user successfully logged in to the system,
# a session ID should be created. Its a random number
# that is stored in the user data base (json) and in
# the session Storage of the user. Also a timestamp should be
# stored so after 1 Day the sessionID is invalid.
# After each connection
# the Session ID's should be compared. If its equal the user
# is still logged in.

# contains every stored sessionID in an array
tmp_file = open(json_dir + "sessionIDs.json")
# JSON SessionID database array
old_session_ids = json.load(tmp_file)


def create_session_id():
    """creates a random number between 100 000 and 2 147 483 648"""
    sid = random.randrange(100000, 2147483648)
    ts = get_time_stamp()

    # write the sid in the data base
    file = open(json_dir + "sessionIDs.json")
    json_file = json.load(file)
    append_data = {"sessionID": sid, "timestamp": ts}
    json_file.append(append_data)

    file = open(json_dir + "sessionIDs.json", "w")
    file.write(json.dumps(json_file))

    return sid


def logout(sid):
    """removes the sid in the database"""
    # write the sid in the data base
    file = open(json_dir + "sessionIDs.json")
    json_file = json.load(file)
    pos = 0
    for s_id in json_file:
        if str(s_id["sessionID"]) in str(sid):
            break
        pos += 1
    del json_file[pos]

    file = open(json_dir + "sessionIDs.json", "w")
    file.write(json.dumps(json_file))

    response = {
        'STATUS': 'OK'
    }
    return json.dumps(response)


def get_time_stamp():
    """
     returns the current timestamp
    to read the timestamp in a YYYY-MM-DD HH:MM:SS format
    use this: datetime.datetime.fromtimestamp(TIMESTAMP).strftime('%Y-%m-%d %H:%M:%S')
    ! important: you have to import the datetime module
    """
    return time.time()


def check_session_id(session_id):
    """
    a function to check if the user is still logged in or not
    it will return true if the user is logged in, otherwise false
    check if the SessionID is already stored in the database
    the reason for that is ever use has his own and unique session_id
    so during the session_id check the Client don't have to send data of the user.
    """
    global old_session_ids
    file = open(json_dir + "sessionIDs.json")
    old_session_ids = json.load(file)

    # if the session_id is stored
    i = 0
    while i < len(old_session_ids):
        if str(old_session_ids[i]["sessionID"]) == str(session_id):
            session_timestamp = old_session_ids[i]["timestamp"]
            current_timestamp = get_time_stamp()

            print("found sid")

            # check if the session is still the lifetime range
            if session_timestamp + SESSION_ID_LIFETIME > current_timestamp:
                # session_id and timestamp is valid (User is logged in)
                print("and sid is valid")
                response = {
                    'STATUS': 'OK'
                }
                return json.dumps(response)

        i += 1

    # session_id and timestamp is invalid (User is no longer logged in)
    response = {
        'STATUS': 'ERROR'
    }
    return json.dumps(response)
