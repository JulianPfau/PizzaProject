/*
    File with all functions for fileupload.html

 */


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