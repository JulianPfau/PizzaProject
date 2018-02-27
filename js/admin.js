function saveInput(table) {
    var input = document.getElementById("input").value;
    updateTable(table, "");
    updateTable(table, input);
}

function updateTable(table, value) {
    var rows = document.getElementsByClassName("tr menuElement");

    for (var i = 0; i < rows.length; i++) {

        var row = rows[i].childNodes;

        for (var n = 1; n < row.length; n++) {
            var node = row[n].firstChild;
            if (node != null) {
                if (value == "") {
                    node.parentElement.parentElement.style.display = '';
                } else {
                    switch (table) {
                        case "orders":
                            if (node.id == "Contact" || node.id == "Items") {
                                if (!node.innerHTML.toUpperCase().includes(value.toUpperCase())) {
                                    node.parentElement.parentElement.style.display = 'none';
                                }
                            }

                            break;
                        case "menu":
                            if (node.id == "Name" || node.id == "Description" || node.id == "Types" || node.id == "Tags") {
                                if (!node.innerHTML.toUpperCase().includes(value.toUpperCase())) {
                                    node.parentElement.parentElement.style.display = 'none';
                                }
                            }

                            break;
                        case "customers":
                            if (node.id == "Contact" || node.id == "EMail" || node.id == "Firtname" || node.id == "Lastname") {
                                if (!node.innerHTML.toUpperCase().includes(value.toUpperCase())) {
                                    node.parentElement.parentElement.style.display = 'none';
                                }
                            }
                            break;
                        case "extras":
                            if (node.id == "Name") {
                                if (!node.innerHTML.toUpperCase().includes(value.toUpperCase())) {
                                    node.parentElement.parentElement.style.display = 'none';
                                }
                            }

                            break;
                    }
                }
            }
        }
    }
}