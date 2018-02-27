function saveInput(table) {
    var input = document.getElementById("input").value;
    updateTable(table, "");
    updateTable(table, input);
}

function unfold() {
    var x = document.getElementById("navbar");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HoverButton = function () {
    function HoverButton(el) {
        _classCallCheck(this, HoverButton);

        this.el = el;
        this.hover = false;
        this.calculatePosition();
        this.attachEventsListener();
    }

    HoverButton.prototype.attachEventsListener = function attachEventsListener() {
        var _this = this;

        window.addEventListener('mousemove', function (e) {
            return _this.onMouseMove(e);
        });
        window.addEventListener('resize', function (e) {
            return _this.calculatePosition(e);
        });
    };

    HoverButton.prototype.calculatePosition = function calculatePosition() {
        TweenMax.set(this.el, {
            x: 0,
            y: 0,
            scale: 1
        });
        var box = this.el.getBoundingClientRect();
        this.x = box.left + box.width * 0.5;
        this.y = box.top + box.height * 0.5;
        this.width = box.width;
        this.height = box.height;
    };

    HoverButton.prototype.onMouseMove = function onMouseMove(e) {
        var hover = false;
        var hoverArea = this.hover ? 0.7 : 0.5;
        var x = e.clientX - this.x;
        var y = e.clientY - this.y;
        var distance = Math.sqrt(x * x + y * y);
        if (distance < this.width * hoverArea) {
            hover = true;
            if (!this.hover) {
                this.hover = true;
            }
            this.onHover(e.clientX, e.clientY);
        }

        if (!hover && this.hover) {
            this.onLeave();
            this.hover = false;
        }
    };

    HoverButton.prototype.onHover = function onHover(x, y) {
        TweenMax.to(this.el, 0.4, {
            x: (x - this.x) * 0.4,
            y: (y - this.y) * 0.4,
            scale: 1.15,
            ease: Power2.easeOut
        });
        this.el.style.zIndex = 10;
    };

    HoverButton.prototype.onLeave = function onLeave() {
        TweenMax.to(this.el, 0.7, {
            x: 0,
            y: 0,
            scale: 1,
            ease: Elastic.easeOut.config(1.2, 0.4)
        });
        this.el.style.zIndex = 1;
    };

    return HoverButton;
}();

var btn1 = document.querySelector('li:nth-child(1) button');
new HoverButton(btn1);

var btn2 = document.querySelector('li:nth-child(2) button');
new HoverButton(btn2);

var btn3 = document.querySelector('li:nth-child(3) button');
new HoverButton(btn3);

var btn4 = document.querySelector('li:nth-child(4) button');
new HoverButton(btn4);

var btn5 = document.querySelector('li:nth-child(5) button');
new HoverButton(btn5);