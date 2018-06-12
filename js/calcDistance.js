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
    //length maybe needs to be changed
    //depending on what input (in this case: postcodes)
    if (plz.length >= 4) {
        calcDistance(plz);
    }
}

function calcDistance(plz_user) {
    /**
     * Functions sets the location of the pizzeria and
     * and makes a request to the server.
     *
     * Args:
     *        plz_user (string):    location of the customer.
     **/

    var plz_pizza = "88045";
    ajaxPLZ(plz_pizza, plz_user);
}

function ajaxPLZ(pizza, user) {
    /**
     * Function requests (POST) distance from the server
     * and colours the input field red or green depending
     * on the response.
     *
     * Args:
     *        pizza (string):    location of the pizzeria.
     *        user (string):    location of the customer.
     **/

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            //document.getElementById("ans").innerHTML = this.responseText; //wird aufgerufen sobald die Rückmeldung
            //vom server kam
            var distance = this.responseText;

            var chance = "Bestellung ist möglich!";
            var noChance = "Ihr Ort liegt leider nicht im Lieferradius. Sorry, keine Bestellung möglich!";
            if (distance <= 20000) {
                document.getElementById("postcode").style.backgroundColor = 'lightgreen';
                document.getElementById("bestelluebersicht").disabled = false;
                document.getElementById("ans").innerHTML = chance;
            }
            else {
                document.getElementById("postcode").style.backgroundColor = 'red';
                document.getElementById("bestelluebersicht").disabled = true;
                document.getElementById("ans").innerHTML = noChance;

            }
        }
    };


    var data = {
        "request": "ajaxGoogleAPI",
        "plz_pizza": pizza,
        "plz_user": user
    };
    var parse = JSON.stringify(data);
    xhttp.open("POST", "https://localhost:8080", true);
    xhttp.send(parse);

}


