(function () {
    "use strict";

    function inicializar() {
        var modeloVista = {
            suma: 0,
            click: WinJS.UI.eventHandler(function (evt) {
                //Evitar comportamiento por default
                evt.preventDefault();

                var numero = parseInt(document.getElementById("n").value);
                if (numero % 2 == 0) {
                    modeloVista.suma += numero;
                }
            })
        };
        WinJS.Binding.processAll(null, modeloVista);
        modeloVista = WinJS.Binding.as(modeloVista);
    }
    document.addEventListener("DOMContentLoaded", inicializar);

})();