function uploadFile(evt) {
    console.log(evt);

    var uploadDatei = evt[0];
    var reader = new FileReader();

    var senddata = new Object();
    senddata.name = uploadDatei.name;
    senddata.date = uploadDatei.lastModified;
    senddata.size = uploadDatei.size;
    senddata.type = uploadDatei.type;

    reader.onload = function(theFileData) {
        senddata.fileData = theFileData.target.result; // Ergebnis vom FileReader auslesen

        var xhttp = new XMLHttpRequest();
        xhttp.open("POST","https://localhost:8080",true);
        xhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
        var data = JSON.stringify(senddata);
        xhttp.send(data);
        console.log(data)

    }

    reader.readAsDataURL(uploadDatei);

}