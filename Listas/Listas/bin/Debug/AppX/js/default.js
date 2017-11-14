(function () {
    "use strict";

    function inicializar() {
        WinJS.UI.processAll().done(function () {
            //Obtener una referencia al control de la lista.
            var listaControl = document.getElementById("listaProductos").winControl;

            var cliente = new Windows.Web.Syndication.SyndicationClient();
            var url = new Windows.Foundation.Uri("http://safari.java.net/rss");

            cliente.retrieveFeedAsync(url).done(function (rss) {
                var listaDeLibros = new WinJS.Binding.List(rss.items);
                listaControl.itemDataSource = listaDeLibros.dataSource;
            });

            //Ligar el control de la lista con un evento para que al presionar haga algo
            listaControl.addEventListener("iteminvoked", function (e) {
                var indice = e.detail.itemIndex;
                e.detail.itemPromise.then(function (articulo) {
                    var mensaje = indice + "\n" +
                        articulo.data.title.text + "\n";
                    var dialogo = Windows.UI.Popups.MessageDialog(mensaje);
                    dialogo.showAsync();
                });
            });

            ////Crear la Lista de Productos.
            //var listaDeProductos = new WinJS.Binding.List([     //Los [] indican que es una lista
            //    { nombre: "Sabritas", precio: 8.50 },   //Los {} indican que son objetos
            //    { nombre: "Pepsi", precio: 9.50 },
            //    { nombre: "Pepsi 600ml", precio: 6.50 },
            //    { nombre: "Gansito", precio: 7.00 },
            //    { nombre: "Danonino", precio: 11.50 }
            //]);

            ////Ligar la Lista de Productos con el Control de la Lista.
            //listaControl.itemDataSource = listaDeProductos.dataSource;
        });
    }
    document.addEventListener("DOMContentLoaded", inicializar);
})();
