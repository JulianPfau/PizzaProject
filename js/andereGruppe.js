//json z.B. {"email":"maxmusterman@test.com","password":"12345"}
function login(json) {
    var xhttp = new XMLHttpRequest();
    var data = new Object();
    data.request = "login";
    data.value = json;
    xhttp.open("POST","https://localhost:8080",false);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send(JSON.stringify(data));

    return (JSON.parse(xhttp.responseText).STATUS == "OK");
}

//json z.B. {"email": "123","firstname": "Flo", "lastname": "Test","password": "password", "postcode": "4567", "city":"Daheim", "street": "wtfstreet", "streetNr": "-1", "phone": "0176"}
function register(json) {
    var xhttp = new XMLHttpRequest();
    var data = new Object();
    data.request = "register";
    data.value = json;
    xhttp.open("POST","https://localhost:8080",false);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send(JSON.stringify(data));

    return (JSON.parse(xhttp.responseText).STATUS == "OK");
}