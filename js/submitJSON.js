//Checks Type alert(({}).toString.call(var).match(/\s([a-zA-Z]+)/)[1].toLowerCase());

var extras;
var object;

/**  Requests a JSON file in the /json directory of the server and calls a
    specified function with the parsed JSON Element as parameter.

    Parameters:
    - cFunction     the Function to call then successful
    - file          the file name without the .json ending

    Nothing happens on Error.
**/
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
    xhr.open('GET', url, true);
    //Sends the request
    xhr.send(null);
}

//Called to load JSON Content into the table
function loadJSONToTable(json, index) {
    getJsonByRequest(getExtras, "extras");
    var length;
    if (index == "menu") {
        length = 9;
    } else if (index == "extras") {
        length = 4;
    } else {
        length = 7;
    }
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
            menuInhalt[n].onkeydown = function(event) {
                var keys = [16,17,18,20,33,34,35,36,37,38,39,40,45,112,113,114,115,116,117,118,119,120,121,122,123,144,145];
                if (!keys.includes(event.keyCode))
                    this.setAttribute('class', 'bg-warning');
            };
        }
        menuInhalt[0] = document.createElement('input');
        menuInhalt[0].setAttribute('type', 'checkbox');
        menuInhalt[0].setAttribute('onchange', 'markDelete(this)');

        switch (index) {
            case "menu":
                menuInhalt[7].removeAttribute('contenteditable');
                menuInhalt[7].setAttribute('data-toggle', 'modal');
                menuInhalt[7].setAttribute('data-target', '#modal');
                menuInhalt[7].setAttribute('onClick', 'getJsonByRequest(getExtras,"extras"); loadExtras(' + JSON.stringify(json[i]) + ','+ i +')');

                menuInhalt[8] = document.createElement('img');
                menuInhalt[8].setAttribute('id', 'img');

                //Inhalt Menu
                menuInhalt[1].setAttribute('id', 'Name');
                menuInhalt[1].removeAttribute('contenteditable');
                menuInhalt[2].setAttribute('id', 'Description');
                menuInhalt[3].setAttribute('id', 'Prices');
                menuInhalt[4].setAttribute('id', 'Sizes');
                menuInhalt[5].setAttribute('id', 'Types');
                menuInhalt[6].setAttribute('id', 'Tags');
                menuInhalt[7].setAttribute('id', 'Extras');
                menuInhalt[8].setAttribute('src', "../img/menu/" + json[i].picture);

                menuInhalt[1].innerHTML = (json[i].name == "") ? "None" : json[i].name;
                menuInhalt[2].innerHTML = (json[i].description == "") ? "None" : json[i].description;
                menuInhalt[3].innerHTML = (json[i].prices == "") ? "None" :splitArray(json[i].prices) ;
                menuInhalt[4].innerHTML = (json[i].sizes == "") ? "None" : splitArray(json[i].sizes);
                menuInhalt[5].innerHTML = (json[i].types == "") ? "None" : json[i].types;
                menuInhalt[6].innerHTML = (json[i].tags == "") ? "None" : splitArray(json[i].tags);
                menuInhalt[7].innerHTML = (json[i].extras == "") ? "None" : splitArray(json[i].extras);
                break;
            case "customers":
                menuInhalt[6] = document.createElement('span');
                menuInhalt[6].setAttribute('data-toggle', 'modal');
                menuInhalt[6].setAttribute('data-target', '#modal');
                menuInhalt[6].setAttribute('onClick', 'loadContact(' + JSON.stringify(json[i].contact) + ')');

                //Inhalt Menu
                menuInhalt[1].setAttribute('id', 'ID');
                menuInhalt[1].removeAttribute('contenteditable');
                menuInhalt[2].setAttribute('id', 'Firstname');
                menuInhalt[3].setAttribute('id', 'Lastname');
                menuInhalt[4].setAttribute('id', 'EMail');
                menuInhalt[5].setAttribute('id', 'Password');
                menuInhalt[6].setAttribute('id', 'Contact');

                menuInhalt[1].innerHTML = (json[i].id == "") ? "None" : json[i].id;
                menuInhalt[2].innerHTML = (json[i].firstname == "") ? "None" : json[i].firstname;
                menuInhalt[3].innerHTML = (json[i].lastname == "") ? "None" : json[i].lastname;
                menuInhalt[4].innerHTML = (json[i].email == "") ? "None" : json[i].email;
                menuInhalt[5].innerHTML = (json[i].password == "") ? "None" : json[i].password;
                menuInhalt[6].innerHTML = (json[i].contact.name == "") ? "None" : json[i].contact.name;
                break;
            case "orders":
                menuInhalt[2].removeAttribute('contenteditable');
                menuInhalt[2].setAttribute('data-toggle', 'modal');
                menuInhalt[2].setAttribute('data-target', '#modalItems');
                menuInhalt[2].setAttribute('onClick', 'loadItems(' + JSON.stringify(json[i].items) + ', this)');

                menuInhalt[5].removeAttribute('contenteditable');
                menuInhalt[5].setAttribute('data-toggle', 'modal');
                menuInhalt[5].setAttribute('data-target', '#modal');
                menuInhalt[5].setAttribute('onClick', 'loadContactOrder(' + JSON.stringify(json[i].contact) + ')');

                //Inhalt Menu
                menuInhalt[1].setAttribute('id', 'ID');
                menuInhalt[1].removeAttribute('contenteditable');
                menuInhalt[2].setAttribute('id', 'Items');
                menuInhalt[3].setAttribute('id', 'Total');
                menuInhalt[4].setAttribute('id', 'CustomerID');
                menuInhalt[5].setAttribute('id', 'Contact');
                menuInhalt[6].setAttribute('id', 'Done');

                var items = new Array();
                for (var k = 0; k < json[i].items.length; k++) {
                    items[k] = json[i].items[k].name;
                }

                menuInhalt[1].innerHTML = (json[i].id == "") ? "None" : json[i].id;
                menuInhalt[2].innerHTML = (items == "") ? "None" : items;
                menuInhalt[3].innerHTML = (json[i].total == "") ? "None" : json[i].total;
                menuInhalt[4].innerHTML = (json[i].customerid == "") ? "None" : json[i].customerid;
                menuInhalt[5].innerHTML = (json[i].contact.name == "") ? "None" : json[i].contact.name;
                menuInhalt[6].innerHTML = (json[i].done == "") ? "None" : json[i].done;
                break;
            case "extras":
                menuInhalt[1].setAttribute('id', 'ID');
                menuInhalt[2].setAttribute('id', 'Name');
                menuInhalt[3].setAttribute('id', 'Preis');

                menuInhalt[1].innerHTML = (json[i].id == "") ? "None" : json[i].id;
                menuInhalt[2].innerHTML = (json[i].name == "") ? "None" : json[i].name;
                menuInhalt[3].innerHTML = (json[i].preis == "") ? "None" : json[i].preis;
                break;
        }

        //Einfügen in HTML
        table.insertBefore(row, document.getElementById("footer"));

        for (var c = 0; c < length; c++) {
            row.appendChild(menuRow[c]);
            menuRow[c].appendChild(menuInhalt[c]);
        }
    }
    if (index == "menu") extendTable();
}

