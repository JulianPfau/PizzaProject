//Checks Type alert(({}).toString.call(var).match(/\s([a-zA-Z]+)/)[1].toLowerCase());

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
            cFunction(element);
        } else {
            //Nothing here, as this is called multiple times, even if it is successful.
        }
    }

    xhr.open('GET', url, true);
    xhr.send(null);
}

//Called to load JSON Content into the table
function loadJSONToTable(json, index) {
    var length = 0;
    var table = document.getElementsByClassName("table")[0];

    switch (index) {
        case 1:
            length = 9;
            break; //Menu
        case 2:
            length = 7;
            break; //Customer
        case 3:
            length = 7;
            break; //Orders
    }

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

        if (index == 1) { //Menu
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

        switch (index) {
            case 1:
                menuInhalt[7].removeAttribute('contenteditable');
                menuInhalt[7].setAttribute('data-toggle', 'modal');
                menuInhalt[7].setAttribute('data-target', '#modal');
                menuInhalt[7].setAttribute('onClick', 'loadExtras(' + JSON.stringify(json[i]) + ', [{"id": 1,"name": "Extra K&auml;se","preis": 1.0},{"id": 2,"name": "Extra Bacon","preis": 1.5},{"id": 3,"name": "schneiden","preis": 0}])');

                menuInhalt[8] = document.createElement('img');
                menuInhalt[8].setAttribute('id', 'img');

                //Inhalt Menu
                menuInhalt[1].setAttribute('id', 'Name');
                menuInhalt[2].setAttribute('id', 'Description');
                menuInhalt[3].setAttribute('id', 'Prices');
                menuInhalt[4].setAttribute('id', 'Sizes');
                menuInhalt[5].setAttribute('id', 'Type');
                menuInhalt[6].setAttribute('id', 'Tags');
                menuInhalt[6].setAttribute('id', 'Extras');
                menuInhalt[8].setAttribute('src', "./img/" + json.picture + ".png");

                menuInhalt[1].innerHTML = json[i].name;
                menuInhalt[2].innerHTML = json[i].description;
                menuInhalt[3].innerHTML = splitArray(json[i].price);
                menuInhalt[4].innerHTML = splitArray(json[i].size);
                menuInhalt[5].innerHTML = json[i].type;
                menuInhalt[6].innerHTML = splitArray(json[i].tags);
                menuInhalt[7].innerHTML = splitArray(json[i].extras);
                break;
            case 2:
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
        }

        //Einfügen in HTML
        table.insertBefore(row, document.getElementById("footer"));

        for (var c = 0; c < length; c++) {
            row.appendChild(menuRow[c]);
            menuRow[c].appendChild(menuInhalt[c]);
        }
    }
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
    document.getElementsByClassName("modal-title")[0].innerHTML = json.id;
    document.getElementById("IDContact").innerHTML = json.id;
    document.getElementById("Postcode").innerHTML = json.postcode;
    document.getElementById("Street").innerHTML = json.street;
    document.getElementById("City").innerHTML = json.city;
    document.getElementById("Nr").innerHTML = json.nr;
    document.getElementById("Phone").innerHTML = json.phone;
}

//Parameter Extras = extras JSON
function loadExtras(all, extras) {
    var json = all.extras;

    document.getElementsByClassName("modal-title")[0].innerHTML = all.name + " Extras";
    var extrasBox = document.getElementById("extrasBox");

    for (var i = 0; i < extras.length; i++) {
        var li = document.createElement('li');
        var lable = document.createElement('label');
        var input = document.createElement('input');
        var span = document.createElement('span');

        input.setAttribute('type', 'checkbox');
        span.innerHTML = extras[i].name;

        for (var n = 0; n < json.length; n++) {
            if (json[n] == extras[i].id)
                input.setAttribute('checked', '');
        }

        lable.appendChild(input);
        lable.appendChild(span);
        li.appendChild(lable);
        extrasBox.appendChild(li);

    }
}