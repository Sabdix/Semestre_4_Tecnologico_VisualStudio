function init() {
    WinJS.UI.processAll().done(function () {
        var listaMaterias = document.getElementById("listaMaterias").winControl;

        //Crear las opciones del Data Source
        var opciones = {
            databaseName: "MateriasDB",
            databaseVersion: 1,
            indexNames: ["semestre"]
        };

        //Crear el DataSource
        var materiasDataSource = new DataSources.IndexedDbDataSource("materias", opciones);
        addSeedData().done(function () {
            listaMaterias.itemDataSource = materiasDataSource;
        });

        //Ligar la fuente de datos con la lista
        function addSeedData() {
            return new WinJS.Promise(function (comp) {
                materiasDataSource.getCount().then(function (cont){
                    if (cont > 0){
                        comp();
                    } 
                    else {
                        var seedInfo = [
                        {
                            nombre: "Fundamentos de Programacion",
                            semestre:1
                        },
                        {
                            nombre: "Programacion Orientada a Objetos",
                            semestre:2
                        },
                        {
                            nombre: "Programacion II",
                            semestre:4
                        }];

                        var promises = [];

                        seedInfo.forEach(function (data){
                            promises.push(materiasDataSource.insertAtEnd(null, data));
                        });

                        WinJS.Promise.join(promises).done(function(){
                            comp();
                        });
                    }
                });
            });
        }

        //Agregar los botones
        document.getElementById("selectSemestre").addEventListener("change", function(evt){
            var semestre = document.getElementById("selectSemestre").value;
            if(semestre == "Todos"){
                materiasDataSource = new DataSources.IndexedDbDataSource("materias", opciones);
            }
            else {
                var opcionesCursor = {
                    indexName: "semestre",
                    only: parseInt(semestre)
                };
                materiasDataSource = new DataSources.IndexedDbDataSource("materias", opciones, opcionesCursor);
            }
            listaMaterias.itemDataSource = materiasDataSource;
        });

        //Agregar Materia
        document.getElementById("formularioAgregar").addEventListener("submit", function (evt) {
            evt.preventDefault();
            materiasDataSource.beginEdits();
            materiasDataSource.insertAtEnd(null, {
                nombre: document.getElementById("inputNombre").value,
                semestre: parseInt(document.getElementById("selectSemestreMateria").value)
            }).done(function (item) {
                materiasDataSource.endEdits();
                document.getElementById("formularioAgregar").reset();
                //Mostrar el nuevo elemento
                listaMaterias.itemDataSource.getCount().done(function (count) {
                    listaMaterias.ensureVisible(count);
                });
            });
        });

        //Boton borrar
        document.getElementById("borrar").addEventListener("click", function (evt) {
            if (listaMaterias.selection.count() == 1) {
                materiasDataSource.beginEdits();
                listaMaterias.selection.getItems().done(function (items) {
                    materiasDataSource.remove(items[0].key);
                    materiasDataSource.endEdits();
                });
            }
        });

        //Boton borrar todas
        document.getElementById("borrarTodas").addEventListener("click", function () {
            materiasDataSource.nuke();
        });
    });
}
document.addEventListener("DOMContentLoaded", init);