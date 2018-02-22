function checkLogin() {

    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    if (password == "" || !isEmail(username)) {
        alert("Bitte alle Felder ausfüllen!!!!!!!!!!!!");
    } else {

        var json = '{"username":"' + username + '", "password":"' + password + '"}';


        //Creates new AJAX request
        var xhttp = new XMLHttpRequest();

        //Defines what happens when you receive an answer with status code 200
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                //What happens when you receive an answer
                this.responseText; //gets the Response from the Webserver
            }
        };

        //Server URL to send the AJAX to
        var url = 'login';
        xhttp.open("POST", url, true);

        //Sends the request with the JSON in the POST
        xhttp.send(json);
    }
}

function isEmail(email) {
    if (email == "") {
        return false;
    }
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return (true)
    }
    alert("You have entered an invalid email address!")
    return (false)
}

function register(){
    
}