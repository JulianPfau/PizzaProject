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

        xhttp.open("POST", "https://localhost:8080",false);
        xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhttp.send(data);

        res = xhttp.responseText;
    }

    reader.readAsDataURL(tmpFile);
    return res;
}

function dragHandler(evt){
    evt.preventDefault();
    evt.stopPropagation();
}

function dropHandler(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    var files = ev.dataTransfer.files;

    for(var i = 0; i < ev.dataTransfer.files.length ; i++){
        console.log(uploadFile(files[i]));
    }
    listImages();
}

function dragEndHandler(evt){
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


function listImages(){
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
            for (var i = 0; i < rows.length; i++){
                var objElement = new Object();
                row = rows[i].children;
                //console.log(row);
                for (var n = 1; n < row.length; n++){
                    node = row[n];
                    key = node.firstChild.id.toLowerCase();
                    value = node.firstChild.innerHTML;
                    //console.log(value);
                    if (key == "img"){
                        var path = node.firstChild.src;
                        path = path.split("/");
                        value = path[5];
                        key = "picture";
                    }else if(key == "pictureselection"){
                        value = node.firstChild.value;
                    }
                    else{
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
                console.log(json);
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
    sendJSONtoServer(json,table);
}


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


    function closeAllLists(elmnt) {
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != input) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
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

function extendTable() {
    var elements = document.getElementsByClassName("tr menuElement");
    var footer = document.getElementById("footer");
    //console.log(elements);
    var headCol = document.createElement("div");
    headCol.setAttribute("name","pictureSelection");
    headCol.setAttribute("class","td");
    headCol.innerHTML = "Picture selection";
    document.getElementById('head').appendChild(headCol);

    for ( var i = 0; i < elements.length; i++){
        var elRow = document.createElement("div");
        var input = document.createElement("input");

        elRow.setAttribute("class","td");
        elRow.setAttribute("id", "autocomplete");
        elRow.style.position = "relative";

        input.setAttribute("class","input");
        input.setAttribute("id","pictureSelection");
        input.setAttribute('oninput', 'pictureSelection(this)');
        var img = elements[i].children[elements[i].children.length -1];

        var value = img.firstChild.src.split("/");
        // img file name
        input.value = value[value.length -1];

        elRow.appendChild(input);
        elements[i].appendChild(elRow);

    }

}