//globale Variable setzen
var alleextras;

function getExtras(element, file){
	 alleextras = element;
	}

function getJsonByRequest(cFunction, file) {
    var url = "https://localhost:8080/json/" + file + ".json";
    var xhr = new XMLHttpRequest()

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
    }
    //Initializes the request
    xhr.open('GET', url, false);
    //Sends the request
    xhr.send(null);
}

function pizzenInListe(){
		for (i in pizzen){
		var name = pizzen[i]["name"];
		var size = pizzen[i]["size"];
		var price = pizzen[i]["price"];
		var count = pizzen[i]["count"];
		var extras = pizzen[i]["extras"];
		var extratext = "";
		for (var x in extras){
			x = extras[x];
			x -= 1;
			var extra = alleextras[x]["name"];
			if (x==0){
				extratext += " mit " + extra ;
			}
			else{
				extratext += " und " + extra ;
			}	
		}
		
		
		//bestelltext f�r einzelne pizza erstellen
		var bestellungstext = count + " x" + " Pizza " + name + extratext +"             Gr\u00F6\u00DFe: " + size + ", Preis: " + price + " \u20AC";
	
		//text zur liste auf der html seite hinzuf�gen
		var listItem = document.createElement("li");
		listItem.innerText = bestellungstext;
		var list = document.getElementById("bestellliste");
		list.appendChild(listItem);
		}
	}
	
function totalinListe(){
		//gesamtpreis in liste auf html seite hinzuf�gen
		total = "Zusammen: " + total + " \u20AC";
		var listItem = document.createElement("li");
		listItem.innerText = total;
		var list = document.getElementById("bestellliste");
		list.appendChild(listItem);
}





//pizzen aus sessionstorage auslesen und parsen
var bestellung = sessionStorage["bestellung"];
bestellung = JSON.parse(bestellung);
var pizzen = bestellung["items"];
var total = bestellung["total"];



getJsonByRequest(getExtras, "extras");
window.onload = function () {
	pizzenInListe();
	totalinListe();
}