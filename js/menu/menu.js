var extras;

/**
 *
 * Saves the JSON data to a global variable to use it later in the script
 *
 * @param json-Data from extras.json
 */
function getExtras(json) {
    extras = json;
}
/**
 * Is called as callback function to generate the menu for the order page.
 * @param rawData json Data from loadJSONfromServer function
 */
function createTablefromJSON(rawData) {
    loadJSONfromServer("extras", getExtras);

    var json = JSON.parse(rawData)["jsonData"];                                       // parse the JSON string to an JSON-Object
    var table = document.getElementsByClassName("table")[0];
    var arrContent = ["picture", "name", "description", "sizes", "extras", "prices"]; // define all column headers, is also used to set the order of columns

    //remove all rows if exists
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }
    //create elements from JSON file

    for (var i = 0; i < json.length; i++) {                                            // loop through the JSON Object
        var container = document.createElement("div");
        container.setAttribute("class", "row");
        container.setAttribute("style", "border-radius: 10px; border: solid 0.5px rgba(0,0,0,0.2); margin: 10px");
        container.setAttribute("name", i + "_" + json[i]["name"]);                     //create a HTML Object and set the name by index and name of the product

        var btnOrder = document.createElement("button");

        var selAmount = document.createElement("select");
        selAmount.setAttribute("class", "selectpicker col-sm-1");
        var amId = 'amount' + i;
        selAmount.setAttribute("id", amId);
        selAmount.setAttribute("onChange", "changePrice('" + i + "')");                  //set onChange event with index of the element

        for (var k = 1; k < 10; k++) {                                                   // create a HTML-Dropdown with a max value of 10 - for the amount of pizzas a user can order at once
            var option = document.createElement("option");
            option.setAttribute("value", k);
            option.innerHTML = k;
            selAmount.appendChild(option);
        }

        btnOrder.setAttribute("class", "col-sm-5 btn orange-o75");
        btnOrder.setAttribute("data-toggle", "modal");
        btnOrder.setAttribute("data-target", "#basicModal");
        btnOrder.setAttribute("onclick", "pizzaWahl(" + i + ");");
        btnOrder.innerHTML = "zum Warenkorb hinzufügen";
        /*
        item row = col-12 col-md

        paragraph = class mb-1 id = id  p. innerHTML key
        */
        // create col for json data
        arrContent.forEach(function (key) {                                         // for each key set above go through the element and create an div element
            var value = json[i][key];
            var d = document.createElement("div");
            //d.setAttribute("class", "col-sm-12");
            // if it's a picture create img src
            if (key == "picture") {                                                 // set attribute to display an image in html
                var content = document.createElement("img");
                d.setAttribute("class", "col-sm-4");
                
                content.setAttribute("src", "/img/menu/" + value);
                content.setAttribute("id", key);
                content.style.maxWidth = "125px";
                content.style.maxHeight = "125px";
                content.style.display = "block";
                content.style.marginLeft = "auto";
                content.style.marginRight = "auto";
                d.appendChild(content);
                container.appendChild(d);
            } else {               
                var content = document.createElement("span");
                content.setAttribute("class", "mb-1");
                content.setAttribute("id", key);
                //content.style.flexDirection = "column";
                if (key == "sizes" && value.length != 0) {                          // create an dropdown to select one of the different sizes
                    d.setAttribute("class", "col-sm-2");
                    var sel = document.createElement("select");
                    sel.setAttribute("class", "selectpicker");
                    sel.setAttribute("onchange", "changePrice(" + i + ")");
                    var sizePickerName = 'size' + i;
                    sel.setAttribute("id", sizePickerName);
                    for (var n = 0; n < value.length; n++) {
                        var opt = document.createElement("option");
                        opt.setAttribute("value", n);
                        opt.innerHTML = value[n];
                        sel.appendChild(opt);
                    }
                    content.appendChild(sel);
                } else if (key == "prices") {                                       // set the default price to the first price of the product
                    d.setAttribute("class", "col-sm-6 text-right");
                    content.innerHTML = "Preis: " + value[0] + " €";

                    for (var p = 0; p < value.length; p++) {
                        var input = document.createElement("input");                // create hidden input fields for additional prices
                        input.setAttribute("type", "hidden");
                        input.setAttribute("name", "price" + p);
                        input.value = value[p];
                        d.appendChild(input);
                    }
                } else if (key == "extras" && value.length != 0) {
                    d.setAttribute("class", "col-sm-2");
                    var arrExtras = JSON.parse(extras)["jsonData"];

                    for (var e = 0; e < value.length; e++) {
                        try {
                            var input = document.createElement("input");            // create hidden input fields for additional extras
                            input.setAttribute("type", "hidden");
                            input.setAttribute("name", e);
                            input.value = arrExtras[value[e] - 1].price;
                            input.innerHTML = arrExtras[value[e] - 1].name;
                            d.appendChild(input);
                        } catch (err) {
                            console.log("no extras available");
                        }
                    }

                    content.innerHTML = "Extras";
                    content.setAttribute('class', 'btn btn btn-outline-dark btn-sm');
                    content.setAttribute('data-toggle', 'modal');
                    content.setAttribute('data-target', '#modal');
                    content.setAttribute('onClick', "openExtras(this," + i + ")");

                }
                else {
                    d.setAttribute("class", "col-sm-2");
                    content.innerHTML = value;
                }
                d.appendChild(content);
                container.appendChild(d);
            }

        });

                                                                                    // append finished row to table
        container.appendChild(selAmount);
        container.appendChild(btnOrder);
        table.appendChild(container);
    }
}

