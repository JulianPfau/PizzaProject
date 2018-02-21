/*
document.getElementById("button1").onclick = function() {
    var body = document.getElementById("body");

    //body.appendChild()

    alert("Hey!");
}
*/

var mydata = JSON.parse(data);
var mydata2 = JSON.parse(data2);
var actualData = JSON.parse(eintrag01);


function foo() {
    var body = document.getElementById("body");

    for (var i = 0, length = actualData.length; i < length; ++i) {
        var cell = document.createElement("p");
        cell.appendChild(document.createTextNode(actualData[i].name + ", " + actualData[i].description + ", " + actualData[i].price[2]));

        body.appendChild(cell);


    }


    //alert(actualData.length);
}