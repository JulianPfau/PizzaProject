//globale Variable setzen
var alleextras;

function getExtras(element, file) {
    alleextras = element;
}

function getJsonByRequest(cFunction, file) {
    var url = "https://localhost:8080/json/" + file + ".json";
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        //readystate == 4       = Request is DONE
        //status == 200         = was successful
        if (xhr.readyState == 4 && xhr.status == "200") {
            //Creating element from the responsetext
            var element = JSON.parse(this.responseText);
            //Calling the function with the object as parameter);
            cFunction(element, file);
        } else {
            //Nothing here, as this is called multiple times, even if it is successful.
        }
    };
    //Initializes the request
    xhr.open('GET', url, false);
    //Sends the request
    xhr.send(null);
}

function getdata() {
    var bestellung = sessionStorage["bestellung"];
    bestellung = JSON.parse(bestellung);


    document.getElementById('name').value = bestellung["contact"]["name"];
    document.getElementById('adress').value = bestellung["contact"]["postcode"] + " " + bestellung["contact"]["city"];
    document.getElementById('street').value = bestellung["contact"]["street"] + " " + bestellung["contact"]["nr"];
    document.getElementById('phone').value = bestellung["contact"]["phone"];
    document.getElementById('total').value = bestellung["total"] + "\u20AC";
    document.getElementById('payment').value = bestellung["contact"]["zahlung"];


    var pizzen = bestellung["items"];
    for (i in pizzen) {
        var name = pizzen[i]["name"];
        var size = pizzen[i]["size"];
        var price = pizzen[i]["price"];
        var count = pizzen[i]["count"];
        var extras = pizzen[i]["extras"];
        var extratext = "";
        for (var x in extras) {
            y = extras[x];
            y -= 1;
            var extra = alleextras[y]["name"];
            if (x == 0) {
                extratext += " mit " + extra;
            }
            else {
                extratext += " und " + extra;
            }
        }
        var bestellungstext = count + " x " + name + " " + extratext + " Gr\u00F6\u00DFe: " + size + "\n ";
        document.getElementById('pizzaname').value += bestellungstext;

    }
}

getJsonByRequest(getExtras, "extras");
// moved cause template.js
/*window.onload = function () {
	getdata();
}*/



