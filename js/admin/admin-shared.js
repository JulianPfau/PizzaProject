/*
    File with all functions that are shared across multiple admin sites

    orders.html
    menu.html
    customers.html
    extras.html
    fileupload.html
 */


var extras;


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
                    document.getElementById("reload").setAttribute("class", "btn btn-lg active");
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
                menuInhalt[7].setAttribute('onClick', 'getJsonByRequest(getExtras,"extras"); loadExtras(' + JSON.stringify(json[i]) + ',' + i + ');');

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

                document.getElementById('footer').getElementsByClassName('Input footer')[6].setAttribute("onClick", "getJsonByRequest(getExtras,'extras'); loadExtras({}, " + (i + 1) + ");");

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
                        items[k] = json[i].items[k].count + "x ";
                    items[k] += json[i].items[k].name;
                }
                //Content from JSON to be displayed
                menuInhalt[1].innerHTML = (json[i].id == "") ? "None" : json[i].id;
                menuInhalt[2].innerHTML = (items == "") ? "None" : items;
                console.log(json[i].contact.name);
                menuInhalt[3].innerHTML = (json[i].total == "") ? "None" : precisionRound(parseFloat(json[i].total), 2);
                menuInhalt[4].innerHTML = (json[i].customerid == undefined) ? "None" : json[i].customerid;
                menuInhalt[5].innerHTML = (json[i].contact.name == " ") ? "None" : json[i].contact.name;
                if (json[i].done == 1) menuInhalt[6].setAttribute('checked', '');
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

    editFooter();

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
 * Function to load Items into Popup on orders site
 *
 * @param json with the Items to be loaded
 * @param indexOfSpan
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
        row.setAttribute('class', 'tr menuElementModal');

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
                    document.getElementById("reload").setAttribute("class", "btn btn-lg active");
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
        menuInhalt[4].setAttribute('onClick', 'getJsonByRequest(getExtras,"extras"); loadExtras(' + JSON.stringify(json[i]) + ', ' + i + ');');

        menuInhalt[1].setAttribute('id', 'name');
        menuInhalt[2].setAttribute('id', 'size');
        menuInhalt[3].setAttribute('id', 'price');
        menuInhalt[4].setAttribute('id', 'extras');
        menuInhalt[5].setAttribute('id', 'count');

        //Einfügen in HTML
        table.insertBefore(row, document.getElementById("modal-footer"));

        for (var c = 0; c < length; c++) {
            row.appendChild(menuRow[c]);
            menuRow[c].appendChild(menuInhalt[c]);
        }

    }
    //Setting the function storeItemsInOrders to the savebutton's onclick event
    var buttonModalItemsSave = document.getElementById("button-modal-items-save");
    buttonModalItemsSave.setAttribute("onClick", 'storeItemsInOrders(' + indexOfSpan + ')');
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
 * Function to create a new Footer on Input
 *
 * @param span the DOM-Element wich musst be filled to create new footer
 */
function loadNewFooter(span) {
    //If span not empty
    if (span.innerHTML != "" && span.innerText != "None") {

        //Creates new row while removing ID from old footer and clone it
        var row = span.parentElement.parentElement;
        row.removeAttribute("id");
        row.parentElement.appendChild(row.cloneNode(true));
        row.setAttribute("id", "footer");

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
                removeContent(newRow.childNodes[i].firstElementChild);
                checkEmptyField(newRow.childNodes[i].firstElementChild);

                if (newRow.childNodes[i].id == "img")
                    newRow.childNodes[i].firstElementChild.src = "../img/menu/default.png";
                if (newRow.childNodes[i].firstChild.id == "Extras") {
                    newRow.childNodes[i].firstChild.setAttribute("onclick", newRow.childNodes[i].firstChild.getAttribute("onclick") + "loadExtras({}," + (document.getElementsByClassName("tr menuElement").length - 1 + ");"));
                }
            }
        }
    }
}


