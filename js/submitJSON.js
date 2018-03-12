//Checks Type alert(({}).toString.call(var).match(/\s([a-zA-Z]+)/)[1].toLowerCase());

var extras;

//var object;

/**  Requests a JSON file in the /json directory of the server and calls a
 specified function with the parsed JSON Element as parameter.

 Parameters:
 - cFunction     the Function to call then successful
 - file          the file name without the .json ending

 Nothing happens on Error.
 **/
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
    xhr.open('GET', url, true);
    //Sends the request
    xhr.send(null);
}

/**
 * This function loads the JSON data in the rigth table!
 *
 * @param json String/Object which contains the data
 * @param index name of the data/table/json
 */
function loadJSONToTable(json, index) {

    //Loads the extras JSON in var extras
    getJsonByRequest(getExtras, "extras");

    //Defines the length, equals the numbers of collums in the table
    var length;
    if (index == "menu") {
        length = 9;
    } else if (index == "extras") {
        length = 4;
    } else {
        length = 7;
    }

    //Gets the DOM-Element of the table
    var table = document.getElementsByClassName("table")[0];

    //Loop all JSON Entries
    for (var i = 0; i < json.length; i++) {

        //Arrays to save the content of each row
        var menuRow = new Array();
        var menuInhalt = new Array();

        //Creates the table row DON-Element
        var row = document.createElement('div');
        row.setAttribute('class', 'tr menuElement');

        //Creates the table rows cells
        for (var k = 0; k < length; k++) {
            menuRow[k] = document.createElement('div');
            menuRow[k].setAttribute('class', 'td');
        }

        //Gives the table on menu site the img specification
        if (index == "menu") { //Menu
            menuRow[8].setAttribute('id', 'img');
        }

        //Adds to all cells an inner DOM-Element which can be edited
        for (var n = 1; n < length; n++) {
            menuInhalt[n] = document.createElement('span');
            menuInhalt[n].setAttribute('class', 'Input');
            menuInhalt[n].setAttribute('contenteditable', 'true');
            //Also add the event for highlighting changes
            menuInhalt[n].onkeydown = function (event) {
                //Key-Codes which will be ignored
                if (event.keyCode == 8 || (event.keyCode > 44 && event.keyCode < 111) || (event.keyCode > 185 && event.keyCode < 192) || (event.keyCode > 218 && event.keyCode < 223)) {
                    //Activates the del changes button
                    document.getElementById("reload").setAttribute("class", "btn btn-lg active")
                    this.parentElement.setAttribute('class', 'td bg-warning');
                }
            };
        }
        // Creates the delet Button and add function to change
        menuInhalt[0] = document.createElement('input');
        menuInhalt[0].setAttribute('type', 'checkbox');
        menuInhalt[0].setAttribute('onchange', 'markDelete(this)');

        //Specifies content for each site
        switch (index) {
            //Menu
            case "menu":
                //Sets everything to open Extras Popup
                menuInhalt[7].removeAttribute('contenteditable');
                menuInhalt[7].setAttribute('data-toggle', 'modal');
                menuInhalt[7].setAttribute('data-target', '#modal');
                menuInhalt[7].setAttribute('onClick', 'getJsonByRequest(getExtras,"extras"); loadExtras(' + JSON.stringify(json[i]) + ',' + i + ')');

                //Adds picture to Table
                menuInhalt[8] = document.createElement('img');
                menuInhalt[8].setAttribute('id', 'img');

                //IDs for each Cell & SRC fot Image
                menuInhalt[1].setAttribute('id', 'Name');
                menuInhalt[1].removeAttribute('contenteditable');
                menuInhalt[2].setAttribute('id', 'Description');
                menuInhalt[3].setAttribute('id', 'Prices');
                menuInhalt[4].setAttribute('id', 'Sizes');
                menuInhalt[5].setAttribute('id', 'Types');
                menuInhalt[6].setAttribute('id', 'Tags');
                menuInhalt[7].setAttribute('id', 'Extras');
                menuInhalt[8].setAttribute('src', "../img/menu/" + json[i].picture);

                //Content from JSON to be displayes
                menuInhalt[1].innerHTML = (json[i].name == "") ? "None" : json[i].name;
                menuInhalt[2].innerHTML = (json[i].description == "") ? "None" : json[i].description;
                menuInhalt[3].innerHTML = (json[i].prices == "") ? "None" : splitArray(json[i].prices);
                menuInhalt[4].innerHTML = (json[i].sizes == "") ? "None" : splitArray(json[i].sizes);
                menuInhalt[5].innerHTML = (json[i].types == "") ? "None" : json[i].types;
                menuInhalt[6].innerHTML = (json[i].tags == "") ? "None" : splitArray(json[i].tags);
                menuInhalt[7].innerHTML = (json[i].extras == "") ? "None" : splitArray(json[i].extras);

                document.getElementById('footer').getElementsByClassName('Input footer')[6].setAttribute("onClick", "getJsonByRequest(getExtras,'extras'); loadExtras({}, " + (i + 1) + ")");

                break;

            //Customers
            case "customers":
                //Sets everything to open Contact Popup
                menuInhalt[6] = document.createElement('span');
                menuInhalt[6].setAttribute('data-toggle', 'modal');
                menuInhalt[6].setAttribute('data-target', '#modal');
                menuInhalt[6].setAttribute('onClick', 'loadContact(' + JSON.stringify(json[i].contact) + ', ' + i + ')');

                //IDs for each cell & remove option to change ID
                menuInhalt[1].setAttribute('id', 'ID');
                menuInhalt[1].removeAttribute('contenteditable');
                menuInhalt[2].setAttribute('id', 'Firstname');
                menuInhalt[3].setAttribute('id', 'Lastname');
                menuInhalt[4].setAttribute('id', 'EMail');
                menuInhalt[5].setAttribute('id', 'Password');
                menuInhalt[6].setAttribute('id', 'Contact');

                //Content from JSON to be displayes
                menuInhalt[1].innerHTML = (json[i].id == "") ? "None" : json[i].id;
                menuInhalt[2].innerHTML = (json[i].firstname == "") ? "None" : json[i].firstname;
                menuInhalt[3].innerHTML = (json[i].lastname == "") ? "None" : json[i].lastname;
                menuInhalt[4].innerHTML = (json[i].email == "") ? "None" : json[i].email;
                menuInhalt[5].innerHTML = (json[i].password == "") ? "None" : json[i].password;
                menuInhalt[6].innerHTML = (json[i].contact.name == "") ? "None" : json[i].contact.name;

                document.getElementById('footer').lastElementChild.setAttribute("onClick", "loadContact({}, " + (i + 1) + ")");

                break;

            //Orders
            case "orders":
                //Sets everything to open Items Popup
                menuInhalt[2].removeAttribute('contenteditable');
                menuInhalt[2].setAttribute('data-toggle', 'modal');
                menuInhalt[2].setAttribute('data-target', '#modalItems');
                //Sets the onclick event for the items span. Will also send the index i for further use
                menuInhalt[2].setAttribute('onClick', 'loadItems(' + JSON.stringify(json[i].items) + ', ' + i + ')');
                menuInhalt[2].setAttribute('identification', 'spanElement' + i);

                //Setting an identifier for the total, so the sum can be calculated lateron.
                menuInhalt[3].setAttribute('identification-of-total', 'total' + i);

                //Sets everything to open Contact Popup
                menuInhalt[5].removeAttribute('contenteditable');
                menuInhalt[5].setAttribute('data-toggle', 'modal');
                menuInhalt[5].setAttribute('data-target', '#modal');
                menuInhalt[5].setAttribute('onClick', 'loadContactOrder(' + JSON.stringify(json[i].contact) + ', ' + i + ')');
                menuInhalt[6] = document.createElement('input');

                //IDs for each cell & remove option to change ID
                menuInhalt[1].setAttribute('id', 'ID');
                menuInhalt[1].removeAttribute('contenteditable');
                menuInhalt[2].setAttribute('id', 'Items');
                menuInhalt[3].setAttribute('id', 'Total');
                menuInhalt[4].setAttribute('id', 'CustomerID');
                menuInhalt[5].setAttribute('id', 'Contact');
                menuInhalt[6].setAttribute('id', 'Done');
                menuInhalt[6].setAttribute('type', 'checkbox');

                //Save items name in Array to be displayed later
                var items = new Array();
                for (var k = 0; k < json[i].items.length; k++) {
                    items[k] = "";
                    if (json[i].items[k].count > 1)
                        items[k] = json[i].items[k].count + "x "
                    items[k] += json[i].items[k].name;
                }
                //Content from JSON to be displayed
                menuInhalt[1].innerHTML = (json[i].id == "") ? "None" : json[i].id;
                menuInhalt[2].innerHTML = (items == "") ? "None" : items;
                menuInhalt[3].innerHTML = (json[i].total == "") ? "None" : json[i].total;
                menuInhalt[4].innerHTML = (json[i].customerid == "") ? "None" : json[i].customerid;
                menuInhalt[5].innerHTML = (json[i].contact.name == "") ? "None" : json[i].contact.name;
                if (json[i].done == 1) menuInhalt[6].setAttribute('checked','');
                break;

            //Extras
            case "extras":
                //IDs for each cell
                menuInhalt[1].setAttribute('id', 'ID');
                menuInhalt[2].setAttribute('id', 'Name');
                menuInhalt[3].setAttribute('id', 'Price');

                //Content from JSON to be displayed
                menuInhalt[1].innerHTML = (json[i].id == "") ? "None" : json[i].id;
                menuInhalt[2].innerHTML = (json[i].name == "") ? "None" : json[i].name;
                menuInhalt[3].innerHTML = json[i].price;
                break;
        }

        //Insert in HTML on end of table, but befor footer(the last/empty row)
        table.insertBefore(row, document.getElementById("footer"));

        //Appends all cell content to cell and each cell to row
        for (var c = 0; c < length; c++) {
            row.appendChild(menuRow[c]);
            menuRow[c].appendChild(menuInhalt[c]);
        }
    }
    //Add the option to change picture
    if (index == "menu") extendTable();
}

