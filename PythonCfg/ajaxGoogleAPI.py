import json
from datetime import timedelta

import requests


def calc_drive_duration(origin, waypoints, destination):
    """
    returns the drive duration between the pizzeria and customer

    Function makes a request to the GoogleMapsAPI.
    Based on two places (street/postcode/city name) the API
    returns information about the duration(and some more).
    
    Example call: calc_drive_duration("plz+village", "plz+village+street+number")
    
    Args:
        origin (str) - location string of the origin
        waypoints (list) - location of all waypoints on the route (no waypoints: [])
        destination (str) - location string of the destination

    Returns:
        str - If successful: returns the duration as string with time unit. Format hh:mm:ss
        str - No valid location entered: Error.
    """
    header = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.1',
              'Host': 'maps.googleapis.com',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
              'Accept-Language': 'de,en-US;q=0.7,en;q=0.3',
              'Accept-Encoding': 'gzip, deflate',
              'DNT': '1'}
    r = requests.get(gen_request_url(origin, waypoints, destination), headers=header)

    if json.loads(r.text)["status"] == 'OK':
        duration = get_duration(json.loads(r.text)['routes'][0]['legs'])
        return duration
    else:
        return "Error"


def calc_drive_way(origin, waypoints, destination):
    """
    Creates a String for Google Maps based on a destination and origin and optional waypoints

    Args:
        origin (str) - location string of the origin
        waypoints (list) - location of all waypoints on the route (no waypoints: [])
        destination (str) - location string of the destination

    Returns:
        str - Link for Google Maps with the best route
    """
    header = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.1',
              'Host': 'maps.googleapis.com',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
              'Accept-Language': 'de,en-US;q=0.7,en;q=0.3',
              'Accept-Encoding': 'gzip, deflate',
              'DNT': '1'}
    r = requests.get(gen_request_url(origin, waypoints, destination), headers=header)

    waypoint_order = json.loads(r.text)['routes'][0]['waypoint_order']
    drive_route = origin
    for i in range(len(waypoints)):
        drive_route += "/{}".format(waypoints[waypoint_order[i]])
    drive_route += '/{}'.format(destination)

    return "https://www.google.de/maps/dir/{}".format(drive_route)


def calc_distance(request):
    """
    returns the distance between the pizzeria and customer

    Function makes a request to the GoogleMapsAPI.
    Based on two places (street/postcode/city name) the API
    returns information about the distance(and some more).

    Args:
        request (dict) -    request contains all the transmitted information
                        from the customer in this structure:
                            {
                                "request": "ajaxGoogleAPI",
                                "plz_pizza": pizza,
                                "plz_user": user
                            }

    Returns:
        int - If successful: returns the distance in meters.
        str - No valid location entered: Error.
    """
    url = "http://maps.googleapis.com/maps/api/distancematrix/xml?origins=" + str(
        request['plz_pizza']) + "+DE&destinations=" + str(request['plz_user']) + "+DE"
    r = requests.get(url)
    distance = get_distance(r.text)
    if distance.isdigit():
        return distance
    else:
        return "Error"


def gen_request_url(origin, waypoints, destination):
    """
    Generates the URI for the GoogleMaps API request

    Args:
        origin (str) - location string of the origin
        waypoints (list) - location of all waypoints on the route
        destination (str) - location string of the destination

    Returns:
        str - Request URI for the API
    """
    if len(waypoints) == 0:
        return "http://maps.googleapis.com/maps/api/directions/json?origin={}&destination={}&sensor=false".format(
            origin, destination)

    return "http://maps.googleapis.com/maps/api/directions/json?origin={}&destination={}&{}&sensor=false" \
        .format(origin, destination, pp_waypoints(waypoints))


def pp_waypoints(waypoints):
    """
    Converts the Waypoints into the format for the GoogleAPI request 

    Args:
        waypoints (list) - contains all the waypoints of the GoogleAPI

    Returns:
        str - pretty printed waypoints
    """
    string_waypoints = ""
    for i in waypoints:
        string_waypoints += "|{}".format(i)
    return "waypoints=optimize:true{}".format(string_waypoints)


def get_duration(text):
    """
    extracts the duration from the response of the GoogleMapsAPI

    Args:
        text (str) - contains the response of the GoogleAPI

    Returns:
        str - duration to drive between two locations (hh:mm:ss)
    """
    duration = 0

    for i in text:
        duration += i['duration']['value']

    return str(timedelta(seconds=duration))


def get_distance(text):
    """
    extracts the distance from the response of the GoogleMapsAPI

    Args:
        text (str) - contains the response of the GoogleAPI

    Returns:
        int - distance between two locations
    """
    pos_beg = text.find("<value>", text.find("distance")) + 7
    return text[pos_beg:text.find("</value>", pos_beg)]