function saveExtrasPopup(btn) {
    document.getElementById("reload").setAttribute("class", "btn btn-lg active");
    var modal = btn.parentElement.parentElement.getElementsByClassName("modal-body")[0];
    var list = modal.getElementsByTagName("label");
    var extras = [];
    var index = modal.getElementsByTagName("ul")[0].getAttribute('name');
    for (var i = 0; i < list.length; i++) {
        if (list[i].firstChild.checked) {
            extras.push(parseInt(list[i].firstChild.id));
        }
    }
    var row = document.getElementById("modal-table").getElementsByClassName("tr menuElementModal")[index].children;
    for (var n = 0; n < row.length; n++) {
        if (row[n].firstChild.id.toLowerCase() == "extras") {
            var input = row[n].firstChild;
            var onclickString = input.getAttribute('onclick').toString().split('loadExtras(');
            if (extras.length == 0) extras = "None";
            var paramVor = onclickString[0] + 'loadExtras(' + onclickString[1].split('extras":[')[0] + 'extras":[';
            var paramNach = '],"count' + onclickString[1].split('],"count')[1];
            var param = paramVor + extras + paramNach;
            document.getElementsByClassName("modal-body")[0].getElementsByClassName('tr menuElementModal')[index].children[4].firstChild.setAttribute('onclick', param);
            document.getElementsByClassName("modal-body")[0].getElementsByClassName('tr menuElementModal')[index].children[4].firstChild.innerHTML = splitArray(extras).replace(/;/g, ',');
            document.getElementsByClassName("modal-body")[0].getElementsByClassName('tr menuElementModal')[index].children[4].setAttribute('class', 'td bg-warning');
        }
    }

    document.getElementById("closeModal").click();
}


function saveContactPopup(index) {
    document.getElementById("reload").setAttribute("class", "btn btn-lg active");
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
    for (var j = 1; j < row.children.length; j++) {
        if (row.children[j].firstElementChild.id == "Contact") {
            row.children[j].setAttribute('onclick', "loadContact(" + JSON.stringify(json) + ", " + index + ")");
            row.children[j].firstElementChild.innerHTML = json.name;
        }
    }


    document.getElementById("closeModalItems").click();
}


function saveContactOrdersPopup(index) {
    document.getElementsByClassName('tr menuElement')[index].getElementsByClassName('td')[5].setAttribute('class', 'td bg-warning');
    document.getElementById("reload").setAttribute("class", "btn btn-lg active");
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
            row.children[j].firstElementChild.setAttribute('onclick', "loadContactOrder(" + JSON.stringify(json) + ", 0)");
        }
    }


    document.getElementById("closeModalContacts").click();
}


function saveInput(table) {
    var input = document.getElementById("input").value;
    updateTable(table, "");
    updateTable(table, input);
}

function unfold() {
    var x = document.getElementById("navbar");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}

function updateTable(table, value) {
    var rows = document.getElementsByClassName("tr menuElement");

    for (var i = 0; i < rows.length; i++) {

        var row = rows[i].childNodes;

        for (var n = 1; n < row.length; n++) {
            var node = row[n].firstChild;
            if (node != null) {
                if (value == "") {
                    node.parentElement.parentElement.style.display = '';
                } else {
                    switch (table) {
                        case "orders":
                            if (node.id == "Contact" || node.id == "Items") {
                                if (!node.innerHTML.toUpperCase().includes(value.toUpperCase())) {
                                    node.parentElement.parentElement.style.display = 'none';
                                }
                            }

                            break;
                        case "menu":
                            if (node.id == "Name" || node.id == "Description" || node.id == "Types" || node.id == "Tags") {
                                if (!node.innerHTML.toUpperCase().includes(value.toUpperCase())) {
                                    node.parentElement.parentElement.style.display = 'none';
                                }
                            }

                            break;
                        case "customers":
                            if (node.id == "Contact" || node.id == "EMail" || node.id == "Firtname" || node.id == "Lastname") {
                                if (!node.innerHTML.toUpperCase().includes(value.toUpperCase())) {
                                    node.parentElement.parentElement.style.display = 'none';
                                }
                            }
                            break;
                        case "extras":
                            if (node.id == "Name") {
                                if (!node.innerHTML.toUpperCase().includes(value.toUpperCase())) {
                                    node.parentElement.parentElement.style.display = 'none';
                                }
                            }

                            break;
                    }
                }
            }
        }
    }
}


/**
 *   The passed table get saved to an Array and afterwards the Array get passed with the filename to the transfer function
 *   to save the data onto the server.
 *
 *   Parameter
 *   @param table - Bezeichnung der Tabelle, die gespeichert werden soll
 *
 **/

