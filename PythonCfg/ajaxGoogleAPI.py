import requests

def calcDistance(plz_pizza, plz_user):
	url = "http://maps.googleapis.com/maps/api/distancematrix/xml?origins=" + str(plz_pizza) + "+DE&destinations=" + str(plz_user) + "+DE"
	r = requests.get(url)
	distance = getDistance(r.text)
	if(distance.isdigit()):
		return distance
	else:
		return "Error"

def getDistance(text):
	pos_beg = text.find("<value>", text.find("distance"))+7
	return text[pos_beg:text.find("</value>", pos_beg)]
