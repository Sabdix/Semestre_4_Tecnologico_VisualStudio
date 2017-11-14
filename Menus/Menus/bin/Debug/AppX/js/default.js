(function () {
    "use strict";

    function inicializar() {
        WinJS.UI.processAll().done(function () {
            var boton = document.getElementById("boton");
            var menu = document.getElementById("fuente").winControl;
            //var tipoDeLetra = document.getElementById("tipoDeLetra");
            var texto = document.getElementById("texto");

            boton.addEventListener("click", function () {
                menu.show(boton);
            });

            document.getElementById("comandoBorrar").addEventListener(
                "click", function () {
                    texto.innerHTML = "[Borrado]";
                });

            document.getElementById("comandoNegritas").addEventListener(
                "click", function (evt) {
                    var activado =
                        document.getElementById("comandoNegritas").winControl.selected;
                    if (activado) {
                        texto.style.fontWeight = 'bold';
                    }
                    else {
                        texto.style.fontWeight = 'normal';
                    }
                });

            document.getElementById("comandoCursivas").addEventListener(
                "click", function (evt) {
                    var activado =
                        document.getElementById("comandoCursivas").winControl.selected;
                    if (activado) {
                        texto.style.fontStyle = 'italic';
                    }
                    else {
                        texto.style.fontStyle = 'normal';
                    }
                });
            /*tipoDeLetra.addEventListener("change", function () {
                texto.style.fontFamily = tipoDeLetra.value;
                flyout.hide();
            });*/
        });
    }

    document.addEventListener("DOMContentLoaded", inicializar);
})();