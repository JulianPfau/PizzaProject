    //Pizza zu 'bestellung' (JSON) im sessionStorage hinzufügen
function speicherntemp () {

    var pizzaValue = document.getElementById('pizzaIn').value;
    var countValue = document.getElementById('count').value;
    
    //Angekreuzte Größe in Variable eintragen
    var size;
    if(document.getElementById('sizeS').checked==true){
        size = document.getElementById('sizeS').name;
    } else {
        if (document.getElementById('sizeM').checked==true) { 
            size = document.getElementById('sizeM').name;
        } else { 
            size = document.getElementById('sizeL').name;
        }
    }
    //Auslesen, welche Extras ausgewählt sind.
    var extraArray = [];
    for(i = 1; i<4; i++) {
        if(document.getElementById(i).checked==true) {
            extraArray.push(i);
        }
    }
    
    var price = 12; // Platzhalter
	var pizzaObj = {name:pizzaValue, extras:extraArray, size:size, price:price, count:countValue}; //Objekt mit allen Werten für eine Pizza erstellen
    
    //Kosten der momentanten Bestellung
    var old;
    if ( sessionStorage.getItem('bestellung')!=null) {
    var bestellung = sessionStorage.getItem('bestellung');
    bestellung = JSON.parse(bestellung);
    var old = parseInt(bestellung['total']);
    } else { var old = 0; }
    var price = pizzaObj['price'];
    total = countValue*price + old;
    
    var Pizzen = []; //Array für alle Pizzen
        
    //Elemente aus dem SessionStorage laden
    if (sessionStorage.getItem('bestellung')!=null) {
        PizzenStorage = JSON.parse(sessionStorage.getItem('bestellung')); //Array für bereits gespeicherte Pizzen aus SessionStorage (ohne Pizza die man gerade speichern will)
        Pizzen = PizzenStorage['items']; 
    }
    Pizzen.push(pizzaObj); //neue Pizza hinzufügen
        
    var PizzenObj = {items:Pizzen, total:total};
    var bestellung = JSON.stringify(PizzenObj);
	sessionStorage.setItem('bestellung', bestellung);
       
    sessionStorage.removeItem('extraArray'); //da Extras nur für diese eine Pizza waren
				
}