/**
 * Function to convert the Array into an displayable String
 *
 * @param array which should be convertet to be a ';' seperated String
 * @returns {string} the String to be displayed
 */
function splitArray(array) {
    var str = "";
    if (array == "None") {
        str = "None";
    } else {
        //Seperates the array content witch ";"
        for (var i = 0; i < array.length; i++) {
            str += array[i] + ";";
        }
        //Removes the last ";"
        str = str.substr(0, str.length - 1);
    }
    return str;
}

/**
 * Loads the Contact Content into the Popup
 *
 * @param json The JSON woch should be displayed
 */
function loadContact(json, index) {
    //Popup title is name of Contact
    document.getElementsByClassName("btn btn-primary")[0].setAttribute('onClick', 'saveContactPopup("' + index + '")');
    document.getElementsByClassName("modal-title")[0].innerHTML = (json.name == undefined) ? "" : json.name;
    document.getElementById("Name").innerHTML = (json.name == undefined) ? "" : json.name;
    document.getElementById("Postcode").innerHTML = (json.postcode == undefined) ? "" : json.postcode;
    document.getElementById("Street").innerHTML = (json.street == undefined) ? "" : json.street;
    document.getElementById("City").innerHTML = (json.city == undefined) ? "" : json.city;
    document.getElementById("Nr").innerHTML = (json.nr == undefined) ? "" : json.nr;
    document.getElementById("Phone").innerHTML = (json.phone == undefined) ? "" : json.phone;
}

