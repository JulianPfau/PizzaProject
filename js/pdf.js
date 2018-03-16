var extras;
/**
 *
 * @param order {"id": 10180206123143,"items": [{"name": "Salami","size": "L","price": 7.99,"extras": [1,2],"count": 1},{"name": "Cola","size": "0.5","price": 4.99,"extras": [],"count": 2}],"total": 17.97,"customerid": 1,"contact": {"name": "Max Mustermann","postcode": 82299,"city": "Musterstadt","street": "Daheim","nr": "1","phone": "01245556783"},"done": 1}
 */

getJsonByRequest(getExtras, "extras");

function printPDF(order) {
    // You'll need to make your image into a Data URL
    // Use http://dataurl.net/#dataurlmaker
    console.log(order);
    var doc = new jsPDF();

    doc.setFontSize(13);
    doc.text(92, 15, "Pizza Service");
    doc.text(95, 20, "Strasse Nr");
    doc.text(95.5, 25, "PLZ Stadt");
    doc.text(98, 30, "Telefon");

    doc.setFontSize(20);
    doc.text(10, 45, "Bestellung Nr. " + order.id);

    doc.setFontSize(20);
    doc.text(5, 55, "- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -");

    doc.setFontSize(15);
    doc.text(10, 65, "Kontakt:");
    doc.text(20, 73, toASCII(order.contact.name));
    doc.text(20, 79, toASCII(order.contact.street) + " " + order.contact.nr);
    doc.text(20, 85, order.contact.postcode + " " + toASCII(order.contact.city));
    doc.text(20, 91, order.contact.phone);

    doc.setFontSize(20);
    doc.text(5, 100, "- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -");

    doc.setFontSize(15);
    doc.text(10, 110, "Stueck");
    doc.text(27, 110, "Anzahl");
    doc.text(47, 110, "Items");
    doc.text(185, 110, "Preis");

    var off = 119;
    for (var i = 0; i < order.items.length; i++) {
        doc.text(12, off, order.items[i].count + "");
        doc.text(30, off, toASCII(order.items[i].size) + "");
        doc.text(48, off, toASCII(order.items[i].name) + "");
        doc.text(186, off, order.items[i].price + "");

        if (order.items[i].extras[0] != null) {
            for (var e = 0; e < order.items[i].extras.length; e++) {
                off += 7;
                doc.text(48, off, " + " + toASCII(getExtrasNameFromID(order.items[i].extras[e])));
                doc.text(186, off, " + " + toASCII(getExtrasPriceFromID(order.items[i].extras[e])));
            }
            off += 2;
        }

        off += 7;
    }

    doc.setFontSize(20);
    doc.text(5, off + 3, "- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -");

    doc.setFontSize(15);
    doc.text(143, off + 12, "Gesamtbetrag:");
    doc.text(184, off + 12, order.total + "");

    doc.setFontSize(20);
    doc.text(5, off + 20, "- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -");

    var data = new FormData();
    data.append("order" + order.id + ".pdf", doc.output());

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "https://localhost:8080", true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send(data);
}

function toASCII(string) {
    string = string.toString();
    string = string.replace(/ä/g, 'ae');
    string = string.replace(/ö/g, 'oe');
    string = string.replace(/ü/g, 'ue');
    string = string.replace(/Ä/g, 'Ae');
    string = string.replace(/Ö/g, 'Oe');
    string = string.replace(/Ü/g, 'Ue');
    string = string.replace(/ß/g, 'ss');
    return string;
}

function getExtrasNameFromID(id) {
    getJsonByRequest(getExtras, "extras");
    for (var i = 0; i < extras.length; i++) {
        if (extras[i].id == id) {
            return extras[i].name;
        }
    }
    return NaN;
}

function getExtrasPriceFromID(id) {
    getJsonByRequest(getExtras, "extras");
    for (var i = 0; i < extras.length; i++) {
        if (extras[i].id == id) {
            return extras[i].price;
        }
    }
    return NaN;
}

/**  Requests a JSON file in the /json directory of the server and calls a
 specified function with the parsed JSON Element as parameter.

 Parameters:
 - cFunction     the Function to call then successful
 - file          the file name without the .json ending

 Nothing happens on Error.
 **/
function getJsonByRequest(cFunction, file) {
    var url = "https://localhost:8080/json/" + file + ".json";
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        //readystate == 4       = Request is DONE
        //status == 200         = was successful
        if (xhr.readyState == 4 && xhr.status == "200") {
            //Creating element from the responsetext
            var element = JSON.parse(this.responseText);
            //Calling the function with the object as parameter);
            cFunction(element, file);
        } else {
            //Nothing here, as this is called multiple times, even if it is successful.
        }
    };
    //Initializes the request
    xhr.open('GET', url, true);
    //Sends the request
    xhr.send(null);
}

/**
 * Saves the json to global extras value
 *
 * @param json from the getJSONFromServer
 */
function getExtras(json) {
    extras = json;
}