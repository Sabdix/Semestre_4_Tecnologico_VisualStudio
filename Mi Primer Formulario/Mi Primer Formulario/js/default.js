(function () {
    "use strict"
    
    function inicializar() {
        var vistaModelo = {
            /*
            MVC = Patron y arquitectura
            Modelo, vista y controlador
            Modelo = contiene lógica
            Vista = parte visual
            controlador = interaccion entre el modelo y la vista
            */
            submit:
                WinJS.UI.eventHandler(function (evt) {
                    //Anular acciones por default
                    evt.preventDefault();
                    //Obtener valores de los campos

                    var telefono = {
                        casa:
                           document.getElementById("telefono").value,
                        celular:
                            document.getElementById("celular").value
                    };
                    console.log("Casa: " + telefono.casa);
                    console.log("Celular: " + telefono.celular);
                })
        };
        WinJS.Binding.processAll(null, vistaModelo);
    }
    document.addEventListener("DOMContentLoaded", inicializar);
})();