/**
 * Loads JSON content to Contacts on orders site
 *
 * @param json wich should be displayed in Popup
 */
function loadContactOrder(json, index) {

    var fields = document.getElementsByClassName('modal-body')[2].getElementsByClassName('tr')[1].children;
    for (var f = 0; f < fields.length; f++) fields[f].setAttribute('class', 'td');


    document.getElementsByClassName('btn btn-primary')[2].setAttribute('onclick', "saveContactOrdersPopup(" + index + ")");
    //Content for Cell
    document.getElementById("modalContactsTitle").innerHTML = (json.name == "") ? "None" : json.name;
    //Change Event
    document.getElementById("modalContactsTitle").onkeydown = function () {
        if (event.keyCode == 8 || (event.keyCode > 44 && event.keyCode < 111) || (event.keyCode > 185 && event.keyCode < 192) || (event.keyCode > 218 && event.keyCode < 223)) {
            document.getElementById("reload").setAttribute("class", "btn btn-lg active")
            this.parentElement.setAttribute('class', 'td bg-warning');
        }
    };
    document.getElementById("Name").innerHTML = (json.name == "") ? "None" : json.name;
    document.getElementById("Name").onkeydown = function () {
        if (event.keyCode == 8 || (event.keyCode > 44 && event.keyCode < 111) || (event.keyCode > 185 && event.keyCode < 192) || (event.keyCode > 218 && event.keyCode < 223)) {
            document.getElementsByClassName('tr menuElement')[index].getElementsByClassName('td')[5].firstElementChild.innerHTML = document.getElementById("Name").innerHTML;
            document.getElementById("reload").setAttribute("class", "btn btn-lg active")
            this.parentElement.setAttribute('class', 'td bg-warning');
        }
    };
    document.getElementById("Postcode").innerHTML = (json.postcode == "") ? "None" : json.postcode;
    document.getElementById("Postcode").onkeydown = function () {
        if (event.keyCode == 8 || (event.keyCode > 44 && event.keyCode < 111) || (event.keyCode > 185 && event.keyCode < 192) || (event.keyCode > 218 && event.keyCode < 223)) {
            document.getElementById("reload").setAttribute("class", "btn btn-lg active")
            this.parentElement.setAttribute('class', 'td bg-warning');
        }
    };
    document.getElementById("Street").innerHTML = (json.street == "") ? "None" : json.street;
    document.getElementById("Street").onkeydown = function () {
        if (event.keyCode == 8 || (event.keyCode > 44 && event.keyCode < 111) || (event.keyCode > 185 && event.keyCode < 192) || (event.keyCode > 218 && event.keyCode < 223)) {
            document.getElementById("reload").setAttribute("class", "btn btn-lg active")
            this.parentElement.setAttribute('class', 'td bg-warning');
        }
    };
    document.getElementById("City").innerHTML = (json.city == "") ? "None" : json.city;
    document.getElementById("City").onkeydown = function () {
        if (event.keyCode == 8 || (event.keyCode > 44 && event.keyCode < 111) || (event.keyCode > 185 && event.keyCode < 192) || (event.keyCode > 218 && event.keyCode < 223)) {
            document.getElementById("reload").setAttribute("class", "btn btn-lg active")
            this.parentElement.setAttribute('class', 'td bg-warning');
        }
    };
    document.getElementById("Nr").innerHTML = (json.nr == "") ? "None" : json.nr;
    document.getElementById("Nr").onkeydown = function () {
        if (event.keyCode == 8 || (event.keyCode > 44 && event.keyCode < 111) || (event.keyCode > 185 && event.keyCode < 192) || (event.keyCode > 218 && event.keyCode < 223)) {
            document.getElementById("reload").setAttribute("class", "btn btn-lg active")
            this.parentElement.setAttribute('class', 'td bg-warning');
        }
    };
    document.getElementById("Phone").innerHTML = (json.phone == "") ? "None" : json.phone;
    document.getElementById("Phone").onkeydown = function () {
        if (event.keyCode == 8 || (event.keyCode > 44 && event.keyCode < 111) || (event.keyCode > 185 && event.keyCode < 192) || (event.keyCode > 218 && event.keyCode < 223)) {
            document.getElementById("reload").setAttribute("class", "btn btn-lg active")
            this.parentElement.setAttribute('class', 'td bg-warning');
        }
    };
}

/**
 * Function to load Extras into Popup on menu site
 *
 * @param product the JSON of the Item
 * @param index to get the parent on save needed
 */
