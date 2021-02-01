var controller = {
    $this: null,
    init: function (container, options) {
        this.$this = $(container.children()[0]);

        var thisController = this;
        cicTrace("Detalle Oferta - Inicio Init");

        var gridOferta = thisController.$this.find("#listaOfertas").jqGrid({
            datatype: "local",
            autowidth: true,
            rowNum: 5,
            editable: true,
            hidegrid: false,
            //colNames: ["Id", "", "Código", "Descripción", "Productos", "Precio", "Delta", "enabled"],
			colNames: ["Id", "", "Código", "Descripción", "Precio", "Delta", "enabled"],
            caption: "Ofertas ",
            colModel: [
			  { name: "id", index: "id", hidden: true, key: true },
              { name: "check", index: "check", width: 20, align: "center", formatter: checkFormatter, unformat: checkUnformatter },
              { name: "codigo", index: "codigo", width: 150 },
			  { name: "descripcion", index: "descripcion", width: 400 },
			  //{ name: "productos", index: "productos", width: 200, align: "center", formatter: productosFormatter, unformat: productosUnformatter },
              { name: "precio", index: "precio", width: 100, align: "right" },
              { name: "delta", index: "delta", width: 100, align: "right" },
              { name: "enabled", index: "enabled", hidden: true }
            ],
            ondblClickRow: function (rowid, iRow, iCol, e) {
                clearSelection();
            },
            onSelectRow: function (id) {
                var sel = (id != undefined);
            }
        });

        function productosFormatter(cellvalue, options, rowObject) {
            var html = "<div>";
            html += "<input id='edTV" + options.rowId + "' type='checkbox' " + (rowObject.enabled ? "" : "disabled='disabled'") + (cellvalue.tv ? "checked='checked'" : "") + ">TV</input>";
            html += "&nbsp&nbsp&nbsp";
            html += "<input id='edInternet" + options.rowId + "' type='checkbox' " + (rowObject.enabled ? "" : "disabled='disabled'") + (cellvalue.internet ? "checked='checked'" : "") + ">Internet</input>";
            html += "&nbsp&nbsp&nbsp";
            html += "<input id='edTelefonia" + options.rowId + "' type='checkbox' " + (rowObject.enabled ? "" : "disabled='disabled'") + (cellvalue.telefonia ? "checked='checked'" : "") + ">Telefonía</input>";
            html += "</div>";
            return html;
        }

        function productosUnformatter(cellvalue, options, cell) {
            var ret = {
                tv: $('#edTV' + options.rowId).is(':checked'),
                internet: $('#edInternet' + options.rowId).is(':checked'),
                telefonia: $('#edTelefonia' + options.rowId).is(':checked')
            }
            return ret;
        }

        function checkFormatter(cellvalue, options, rowObject) {
            var html = "<div>";
            html += "<input id='edCheck" + options.rowId + "' type='checkbox' " + (rowObject.enabled ? "" : "disabled='disabled'") + (cellvalue ? "checked='checked'" : "") + "></input>";
            html += "</div>";
            return html;
        }

        function checkUnformatter(cellvalue, options, cell) {
            return $('#edCheck' + options.rowId).is(':checked');
        }
        attachJQGridToContainerPanel(thisController.$this.find("#listaOfertasContainer"), gridOferta);

        var gridArgumentario = thisController.$this.find("#listaArgumentarios").jqGrid({
            datatype: "local",
            autowidth: true,
            rowNum: 3,
            editable: true,
            hidegrid: false,
            colNames: ["Id", "", "Descripción"],
            caption: "Argumentarios ",
            colModel: [
			  { name: "id", index: "id", hidden: true, key: true },
              { name: "argumentario", index: "argumentario", width: 150 },
			  { name: "descripcion", index: "descripcion", width: 400 }
            ],
            ondblClickRow: function (rowid, iRow, iCol, e) {
                clearSelection();
            },
            onSelectRow: function (id) {
                var sel = (id != undefined);
            }
        });
        attachJQGridToContainerPanel(thisController.$this.find("#listaArgumentariosContainer"), gridArgumentario);

        cicTrace("Detalle Oferta - Fin Init");

    },
    refresca: function () {
        var thisController = this;
        cicTrace("Oferta Inicio Refresca");
        thisController.$this.find("#edAntiguedadLinea").val(cicGetCliLineaAntiguedad());
        thisController.$this.find("#edAntiguedadCliente").val(cicGetCliAntiguedad());
        thisController.$this.find("#edCicloFacturacion").val(cicGetCliCicloCod());
        thisController.$this.find("#edProductoDetalle").val(cicGetProdVigDesc());
        thisController.$this.find("#edPrecioActual").val(cicGetProdVigPrecio());
        thisController.$this.find("#edUltimaBoleta").val(cicGetCliUltBoletaMonto);
        thisController.$this.find("#edSegmento").val(cicGetCliSegmento());
        thisController.$this.find("#edGSE").val(cicGetCliGse());
        thisController.$this.find("#edPortabilidad").val(cicGetCliIndPortado());
        thisController.$this.find("#edFinPromcionActual").val(cicGetProdVigFinPromo());
        
        if (cicGetCliCicloCod()) thisController.$this.find("#edCicloFacturacion").val(cicGetCliCicloCod());
        else thisController.$this.find("#edCicloFacturacion").val("Seleccione");

        var listaOfertas = thisController.loadInfoOfertas();
        var gridOfertas = thisController.$this.find("#listaOfertas").jqGrid();
        gridOfertas.jqGrid("clearGridData");
        if (listaOfertas.length > 0) {
            $.each(listaOfertas, function (i, r) {
                gridOfertas.jqGrid("addRowData", r.id, r);
            });
        }

        var listaArgumentarios = thisController.loadInfoArgumentarios();
        var gridArgumentarios = thisController.$this.find("#listaArgumentarios").jqGrid();
        gridArgumentarios.jqGrid("clearGridData");
        if (listaArgumentarios.length > 0) {
            $.each(listaArgumentarios, function (i, r) {
                gridArgumentarios.jqGrid("addRowData", r.id, r);
            });
        }


        cicTrace("Oferta Fin Refresca");
    },
    getProductosOferta: function () {
        var thisController = this;
        var productosOferta = new Array();
        var gridOfertas = thisController.$this.find("#listaOfertas").jqGrid();

        var todasLasFilas = gridOfertas.jqGrid('getRowData');
        $.each(todasLasFilas, function (i, r) {
            if (r.check) productosOferta.push(r);
        });

        return productosOferta;
    },
    getDatosOferta: function () {
        var thisController = this;
        var datosOferta = new Object();

        datosOferta.ciclo = thisController.$this.find("#edCicloFacturacion").val() != "Seleccione" ? thisController.$this.find("#edCicloFacturacion").val() : "";

        return datosOferta;
    },
    loadInfoArgumentarios:function() {

        var lista = new Array();

        var contador = 1;

        if (cicGetAccArg1Id()) {
            var arg = {
                id: contador,
                argumentario: "Argumentario " + contador,
                descripcion: cicGetAccArg1Id()
            }

            lista.push(arg);
        }
        contador++;

        if (cicGetAccArg2Id()) {
            var arg = {
                id: contador,
                argumentario: "Argumentario " + contador,
                descripcion: cicGetAccArg2Id()
            }

            lista.push(arg);
        }
        contador++;

        if (cicGetAccArg3Id()) {
            var arg = {
                id: contador,
                argumentario: "Argumentario " + contador,
                descripcion: cicGetAccArg3Id()
            }

            lista.push(arg);
        }

    
        return lista;
    },
    loadInfoOfertas: function() {

        var listaOfertas = new Array();
       
        var contador = 1;
        

        var enabled = cicGetOferP1Cod() != "" || cicGetOferP1Desc() != "";
            

        var oferta = {
            id: contador,
            check: false,
            codigo: cicGetOferP1Cod(),
            descripcion: cicGetOferP1Desc(),
            //productos: { tv: false, internet: false, telefonia: false },
            precio: cicGetOferP1Precio(),
            delta: cicGetOferP1Delta(),
            enabled: enabled
        }

        listaOfertas[contador - 1] = oferta;
        contador++;
        var enabled = cicGetOferP2Cod() != "" || cicGetOferP2Desc() != "";

        var oferta = {
            id: contador,
            check: false,
            codigo: cicGetOferP2Cod(),
            descripcion: cicGetOferP2Desc(),
            //productos: { tv: false, internet: false, telefonia: false },
            precio: cicGetOferP2Precio(),
            delta: cicGetOferP2Delta(),
            enabled: enabled
        }

        listaOfertas[contador - 1] = oferta;
        contador++;
        var enabled = cicGetOferP3Cod() != "" || cicGetOferP3Desc() != "";

        var oferta = {
            id: contador,
            check: false,
            codigo: cicGetOferP3Cod(),
            descripcion: cicGetOferP3Desc(),
            //productos: { tv: false, internet: false, telefonia: false },
            precio: cicGetOferP3Precio(),
            delta: cicGetOferP3Delta(),
            enabled: enabled
        }

        listaOfertas[contador - 1] = oferta;
        contador++;
        var enabled = cicGetOferP4Cod() != "" || cicGetOferP4Desc() != "";

        var oferta = {
            id: contador,
            check: false,
            codigo: cicGetOferP4Cod(),
            descripcion: cicGetOferP4Desc(),
            //productos: { tv: false, internet: false, telefonia: false },
            precio: cicGetOferP4Precio(),
            delta: cicGetOferP4Delta(),
            enabled: enabled
        }

        listaOfertas[contador - 1] = oferta;
        contador++;
        var enabled = cicGetOferP5Cod() != "" || cicGetOferP5Desc() != "";

        var oferta = {
            id: contador,
            check: false,
            codigo: cicGetOferP5Cod(),
            descripcion: cicGetOferP5Desc(),
            //productos: { tv: false, internet: false, telefonia: false },
            precio: cicGetOferP5Precio(),
            delta: cicGetOferP5Delta(),
            enabled: enabled
        }

        listaOfertas[contador - 1] = oferta;
        contador++;

        return listaOfertas;

    },
    loadWSData: function () {
        var thisController = this;
        
        thisController.refrescaDetallePreventa("CF", "F", "edCicloFacturacion");

    },
    refrescaDetallePreventa: function (etiqueta, familia, combo) {
        var thisController = this;
        cicTrace("GetDetPreventa: '" + etiqueta + "' - '" + familia + "'");
        var parametros = {
            etiqueta: etiqueta,
            familia: familia
        };
        httpInvoke("GetDetPreventa.ges", { param: parametros }, function (list) {
            var html = "<option value='Seleccione'>Seleccione</option>";
            $.each(list, function (i, r) {
                html += "<option value='" + r.VALOR + "'>" + r.VALOR + "</option>";
            });
            thisController.$this.find("#" + combo).html(html);

            app.callBackFinishLoad();

        }, null, true);
    }
};