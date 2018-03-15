/* [T] Template System
version: 1.0
Important:   The Template System requires jQuery to load files. The pages has to be accessed with a server.
Description: Template System is managing the main websites parts. The navigation and the other main sites are gonna
             be inserted via jQuery load function. Every template site is located in the template/ folder. Each element
             can be loaded and manipulated via javascript.
             It is also been used to manage the links. Each link refering to another own site can be inserted via js.
*/

/* [T] Config */
/* URL Links 
   These variables contain the filepath of the different websites. Those will be used to mainpulate links in the template to
   refere to the correct page. (This means if sitename/filename changes, you only have change these variables.)*/
// Cart site filepath
var CART_URL    = "orderoverview.html";
// Profile site filepath
var PROFILE_URL = "user.html";
// Opening Hours site filepath
var HOURS_URL   = "hours.html";
// Menu site filepath
var MENU_URL    = "index.html";
// Ordering site filepath
var ORDER_URL   = "order.html";
// Login site filepath
var LOGIN_URL   = "login.html";
// Register site filepath
var REGISTER_URL= "register.html";
// 404 site filepath
var E404_URL= "404.html";


/* Template Directory Path
   The direcotry where every template file is located*/
var TemplatePath = "template/";

/* HTML ID's
   The Gloabal HTML IDs that are necessary for the template system to run
   IMPORTANT: These are the jQuery ID names (these contain "#" at the beginning)*/
// Preloader ID
var PreloaderID = "#t_preloader";
// Popup ID
var popupID = "#t_popup";
// navigation ID
var navigationID = "#t_navigation";
// Main wrapper ID
var MainID = "#main";