function loadExtras(product, index) {
    //Sets title of Extras Popup
    document.getElementById("modalExtrasItems").innerHTML = (product == undefined) ? "Extras" : product.name + " Extras";
    //Sets index for write
    var extrasBox = document.getElementById("extrasBox");
    extrasBox.setAttribute('name', index);

    //Removes all Extras from Popup
    while (extrasBox.firstChild) {
        extrasBox.removeChild(extrasBox.firstChild);
    }

    //Loops every extra from JSON
    for (var i = 0; i < extras.length; i++) {
        //Creates DOM-Elements for Popup
        var li = document.createElement('li');
        var label = document.createElement('label');
        var input = document.createElement('input');
        var span = document.createElement('span');

        //Defines the checkbox
        input.setAttribute('type', 'checkbox');
        input.setAttribute('id', extras[i].id);

        //Content & Change Event for extra
        span.innerHTML = " " + extras[i].name;
        span.onkeydown = function () {
            if (event.keyCode == 8 || (event.keyCode > 44 && event.keyCode < 111) || (event.keyCode > 185 && event.keyCode < 192) || (event.keyCode > 218 && event.keyCode < 223)) {
                document.getElementById("reload").setAttribute("class", "btn btn-lg active")
                this.parentElement.setAttribute('class', 'td bg-warning');
            }
        };

        //Checks weather the extras is already in selected or not and it'll be marked if so
        if (product.extras != undefined) {
            for (var k = 0; k < extras.length; k++) {
                if (product.extras[k] == extras[i].id)
                    input.setAttribute('checked', '');
            }
        }

        //Appends all DOM-Elemnts to bi displayed
        label.appendChild(input);
        label.appendChild(span);
        li.appendChild(label);
        extrasBox.appendChild(li);
    }
}

/**
 * Saves the json to global extras value
 *
 * @param json from the getJSONFromServer
 */
function getExtras(json) {
    extras = json;
}

/**
 * Function to load Items into Popup on orders site
 *
 * @param json with the Items to be loaded
 */
function loadItems(json, indexOfSpan) {
    //get the table in wich should be loaded
    var table = document.getElementById("modal-table");
    var length = 6;

    //Sets the Title of the Popup
    document.getElementById("modalItemsTitle").innerText = "Items:";

    //Removes all Items
    for (var y = table.children.length - 1; y > 0; y--) {
        if (table.children[y].classList.contains("tr")) {
            table.removeChild(table.children[y]);
        }
    }

    //Loops every Item from JSON
    for (var i = 0; i < json.length; i++) {

        //Creats DOM-Element for row
        var row = document.createElement('div');
        row.setAttribute('class', 'tr menuElement');

        //Arrays to save the content of each row
        var menuRow = new Array();
        var menuInhalt = new Array();

        //Creates DOM-Element for each cell
        for (var k = 0; k < length; k++) {
            menuRow[k] = document.createElement('div');
            menuRow[k].setAttribute('class', 'td');
        }

        //Adds to all cells an inner DOM-Element which can be edited
        for (var n = 1; n < length; n++) {
            menuInhalt[n] = document.createElement('span');
            menuInhalt[n].setAttribute('class', 'Input');
            menuInhalt[n].setAttribute('contenteditable', 'true');
            //Onchange event
            menuInhalt[n].onkeydown = function () {
                if (event.keyCode == 8 || (event.keyCode > 44 && event.keyCode < 111) || (event.keyCode > 185 && event.keyCode < 192) || (event.keyCode > 218 && event.keyCode < 223)) {
                    document.getElementById("reload").setAttribute("class", "btn btn-lg active")
                    this.parentElement.setAttribute('class', 'td bg-warning');
                }
            };
        }
        //Creats the delete button + function
        menuInhalt[0] = document.createElement('input');
        menuInhalt[0].setAttribute('type', 'checkbox');
        menuInhalt[0].setAttribute('onchange', 'markDelete(this)');

        //Content of all cells
        var div = document.createElement('div');
        div.setAttribute('class', 'dropdown');
        div.setAttribute('data-toggle', 'dropdown');
        div.setAttribute('onclick', 'getJsonByRequest(dropdownItems, "menu")');
        var span = document.createElement('span');
        span.setAttribute('class', 'dropdown-toggle');
        span.innerHTML = (json[i].name == "") ? "None" : json[i].name;
        var ul = document.createElement('ul');
        ul.setAttribute('class', 'dropdown-menu');
        ul.setAttribute('id', 'dropDownList');
        div.appendChild(ul);
        div.appendChild(span);
        menuInhalt[1].appendChild(div);
        menuInhalt[1].removeAttribute('contenteditable');

        menuInhalt[2].innerHTML = (json[i].size == "") ? "None" : json[i].size;
        menuInhalt[3].innerHTML = (json[i].price == "") ? "None" : json[i].price;
        menuInhalt[4].innerHTML = (json[i].extras.length == 0) ? "None" : json[i].extras;
        menuInhalt[5].innerHTML = (json[i].count == "") ? "None" : json[i].count;

        //Prepare the Exras Popup
        menuInhalt[4].removeAttribute('contenteditable');
        menuInhalt[4].setAttribute('data-toggle', 'modal');
        menuInhalt[4].setAttribute('data-target', '#modalExtras');
        menuInhalt[4].setAttribute('onClick', 'getJsonByRequest(getExtras,"extras"); loadExtras(' + JSON.stringify(json[i]) + ', ' + i + ')');

        //Einfügen in HTML
        table.insertBefore(row, document.getElementById("modal-footer"));

        for (var c = 0; c < length; c++) {
            row.appendChild(menuRow[c]);
            menuRow[c].appendChild(menuInhalt[c]);
        }

    }


    //My Part for testing


    var buttonModalItemsSave = document.getElementById("button-modal-items-save");
    buttonModalItemsSave.setAttribute("onClick", 'storeItemsInOrders(' + indexOfSpan + ')');


}

