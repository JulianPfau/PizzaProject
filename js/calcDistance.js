//'use strict';

function getPLZ() {
													//input feld muss diese Funtion bei onkeyup aufrufen
													//Bsp.: <input type="text" id="fname" onkeyup="getPLZ()">
  var plz = document.getElementById("postcode").value;	//hier muss "plz" geändert werden!
  calcDistance(plz);
}

function calcDistance(plz_user) {
  var plz_pizza = "88045+Fallenbrunn";
  var xml = ajaxPLZ(plz_pizza, plz_user);
}

function ajaxPLZ(pizza, user) {
  var xhttp = new XMLHttpRequest();
  
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      //document.getElementById("ans").innerHTML = this.responseText; //wird aufgerufen sobald die Rückmeldung
																	//vom server kam -> hier ifabfrage und einfärbung
																	//und blocken des weiter machen.
        var distance = this.responseText;
        if(distance <= 20000){
          document.getElementById("postcode").style.backgroundColor = 'green';
          }
          if(distance > 20000){
              document.getElementById("postcode").style.backgroundColor = 'red';
          }

    }
  };

  var data = {
    "request"   : "ajaxGoogleAPI",
    "plz_pizza" : pizza,
    "plz_user"  : user
  }
  parse = JSON.stringify(data);
  xhttp.open("POST", "https://localhost:8080", true);
  xhttp.send(parse);
  
}
