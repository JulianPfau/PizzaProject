import requests

def calcDriveDuration(plz_pizza, plz_customer):
    """
    returns the drive duratoin between the pizzeria and customer

    Funktion makes a request to the GoogleMapsAPI.
    Basend on two places (street/postcode/city name) the API
    returns informations about the duration(and some more).
    
    Example call: calcDriveDuration("plz+village", "plz+village+street+number")
    
    Args:
        plz_pizza (str): location string of the pizzeria
        plz_customer (str) location string of the customer

    Returns:
        int:    If successful: returns the duration as string with time unit.
        str:    No valid location entered: Error.
    """
    url = "http://maps.googleapis.com/maps/api/distancematrix/xml?origins=" + plz_pizza + "+DE&destinations=" + plz_customer + "+DE"
    r = requests.get(url)
    if r.text.find("NOT_FOUND") == -1:
        duration = getDuration(r.text)
        return duration
    else:
        return "Error"

def calcDistance(request):
    """
    returns the distance between the pizzeria and customer

    Funktion makes a request to the GoogleMapsAPI.
    Basend on two places (street/postcode/city name) the API
    returns informations about the distance(and some more).

    Args:
        request (dict):    request contains all the transmitted informations
                        from the customer in this structure:
                            {
                                "request": "ajaxGoogleAPI",
                                "plz_pizza": pizza,
                                "plz_user": user
                            }

    Returns:
        int:    If successful: returns the distance in meters.
        str:    No valid location entered: Error.
    """
    url = "http://maps.googleapis.com/maps/api/distancematrix/xml?origins=" + str(request['plz_pizza']) + "+DE&destinations=" + str(request['plz_user']) + "+DE"
    r = requests.get(url)
    distance = getDistance(r.text)
    if distance.isdigit():
        return distance
    else:
        return "Error"

def getDuration(text):
    """
    extracts the duration from the response of the GoogleMapsAPI

    Args:
        text (str) :    contains the response of the GooglaAPI

    Returns:
        str:     duration to drive between two locations (value unit)
    """
    pos_beg = text.find("<text>", text.find("duration"))+6
    return text[pos_beg:text.find("</text>", pos_beg)]

def getDistance(text):
    """
    extracts the distance from the response of the GoogleMapsAPI

    Args:
        text (str) :    contains the response of the GooglaAPI

    Returns:
        int:     distance between two locations
    """
    pos_beg = text.find("<value>", text.find("distance"))+7
    return text[pos_beg:text.find("</value>", pos_beg)]

print(calcDriveDuration("93753", "88045+Efrizweiler+Fuerstenbergweg+5"))
