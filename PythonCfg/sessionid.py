# used for the random generated sessionID
import random
# used to get the timestamp
import time
# only used to check the system
import json

# 24h maximum lifetime of the sessionID
SESSIONIDLIFETIME = 86400

# when the user sucessully logged in to the system,
# a session ID should be created. Its a random number
# that is stored in the user data base (json) and in
# the sesseionStorage of the user. Also a timestamp should be
# stored so after 1 Day the sessionID is invaild.
# After each connection
# the Session ID's should be compared. If its equal the user
# is still logged in.

#contains every stored sessionID in an array
file = open("sessionIDS.json")
# JSON SessionID database array
oldsessionIDs = json.load(file)



# creates a random number between 100 000 and 2 147 483 648
def createSessionID():
    return random.randrange(100000, 2147483648)

# returns the current timestamp
# to read the timestamp in a YYYY-MM-DD HH:MM:SS format
# use this: datetime.datetime.fromtimestamp(TIMESTAMP).strftime('%Y-%m-%d %H:%M:%S')
# ! important: you have to import the datetime module
def getTimeStamp():
    return time.time()


# a function to check if the user is still logged in or not
# it will return true if the user is logged in, otherwise false
def checkSessionID(sessionID):
    # if the sessionID is stored
    i = 0
    while(i < len(oldsessionIDs)):
        if(sessionID == oldsessionIDs[i]["sessionID"]):
            sessiontimestamp = oldsessionIDs[i]["timestamp"]
            currenttimestamp = getTimeStamp()

            # check if the session is still the lifetime range
            if(sessiontimestamp + SESSIONIDLIFETIME > currenttimestamp):
                # sessionID and timestamp is valid (User is logged in)
                return True

        i += 1
    # sessionID and timestamp is invalid (User is no longer logged in)
    return False



# creates the sessionID
sessionID = createSessionID()

# check if the SessionID is already stored in the database
# the reason for that is ever use has his own and unique sessionID
# so during the sessionID check the Client don't have to send data of the user.
while(sessionID in oldsessionIDs):
    sessionID = createSessionID()

timestamp = getTimeStamp()


# the variables: timestamp and sessionID can now be used to store in the database
print(sessionID)
print(timestamp)
print(checkSessionID(301480207))