var bestellung= sessionStorage.getItem["bestellung"];
bestellung= JSON.parse(bestellung);


document.getElementById('name').value=bestellung["contact"]["name"];
document.getElementById('adress').value=bestellung["contact"]["postcode"]+ " "+bestellung["contact"]["city"];
document.getElementById('street').value=bestellung["contact"]["street"]+" "+ bestellung["contact"]["nr"];
document.getElementById('phone').value=bestellung["contact"]["phone"]
document.getElementById('total').value=bestellung["total"]+ "\u20AC";	

var pizzen= bestellung["items"];
	for (i=0; i <pizzen.length; i++){
		document.getElementById('pizzaname').value+=bestellung[i]["items"]["name"]+ "("+ bestellung[i]["items"]["size"]+")"+" mit "+bestellung[i]["items"]["extras"]+ "	  "+ "\n";
};