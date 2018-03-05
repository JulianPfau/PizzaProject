import json

'''
JSON-String to add Order to orders.json:
	{
		"request" : "newOrder",
		"file" : "orders",
		"jsonData" : [
			{
				"id": "",
				"items": [
					{
						"name": "",
						"size": "",
						"price": "",
						"extras": [],
						"count": ""
					}
				],
				"total": "",
				"customerid": "",
				"contact": {
					"name": "",
					"postcode": "",
					"city": "",
					"street": "",
					"nr": "",
					"phone": ""
				},
				"done": "0"
			}
		]
	}
Caution don't use vowel mutation!
can't be handelt by the webserver
'''
def appendOrder(json_dir, request):
	try:
		with open(json_dir + request["file"] + ".json", "r") as f:
			data = json.load(f)
		
		data.append(request["jsonData"][0])
		
		with open(json_dir + request["file"] + ".json", "w") as f:
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

'''
JSON-String to get a Order by it's ID
	{
		"request" : "getOrder",
		"file" : "orders",
		"order_id" : ""
	}
'''
def getOrderbyId(json_dir,  request):
	try:
		with open(json_dir + request["file"] + ".json", "r") as f:
			data = json.load(f)
			
		pos = 0
		for i in range(len(data)-1):
			if data[i]["id"] == request["order_id"]:
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
