var controller = {
    $this: null,
    getCliente: null,
    getProductosOferta: null,
    getProductosVenta: null,
    getProductosAccesos: null,
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
        var tabsProductos = thisController.$this.find("#detalleProducto").tabs();

        initializeTabsLayout(tabsCierre);
        initializeTabsLayout(tabsProductos);

        var cmdGenerarFicha = thisController.$this.find("#cmdGenerarFicha");
        cmdGenerarFicha.click(function () {
            thisController.generarFicha.call(thisController);
        });

        var gridResumenOfertas = thisController.$this.find("#listaResumenOfertas").jqGrid({
            datatype: "local",
            autowidth: true,
            rowNum: 5,
            editable: false,
            hidegrid: false,
            colNames: ["Id", "N°", "Código", "Descripción", "Precio", "cantProductos"],
            caption: "Ofertas",
            colModel: [
                { name: "id", index: "id", hidden: true, key: true },
                { name: "numero", index: "numero", width: 20, align: "center" },
                { name: "codigo", index: "codigo", width: 80 },
                { name: "descripcion", index: "descripcion", width: 300 },
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


        var gridResumenProductosFijo = thisController.$this.find("#listaResumenProductosFijo").jqGrid({
            datatype: "local",
            autowidth: true,
            rowNum: 10000,
            editable: true,
            hidegrid: false,
            colNames: ["id", "", "N°", "Producto"],
            caption: "Productos Vendidos de Parrilla Fijo",
            colModel: [
			    { name: "id", index: "id", hidden: true, key: true },
                { name: "producto", index: "producto", hidden: true },
                { name: "numero", index: "numero", width: 20, align: "center" },
			    { name: "detalleProducto", index: "detalleProducto", width: 300 }
            ],
            ondblClickRow: function (rowid, iRow, iCol, e) {
                clearSelection();
            },
            onSelectRow: function (id) {
                var sel = (id != undefined);
            }
        });

        attachJQGridToContainerPanel(thisController.$this.find("#listaResumenProductosFijoContainer"), gridResumenProductosFijo);

        var gridResumenProductosMovil = thisController.$this.find("#listaResumenProductosMovil").jqGrid({
            datatype: "local",
            autowidth: true,
            rowNum: 10000,
            editable: true,
            hidegrid: false,
            colNames: ["Id", "N°", "", "Producto", "Ciclo Fact.", "Tipo de Venta", "Fono a Portar", "Empresa", "Modo de Pago", "Cuotas", "Seguro"],
            caption: "Productos Vendidos de Parrilla Móvil",
            colModel: [
			  { name: "id", index: "id", hidden: true, key: true },
              { name: "numero", index: "numero", width: 20, align: "center" },
              { name: "idProducto", index: "idProducto", width: 1, hidden: true, align: "center" },
              { name: "descPlan", index: "descPlan", width: 300, align: "left" },
              { name: "cicloFacturacion", index: "cicloFacturacion", align: "center", width: 60 },
              { name: "TipoVenta", index: "TipoVenta", align: "center", width: 120 },
              { name: "fonoAPortar", index: "fonoAPortar", align: "center", width: 80 },
              { name: "OperadorDonante", index: "OperadorDonante", align: "center", width: 120 },
              { name: "modoPago", index: "modoPago", align: "center", width: 80 },
              { name: "cuota", index: "cuota", align: "center", width: 80 },
              { name: "ContratoSeguro", index: "ContratoSeguros", width: 40, align: "center", formatter: checkFormatter, unformat: checkUnformatter }
            ],
            ondblClickRow: function (rowid, iRow, iCol, e) {
                clearSelection();
            },
            onSelectRow: function (id) {
                var sel = (id != undefined);
            }
        });

        function checkFormatter(cellvalue, options, rowObject) {
            var html = "<div>";
            html += "<input id='edCheckSeguro" + options.rowId + "' type='checkbox' disabled='disabled' " + (cellvalue ? "checked='checked'" : "") + "></input>";
            html += "</div>";
            return html;
        }

        function checkUnformatter(cellvalue, options, cell) {
            return thisController.$this.find('#edCheckSeguro' + options.rowId).is(':checked');
        }

        attachJQGridToContainerPanel(thisController.$this.find("#listaResumenProductosMovilContainer"), gridResumenProductosMovil);

        var gridResumenProductosSva = thisController.$this.find("#listaResumenProductosSva").jqGrid({
            datatype: "local",
            autowidth: true,
            rowNum: 10000,
            editable: true,
            hidegrid: false,
            colNames: ["id", "", "N°", "Producto"],
            caption: "Productos Vendidos de Parrilla SVA",
            colModel: [
			    { name: "id", index: "id", hidden: true, key: true },
                { name: "producto", index: "producto", hidden: true },
                { name: "numero", index: "numero", width: 20, align: "center" },
			    { name: "detalleProducto", index: "detalleProducto", width: 300 }
            ],
            ondblClickRow: function (rowid, iRow, iCol, e) {
                clearSelection();
            },
            onSelectRow: function (id) {
                var sel = (id != undefined);
            }
        });

        attachJQGridToContainerPanel(thisController.$this.find("#listaResumenProductosSvaContainer"), gridResumenProductosSva);

        thisController.$this.find('input[type=radio][name=DL]').change(function () {
            if (this.value == 'OL') {
                thisController.$this.find("#edSucursal").val("Seleccione");
                thisController.$this.find("#edSucursal").attr("disabled", "disabled");
            }
            else if (this.value == 'MC') {
                thisController.$this.find("#edSucursal").removeAttr("disabled");
            }
        });

        thisController.$this.find("#edSiglo").change(function (event) {
            thisController.$this.find("#edIVRSiglo").removeAttr("disabled");
            thisController.$this.find("#edEjecutivoSiglo").removeAttr("disabled");
            thisController.$this.find("#edIDivrsiglo").removeAttr("disabled");
            thisController.$this.find("#edIDejecutivosiglo").removeAttr("disabled");

        });

        thisController.$this.find("#edEjecutivoSiglo").change(function (event) {
            thisController.$this.find("#edIDivrsiglo").val("");
            thisController.$this.find("#edIDivrsiglo").prop('disabled', true);

            thisController.$this.find("#edIDejecutivosiglo").prop('disabled', false);
        });

        thisController.$this.find("#edIVRSiglo").change(function (event) {
            thisController.$this.find("#edIDejecutivosiglo").val("");
            thisController.$this.find("#edIDejecutivosiglo").prop('disabled', true);

            thisController.$this.find("#edIDivrsiglo").prop('disabled', false);
        });


        thisController.$this.find("#edSMSUnifica").change(function (event) {

            thisController.$this.find("#edIVRSiglo").attr("disabled", "disabled");
            thisController.$this.find("#edEjecutivoSiglo").attr("disabled", "disabled");
            thisController.$this.find("#edIDivrsiglo").attr("disabled", "disabled");
            thisController.$this.find("#edIDejecutivosiglo").attr("disabled", "disabled");
            thisController.$this.find("#edIDConfirm").attr("disabled", "disabled");

            thisController.$this.find("#edIDivrsiglo").val("");
            thisController.$this.find("#edIDejecutivosiglo").val("");
            thisController.$this.find("#edIVRSiglo").removeAttr("checked");
            thisController.$this.find("#edEjecutivoSiglo").removeAttr("checked");          
            
        });


        cicTrace("Cierre - Fin Init");
    },
    refresca: function () {
        cicTrace("Cierre Inicio Refresca");
        var thisController = this;
        
        thisController.limpiarFicha();
        thisController.$this.find("#divCertificacion").show();
        thisController.$this.find("#divUnifica").show();
        var familia = cicGetCallFamiliaId();

        thisController.$this.find("#edSiglo").removeAttr('checked');
        thisController.$this.find("#edSMSUnifica").removeAttr('checked');
        thisController.$this.find("#edIVRSiglo").removeAttr('checked');
        thisController.$this.find("#edEjecutivoSiglo").removeAttr('checked');
        thisController.$this.find("#edIDivrsiglo").val('');
        thisController.$this.find("#edIDejecutivosiglo").val('');
        thisController.$this.find("#edIDivrsiglo").prop('disabled', true);
        thisController.$this.find("#edIDejecutivosiglo").prop('disabled', true);
        

        if (familia == 'Svld') {
            thisController.$this.find("#divCertificacion").hide();
        } else if (familia == 'Svm') {
            thisController.$this.find("#divCertificacion").show();
            thisController.$this.find("#divUnifica").show();
        } else if (familia == 'Svf') {
            thisController.$this.find("#divUnifica").hide();
        } else {
            thisController.$this.find("#divCertificacion").show();
            thisController.$this.find("#divUnifica").show();
        }

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
    loadWSData: function () {
        var thisController = this;
        thisController.refrescaDetallePreventa();
    },
    refrescaDetallePreventa: function () {
        var thisController = this;
        cicTrace("GetDetPreventa: Movil - Sucursales");
        var parametros = {
            etiqueta: "SUC",
            familia: "M"
        };
        
        httpInvoke("GetDetPreventa.ges", { param: parametros }, function (list) {
            var html = "<option value='Seleccione'>Seleccione</option>";
            
            $.each(list, function (i, r) {
                
                html += "<option value='" + r.ID_TIPO_DET_PREVENTA + "'>" + r.VALOR + "</option>";
            });

            thisController.$this.find("#edSucursal").html(html);

            app.callBackFinishLoad();
        }, null, true);
    },
    setActiveTabs: function (index) {
        var thisController = this;
        thisController.$this.find("#tabsCierre").tabs({ active: 1 });
        thisController.$this.find("#detalleProducto").tabs({ active: 0 })
        thisController.$this.find("#tabsCierre").tabs({ active: index });
    },
    generarFicha: function () {
        var thisController = this;

        if (!thisController.getLlamadaConectada()) {
            showMsgBoxAlert("No puede generar cambios en la Preventa una vez que el cliente desconectó la llamada");
            cicTrace("[Det-Cliente][GenerarFicha] Cliente desconectado");
            return;
        }

        //Check Datos Cliente
        var cliente = thisController.getCliente();

        if (!cliente.nombreCli) {
            showMsgBoxAlert("Debe ingresar el 'Nombre Cliente' antes de generar Ficha de Cierre");
            return;
        }
        if (!cliente.rutCli) {
            showMsgBoxAlert("Debe ingresar el 'Rut' antes de generar Ficha de Cierre");
            return null;
        }
        if (!cliente.calleCli) {
            showMsgBoxAlert("Debe ingresar la 'Calle' antes de generar Ficha de Cierre");
            return;
        }
        if (!cliente.regionCli) {
            showMsgBoxAlert("Debe ingresar la 'Región' antes de generar Ficha de Cierre");
            return;
        }
        if (!cliente.comunaCli) {
            showMsgBoxAlert("Debe ingresar la 'Comuna' antes de generar Ficha de Cierre");
            return;
        }

        //Check Ciclo
        var datosOferta = thisController.getDatosOferta();
        /*
        if (datosOferta.ciclo == "") {
            alert("Debe seleccionar el Ciclo de Facturación antes de generar Ficha de Cierre");
            cicTrace("[GenerarFicha] Sin Ciclo Facturacion");
            return;
        }
        */
        //Check Venta Productos
        var productosOferta = thisController.getProductosOferta();
        var productosVendidos = thisController.getProductosVenta();
        var productosAccesos = thisController.getProductosAccesos();

        if ((productosOferta.length + productosVendidos.length + productosAccesos.infoFijo.productosVenta.length + productosAccesos.infoMovil.productosVenta.length) == 0) {
            showMsgBoxAlert("Debe seleccionar al menos un Producto antes de generar Ficha de Cierre");
            cicTrace("[GenerarFicha] Sin Producto Seleccionado");
            return;
        }

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
	
        thisController.$this.find("#edNombrePagadorCli").val(cliente.nombrePagador);
        thisController.$this.find("#edRutPagadorCli").val(cliente.rutPagador);


        if (cliente.notificarCli) {
            thisController.$this.find("#edNotificarCli").attr("checked", true);
        } else {
            thisController.$this.find("#edNotificarCli").removeAttr("checked");
        }

        //Datos Oferta
        thisController.$this.find("#edCicloCli").val(datosOferta.ciclo);

        var gridResumenOfertas = thisController.$this.find("#listaResumenOfertas").jqGrid();
        gridResumenOfertas.jqGrid("clearGridData");
        if (productosOferta.length > 0) {
            $.each(productosOferta, function (i, r) {
                r.numero = i + 1;
                r.cantProductos = 1;
                gridResumenOfertas.jqGrid("addRowData", r.id, r);
            });
        }

        //Datos Parrilla
        var datosVenta = thisController.getDatosVenta();

        thisController.$this.find("#edObsVentaSva").val(datosVenta.obs);

        var gridResumenProductosSva = thisController.$this.find("#listaResumenProductosSva").jqGrid();
        gridResumenProductosSva.jqGrid("clearGridData");
        if (productosVendidos.length > 0) {
            $.each(productosVendidos, function (i, r) {
                r.numero = i + 1;
                gridResumenProductosSva.jqGrid("addRowData", r.id, r);
            });
        }

        var gridResumenProductosFijo = thisController.$this.find("#listaResumenProductosFijo").jqGrid();
        gridResumenProductosFijo.jqGrid("clearGridData");
        if (productosAccesos.infoFijo.productosVenta.length > 0) {
            $.each(productosAccesos.infoFijo.productosVenta, function (i, r) {
                r.numero = i + 1;
                gridResumenProductosFijo.jqGrid("addRowData", r.id, r);
            });
        }

        var gridResumenProductosMovil = thisController.$this.find("#listaResumenProductosMovil").jqGrid();
        gridResumenProductosMovil.jqGrid("clearGridData");
        if (productosAccesos.infoMovil.productosVenta.length > 0) {
            $.each(productosAccesos.infoMovil.productosVenta, function (i, r) {
                r.numero = i + 1;
                gridResumenProductosMovil.jqGrid("addRowData", r.id, r);
            });
        }

        if (productosAccesos.infoMovil.productosVenta.length > 0) {
            thisController.$this.find('input:radio[name="DL"]').removeAttr('disabled');
        } else {
         
            thisController.$this.find("input:radio[name=DL]").removeAttr('checked');

            thisController.$this.find("#edSucursal").val("Seleccione");
            thisController.$this.find("#edSucursal").attr("disabled", "disabled");

            thisController.$this.find('input:radio[name="DL"]').attr('disabled', 'disabled');
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
        thisController.$this.find("#edUnifica").val("");

        var gridResumenOfertas = thisController.$this.find("#listaResumenOfertas").jqGrid();
        gridResumenOfertas.jqGrid('clearGridData');

        thisController.$this.find("input:radio[name=DL]").removeAttr('checked');

        thisController.$this.find("#edSucursal").val("Seleccione");
        thisController.$this.find("#edSucursal").attr("disabled", "disabled");
        thisController.$this.find("input:radio[name=DL]").attr("disabled", "disabled");

        var gridResumenProductosFijos = thisController.$this.find("#listaResumenProductosFijo").jqGrid();
        gridResumenProductosFijos.jqGrid('clearGridData');
        var gridResumenProductosMovil = thisController.$this.find("#listaResumenProductosMovil").jqGrid();
        gridResumenProductosMovil.jqGrid('clearGridData');
        var gridResumenProductosSva = thisController.$this.find("#listaResumenProductosSva").jqGrid();
        gridResumenProductosSva.jqGrid('clearGridData');
        thisController.$this.find("#edObsVentaSva").val("");

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
        infoCliente.nombre = thisController.$this.find("#edNombreCli").val();
        infoCliente.rut = thisController.$this.find("#edRutCli").val();
        infoCliente.serieRut = thisController.$this.find("#edSerieCli").val();
        infoCliente.fechaNacimiento = thisController.$this.find("#edFechaNacimientoCli").val();
        infoCliente.email = thisController.$this.find("#edEmailCli").val();
        infoCliente.fono1 = thisController.$this.find("#edFono1Cli").val();
        infoCliente.fono2 = thisController.$this.find("#edFono2Cli").val();
        infoCliente.fono3 = thisController.$this.find("#edFono3Cli").val();
        infoCliente.ciclo = thisController.$this.find("#edCicloCli").val();
        infoCliente.tipoCliente = thisController.$this.find("#edTipoCli").val() == "Seleccione" ? "" : thisController.$this.find("#edTipoCli").val();
        infoCliente.tipoVenta = thisController.$this.find("#edTipoVentaCli").val() == "Seleccione" ? "" : thisController.$this.find("#edTipoVentaCli").val();
        infoCliente.calle = thisController.$this.find("#edCalleCli").val();
        infoCliente.entreCalle = thisController.$this.find("#edEntreCalleCli").val();
        infoCliente.yCalle = thisController.$this.find("#edYCalleCli").val();
        infoCliente.numero = thisController.$this.find("#edNumeroCli").val();
        infoCliente.piso = thisController.$this.find("#edPisoCli").val();
        infoCliente.depto = thisController.$this.find("#edDeptoCli").val();
        infoCliente.region = thisController.$this.find("#edRegionCli").val();
        infoCliente.comuna = thisController.$this.find("#edComunaCli").val();
        infoCliente.notificar = thisController.$this.find("#edNotificarCli").is(':checked') ? "1" : "0";
        infoCliente.folioUnifica = thisController.$this.find("#edUnifica").val();
        //pagador
        infoCliente.nombrepagador = thisController.$this.find("#edNombrePagadorCli").val();
        infoCliente.rutpagador = thisController.$this.find("#edRutPagadorCli").val();

        //certificacion
        /*SIGLO*/
        infoCliente.certifSiglo = thisController.$this.find("#edSiglo").is(':checked') ? "1" : "0";
        if (infoCliente.certifSiglo == 1) {
            infoCliente.certifSigloIVR = thisController.$this.find("#edIVRSiglo").is(':checked') ? "1" : "0";
            infoCliente.IDSigloIVR = thisController.$this.find("#edIDivrsiglo").val();
            infoCliente.certifSigloEjecutivo = thisController.$this.find("#edEjecutivoSiglo").is(':checked') ? "1" : "0";
            infoCliente.IDSigloEjecutivo = thisController.$this.find("#edIDejecutivosiglo").val();
        }

        /*SMS UNIFICA*/
        infoCliente.certifSMSUnifica = thisController.$this.find("#edSMSUnifica").is(':checked') ? "1" : "0";

        infoCierre.infoCliente = infoCliente;

        var gridResumenOfertas = thisController.$this.find("#listaResumenOfertas").jqGrid();
        var productosResumenOferta = gridResumenOfertas.jqGrid('getRowData');

        infoCierre.infoOfertas = productosResumenOferta;

        var infoVentaParrillas = new Object();

        var gridProductosFijo = thisController.$this.find("#listaResumenProductosFijo").jqGrid();
        infoVentaParrillas.ventasFijo = gridProductosFijo.jqGrid('getRowData');

        var gridProductosMovil = thisController.$this.find("#listaResumenProductosMovil").jqGrid();
        infoVentaParrillas.ventasMovil = gridProductosMovil.jqGrid('getRowData');

        if (infoVentaParrillas.ventasMovil.length > 0) {
            var datosMovil = new Object();
            datosMovil.destinoLogistico = thisController.$this.find("input:radio[name=DL]:checked").val();
            if (datosMovil.destinoLogistico == "MC") {
                var sucursal = thisController.$this.find("#edSucursal option:selected").text();
                datosMovil.sucursal = sucursal == "Seleccione" ? "" : sucursal;
            } else {
                datosMovil.sucursal = "";
            }

            infoVentaParrillas.datosMovil = datosMovil;
        }

        var gridProductosSva = thisController.$this.find("#listaResumenProductosSva").jqGrid();
        infoVentaParrillas.ventasSva = gridProductosSva.jqGrid('getRowData');

        if (infoVentaParrillas.ventasSva.length > 0) {
            var datosSVA = new Object();
            datosSVA.obs = thisController.$this.find("#edObsVentaSva").val()
            infoVentaParrillas.datosSVA = datosSVA;
        }

        infoCierre.infoVentaParrillas = infoVentaParrillas;

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