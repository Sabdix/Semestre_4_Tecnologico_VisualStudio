(function () {
    "use strict";

    function inicializar() {
        WinJS.UI.processAll().done(function () {
            var boton = document.getElementById("boton");
            var menu = document.getElementById("operaciones").winControl;
            var n1;
            var n2;
            var Operacion;
            var flyout = document.getElementById("resultado").winControl;
            boton.addEventListener("click", function () {
                menu.show(boton);
            });

            document.getElementById("suma").addEventListener("click", function () {
                n1 = parseInt(document.getElementById("A").value);
                n2 = parseInt(document.getElementById("B").value);
                Operacion = n1 + n2;
                R.innerText = Operacion;
                flyout.show(R);
            });

            document.getElementById("resta").addEventListener("click", function () {
                n1 = parseInt(document.getElementById("A").value);
                n2 = parseInt(document.getElementById("B").value);
                Operacion = n1 - n2;
                R.innerText = Operacion;
                flyout.show(R);
            });

            document.getElementById("multiplicacion").addEventListener("click", function () {
                n1 = parseInt(document.getElementById("A").value);
                n2 = parseInt(document.getElementById("B").value);
                Operacion = n1 * n2;
                R.innerText = Operacion;
                flyout.show(R);
            });

            document.getElementById("division").addEventListener("click", function () {
                n1 = parseInt(document.getElementById("A").value);
                n2 = parseInt(document.getElementById("B").value);
                Operacion = n1 / n2;
                R.innerText = Operacion;
                flyout.show(R);
2
            });
        })
    }
    document.addEventListener("DOMContentLoaded", inicializar);
})();
