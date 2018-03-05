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
                    var zahlung = "bar";
                }
                if(document.getElementById('mc').checked === true){
                     zahlung = "mc";
                }
                if(document.getElementById('vi').checked === true){
                     zahlung = "vi";
                }
                if(document.getElementById('ae').checked ===true){
                     zahlung = "ae";
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
			dict = JSON.stringify(dict);
			sessionStorage.setItem('bestellung', dict);


            }
});