/**
 * Function to mark the box wich should be deleted
 *
 * @param box
 */
function markDelete(box) {
    if (box.checked) {
        box.parentElement.parentElement.setAttribute('class', 'tr bg-danger');
    } else {
        box.parentElement.parentElement.setAttribute('class', 'tr menuElement');
    }
}

/**
 * Function to logout a user on Admin sites
 */
function logOut() {
    //Request wich logs out
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "./admin.html", true);
    xhr.setRequestHeader("Authorization", 'Basic ' + btoa('myuser:mypswd'));
    xhr.onload = function () {
        console.log(xhr.response);
        //Loads index site when loged out
        window.location = "../index.html"
    };
    xhr.send();
}

/**
 * Function to create the dropdown to selecte new Item on orders
 *
 * @param json of all Items from menu
 */
function dropdownItems(json) {
    //Removes all Items from dropdown
    var dropDowns = document.getElementsByClassName("dropdown-menu");
    for (var d = 0; d < dropDowns.length; d++) {
        while (dropDowns[d].firstChild) {
            dropDowns[d].removeChild(dropDowns[d].firstChild);
        }
    }

    //Loops each Item from JSON
    for (var i = 0; i < json.length; i++) {
        //Creates DOM-Element for Dropdown
        var dropDowns = document.getElementsByClassName("dropdown-menu");
        for (var d = 0; d < dropDowns.length; d++) {
            var li = document.createElement("li");
            li.setAttribute('class', 'align-baseline');
            //Adds Function to add content for Dropdown
            li.setAttribute("onClick", "fillItems(this, " + JSON.stringify(json[i]) + ")");

            //Append all displays to be displayed
            li.innerHTML = json[i].name;
            dropDowns[d].appendChild(li);
        }
    }
}

/**
 * Function to add content to the Dropdown MEnu in orders
 *
 * @param btn the Button where the Items will be displayed
 * @param json Items wich will be displayed
 */
function fillItems(btn, json) {
    var span = btn.parentElement.parentElement;
    span.getElementsByTagName("span")[0].innerHTML = json.name;
    span.getElementsByTagName("span")[0].parentElement.parentElement.parentElement.setAttribute('class', 'td bg-warning');

    var row = span.parentElement.parentElement.parentElement.children;
    row[2].firstChild.innerHTML = json.sizes[json.sizes.length - 1];
    row[2].firstChild.parentElement.setAttribute('class', 'td bg-warning');
    row[3].firstChild.innerHTML = json.prices[json.prices.length - 1];
    row[3].firstChild.parentElement.setAttribute('class', 'td bg-warning');
}

/**
 * Function to create a new Footer on Input
 *
 * @param span the DOM-Element wich musst be filled to create new footer
 */
function loadNewFooter(span) {
    //If span not empty
    if (span.innerHTML != "") {

        //Creates new row while removing ID from old footer and clone it
        var row = span.parentElement.parentElement;
        row.removeAttribute("id");
        row.parentElement.appendChild(row.cloneNode(true));
        row.setAttribute("id", "footer")

        //Empty all content and adds change Event
        //Removes the create new footer function
        for (var k = 0; k < row.children.length; k++) {
            if (row.children[k].firstChild != null) {
                row.children[k].firstChild.setAttribute("class", "Input bg-warning");
                row.children[k].firstChild.removeAttribute("onBlur");
            }
        }

        //Adds delete Button
        var del = document.createElement('input');
        del.setAttribute('type', 'checkbox');
        del.setAttribute('onchange', 'markDelete(this)');

        row.firstElementChild.appendChild(del);

        //Edit the old footer to be a normal row
        var newRow = row.parentElement.lastChild;
        for (var i = 0; i < newRow.childNodes.length; i++) {
            if (newRow.childNodes[i].firstElementChild != null) {
                newRow.childNodes[i].firstElementChild.innerHTML = "";
                newRow.childNodes[i].firstElementChild.removeAttribute("bg-warning");
                if (newRow.childNodes[i].id == "img")
                    newRow.childNodes[i].firstElementChild.src = "../img/menu/default.png";
            }
        }
    }
}

/*
 *  Function to store the changes made in the modal items window.
 *
 *  Parameters:
 *      -   indexOfSpan:    int value to specify which element in which row was being clicked on
 *                          This will help tu find in later on.
 *
 *  This is being called, when the save button of the modal items window (the one that is opened, when someone
 *  on orders.html clicks on one of the "items" elements) is being pressed.
 *
 *  The items elements in the table of orders.html have following onclick-event:
 *  EXAMPLE:     loadItems([{"name":"Salami Pizza","size":"L","price":7.99,"extras":[1,2],"count":1}], 0)
 *
 *  This calls the loadItems() Function with the parameters:
 *      -   jsonElement for the content:                    [{"name":"Salami Pizza","size":"L","price":7.99,"extras":[1,2],"count":1}]
 *      -   int index of which element was clicked on:      0
 *
 *  The loadItems() Function builds the modal items window with the content that is given in the json object.
 *
 *  This(!) function (storeItemsInOrders) basically takes all the content of the modal-table and generates the onclick
 *  attribute that looks like the example above. When this is generated, it is overwritten to the element that is found by
 *  using the parameter indexOfSpan.
 *
 *
 *  Last Change:    6.3.2018            Author:     Nickels Witte
 */
