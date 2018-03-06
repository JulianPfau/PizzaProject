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
            menuInhalt[n].onkeydown = function(event) {
                //Key-Codes which will be ignored
                if ((event.keyCode > 44 && event.keyCode < 111) || (event.keyCode > 185 && event.keyCode < 192) || (event.keyCode > 218 && event.keyCode < 223)) {
                    //Activates the del changes button
                    document.getElementById("reload").setAttribute("class", "btn btn-lg active")
                    this.setAttribute('class', 'bg-warning');}
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
                menuInhalt[7].setAttribute('onClick', 'getJsonByRequest(getExtras,"extras"); loadExtras(' + JSON.stringify(json[i]) + ','+ i +')');

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
                menuInhalt[3].innerHTML = (json[i].prices == "") ? "None" :splitArray(json[i].prices) ;
                menuInhalt[4].innerHTML = (json[i].sizes == "") ? "None" : splitArray(json[i].sizes);
                menuInhalt[5].innerHTML = (json[i].types == "") ? "None" : json[i].types;
                menuInhalt[6].innerHTML = (json[i].tags == "") ? "None" : splitArray(json[i].tags);
                menuInhalt[7].innerHTML = (json[i].extras == "") ? "None" : splitArray(json[i].extras);
                break;

            //Customers
            case "customers":
                //Sets everything to open Contact Popup
                menuInhalt[6] = document.createElement('span');
                menuInhalt[6].setAttribute('data-toggle', 'modal');
                menuInhalt[6].setAttribute('data-target', '#modal');
                menuInhalt[6].setAttribute('onClick', 'loadContact(' + JSON.stringify(json[i].contact) + ')');

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
                break;

            //Orders
            case "orders":
                //Sets everything to open Items Popup
                menuInhalt[2].removeAttribute('contenteditable');
                menuInhalt[2].setAttribute('data-toggle', 'modal');
                menuInhalt[2].setAttribute('data-target', '#modalItems');
                menuInhalt[2].setAttribute('onClick', 'loadItems(' + JSON.stringify(json[i].items) + ', ' + "this" + ')' );

                //Sets everything to open Contact Popup
                menuInhalt[5].removeAttribute('contenteditable');
                menuInhalt[5].setAttribute('data-toggle', 'modal');
                menuInhalt[5].setAttribute('data-target', '#modal');
                menuInhalt[5].setAttribute('onClick', 'loadContactOrder(' + JSON.stringify(json[i].contact) + ')');

                //IDs for each cell & remove option to change ID
                menuInhalt[1].setAttribute('id', 'ID');
                menuInhalt[1].removeAttribute('contenteditable');
                menuInhalt[2].setAttribute('id', 'Items');
                menuInhalt[3].setAttribute('id', 'Total');
                menuInhalt[4].setAttribute('id', 'CustomerID');
                menuInhalt[5].setAttribute('id', 'Contact');
                menuInhalt[6].setAttribute('id', 'Done');

                //Save items name in Array to be displayed later
                var items = new Array();
                for (var k = 0; k < json[i].items.length; k++) {
                    items[k] = json[i].items[k].name;
                }

                //Content from JSON to be displayed
                menuInhalt[1].innerHTML = (json[i].id == "") ? "None" : json[i].id;
                menuInhalt[2].innerHTML = (items == "") ? "None" : items;
                menuInhalt[3].innerHTML = (json[i].total == "") ? "None" : json[i].total;
                menuInhalt[4].innerHTML = (json[i].customerid == "") ? "None" : json[i].customerid;
                menuInhalt[5].innerHTML = (json[i].contact.name == "") ? "None" : json[i].contact.name;
                menuInhalt[6].innerHTML = json[i].done;
                break;

            //Extras
            case "extras":
                //IDs for each cell
                menuInhalt[1].setAttribute('id', 'ID');
                menuInhalt[2].setAttribute('id', 'Name');
                menuInhalt[3].setAttribute('id', 'Preis');

                //Content from JSON to be displayed
                menuInhalt[1].innerHTML = (json[i].id == "") ? "None" : json[i].id;
                menuInhalt[2].innerHTML = (json[i].name == "") ? "None" : json[i].name;
                menuInhalt[3].innerHTML = json[i].preis;
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
    //Seperates the array content witch ";"
    for (var i = 0;i < array.length;i++) {
        str += array[i] + ";";
    }
    //Removes the last ";"
    str = str.substr(0, str.length - 1);
    return str;
}