function saveTableToServer(table) {
    var rows = document.getElementsByClassName("tr menuElement");
    var json = [];
    var key, value, row;

    switch (table) {
        case "orders":
            for (var i = 0; i < rows.length; i++) {
                var objElement = new Object();
                row = rows[i].childNodes;
                for (var n = 1; n < row.length; n++) {
                    key = row[n].firstChild.id.toLowerCase();
                    if (key == "contact") {
                        var tmp = row[n].firstChild;
                        var data = tmp.onclick.toString().split("loadContactOrder(")[1].substr(0, tmp.onclick.toString().split("loadContactOrder(")[1].length - 6).replace(/,\s*$/, "");
                        value = JSON.parse(data);
                    } else if (key == "items") {
                        var tmp = row[n].firstChild;
                        var data = tmp.onclick.toString().split("loadItems(")[1].substr(0, tmp.onclick.toString().split("loadItems(")[1].length - 6).replace(/,\s*$/, "");

                        value = JSON.parse(data.split("\)")[0]);
                    } else if (key == "done") {
                        value = 0;
                        if (row[n].firstChild.checked) value = 1;
                    } else {
                        value = row[n].firstChild.innerHTML;
                        if (key == "id" || key == "customerid") {
                            value = parseInt(value);
                        } else if (key == "total") {
                            value = parseFloat(value);
                        }
                    }
                    objElement[key] = value;
                }
                json.push(objElement);
            }
            break;
        case "menu":
            var node;
            for (var i = 0; i < rows.length; i++) {
                var objElement = new Object();
                row = rows[i].children;
                for (var n = 1; n < row.length; n++) {
                    node = row[n];
                    key = node.firstChild.id.toLowerCase();
                    value = node.firstChild.innerHTML;
                    if (key == "img") {
                        var path = node.firstChild.src;
                        path = path.split("/");
                        value = path[5];
                        key = "picture";
                    } else if (key == "pictureselection") {
                        value = node.firstChild.value;
                    } else {
                        value = node.firstChild.innerHTML;

                        if ((key == "extras" || key == "sizes")) {
                            value = node.firstChild.innerText;
                        }
                    }
                    if (value) {
                        if (value.includes(";")) {
                            value = value.split(";");
                            if (key == "prices" || key == "extras") {
                                for (var p = 0; p < value.length; p++) {
                                    value[p] = parseFloat(value[p]);
                                }
                            }
                        }
                    }

                    if (value == "None") {
                        value = "";
                    }
                    objElement[key] = value;
                }
                if (objElement.name && objElement.description) {
                    json.push(objElement);
                }
            }
            break;

        case "customers":
            for (var i = 0; i < rows.length; i++) {
                var objElement = new Object();
                row = rows[i].childNodes;
                for (var n = 1; n < row.length; n++) {
                    try{
                    console.log(row[n].firstChild);
                    key = row[n].firstChild.id.toLowerCase();
                    if (key == "contact") {
                        var tmp = row[n].firstChild;
                        var data = tmp.onclick.toString().split("loadContact(")[1];
                        value = JSON.parse(data.substr(0, data.length - 6));
                    } else {
                        value = row[n].firstChild.innerHTML;
                        if (key == "id") {
                            value = parseInt(value);
                        }
                    }} catch(err){
                        console.log(err);
                    }
                    if (value != "" && value != "None") {
                        objElement[key] = value;
                    }
                }
                json.push(objElement);
            }
            break;
        case "extras":
            //Placeholder
            for (var i = 0; i < rows.length; i++) {
                var objElement = new Object();
                row = rows[i].children;
                for (var n = 1; n < row.length; n++) {
                    node = row[n];
                    key = node.firstChild.id.toLowerCase();
                    value = node.firstChild.innerHTML;
                    if (key == "id" || key == "price")
                        value = parseFloat(value);
                    objElement[key] = value;
                }
                if (objElement.id && objElement.name) {
                    json.push(objElement);
                }
            }
            break;
    }

    sendJSONtoServer(json, table);
    location.reload();
}