function splitArray(array) {
    var str = "";
    for (var i = 0; i < array.length; i++) {
        str += array[i] + "; ";
    }
    str = str.substr(0, str.length - 2);
    return str;
}

function loadContact(json) {
    document.getElementsByClassName("modal-title")[0].innerHTML = (json.name == undefined) ? "" : json.name;
    document.getElementById("IDContact").innerHTML = (json.name == undefined) ? "" : json.name;
    document.getElementById("Postcode").innerHTML = (json.postcode == undefined) ? "" : json.postcode;
    document.getElementById("Street").innerHTML = (json.street == undefined) ? "" : json.street;
    document.getElementById("City").innerHTML = (json.city == undefined) ? "" : json.city;
    document.getElementById("Nr").innerHTML = (json.nr == undefined) ? "" : json.nr;
    document.getElementById("Phone").innerHTML = (json.phone == undefined) ? "" : json.phone;
}

function loadContactOrder(json) {
    document.getElementById("modalContactsTitle").innerHTML = (json.name == "") ? "None" : json.name;
    document.getElementById("modalContactsTitle").onkeydown = function() {
        this.setAttribute('class', 'bg-warning');
    };
    document.getElementById("Name").innerHTML = (json.name == "") ? "None" : json.name;
    document.getElementById("Name").onkeydown = function() {
        this.setAttribute('class', 'bg-warning');
    };
    document.getElementById("Postcode").innerHTML = (json.postcode == "") ? "None" : json.postcode;
    document.getElementById("Postcode").onkeydown = function() {
        this.setAttribute('class', 'bg-warning');
    };
    document.getElementById("Street").innerHTML = (json.street == "") ? "None" : json.street;
    document.getElementById("Street").onkeydown = function() {
        this.setAttribute('class', 'bg-warning');
    };
    document.getElementById("City").innerHTML = (json.city == "") ? "None" : json.city;
    document.getElementById("City").onkeydown = function() {
        this.setAttribute('class', 'bg-warning');
    };
    document.getElementById("Nr").innerHTML = (json.nr == "") ? "None" : json.nr;
    document.getElementById("Nr").onkeydown = function() {
        this.setAttribute('class', 'bg-warning');
    };
    document.getElementById("Phone").innerHTML = (json.phone == "") ? "None" : json.phone;
    document.getElementById("Phone").onkeydown = function() {
        this.setAttribute('class', 'bg-warning');
    };
}

