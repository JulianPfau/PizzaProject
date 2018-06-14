/*
    File with all functions for orders.html

 */


/**
 * Loads JSON content to Contacts on orders site
 *
 * @param json wich should be displayed in Popup
 * @param index
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
            document.getElementById("reload").setAttribute("class", "btn btn-lg active");
            this.parentElement.setAttribute('class', 'td bg-warning');
        }
    };
    document.getElementById("Name").innerHTML = (json.name == "") ? "None" : json.name;
    document.getElementById("Name").onkeydown = function () {
        if (event.keyCode == 8 || (event.keyCode > 44 && event.keyCode < 111) || (event.keyCode > 185 && event.keyCode < 192) || (event.keyCode > 218 && event.keyCode < 223)) {
            document.getElementsByClassName('tr menuElement')[index].getElementsByClassName('td')[5].firstElementChild.innerHTML = document.getElementById("Name").innerHTML;
            document.getElementById("reload").setAttribute("class", "btn btn-lg active");
            this.parentElement.setAttribute('class', 'td bg-warning');
        }
    };
    document.getElementById("Postcode").innerHTML = (json.postcode == "") ? "None" : json.postcode;
    document.getElementById("Postcode").onkeydown = function () {
        if (event.keyCode == 8 || (event.keyCode > 44 && event.keyCode < 111) || (event.keyCode > 185 && event.keyCode < 192) || (event.keyCode > 218 && event.keyCode < 223)) {
            document.getElementById("reload").setAttribute("class", "btn btn-lg active");
            this.parentElement.setAttribute('class', 'td bg-warning');
        }
    };
    document.getElementById("Street").innerHTML = (json.street == "") ? "None" : json.street;
    document.getElementById("Street").onkeydown = function () {
        if (event.keyCode == 8 || (event.keyCode > 44 && event.keyCode < 111) || (event.keyCode > 185 && event.keyCode < 192) || (event.keyCode > 218 && event.keyCode < 223)) {
            document.getElementById("reload").setAttribute("class", "btn btn-lg active");
            this.parentElement.setAttribute('class', 'td bg-warning');
        }
    };
    document.getElementById("City").innerHTML = (json.city == "") ? "None" : json.city;
    document.getElementById("City").onkeydown = function () {
        if (event.keyCode == 8 || (event.keyCode > 44 && event.keyCode < 111) || (event.keyCode > 185 && event.keyCode < 192) || (event.keyCode > 218 && event.keyCode < 223)) {
            document.getElementById("reload").setAttribute("class", "btn btn-lg active");
            this.parentElement.setAttribute('class', 'td bg-warning');
        }
    };
    document.getElementById("Nr").innerHTML = (json.nr == "") ? "None" : json.nr;
    document.getElementById("Nr").onkeydown = function () {
        if (event.keyCode == 8 || (event.keyCode > 44 && event.keyCode < 111) || (event.keyCode > 185 && event.keyCode < 192) || (event.keyCode > 218 && event.keyCode < 223)) {
            document.getElementById("reload").setAttribute("class", "btn btn-lg active");
            this.parentElement.setAttribute('class', 'td bg-warning');
        }
    };
    document.getElementById("Phone").innerHTML = (json.phone == "") ? "None" : json.phone;
    document.getElementById("Phone").onkeydown = function () {
        if (event.keyCode == 8 || (event.keyCode > 44 && event.keyCode < 111) || (event.keyCode > 185 && event.keyCode < 192) || (event.keyCode > 218 && event.keyCode < 223)) {
            document.getElementById("reload").setAttribute("class", "btn btn-lg active");
            this.parentElement.setAttribute('class', 'td bg-warning');
        }
    };
    document.getElementById("telegram").innerHTML = (json.chat_id == "") ? "None" : json.chat_id;
    document.getElementById("telegram").onkeydown = function () {
        if (event.keyCode == 8 || (event.keyCode > 44 && event.keyCode < 111) || (event.keyCode > 185 && event.keyCode < 192) || (event.keyCode > 218 && event.keyCode < 223)) {
            document.getElementById("reload").setAttribute("class", "btn btn-lg active");
            this.parentElement.setAttribute('class', 'td bg-warning');
        }
    };
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
    document.getElementById("reload").setAttribute("class", "btn btn-lg active");

    //Getting the table of the modal window
    var tableOfItemsModal = document.getElementById("modal-table");
    //Getting all the entries with the class "menuElement", which basically are the tableRows (that are not marked to be deleted)
    var entriesOfTable = tableOfItemsModal.getElementsByClassName("menuElementModal");

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

                        //Getting the span element of the extras, for calculating their price
                        var extraElement = entriesOfTable[i2].children[i3 + 1].children[0];
                        var extraCost = parseFloat(calcExtrasPrice(extraElement));

                        //The price is still a string in the beginning. It is then trimmed, parsed to Float and rounded.
                        var priceToSave = precisionRound(parseFloat(currentElement.innerHTML.trim()), 2);

                        //Here we dont use the "" to make it int in the json formatting.
                        itemsStoredToJson += '"' + jsonFormatting[i3 - 1] + '":' + priceToSave;

                        //Getting the count of this row to use it to calculate the actual cost
                        costSumOfAllItems += countOfThisRow * (priceToSave + extraCost);
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
                thisElementThatWasClickedOn.parentElement.nextElementSibling.className = "td bg-warning";

                //This is then written to the onclick attribute of the original element (that was clicked on)
                //So then, the next time the changed content is being loaded.
                thisElementThatWasClickedOn.setAttribute('onclick', itemsStoredToJson);
                //The element's innerHTML gets the nameString, as the Items may have changed
                thisElementThatWasClickedOn.innerHTML = namesOfItems;

                //The Total also might have changed and this is updated too.
                //This is rounded to 2 decimals

                totalElement.innerHTML = precisionRound(costSumOfAllItems, 2);
            } else {
                //Nothing has changed so we dont do anything specific
            }


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
            alert("There is an unknown error with the items menu.");
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


/**
 *
 * @param currentElement is span of extras <span class="Input" data-toggle="modal" data-target="#modalExtras" onclick="getJsonByRequest(getExtras,"extras"); loadExtras({"name":"Salami","size":"L","price":7.99,"extras":[1,2],"count":1}, 0);">1,2</span>
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