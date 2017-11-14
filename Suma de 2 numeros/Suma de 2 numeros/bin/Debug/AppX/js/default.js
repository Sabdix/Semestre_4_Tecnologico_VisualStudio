(function () {
    "use strict"

    function inicializar() {
        var vistaModelo = {
            suma: 0,
            click: WinJS.UI.eventHandler(function (evt) {
                //Evitar el comportamiento por default
                evt.preventDefault();
                
                //Obtencion de los valores de los campos
                vistaModelo.suma =
                        parseInt(document.getElementById("n1").value)
                        +
                        parseInt(document.getElementById("n2").value);
            })

        };
        WinJS.Binding.processAll(null, vistaModelo);
        vistaModelo = WinJS.Binding.as(vistaModelo);
    }
    document.addEventListener("DOMContentLoaded", inicializar);
})();