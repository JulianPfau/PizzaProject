//Checks the login data and creates a Session if the Server confirms it
function checkLogin() {
    //Gets the values from the input fields on the Website
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    //checks if the password field is empty and if the E-Mail Adress is valid
    if (password == "" || !isEmail(username)) {
        //Gives out an popup when Password/Email is wrong
        popup("Bitte alle Felder ausf&auml;llen oder E-Mail in korrektem Format angeben");
    } else {
        //Creates a JSON-String with the username and password
        var json = '{"request":"login","username":"' + username + '", "password":"' + password + '"}';
        //sends the JSON to the server over AJAX and saves the return value as Session ID
        var response = ajax(json);
        //Only saves the SessionID if it isn't undefined or false, the Server returns false when 
        //the login data isn't valid
        if(!response && response != undefined && response != ""){
            createSession(response);            
            sessionStorage.setItem('email', username);
            window.location = "./speisekarte.html"; 
            
        }else{
            popup("Passwort ist falsch"); //Debug
            document.getElementById('password').value='';
        }
    }
}

//Writes the Session ID in the Session Storage
function createSession(response){
    var data = response.parseJSON();
    sessionStorage.setItem('SID',  data.id);
    sessionStorage.setItem('name', data.firstname + ' ' + data.lastname);
}

//Generic AJAX function which takes in the url to send the request to and the conten of the POST-request
function ajax(content) {
    var xhttp = new XMLHttpRequest();
    //Defines what happens when you receive an answer with status code 200
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText != "false") {
                return this.responseText;
            }
        }
    };

    //Opens the Request in POST-Mode with the given URL
    xhttp.open("POST", '', true);

    //Sends the request with the JSON in the POST
    xhttp.send(content);
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
    popup("You have entered an invalid email address!")
    return (false);
}

//handels the registering of new Users
function register() {
    //Pulls all the values from the HTML input fields to JS variables
    var email = document.getElementById("email").value;
    var firstname = document.getElementById("firstname").value;
    var lastname = document.getElementById("lastname").value;
    var password = document.getElementById("password").value;
    var passwordConfirm = document.getElementById("passwordConfirm").value;
    var postcode = document.getElementById("postcode").value;
    var street = document.getElementById("street").value;
    var streetNr = document.getElementById("streetNr").value;
    var phone = document.getElementById("phone").value;
	var ageCheck = document.getElementById("defaultCheck1").checked;
	
	//Checks if the age checkbox is set
	if(!ageCheck){
		popup("Bitte Haken setzen.");
		return(false);
	}
	
    //Checks if the two password fields match 
    if (password != passwordConfirm) {
        popup("Passwörter stimmen nicht überein");
        document.getElementById('password').value = "";
        document.getElementById('passwordConfirm').value = "";
        return (false);
    }

    //Checks if the E-Mail is correct
    if (isEmail(email)) {
        popup("E-Mail nicht gültig");
        document.getElementById('email').value = "";
        return (false);
    }

    //Generates the JSON which is sent to the server via AJAX
    var json = '{"request":"register",email":"' + email + '","firstname":"' + firstname + '","lastname":"' + lastname + '","password":"' + password + '","postcode":"' + postcode + '","street":"' + street + '","streetNr":"' + streetNt + '","phone":"' + phone + '",}'
    var result = ajax(json);
    if (result == 'true'){
        window.location = 'dashboard.html';
    } else {
        popup('Unbekannter Fehler: ');
    }
}

//Sends the currently used Session ID to the server and returns if it is still valid
function checkSID() {
    var id = sessionStorage.getItem("SID");

    if (id != null || id != "") {
        if (ajax('{"request":"checkSID", "id":'+id+'}') == 'true') {
            return true;
        }
    }
    return false
}

//Logs the user out by deleting the Session ID from the Session Storage
function logout(){
    sessionStorage.removeItem('SID');
}

function loadOldData(email){
    var json = ajax('{"request":"getUserData", "email":"'+ email +'"}')
    var decoded = JSON.parseJSON(json);
    
    var name = decoded.firstname + ' ' + decoded.lastname;
	documenet.getElementById('firstname').value = decoded.firstname;
	document.getElementById('lastname').value = decoded.lastname;
	document.getElementById('username').value = decoded.email;
	document.getElementById('userstreet').value = decoded.street;
	document.getElementById('userstreetnumber').value = decoded.street;
	document.getElementById('userpostcode').value = decoded.number;
	document.getElementById('usercity').value = decoded.city;
	document.getElementById('userGreeting.').innerHTML = name;
}

function sendNewData(){
    var firstname = document.getElementById("firstname").value;
    var lastname = document.getElementById("lastname").value;
    var postcode = document.getElementById("userpostcode").value;
    var street = document.getElementById("userstreet").value;
    var streetNr = document.getElementById("userstreetnumber").value;
    var city = document.getElementById('usercity').value; 
    var email = document.getElementById('username').value;
	

    //Checks if the E-Mail is correct
    if (isEmail(email)) {
        popup("E-Mail nicht gültig");
        document.getElementById('email').value = "";
        return (false);
    }

    //Generates the JSON which is sent to the server via AJAX
    var json = '{"request":"updateData","email":"' + email + '","firstname":"' + firstname + '","lastname":"' + lastname + '","postcode":"' + postcode + '","street":"' + street + '","streetNr":"' + streetNt + '","phone":"' + phone + '",}'
    var result = ajax(json);
    if (result == 'true'){
        popup("Änderung der Daten erfolgreich");
    } else {
        popup('Unbekannter Fehler: ')
    }
}

function popup(text){
    document.getElementById('popup').getElementsByClassName('modal-body')[0].innerText=text;
    $('#popup').modal('show');
}

function generateMenu(){
    if(checkSID()){
        //Shows proper Menu 
    } else {
        window.location='login.html';
    }
}

function deleteUser(email){
    ajax('{"request":"deleteUser","email":"'+email+'"}');
}

function getHistory(){
    var history = ajax('{"request":"getOrderByCustomerID", "file":"orders", "email":"'+sessionStorage.getItem('email')+'"}');
    return histoy;
}

function RedirectWithCheck(url){
    if (checkSID()){
        windows.location(url);
    } else {
        logout();
        popup('Session abgelaufen!');
    }
}