function storeItemsInOrders(indexOfSpan) {
    document.getElementById("reload").setAttribute("class", "btn btn-lg active")

    //Getting the table of the modal window
    var tableOfItemsModal = document.getElementById("modal-table");
    //Getting all the entries with the class "menuElement", which basically are the tableRows (that are not marked to be deleted)
    var entriesOfTable = tableOfItemsModal.getElementsByClassName("menuElement");

    //Storing the amount of menuElement-elements we have for further use.
    var lengthOfEntriesOfTable = entriesOfTable.length;


    //This part will find the element that was clicked on by using the identifier
    var thisElementThatWasClickedOn;
    var itemsSpanElements = document.querySelectorAll('[identification]');
    for (var i4 = 0, lengthOfSpanElements = itemsSpanElements.length; i4 < lengthOfSpanElements; ++i4) {
        if (itemsSpanElements[i4].getAttribute("identification") == ("spanElement" + indexOfSpan)) {
            thisElementThatWasClickedOn = itemsSpanElements[i4];
        }
    }

    //This part will get the total element that is next to the items element, that was clicked on (The total cost element).
    var totalElement;
    var totalsSpanElements = document.querySelectorAll('[identification-of-total]');

    for (var i5 = 0, lengthofTotalsSpanElements = totalsSpanElements.length; i5 < lengthofTotalsSpanElements; ++i5) {
        if (totalsSpanElements[i5].getAttribute("identification-of-total") == ("total" + indexOfSpan)) {
            totalElement = totalsSpanElements[i5];
        }
    }

    //Getting the <p> Element to push error messages to
    var errorMessageHTMLElement = document.getElementById("error-message");
    //Empty String for storing errors
    //For every error there will be a letter added, so the length is the number of errors
    //and the kind of letters tell which errors there are
    //Key:
    //  - n: NaN (Not a Number)
    //  - e: empty (someone didnt enter anything)
    var errors = "";


    //Array with the json keywords
    var jsonFormatting = ["name", "size", "price", "extras", "count"];

    //When there are any elements that are not marked to be deleted (or in other words, if there are more than 0 elements
    //with the class menuElement), then do the following
    if (lengthOfEntriesOfTable > 0) {

        //String where the onclickattribute will be stored in. It will have the following format:
        //Format: loadItems([{"name":"Salami Pizza","size":"L","price":7.99,"extras":[1,2],"count":1},{"name":"Cola","size":"0.5","price":4.99,"extras":[],"count":2}], 0)
        var itemsStoredToJson = 'loadItems([';
        //The names of all items for the table of orders.html
        var namesOfItems = "";
        //The sum of all the costs
        var costSumOfAllItems = 0;

        //First for loop to cycle through the rows
        for (var i2 = 0; i2 < lengthOfEntriesOfTable; ++i2) {
            //The beginning of one json element
            itemsStoredToJson += '{';

            //Storing the count of this row for further use
            var countOfThisRow = parseInt(entriesOfTable[i2].children[5].children[0].innerHTML);

            //Second for loop to iterate through the actual table cells
            for (var i3 = 1, lengthOfElements = 6; i3 < lengthOfElements; ++i3) {
                //Getting the current element of the table
                //This needs two children-calls, as the spans are nested in divs.
                var currentElement = entriesOfTable[i2].children[i3].children[0];

                //Switch to differenciate between the different kinds of cells
                switch (i3) {
                    //For the "name"
                    case 1:
                        //attaching "name":"VALUE" to the string
                        itemsStoredToJson += '"' + jsonFormatting[i3 - 1] + '":"' + currentElement.firstElementChild.lastElementChild.innerHTML + '"';
                        //Getting the count to properly display the names

                        if (countOfThisRow == 1) {
                            namesOfItems += currentElement.firstElementChild.lastElementChild.innerHTML;
                        } else if (countOfThisRow > 1) {
                            namesOfItems += countOfThisRow + " x " + currentElement.firstElementChild.lastElementChild.innerHTML;
                        } else {
                            //Nothing
                        }

                        //attaching the name to the string that will hold the names for further use

                        break;

                    //For the "size"
                    case 2:
                        //Check for Emptyness
                        if (currentElement.innerHTML.trim().length == 0) {
                            errors += "e";
                        }

                        //This trims all spaces away. All the spaces are stored as "&nbsp;" and this takes care of that.
                        var sizeToSave = currentElement.innerHTML.replace(/&nbsp;/g, "").trim();

                        //like above
                        itemsStoredToJson += '"' + jsonFormatting[i3 - 1] + '":"' + sizeToSave + '"';
                        break;

                    //For the Price
                    case 3:
                        //Check for errors
                        if (currentElement.innerHTML.trim().length == 0) {
                            errors += "e";
                        } else if (isNaN(parseFloat(currentElement.innerHTML.trim()))) {
                            errors += "n";
                        }

                        //The price is still a string in the beginning. It is then trimmed, parsed to Float and rounded.
                        var priceToSave = precisionRound(parseFloat(currentElement.innerHTML.trim()), 2);

                        //Here we dont use the "" to make it int in the json formatting.
                        itemsStoredToJson += '"' + jsonFormatting[i3 - 1] + '":' + priceToSave;

                        //Getting the count of this row to use it to calculate the actual cost
                        costSumOfAllItems += countOfThisRow * parseFloat(currentElement.innerHTML);
                        break;

                    //For the extras
                    case
                    4
                    :
                        //Extras are a little bit special: They are in an array itself and this needs to be considered.
                        if (currentElement.innerHTML == "None") {
                            itemsStoredToJson += '"' + jsonFormatting[i3 - 1] + '":[]';
                        } else {
                            itemsStoredToJson += '"' + jsonFormatting[i3 - 1] + '":[' + currentElement.innerHTML + ']';
                        }
                        break;
                    //For the "count"
                    case
                    5
                    :
                        //checkin for errors
                        if (currentElement.innerHTML.trim().length == 0) {
                            errors += "e";
                        } else if (isNaN(parseInt(currentElement.innerHTML.trim()))) {
                            errors += "n";
                        }


                        //Same as in case 3
                        itemsStoredToJson += '"' + jsonFormatting[i3 - 1] + '":' + parseInt(currentElement.innerHTML.trim());
                        break;

                    default:
                    //Nothing happens

                }

                //This happens every time after an table cell element, but not the last time
                if (i3 < lengthOfElements - 1) {
                    //attaching an comma to the string, so the json elements are properly seperated
                    itemsStoredToJson += ',';
                }
            }

            //Attaching this to end the jsonElement
            itemsStoredToJson += '}';

            //Things to do every end of a row, except the last time
            if (i2 < lengthOfEntriesOfTable - 1) {
                //separating the elements
                itemsStoredToJson += ',';
                //separating the names
                namesOfItems += ', ';
            }
        }

        //Ending the string with the end of the array and the index.
        itemsStoredToJson += '], ' + indexOfSpan + ')';


        //Now the table has been scanned.
        //Based on the amount of errors, it will be decided what will happen.
        //When there are no errors, proceed normally
        if (errors.length == 0) {

            //When there is a change in the data, we color the div of the outer table
            if (thisElementThatWasClickedOn.getAttribute("onclick") != itemsStoredToJson) {
                //then mark the element as being edited
                thisElementThatWasClickedOn.parentElement.className = "td bg-warning";
            }

            //This is then written to the onclick attribute of the original element (that was clicked on)
            //So then, the next time the changed content is being loaded.
            thisElementThatWasClickedOn.setAttribute('onclick', itemsStoredToJson);
            //The element's innerHTML gets the nameString, as the Items may have changed
            thisElementThatWasClickedOn.innerHTML = namesOfItems;

            //The Total also might have changed and this is updated too.
            //This is rounded to 2 decimals

            totalElement.innerHTML = precisionRound(costSumOfAllItems, 2);

            errorMessageHTMLElement.innerHTML = "";

            //And close the modal window
            document.getElementById("closeModalItems").click();

            //When there are errors
        } else if (errors.length > 0) {

            //Open a strin for the error message
            var stringPlaceholder = errors.length + " Fehler: ";

            //Save the kind of errors in booleans to make things easier
            var notANumber = errors.includes("n");
            var isEmpty = errors.includes("e");

            //When there are only NaN errors
            if (notANumber && !isEmpty) {
                if (errors.length == 1) {
                    stringPlaceholder += "Unerlaubte Symbole in einem Zahlenfeld";
                } else if (errors.length > 1) {
                    stringPlaceholder += "Unerlaubte Symbole in Zahlenfeldern";
                }
                //When there are only empty fields
            } else if (isEmpty && !notANumber) {
                if (errors.length == 1) {
                    stringPlaceholder += "Leeres Feld";
                } else if (errors.length > 1) {
                    stringPlaceholder += "Leere Felder";
                }
                //When there is both
            } else if (notANumber && isEmpty) {
                stringPlaceholder += "Leere Felder und unerlaubte Symbole in Zahlenfeldern";
                //When there is nothing (which shouldnt happen)
            } else {
                stringPlaceholder += "Eigentlich gibt es keine Fehler!?";
            }

            //Set the string to the p element to display the message
            errorMessageHTMLElement.innerHTML = stringPlaceholder;


            //dont do anything further so the person corrects the mistakes


            //For the case of anything else
        } else {
            alert("There is an unknown error with the items menu.")
            document.getElementById("closeModalItems").click();
        }


        //In case of no Item that can be stored (everything is deleted)
    }
    else {
        //Setting the onclick attribute, but making the content empty
        thisElementThatWasClickedOn.setAttribute('onclick', 'loadItems([], ' + indexOfSpan + ')');
        //Setting the innerHTML
        thisElementThatWasClickedOn.innerHTML = "Error: No Items";

        //Because the total of no elements is 0
        totalElement.innerHTML = 0;

        //Finding the right checkboxElement
        //This is that way, because the HTMLStructure is designed that way.
        var checkboxElement = thisElementThatWasClickedOn.parentElement.parentElement.firstChild.firstChild;

        //As there are no items, the whole order probably makes no sense anymore and I mark it to be deleted.
        checkboxElement.checked = true;
        markDelete(checkboxElement);

        //And close the modal window
        document.getElementById("closeModalItems").click();
    }


}

