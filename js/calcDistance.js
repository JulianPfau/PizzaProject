//'use strict';

function getPLZ() {
	/**
	 * Function takes the Location out of a Input box and
	 * requests the distance between two locations from
	 * the server.
	 * 
	 * HTML-Code for the input field <input type="text" id="fname" onkeyup="getPLZ()">
	**/
	
	var plz = document.getElementById("postcode").value;
	calcDistance(plz);
}

function calcDistance(plz_user) {
	/**
	 * Functions sets the location of the pizzeria and
	 * and makes a request to the server.
	 * 
	 * Args: 
	 * 		plz_user (string):	location of the customer.
	**/
	
	var plz_pizza = "88045+Fallenbrunn";
	ajaxPLZ(plz_pizza, plz_user);
}

function ajaxPLZ(pizza, user) {
	/**
	 * Function requests (POST) distance from the server
	 * and colours the inpud field red or green depending 
	 * on the response.
	 * 
	 * Args:
	 * 		pizza (string):	location of the pizzeria.
	 * 		user (string):	location of the customer.
	**/
	
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            //document.getElementById("ans").innerHTML = this.responseText; //wird aufgerufen sobald die Rückmeldung
            //vom server kam -> hier ifabfrage und einfärbung
            //und blocken des weiter machen.
            var distance = this.responseText;
            if (distance <= 20000) {
                document.getElementById("postcode").style.backgroundColor = 'green';
            }
            else {
                document.getElementById("postcode").style.backgroundColor = 'red';
                var noChance = "Ihr Ort liegt leider nicht im Lieferradius. Sorry!";
                document.getElementById("ans").innerHTML = noChance;
            }
        }

    };
    
    var data = {
        "request": "ajaxGoogleAPI",
        "plz_pizza": pizza,
        "plz_user": user
    };
    parse = JSON.stringify(data);
    xhttp.open("POST", "https://localhost:8080", true);
    xhttp.send(parse);

}