/**
 * Function to call the Extras popup
 * @param element the span-HTML-Object of the product
 * @param index   row index of the product
 */

function openExtras(element, index) {
    var extras = element.parentNode.getElementsByTagName("input");

    document.getElementById("modalExtrasItems").innerHTML = "Extras";               //Sets title of Extras Popup

    var extrasBox = document.getElementById("extrasBox");                           //Sets index for write

    extrasBox.setAttribute('name', index);


    while (extrasBox.firstChild) {                                                  //Removes all Extras from Popup
        extrasBox.removeChild(extrasBox.firstChild);
    }


    for (var i = 0; i < extras.length; i++) {                                       //Loops every extra from input fields

        var li = document.createElement('li');                                      //Creates DOM-Elements for Popup
        var label = document.createElement('label');
        var input = document.createElement('input');
        var span = document.createElement('span');


        input.setAttribute('type', 'checkbox');                                     //Defines the checkbox
        input.style.listStyleType = "none";

        var extraCheckboxId = index + ":" + i;

        input.setAttribute('id', extraCheckboxId);


        span.innerHTML = " " + extras[i].innerText + " " + parseFloat(extras[i].value).toFixed(2) + "€";    //Content & Change Event for extra
        span.onkeydown = function () {
            var keys = [16, 17, 18, 20, 33, 34, 35, 36, 37, 38, 39, 40, 45, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 144, 145];
            if (!keys.includes(event.keyCode)) {
                document.getElementById("reload").setAttribute("class", "btn btn-lg active");
                this.setAttribute('class', 'bg-warning');
            }
        };



        if (extras[i].getAttribute("selected") == "true") {                         //Checks weather the extras is already in selected or not and it'll be marked if so
            input.setAttribute('checked', 'true');
        }


        //Appends all DOM-Elemnts to bi displayed
        label.appendChild(input);
        label.appendChild(span);
        li.appendChild(label);
        extrasBox.appendChild(li);
    }

}

/**
 * Function to save the extras selection of the User by calling the modal HTML-Object and read the selectet data
 *
 */

function confirmExtras() {

    var modal = document.getElementById("extrasBox");
    var extraInputs = document.getElementsByTagName("table")[0].childNodes[modal.getAttribute("name")].childNodes[4].getElementsByTagName("input");

    var checkboxes = modal.getElementsByTagName("input");

    for (var i = 0; i < checkboxes.length; i++) {                               //loop throw all checkboxes

        if (checkboxes[i].checked) {                                            // if the checkbox is selected set the input field of the extra in the product row to selected

            extraInputs[i].setAttribute("selected", "true");

        } else {
            extraInputs[i].setAttribute("selected", "false");
        }

    }
    changePrice(modal.getAttribute("name"));
    document.getElementById("closeModal").click();
}

/**
 * This Function is called to update the price of the transferred product
 * @param element index of the table row
 */

function changePrice(element) {

    var table = document.getElementsByTagName("table")[0].childNodes;                           // set all variables for later usage
    var size = table[element].childNodes[3].getElementsByTagName("select")[0].value;
    var extras = table[element].childNodes[4].getElementsByTagName("input");
    var priceCol = table[element].childNodes[5];
    var extraPrice = 0;
    var amount = 0;
    var pizzaPrice = table[element].childNodes[5].getElementsByTagName("input")[size].value;

    for (var i = 0; i < extras.length; i++) {                                                   //loop through all extras

        if (extras[i].getAttribute("selected") == "true") {
            extraPrice = parseFloat(extraPrice) + parseFloat(extras[i].value);                  // if an extra is selected add the price to total
        }
    }
    if (table[element].getElementsByTagName("select")[1].value != 0) {                          // call the amount the user has selected

        amount = table[element].getElementsByTagName("select")[1].value;
    } else {
        amount = 1;                                                                             // if the amount is 0 set the value to 1 to display the single price of the product
    }
    var price = ((parseFloat(pizzaPrice) + parseFloat(extraPrice)) * amount).toFixed(2);
    priceCol.getElementsByTagName("span")[0].innerHTML = "Preis: " + price + " €";              // set the inner of the HTML-span to the new price value

}
