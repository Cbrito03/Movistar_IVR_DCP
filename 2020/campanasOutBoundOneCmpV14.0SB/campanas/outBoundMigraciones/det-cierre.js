var controller = {
    $this: null,
    getCliente: null,
    getProductosOferta: null,
    getProductosVenta: null,
    getDatosOferta: null,
    getDatosVenta: null,
    getLlamadaConectada: null,
    onSwitchOffEnviadoBO: null,
    generada: false,
    onSetAtributoGrabacion: null,
    init: function (container, options) {
        this.$this = $(container.children()[0]);
        var thisController = this;

        cicTrace("Cierre - Inicio Init");

        var tabsCierre = thisController.$this.find("#tabsCierre").tabs();
       
        initializeTabsLayout(tabsCierre);

        thisController.$this.find("#tabFichaRespaldoHide").hide();

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
        
        thisController.$this.find("#edSiglo").change(function (event) {
            thisController.$this.find("#edIVRSiglo").removeAttr("disabled");
            thisController.$this.find("#edEjecutivoSiglo").removeAttr("disabled");
            //thisController.$this.find("#edIDivrsiglo").removeAttr("disabled");
            //thisController.$this.find("#edIDejecutivosiglo").removeAttr("disabled");

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


        var gridResumenProductos = thisController.$this.find("#listaResumenProductos").jqGrid({
            datatype: "local",
            autowidth: true,
            rowNum: 10000,
            editable: true,
            hidegrid: false,
            colNames: ["id", "", "Producto"],
            caption: "Productos Vendidos de Parrilla",
            colModel: [
			 { name: "id", index: "id", hidden: true, key: true },
              { name: "producto", index: "producto", hidden: true },
			  { name: "detalleProducto", index: "detalleProducto", width: 300 }
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
    refresca: function (infoCierre) {
        cicTrace("Cierre Inicio Refresca");
        var thisController = this;

        if (!infoCierre) {
            thisController.limpiarFicha();
        } else {
            thisController.loadFicha(infoCierre);
            thisController.onSwitchEnviadoBO(true);
        }

        cicTrace("Cierre Fin Refresca");
    },
    setActiveTabs: function (index) {
        var thisController = this;
        thisController.$this.find("#tabsCierre").tabs({ active: index });
    },
    generarFicha: function () {
        var thisController = this;

        if (!thisController.getLlamadaConectada()) {
            showMsgBoxAlert("No puede generar cambios en la Preventa una vez que el cliente desconectó la llamada", "Validacón Preventa");
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
            showMsgBoxAlert("Debe ingresar el 'Número de Serie' antes de generar Ficha de Cierre", "Número No Ingresado");
            return;
        }
        if (!cliente.fechaNacimientoCli) {
            showMsgBoxAlert("Debe ingresar la 'Fecha de Nacimiento' antes de generar Ficha de Cierre", "Fecha de Nacimiento No Ingresado");
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
            showMsgBoxAlert("Debe seleccionar el Ciclo de Facturación antes de generar Ficha de Cierre", "Ciclo De Facturacón No Ingresada");
            cicTrace("[GenerarFicha] Sin Ciclo Facturacion");
            return;
        }

        //Check Venta Productos
        var productosOferta = thisController.getProductosOferta();
        var productosVendidos = thisController.getProductosVenta();

        if (productosOferta.length + productosVendidos.length == 0) {
            showMsgBoxAlert("Debe seleccionar al menos una Producto antes de generar Ficha de Cierre", "Producto No Seleccionado");
            cicTrace("[GenerarFicha] Sin Producto Seleccionado");
            return;
        }

        //Carga Datos
        if (cliente.checkClienteRespaldo) {
            if (!cliente.nombreCliResp) {
                showMsgBoxAlert("Debe ingresar el 'Nombre Cliente' de cliente de respaldo antes de generar Ficha de Cierre", "Cliente No Ingresado");
                return;
            }
            if (!cliente.rutCliResp) {
                showMsgBoxAlert("Debe ingresar el 'Rut' de cliente de respaldo antes de generar Ficha de Cierre", "Rut No Ingresado");
                return null;
            }
            if (!cliente.serieCliResp) {
                showMsgBoxAlert("Debe ingresar el 'Número de Serie' de cliente de respaldo antes de generar Ficha de Cierre", "Numero de Serie No Ingresado");
                return;
            }
            if (!cliente.calleCliResp) {
                showMsgBoxAlert("Debe ingresar la 'Calle' de cliente de respaldo antes de generar Ficha de Cierre", "Calle No Ingresada");
                return;
            }
            if (!cliente.regionCliResp) {
                showMsgBoxAlert("Debe ingresar la 'Región' de cliente de respaldo antes de generar Ficha de Cierre", "Region No Ingresada");
                return;
            }
            if (!cliente.comunaCliResp) {
                showMsgBoxAlert("Debe ingresar la 'Comuna' de cliente de respaldo antes de generar Ficha de Cierre", "Comuna No Ingresada");
                return;
            }

            if (!cliente.fechaNacimientoCliResp) {
                showMsgBoxAlert("Debe ingresar la 'Fecha de Nacimiento' de cliente de respaldo antes de generar Ficha de Cierre", "Fecha No Ingresada");
                return;
            }

            thisController.$this.find("#edNombreResp").val(cliente.nombreCliResp);
            thisController.$this.find("#edRutResp").val(cliente.rutCliResp);
            thisController.$this.find("#edSerieResp").val(cliente.serieCliResp);

            thisController.$this.find("#edFechaNacResp").val(cliente.fechaNacimientoCliResp);
            thisController.$this.find("#edEmailResp").val(cliente.emailCliResp);
            thisController.$this.find("#edfono1Resp").val(cliente.fono1CliResp);
            thisController.$this.find("#edFono2CliResp").val(cliente.fono2CliResp);
            thisController.$this.find("#edFono3CliResp").val(cliente.fono3CliResp);
            thisController.$this.find("#edCicloCliResp").val(datosOferta.ciclo);
            thisController.$this.find("#edCalleCliResp").val(cliente.calleCliResp);
            thisController.$this.find("#edEntreCalleCliResp").val(cliente.entreCalleCliResp);
            thisController.$this.find("#edYCalleCliResp").val(cliente.yCalleCliResp);
            thisController.$this.find("#edNumeroCliResp").val(cliente.numeroCliResp);
            thisController.$this.find("#edPisoCliResp").val(cliente.pisoCliResp);
            thisController.$this.find("#edDeptoCliResp").val(cliente.deptoCliResp);
	    
            thisController.$this.find("#edRegionCliResp").val(cliente.regionCliResp);
            thisController.$this.find("#edComunaCliResp").val(cliente.comunaCliResp);
	        thisController.$this.find("#edRegionDescCliResp").val(cliente.regionDescCliResp);
            thisController.$this.find("#edComunaDescCliResp").val(cliente.comunaDescCliResp);

            if (cliente.notificarCliResp) {
                thisController.$this.find("#edNotificarResp").attr("checked", true);
            } else {
                thisController.$this.find("#edNotificarResp").removeAttr("checked");
            }

        }

        if (cliente.checkClienteRespaldo) {
            thisController.$this.find("#tabFichaRespaldoHide").show();
        } else {
            //Limpiar
            thisController.$this.find("#tabFichaRespaldoHide").hide();
            thisController.$this.find("#edNombreResp").val('');
            thisController.$this.find("#edRutResp").val('');
            thisController.$this.find("#edSerieResp").val('');
            thisController.$this.find("#edFechaNacResp").val('');
            thisController.$this.find("#edEmailResp").val('');
            thisController.$this.find("#edfono1Resp").val('');
            thisController.$this.find("#edFono2CliResp").val('');
            thisController.$this.find("#edFono3CliResp").val('');
            thisController.$this.find("#edCicloCliResp").val('');
            thisController.$this.find("#edCalleCliResp").val('');
            thisController.$this.find("#edEntreCalleCliResp").val('');
            thisController.$this.find("#edYCalleCliResp").val('');
            thisController.$this.find("#edNumeroCliResp").val('');
            thisController.$this.find("#edPisoCliResp").val('');
            thisController.$this.find("#edDeptoCliResp").val('');
            thisController.$this.find("#edRegionCliResp").val('');
            thisController.$this.find("#edComunaCliResp").val('');
	        thisController.$this.find("#edRegionDescCliResp").val('');
            thisController.$this.find("#edComunaDescCliResp").val('');
            thisController.$this.find("#edNotificarResp").removeAttr("checked");

        }

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
                r.cantProductos = 1;
                gridResumenOfertas.jqGrid("addRowData", r.id, r);
            });
        }

        //Datos Parrilla
        var datosVenta = thisController.getDatosVenta();

        thisController.$this.find("#edObsVenta").val(datosVenta.obs);

        var gridResumenProductos = thisController.$this.find("#listaResumenProductos").jqGrid();
        gridResumenProductos.jqGrid("clearGridData");
        if (productosVendidos.length > 0) {
            $.each(productosVendidos, function (i, r) {
                r.numero = i + 1;
                gridResumenProductos.jqGrid("addRowData", r.id, r);
            });
        }
        
        thisController.generada = true;
        thisController.onSwitchOffEnviadoBO();
        thisController.onSetAtributoGrabacion("ATTR_RUT_CLIENTE", cliente.rutCli);
    },
    limpiarFicha: function () {
        var thisController = this;


        thisController.$this.find("#edSiglo").removeAttr('checked');
        thisController.$this.find("#edIVRSiglo").removeAttr('checked');
        thisController.$this.find("#edEjecutivoSiglo").removeAttr('checked');
        thisController.$this.find("#edIDivrsiglo").val('');
        thisController.$this.find("#edIDejecutivosiglo").val('');
        thisController.$this.find("#edIDivrsiglo").prop('disabled', true);
        thisController.$this.find("#edIDejecutivosiglo").prop('disabled', true);


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

        thisController.$this.find("#edObsVenta").val("");

        thisController.$this.find("#edNombreContacto").val("");
        thisController.$this.find("#edCalleCont").val("");
        thisController.$this.find("#edEntreCalleCont").val("");
        thisController.$this.find("#edYCalleCont").val("");
        thisController.$this.find("#edNumeroCont").val("");
        thisController.$this.find("#edPisoCont").val("");
        thisController.$this.find("#edDeptoCont").val("");
        thisController.$this.find("#edRegionCont").val("");
        thisController.$this.find("#edComunaCont").val("");
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

        thisController.$this.find("#edTipoVentaCli").val("Seleccione");
        thisController.$this.find("#edTipoCli").val("Seleccione");

        thisController.generada = false;

    },
    loadFicha: function (infoCierre) {
        var thisController = this;

        thisController.$this.find("#edNombreCli").val(infoCierre.infoCliente.nombre);
        thisController.$this.find("#edRutCli").val(infoCierre.infoCliente.rut);
        thisController.$this.find("#edSerieCli").val(infoCierre.infoCliente.numSerie);
        thisController.$this.find("#edFechaNacimientoCli").val(infoCierre.infoCliente.fechaNacimiento);
        thisController.$this.find("#edEmailCli").val(infoCierre.infoCliente.email);
        thisController.$this.find("#edFono1Cli").val(infoCierre.infoCliente.fonoContacto1);
        thisController.$this.find("#edFono2Cli").val(infoCierre.infoCliente.fonoContacto2);
        thisController.$this.find("#edFono3Cli").val(infoCierre.infoCliente.fonoContacto3);
        thisController.$this.find("#edCicloCli").val(infoCierre.infoCliente.cicloFacturacion);
        thisController.$this.find("#edCalleCli").val(infoCierre.infoCliente.calle);
        thisController.$this.find("#edEntreCalleCli").val(infoCierre.infoCliente.entreCalle);
        thisController.$this.find("#edYCalleCli").val(infoCierre.infoCliente.y_calle);
        thisController.$this.find("#edNumeroCli").val(infoCierre.infoCliente.numero);
        thisController.$this.find("#edPisoCli").val(infoCierre.infoCliente.piso);
        thisController.$this.find("#edDeptoCli").val(infoCierre.infoCliente.depto);
        thisController.$this.find("#edRegionCli").val(infoCierre.infoCliente.region);
        thisController.$this.find("#edComunaCli").val(infoCierre.infoCliente.comuna);
        if (infoCierre.infoCliente.tipoVenta) thisController.$this.find("#edTipoVentaCli").val(infoCierre.infoCliente.tipoVenta);
        else thisController.$this.find("#edTipoVentaCli").val("Seleccione");
        
        if (infoCierre.infoCliente.tipoVenta) thisController.$this.find("#edTipoCli").val(infoCierre.infoCliente.tipoCliente);
        else thisController.$this.find("#edTipoCli").val("Seleccione");

        if (infoCierre.infoCliente.notificar == "S") {
            thisController.$this.find("#edNotificarCli").attr("checked", "checked");
        } else {
            thisController.$this.find("#edNotificarCli").removeAttr("checked");
        }        

        var gridResumenOfertas = thisController.$this.find("#listaResumenOfertas").jqGrid();
        gridResumenOfertas.jqGrid('clearGridData');

        if (infoCierre.listaOfertas.length > 0) {
            $.each(infoCierre.listaOfertas, function(i, r){
                gridResumenOfertas.jqGrid("addRowData", r.id, r);
            })
        }

        var gridResumenProductos = thisController.$this.find("#listaResumenProductos").jqGrid();
        gridResumenProductos.jqGrid('clearGridData');

        if (infoCierre.listaProductosParrilla.length > 0) {
            $.each(infoCierre.listaProductosParrilla, function (i, r) {
                gridResumenProductos.jqGrid("addRowData", r.id, r);
            })
        }

        thisController.$this.find("#edObsVenta").val(infoCierre.observacionVenta);

        thisController.$this.find("#edNombreContacto").val(infoCierre.infoDespacho.nombreContacto);
        thisController.$this.find("#edCalleCont").val(infoCierre.infoDespacho.calle);
        thisController.$this.find("#edEntreCalleCont").val(infoCierre.infoDespacho.entreCalle);
        thisController.$this.find("#edYCalleCont").val(infoCierre.infoDespacho.y_calle);
        thisController.$this.find("#edNumeroCont").val(infoCierre.infoDespacho.numero);
        thisController.$this.find("#edPisoCont").val(infoCierre.infoDespacho.piso);
        thisController.$this.find("#edDeptoCont").val(infoCierre.infoDespacho.depto);
        thisController.$this.find("#edRegionCont").val(infoCierre.infoDespacho.region);
        thisController.$this.find("#edComunaCont").val(infoCierre.infoDespacho.comuna);
        thisController.$this.find("#edReferenciaCont").val(infoCierre.infoDespacho.referencia);

        thisController.$this.find("#edRespuesta1").val(infoCierre.infoPregunta.respuesta1);
        thisController.$this.find("#edRespuesta2").val(infoCierre.infoPregunta.respuesta2);

        thisController.generada = true;


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
        infoCliente.tipoCliente = thisController.$this.find("#edTipoCli").val() == "Seleccione" ? "" : thisController.$this.find("#edTipoCli").val();
        infoCliente.tipoVenta = thisController.$this.find("#edTipoVentaCli").val() == "Seleccione" ? "" : thisController.$this.find("#edTipoVentaCli").val();
        infoCliente.calle  = thisController.$this.find("#edCalleCli").val();
        infoCliente.entreCalle  = thisController.$this.find("#edEntreCalleCli").val();
        infoCliente.yCalle  = thisController.$this.find("#edYCalleCli").val();
        infoCliente.numero  = thisController.$this.find("#edNumeroCli").val();
        infoCliente.piso  = thisController.$this.find("#edPisoCli").val();
        infoCliente.depto  = thisController.$this.find("#edDeptoCli").val();
        infoCliente.region = thisController.$this.find("#edRegionCli").val();
        infoCliente.comuna = thisController.$this.find("#edComunaCli").val();
        infoCliente.notificar = thisController.$this.find("#edNotificarCli").is(':checked') ? "1" : "0";


        //certificacion
        /*SIGLO*/
        infoCliente.certifSiglo = thisController.$this.find("#edSiglo").is(':checked') ? "1" : "0";
        if (infoCliente.certifSiglo == 1) {
            infoCliente.certifSigloIVR = thisController.$this.find("#edIVRSiglo").is(':checked') ? "1" : "0";
            infoCliente.IDSigloIVR = thisController.$this.find("#edIDivrsiglo").val();
            infoCliente.certifSigloEjecutivo = thisController.$this.find("#edEjecutivoSiglo").is(':checked') ? "1" : "0";
            infoCliente.IDSigloEjecutivo = thisController.$this.find("#edIDejecutivosiglo").val();
        }

        infoCliente.nombreCliRespaldo = thisController.$this.find("#edNombreResp").val();
        infoCliente.rutCliRespaldo = thisController.$this.find("#edRutResp").val();
        infoCliente.serieCliRespaldo = thisController.$this.find("#edSerieResp").val();       

        infoCliente.fechaNacimientoCliRespaldo = thisController.$this.find("#edFechaNacResp").val();
        infoCliente.emailCliRespaldo = thisController.$this.find("#edEmailResp").val();
        infoCliente.fono1CliRespaldo = thisController.$this.find("#edfono1Resp").val();
        infoCliente.fono2CliRespaldo = thisController.$this.find("#edFono2CliResp").val();
        infoCliente.fono3CliRespaldo = thisController.$this.find("#edFono3CliResp").val();
        infoCliente.cicloRespaldo = thisController.$this.find("#edCicloCliResp").val();
        infoCliente.calleCliRespaldo = thisController.$this.find("#edCalleCliResp").val();
        infoCliente.entreCalleCliRespaldo = thisController.$this.find("#edEntreCalleCliResp").val();
        infoCliente.yCalleCliRespaldo = thisController.$this.find("#edYCalleCliResp").val();
        infoCliente.numeroCliRespaldo = thisController.$this.find("#edNumeroCliResp").val();
        infoCliente.pisoCliRespaldo = thisController.$this.find("#edPisoCliResp").val();
        infoCliente.deptoCliRespaldo = thisController.$this.find("#edDeptoCliResp").val();
        infoCliente.regionCliRespaldo = thisController.$this.find("#edRegionCliResp").val();
        infoCliente.comunaCliRespaldo = thisController.$this.find("#edComunaCliResp").val();
        infoCliente.notificacionClienteRespaldo = thisController.$this.find("#edNotificarResp").is(':checked') ? "1" : "0";

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

        var dataVenta = new Object();
        dataVenta.obs = thisController.$this.find("#edObsVenta").val();

        infoCierre.dataVenta = dataVenta;

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