function loadExtras(product,index) {

    document.getElementById("modalExtrasItems").innerHTML = (product == undefined) ? "Extras" : product.name + " Extras";
    var extrasBox = document.getElementById("extrasBox");
    extrasBox.setAttribute('name',index);

    while (extrasBox.firstChild) {
        console.log(extrasBox.firstChild);
        extrasBox.removeChild(extrasBox.firstChild);
    }

    for (var i = 0; i < extras.length; i++) {
        var li = document.createElement('li');
        var label = document.createElement('label');
        var input = document.createElement('input');
        var span = document.createElement('span');

        input.setAttribute('type', 'checkbox');
        input.setAttribute('id',extras[i].id);
        span.innerHTML = " " + extras[i].name;
        span.onkeydown = function() {
            this.setAttribute('class', 'bg-warning');
        };

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

function loadItems(json, elementThatWasClickedOn) {
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
            menuInhalt[n].onkeydown = function() {
                this.setAttribute('class', 'bg-warning');
            };
        }
        menuInhalt[0] = document.createElement('input');
        menuInhalt[0].setAttribute('type', 'checkbox');
        menuInhalt[0].setAttribute('onchange', 'markDelete(this)');

        menuInhalt[1].innerHTML = (json[i].name == "") ? "None" : json[i].name;
        menuInhalt[2].innerHTML = (json[i].size == "") ? "None" : json[i].size;
        menuInhalt[3].innerHTML = (json[i].price == "") ? "None" : json[i].price;
        menuInhalt[4].innerHTML = (json[i].extras.length == 0) ? "None" : json[i].extras;;
        menuInhalt[5].innerHTML = (json[i].count == "") ? "None" : json[i].count;


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

    object = elementThatWasClickedOn;

    var saveButton = document.getElementById("button-save-extras");
    saveButton.setAttribute('onClick', 'saveChangesOfItems(object)');
    //saveButton.onclick = saveChangesOfItems();


}

function markDelete(box) {
    if (box.checked) {
        box.parentElement.parentElement.setAttribute('class','tr bg-danger');
    } else {
        box.parentElement.parentElement.setAttribute('class','tr menuElement');
    }
}

function logOut() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "./index.html", true);
    xhr.setRequestHeader("Authorization", 'Basic ' + btoa('myuser:mypswd'));
    xhr.onload = function () {
        console.log(xhr.responseText);
        window.location = "../index.html"
    };
    xhr.send();
}



function saveChangesOfItems(elementToSaveTo) {
    alert(elementToSaveTo.id);

    elementToSaveTo.id = "neueId";


    var tableModal = document.getElementById("modal-table");


    //Get the chilren of the children of the tr menuElement elements (which are the spans) and store them in an array
    //var spans = tableModal.chil

    //get their values and format them

    //store them in elementToSave.onclick properly







}