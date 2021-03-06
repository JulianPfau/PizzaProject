var extras;

/**
 * Creates an object to send image files via "POST" request to the server as base64 encoded string.
 *
 * Parameters:
 * @param tmpFile Image file object to upload
 *
 **/
function uploadFile(tmpFile) {
    var reader = new FileReader();

    var senddata = new Object();
    senddata.request = "fileUpload";
    senddata.name = tmpFile.name;
    senddata.date = tmpFile.lastModified;
    senddata.size = tmpFile.size;
    senddata.type = tmpFile.type;
    var res;
    reader.onload = function (theFileData) {
        senddata.fileData = theFileData.target.result; // Ergebnis vom FileReader auslesen

        var xhttp = new XMLHttpRequest();

        var data = JSON.stringify(senddata);

        xhttp.open("POST", "https://localhost:8080", true);
        xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhttp.send(data);

        res = xhttp.responseText;
    };

    reader.readAsDataURL(tmpFile);
    return res;
}

/**
 *   Handler to prevent the default behaviour of browsers if not the browser would open the files directly into the window.
 *
 *   Parameter
 *   @param evt "drag"-Event des Browsers
 **/

function dragHandler(evt) {
    evt.preventDefault();
    evt.stopPropagation();
}

/**
 *   Handler to prevent the default behaviour of browsers if not the browser would open the files directly into the window.
 *   And call function uploadFile() for each file object dropped by user.
 *   Parameter
 *   @param evt - "drop"-Event des Browsers
 **/

function dropHandler(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    var files = evt.dataTransfer.files;

    for (var i = 0; i < evt.dataTransfer.files.length; i++) { // for each dropped file call function uploadFile() with the file as parameter
        uploadFile(files[i]);

    }
}

/**
 *   Handler to prevent the default behaviour of browsers if not the browser would open the files directly into the window.
 *   If the drag has ended get all Elements of the dataTransfer object and delete each of them.
 *
 *   Parameter
 *   *  @param evt "dragEnd"-Event des Browsers
 *
 **/

function dragEndHandler(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    var dt = evt.dataTransfer;
    if (dt.items) {
        for (var i = 0; i < dt.items.length; i++) {
            dt.items.remove(i);
        }
    } else {
        evt.dataTransfer.clearData();
    }
}

/**
 *  Requests an Array with all image files from the "/menu/img" dir of the server
 **/
