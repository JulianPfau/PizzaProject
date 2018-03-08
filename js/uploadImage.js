
var extras;
/**
* Creates an object to send image files via "POST" request to the server as base64 encoded string.
*
* Parameters:
* @param tmpFile Image file object to upload
*
 **/
function uploadFile(tmpFile) {
    var reader = new FileReader(); // FileReader let the application asynchronously read the content of files
    var senddata = new Object();
    var res;
    var xhttp = new XMLHttpRequest();
        senddata.request = "fileUpload"; //set object attributes for request data
        senddata.name = tmpFile.name;
        senddata.date = tmpFile.lastModified;
        senddata.size = tmpFile.size;
        senddata.type = tmpFile.type;

    reader.onload = function (theFileData) {
        //reader onload is triggered each time a file has read successfully
        senddata.fileData = theFileData.target.result; //set fileData the result of theFileData

        var data = JSON.stringify(senddata); //stringify object senddata to JSON string for transferring

        xhttp.open("POST", "https://localhost:8080", true); //open HTTP-Request asynchronously
        xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // set request header Content-Type to tell the server what type of data is send.
        xhttp.send(data);

        res = xhttp.responseText;
    };

    reader.readAsDataURL(tmpFile);
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

    for(var i = 0; i < ev.dataTransfer.files.length ; i++){ // for each dropped file call function uploadFile() with the file as parameter
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
        if (this.readyState == 4 && this.status == 200){
            //readystate == 4       = Request is DONE
            //status == 200         = was successful
            res = this.response; //set var res with the server response Array
        }
    };

    xhttp.open("POST","https://localhost:8080", false); // open request synchronously
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
    var key,value,row;

    switch(table) {
        case "orders":
            for (var i = 0; i < rows.length; i++) { // loop every row of the table
                var objElement = new Object();
                row = rows[i].childNodes;   //get all childNodes of the row
                for (var n = 1; n < row.length; n++) { // loop every child (column) of the row
                    key = row[n].firstChild.id.toLowerCase(); //convert the column name to lowercase
                    if (key == "contact") { //if the key is "contact" get the inner values of the loadContactOrder function to get the contact data
                        var tmp = row[n].firstChild;
                        var data = tmp.onclick.toString().split("loadContactOrder(")[1];
                        value = JSON.parse(data.replace("\)", "").replace("\}", ""));
                    } else if (key == "items") { // if the key is "contact" get the inner values of the loadItems function to get the item data
                        var tmp = row[n].firstChild;
                        var data = tmp.onclick.toString().split("loadItems(")[1];
                        var str = data.split("\)")[0];
                        value = JSON.parse(str.split(", this")[0]);
                    } else {
                        value = row[n].firstChild.innerHTML;
                        if (key == "id" || key == "done" || key == "customerid") { //parse numbers to right datatypes
                            value = parseInt(value);
                        } else if (key == "total") {
                            value = parseFloat(value);
                        }
                    }
                    objElement[key] = value; //save key and value to an object
                }
                json.push(objElement); //push the row to an json Object
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
                    if (key == "img") { //if the key is "img" split the src of the image to get the img path
                        var path = node.firstChild.src;
                        path = path.split("/");
                        value = path[5];
                        key = "picture";
                    } else if (key == "pictureselection") {
                        value = node.firstChild.value; //get the value of the input filed as value
                    } else {
                        value = node.firstChild.innerHTML;
                        if (key == "extras" && (value == "" || value == "None")) {
                            value = [];
                        }
                    }
                    if (value) {
                        if (value.includes(";")) { // if the value includes ";" split the string and create an array
                            value = value.split(";");
                            if (key == "prices" || key == "extras") {
                                for (var p = 0; p < value.length; p++) {
                                    value[p] = parseFloat(value[p]); //convert nubmers from string to float
                                }
                            }
                        }
                    }
                    objElement[key] = value;
                }
                if(objElement.name && objElement.description) {
                    json.push(objElement);
                }
            }
            break;

        case "customers":
            for (var i = 0; i < rows.length; i++) {
                var objElement = new Object();
                row = rows[i].childNodes;
                for (var n = 1; n < row.length; n++){
                    key = row[n].firstChild.id.toLowerCase();
                    if (key == "contact") {
                        var tmp = row[n].firstChild;
                        var data = tmp.onclick.toString().split("loadContact(")[1]; //reads data from onClick event to get current data
                        value = JSON.parse(data.replace("\)","").replace("\}",""));
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
            for (var i = 0; i < rows.length; i++){
                var objElement = new Object();
                row = rows[i].children;
                for (var n = 1; n < row.length; n++){
                    node = row[n];
                    key = node.firstChild.id.toLowerCase();
                    value = node.firstChild.innerHTML;
                    if (key == "id" || key == "preis")
                        value = parseFloat(value);
                    objElement[key] = value;
                }
                if(objElement.id && objElement.name) {
                    json.push(objElement);
                }
            }
            break;
    }
    sendJSONtoServer(json,table); //call function sendJSONtoServer with the table Array and the table name
    location.reload(); //reload the page
}


/**
*   Funktion um die übergebene JSON Daten an den Webserver zu übertragen per POST-Anfrage
*
*   Parameter
*   @param jsonData - JSON Daten von Funktion saveTabletoServer();
*   @param fileName - Name der Datei bzw. des Datensatzes
*
 **/

function sendJSONtoServer(jsonData,fileName){
    var xhttp = new XMLHttpRequest();
    var data = new Object();
    data.request = "saveJSON";
    data.fileName = fileName;
    data.jsonData = jsonData;
    xhttp.open("POST","https://localhost:8080",false);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send(JSON.stringify(data));
}

/**
 * Creates a dropdown list for selecting images for the corresponding object.
 * The dropdown content is generated by the input of users and work with the first letters of the image names.
 * Parameter
 * @param HTML-object of the input field
 **/

function pictureSelection(param) {

    var a, b = this.value;
    var arrPictures = [];
    var input = param.value;
    var images = JSON.parse(listImages()); //parse the JSON string to a JSON object
    closeAllLists();

    for (var i = 0; i < images.length; i++){    // check every image if it starts with the user input letters
        if (images[i].startsWith(input)){       // if it matches with the input push it into a new array
            arrPictures.push(images[i]);
        }
    }

    a = document.createElement("DIV");          //create new div element to save the dropdown in
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");

    param.parentNode.appendChild(a);

    //Loops all pictures
    for(var i = 0; i < arrPictures.length; i++){
        b = document.createElement("DIV");
        //Marks in the list of picture the input bold
        b.innerHTML = "<strong>" + arrPictures[i].substr(0, input.length) + "</strong>";
        b.innerHTML += arrPictures[i].substr(input.length);
        //Adds value to be read later
        b.innerHTML += "<input type='hidden' value='" + arrPictures[i] + "'>";
        //Change on Click the picture path
        b.addEventListener("click", function(e) {
            this.parentElement.parentElement.getElementsByTagName("input")[0].style.backgroundColor = "#FFC107"
            //Change bg-color of input field to indicate change
            param.value = this.getElementsByTagName("input")[0].value;
            //Set value of input field in table to the image name
            var parent = param.parentElement.parentElement;
            var cols = parent.children;
            var img = cols[cols.length -2 ].firstChild;
            img.src = "../img/menu/"+param.value; //set the image src of the image in the table to the new path
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

        //
        elRow.appendChild(input);
        elements[i].appendChild(elRow);

    }

}

function loadJSONfromServer(name, callback){
    var xhttp = new XMLHttpRequest();
    var senddata = new Object();
    var res;
    xhttp.open("POST", "https://localhost:8080",false);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    senddata.request = "jsonRequest";
    senddata.file = name;

    xhttp.onreadystatechange = function (ev) {
        res = xhttp.responseText;

    };

    xhttp.send(JSON.stringify(senddata));
    callback(res);
}

function getExtras(json) {
    extras = json;
}

function createTablefromJSON(rawData){
    loadJSONfromServer("extras", getExtras);

    var json = JSON.parse(rawData)["jsonData"];
    var table = document.getElementsByClassName("table")[0];
    var arrContent = ["picture","name","description","sizes","extras","prices"];

    //remove all rows if exists
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }
    //create elements from JSON file

    for(var i = 0 ; i < json.length; i++){
        var container = document.createElement("div");
        container.setAttribute("class","col-12 col-md");
        container.setAttribute("name",i +"_"+json[i]["name"]);
        container.style.display = "flex";

        var btnOrder = document.createElement("button");

        var selAmount = document.createElement("select");
        selAmount.setAttribute("class","selectpicker");
        selAmount.setAttribute("id", "amount");
        selAmount.setAttribute("onChange","changePrice('"+i+"')");

        for (var k = 0; k < 10; k++){
            var option = document.createElement("option")
            option.setAttribute("value", k);
            option.innerHTML = k ;
            selAmount.appendChild(option);
        }

        btnOrder.setAttribute("class","btn orange-o75 btn-primary btn-lg btn-success");
        btnOrder.setAttribute("data-toggle","modal");
        btnOrder.setAttribute("data-target","#basicModal");
        btnOrder.setAttribute("onclick","pizzaWahl();")
        btnOrder.innerHTML = "zum Warenkorb hinzufügen";
        /*
        item row = col-12 col-md

        paragraph = class mb-1 id = id  p. innerHTML key
        */
        // create col for json data
        arrContent.forEach(function (key) {
            var value = json[i][key];
            var d = document.createElement("div");
            d.setAttribute("class","col-12 col-md");
            // if it's a picture create img src
            if (key == "picture"){
                var content = document.createElement("img");
                content.setAttribute("src","/img/menu/" + value);
                content.setAttribute("id", key);
                content.style.width = "100px";
                d.appendChild(content);
                container.appendChild(d);
            }else {
                var content = document.createElement("span");
                content.setAttribute("class", "mb-1");
                content.setAttribute("id", key);
                //content.style.flexDirection = "column";
                if (key == "sizes"){
                    var sel = document.createElement("select");
                    sel.setAttribute("class","selectpicker");
                    sel.setAttribute("onchange","changePrice("+i+")");
                    for(var n = 0; n < value.length ;n++){
                        var opt = document.createElement("option");
                        opt.setAttribute("value", n);
                        opt.innerHTML = value[n];
                        sel.appendChild(opt);
                    }
                    content.appendChild(sel);
                }else if(key == "prices"){
                    content.innerHTML = "Preis: " + value[0];

                    for(var p = 0; p < value.length;p++){
                        var input = document.createElement("input");
                        input.setAttribute("type","hidden");
                        input.setAttribute("name", "price" + p);
                        input.value = value[p];
                        d.appendChild(input);
                    }
                }else if(key == "extras"){

                    var arrExtras = JSON.parse(extras)["jsonData"];

                    for(var e = 0; e < value.length;e++){
                        try{
                            var input = document.createElement("input");
                            input.setAttribute("type", "hidden");
                            input.setAttribute("name", e);
                            input.value = arrExtras[value[e] -1].preis;
                            input.innerHTML = arrExtras[value[e] -1].name;
                            d.appendChild(input);
                        } catch (err){
                            console.log("no extras available");
                        }
                    }

                    content.innerHTML = "Extras";
                    content.setAttribute('data-toggle', 'modal');
                    content.setAttribute('data-target', '#modal');
                    content.setAttribute('onClick',"openExtras(this,"+i+")");

                }
                else {
                    content.innerHTML = value;
                }
                d.appendChild(content);
                container.appendChild(d);
            }

        });

        // append finished row to table
        //container.appendChild(col);
        container.appendChild(selAmount);
        container.appendChild(btnOrder);
        table.appendChild(container);
    }
}

function openExtras(element, index) {
    var extras = element.parentNode.getElementsByTagName("input");

    //Sets title of Extras Popup
    document.getElementById("modalExtrasItems").innerHTML = "Extras";
    //Sets index for write
    var extrasBox = document.getElementById("extrasBox");

    extrasBox.setAttribute('name',index);

    //Removes all Extras from Popup
    while (extrasBox.firstChild) {
        extrasBox.removeChild(extrasBox.firstChild);
    }

    //Loops every extra from input fields
    for (var i = 0; i < extras.length; i++) {
        //Creates DOM-Elements for Popup
        var li = document.createElement('li');
        var label = document.createElement('label');
        var input = document.createElement('input');
        var span = document.createElement('span');

        //Defines the checkbox
        input.setAttribute('type', 'checkbox');
        input.setAttribute('id', extras[i].name);

        //Content & Change Event for extra
        span.innerHTML = " " + extras[i].innerText + "<br>"+parseFloat(extras[i].value).toFixed(2)+"€";
        span.onkeydown = function() {
            var keys = [16,17,18,20,33,34,35,36,37,38,39,40,45,112,113,114,115,116,117,118,119,120,121,122,123,144,145];
            if (!keys.includes(event.keyCode)) {
                document.getElementById("reload").setAttribute("class", "btn btn-lg active")
                this.setAttribute('class', 'bg-warning');}
        };


        //Checks weather the extras is already in selected or not and it'll be marked if so
        if (extras[i].getAttribute("selected") == "true"){
            input.setAttribute('checked', 'true');
        }


        //Appends all DOM-Elemnts to bi displayed
        label.appendChild(input);
        label.appendChild(span);
        li.appendChild(label);
        extrasBox.appendChild(li);
    }

}

function confirmExtras(element) {

    var modal = document.getElementById("extrasBox");
    var extraInputs = document.getElementsByTagName("table")[0].childNodes[modal.getAttribute("name")].childNodes[4].getElementsByTagName("input");

    var checkboxes = modal.getElementsByTagName("input");

    for(var i = 0; i < checkboxes.length; i++){

        if(checkboxes[i].checked){

            extraInputs[i].setAttribute("selected","true");

        }else{
            extraInputs[i].setAttribute("selected","false");
        }

    }
    changePrice(modal.getAttribute("name"));
    document.getElementById("closeModal").click();
}


function changePrice(element) {
    var table = document.getElementsByTagName("table")[0].childNodes;
    var size = table[element].childNodes[3].getElementsByTagName("select")[0].value;
    var extras = table[element].childNodes[4].getElementsByTagName("input");
    var priceCol = table[element].childNodes[5];
    var extraPrice = 0;
    var amount = 0;

    var pizzaPrice = table[element].childNodes[5].getElementsByTagName("input")[size].value;

    for (var i = 0; i < extras.length;i++){

        if (extras[i].getAttribute("selected") == "true"){
            extraPrice = parseFloat(extraPrice) + parseFloat(extras[i].value);
        }
    }
    console.log(table[element].getElementsByTagName("select")[0]);
    if(table[element].getElementsByTagName("select")[1].value != 0){

        amount = table[element].getElementsByTagName("select")[1].value;
    }else{
        amount = 1;
    }
    var price = ((parseFloat(pizzaPrice) + parseFloat(extraPrice)) * amount).toFixed(2);
    priceCol.getElementsByTagName("span")[0].innerHTML = "Preis: " + price;

}

function savePopup(btn){
    var modal = btn.parentElement.parentElement.getElementsByClassName("modal-body")[0];
    var list = modal.getElementsByTagName("label");
    var extras = [];
    var index = modal.getElementsByTagName("ul")[0].getAttribute('name');
    for (var i = 0; i < list.length; i++){
        if (list[i].firstChild.checked){
            extras.push(parseInt(list[i].firstChild.id));
        }
    }
    var row = document.getElementsByClassName("tr menuElement")[index].children;
    for(var n = 0; n < row.length;n++){

        if(row[n].firstChild.id.toLowerCase() == "extras"){
           var input = row[n].firstChild;
           var onclickString = input.getAttribute('onclick').toString().split('loadExtras(');
           var paramString = onclickString[1].split("},")[0]+"}";
           var object = JSON.parse(paramString);
           object.extras = extras;
           var param = JSON.stringify(object);
           var fnstr = onclickString[0] + "loadExtras(" + param + "," + index + ")";
           input.setAttribute('onclick',fnstr);
           input.innerHTML = splitArray(object.extras).replace(/\s/g,'');

        }

    }
    document.getElementById("closeModal").click();


}

function itemSearch(input){
    var searchPattern = input.value.toLowerCase();
    var content = "";
    var rows = document.getElementsByClassName("tr menuElement");

    for (var i = 0; i < rows.length;i++){
        var element = rows[i];
        var elements = rows[i].children;

        for(var n = 0; n < elements.length; n++){
            if(elements[n].id == "img"){
                content += elements[n].firstChild.src.split("/")[elements[n].firstChild.src.split("/").length - 1] + ",";
            }else if(elements[n].children[0]){
                if(elements[n].children[0].hasAttribute("onclick")){
                    try {
                        content += elements[n].firstChild.getAttribute('onclick').toString();
                    }catch (err){
                    }
            }else{
                    content += elements[n].firstChild.innerHTML.toLowerCase()+ ",";
                }
            }
        }
        if(!content.toLocaleLowerCase().includes(searchPattern.toLocaleLowerCase())){
            element.style.display = "none";
        }else{
            element.style.display = "table-row";
        }
        content ="";
    }
}