function loadJSONfromServer(name, callback) {
    var xhttp = new XMLHttpRequest();
    var senddata = new Object();
    var res;
    xhttp.open("POST", "https://localhost:8080", false);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    senddata.request = "jsonRequest";
    senddata.file = name;

    xhttp.onreadystatechange = function (ev) {
        res = xhttp.responseText;

    };

    xhttp.send(JSON.stringify(senddata));
    callback(res);
}


function itemSearch(input) {
    var searchPattern = input.value.toLowerCase();
    var content = "";
    var rows = document.getElementsByClassName("tr menuElement");

    for (var i = 0; i < rows.length; i++) {
        var element = rows[i];
        var elements = rows[i].children;

        for (var n = 0; n < elements.length; n++) {
            if (elements[n].id == "img") {
                content += elements[n].firstChild.src.split("/")[elements[n].firstChild.src.split("/").length - 1] + ",";
            } else if (elements[n].children[0]) {
                if (elements[n].children[0].hasAttribute("onclick")) {
                    try {
                        content += elements[n].firstChild.getAttribute('onclick').toString();
                    } catch (err) {
                    }
                } else {
                    content += elements[n].firstChild.innerHTML.toLowerCase() + ",";
                }
            }
        }
        //.replace(/[^a-zA-Z0-9 ]/g, " ")
        if (!content.toLocaleLowerCase().includes(searchPattern.toLocaleLowerCase())) {
            element.style.display = "none";
        } else {
            element.style.display = "table-row";
        }
        content = "";
    }
}


function editFooter() {
    var footer = document.getElementById("footer");
    for (var i = 0; i < footer.childNodes.length; i++) {
        checkEmptyField(footer.childNodes[i].firstChild);
    }

}

function removeContent(element) {
    if (element.innerHTML == "None" && element.id != "Extras") {
        element.innerHTML = "";
    }
}

function checkEmptyField(element) {
    if (element) {
        if (element.innerHTML == "") {
            element.innerHTML = "None";
        } else if (element.innerText == "") {
            element.innerText == "None";
        }

        if (element.getAttribute("onclick")) {
            if (!element.getAttribute("onclick").toString().includes("removeContent")) {
                element.setAttribute("onclick", element.getAttribute("onclick") + "removeContent(this);");
            }
        } else {
            element.setAttribute("onclick", "removeContent(this);");
        }
        if (element.getAttribute("onblur")) {

        }
        if (element.getAttribute("onblur")) {
            if (!element.getAttribute("onblur").toString().includes("checkEmptyField")) {
                element.setAttribute("onblur", element.getAttribute("onblur") + "checkEmptyField(this);");
            }
        } else {
            element.setAttribute("onblur", "checkEmptyField(this);");
        }

    }
}


/**
 * Loads the Contact Content into the Popup
 *
 * @param json The JSON woch should be displayed
 * @param index
 */
