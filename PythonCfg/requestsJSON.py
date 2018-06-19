import json

def findPizzainMenu(menu, pizza):
	"""
	Searches for pizza characteristics in the menu based on its name
	
	Args:
		menu (dict):	content of the json in which all the pizza 
						characteristics are written
		pizza (string):	name of the pizza to look for
	
	Returns:
		dict:	if successful: all collected characteristics from the pizza
				Pizza does not exist: Error, Pizza not valid.
	"""
	
	for item in menu:
		if item["name"] == pizza:
			return item
	return { "Status" : "Error",  "Description" : "Pizza not valid." }

def findExtrainExtras(extras, intId):
	"""
	Searches for extra characteristics in the extras based on its id.
	
	Args:
		extras (dict):	content of the json in which all the extra
						characteristics are written
		intId (int):	id of the extra to look for
	
	Returns:
		dict:	if successful: all collected characteristics from the extra
				Pizza does not exist: Error, Extra not valid.
	"""
	for item in extras:
		if intId == item["id"]:
			return item
	return { "Status" : "Error",  "Description" : "Extra not valid." }

def appendOrder(json_dir, request):
	"""
	Appends a submitted Order, checks the calculated price and returns the 
	corrected informations to the customer.
	
	Args:
		json_dir (str):	string to all stored json-files
		request (dict):	transmitted informations in this structure:
			{
				"request" : "newOrder",
				"jsonData" :
					{"items":
						[{"name":"",
						  "extras":[],
						  "size":"",
						  "price": ,
						  "count":""},
						  ...
						],
					"contact":
						{"name":"",
						 "postcode":"",
						 "street":"",
						 "city":"",
						 "nr":"",
						 "phone":"",
						 "zahlung":"",
						 "chat_id": ""},
					"total": 
				}
			}
	
	Returns:
		dict:	if successful: sets the response to the corrected request
				if any error: sets the response to { 'STATUS' : 'ERROR' }
	
	Caution:
		Don't use vowel mutations!
	"""
	
	'''
		Calculate the new correct price.
	'''
	try:
		with open(json_dir + "menu.json", "r") as f:
			menu = json.load(f)
		
		with open(json_dir + "extras.json", "r") as f:
			extras = json.load(f)
		
		price_total = 0
		for item in request['jsonData']['items']:
			#gets the price of the pizza from json
			menu_item = findPizzainMenu(menu, item["name"])
			item["price"] = menu_item["prices"][menu_item["sizes"].index(item["size"])]
			price_total += item["price"]*int(item["count"])
			
			#gets the price of the selected extras
			for extra in item["extras"]:
				extras_item = findExtrainExtras(extras, extra)
				price_total += extras_item["price"] * int(item["count"])
		
		request['jsonData']['total'] = round(price_total, 2)
	except IOError:
		response = {
			'STATUS': 'ERROR'
		}
		response = json.dumps(response)
		return response
	
	'''
	Appends the Order to the orders.json-file.
	sets the response for the customer
	'''
	try:
		with open(json_dir + "orders.json", "r") as f:
			data = json.load(f)
		
		data.append(request["jsonData"])
		
		with open(json_dir + "orders.json", "w") as f:
			json.dump(data, f)
		
		response = {
			'STATUS': 'OK',
			"response_data" : data[len(data)-1]
		}
	except IOError:
		response = {
			'STATUS': 'ERROR'
		}
	response = json.dumps(response)
	return response

'''
JSON-String to get a Order by it's Order-ID
	{
		"request" : "getOrderbyId",
		"order_id" : ""
	}
'''
def getOrderbyId(json_dir,  request):
	"""
	Searches in the orders.json for a specific order
	based on its id.
	
	Args:
		json_dir (str):	string to the dicetory where the json-files
						are located
		request (dict):	request contains all the transmitted informations
						from the customer in this structure:
							{
								"request" : "getOrderbyId",
								"order_id" : ""
							}
	
	Returns:
		dict:	if successful: sets the response to the collected order
				Pizza does not exist: Error.
	"""
	try:
		with open(json_dir + "orders.json", "r") as f:
			data = json.load(f)
			
		pos = 0
		for i in range(len(data)):
			if str(data[i]["id"]) == request["order_id"]:
				pos = i
				break
				
		response = {
			'STATUS' : 'OK',
			'response_data' : data[pos]
		}
	except IOError:
		response = {
			'STATUS': 'ERROR'
		}
	response = json.dumps(response)
	return response


