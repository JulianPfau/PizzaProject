function saveInput() {
    var search = document.getElementById("input").value;
    alert(search);
}

function myFunction() {
    var x = document.getElementById("Topnav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}