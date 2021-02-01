var controller = {
    $this: null,
    init: function (container, options) {
        this.$this = $(container.children()[0]);

        var thisController = this;
        cicTrace("Datos Adicionales - Inicio Init");

        var grid = thisController.$this.find("#listaGenericos").jqGrid({
            datatype: "local",
            autowidth: true,
            rowNum: 19,
            editable: true,
            hidegrid: false,
            colNames: ["Id", "", "Descripción"],
            caption: "Datos Genéricos ",
            colModel: [
			  { name: "id", index: "id", hidden: true, key: true },
              { name: "generico", index: "generico", width: 150 },
			  { name: "descripcion", index: "descripcion", width: 400 }
            ],
            ondblClickRow: function (rowid, iRow, iCol, e) {
                clearSelection();
            },
            onSelectRow: function (id) {
                var sel = (id != undefined);
            }
        });

        attachJQGridToContainerPanel(thisController.$this.find("#listaGenericosContainer"), grid);
        
        cicTrace("Datos Adicionales - Fin Init");

    },
    refresca: function () {
        cicTrace("datos-adicionales Inicio Refresca");
        var thisController = this;
        
        var listaGenericos = thisController.loadInfoGenericos();
        var grid = thisController.$this.find("#listaGenericos").jqGrid();
        grid.jqGrid("clearGridData");
        if (listaGenericos.length > 0) {    
            $.each(listaGenericos, function (i, r) {
                grid.jqGrid("addRowData", r.id, r);
            });
        }

        cicTrace("datos-adicionales Fin Refresca");
    },
    loadInfoGenericos: function () {

        var lista = new Array();
        var contador = 1;

        if (cicGetGenerico01()) {
            var generico = {
                id: contador,
                generico: "Genérico " + contador,
                descripcion: cicGetGenerico01()
            }
            lista.push(generico);
            contador++;
        }


        if (cicGetGenerico02()) {
            var generico = {
                id: contador,
                generico: "Genérico " + contador,
                descripcion: cicGetGenerico02()
            }
            lista.push(generico);
            contador++;
        }


        if (cicGetGenerico03()) {
            var generico = {
                id: contador,
                generico: "Genérico " + contador,
                descripcion: cicGetGenerico03()
            }
            lista.push(generico);
            contador++;
        }


        if (cicGetGenerico04()) {
            var generico = {
                id: contador,
                generico: "Genérico " + contador,
                descripcion: cicGetGenerico04()
            }
            lista.push(generico);
            contador++;
        }


        if (cicGetGenerico05()) {
            var generico = {
                id: contador,
                generico: "Genérico " + contador,
                descripcion: cicGetGenerico05()
            }

            lista.push(generico);
            contador++;
        }


        if (cicGetGenerico06()) {
            var generico = {
                id: contador,
                generico: "Genérico " + contador,
                descripcion: cicGetGenerico06()
            }

            lista.push(generico);
            contador++;
        }


        if (cicGetGenerico07()) {
            var generico = {
                id: contador,
                generico: "Genérico " + contador,
                descripcion: cicGetGenerico07()
            }

            lista.push(generico);
            contador++;
        }

        if (cicGetGenerico08()) {
            var generico = {
                id: contador,
                generico: "Genérico " + contador,
                descripcion: cicGetGenerico08()
            }

            lista.push(generico);
            contador++;
        }


        if (cicGetGenerico09()) {
            var generico = {
                id: contador,
                generico: "Genérico " + contador,
                descripcion: cicGetGenerico09()
            }

            lista.push(generico);
            contador++;
        }


        if (cicGetGenerico10()) {
            var generico = {
                id: contador,
                generico: "Genérico " + contador,
                descripcion: cicGetGenerico10()
            }

            lista.push(generico);
            contador++;
        }


        if (cicGetGenerico11()) {
            var generico = {
                id: contador,
                generico: "Genérico " + contador,
                descripcion: cicGetGenerico11()
            }

            lista.push(generico);
            contador++;
        }

        if (cicGetGenerico12()) {
            var generico = {
                id: contador,
                generico: "Genérico " + contador,
                descripcion: cicGetGenerico12()
            }

            lista.push(generico);
            contador++;
        }


        if (cicGetGenerico13()) {
            var generico = {
                id: contador,
                generico: "Genérico " + contador,
                descripcion: cicGetGenerico13()
            }

            lista.push(generico);
            contador++;
        }


        if (cicGetGenerico14()) {
            var generico = {
                id: contador,
                generico: "Genérico " + contador,
                descripcion: cicGetGenerico14()
            }

            lista.push(generico);
            contador++;
        }


        if (cicGetGenerico15()) {
            var generico = {
                id: contador,
                generico: "Genérico " + contador,
                descripcion: cicGetGenerico15()
            }

            lista.push(generico);
            contador++;
        }


        if (cicGetGenerico16()) {
            var generico = {
                id: contador,
                generico: "Genérico " + contador,
                descripcion: cicGetGenerico16()
            }

            lista.push(generico);
            contador++;
        }


        if (cicGetGenerico17()) {
            var generico = {
                id: contador,
                generico: "Genérico " + contador,
                descripcion: cicGetGenerico17()
            }

            lista.push(generico);
            contador++;
        }


        if (cicGetGenerico18()) {
            var generico = {
                id: contador,
                generico: "Genérico " + contador,
                descripcion: cicGetGenerico18()
            }

            lista.push(generico);
            contador++;
        }


        if (cicGetGenerico19()) {
            var generico = {
                id: contador,
                generico: "Genérico " + contador,
                descripcion: cicGetGenerico19()
            }

            lista.push(generico);
        }

        return lista;

    }
};