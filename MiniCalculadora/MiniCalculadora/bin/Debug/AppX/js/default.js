(function () {
    "use strict";

    function inicializar() {
        var n;
        var Suma = 0;

        document.getElementById("menos").addEventListener("click", function (evt) {
            n = parseInt(document.getElementById("numero").value);
            Suma -= n;
            historial.innerHTML += n + ", ";
            suma.innerHTML = Suma;
            numero.innerText = "";
        });

        document.getElementById("mas").addEventListener("click", function (evt) {
            n = parseInt(document.getElementById("numero").value);
            Suma += n;
            historial.innerHTML += n + ", ";
            suma.innerHTML = Suma;
            numero.innerText = "";
        });

    }
    document.addEventListener("DOMContentLoaded", inicializar);
})();