function saveExtrasPopup(btn) {
    document.getElementById("reload").setAttribute("class", "btn btn-lg active")
    var modal = btn.parentElement.parentElement.getElementsByClassName("modal-body")[0];
    var list = modal.getElementsByTagName("label");
    var extras = [];
    var index = modal.getElementsByTagName("ul")[0].getAttribute('name');
    for (var i = 0; i < list.length; i++) {
        if (list[i].firstChild.checked) {
            extras.push(parseInt(list[i].firstChild.id));
        }
    }
    var row = document.getElementsByClassName("tr menuElement")[index].children;
    for (var n = 0; n < row.length; n++) {
        if (row[n].firstChild.id.toLowerCase() == "items") {
            var input = row[n].firstChild;
            var onclickString = input.getAttribute('onclick').toString().split('loadExtras(');
            var paramString = "[" + onclickString[0].split("([")[1].split("}],")[0] + "}]";
            var object = JSON.parse(paramString);
            object.extras = extras;
            var param = JSON.stringify(object);
            var fnstr = "loadExtras(" + param + ", " + index + ")";
            document.getElementsByClassName("modal-body")[0].getElementsByClassName('tr menuElement')[index].children[4].firstChild.setAttribute('onclick', "getJsonByRequest(getExtras,'extras'); " + fnstr);
            document.getElementsByClassName("modal-body")[0].getElementsByClassName('tr menuElement')[index].children[4].firstChild.innerHTML = splitArray(object.extras).replace(/\s/g, '');
            document.getElementsByClassName("modal-body")[0].getElementsByClassName('tr menuElement')[index].children[4].firstChild.setAttribute('class', 'Input bg-warning');
        }

    }

    document.getElementById("closeModal").click();
}

