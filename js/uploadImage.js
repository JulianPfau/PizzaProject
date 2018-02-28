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
    }

    reader.readAsDataURL(tmpFile);
    return res;
}

/*
*   Handler um das standard "drag"-Event des Browsers zu unterbinden
*
*   Parameter
*   evt - "drag"-Event des Browsers
 */
function dragHandler(evt) {
    evt.preventDefault();
    evt.stopPropagation();
}

function dropHandler(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    var files = ev.dataTransfer.files;

    for(var i = 0; i < ev.dataTransfer.files.length ; i++){
        uploadFile(files[i]);

    }
}
/*
*   Handler um das standard "dropEnd"-Event des Browsers zu unterbinden
*   und sobald die Datei gedroppt wurde alle Items aus dem Speicher
*   dataTransfer entfernen
*
*   Parameter
*   evt - "dragEnd"-Event des Browsers
*
 */
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

/*
*  Gibt ein Array aller Bilder im Verzeichnis "/img/menu" des Webservers aus
*
 */
function listImages() {
    var xhttp = new XMLHttpRequest();
    var req = new Object();
    var res;

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200){
            res = this.response;
        }
    };

    xhttp.open("POST","https://localhost:8080", false);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    req.request = "images";
    var data = JSON.stringify(req);
    xhttp.send(data);
    return res;
}


/*
*   Die dargestellt Tabelle wird Zeile für Zeile ausgelesen und in einem Array gespeichert.
*   Anschließend wird dieses Objekt an die Uploadfunktion zusammen mit dem Dateinamen übergeben
*
*   Parameter
*   table - Bezeichnung der Tabelle, die gespeichert werden soll
*
 */

