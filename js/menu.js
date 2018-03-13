var extras;

function getExtras(json) {
    extras = json;
}

function createTablefromJSON(rawData){
    loadJSONfromServer("extras", getExtras);

    var json = JSON.parse(rawData)["jsonData"];
    var table = document.getElementsByClassName("table")[0];
    var arrContent = ["picture","name","description","sizes","extras","prices"];

    //remove all rows if exists
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }
    //create elements from JSON file

    for(var i = 0 ; i < json.length; i++){
        var container = document.createElement("div");
        container.setAttribute("class","col-12 col-md");
        container.setAttribute("name",i +"_"+json[i]["name"]);
        container.style.display = "flex";

        var btnOrder = document.createElement("button");

        var selAmount = document.createElement("select");
        selAmount.setAttribute("class","selectpicker");
        var amId = 'amount' + i;
        selAmount.setAttribute("id", amId); 
        selAmount.setAttribute("onChange","changePrice('"+i+"')");

        for (var k = 1; k < 10; k++){
            var option = document.createElement("option")
            option.setAttribute("value", k);
            option.innerHTML = k ;
            selAmount.appendChild(option);
        }

        btnOrder.setAttribute("class","btn orange-o75 btn-primary btn-lg btn-success");
        btnOrder.setAttribute("data-toggle","modal");
        btnOrder.setAttribute("data-target","#basicModal");
        btnOrder.setAttribute("onclick","pizzaWahl(" + i + ");")
        btnOrder.innerHTML = "zum Warenkorb hinzufügen";
        /*
        item row = col-12 col-md

        paragraph = class mb-1 id = id  p. innerHTML key
        */
        // create col for json data
        arrContent.forEach(function (key) {
            var value = json[i][key];
            var d = document.createElement("div");
            d.setAttribute("class","col-12 col-md");
            // if it's a picture create img src
            if (key == "picture"){
                var content = document.createElement("img");
                content.setAttribute("src","/img/menu/" + value);
                content.setAttribute("id", key);
                content.style.width = "100px";
                d.appendChild(content);
                container.appendChild(d);
            }else {
                var content = document.createElement("span");
                content.setAttribute("class", "mb-1");
                content.setAttribute("id", key);
                //content.style.flexDirection = "column";
                if (key == "sizes"){
                    var sel = document.createElement("select");
                    sel.setAttribute("class","selectpicker");
                    sel.setAttribute("onchange","changePrice("+i+")");
                    var sizePickerName = 'size' + i;
                    sel.setAttribute("id", sizePickerName);
                    for(var n = 0; n < value.length ;n++){
                        var opt = document.createElement("option");
                        opt.innerHTML = value[n];
                        sel.appendChild(opt);
                    }
                    content.appendChild(sel);
                }else if(key == "prices"){
                    content.innerHTML = "Preis: " + value[0];

                    for(var p = 0; p < value.length;p++){
                        var input = document.createElement("input");
                        input.setAttribute("type","hidden");
                        input.setAttribute("name", "price" + p);
                        input.value = value[p];
                        d.appendChild(input);
                    }
                }else if(key == "extras"){

                    var arrExtras = JSON.parse(extras)["jsonData"];

                    for(var e = 0; e < value.length;e++){
                        try{
                            var input = document.createElement("input");
                            input.setAttribute("type", "hidden");
                            input.setAttribute("name", e);
                            input.value = arrExtras[value[e] -1].price;
                            input.innerHTML = arrExtras[value[e] -1].name;
                            d.appendChild(input);
                        } catch (err){
                            console.log("no extras available");
                        }
                    }

                    content.innerHTML = "Extras";
                    content.setAttribute('data-toggle', 'modal');
                    content.setAttribute('data-target', '#modal');
                    content.setAttribute('onClick',"openExtras(this,"+i+")");

                }
                else {
                    content.innerHTML = value;
                }
                d.appendChild(content);
                container.appendChild(d);
            }

        });

        // append finished row to table
        //container.appendChild(col);
        container.appendChild(selAmount);
        container.appendChild(btnOrder);
        table.appendChild(container);
    }
}

function openExtras(element, index) {
    var extras = element.parentNode.getElementsByTagName("input");

    //Sets title of Extras Popup
    document.getElementById("modalExtrasItems").innerHTML = "Extras";
    //Sets index for write
    var extrasBox = document.getElementById("extrasBox");

    extrasBox.setAttribute('name',index);

    //Removes all Extras from Popup
    while (extrasBox.firstChild) {
        extrasBox.removeChild(extrasBox.firstChild);
    }

    //Loops every extra from input fields
    for (var i = 0; i < extras.length; i++) {
        //Creates DOM-Elements for Popup
        var li = document.createElement('li');
        var label = document.createElement('label');
        var input = document.createElement('input');
        var span = document.createElement('span');

        //Defines the checkbox
        input.setAttribute('type', 'checkbox');

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
        input.setAttribute('id', extras[i].name);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

        //Content & Change Event for extra
        span.innerHTML = " " + extras[0].innerText + "<br>"+parseFloat(extras[i].value).toFixed(2)+"€";
        span.onkeydown = function() {
            var keys = [16,17,18,20,33,34,35,36,37,38,39,40,45,112,113,114,115,116,117,118,119,120,121,122,123,144,145];
            if (!keys.includes(event.keyCode)) {
                document.getElementById("reload").setAttribute("class", "btn btn-lg active")
                this.setAttribute('class', 'bg-warning');}
        };


        //Checks weather the extras is already in selected or not and it'll be marked if so
        if (extras[i].getAttribute("selected") == "true"){
            input.setAttribute('checked', 'true');
        }


        //Appends all DOM-Elemnts to bi displayed
        label.appendChild(input);
        label.appendChild(span);
        li.appendChild(label);
        extrasBox.appendChild(li);
    }

}

function confirmExtras(element) {

    var modal = document.getElementById("extrasBox");
    var extraInputs = document.getElementsByTagName("table")[0].childNodes[modal.getAttribute("name")].childNodes[4].getElementsByTagName("input");

    var checkboxes = modal.getElementsByTagName("input");

    for(var i = 0; i < checkboxes.length; i++){

        if(checkboxes[i].checked){

            extraInputs[i].setAttribute("selected","true");

        }else{
            extraInputs[i].setAttribute("selected","false");
        }

    }
    changePrice(modal.getAttribute("name"));
    document.getElementById("closeModal").click();
}


function changePrice(element) {
    var table = document.getElementsByTagName("table")[0].childNodes;
    var size = table[element].childNodes[3].getElementsByTagName("select")[0].value;
    var extras = table[element].childNodes[4].getElementsByTagName("input");
    var priceCol = table[element].childNodes[5];
    var extraPrice = 0;
    var amount = 0;
    var pizzaPrice = table[element].childNodes[5].getElementsByTagName("input")[size].value;

    for (var i = 0; i < extras.length;i++){

        if (extras[i].getAttribute("selected") == "true"){
            extraPrice = parseFloat(extraPrice) + parseFloat(extras[i].value);
        }
    }
    console.log(table[element].getElementsByTagName("select")[0]);
    if(table[element].getElementsByTagName("select")[1].value != 0){

        amount = table[element].getElementsByTagName("select")[1].value;
    }else{
        amount = 1;
    }
    var price = ((parseFloat(pizzaPrice) + parseFloat(extraPrice)) * amount).toFixed(2);
    priceCol.getElementsByTagName("span")[0].innerHTML = "Preis: " + price;

}