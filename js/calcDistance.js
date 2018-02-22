//'use strict';

function getPLZ() {
  var plz = document.getElementById("plz").value;
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
      document.getElementById("ans").innerHTML = this.responseText;
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
