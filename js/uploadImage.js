function uploadFile(tmpFile) {

        var reader = new FileReader();

        var senddata = new Object();
        senddata.request = "fileUpload";
        senddata.name = tmpFile.name;
        senddata.date = tmpFile.lastModified;
        senddata.size = tmpFile.size;
        senddata.type = tmpFile.type;

        reader.onload = function (theFileData) {
            senddata.fileData = theFileData.target.result; // Ergebnis vom FileReader auslesen

            var xhttp = new XMLHttpRequest();

            var data = JSON.stringify(senddata);

            xhttp.open("POST", "https://localhost:8080", true);
            xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhttp.send(data);
        }

        reader.readAsDataURL(tmpFile);

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
        uploadFile(files[i]);

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
            createDropdown(res);
        }
    };

    xhttp.open("POST","https://localhost:8080", true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    req.request = "images";
    var data = JSON.stringify(req);
    xhttp.send(data);
}


function createDropdown(res){
    var images = JSON.parse(res);
    var div = document.getElementById('dropDown');
    var html = div.innerHTML;
    html += "<select>";

    for (var i = 0; i < images.length; i++){
        html += "<option>" + images[i];
    }
    html += "</select>";
    div.innerHTML = html;
}

/**
var data = [];

var pizza1 = {
    "name":"1",
    "price":"22"
};
var pizza2 = {
    "name":"2",
    "price":"23"
};

data[0] = pizza1;
data[1] = pizza2;

for(i = 0 ; i < data.length;i++){
    console.log(data[i]);
}
/**
 var json = JSON.stringify(data);
 var parsed = JSON.parse(json);
 alert(parsed[0].name);
 alert(json);
 alert(data.length);*/
