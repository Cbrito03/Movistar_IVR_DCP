var controller = {
    $this: null,
    getCliente: null,
    getProductosOferta: null,
    getProductosVenta: null,
    getDatosOferta: null,
    getDatosVenta: null,
    getLlamadaConectada: null,
    switchOffEnviadoBO: null,
    generada: false,
    onSetAtributoGrabacion: null,
    init: function (container, options) {
        this.$this = $(container.children()[0]);
        var thisController = this;

        cicTrace("Cierre - Inicio Init");

        var tabsCierre = thisController.$this.find("#tabsCierre").tabs();
        
        initializeTabsLayout(tabsCierre);

        var cmdGenerarFicha = thisController.$this.find("#cmdGenerarFicha");
        cmdGenerarFicha.click(function () {
            thisController.generarFicha.call(thisController);
        });

        var gridResumenOfertas = thisController.$this.find("#listaResumenOfertas").jqGrid({
            datatype: "local",
            autowidth: true,
            rowNum: 10000,
            editable: false,
            hidegrid: false,
            //colNames: ["Id", "N°", "Código", "Descripción", "Producto", "Precio", "cantProductos"],
			colNames: ["Id", "N°", "Código", "Descripción", "Precio", "cantProductos"],
            caption: "Ofertas",
            colModel: [ 
                { name: "id", index: "id", hidden: true, key: true },
                { name: "numero", index: "numero", width: 20, align: "center" },
                { name: "codigo", index: "codigo", width: 80 },
                { name: "descripcion", index: "descripcion", width: 300 },
                //{ name: "producto", index: "producto", width: 80, align: "center"},
                { name: "precio", index: "precio", width: 60, align: "right" },
                { name: "cantProductos", index: "cantProductos", hidden: true }
            ],
            ondblClickRow: function (rowid, iRow, iCol, e) {
                clearSelection();
            },
            onSelectRow: function (id) {
                var sel = (id != undefined);
            }
        });

        attachJQGridToContainerPanel(thisController.$this.find("#listaResumenOfertasContainer"), gridResumenOfertas);
        

        var gridResumenProductos = thisController.$this.find("#listaResumenProductos").jqGrid({
            datatype: "local",
            autowidth: true,
            rowNum: 10000,
            editable: true,
            hidegrid: false,
            colNames: ["Id", "N°", "", "", "", "Producto"],
            caption: "Productos Vendidos de Parrilla",
            colModel: [
			  { name: "id", index: "id", hidden: true, key: true },
              { name: "numero", index: "numero", width: 20, align: "center" },
              { name: "servicio", index: "servicio", width: 1, hidden: true, align: "center" },
              { name: "tipo", index: "tipo", width: 1, hidden: true, align: "center" },
              { name: "producto", index: "producto", width: 1, hidden: true, align: "center" },
              { name: "detalleProducto", index: "detalleProducto", width: 300, align: "left" }
            ],
            ondblClickRow: function (rowid, iRow, iCol, e) {
                clearSelection();
            },
            onSelectRow: function (id) {
                var sel = (id != undefined);
            }
        });
        
        attachJQGridToContainerPanel(thisController.$this.find("#listaResumenProductosContainer"), gridResumenProductos);
        
        cicTrace("Cierre - Fin Init");
    },
    refresca: function () {
        cicTrace("Cierre Inicio Refresca");
        var thisController = this;

        thisController.limpiarFicha();

        thisController.$this.find("#edReferenciaCont").text("Escribir punto de referencia para la dirección");

        thisController.$this.find("#lbPregunta1").text("Sin Pregunta 1");
        if (cicGetAccPreg1()) {
            thisController.$this.find("#lbPregunta1").text(cicGetAccPreg1());
            thisController.$this.find("#edRespuesta1").removeAttr("disabled");
        } else {
            thisController.$this.find("#edRespuesta1").attr("disabled", "disabled");
        }

        thisController.$this.find("#lbPregunta2").text("Sin Pregunta 2");
        if (cicGetAccPreg2()) {
            thisController.$this.find("#lbPregunta2").text(cicGetAccPreg2());
            thisController.$this.find("#edRespuesta2").removeAttr("disabled");
        } else {
            thisController.$this.find("#edRespuesta2").attr("disabled", "disabled");
        }

        thisController.$this.find("#edRespuesta1").val("");
        thisController.$this.find("#edRespuesta2").val("");

        cicTrace("Cierre Fin Refresca");
    },
    setActiveTabs: function (index) {
        var thisController = this;
        thisController.$this.find("#tabsCierre").tabs({ active: index });
    },
    generarFicha: function () {
        var thisController = this;

        if (!thisController.getLlamadaConectada()) {
            showMsgBoxAlert("Sólo puede generar Ficha de Cierre con el cliente conectado en línea", "Ficha Cierre");
            cicTrace("[Det-Cliente][GenerarFicha] Cliente desconectado");
            return;
        }

        //Check Datos Cliente
        var cliente = thisController.getCliente();

        if (!cliente.nombreCli) {
            showMsgBoxAlert("Debe ingresar el 'Nombre Cliente' antes de generar Ficha de Cierre", "Nombre Cliente No Ingresado");
            return;
        }
        if (!cliente.rutCli) { 
            showMsgBoxAlert("Debe ingresar el 'Rut' antes de generar Ficha de Cierre", "Rut No Ingresado");
            return null;
        }
        if (!cliente.serieCli) {
            showMsgBoxAlert("Debe ingresar el 'Número de Serie' antes de generar Ficha de Cierre", "Numero de Serie No Ingresado");
            return;
        }
        if (!cliente.calleCli) {
            showMsgBoxAlert("Debe ingresar la 'Calle' antes de generar Ficha de Cierre", "Calle No Ingresada");
            return;
        }
        if (!cliente.regionCli) {
            showMsgBoxAlert("Debe ingresar la 'Región' antes de generar Ficha de Cierre", "Región No Ingresada");
            return;
        }
        if (!cliente.comunaCli) {
            showMsgBoxAlert("Debe ingresar la 'Comuna' antes de generar Ficha de Cierre", "Comuna No Ingresada");
            return;
        }

        //Check Ciclo
        var datosOferta = thisController.getDatosOferta();
        if (datosOferta.ciclo == "") {
            showMsgBoxAlert("Debe seleccionar el 'Ciclo de Facturación' antes de generar Ficha de Cierre", "Ciclo No Ingresado");
            cicTrace("[GenerarFicha] Sin Ciclo Facturacion");
            return;
        }

        //Check Venta Productos
        var productosOferta = thisController.getProductosOferta();
        var productosVendidos = thisController.getProductosVenta();

        if (productosOferta.length + productosVendidos.length == 0) {
            showMsgBoxAlert("Debe seleccionar al menos un Producto antes de generar Ficha de Cierre", "Producto no Seleccionados");
            cicTrace("[GenerarFicha] Sin Producto Seleccionado");
            return;
        }

		/*
        if (productosOferta.length > 0) {
            var seleccionOK = true;
            $.each(productosOferta, function (i, r) {

                var numProductos = 0;
                if (r.productos.tv) numProductos++;
                if (r.productos.internet) numProductos++;
                if (r.productos.telefonia) numProductos++;
               
                if (numProductos == 0) {
                    seleccionOK = false;
                }

            });

            if (!seleccionOK) {
                alert("Para una oferta debe seleccionar al menos un Producto antes de generar Ficha de Cierre");
                cicTrace("[GenerarFicha] Sin cantidad productos seleccionados");
                return;
            }
        }
		*/

        //Carga Datos
        //Datos Cliente

        thisController.$this.find("#edNombreCli").val(cliente.nombreCli);
        thisController.$this.find("#edRutCli").val(cliente.rutCli);
        thisController.$this.find("#edSerieCli").val(cliente.serieCli);
        thisController.$this.find("#edFechaNacimientoCli").val(cliente.fechaNacimientoCli);
        thisController.$this.find("#edEmailCli").val(cliente.emailCli);
        thisController.$this.find("#edFono1Cli").val(cliente.fono1Cli);
        thisController.$this.find("#edFono2Cli").val(cliente.fono2Cli);
        thisController.$this.find("#edFono3Cli").val(cliente.fono3Cli);
        thisController.$this.find("#edCalleCli").val(cliente.calleCli);
        thisController.$this.find("#edEntreCalleCli").val(cliente.entreCalleCli);
        thisController.$this.find("#edYCalleCli").val(cliente.yCalleCli);
        thisController.$this.find("#edNumeroCli").val(cliente.numeroCli);
        thisController.$this.find("#edPisoCli").val(cliente.pisoCli);
        thisController.$this.find("#edDeptoCli").val(cliente.deptoCli);
        thisController.$this.find("#edRegionCli").val(cliente.regionCli);
        thisController.$this.find("#edComunaCli").val(cliente.comunaCli);
        thisController.$this.find("#edRegionDescCli").val(cliente.regionDescCli);
        thisController.$this.find("#edComunaDescCli").val(cliente.comunaDescCli);
        if (cliente.notificarCli) {
            thisController.$this.find("#edNotificarCli").attr("checked", true);
        } else {
            thisController.$this.find("#edNotificarCli").removeAttr("checked");
        }

        thisController.$this.find("#edNombreContacto").val(cliente.nombreCli);
        thisController.$this.find("#edCalleCont").val(cliente.calleCli);
        thisController.$this.find("#edEntreCalleCont").val(cliente.entreCalleCli);
        thisController.$this.find("#edYCalleCont").val(cliente.yCalleCli);
        thisController.$this.find("#edNumeroCont").val(cliente.numeroCli);
        thisController.$this.find("#edPisoCont").val(cliente.pisoCli);
        thisController.$this.find("#edDeptoCont").val(cliente.deptoCli);
        thisController.$this.find("#edRegionCont").val(cliente.regionCli);
        thisController.$this.find("#edComunaCont").val(cliente.comunaCli);
        thisController.$this.find("#edRegionDescContCli").val(cliente.regionDescContCli);
        thisController.$this.find("#edComunaDescContCli").val(cliente.comunaDescContCli);

        //Datos Oferta
        thisController.$this.find("#edCicloCli").val(datosOferta.ciclo);
        
        var gridResumenOfertas = thisController.$this.find("#listaResumenOfertas").jqGrid();
        gridResumenOfertas.jqGrid("clearGridData");
        if (productosOferta.length > 0) {
            $.each(productosOferta, function (i, r) {
                r.numero = i + 1;
				/*
                var append = false;
                var numProductos = 0;
                var producto = "";
                if (r.productos.tv){
                    producto = "TV";
                    numProductos++;
                    append = true;
                }
                if (r.productos.internet) {
                    producto += (append ? "-" : "");
                    producto += "INT";
                    numProductos++;
                    append = true;
                }
                if (r.productos.telefonia) {
                    producto += (append ? "-" : "");
                    producto += "TEL";
                    numProductos++;
                }
                r.producto = producto;
                r.cantProductos = numProductos;
				*/
				r.cantProductos = 1;
				
                gridResumenOfertas.jqGrid("addRowData", r.id, r);
            });
        }

        //Datos Parrilla
        var gridResumenProductos = thisController.$this.find("#listaResumenProductos").jqGrid();
        gridResumenProductos.jqGrid("clearGridData");
        if (productosVendidos.length > 0) {
            $.each(productosVendidos, function (i, r) {
                r.numero = i + 1;
                gridResumenProductos.jqGrid("addRowData", r.id, r);
            });
        }
        
        thisController.generada = true;
        thisController.switchOffEnviadoBO();
        thisController.onSetAtributoGrabacion("ATTR_RUT_CLIENTE", cliente.rutCli);

    },
    limpiarFicha: function () {
        var thisController = this;

        thisController.$this.find("#edNombreCli").val("");
        thisController.$this.find("#edRutCli").val("");
        thisController.$this.find("#edSerieCli").val("");
        thisController.$this.find("#edFechaNacimientoCli").val("");
        thisController.$this.find("#edEmailCli").val("");
        thisController.$this.find("#edFono1Cli").val("");
        thisController.$this.find("#edFono2Cli").val("");
        thisController.$this.find("#edFono3Cli").val("");
        thisController.$this.find("#edCicloCli").val("");
        thisController.$this.find("#edCalleCli").val("");
        thisController.$this.find("#edEntreCalleCli").val("");
        thisController.$this.find("#edYCalleCli").val("");
        thisController.$this.find("#edNumeroCli").val("");
        thisController.$this.find("#edPisoCli").val("");
        thisController.$this.find("#edDeptoCli").val("");
        thisController.$this.find("#edRegionCli").val("");
        thisController.$this.find("#edComunaCli").val("");
        thisController.$this.find("#edNotificarCli").removeAttr("checked");

        var gridResumenOfertas = thisController.$this.find("#listaResumenOfertas").jqGrid();
        gridResumenOfertas.jqGrid('clearGridData');

        var gridResumenProductos = thisController.$this.find("#listaResumenProductos").jqGrid();
        gridResumenProductos.jqGrid('clearGridData');

        thisController.$this.find("#edNombreContacto").val("");
        thisController.$this.find("#edCalleCont").val("");
        thisController.$this.find("#edEntreCalleCont").val("");
        thisController.$this.find("#edYCalleCont").val("");
        thisController.$this.find("#edNumeroCont").val("");
        thisController.$this.find("#edPisoCont").val("");
        thisController.$this.find("#edDeptoCont").val("");
        thisController.$this.find("#edRegionCont").val("");
        thisController.$this.find("#edComunaCont").val("");
        thisController.$this.find("#edReferenciaCont").val("");

        thisController.$this.find("#lbPregunta1").text("Pregunta 1");
        thisController.$this.find("#edRespuesta1").val("");
        thisController.$this.find("#lbPregunta2").text("Pregunta 2");
        thisController.$this.find("#edRespuesta2").val("");

        thisController.$this.find("#edTipoVentaCli").val("Seleccione");
        thisController.$this.find("#edTipoCli").val("Seleccione");

        thisController.generada = false;


    },
    getInfoCierre: function () {
        var thisController = this;
        var infoCierre = new Object();

        var infoCliente = new Object();
        infoCliente.nombre  = thisController.$this.find("#edNombreCli").val();
        infoCliente.rut  = thisController.$this.find("#edRutCli").val();
        infoCliente.serieRut  = thisController.$this.find("#edSerieCli").val();
        infoCliente.fechaNacimiento  = thisController.$this.find("#edFechaNacimientoCli").val();
        infoCliente.email  = thisController.$this.find("#edEmailCli").val();
        infoCliente.fono1  = thisController.$this.find("#edFono1Cli").val();
        infoCliente.fono2  = thisController.$this.find("#edFono2Cli").val();
        infoCliente.fono3  = thisController.$this.find("#edFono3Cli").val();
        infoCliente.ciclo = thisController.$this.find("#edCicloCli").val();
        infoCliente.calle  = thisController.$this.find("#edCalleCli").val();
        infoCliente.entreCalle  = thisController.$this.find("#edEntreCalleCli").val();
        infoCliente.yCalle  = thisController.$this.find("#edYCalleCli").val();
        infoCliente.numero  = thisController.$this.find("#edNumeroCli").val();
        infoCliente.piso  = thisController.$this.find("#edPisoCli").val();
        infoCliente.depto  = thisController.$this.find("#edDeptoCli").val();
        infoCliente.region = thisController.$this.find("#edRegionCli").val();
        infoCliente.comuna = thisController.$this.find("#edComunaCli").val();
        var tipoCliente = thisController.$this.find("#edTipoCli option:selected").text();
        infoCliente.tipoCliente = (tipoCliente == "Seleccione" ? "" : tipoCliente);
        var tipoVenta = thisController.$this.find("#edTipoVentaCli option:selected").text();
        infoCliente.tipoVenta = (tipoVenta == "Seleccione" ? "" : tipoVenta);
        infoCliente.notificar = thisController.$this.find("#edNotificarCli").is(':checked') ? "1": "0";

        infoCierre.infoCliente = infoCliente;

        var infoDespacho = new Object();
        infoDespacho.nombre = thisController.$this.find("#edNombreContacto").val();
        infoDespacho.calle = thisController.$this.find("#edCalleCont").val();
        infoDespacho.entreCalle = thisController.$this.find("#edEntreCalleCont").val();
        infoDespacho.yCalle = thisController.$this.find("#edYCalleCont").val();
        infoDespacho.numero = thisController.$this.find("#edNumeroCont").val();
        infoDespacho.piso = thisController.$this.find("#edPisoCont").val();
        infoDespacho.depto = thisController.$this.find("#edDeptoCont").val();
        infoDespacho.region = thisController.$this.find("#edRegionCont").val();
        infoDespacho.comuna = thisController.$this.find("#edComunaCont").val();
        infoDespacho.referencia = thisController.$this.find("#edReferenciaCont").val();

        infoCierre.infoDespacho = infoDespacho;


        var gridResumenOfertas = thisController.$this.find("#listaResumenOfertas").jqGrid();
        var productosResumenOferta = gridResumenOfertas.jqGrid('getRowData');
        
        infoCierre.infoOfertas = productosResumenOferta;
        
        var gridResumenProductos = thisController.$this.find("#listaResumenProductos").jqGrid();
        var productosResumenParrilla = gridResumenProductos.jqGrid('getRowData');

        infoCierre.infoVentaParrillas = productosResumenParrilla;

        var infoRespuestas = new Object();
        infoRespuestas.resp1 = thisController.$this.find("#edRespuesta1").val();
        infoRespuestas.resp2 = thisController.$this.find("#edRespuesta2").val();

        infoCierre.infoRespuestas = infoRespuestas;

        return infoCierre;

    },
    getRutCliente: function () {
        return this.$this.find("#edRutCli").val();
    }
};