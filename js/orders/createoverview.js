//set global variable
var alleextras;

function getExtras(element, file) {
    alleextras = element;
}

//function for getting all available extras
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


//this function add every single pizza in a list on the html site
function pizzenInListe() {
    if (isset(pizzen)) {
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
                } else {
                    extratext += " und " + extra;
                }
            }
            //create an order text for every single pizza
            var bestellungstext = count + " x" + " " + name + extratext + "\nGr\u00F6\u00DFe: " + size + "\nPreis: " + price + " \u20AC";

            //add the order text to the list
            var listItem = document.createElement("li");
            listItem.innerText = bestellungstext;
            var list = document.getElementById("bestellliste");
            list.appendChild(listItem);
        }
    }else{
        document.getElementById("send_order").style.display = "none";
        document.getElementById("info").append(document.createElement("p").innerText = "Ihr Warenkorb ist leer.");
    }
}

function totalinListe() {
    if(isset(total)){
        //finally add the total price to the list
        total = Number((total).toFixed(2));
        total = "Zusammen: " + total + " \u20AC";
        var listItem = document.createElement("li");
        listItem.innerText = total;
        var list = document.getElementById("gesamtpreis");
        list.appendChild(listItem);
    }
}


//pizzen aus sessionstorage auslesen und parsen
var bestellung = (isset(sessionStorage["bestellung"])) ? JSON.parse(sessionStorage["bestellung"]) : null;
var pizzen = (isset(bestellung["items"])) ? bestellung["items"] : null;
var total = (isset(bestellung["total"])) ? bestellung["total"] : null;


getJsonByRequest(getExtras, "extras");

// check if the variable is valid
function isset(variable) {
    if (variable == null | variable == "" | variable == undefined) {
        return false;
    }
    return true;
}
