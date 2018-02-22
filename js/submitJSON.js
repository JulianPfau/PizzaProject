//Checks Type alert(({}).toString.call(var).match(/\s([a-zA-Z]+)/)[1].toLowerCase());

window.onload = loadJSCONToTable;

/*  Requests a JSON file in the /json directory of the server and calls a
    specified function with the parsed JSON Element as parameter.

    Parameters:
    - cFunction     the Function to call then successful
    - file          the file name without the .json ending

    Nothing happens on Error.
*/

function getJsonByRequest(cFunction, file) {
    var url  = "https://localhost:8080/json/" + file + ".json";
    var xhr  = new XMLHttpRequest()

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

function createNewJSON() {
    var input = document.getElementsByClassName("footer");

    var name = (input.item(0).innerHTML == "") ? "tbd" : input.item(0).innerHTML;
    var description = (input.item(1).innerHTML == "") ? "tbd" : input.item(1).innerHTML;
    var prices = (input.item(2).innerHTML == "") ? "tbd" : input.item(2).innerHTML;
    var sizes = (input.item(3).innerHTML == "") ? "tbd" : input.item(3).innerHTML;
    var type = (input.item(4).innerHTML == "") ? "tbd" : input.item(4).innerHTML;
    var tags = (input.item(5).innerHTML == "") ? "tbd" : input.item(5).innerHTML;


    if (prices.length == sizes.length) {
        var json = {
            "name"          :   name,
            "description"   :   description,
            "price"         :   prices,
            "size"          :   sizes,
            "type"          :   type,
            "tags"          :   tags
        };
    } else {
        document.getElementById("check").innerHTML = "Die Anzahl an Preisen muss mit der Anzahl an Gr&ouml;&szlig;en &uuml;bereinstimmen!";
    }
}


//Called to load JSON Content into the table
function loadJSONToTable(json, index) {
    var table = document.getElementsByClassName("table")[0];

    for (var i = 0; i < json.length; i++) {
        var row = document.createElement('div');
        row.setAttribute('class', 'tr menuElement');

        var menuRow = new Array();
        var menuInhalt = new Array();

        //MenuRow
        for (var k = 0; k < 8; k++) {
            menuRow[k] = document.createElement('div');
            menuRow[k].setAttribute('class', 'td');
        }
        menuRow[7].setAttribute('id', 'img');

        //MenuInhalt
        menuInhalt[0] = document.createElement('input');
        menuInhalt[0].setAttribute('type', 'checkbox');
        for (var n = 0; n < 8; n++) {
            if (n > 0 && n < 7) {
                menuInhalt[n] = document.createElement('span');
                menuInhalt[n].setAttribute('class', 'Input');
                menuInhalt[n].setAttribute('contenteditable', 'true');
            }
        }
        menuInhalt[7] = document.createElement('img');
        menuInhalt[7].setAttribute('id', 'img');


        //Inhalt Menu
        menuInhalt[1].setAttribute('id', 'Name');
        menuInhalt[2].setAttribute('id', 'Description');
        menuInhalt[3].setAttribute('id', 'Prices');
        menuInhalt[4].setAttribute('id', 'Sizes');
        menuInhalt[5].setAttribute('id', 'Type');
        menuInhalt[6].setAttribute('id', 'Tags');
        menuInhalt[7].setAttribute('src', "./img/" + json.picture + ".png");

        menuInhalt[1].innerHTML = json[i].name;
        menuInhalt[2].innerHTML = json[i].description;
        menuInhalt[3].innerHTML = splitArray(json[i].price);
        menuInhalt[4].innerHTML = splitArray(json[i].size);
        menuInhalt[5].innerHTML = json[i].type;
        menuInhalt[6].innerHTML = splitArray(json[i].tags);


        //Einfügen in HTML
        table.insertBefore(row, document.getElementById("footer"));

        for (var c = 0; c < 8; c++) {
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