def getCustomerIdbyMail(json_dir, mail):
	"""
	Looksup the customers id based on the stored mail-address in the customers.json
	
	Args:
		json_dir (str):	string to the dicetory where the json-files
						are located
		mail (dict):	request contains all the transmitted informations
						from the customer.
	
	Returns:
		dict:	if successful: all collected characteristics from the extra
				Pizza does not exist: Error, Extra not valid.
	"""
	try:
		with open(json_dir + "customers.json", "r") as f:
			data = json.load(f)
		
		for item in data:
			if mail == item['email']:
				return item['id']
		return 0
	except IOError:
		return 0


def getCustomerDatabyMail(json_dir, mail):
	'''
	Looksup the customers data based on the stored mail-address in the customers.json

	Args:
		json_dir (str):	string to the dicetory where the json-files
						are located
		request (dict):	request contains all the transmitted informations
						from the customer.

	Returns:
		dict:	if successful: all collected characteristics from the extra
				Pizza does not exist: Error, Extra not valid.
	'''
	try:
		with open(json_dir + "customers.json", "r") as f:
			data = json.load(f)

		for item in data:
			if str(mail) == str(item['email']):
				return json.dumps(item)
		return 0
	except IOError:
		return 0

# changes the data of a user
def updateUserData(json_dir, request):
	try:
		with open(json_dir + "customers.json", "r") as f:
			data = json.load(f)

		print(request)
		for item in data:
			if str(request['email']) == str(item['email']):
				item['firstname'] = request['firstname']
				item['lastname'] = request['lastname']
				item['contact']['postcode'] = request['postcode']
				item['contact']['street'] = request['street']
				item['contact']['nr'] = request['streetNr']
				item['contact']['city'] = request['city']
				item['contact']['phone'] = request['phone'],
				item['contact']['chat_id'] = request['chat_id']

		with open(json_dir + "customers.json", "w") as f:
			json.dump(data, f)

		response = {
			'STATUS': 'OK',
			"response_data": data[len(data) - 1]
		}
	except IOError:
		response = {
			'STATUS': 'ERROR'
		}
	response = json.dumps(response)
	return response

# removes the user
def deleteUser(json_dir, request):
	try:
		with open(json_dir + "customers.json", "r") as f:
			data = json.load(f)

		pos = 0
		for item in data:
			if str(request['email']) == str(item['email']):
				print("deleted user")
				del data[pos]
			pos +=1

		with open(json_dir + "customers.json", "w") as f:
			json.dump(data, f)

		response = {
			'STATUS': 'OK'
		}
	except IOError:
		response = {
			'STATUS': 'ERROR'
		}
	response = json.dumps(response)
	return response

def getOrderbyMail(json_dir, request):
	"""
	Returns all ever submitted orders based on the stored mail-address 
	
	Args:
		json_dir (str):	string to the dicetory where the json-files
						are located
		request (dict):	request contains all the transmitted informations
						from the customer in this structure:
							{
								"request" : "getOrderbyMail",
								"file" : "orders",
								"email" : ""
							}
	
	Returns:
		dict:	if successful: sets the response to all stored orders
				mail-address does not exist: Error.
	"""
	
	customerid = getCustomerIdbyMail(json_dir, request["email"])
	try:
		with open(json_dir + request["file"] + ".json", "r") as f:
			data = json.load(f)

		old_orders = []
		for customer in data:
			if "customerid" in customer and str(customer["customerid"]) == str(customerid):
				old_orders.append(customer["items"])

		response = {
			'STATUS' : 'OK',
			'response_data' : old_orders[0]
		}
	except IOError:
		response = {
			'STATUS': 'ERROR'
		}
	response = json.dumps(response)
	return response
