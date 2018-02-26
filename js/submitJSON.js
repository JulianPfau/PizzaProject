//Checks Type alert(({}).toString.call(var).match(/\s([a-zA-Z]+)/)[1].toLowerCase());

var extras;

/*  Requests a JSON file in the /json directory of the server and calls a
    specified function with the parsed JSON Element as parameter.

    Parameters:
    - cFunction     the Function to call then successful
    - file          the file name without the .json ending

    Nothing happens on Error.
*/

function getJsonByRequest(cFunction, file) {
    var url = "https://localhost:8080/json/" + file + ".json";
    var xhr = new XMLHttpRequest()

    xhr.onreadystatechange = function () {

        if (xhr.readyState == 4 && xhr.status == "200") {
            var element = JSON.parse(this.responseText);
            cFunction(element, file);
        } else {
            //Nothing here, as this is called multiple times, even if it is successful.
        }
    }

    xhr.open('GET', url, true);
    xhr.send(null);
}

//Called to load JSON Content into the table
function loadJSONToTable(json, index) {
    getJsonByRequest(getExtras, "extras");
    var length = (index == "menu") ? 9 : 7;
    var table = document.getElementsByClassName("table")[0];

    for (var i = 0; i < json.length; i++) {

        var menuRow = new Array();
        var menuInhalt = new Array();

        //Table Row
        var row = document.createElement('div');
        row.setAttribute('class', 'tr menuElement');

        //Table Row content
        for (var k = 0; k < length; k++) {
            menuRow[k] = document.createElement('div');
            menuRow[k].setAttribute('class', 'td');
        }

        if (index == "menu") { //Menu
            menuRow[8].setAttribute('id', 'img');
        }

        //MenuInhalt
        for (var n = 1; n < length; n++) {
            menuInhalt[n] = document.createElement('span');
            menuInhalt[n].setAttribute('class', 'Input');
            menuInhalt[n].setAttribute('contenteditable', 'true');
        }
        menuInhalt[0] = document.createElement('input');
        menuInhalt[0].setAttribute('type', 'checkbox');
        menuInhalt[0].setAttribute('onchange', 'markDelet()');

        switch (index) {
            case "menu":
                menuInhalt[7].removeAttribute('contenteditable');
                menuInhalt[7].setAttribute('data-toggle', 'modal');
                menuInhalt[7].setAttribute('data-target', '#modal');
                menuInhalt[7].setAttribute('onClick', 'getJsonByRequest(getExtras,"extras"); loadExtras(' + JSON.stringify(json[i]) + ')');

                menuInhalt[8] = document.createElement('img');
                menuInhalt[8].setAttribute('id', 'img');

                //Inhalt Menu
                menuInhalt[1].setAttribute('id', 'Name');
                menuInhalt[2].setAttribute('id', 'Description');
                menuInhalt[3].setAttribute('id', 'Prices');
                menuInhalt[4].setAttribute('id', 'Sizes');
                menuInhalt[5].setAttribute('id', 'Types');
                menuInhalt[6].setAttribute('id', 'Tags');
                menuInhalt[7].setAttribute('id', 'Extras');
                menuInhalt[8].setAttribute('src', "./img/" + json[i].picture);

                menuInhalt[1].innerHTML = json[i].name;
                menuInhalt[2].innerHTML = json[i].description;
                menuInhalt[3].innerHTML = splitArray(json[i].prices);
                menuInhalt[4].innerHTML = splitArray(json[i].sizes);
                menuInhalt[5].innerHTML = json[i].types;
                menuInhalt[6].innerHTML = splitArray(json[i].tags);
                menuInhalt[7].innerHTML = splitArray(json[i].extras);
                break;
            case "customers":
                menuInhalt[6] = document.createElement('span');
                menuInhalt[6].setAttribute('data-toggle', 'modal');
                menuInhalt[6].setAttribute('data-target', '#modal');
                menuInhalt[6].setAttribute('onClick', 'loadContact(' + JSON.stringify(json[i].contact) + ')');

                //Inhalt Menu
                menuInhalt[1].setAttribute('id', 'ID');
                menuInhalt[2].setAttribute('id', 'FirstID');
                menuInhalt[3].setAttribute('id', 'LastID');
                menuInhalt[4].setAttribute('id', 'EMail');
                menuInhalt[5].setAttribute('id', 'Password');
                menuInhalt[6].setAttribute('id', 'Contact');

                menuInhalt[1].innerHTML = json[i].id;
                menuInhalt[2].innerHTML = json[i].firstid;
                menuInhalt[3].innerHTML = json[i].lastid;
                menuInhalt[4].innerHTML = json[i].email;
                menuInhalt[5].innerHTML = json[i].password;
                menuInhalt[6].innerHTML = json[i].contact.id;
                break;
            case "orders":
                menuInhalt[2].removeAttribute('contenteditable');
                menuInhalt[2].setAttribute('data-toggle', 'modal');
                menuInhalt[2].setAttribute('data-target', '#modalItems');
                menuInhalt[2].setAttribute('onClick', 'loadItems(' + JSON.stringify(json[i].items) + ')');

                menuInhalt[5].removeAttribute('contenteditable');
                menuInhalt[5].setAttribute('data-toggle', 'modal');
                menuInhalt[5].setAttribute('data-target', '#modal');
                menuInhalt[5].setAttribute('onClick', 'loadContactOrder(' + JSON.stringify(json[i].contact) + ')');

                //Inhalt Menu
                menuInhalt[1].setAttribute('id', 'ID');
                menuInhalt[2].setAttribute('id', 'Items');
                menuInhalt[3].setAttribute('id', 'Total');
                menuInhalt[4].setAttribute('id', 'CustomerID');
                menuInhalt[5].setAttribute('id', 'Contact');
                menuInhalt[6].setAttribute('id', 'Done');

                var items = new Array();
                for (var k = 0; k < json[i].items.length; k++) {
                    items[k] = json[i].items[k].name;
                }

                menuInhalt[1].innerHTML = json[i].id;
                menuInhalt[2].innerHTML = splitArray(items);
                menuInhalt[3].innerHTML = json[i].total;
                menuInhalt[4].innerHTML = json[i].customerID;
                menuInhalt[5].innerHTML = json[i].contact.name;
                menuInhalt[6].innerHTML = json[i].done;
                break;
        }

        //Einfügen in HTML
        table.insertBefore(row, document.getElementById("footer"));

        for (var c = 0; c < length; c++) {
            row.appendChild(menuRow[c]);
            menuRow[c].appendChild(menuInhalt[c]);
        }
    }
    extendTable();
}