/**
 * Loads the Contact Content into the Popup
 *
 * @param json The JSON woch should be displayed
 */
function loadContact(json) {
    //Popup title is name of Contact
    document.getElementsByClassName("modal-title")[0].innerHTML = (json.name == undefined) ? "" : json.name;
    document.getElementById("IDContact").innerHTML = (json.name == undefined) ? "" : json.name;
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
function loadContactOrder(json) {
    //Content for Cell
    document.getElementById("modalContactsTitle").innerHTML = (json.name == "") ? "None" : json.name;
    //Change Event
    document.getElementById("modalContactsTitle").onkeydown = function() {
        if ((event.keyCode > 44 && event.keyCode < 111) || (event.keyCode > 185 && event.keyCode < 192) || (event.keyCode > 218 && event.keyCode < 223)) {
            document.getElementById("reload").setAttribute("class", "btn btn-lg active")
            this.setAttribute('class', 'bg-warning');}
    };
    document.getElementById("Name").innerHTML = (json.name == "") ? "None" : json.name;
    document.getElementById("Name").onkeydown = function() {
            if ((event.keyCode > 44 && event.keyCode < 111) || (event.keyCode > 185 && event.keyCode < 192) || (event.keyCode > 218 && event.keyCode < 223)) {
            document.getElementById("reload").setAttribute("class", "btn btn-lg active")
            this.setAttribute('class', 'bg-warning');}
    };
    document.getElementById("Postcode").innerHTML = (json.postcode == "") ? "None" : json.postcode;
    document.getElementById("Postcode").onkeydown = function() {
        if ((event.keyCode > 44 && event.keyCode < 111) || (event.keyCode > 185 && event.keyCode < 192) || (event.keyCode > 218 && event.keyCode < 223)) {
            document.getElementById("reload").setAttribute("class", "btn btn-lg active")
            this.setAttribute('class', 'bg-warning');}
    };
    document.getElementById("Street").innerHTML = (json.street == "") ? "None" : json.street;
    document.getElementById("Street").onkeydown = function() {
        if ((event.keyCode > 44 && event.keyCode < 111) || (event.keyCode > 185 && event.keyCode < 192) || (event.keyCode > 218 && event.keyCode < 223)) {
            document.getElementById("reload").setAttribute("class", "btn btn-lg active")
            this.setAttribute('class', 'bg-warning');}
    };
    document.getElementById("City").innerHTML = (json.city == "") ? "None" : json.city;
    document.getElementById("City").onkeydown = function() {
        if ((event.keyCode > 44 && event.keyCode < 111) || (event.keyCode > 185 && event.keyCode < 192) || (event.keyCode > 218 && event.keyCode < 223)) {
            document.getElementById("reload").setAttribute("class", "btn btn-lg active")
            this.setAttribute('class', 'bg-warning');}
    };
    document.getElementById("Nr").innerHTML = (json.nr == "") ? "None" : json.nr;
    document.getElementById("Nr").onkeydown = function() {
        if ((event.keyCode > 44 && event.keyCode < 111) || (event.keyCode > 185 && event.keyCode < 192) || (event.keyCode > 218 && event.keyCode < 223)) {
            document.getElementById("reload").setAttribute("class", "btn btn-lg active")
            this.setAttribute('class', 'bg-warning');}
    };
    document.getElementById("Phone").innerHTML = (json.phone == "") ? "None" : json.phone;
    document.getElementById("Phone").onkeydown = function() {
        if ((event.keyCode > 44 && event.keyCode < 111) || (event.keyCode > 185 && event.keyCode < 192) || (event.keyCode > 218 && event.keyCode < 223)) {
            document.getElementById("reload").setAttribute("class", "btn btn-lg active")
            this.setAttribute('class', 'bg-warning');}
    };
}

/**
 * Function to load Extras into Popup on menu site
 *
 * @param product the JSON of the Item
 * @param index to get the parent on save needed
 */
function loadExtras(product,index) {

    //Sets title of Extras Popup
    document.getElementById("modalExtrasItems").innerHTML = (product == undefined) ? "Extras" : product.name + " Extras";
    //Sets index for write
    var extrasBox = document.getElementById("extrasBox");
    extrasBox.setAttribute('name',index);

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
        input.setAttribute('id',extras[i].id);

        //Content & Change Event for extra
        span.innerHTML = " " + extras[i].name;
        span.onkeydown = function() {
            if ((event.keyCode > 44 && event.keyCode < 111) || (event.keyCode > 185 && event.keyCode < 192) || (event.keyCode > 218 && event.keyCode < 223)) {
                document.getElementById("reload").setAttribute("class", "btn btn-lg active")
                this.setAttribute('class', 'bg-warning');}
        };

        //Checks weather the extras is already in selected or not and it'll be marked if so
        if (product != undefined) {
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
function loadItems(json, element) {
    //get the table in wich should be loaded
    var table = document.getElementById("modal-table");
    var length = 6;

    //Sets the Title of the Popup
    document.getElementById("modalItemsTitle").innerText = "Items:";

    //Removes all Items
    for (var y = table.children.length - 1; y > 0; y--) {
        if (table.children[y].classList.contains("menuElement")) {
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
            menuInhalt[n].onkeydown = function() {
                if ((event.keyCode > 44 && event.keyCode < 111) || (event.keyCode > 185 && event.keyCode < 192) || (event.keyCode > 218 && event.keyCode < 223)) {
                    document.getElementById("reload").setAttribute("class", "btn btn-lg active")
                    this.setAttribute('class', 'bg-warning');}
            };
        }
        //Creats the delete button + function
        menuInhalt[0] = document.createElement('input');
        menuInhalt[0].setAttribute('type', 'checkbox');
        menuInhalt[0].setAttribute('onchange', 'markDelete(this)');

        //Content of all cells
        menuInhalt[1].innerHTML = (json[i].name == "") ? "None" : json[i].name;
        menuInhalt[2].innerHTML = (json[i].size == "") ? "None" : json[i].size;
        menuInhalt[3].innerHTML = (json[i].price == "") ? "None" : json[i].price;
        menuInhalt[4].innerHTML = (json[i].extras.length == 0) ? "None" : json[i].extras;
        menuInhalt[5].innerHTML = (json[i].count == "") ? "None" : json[i].count;

        //Prepare the Exras Popup
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


    console.log(element);
    alert(element.innerHTML);



}

/**
 * Function to mark the box wich should be deleted
 *
 * @param box
 */
function markDelete(box) {
    if (box.checked) {
        box.parentElement.parentElement.setAttribute('class','tr bg-danger');
    } else {
        box.parentElement.parentElement.setAttribute('class','tr menuElement');
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
    while (document.getElementById("dropDownList").firstChild) {
        document.getElementById("dropDownList").removeChild(document.getElementById("dropDownList").firstChild);
    }

    //Loops each Item from JSON
    for (var i = 0; i < json.length; i++) {
        //Creates DOM-Element for Dropdown
        var dropDown = document.getElementById("dropDownList");
        var li = document.createElement("li");
        li.setAttribute('class', 'align-baseline');
        //Adds Function to add content for Dropdown
        li.setAttribute("onClick", "fillItems(this, " + JSON.stringify(json[i]) + ")");

        //Append all displays to be displayed
        li.innerHTML = json[i].name;
        dropDown.appendChild(li);
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

    var row = span.parentElement.parentElement.children;
    row[2].firstChild.innerHTML = json.sizes[json.sizes.length - 1];
    row[3].firstChild.innerHTML = json.prices[json.prices.length - 1];
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



function storeItemsInOrders(element) {
    var tableOfItemsModal = document.getElementById("modal-table");


}