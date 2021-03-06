var controller = {
    $this: null,
    getCliente: null,
    getLlamadaConectada: null,
    generada: false,
    onSetAtributoGrabacion: null,
    onGetRegionesComunaArray: null,
    init: function (container, options) {
        this.$this = $(container.children()[0]);
        var thisController = this;

        cicTrace("Cierre - Inicio Init");

        var tabsCierre = thisController.$this.find("#tabsCierre").tabs();

        initializeTabsLayout(tabsCierre);

        var tabsVentasCierre = thisController.$this.find("#tabsVentasCierre").tabs();

        initializeTabsLayout(tabsVentasCierre);

        var cmdGenerarFicha = thisController.$this.find("#cmdGenerarFicha");

        cmdGenerarFicha.click(function () {
            thisController.generarFicha();
        });

        thisController.$this.find(".integer").inputmask(
            "integer",
            {
                allowMinus: false,
                allowPlus: false
            });

        thisController.$this.find("#edCheckVentasFijo").change(function () {
            var check = $(this).prop('checked');
            if (check) {
                thisController.$this.find(".ventaFij").removeAttr("disabled");
            } else {
                thisController.$this.find(".ventaFij").attr("disabled", "disabled");
                thisController.$this.find("#edMixVenta").val(-1);
            }
        });

        thisController.$this.find("#edCheckVentasSVA").change(function () {
            var check = $(this).prop('checked');
            if (check) {
                thisController.$this.find(".ventaSvaMig").removeAttr("disabled");
            } else {
                if (!thisController.$this.find("#edCheckVentasMigraciones").is(':checked')) {
                    thisController.$this.find(".ventaSvaMig").attr("disabled", "disabled");
                }
            }
        });

        thisController.$this.find("#edCheckVentasMigraciones").change(function () {
            var check = $(this).prop('checked');
            if (check) {
                thisController.$this.find(".ventaSvaMig").removeAttr("disabled");
            } else {
                if (!thisController.$this.find("#edCheckVentasSVA").is(':checked')) {
                    thisController.$this.find(".ventaSvaMig").attr("disabled", "disabled");
                }
            }
        });

        thisController.$this.find("#edCheckVentasMovil").change(function () {
            var check = $(this).prop('checked');
            if (check) {
                thisController.$this.find(".ventaMov").removeAttr("disabled");
            } else {
                thisController.$this.find(".ventaMov").attr("disabled", "disabled");

                thisController.$this.find("#edCheckAltaConEquipo").removeAttr("checked");
                thisController.$this.find("#edCheckAltaSinEquipo").removeAttr("checked");
                thisController.$this.find("#edCheckPortaConEquipo").removeAttr("checked");
                thisController.$this.find("#edCheckPortaSinEquipo").removeAttr("checked");
                thisController.$this.find("#edCheckBAM").removeAttr("checked");

                thisController.$this.find("#edCantidadAltaConEquipo").attr("disabled", "disabled");
                thisController.$this.find("#edCantidadAltaConEquipo").val("");
                thisController.$this.find("#edCantidadAltaSinEquipo").attr("disabled", "disabled");
                thisController.$this.find("#edCantidadAltaSinEquipo").val("");
                thisController.$this.find("#edCantidadPortaConEquipo").attr("disabled", "disabled");
                thisController.$this.find("#edCantidadPortaConEquipo").val("");
                thisController.$this.find("#edCantidadPortaSinEquipo").attr("disabled", "disabled");
                thisController.$this.find("#edCantidadPortaSinEquipo").val("");
                thisController.$this.find("#edCantidadBAM").attr("disabled", "disabled");
                thisController.$this.find("#edCantidadBAM").val("");

            }
        });


        thisController.$this.find("#edCheckAltaConEquipo").change(function () {
            var check = $(this).prop('checked');
            if (check) {
                thisController.$this.find("#edCantidadAltaConEquipo").removeAttr("disabled");
            } else {
                thisController.$this.find("#edCantidadAltaConEquipo").attr("disabled", "disabled");
                thisController.$this.find("#edCantidadAltaConEquipo").val("");
            }
        });

        thisController.$this.find("#edCheckAltaSinEquipo").change(function () {
            var check = $(this).prop('checked');
            if (check) {
                thisController.$this.find("#edCantidadAltaSinEquipo").removeAttr("disabled");
            } else {
                thisController.$this.find("#edCantidadAltaSinEquipo").attr("disabled", "disabled");
                thisController.$this.find("#edCantidadAltaSinEquipo").val("");
            }
        });

        thisController.$this.find("#edCheckPortaConEquipo").change(function () {
            var check = $(this).prop('checked');
            if (check) {
                thisController.$this.find("#edCantidadPortaConEquipo").removeAttr("disabled");
            } else {
                thisController.$this.find("#edCantidadPortaConEquipo").attr("disabled", "disabled");
                thisController.$this.find("#edCantidadPortaConEquipo").val("");
            }
        });

        thisController.$this.find("#edCheckPortaSinEquipo").change(function () {
            var check = $(this).prop('checked');
            if (check) {
                thisController.$this.find("#edCantidadPortaSinEquipo").removeAttr("disabled");
            } else {
                thisController.$this.find("#edCantidadPortaSinEquipo").attr("disabled", "disabled");
                thisController.$this.find("#edCantidadPortaSinEquipo").val("");
            }
        });

        thisController.$this.find("#edCheckBAM").change(function () {
            var check = $(this).prop('checked');
            if (check) {
                thisController.$this.find("#edCantidadBAM").removeAttr("disabled");
            } else {
                thisController.$this.find("#edCantidadBAM").attr("disabled", "disabled");
                thisController.$this.find("#edCantidadBAM").val("");
            }
        });

        thisController.$this.find("#edRegionCont").change(function () {
            thisController.refrescaComuna();
        });

        thisController.limpiarFicha();

        cicTrace("Cierre - Fin Init");
    },
    refresca: function () {

        cicTrace("Cierre Inicio Refresca");
        var thisController = this;

        thisController.limpiarFicha();

        thisController.$this.find("#edReferenciaCont").text("Escribir punto de referencia para la dirección");

        thisController.$this.find("#edCheckOferta1").removeAttr("checked");
        thisController.$this.find("#lbOferta1").html(cicGetOferP1Desc());

        thisController.$this.find("#edCheckOferta2").removeAttr("checked");
        thisController.$this.find("#lbOferta2").html(cicGetOferP2Desc());

        cicTrace("Cierre Fin Refresca");
    },
    refrescaComuna: function () {

        var regionSelected = this.$this.find("#edRegionCont").val();

        var html = "<option value='SELECCIONE'>Seleccione</option>";

        if (regionSelected && regionSelected != "SELECCIONE") {
            $.each(this.onGetRegionesComunaArray(), function (i, region) {

                if (region.numero == regionSelected) {
                    $.each(region.comunas, function (i, comuna) {
                        html += "<option value='" + comuna.codigoUnico + "' title='" + comuna.nombre + "'>" + comuna.nombre + "</option>";
                    });
                }
            });
        }

        this.$this.find("#edComunaCont").html(html);

    },
    initializeRegionComuna: function () {

        var html = "<option value='SELECCIONE'>Seleccione</option>";
        $.each(this.onGetRegionesComunaArray(), function (i, r) {
            html += "<option value='" + r.numero + "' title='" + r.nombre + "'>" + r.nombre + "</option>";
        });

        this.$this.find("#edRegionCont").html(html);

    },
    setActiveTabs: function (index) {
        var thisController = this;
        thisController.$this.find("#tabsCierre").tabs({ active: 2 });
        thisController.$this.find("#tabsVentasCierre").tabs({ active: 0 })
        thisController.$this.find("#tabsCierre").tabs({ active: index });
    },
    generarFicha: function () {
        var thisController = this;

        //Check Datos Cliente Generico
        var cliente = thisController.getCliente();

        var msg = "";
        if (!cliente.nombreCli) {
            msg += "Debe ingresar el 'Nombre Cliente' antes de generar Ficha de Cierre<br>";
        }
        if (!cliente.rutCli) {
            msg += "Debe ingresar el 'Rut' antes de generar Ficha de Cierre<br>";
        }
        if (!cliente.serieCli) {
            msg += "Debe ingresar el '# Serie' antes de generar Ficha de Cierre<br>";
        }

        if (!cliente.fechaNacimientoCli) {
            msg += "Debe ingresar el 'Fecha Nacimiento' antes de generar Ficha de Cierre<br>";
        }

        if (!cliente.fono1Cli) {
            msg += "Debe ingresar el 'Fono Contacto 1' antes de generar Ficha de Cierre<br>";
        }

        if (!cliente.fono2Cli) {
            msg += "Debe ingresar el 'Fono Contacto 2' antes de generar Ficha de Cierre<br>";
        }

        if (!cliente.emailCli) {
            msg += "Debe ingresar el 'Email' antes de generar Ficha de Cierre<br>";
        }

        //Dirección Particular

        if (!cliente.calleCli) {
            msg += "Debe ingresar el 'Calle' antes de generar Ficha de Cierre<br>";
        }

        if (!cliente.numeroCli) {
            msg += "Debe ingresar el 'Número' antes de generar Ficha de Cierre<br>";
        }

        if (!cliente.entreCalleCli) {
            msg += "Debe ingresar el 'Entre Calles' antes de generar Ficha de Cierre<br>";
        }

        if (!cliente.regionCli) {
            msg += "Debe ingresar el 'Región' antes de generar Ficha de Cierre<br>";
        }

        if (!cliente.comunaCli) {
            msg += "Debe ingresar el 'Comuna' antes de generar Ficha de Cierre<br>";
        }



        if (msg.length > 0) {

            var msgHeight = thisController.getHeightMessage(msg);
            showMsgBoxAlert(msg, "Validación de Información Cliente", msgHeight);
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

        thisController.$this.find("#edRegionCont").trigger("change");

        thisController.$this.find("#edComunaCont").val(cliente.comunaCli);

        thisController.generada = true;
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
        thisController.$this.find("#edDireccionCli").val("");
        thisController.$this.find("#edRegionCli").val("");
        thisController.$this.find("#edComunaCli").val("");
        thisController.$this.find("#edRegionDescCli").val("");
        thisController.$this.find("#edComunaDescCli").val("");
        thisController.$this.find("#edNotificarCli").removeAttr("checked");

        thisController.$this.find("#edCalleCli").val("");
        thisController.$this.find("#edEntreCalleCli").val("");
        thisController.$this.find("#edYCalleCli").val("");
        thisController.$this.find("#edNumeroCli").val("");
        thisController.$this.find("#edPisoCli").val("");
        thisController.$this.find("#edDeptoCli").val("");

        thisController.$this.find("#edNombreContacto").val("");
        thisController.$this.find("#edCalleCont").val("");
        thisController.$this.find("#edEntreCalleCont").val("");
        thisController.$this.find("#edYCalleCont").val("");
        thisController.$this.find("#edNumeroCont").val("");
        thisController.$this.find("#edPisoCont").val("");
        thisController.$this.find("#edDeptoCont").val("");
        thisController.$this.find("#edRegionCont").val("SELECCIONE");

        thisController.$this.find("#edRegionCont").trigger("change");

        thisController.$this.find("#edReferenciaCont").val("");

        thisController.$this.find("#edCheckVentasFijo").removeAttr("checked");
        thisController.$this.find("#edCheckVentasFijo").trigger("change");

        thisController.$this.find("#edCheckVentasSVA").removeAttr("checked");
        thisController.$this.find("#edCheckVentasSVA").trigger("change");

        thisController.$this.find("#edCheckVentasMigraciones").removeAttr("checked");
        thisController.$this.find("#edCheckVentasMigraciones").trigger("change");

        thisController.$this.find("#edCheckVentasMovil").removeAttr("checked");
        thisController.$this.find("#edCheckVentasMovil").trigger("change");

        if (cicGetOferP1Desc() == "") thisController.$this.find("#viewOferta1").hide();
        else thisController.$this.find("#viewOferta1").show();

        thisController.$this.find("#edCheckOferta1").removeAttr("checked");
        thisController.$this.find("#lbOferta1").html(cicGetOferP1Desc());

        if (cicGetOferP2Desc() == "") thisController.$this.find("#viewOferta2").hide();
        else thisController.$this.find("#viewOferta2").show();

        thisController.$this.find("#edCheckOferta2").removeAttr("checked");
        thisController.$this.find("#lbOferta2").html(cicGetOferP2Desc());

        thisController.$this.find("#edCantidadAltaConEquipo").val("");
        thisController.$this.find("#edCantidadAltaSinEquipo").val("");
        thisController.$this.find("#edCantidadPortaConEquipo").val("");
        thisController.$this.find("#edCantidadPortaSinEquipo").val("");
        thisController.$this.find("#edCantidadBAM").val("");

        thisController.$this.find("#edCheckAltoValor").attr('checked', false);
        thisController.$this.find("#edCheckMedioValor").attr('checked', false);
        thisController.$this.find("#edCheckBajoValor").attr('checked', false);

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
        infoCliente.calle = thisController.$this.find("#edCalleCli").val();
        infoCliente.entreCalle = thisController.$this.find("#edEntreCalleCli").val();
        infoCliente.yCalle = thisController.$this.find("#edYCalleCli").val();
        infoCliente.numero = thisController.$this.find("#edNumeroCli").val();
        infoCliente.piso = thisController.$this.find("#edPisoCli").val();
        infoCliente.depto = thisController.$this.find("#edDeptoCli").val();
        infoCliente.region = thisController.$this.find("#edRegionCli").val();
        infoCliente.comuna = thisController.$this.find("#edComunaCli").val();
        infoCliente.notificar = thisController.$this.find("#edNotificarCli").is(':checked') ? "1" : "0";

        infoCierre.infoCliente = infoCliente;

        var infoDespacho = new Object();
        infoDespacho.nombre = thisController.$this.find("#edNombreContacto").val();
        infoDespacho.calle = thisController.$this.find("#edCalleCont").val();
        infoDespacho.entreCalle = thisController.$this.find("#edEntreCalleCont").val();
        infoDespacho.yCalle = thisController.$this.find("#edYCalleCont").val();
        infoDespacho.numero = thisController.$this.find("#edNumeroCont").val();
        infoDespacho.piso = thisController.$this.find("#edPisoCont").val();
        infoDespacho.depto = thisController.$this.find("#edDeptoCont").val();
        var valueRegionDesp = thisController.$this.find("#edRegionCont").val();
        infoDespacho.region = !valueRegionDesp || valueRegionDesp == "SELECCIONE" ? "" : valueRegionDesp;
        var valueComunaDesp = thisController.$this.find("#edComunaCont").val();
        infoDespacho.comuna = !valueComunaDesp || valueComunaDesp == "SELECCIONE" ? "" : valueComunaDesp;
        infoDespacho.referencia = thisController.$this.find("#edReferenciaCont").val();

        infoCierre.infoDespacho = infoDespacho;

        var infoFolios = new Object();

        infoFolios.ventasFijo = thisController.$this.find("#edCheckVentasFijo").prop("checked");
        infoFolios.folioUnifica = thisController.$this.find("#edFolioUnifica").val();
        infoFolios.mixVenta = thisController.$this.find("#edMixVenta").val();

        infoFolios.ventasSVA = thisController.$this.find("#edCheckVentasSVA").prop("checked");
        infoFolios.ventasMigraciones = thisController.$this.find("#edCheckVentasMigraciones").prop("checked");

        infoFolios.ventasMovil = thisController.$this.find("#edCheckVentasMovil").prop("checked");

        infoFolios.vendeAltaConEquipo = thisController.$this.find("#edCheckAltaConEquipo").prop("checked");
        infoFolios.cantidadAltaConEquipo = thisController.$this.find("#edCantidadAltaConEquipo").val();
        infoFolios.vendeAltaSinEquipo = thisController.$this.find("#edCheckAltaSinEquipo").prop("checked");
        infoFolios.cantidadAltaSinEquipo = thisController.$this.find("#edCantidadAltaSinEquipo").val();
        infoFolios.vendePortaConEquipo = thisController.$this.find("#edCheckPortaConEquipo").prop("checked");
        infoFolios.cantidadPortaConEquipo = thisController.$this.find("#edCantidadPortaConEquipo").val();
        infoFolios.vendePortaSinEquipo = thisController.$this.find("#edCheckPortaSinEquipo").prop("checked");
        infoFolios.cantidadPortaSinEquipo = thisController.$this.find("#edCantidadPortaSinEquipo").val();
        infoFolios.vendeBAM = thisController.$this.find("#edCheckBAM").prop("checked");
        infoFolios.cantidadBAM = thisController.$this.find("#edCantidadBAM").val();

        infoFolios.altoValor = thisController.$this.find("#edCheckAltoValor").is(':checked');
        infoFolios.medioValor = thisController.$this.find("#edCheckMedioValor").is(':checked');
        infoFolios.bajoValor = thisController.$this.find("#edCheckBajoValor").is(':checked');

        infoFolios.ventaOferta1 = thisController.$this.find("#edCheckOferta1").prop("checked");
        infoFolios.ventaOferta2 = thisController.$this.find("#edCheckOferta2").prop("checked");

        infoCierre.infoFolios = infoFolios;

        return infoCierre;

    },
    getRutCliente: function () {
        return this.$this.find("#edRutCli").val();
    },
    getHeightMessage: function (msg) {
        var msgHeight = null;

        var lineas = msg.split("<br>");

        var nroLineas = lineas.length;

        for (var i = 0; i < lineas.length; i++) {
            if (lineas[i].length > 50) nroLineas++;
        }

        if (nroLineas >= 4) {
            if (nroLineas < 8) msgHeight = "medium";
            else if (nroLineas < 12) msgHeight = "large";
            else if (nroLineas >= 12) msgHeight = "xlarge";
        }

        return msgHeight;
    }
};