function saveContactPopup(index) {
    document.getElementById("reload").setAttribute("class", "btn btn-lg active")
    var modal = document.getElementsByClassName("modal-body")[0].firstElementChild.getElementsByClassName('tr')[1];
    var json = "{";

    for (var i = 0; i < modal.children.length; i++) {
        var key = modal.children[i].firstElementChild.id.toLowerCase();
        var value = modal.children[i].firstElementChild.innerHTML;

        if (key != "postcode") {
            json += '"' + key + '":"' + value + '",';
        } else {
            if (value == "")
                value = -1;
            json += '"' + key + '":' + value + ',';
        }
    }
    json = JSON.parse(json.substr(0, json.length - 1) + "}");
    var row = document.getElementsByClassName('table')[0].getElementsByClassName('tr menuElement')[index];
    console.log(document.getElementsByClassName('table')[0].getElementsByClassName('tr menuElement'));
    for (var j = 1; j < row.children.length; j++) {
        if (row.children[j].firstElementChild.id == "Contact")
            row.children[j].firstElementChild.setAttribute('onclick', "loadContact(" + JSON.stringify(json) + ", " + index + ")");
    }

    document.getElementById("closeModalItems").click();
}

function saveContactOrdersPopup(index) {
    document.getElementsByClassName('tr menuElement')[index].getElementsByClassName('td')[5].setAttribute('class', 'td bg-warning');
    document.getElementById("reload").setAttribute("class", "btn btn-lg active")
    var modal = document.getElementsByClassName("modal-body")[2].firstElementChild.getElementsByClassName('tr')[1];
    var json = "{";

    for (var i = 0; i < modal.children.length; i++) {
        var key = modal.children[i].firstElementChild.id.toLowerCase();
        var value = modal.children[i].firstElementChild.innerHTML;

        if (key != "postcode") {
            json += '"' + key + '":"' + value + '",';
        } else {
            if (value == "")
                value = -1;
            json += '"' + key + '":' + value + ',';
        }
    }
    json = JSON.parse(json.substr(0, json.length - 1) + "}");
    var row = document.getElementsByClassName('table')[0].getElementsByClassName('tr menuElement')[0];
    for (var j = 1; j < row.children.length; j++) {
        if (row.children[j].firstElementChild.id == "Contact") {
            row.children[j].firstElementChild.setAttribute('onclick', "loadContact(" + JSON.stringify(json) + ", 0)");
        }
    }

    document.getElementById("closeModalContacts").click();
}


function precisionRound(input, decimal) {
    var factor = Math.pow(10, decimal);
    return Math.round(input * factor) / factor;
}

/**
 *
 * @param currentElement is span of extras <span class="Input" data-toggle="modal" data-target="#modalExtras" onclick="getJsonByRequest(getExtras,"extras"); loadExtras({"name":"Salami","size":"L","price":7.99,"extras":[1,2],"count":1}, 0)">1,2</span>
 * @returns price of extras
 */
function calcExtrasPrice(currentElement) {
    var rtn = 0;
    var extrasItems = currentElement.parentElement.parentElement.getElementsByClassName('td')[4].firstElementChild.innerHTML.split(',');
    for (var e1 = 0; e1 < extrasItems.length; e1++) extrasItems[e1] = parseInt(extrasItems[e1]);
    if (extrasItems != null && extrasItems[0] != "None") {
        getJsonByRequest(getExtras, "extras");
        for (var e = 0; e < extras.length; e++) {
            if (extrasItems.includes(extras[e].id)) {
                rtn += extras[e].price;
            }
        }
    }
    return rtn;
}