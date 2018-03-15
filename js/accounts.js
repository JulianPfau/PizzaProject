/* accounts.js 
   Tobias, Pascal
   
   Implements most methods needed for the managing the user accounts. 
   Contains methods for login, creating the Session, registering a user, checking if the SessionID is still valid,
   loading and saving user data and generating the Order History
   
   All methods use AJAX with JSON to communicate with the server
   */

/* URL Links 
   These variables contain the filepath of the different websites. Those will be used to mainpulate links in the template to
   refere to the correct page. (This means if sitename/filename changes, you only have change these variables.)*/
// Cart site filepath
var CART_URL = "cart.html";
// Profile site filepath
var PROFILE_URL = "user.html";
// Opening Hours site filepath
var HOURS_URL = "hours.html";
// Menu site filepath
var MENU_URL = "menu.html";
// Ordering site filepath
var ORDER_URL = "order.html";
// Login site filepath
var LOGIN_URL = "index.html";
// Register site filepath
var REGISTER_URL = "reg.html";

// checks Login on key press "Enter"
function returnReg(e) {
    if (e.keyCode == 13) {
        checkLogin();
    }
}

//Checks the login data and creates a Session if the Server confirms it
function checkLogin() {
    //Gets the values from the input fields on the Website
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    //checks if the password field is empty and if the E-Mail Adress is valid
    if (password == "" || !isEmail(username)) {
        //Gives out an popup when Password/Email is wrong
        popup("Bitte alle Felder ausfüllen oder E-Mail in korrektem Format angeben");
    } else {
        //Creates a JSON-String with the username and password
        var json = {"username": username, "password": password};
        var json = {"username": username, "password": password};
        //sends the JSON to the server over AJAX and saves the return value as Session ID
        var response = ajax("login", json);

        // DEBUG
        // console.log(response);

        //Only saves the SessionID if it isn't undefined or false, the Server returns false when 
        //the login data isn't valid
        if (response != undefined && JSON.parse(response).STATUS == "OK") {
            createSession(JSON.parse(response).sid);
            sessionStorage.setItem('email', username);
            window.location = MENU_URL;
        } else {
            if (!response && response != undefined && response != "") {
                createSession(JSON.parse(response).sid);
                sessionStorage.setItem('email', username);
                window.location = MENU_URL;

            } else {
                popup("Passwort ist falsch"); //Debug
                document.getElementById('password').value = '';
            }
        }
    }
}

//Writes the Session ID in the Session Storage
function createSession(response) {
    sessionStorage.setItem('SID', response);
}

//Generic AJAX function which takes in the url to send the request to and the conten of the POST-request
function ajax(index, content) {
    var xhttp = new XMLHttpRequest();
    var ret;
    //Defines what happens when you receive an answer with status code 200
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText != "false") {
                ret = this.responseText;
            }
        }
    };

    //Opens the Request in POST-Mode with the given URL
    xhttp.open("POST", 'https://localhost:8080', false);

    //Sends the request with the JSON in the POST
    var data = Object();
    data.request = index;
    data.value = content;
    xhttp.send(JSON.stringify(data));
    return ret;
}

//Checks if a given String is an E-Mail-Adress
function isEmail(email) {
    //returns false if the string is empty
    if (email == "") {
        return false;
    }
    //returns true if the format is corretct **@**.**
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return (true);
    }
    //Informs the User
    popup("E-Mail nicht gültig")
    return (false);
}

// register on key press "Enter"
function returnReg(e) {
    if (e.keyCode == 13) {
        register();
    }
}

//handels the registering of new Users
function register() {
    //Pulls all the values from the HTML input fields to JS variables
    var email = document.getElementById("username").value;
    var firstname = document.getElementById("firstname").value;
    var lastname = document.getElementById("lastname").value;
    var password = document.getElementById("password").value;
    var passwordConfirm = document.getElementById("passwordConfirm").value;
    var postcode = document.getElementById("postcode").value;
    var city = document.getElementById("city").value;
    var street = document.getElementById("street").value;
    var streetNr = document.getElementById("streetNr").value;
    var phone = document.getElementById("phone").value;
    var ageCheck = document.getElementById("defaultCheck1").checked;

    //Checks if the age checkbox is set
    if (!ageCheck) {
        popup("Bitte Haken setzen.");
        return (false);
    }

    //Checks if the two password fields match
    if (password != passwordConfirm) {
        popup("Passwörter stimmen nicht überein");
        document.getElementById('password').value = "";
        document.getElementById('passwordConfirm').value = "";
        return (false);
    }

    //Checks if the E-Mail is correct
    if (!isEmail(email)) {
        document.getElementById('username').value = "";
        return (false);
    }

    //Generates the JSON which is sent to the server via AJAX
    var json = {
        "email": email,
        "firstname": firstname,
        "lastname": lastname,
        "password": password,
        "postcode": postcode,
        "city": city,
        "street": street,
        "streetNr": streetNr,
        "phone": phone
    };
    var result = ajax("register", json);
    console.log(result);
    if (result.status == 'OK') {
        if (result == 'true') {
            window.location = PROFILE_URL;
        } else {
            popup('Unbekannter Fehler');
        }
    }
}

