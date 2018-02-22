//Checks Type alert(({}).toString.call(var).match(/\s([a-zA-Z]+)/)[1].toLowerCase());

window.onload = loadJSCONToTable;

//Unused for now
function loadJSONfromServer(file){
    var res,file,xhttp,senddata;
    file = "menu";

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
    var input = document.getElementsByClassName("footer");
    console.log(input);
    var name = (input.item(0).innerHTML == "") ? "tbd" : input.item(0).innerHTML;
    var description = (input.item(1).innerHTML == "") ? "tbd" : input.item(1).innerHTML;
    var prices = (input.item(2).innerHTML == "") ? "tbd" : input.item(2).innerHTML;
    var sizes = (input.item(3).innerHTML == "") ? "tbd" : input.item(3).innerHTML;
    var type = (input.item(4).innerHTML == "") ? "tbd" : input.item(4).innerHTML;
    var tags = (input.item(5).innerHTML == "") ? "tbd" : input.item(5).innerHTML;


    if (prices.length == sizes.length) {
        var json = {
            "name"          :   name,
            "description"   :   description,
            "price"         :   prices,
            "size"          :   sizes,
            "type"          :   type,
            "tags"          :   tags
        };
    } else {
        document.getElementById("check").innerHTML = "Die Anzahl an Preisen muss mit der Anzahl an Gr&ouml;&szlig;en &uuml;bereinstimmen!";
    }
    console.log(json);
    return json;
}


//Called to load JSON Content into the table
function loadJSCONToTable() {
    var json = [{"name":"Salami Pizza","description":"A tasty meat Pizza","price":["5,99","7,99"],"size":["X","L"],"type":"Pizza","tags":["Meat","Pizza","Classic"]},{"name":"Cola","description":"Classic Coca Cola","price":["2,99","4,99"],"size":["0.33","0.5"],"type":"Getr&auml;nk","tags":["Getr&auml;nk","Cola","Classic"]}];

    var table = document.getElementsByClassName("table")[0];

    for (var i = 0; i < json.length; i++) {
        var row = document.createElement('div');

        var del = document.createElement('div');
        var name = document.createElement('div');
        var description = document.createElement('div');
        var prices = document.createElement('div');
        var sizes = document.createElement('div');
        var type = document.createElement('div');
        var tags = document.createElement('div');
        var picture = document.createElement('div');

        var delBox = document.createElement('input');
        var nameSpan = document.createElement('span');
        var descriptionSpan = document.createElement('span');
        var pricesSpan = document.createElement('span');
        var sizesSpan = document.createElement('span');
        var typeSpan = document.createElement('span');
        var tagsSpan = document.createElement('span');
        var pictureIMG = document.createElement('img');


        row.setAttribute('class', 'tr');
        del.setAttribute('class', 'td');
        name.setAttribute('class', 'td');
        description.setAttribute('class', 'td');
        prices.setAttribute('class', 'td');
        sizes.setAttribute('class', 'td');
        type.setAttribute('class', 'td');
        tags.setAttribute('class', 'td');
        picture.setAttribute('class', 'td');

        delBox.setAttribute('type', 'checkbox');
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


        nameSpan.innerHTML = json[i].name;
        descriptionSpan.innerHTML = json[i].description;
        pricesSpan.innerHTML = splitArray(json[i].price); //Array
        sizesSpan.innerHTML = splitArray(json[i].size); //Array
        typeSpan.innerHTML = json[i].type;
        tagsSpan.innerHTML = splitArray(json[i].tags); //Array
        pictureIMG.setAttribute('id', 'img');


        table.insertBefore(row, document.getElementById("footer"));

        row.appendChild(del);
        row.appendChild(name);
        row.appendChild(description);
        row.appendChild(prices);
        row.appendChild(sizes);
        row.appendChild(type);
        row.appendChild(tags);
        row.appendChild(picture);

        del.appendChild(delBox);
        name.appendChild(nameSpan);
        description.appendChild(descriptionSpan);
        prices.appendChild(pricesSpan);
        sizes.appendChild(sizesSpan);
        type.appendChild(typeSpan);
        tags.appendChild(tagsSpan);
        picture.appendChild(pictureIMG);
    }
}

function splitArray(array) {
    var str = "";
    for (var i = 0; i < array.length; i++) {
        str += array[i] + ";"
    }
    str = str.substring(0, str.length - 1);
    return str;
}