function loadContact(json, index) {
    //Popup title is name of Contact
    document.getElementsByClassName("btn btn-primary")[0].setAttribute('onClick', 'saveContactPopup("' + index + '")');
    document.getElementsByClassName("modal-title")[0].innerHTML = (json.name == undefined) ? "" : json.name;
    document.getElementsByClassName("modal-title")[0].onkeydown = function () {
        if (event.keyCode == 8 || (event.keyCode > 44 && event.keyCode < 111) || (event.keyCode > 185 && event.keyCode < 192) || (event.keyCode > 218 && event.keyCode < 223)) {
            document.getElementById("reload").setAttribute("class", "btn btn-lg active");
            document.getElementsByClassName('tr menuElement')[index].children[6].setAttribute('class', 'td bg-warning');
            this.parentElement.setAttribute('class', 'td bg-warning');
        }
    };
    document.getElementById("Name").innerHTML = (json.name == undefined) ? "" : json.name;
    document.getElementById("Name").onkeydown = function () {
        if (event.keyCode == 8 || (event.keyCode > 44 && event.keyCode < 111) || (event.keyCode > 185 && event.keyCode < 192) || (event.keyCode > 218 && event.keyCode < 223)) {
            document.getElementById("reload").setAttribute("class", "btn btn-lg active");
            document.getElementsByClassName('tr menuElement')[index].children[6].setAttribute('class', 'td bg-warning');
            this.parentElement.setAttribute('class', 'td bg-warning');
        }
    };
    document.getElementById("Postcode").innerHTML = (json.postcode == undefined) ? "" : json.postcode;
    document.getElementById("Postcode").onkeydown = function () {
        if (event.keyCode == 8 || (event.keyCode > 44 && event.keyCode < 111) || (event.keyCode > 185 && event.keyCode < 192) || (event.keyCode > 218 && event.keyCode < 223)) {
            document.getElementById("reload").setAttribute("class", "btn btn-lg active");
            document.getElementsByClassName('tr menuElement')[index].children[6].setAttribute('class', 'td bg-warning');
            this.parentElement.setAttribute('class', 'td bg-warning');
        }
    };
    document.getElementById("Street").innerHTML = (json.street == undefined) ? "" : json.street;
    document.getElementById("Street").onkeydown = function () {
        if (event.keyCode == 8 || (event.keyCode > 44 && event.keyCode < 111) || (event.keyCode > 185 && event.keyCode < 192) || (event.keyCode > 218 && event.keyCode < 223)) {
            document.getElementById("reload").setAttribute("class", "btn btn-lg active");
            document.getElementsByClassName('tr menuElement')[index].children[6].setAttribute('class', 'td bg-warning');
            this.parentElement.setAttribute('class', 'td bg-warning');
        }
    };
    document.getElementById("City").innerHTML = (json.city == undefined) ? "" : json.city;
    document.getElementById("City").onkeydown = function () {
        if (event.keyCode == 8 || (event.keyCode > 44 && event.keyCode < 111) || (event.keyCode > 185 && event.keyCode < 192) || (event.keyCode > 218 && event.keyCode < 223)) {
            document.getElementById("reload").setAttribute("class", "btn btn-lg active");
            document.getElementsByClassName('tr menuElement')[index].children[6].setAttribute('class', 'td bg-warning');
            this.parentElement.setAttribute('class', 'td bg-warning');
        }
    };
    document.getElementById("Nr").innerHTML = (json.nr == undefined) ? "" : json.nr;
    document.getElementById("Nr").onkeydown = function () {
        if (event.keyCode == 8 || (event.keyCode > 44 && event.keyCode < 111) || (event.keyCode > 185 && event.keyCode < 192) || (event.keyCode > 218 && event.keyCode < 223)) {
            document.getElementById("reload").setAttribute("class", "btn btn-lg active");
            document.getElementsByClassName('tr menuElement')[index].children[6].setAttribute('class', 'td bg-warning');
            this.parentElement.setAttribute('class', 'td bg-warning');
        }
    };
    document.getElementById("Phone").innerHTML = (json.phone == undefined) ? "" : json.phone;
    document.getElementById("Phone").onkeydown = function () {
        if (event.keyCode == 8 || (event.keyCode > 44 && event.keyCode < 111) || (event.keyCode > 185 && event.keyCode < 192) || (event.keyCode > 218 && event.keyCode < 223)) {
            document.getElementById("reload").setAttribute("class", "btn btn-lg active");
            this.parentElement.setAttribute('class', 'td bg-warning');
        }
    };
}


//------------------------------------------Small helper functions---------------------------------------------------------

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
        if (box.parentElement.parentElement.parentElement.id == "modal-table") box.parentElement.parentElement.setAttribute('class', 'tr menuElementModal');
    }
}


//Small function used to round precisely the decimals of numbers
//This is used for various calculations
function precisionRound(input, decimal) {
    var factor = Math.pow(10, decimal);
    return Math.round(input * factor) / factor;
}

/**
 *   Funktion um die übergebene JSON Daten an den Webserver zu übertragen per POST-Anfrage
 *
 *   Parameter
 *   @param jsonData - JSON Daten von Funktion saveTabletoServer();
 *   @param fileName - Name der Datei bzw. des Datensatzes
 *
 **/

function sendJSONtoServer(jsonData, fileName) {
    var xhttp = new XMLHttpRequest();
    var data = new Object();
    data.request = "saveJSON";
    data.fileName = fileName;
    data.jsonData = jsonData;
    xhttp.open("POST", "https://localhost:8080", false);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send(JSON.stringify(data));
}


/**
 * Saves the json to global extras value
 *
 * @param json from the getJSONFromServer
 */
function getExtras(json) {
    extras = json;
}





