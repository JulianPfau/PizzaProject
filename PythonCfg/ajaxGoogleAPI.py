import requests

def calcDistance(request):
	'''
	returns the distance between the pizzeria and customer
	
	Funktion makes a request to the GoogleMapsAPI.
	Basend on two places (street/postcode/city name) the API
	returns informations about the distance(and some more).
	
	Args:
		request (dict):	request contains all the transmitted informations
						from the customer in this structure:
							{
								"request": "ajaxGoogleAPI",
								"plz_pizza": pizza,
								"plz_user": user
							}
	
	Returns:
		int:	If successful: returns the distance in meters.
		str:	No valid location entered: Error.
	'''
	url = "http://maps.googleapis.com/maps/api/distancematrix/xml?origins=" + str(request['plz_pizza']) + "+DE&destinations=" + str(request['plz_user']) + "+DE"
	r = requests.get(url)
	distance = getDistance(r.text)
	if(distance.isdigit()):
		return distance
	else:
		return "Error"

def getDistance(text):
	'''
	extracts the distance from the response of the GoogleMapsAPI
	
	Args:
		text (str) :	contains the response of the GooglaAPI
	
	Returns:
		int: 	distance between two locations
	'''
	pos_beg = text.find("<value>", text.find("distance"))+7
	return text[pos_beg:text.find("</value>", pos_beg)]