function saveTableToServer(table) {
    var rows = document.getElementsByClassName("tr menuElement");
    var json = [];
    var key,value,row;

    switch(table) {
        case "orders":
            for (var i = 0; i < rows.length; i++) {
                var objElement = new Object();
                row = rows[i].childNodes;
                for (var n = 1; n < row.length; n++) {
                    key = row[n].firstChild.id.toLowerCase();
                    if (key == "contact") {
                        var tmp = row[n].firstChild;
                        var data = tmp.onclick.toString().split("loadContactOrder(")[1];
                        value = JSON.parse(data.replace("\)", "").replace("\}", ""));
                    } else if (key == "items") {
                        var tmp = row[n].firstChild;
                        var data = tmp.onclick.toString().split("loadItems(")[1];
                        value = JSON.parse(data.split("\)")[0]);

                    } else {
                        value = row[n].firstChild.innerHTML;
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
                    }
                    if (value) {
                        if (value.includes(";")) {
                            value = value.split(";");
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
                    if(key == "contact") {
                        var tmp = row[n].firstChild;
                        var data = tmp.onclick.toString().split("loadContact(")[1];
                        value = JSON.parse(data.replace("\)","").replace("\}",""));
                    }else {
                        value = row[n].firstChild.innerHTML;
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
                //console.log(row);
                for (var n = 1; n < row.length; n++){
                    node = row[n];
                    key = node.firstChild.id.toLowerCase();
                    value = node.firstChild.innerHTML;
                    objElement[key] = value;
                }
                if(objElement.id && objElement.name) {
                    json.push(objElement);
                }
            }
            break;
    }
    console.log(json);
    //sendJSONtoServer(json,table);
}

/*
*   Funktion um die übergebene JSON Daten an den Webserver zu übertragen per POST-Anfrage
*
*   Parameter
*   jsonData - JSON Daten von Funktion saveTabletoServer();
*   fileName - Name der Datei bzw. des Datensatzes
*
 */

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

/*
*   Funktion um ein Dropdown für Bilder zu erzeugen um somit Bilder
*   den Datensätzen zuordnen zu können.
*   Dabei wird das Dropdown anhand des Inputs des Feldes generiert.
*
*   Parameter
*    param - HTML-Objekt des Input Feldes
*
 */

function pictureSelection(param) {

    console.log(param);
    var a, b = this.value;
    var arrPictures = [];
    var input = param.value;
    var images = JSON.parse(listImages());
    closeAllLists();

    for (var i = 0; i < images.length; i++){
        if (images[i].startsWith(input)){
            arrPictures.push(images[i]);
        }
    }

    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");

    param.parentNode.appendChild(a);

    for(var i = 0; i < arrPictures.length; i++){
        b = document.createElement("DIV");
        b.innerHTML = "<strong>" + arrPictures[i].substr(0, input.length) + "</strong>";
        b.innerHTML += arrPictures[i].substr(input.length);
        b.innerHTML += "<input type='hidden' value='" + arrPictures[i] + "'>";
        b.addEventListener("click", function(e) {
            param.value = this.getElementsByTagName("input")[0].value;
            var parent = param.parentElement.parentElement;
            var cols = parent.children;
            var img = cols[cols.length -2 ].firstChild;
            img.src = "../img/menu/"+param.value;
            closeAllLists();
        });

        a.appendChild(b);
    }
    /*
    *   Funktion damit alle Elemente des Bilder Dropdowns gelöscht werden.
    *
     */


    function closeAllLists(elmnt) {
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != input) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

}

/*
* Funktion um die existierende Tabelle mit einer Spalte für den Bilder zu
* erweitern. Input Field wird mit dem Dateinamen des bereits bestehenden Bildes gefüllt.
*
 */
function extendTable() {
    var elements = document.getElementsByClassName("tr menuElement");
    var headCol = document.createElement("div");
    headCol.setAttribute("name", "pictureSelection");
    headCol.setAttribute("class", "td");
    headCol.innerHTML = "Picture selection";
    document.getElementById('head').appendChild(headCol);

    for (var i = 0; i < elements.length; i++) {
        var elRow = document.createElement("div");
        var input = document.createElement("input");

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

    }

    xhttp.send(JSON.stringify(senddata));
    callback(res);
}


function createTablefromJSON(rawData){
    var json = JSON.parse(rawData)["jsonData"];
    var table = document.getElementsByClassName("table")[0];
    var arrKeys = Object.keys(json[0]);
    var tblHead,delHead;
    var picture = false;
    //remove all rows if exists
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }
    // create table Head
    tblHead = document.createElement("div");
    tblHead.setAttribute("class","tr");
    tblHead.setAttribute("id","head");
    delHead = document.createElement("div");
    delHead.setAttribute("class", "td");
    delHead.innerHTML = "Delete?";
    tblHead.appendChild(delHead);
    table.appendChild(tblHead);

    for(var i = 0; i < arrKeys.length;i++){

        var col = document.createElement("div");
        col.setAttribute("name",arrKeys[i]);
        col.setAttribute("class","td");
        col.innerHTML = arrKeys[i];
        tblHead.appendChild(col);

    }

    //create rows from JSON file

    for(var i = 0 ; i < json.length; i++){

        //create col for delete checkbox
        var row = document.createElement("div");
        row.setAttribute("class", "tr menuElement");

        var deleteCol = document.createElement("div");
        deleteCol.setAttribute("class","td");
        deleteCol.innerHTML = "<input type='checkbox'>";

        row.appendChild(deleteCol);
        // create col for json data
        arrKeys.forEach(function (key) {
            var value = json[i][key];
            var b = document.createElement("div");
            b.setAttribute("class","td");
            // if it's a picture create img src
            if (key == "picture"){
                picture = true;
                var content = document.createElement("img");
                content.setAttribute("src","/img/"+value);
                content.setAttribute("id", key);
                content.style.width = "30px";

            }else {
                var content = document.createElement("span");
                content.setAttribute("class", "Input");
                content.setAttribute("id", key);
                content.setAttribute("contenteditable", "true");
                if (typeof value == "object"){
                    content.innerHTML = splitArray(value);
                }else {
                    content.innerHTML = value;
                }

            }
            b.appendChild(content);
            row.appendChild(b);
        });

        // append finished row to table
        table.appendChild(row);
    }

    // if pictures in table append selection

    if(picture){
        var headCol = document.createElement("div");

        headCol.setAttribute("name","pictureSelection");
        headCol.setAttribute("class","td");
        headCol.innerHTML = "Picture selection";
        tblHead.appendChild(headCol);

        for(var i = 1; i < table.children.length; i++){
            var elRow = document.createElement("div");
            var row = table.children[i].children;
            var img = row[row.length - 1];
            var input = document.createElement("input");

            elRow.setAttribute("class","td");
            elRow.setAttribute("id", "autocomplete");
            elRow.style.position = "relative";

            input.setAttribute("class","input");
            input.setAttribute("id","pictureSelection");
            input.setAttribute('oninput', 'pictureSelection(this)');

            var value = img.firstChild.src.split("/");
            // img file name
            input.value = value[value.length -1];

            elRow.appendChild(input);
            table.children[i].appendChild(elRow);
        }

    }
    //append empty row
    var emptyRow = document.getElementById("table").lastChild.cloneNode(true);

    for(var i = 0; i < emptyRow.children.length; i++){
        var col = emptyRow.childNodes[i];
        col.firstChild.innerHTML = "";
    }
    table.appendChild(emptyRow);

}

function savePopup(btn){
    var modal = btn.parentElement.parentElement.getElementsByClassName("modal-body")[0];
    var list = modal.getElementsByTagName("label");
    //console.log(getJsonByRequest(null,"extras"));
    var extras = [];
    var index = modal.getElementsByTagName("ul")[0].getAttribute('name');
    for (var i = 0; i < list.length; i++){
        if (list[i].firstChild.checked){
            extras.push(list[i].firstChild.id);
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
           var fnstr = onclickString[0] + "loadExtras("+param+","+index+")";
           input.setAttribute('onclick',fnstr);
           input.innerHTML = splitArray(object.extras).replace(/\s/g,'');

        }

    }
    console.log(fnstr);
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
            }else{
                content += elements[n].innerText.toLowerCase()+ ",";
            }
        }
        if(!content.includes(searchPattern)){
            element.style.display = "none";
        }else{
            element.style.display = "table-row";
        }
        content ="";
    }
}