/* ajax function */
//Generic AJAX function which takes in the url to send the request to and the conten of the POST-request
function t_ajax(index, content) {
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
/* Login Function to be able to see the user that is logged in */
//Sends the currently used Session ID to the server and returns if it is still valid
function t_checkSID() {
    var id = sessionStorage.getItem("SID");

    if (id != null || id != "") {
        var ret = JSON.parse(t_ajax("checkSID", {"sid": id}));
    }
    if(ret["STATUS"] == "OK"){
        console.log("login successfully");
    }else{
        console.log("login failed");
    }
    return (ret["STATUS"] == "OK");
}
//Logs the user out by deleting the Session ID from the Session Storage
function t_logout() {
    var id = sessionStorage.getItem("SID");
    if (id != null || id != "") {
        var ret = JSON.parse(t_ajax("logout", {"sid": id}));
        if(ret["STATUS"] == "OK"){
            sessionStorage.removeItem('SID');
            sessionStorage.removeItem('email');
            location.href = MENU_URL;
        }
    }
}


/* [T] Main Template Function */
/* Template Main Function
   On every site this function has to be called to let the Template System work.
   At the pageload it will manage the site.
   If you want to run a specific website you have to add the page name as a string. Otherwise leave the parameter clear.*/
function template(page) {
    window.onload = function () {
        
        // main functions that goning to be exectuted if the template system is called.
        // adds the navigation
        t_navigation();
        // adds the popup template
        t_popup();
        
        // Page names that gonna execute certain template functions
        switch(page){
            case "login":
                // Login site
                t_login();
                break;
            case "register":
                // Register site
                t_register();
                break;
            case "users":
                // User site
				t_users();
				break;
            case "orderconf":
                // orderconf site
				t_orderconf();
				break;
            case "menu":
                // menu site
				t_menu();
				break;
            case "orderoverview":
                // orderoverview site
				t_orderoverview();
				break;
            case "404":
                // 404 site
				t_404();
				break;
            case "401":
                // 401 site
				t_401();
				break;
                
            // every other page if nothing is called
            case undefined:
            case "":
            case null:
                break;
            default:
                break;
        }
        
        // hides the preloader
        hidepreloader();
        
    }
}

/* [T] Preloader Template */
// show the preloader
function showpreloader(){
    $(PreloaderID).fadeIn();
}

//hide the preloader
function hidepreloader(){
   setTimeout(function (){
       $(PreloaderID).fadeOut();
   }, 500);
}


/* [T] Popup Template 
   This will create a hidden popup div to the page so the popup() function can be called.*/
function t_popup() {
    // Filename of the Popup Template
    var PopupFile = "popup.html";
    
    $(popupID).load(TemplatePath + PopupFile);
}

/* [T] Navigation Template */
function t_navigation() {
    // Filename of the Naviagtion Template
    var NavigationFile = "navigation.html";
    
    $(navigationID).load(TemplatePath + NavigationFile, function () {
        var logo = document.getElementById("logo");
        var hours = document.getElementById("hours");
        var state = document.getElementById("state");
        var cart = document.getElementById("cart");
        var logout = document.getElementById("logout");
		var menu = document.getElementById("menu");
        
        // inserts the page links into the navigation
        logo.href = MENU_URL;
        hours.href = HOURS_URL;
        state.href = LOGIN_URL;
        cart.href = CART_URL;
        menu.href = MENU_URL;
        
        // if the user is logged in show the Profile name
        if (t_checkSID()) {
            state.innerText = "Profil"; //sessionStorage.getItem('name');
            state.href = PROFILE_URL;
            logout.style.display = "block";
        }else{
			logout.style.display = "none";
		}
        
        // if the localstorage of the cart exists, show the item amount
        var cartstorage = sessionStorage.getItem("bestellung");
        if(cartstorage != null && cartstorage != undefined){
            var amount = JSON.parse(cartstorage)["items"].length; // cart local Storage
            cart.innerText = amount + " | Warenkorb";
        }
        
    });
}


/* [T] Login Template */
function t_login(){
    // Filename of the Login Template
    var LoginFile = "login.html";

    $(MainID).load(TemplatePath + LoginFile, function (){
        // changes the register link in the template
        document.getElementById("t_link_register").href = REGISTER_URL;
    });
}

/* [T] Register Template */
function t_register(){
    // Filename of the Register Template
    var Registerile = "register.html";

    $(MainID).load(TemplatePath + Registerile, function (){
        // changes the login link in the template
        document.getElementById("t_link_login").href = LOGIN_URL;
    });
}

/* [T] User site Template */
function t_users(){
    // User Template File
    var UserFile = "users.html";
    //var data = getHistory();
	//var orderHistory = JSON.parse(data);

	// var orderHistory = JSON.parse('[{"id":10180206123143,"items":[{"name":"Salami","size":"L","price":7.99,"extras":[1,2],"count":1},{"name":"Cola","size":"0.5","price":4.99,"extras":[],"count":2}],"total":17.97,"customerid":1,"contact":{"name":"Max Mustermann","postcode":82299,"city":"Musterstadt","street":"Daheim","nr":"1","phone":"01245556783"},"done":0},{"id":20180206123143,"items":[{"name":"Cola","size":"0.3","price":2.99,"extras":[],"count":1}],"total":2.99,"customerid":1,"contact":{"name":"Max Mustermann","postcode":82299,"city":"Musterstadt","street":"Daheim","nr":"1","phone":"01245556783"},"done":0}]');
	
	//Adds the template to the document
	$(MainID).load(TemplatePath + UserFile, function (){
        
        // load user data
        loadOldData(sessionStorage.getItem("email"));

        //loads the orderHistoryContentTemplate syncronously
        if(orderHistory != null && orderHistory != "" && orderHistory != undefined && orderHistory["STATUS"] == "OK"){
            $.ajax({
                url: TemplatePath + "orderHistoryContentTemplate.html",
                async: false

                //fills the template with the required data
            }).done(function(data){
                console.log(orderHistory);

                for(var j = 0; j < orderHistory.response_data.length; j++){

                    var order = orderHistory.response_data[j];

                    for(var i = 0; i < order.length; i++){

                        $("#orderHistory").append(data);
                        var item = order;

                        document.getElementById("quantity").innerText = item.count + "x";
                        document.getElementById("type").innerText = item.name;
                        document.getElementById("size").innerText = item.size;
                        document.getElementById("quantity").id = "quantity" + j + "" + i;
                        document.getElementById("type").id = "type" + j + "" + i;
                        document.getElementById("size").id = "size" + j + "" + i;
                    }

                    var buttonthingy = $("<div>").load(TemplatePath + "orderAgainButtonTemplate.html");
                    $("#orderHistory").append(buttonthingy);
                }
            });
        }else{
            
        }
    });
}

/* [T] 404 Template */
function t_404(){
    // Filename of the 404 Template
    var errorfile = "404.html";

    $(MainID).load(TemplatePath + errorfile);
}

/* [T] 401 Template */
function t_401(){
    // Filename of the 404 Template
    var errorfile = "401.html";

    $(MainID).load(TemplatePath + errorfile);
}

/* [T] orderconf Template */
function t_orderconf(){
    // Filename of the 404 Template
    var orderconffile = "orderconf.html";
    $.ajax({
            url: TemplatePath + orderconffile,
            async: false
            }).done(function(data){
        $(MainID).append(data);
        
        // run the site specific functions
        getdata();
    });
}

/* [T] menu Template */
function t_menu(){
    // Filename of the menu Template
    var menufile = "menu.html";
    $.ajax({
            url: TemplatePath + menufile,
            async: false
            }).done(function(data){
        $(MainID).append(data);
        
        // run site specific functions
        loadJSONfromServer("menu", createTablefromJSON);
        controll();

        function loadMenu(jsonData){
            var json = jsonData["jsonData"];
            console.log(json);
            for ( var i = 0 ; i < json.length; i++){
                var row = document.createElement("div");
                row.setAttribute("class","row justify-content-md-center");
                console.log(json[i]);

            }

        }
    });
}

/* [T] orderoverview Template */
function t_orderoverview(){
    // Filename of the menu Template
    var file = "orderoverview.html";
    $.ajax({
            url: TemplatePath + file,
            async: false
            }).done(function(data){
        $(MainID).append(data);
        
        // site specific functions
        var script = document.createElement("script");
        script.src = "js/formularinput.js";       
        
        document.head.append(script);
        pizzenInListe();
	    totalinListe();
    });
}