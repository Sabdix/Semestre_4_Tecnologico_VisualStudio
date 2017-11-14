(function () {
    "use strict";

    function inicializar() {
        var modeloVista = {
            contador: 0,
            click: WinJS.UI.eventHandler(function (evt) {
                //Evitar el comportamiento por default
                evt.preventDefault();
                //Incrementar el contador
                modeloVista.contador++;
            })
        };
        //Marcar el objeto como observable
        modeloVista = WinJS.Binding.as(modeloVista);
        //Ligar  (bind) el objeto con el documento
        WinJS.Binding.processAll(null, modeloVista);
    }

    document.addEventListener("DOMContentLoaded", inicializar);

})();