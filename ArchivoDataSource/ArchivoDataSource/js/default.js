function init() {
    WinJS.UI.processAll().done(function () {
        var vistaTareas = document.getElementById("listaTareas").winControl;
        var flyout = document.getElementById("mod").winControl;

        //Crear la fuente de datos y ligarla con la lista HTML
        var dataSource = new DataSources.FileDataSource("tareas.json");
        vistaTareas.itemDataSource = dataSource;

        //Funciones de los botones
        document.getElementById("formulario").addEventListener("submit", function (evt) {
            evt.preventDefault();
            dataSource.beginEdits();
            dataSource.insertAtEnd(null, {
                nombre: document.getElementById("inputNombreTarea").value
            }).done(function (nuevoItem) {
                dataSource.endEdits();
                document.getElementById("formulario").reset();
                //Mostrar el elemento agregado
                vistaTareas.itemDataSource.getCount().done(function (cont) {
                    vistaTareas.ensureVisible(cont);
                });
            });
        });

        document.getElementById("botonBorrar").addEventListener("click", function () {
            if (vistaTareas.selection.count() == 1) {
                vistaTareas.selection.getItems().done(function (items) {
                    dataSource.beginEdits();
                    dataSource.remove(items[0].key).done(function () {
                        dataSource.endEdits();
                    });
                });
            }
        });

        //Editar
        document.getElementById("botonEditar").addEventListener("click", function () {
            if (vistaTareas.selection.count() == 1) {
                flyout.show(document.getElementById("botonEditar"));
            } else
            {
                var message = Windows.UI.Popups.MessageDialog("Seleccione un elemento");
                message.showAsync();
            }
        });

        document.getElementById("faceptar").addEventListener("click", function () {
            if (vistaTareas.selection.count() == 1) {
                vistaTareas.selection.getItems().done(function (items) {
                    dataSource.beginEdits();
                    dataSource.change(items[0].key, {
                        nombre: document.getElementById("newText").value
                    }).done(function () {
                        dataSource.endEdits();
                    });
                });
            }
        });

        //Borrar todas las tareas
        document.getElementById("botonBorrarTodas").addEventListener("click", function () {
            dataSource.nuke();
        });
    });
}

document.addEventListener("DOMContentLoaded", init);