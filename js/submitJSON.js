//Checks Type alert(({}).toString.call(var).match(/\s([a-zA-Z]+)/)[1].toLowerCase());

window.onload = loadJSCONToTable;


function loadJSONfromServer(file){
    var res,file,xhttp,senddata;
    file = "menu"; // menu , customer, orders

    senddata = new Object();
    senddata.request = "jsonRequest";
    senddata.file = file;

    xhttp = new XMLHttpRequest();

        var data = JSON.stringify(senddata);

        xhttp.open("POST", "https://localhost:8080", true);
        xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhttp.send(data);

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200){
            res = this.response;
            console.log(res);
        }
    };
}

function createNewJSON() {
    var name = document.getElementById("Name").innerHTML;
    var description = document.getElementById("Description").innerHTML;
    var prices = document.getElementById("Prices").innerHTML.split("+");
    var sizes = document.getElementById("Sizes").innerHTML.split("+");
    var type = document.getElementById("Type").innerHTML;
    var tags = document.getElementById("Tags").innerHTML.split("+");
    var selectedFile = document.getElementById('fileinput').files[0];


    if (prices.length == sizes.length) {
        var json = {
            "name"          :   name,
            "description"   :   description,
            "price"         :   prices,
            "size"          :   sizes,
            "type"          :   type,
            "tags"          :   tags,
            "picture"       :   selectedFile
        };

        if (document.getElementById('fileinput').files.length == 0) {
            alert(json.name + json.description + json.price + json.size + json.type + json.tags);
        } else {
            alert(json.name + json.description + json.price + json.size + json.type + json.tags + json.picture.name);
        }
        alert(JSON.stringify(json));
    } else {
        document.getElementById("check").innerHTML = "Die Anzahl an Preisen muss mit der Anzahl an Gr&ouml;&szlig;en &uuml;bereinstimmen!";
    }
}

function loadJSCONToTable() {
    var json = {"name":"Salami Pizza","description":"Pizza","price":["45,77","zo"],"size":["X","L"],"type":"asd","tags":["Dlo","POK","ASD"]};

    var table = document.getElementsByClassName("table")[0];

    var row = document.createElement('div');
    var name = document.createElement('div');
    var description = document.createElement('div');
    var prices = document.createElement('div');
    var sizes = document.createElement('div');
    var type = document.createElement('div');
    var tags = document.createElement('div');
    var picture = document.createElement('div');

    var nameSpan = document.createElement('span');
    var descriptionSpan = document.createElement('span');
    var pricesSpan = document.createElement('span');
    var sizesSpan = document.createElement('span');
    var typeSpan = document.createElement('span');
    var tagsSpan = document.createElement('span');
    var pictureIMG = document.createElement('img');


    row.setAttribute('class', 'tr');
    name.setAttribute('class', 'td');
    description.setAttribute('class', 'td');
    prices.setAttribute('class', 'td');
    sizes.setAttribute('class', 'td');
    type.setAttribute('class', 'td');
    tags.setAttribute('class', 'td');
    picture.setAttribute('class', 'td');

    nameSpan.setAttribute('class', 'Input');
    descriptionSpan.setAttribute('class', 'Input');
    pricesSpan.setAttribute('class', 'Input');
    sizesSpan.setAttribute('class', 'Input');
    typeSpan.setAttribute('class', 'Input');
    tagsSpan.setAttribute('class', 'Input');
    picture.setAttribute('id','img');

    nameSpan.setAttribute('id', 'Name');
    descriptionSpan.setAttribute('id', 'Description');
    pricesSpan.setAttribute('id', 'Prices');
    sizesSpan.setAttribute('id', 'Sizes');
    typeSpan.setAttribute('id', 'Type');
    tagsSpan.setAttribute('id', 'Tags');
    pictureIMG.setAttribute('src', "img/" + json.picture + ".png");

    nameSpan.setAttribute('contenteditable', 'true');
    descriptionSpan.setAttribute('contenteditable', 'true');
    pricesSpan.setAttribute('contenteditable', 'true');
    sizesSpan.setAttribute('contenteditable', 'true');
    typeSpan.setAttribute('contenteditable', 'true');
    tagsSpan.setAttribute('contenteditable', 'true');


    nameSpan.innerHTML = json.name;
    descriptionSpan.innerHTML = json.description;
    pricesSpan.innerHTML = json.price;
    sizesSpan.innerHTML = json.size;
    typeSpan.innerHTML = json.type;
    tagsSpan.innerHTML = json.tags;
    pictureIMG.setAttribute('id', 'img');


    table.insertBefore(row, document.getElementById("footer"));

    row.appendChild(name);
    row.appendChild(description);
    row.appendChild(prices);
    row.appendChild(sizes);
    row.appendChild(type);
    row.appendChild(tags);
    row.appendChild(picture);

    name.appendChild(nameSpan);
    description.appendChild(descriptionSpan);
    prices.appendChild(pricesSpan);
    sizes.appendChild(sizesSpan);
    type.appendChild(typeSpan);
    tags.appendChild(tagsSpan);
    picture.appendChild(pictureIMG);
}