//Sends the currently used Session ID to the server and returns if it is still valid
function checkSID() {
    var id = sessionStorage.getItem("SID");

    if (id != null || id != "") {
        var ret = JSON.parse(ajax("checkSID", {"sid": id}));
    }
    if(ret["STATUS"] == "OK"){
        console.log("login successfully");
    }else{
        console.log("login failed");
    }
    return (ret["STATUS"] == "OK");
}

//Logs the user out by deleting the Session ID from the Session Storage
function logout() {
    var id = sessionStorage.getItem("SID");
    if (id != null || id != "") {
        var ret = JSON.parse(ajax("logout", {"sid": id}));
        if(ret["STATUS"] == "OK"){
            sessionStorage.removeItem('SID');
            sessionStorage.removeItem('email');
            popup("Erfolgreich abgemeldet.");
        }
    }
}

//Loads the user data from the Server, takes in the email of the User from which you want to load the data
function loadOldData(email) {
    var json = ajax("getUserData", {"email": email });
    var decoded = JSON.parse(json);

    var name = decoded.firstname + ' ' + decoded.lastname;
    document.getElementById('firstname').value = decoded.firstname;
    document.getElementById('lastname').value = decoded.lastname;
    document.getElementById('username').value = decoded.email;
    document.getElementById('userstreet').value = decoded.contact.street;
    document.getElementById('userstreetnumber').value = decoded.contact.nr;
    document.getElementById('userpostcode').value = decoded.contact.postcode;
    document.getElementById('usercity').value = decoded.contact.city;
    document.getElementById('userphone').value = decoded.contact.phone;
    document.getElementById('userGreeting').innerHTML = name;
}

//Sends new/modified User data back to the server to be saved in the JSON Database
function sendNewData() {
    var firstname = document.getElementById("firstname").value;
    var lastname = document.getElementById("lastname").value;
    var postcode = document.getElementById("userpostcode").value;
    var street = document.getElementById("userstreet").value;
    var streetNr = document.getElementById("userstreetnumber").value;
    var city = document.getElementById('usercity').value;
    var email = sessionStorage.getItem("email");
    var phone = document.getElementById('userphone').value;


    //Checks if the E-Mail is correct
    if (!isEmail(email)) {
        popup("E-Mail nicht gültig");
        document.getElementById('username').value = "";
        return (false);
    }

    //Generates the JSON which is sent to the server via AJAX
    var json = {
        "email": email,
        "firstname": firstname,
        "lastname": lastname,
        "postcode": postcode,
        "street": street,
        "streetNr": streetNr,
        "phone": phone,
        "city": city
    };
    var result = JSON.parse(ajax("updateData", json));
    if(result["STATUS"] == 'OK') {
        popup("Änderung der Daten erfolgreich");
        setTimeout(location.href = PROFILE_URL, 2000);
    } else {
        popup('Unbekannter Fehler');
    }
}

//Creates a Popup for informing the User about various events, takes in the Text displayed in the Popup
function popup(text) {
    document.getElementById('popup').getElementsByClassName('modal-body')[0].innerText = text;
    $('#popup').modal('show');
}

//Generates the Menu bar; is different if an User is logged on or not
function generateMenu() {
    if (checkSID()) {
        //Shows proper Menu
    } else {
        window.location = LOGIN_URL;
    }
}

//gets the Order history from the server, gets the Email-Address from the SessionStorage
function getHistory() {
    var history = ajax("getOrderbyMail", {"file":"orders", "email": sessionStorage.getItem('email')});
    return history;
}

//Deletes an User account, takes in the email-address of the account which should be deleted
function deleteUser() {
    ajax("deleteUser", {"email": sessionStorage.getItem("email")});
    logout();
    popup("Konto erfolgreich gelöscht.");
    setTimeout(location.href=MENU_URL, 2000);
}

//Redirects the User to a new Page but checks the SessionID before doing so
function RedirectWithCheck(url) {
    if (checkSID()) {
        windows.location(url);
    } else {
        logout();
        popup('Session abgelaufen!');
    }
}