function listImages() {
    var xhttp = new XMLHttpRequest();
    var req = new Object();
    var res;

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            res = this.response;
        }
    };

    xhttp.open("POST", "https://localhost:8080", false);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    req.request = "images";
    var data = JSON.stringify(req);
    xhttp.send(data);
    return res;
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
                        var data = tmp.onclick.toString().split("loadContactOrder(")[1].substr(0, tmp.onclick.toString().split("loadContactOrder(")[1].length - 6);
                        value = JSON.parse(data);
                    } else if (key == "items") {
                        var tmp = row[n].firstChild;
                        var data = tmp.onclick.toString().split("loadItems(")[1].substr(0, tmp.onclick.toString().split("loadItems(")[1].length - 6);
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
                        if (key == "extras" && (value == "" || value == "None")) {
                            value = [];
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
                    }
                    objElement[key] = value;
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
    sendJSONtoServer(json,table);
    location.reload();
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
 * Creates a dropdown list for selecting images for the corresponding object.
 * The dropdown content is generated by the input of users and work with the first letters of the image names.
 * Parameter
 * @param param
 **/

function pictureSelection(param) {

    var a, b = this.value;
    var arrPictures = [];
    var input = param.value;
    var images = JSON.parse(listImages());
    closeAllLists();

    for (var i = 0; i < images.length; i++) {
        if (images[i].startsWith(input)) {
            arrPictures.push(images[i]);
        }
    }

    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");

    param.parentNode.appendChild(a);

    for (var i = 0; i < arrPictures.length; i++) {
        b = document.createElement("DIV");
        //Marks in the list of picture the input bold
        b.innerHTML = "<strong>" + arrPictures[i].substr(0, input.length) + "</strong>";
        b.innerHTML += arrPictures[i].substr(input.length);
        //Adds value to be read later
        b.innerHTML += "<input type='hidden' value='" + arrPictures[i] + "'>";
        //Change on Click the picture path
        b.addEventListener("click", function (e) {
            this.parentElement.parentElement.getElementsByTagName("input")[0].style.backgroundColor = "#FFC107";
            //Change bg-color of input field to indicate change
            param.value = this.getElementsByTagName("input")[0].value;
            //Set value of input field in table to the image name
            var parent = param.parentElement.parentElement;
            var cols = parent.children;
            var img = cols[cols.length - 2].firstChild;
            img.src = "../img/menu/" + param.value; //set the image src of the image in the table to the new path
            closeAllLists(); // call function to "close" the list of images
        });

        a.appendChild(b); // append the image list to the outer div container
    }

    /**
     * Delete all entries from "imagelist"
     * @param elmnt html object of the input field of the table row
     */

    function closeAllLists(elmnt) {
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) { //delete every child of the autocomplete-items div
            if (elmnt != x[i] && elmnt != input) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

}


/**
 * Create extra columns to edit the images of the menu entries
 */

function extendTable() {
    var elements = document.getElementsByClassName("tr menuElement");
    var headCol = document.createElement("div"); // create and append header "pictureSelection" to the table
    headCol.setAttribute("name", "pictureSelection");
    headCol.setAttribute("class", "td");
    headCol.innerHTML = "Picture selection";
    document.getElementById('head').appendChild(headCol);

    for (var i = 0; i < elements.length; i++) { //loop every table row
        var elRow = document.createElement("div"); //create div to display the images
        var input = document.createElement("input"); // create input to edit pictures

        elRow.setAttribute("class", "td");
        elRow.setAttribute("id", "autocomplete");
        elRow.style.position = "relative";

        input.setAttribute("class", "input");
        input.setAttribute("id", "pictureSelection");
        input.setAttribute('oninput', 'pictureSelection(this)');

        var img = elements[i].children[elements[i].children.length - 1];

        var value = img.firstChild.src.split("/");
        input.value = value[value.length - 1];


        elRow.appendChild(input);
        elements[i].appendChild(elRow);

    }

}

/**
 * Function to load the JSON data as String from the Webserver
 * @param name the file which will be called
 * @param callback function to call after the json data has loaded
 */
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

/**
 * Save the popup data from the table input.
 * @param btn
 */

function savePopup(btn) {
    var modal = btn.parentElement.parentElement.getElementsByClassName("modal-body")[0];
    var list = modal.getElementsByTagName("label");

    var extras = [];
    var index = modal.getElementsByTagName("ul")[0].getAttribute('name');
    //push the value, if the checkbox is checked to an array
    for (var i = 0; i < list.length; i++) {
        if (list[i].firstChild.checked) {
            extras.push(parseInt(list[i].firstChild.id));
        }
    }
    // edit loadExtras function of the menu element to "save" the data
    var row = document.getElementsByClassName("tr menuElement")[index].children;
    for (var n = 0; n < row.length; n++) {
        if (row[n].firstChild != null && row[n].firstChild.id.toLowerCase() == "extras") {
            var input = row[n].firstChild;
            var onclickString = input.getAttribute('onclick').toString().split('loadExtras(');
            var paramString = onclickString[1].split("},")[0] + "}";
            var object = JSON.parse(paramString);
            object.extras = extras;
            var param = JSON.stringify(object);
            var fnstr = onclickString[0] + "loadExtras(" + param + "," + index + ")";
            input.setAttribute('onclick', fnstr);
            input.innerHTML = splitArray(object.extras).replace(/\s/g, '');

        }

    }
    document.getElementById("closeModal").click();


}

/**
 * Function to search the data of the table
 * @param input HTML-object of search field
 */
function itemSearch(input) {
    var searchPattern = input.value.toLowerCase();
    var content = "";
    var rows = document.getElementsByClassName("tr menuElement");
    //save all data in the table row into an String
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
        // if the String includes the searchPattern set the display attribute to table-row if not set it to none, to hide
        if (!content.toLocaleLowerCase().includes(searchPattern.toLocaleLowerCase())) {
            element.style.display = "none";
        } else {
            element.style.display = "table-row";
        }
        content = "";
    }
}

/**
 * Set empty field in the footer to "None", so FF and IE can click it
 */
function editFooter(){
    var footer = document.getElementById("footer");
    for (var i = 0 ; i < footer.childNodes.length; i++){
        checkEmptyField(footer.childNodes[i].firstChild);
    }

}

function removeContent(element){
    if(element.innerHTML == "None" && element.id != "Extras"){
        element.innerHTML = "";
    }
}

function checkEmptyField(element){
    if(element) {
        if (element.innerHTML == "") {
            element.innerHTML = "None";
        } else if (element.innerText == "") {
            element.innerText == "None";
        }

            if(element.getAttribute("onclick")) {
                if (!element.getAttribute("onclick").toString().includes("removeContent")) {
                    element.setAttribute("onclick", element.getAttribute("onclick") + "removeContent(this);");
                }
            }else {
                element.setAttribute("onclick", "removeContent(this);");
            }
            if(element.getAttribute("onblur")){

            }
            if (element.getAttribute("onblur")) {
                if (!element.getAttribute("onblur").toString().includes("checkEmptyField")) {
                    element.setAttribute("onblur", element.getAttribute("onblur") + "checkEmptyField(this);");
                }
            }else{
                element.setAttribute("onblur", "checkEmptyField(this);");
            }

    }
}