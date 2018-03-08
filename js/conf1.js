//global variable
var alleextras;
//request for extras
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
    
function getdata(){
	//add user data from sessionstorage to html
    var bestellung = sessionStorage.getItem('bestellung');
    bestellung = JSON.parse(bestellung);

    document.getElementById('name').value = bestellung["contact"]["name"];
    document.getElementById('adress').value = bestellung["contact"]["postcode"] + " " + bestellung["contact"]["city"];
    document.getElementById('street').value = bestellung["contact"]["street"] + " " + bestellung["contact"]["nr"];
    document.getElementById('phone').value = bestellung["contact"]["phone"];
    document.getElementById('total').value = bestellung["total"] + "\u20AC";
	document.getElementById('payment').value = bestellung["contact"]["zahlung"];
	
	
	//add order
    var pizzen = bestellung["items"];
	var extratext = "";
    //-for (i = 0; i < pizzen.length; i++) {
	for (i in pizzen){
		var extras = pizzen[i]["extras"];
	
		//add extras
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
		};			
        document.getElementById('pizzaname').value += pizzen[i]["count"]+" x "+ pizzen[i]["name"] + " (" + pizzen[i]["size"] + ") "  + extratext + "	  " + "\n";
    };
}

getJsonByRequest(getExtras, "extras");
window.onload = function () {
	getdata();
}
