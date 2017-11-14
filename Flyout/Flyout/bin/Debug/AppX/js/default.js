(function () {
    "use strict";

    function inicializar() {
        WinJS.UI.processAll().done(function () {
            var boton = document.getElementById("boton");
            var flyout = document.getElementById("fuente").winControl;
            var tipoDeLetra = document.getElementById("tipoDeLetra");
            var texto = document.getElementById("texto");

            boton.addEventListener("click", function () {
                flyout.show(boton);
            });
            tipoDeLetra.addEventListener("change", function () {
                texto.style.fontFamily = tipoDeLetra.value;
                flyout.hide();
            });
        });
    }

    document.addEventListener("DOMContentLoaded", inicializar);
})();
