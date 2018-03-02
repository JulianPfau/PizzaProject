import json

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
