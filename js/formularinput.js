'use strict';



document.addEventListener('DOMContentLoaded', function () {

    // click Event an Button anhängen
            var elem = document.getElementById('bestelluebersicht');
            elem.addEventListener('click', schreibe);




    // Bestellformular und Pizzaausswahl wird in eine Json Datei geschrieben
            function schreibe() {
                var firstname = document.getElementById('firstname').value;

                var lastname = document.getElementById('lastname').value;

                var name = firstname + " " + lastname;

                var street = document.getElementById('street').value;

                var nr = document.getElementById('nr').value;

                var postcode = document.getElementById('postcode').value;

                var town = document.getElementById('town').value;

                var phone = document.getElementById('phone').value;

                if(document.getElementById('bar').checked === true){
                    var zahlung = "Bar";
                }
                else if(document.getElementById('mc').checked === true){
                     zahlung = "Master Card";
                }
                else if(document.getElementById('vi').checked === true){
                     zahlung = "Visa";
                }
                else{
                     zahlung = "American Express";
                }


                var objcontact = {
                        name: name,
                        postcode: postcode,
                        street: street,
                        city: town,
                        nr: nr,
                        phone: phone,
                        zahlung: zahlung
                };

			var bestellung = sessionStorage["bestellung"];
			bestellung = JSON.parse(bestellung);
			var pizzen = bestellung["items"];
			var total = bestellung["total"];
			
			var dict = {};
			dict["items"]=pizzen;
			dict["contact"]=objcontact;
			dict["total"]=total;
			var fertigesdict = {};
			fertigesdict["request"] = "newOrder";
			fertigesdict["jsonData"] = dict;
			dict = JSON.stringify(dict);
			fertigesdict = JSON.stringify(fertigesdict);
			sessionStorage.setItem('bestellung', dict);
			ordercheck(fertigesdict);
                location.href="https://localhost:8080/conf.html";



            }

// Bestellübersicht an Server und Antwort in SessionStorage
    function ordercheck(fertigesdict) {
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "https://localhost:8080", false);
        xhttp.send(fertigesdict);
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {

                var orderready = this.responseText;
                writestorage(orderready);
            }
        };

    }

    function writestorage(orderready) {
        sessionStorage.setItem('bestellung', orderready);
        location.href="https://localhost:8080/conf.html";
    }



});





