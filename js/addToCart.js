    //get menu from server
function loadMenuJSON(callback) {

    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', 'https://localhost:8080/json/menu.json', true);
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
          }
    };
    xobj.send(null);
 }

 //get extras menu from server
 function loadExtrasJSON(callback) {

    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', 'https://localhost:8080/json/extras.json', true);
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
          }
    };
    xobj.send(null);
 }

//save menus in sessionStorage (using above functions)
function saveMenu (json) {
    loadMenuJSON(function(response) {
        var menuJsonString = response;
        sessionStorage.setItem('menu', menuJsonString);
        });
    loadExtrasJSON(function(response) {
        var extrasJsonString = response;
        sessionStorage.setItem('extras', extrasJsonString);
        });
}

//check, if menu is already saved to sessionStorage
function controll () {

    if ( sessionStorage.getItem('menu') == null ) {
        saveMenu();
    }

}

//detect chosen pizza with size, amount etc and add to bestellung which is saved in sessionStorage
function pizzaWahl ( x ) {

    //save menu and extras in sessionStorage
    var menu  = JSON.parse(sessionStorage.getItem('menu'));
    var allExtras = JSON.parse(sessionStorage.getItem('extras'));

    //define all attributes of the pizza
    var chosenPizza = menu[x];
    var name = chosenPizza['name'];
    var sizePickerName = 'size' + x; //variable for the name of the selectPicker belonging to chosen Pizza
    var chosenSize = document.getElementById(sizePickerName).value;
    var size = chosenPizza['sizes'][chosenSize];
    var amountPickerName = 'amount' + x;
    var amount = document.getElementById(amountPickerName).value;
    var pizzaPrices = chosenPizza['prices'];
    var pizzaPrice = pizzaPrices[chosenSize];
    //create an array with the number of the Array of available sizes from menu.json
    var extras = [];
    var possibleExtras = chosenPizza['extras'];
    for ( var i = 0; i < possibleExtras.length; i++) {
        var checkboxId = x + ":" + i;
      if (document.getElementById(checkboxId) != null) {
        if (document.getElementById(checkboxId).checked == true) {
          extras.push(i);
        }
      }
    }
    //calculate the ExtraIds like they are in extras.json
    var extraIds = [];
    for ( var k = 0; k<extras.length; k++) {
      var id = possibleExtras[k];
      extraIds.push(id);
    }
    //calculate price for all chosen extras
    var extrasPrice = 0;
    for (var i = 0; i<allExtras.length; i++) {
        for (var j = 0; j<extraIds.length; j++) {
            if ( allExtras[i]['id'] == extraIds[j]) {
                extrasPrice += allExtras[i]['price'];
            }
        }
    }
    var price = parseFloat(pizzaPrice) + parseFloat(extrasPrice);
    var newPizza = {name:name, extras:extraIds, size:size, count:amount, price:price};
    var pizzaArray = [];
    //get old cart
    var oldTotal;
    if (sessionStorage.getItem('bestellung') == null) {
        pizzaArray.push(newPizza);
        var oldTotal = 0;
    } else {
        var oldBestellung = JSON.parse(sessionStorage.getItem('bestellung'));
        //var oldPizzaArray = oldBestellung['items'];
        pizzaArray = oldBestellung['items'];
        pizzaArray.push(newPizza);
        var oldTotal = oldBestellung['total'];
    }
    var total = oldTotal + (price*amount);
    //create new cart
    var bestellung = JSON.stringify({items:pizzaArray, total:total});
    sessionStorage.setItem('bestellung', bestellung);
    var boxen = document.getElementsByClassName('extrasBox');
}

function bestellen () {
    //link to orderoverview
    location.href="https://localhost:8080/orderoverview.html";
}
