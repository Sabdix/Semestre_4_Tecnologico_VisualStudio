(function () {
    "use strict";

    function inicializar() {
        WinJS.UI.processAll().done(function () {
            var boton = document.getElementById("boton");
            var menu = document.getElementById("mostrar").winControl;
            var texto = document.getElementById("texto");
            boton.addEventListener("click", function () {
                menu.show(boton);
            });

            document.getElementById("comandoConsonantes").addEventListener(
                "click", function () {
                    texto2.innerHTML = "";
                    for (var i = 0; i < texto.value.length; i++) {
                        if (texto.value.charAt(i) == "a" || texto.value.charAt(i) == "e"
                            || texto.value.charAt(i) == "i" || texto.value.charAt(i) == "o"
                            || texto.value.charAt(i) == "u" || texto.value.charAt(i) == "1" || texto.value.charAt(i) == "2"
                            || texto.value.charAt(i) == "3" || texto.value.charAt(i) == "4"
                            || texto.value.charAt(i) == "5" || texto.value.charAt(i) == "6"
                            || texto.value.charAt(i) == "7" || texto.value.charAt(i) == "8"
                            || texto.value.charAt(i) == "9")
                            texto2.innerHTML += " ";
                        else
                            texto2.innerHTML += texto.value.charAt(i);
                    }
                });

            document.getElementById("comandoVocales").addEventListener(
                "click", function (evt) {
                    texto2.innerHTML = "";
                    for (var i = 0; i < texto.value.length; i++) {
                        if (texto.value.charAt(i) == "a" || texto.value.charAt(i) == "e"
                            || texto.value.charAt(i) == "i" || texto.value.charAt(i) == "o"
                            || texto.value.charAt(i) == "u")
                            texto2.innerHTML += texto.value.charAt(i);
                        else
                            texto2.innerHTML += " ";
                    }
                });

            document.getElementById("comandoNumeros").addEventListener(
                "click", function (evt) {
                    texto2.innerHTML = "";
                    for (var i = 0; i < texto.value.length; i++) {
                        if (texto.value.charAt(i) == "1" || texto.value.charAt(i) == "2"
                            || texto.value.charAt(i) == "3" || texto.value.charAt(i) == "4"
                            || texto.value.charAt(i) == "5" || texto.value.charAt(i) == "6"
                            || texto.value.charAt(i) == "7" || texto.value.charAt(i) == "8"
                            || texto.value.charAt(i) == "9")
                            texto2.innerHTML += texto.value.charAt(i);
                        else
                            texto2.innerHTML += " ";
                    }
                });
        });

    }

    document.addEventListener("DOMContentLoaded", inicializar);
})();