function splitArray(array) {
    var str = "";
    for (var i = 0; i < array.length; i++) {
        str += array[i] + ";";
    }
    str = str.substr(0, str.length - 1);
    return str;
}

function loadContact(json) {
    document.getElementsByClassName("modal-title")[0].innerHTML = (json.id == undefined) ? "" : json.id;
    document.getElementById("IDContact").innerHTML = (json.id == undefined) ? "" : json.id;
    document.getElementById("Postcode").innerHTML = (json.postcode == undefined) ? "" : json.postcode;
    document.getElementById("Street").innerHTML = (json.street == undefined) ? "" : json.street;
    document.getElementById("City").innerHTML = (json.city == undefined) ? "" : json.city;
    document.getElementById("Nr").innerHTML = (json.nr == undefined) ? "" : json.nr;
    document.getElementById("Phone").innerHTML = (json.phone == undefined) ? "" : json.phone;
}

function loadContactOrder(json) {

    document.getElementById("modalContactsTitle").innerHTML = json.name;
    document.getElementById("Name").innerHTML = json.name;
    document.getElementById("Postcode").innerHTML = json.postcode;
    document.getElementById("Street").innerHTML = json.street;
    document.getElementById("City").innerHTML = json.city;
    document.getElementById("Nr").innerHTML = json.nr;
    document.getElementById("Phone").innerHTML = json.phone;
}

function loadExtras(product) {

    document.getElementById("modalExtrasItems").innerHTML = (product == undefined) ? "Extras" : product.name + " Extras";
    var extrasBox = document.getElementById("extrasBox");

    while (extrasBox.firstChild) {
        extrasBox.removeChild(extrasBox.firstChild);
    }

    for (var i = 0; i < extras.length; i++) {
        var li = document.createElement('li');
        var label = document.createElement('label');
        var input = document.createElement('input');
        var span = document.createElement('span');

        input.setAttribute('type', 'checkbox');
        span.innerHTML = extras[i].name;

        if (product != undefined) {
            for (var k = 0; k < extras.length; k++) {
                if (product.extras[k] == extras[i].id)
                    input.setAttribute('checked', '');
            }
        }

        label.appendChild(input);
        label.appendChild(span);
        li.appendChild(label);
        extrasBox.appendChild(li);
    }
}

function getExtras(json) {
    extras = json;
}

function loadItems(json) {
    var table = document.getElementById("modal-table");
    var length = 6;

    document.getElementById("modalItemsTitle").innerText = "Items:";

    for (var y = table.children.length - 1; y > 0; y--) {
        if (table.children[y].classList.contains("menuElement")) {
            table.removeChild(table.children[y]);
        }
    }

    for (var i = 0; i < json.length; i++) {

        //Table Row
        var row = document.createElement('div');
        row.setAttribute('class', 'tr menuElement');

        var menuRow = new Array();
        var menuInhalt = new Array();

        //Table Row content
        for (var k = 0; k < length; k++) {
            menuRow[k] = document.createElement('div');
            menuRow[k].setAttribute('class', 'td');
        }

        //MenuInhalt
        for (var n = 1; n < length; n++) {
            menuInhalt[n] = document.createElement('span');
            menuInhalt[n].setAttribute('class', 'Input');
            menuInhalt[n].setAttribute('contenteditable', 'true');
        }
        menuInhalt[0] = document.createElement('input');
        menuInhalt[0].setAttribute('type', 'checkbox');

        menuInhalt[1].innerHTML = json[i].name;
        menuInhalt[2].innerHTML = json[i].size;
        menuInhalt[3].innerHTML = json[i].price;
        var extras = (json[i].extras.length == 0) ? "None" : json[i].extras
        menuInhalt[4].innerHTML = extras;
        menuInhalt[5].innerHTML = json[i].count;


        menuInhalt[4].removeAttribute('contenteditable');
        menuInhalt[4].setAttribute('data-toggle', 'modal');
        menuInhalt[4].setAttribute('data-target', '#modalExtras');
        menuInhalt[4].setAttribute('onClick', 'getJsonByRequest(getExtras,"extras"); loadExtras(' + JSON.stringify(json[i]) + ')');

        //Einfügen in HTML
        table.insertBefore(row, document.getElementById("modal-footer"));

        for (var c = 0; c < length; c++) {
            row.appendChild(menuRow[c]);
            menuRow[c].appendChild(menuInhalt[c]);
        }

    }
}

function markDelet() {
    alert("Kommt von Henry");
}