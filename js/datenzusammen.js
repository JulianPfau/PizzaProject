var button = document.getElementById("test");            //Auf Abschick-Button zugreifen
button.addEventListener('click', datenschreiben);

//kontaktdaten zum test in session storage schreiben
function datenschreiben(){            
	var kontaktdaten = {"contact": {
            "name": "Max Mustermann",
            "postcode": 82299,
            "street": "Daheim",
            "nr": "1",
            "phone": "999901"
        }};
	var kontaktdaten = JSON.stringify(kontaktdaten);
	sessionStorage.setItem('kontaktdaten', kontaktdaten);
	
	//Alles aus Session storage auslesen
	var total = sessionStorage["total"];
	
	var kontaktdaten = sessionStorage["kontaktdaten"];
	kontaktdaten = JSON.parse(kontaktdaten);
	kontaktdaten = kontaktdaten["contact"];

	var bestellung = sessionStorage["bestellung"];
	bestellung = JSON.parse(bestellung);
	bestellung = bestellung["items"];
	
	//ausgelesene Dicts in neues dict schreiben und bereits vorhandenen session key überschreiben
	var dict = {};
	dict["items"]=bestellung;
	dict["contact"]=kontaktdaten;
	dict["total"]=total;
	dict = JSON.stringify(dict);
	sessionStorage.setItem('bestellung', dict);
	
	//löschen überflüssiger session storage dateien
	sessionStorage.removeItem('kontaktdaten');
	sessionStorage.removeItem('total');
	
}


