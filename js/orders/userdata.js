//set global variable
var konten;

function getCustomers(element, file) {
    konten = element;
}

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
    xhr.open('GET', url, false);
    //Sends the request
    xhr.send(null);
}

//function which checks wheater the email and pw are like them in the user library
function login() {
    var email = document.getElementById("email").value;
    var passwort = document.getElementById("passwort").value;
    var vorhanden = false;
    for (var i in konten) {
        if (konten[i]["email"] == email && konten[i]["password"] == passwort) {
            vorhanden = true;
            var kontaktdaten = konten[i]["contact"];
            fillformular(kontaktdaten);
        }
    }
    if (vorhanden == false) {
        alert("E-Mail oder Passwort falsch");
    }
}

//this function fullfills the formular on the html page with the correct user datas
function fillformular(kontaktdaten) {
    var name = kontaktdaten["name"];
    name = name.split(" ");
    var firstname = name[0];
    var lastname = name[1];
    var postcode = kontaktdaten["postcode"];
    var street = kontaktdaten["street"];
    var city = kontaktdaten["city"];
    var nr = kontaktdaten["nr"];
    var phone = kontaktdaten["phone"];

    document.getElementById("firstname").value = firstname;
    document.getElementById("lastname").value = lastname;
    document.getElementById("street").value = street;
    document.getElementById("nr").value = nr;
    document.getElementById("postcode").value = postcode;
    document.getElementById("town").value = city;
    document.getElementById("phone").value = phone;

}


function allreadylogin() {
    if (sessionStorage["email"] != null) {
        var email = sessionStorage["email"];
        for (i in konten) {
            if (konten[i]["email"] == email) {
                var kontaktdaten = konten[i]["contact"];
                fillformular(kontaktdaten);
            }
        }
    }
}


getJsonByRequest(getCustomers, "customers");




