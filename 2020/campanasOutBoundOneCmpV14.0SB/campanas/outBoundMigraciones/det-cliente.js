var bandera_ticket = false;
var amountObject = {};
var controller = {
    $this: null,
    idReferido: "-1",
    onGetAtributoCall: null,
    onGetRegionesComunaArray: null,
    init: function (container, options) {
        this.$this = $(container.children()[0]);
        var thisController = this;

        cicTrace("Cliente - Inicio Init");

        var tabsCliente = thisController.$this.find("#tabsCliente").tabs();

        initializeTabsLayout(tabsCliente);

        //Buttons
        var cmdEnviarReferido = thisController.$this.find("#cmdEnviarReferido").button();

        cmdEnviarReferido.click(function (event) {
            if (!isButtonEnabled(this)) {
                return false;
            } else {
                thisController.enviarReferido();
                return true;
            }
        });
        enableButton(cmdEnviarReferido, true);


        var cmdCalculaEdad = thisController.$this.find("#cmdCalculaEdad").button();

        cmdCalculaEdad.click(function (event) {
            if (!isButtonEnabled(this)) {
                return false;
            } else {
                thisController.calculaEdadCliente(false);
                return true;
            }
        });

        enableButton(cmdCalculaEdad, true);

        var cmdCalculaEdadResp = thisController.$this.find("#cmdCalculaEdadResp").button();

        cmdCalculaEdadResp.click(function (event) {
            if (!isButtonEnabled(this)) {
                return false;
            } else {
                thisController.calculaEdadCliente(true);
                return true;
            }
        });

        enableButton(cmdCalculaEdadResp, false);

        thisController.$this.find("#edClienteRespaldo").click(function (event) {
            if ($(this).is(':checked')) {
                thisController.$this.find(".respData").removeAttr("disabled");
                enableButton(cmdCalculaEdadResp, true);
            } else {
                thisController.$this.find(".respData").attr("disabled", "disabled");
                enableButton(cmdCalculaEdadResp, false);
                thisController.$this.find("#edDiaNacimientoResp").val("DD");
                thisController.$this.find("#edMesNacimientoResp").val("MM");
                thisController.$this.find("#edAnoNacimientoResp").val("AAAA");
            }
        })
        
        //Validaciones
        //RUT
        thisController.$this.find(".rut").blur(function () {
            var rutAValidar = $(this).val();
            var validacion = validateRut(rutAValidar);
            if (validacion) {
                showMsgBoxAlert(validacion);
                $(this).val("");
            }
        });

        // Valida el ticket
        thisController.$this.find(".ticketV").blur(function ()
        {
            var ticketAValidar = $(this).val();            

            var tick = ticketAValidar.split("");
               
            var rutAsNumber = parseInt(ticketAValidar.substring(0, tick.length - 1));
            
            cicTrace("[Ticket_DCP] [Ticket] :: Entra a validar Ticket " + ticketAValidar);

            if (isNaN(rutAsNumber))
            {
                showMsgBoxAlert("El ticket tiene que ser solo números", "Validación Ticket");
                $(this).val("");
                return;
            }

            httpVaidaTicket(ticketAValidar, function (resp)
            {
                cicTrace("[Ticket_DCP] :: [httpVaidaTicket] :: [Ticket] :: " + ticketAValidar);
                cicTrace("[Ticket_DCP] :: [httpVaidaTicket] :: [statusCode] :: " + resp.statusCode);
                
                if (resp.statusCode === "0")
                {
                    bandera_ticket = true;
                    amountObject = resp;
                    showMsgBoxAlert(resp.statusDescription, "Validación Ticket");
                    
                    //("#edSpeedDial").children("option[value='600188']").show();
                    $('#edSpeedDial option[value="600188"]').removeAttr('disabled').show();
                    cicTrace("[Ticket_DCP] :: [httpVaidaTicket] :: [Exito] :: [ticket] :: " + ticketAValidar + " :: [Codigo] :: " + resp.statusCode + " :: [Mensaje] :: " + resp.statusDescription);
                }
                else if(resp.statusCode != "0")
                {
                    bandera_ticket = false; // tiene que ser false
                    amountObject = resp;
                    
                    //$("#edSpeedDial").children("option[value='600188']").hide();
                    $('#edSpeedDial option[value="600188"]').attr('disabled', 'disabled').hide();
                    showMsgBoxAlert(resp.statusDescription, "Validación Ticket");
                    $(this).val("");
                    cicTrace("[Ticket_DCP] :: [httpVaidaTicket] :: [Error] :: [ticket] :: " + ticketAValidar + " :: [Codigo] :: " + resp.statusCode + " :: [Mensaje] :: " + resp.statusDescription);
                }
            },function (error)
            {
                cicTrace("[Ticket_DCP] :: [httpVaidaTicket] :: [Error] :: [ticket] :: " + ticketAValidar + " :: [Codigo] :: " + error.statusCode + " :: [Mensaje] :: " + error.statusDescription);
                showMsgBoxAlert(error.statusDescription + " - " + error.statusCode, "Error Validación Ticket");
            });
        });

        //Telefonos
        thisController.$this.find(".telefono").inputmask({ mask: "999999999", "placeholder": "" });
        thisController.$this.find(".telefono").blur(function () {
            if ($(this).val().length == 0) return;
            if (!$(this).inputmask("isComplete")) {
                showMsgBoxAlert("El telefono debe contener 9 dígitos", "Validacion Telefono");
              
            }
        });

        $("#edTelefonoReferido").inputmask({ mask: "999999999", "placeholder": "" });
		
        thisController.$this.find("#edEmail").blur(function () {
            if ($(this).val().length == 0) return;
            var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
            if (!re.test($(this).val())) {
                showMsgBoxAlert("El formato de email no es válido", "Validación E-mail");
                $(this).val("");
            }
        });

        thisController.$this.find("#edRegion").change(function () {
            thisController.refrescaComuna("basic");
        });
	
	    thisController.$this.find("#edRegionResp").change(function () {
            thisController.refrescaComuna("resp");
        });

        cicTrace("Cliente - Fin Init");
    },
    refresca: function (infoCliente) {
        cicTrace("cliente Inicio Refresca");
        var thisController = this;
        
       // var tipoLlamada = thisController.onGetAtributoCall("TipoLLamada");
       
        thisController.$this.find("#edTicketValida").val("");

        var cmdEnviarReferido = thisController.$this.find("#cmdEnviarReferido").button();
        var habilitarReferido = true;
        //if (tipoLlamada == "ToFinishAgent") habilitarReferido = false;
        enableButton(cmdEnviarReferido, habilitarReferido);
        thisController.idReferido = "-1";

        if (habilitarReferido) {
            thisController.$this.find(".dataReferido").removeAttr("disabled");
        } else {
            thisController.$this.find(".dataReferido").attr("disabled", "disabled");
        }

        if (!infoCliente) {

            //alert(cicGetCliNombre());
            thisController.$this.find("#edNombreCliente").val(cicGetCliNombre());
            thisController.$this.find("#edRutCliente").val(cicGetCliRutConDV());
            thisController.$this.find("#edSerieRut").val("");
            thisController.$this.find("#edFonoContacto1").val(cicGetCliContacAlter());
            thisController.$this.find("#edFonoContacto2").val(cicGetCliContacAlterFijo());
            thisController.$this.find("#edFonoContacto3").val(cicGetCliContacAlterMovil());
            thisController.$this.find("#edEmail").val("");
            thisController.$this.find("#edCalle").val(cicGetDirCalle());
            thisController.$this.find("#edEntreCalle").val("");
            thisController.$this.find("#edYCalle").val("");
            thisController.$this.find("#edNumero").val(cicGetDirNro());
            thisController.$this.find("#edPiso").val(cicGetDirPiso());
            thisController.$this.find("#edDepto").val(cicGetDirDepto());
            //thisController.$this.find("#edRegion").val(cicGetDirRegion());
            //thisController.$this.find("#edComuna").val(cicGetDirComuna());

	    thisController.$this.find("#edRegion").val("SELECCIONE");
	    var regionValue = cicGetDirRegion();
	    if (regionValue) {
	        thisController.$this.find("#edRegion").val(regionValue);
	        thisController.$this.find("#edRegion").trigger("change");
	    }        
	    var comunaValue = cicGetDirComuna();
	    if (comunaValue) {
	        thisController.$this.find("#edComuna").val(comunaValue);
	    } else {
	    	thisController.refrescaComuna("basic");
	    }

            thisController.$this.find("#edDiaNacimiento").val("DD");
            thisController.$this.find("#edMesNacimiento").val("MM");
            thisController.$this.find("#edAnoNacimiento").val("AAAA");

            thisController.$this.find("#edNotificar").removeAttr("checked");

        } else {
            thisController.$this.find("#edNombreCliente").val(infoCliente.nombre);
            thisController.$this.find("#edRutCliente").val(infoCliente.rut);
            thisController.$this.find("#edSerieRut").val(infoCliente.numSerie);
            thisController.$this.find("#edFonoContacto1").val(infoCliente.fonoContacto1);
            thisController.$this.find("#edFonoContacto2").val(infoCliente.fonoContacto2);
            thisController.$this.find("#edFonoContacto3").val(infoCliente.fonoContacto3);
            thisController.$this.find("#edEmail").val(infoCliente.email);
            thisController.$this.find("#edCalle").val(infoCliente.calle);
            thisController.$this.find("#edEntreCalle").val(infoCliente.entreCalle);
            thisController.$this.find("#edYCalle").val(infoCliente.y_calle);
            thisController.$this.find("#edNumero").val(infoCliente.numero);
            thisController.$this.find("#edPiso").val(infoCliente.piso);
            thisController.$this.find("#edDepto").val(infoCliente.depto);
            thisController.$this.find("#edRegion").val("SELECCIONE");
            var regionValue = cicGetDirRegion();
	    if (regionValue) {
	    	thisController.$this.find("#edRegion").val();
	    	thisController.$this.find("#edRegion").trigger("change");
	    }        
	    var comunaValue = cicGetDirComuna();
	    if (comunaValue) {
	    	thisController.$this.find("#edComuna").val(comunaValue);
	    } else {
	    	thisController.refrescaComuna("basic");
	    }

            if (thisController.isDate(infoCliente.fechaNacimiento)) {
                thisController.$this.find("#edDiaNacimiento").val(infoCliente.fechaNacimiento.substring(0, 2));
                thisController.$this.find("#edMesNacimiento").val(infoCliente.fechaNacimiento.substring(3, 2));
                thisController.$this.find("#edAnoNacimiento").val(infoCliente.fechaNacimiento.substring(6));
            } else {
                thisController.$this.find("#edDiaNacimiento").val("DD");
                thisController.$this.find("#edMesNacimiento").val("MM");
                thisController.$this.find("#edAnoNacimiento").val("AAAA");
            }            

            if (infoCliente.notificar == "S") {
                thisController.$this.find("#edNotificar").attr("checked", "checked");
            } else {
                thisController.$this.find("#edNotificar").removeAttr("checked");
            }
            
        }

        thisController.$this.find("#edEdad").val("");

        thisController.$this.find("#edNombreReferido").val("");
        thisController.$this.find("#edTelefonoReferido").val("");
        thisController.$this.find("#edObsReferido").val("");
        

        thisController.$this.find("#edClienteRespaldo").removeAttr("checked");
        thisController.$this.find(".respData").attr("disabled", "disabled");
        
        var cmdCalculaEdadResp = thisController.$this.find("#cmdCalculaEdadResp").button();
        enableButton(cmdCalculaEdadResp, false);


        thisController.$this.find("#edNombreClienteResp").val("");
        thisController.$this.find("#edRutClienteResp").val("");
        thisController.$this.find("#edSerieRutResp").val("");
        thisController.$this.find("#edFonoContacto1Resp").val("");
        thisController.$this.find("#edFonoContacto2Resp").val("");
        thisController.$this.find("#edFonoContacto3Resp").val("");
        thisController.$this.find("#edEmailResp").val("");

        thisController.$this.find("#edCalleResp").val("");
        thisController.$this.find("#edEntreCalleResp").val("");
        thisController.$this.find("#edYCalleResp").val("");
        thisController.$this.find("#edNumeroResp").val("");
        thisController.$this.find("#edPisoResp").val("");
        thisController.$this.find("#edDeptoResp").val("");
        thisController.$this.find("#edRegionResp").val("SELECCIONE");
        var regionValue = cicGetDirRegion();
        if (regionValue) {
            thisController.$this.find("#edRegionResp").val();
            thisController.$this.find("#edRegionResp").trigger("change");
        }
        var comunaValue = cicGetDirComuna();
        if (comunaValue) {
            thisController.$this.find("#edComunaResp").val(comunaValue);
        } else {
            thisController.refrescaComuna("resp");
        }
        thisController.$this.find("#edAnoNacimientoResp").val("AAAA");
        thisController.$this.find("#edEdadResp").val("");

        cicTrace("cliente Fin Refresca");
    },
    refrescaComuna:function(tipo){
        
        var regionSelected = tipo == "basic" ? this.$this.find("#edRegion").val() : this.$this.find("#edRegionResp").val();
        var html = "<option value='SELECCIONE'>Seleccione</option>";

           if (regionSelected != "SELECCIONE") {
            $.each(this.onGetRegionesComunaArray(), function (i, region) {
  
                if (region.numero == regionSelected) {
                    $.each(region.comunas, function (i, comuna) {
                        html += "<option value='" + comuna.codigoUnico + "' title='" + comuna.nombre + "'>" + comuna.nombre + "</option>";
                    });
                }
            });
        }

        tipo == "basic" ? this.$this.find("#edComuna").html(html):this.$this.find("#edComunaResp").html(html);

    },
   initializeRegionComuna: function () {

        var html = "<option value='SELECCIONE'>Seleccione</option>";
        $.each(this.onGetRegionesComunaArray(), function (i, r) {
            html += "<option value='" + r.numero + "' title='" + r.nombre + "'>" + r.nombre + "</option>";
        });

        this.$this.find("#edRegionResp").html(html);
        this.$this.find("#edRegion").html(html);

    },
   setActiveTabs: function (index) {
        var thisController = this;
        thisController.$this.find("#tabsCliente").tabs({ active: index });
    },
    enviarReferido: function () {
        var thisController = this;


        var nombre = thisController.$this.find("#edNombreReferido").val();
        var telefono = thisController.$this.find("#edTelefonoReferido").val();
        var observacion = thisController.$this.find("#edObsReferido").val();
		        telefono = telefono.replace(/\s+/g, '');

        if (!telefono) {
            showMsgBoxAlert("Debe ingresar Fono para ingresar un Cliente Referido ", "fono No Ingresado");
            return;
        } else if (telefono.length < 9) {
            showMsgBoxAlert("El Telefono debe contenter 9 Dígitos", "Telefoo No Ingresado");
            return;
        }

        if (!nombre) {
            showMsgBoxAlert("Debe ingresar Nombre para ingresar un Cliente Referido ", "Nombre No Ingresado");
            return;
        }

        if (observacion) {
            if (observacion.length > 200) {
                showMsgBoxAlert("Excedió largo permitido para la Observación", "Validación Observacón");
                return;
            }
        }

		var cmdEnviarReferido = thisController.$this.find("#cmdEnviarReferido").button();
        enableButton(cmdEnviarReferido, false);

		
        var msg = "Recuerda que sólo puedes ingresar sólo un número como Referido por cada registro."
        msg += "¿Esta seguro que desea ingresar éste número?"

        showMsgBoxConfirm(msg, "Insertar Referido", function (result) {

            if (result == "Si") {

                var infoReferido = new Object();
                infoReferido.table = cicGetSbxGenerico1();
                infoReferido.callRegId = thisController.idReferido;
                infoReferido.callPaisId = cicGetCallPaisId();
                infoReferido.callCallcenterId = cicGetCallCallCenterId();
                infoReferido.callCanalId = cicGetCallCanalId();
                infoReferido.callFamiliaId = cicGetCallFamiliaId();
                infoReferido.callFecGestIni = thisController.parseFecha(cicGetCallFecGestIni());
                infoReferido.callFecGestFin = thisController.parseFecha(cicGetCallFecGestFin());
                infoReferido.callBatchId = cicGetCallBatchId();
                infoReferido.callSistemaId = "ININ";
                infoReferido.callArchivo = "Manual Referido";
                infoReferido.accId = cicGetAccId();
                infoReferido.accLineaId = telefono;
                infoReferido.accCampanaId = cicGetAccCampanaId();
                infoReferido.accHorario = cicGetAccHorario();
                infoReferido.accArg1Id = cicGetAccArg1Id();
                infoReferido.accArg2Id = cicGetAccArg2Id();
                infoReferido.accArg3Id = cicGetAccArg3Id();
                infoReferido.accPreg1 = cicGetAccPreg1();
                infoReferido.accResp1 = "";
                infoReferido.accPreg2 = cicGetAccPreg2();
                infoReferido.accResp2 = "";
                infoReferido.accScore = "";
                infoReferido.cliId = "";
                infoReferido.cliRutConDv = "";
                infoReferido.cliNombre = nombre;
                infoReferido.cliSegmento = "";
                infoReferido.cliGse = "";
                infoReferido.cliAntiguedad = "";
                infoReferido.cliLineaAntiguedad = "";
                infoReferido.cliCicloCod = "";
                infoReferido.cliIndPortado = "";
                infoReferido.cliUltBoletaMonto = "";
                infoReferido.cliContacAlter = "";
                infoReferido.cliContacAlterFijo = "";
                infoReferido.cliContacAlterMovil = "";
                infoReferido.prodVigDesc = "";
                infoReferido.prodVigPrecio = "";
                infoReferido.prodVigFinPromo = "";
                infoReferido.dirCalle = "";
                infoReferido.dirNro = "";
                infoReferido.dirPiso = "";
                infoReferido.dirDepto = "";
                infoReferido.dirComuna = "";
                infoReferido.dirCiudad = "";
                infoReferido.dirRegion = "";
                infoReferido.oferP1Cod = cicGetOferP1Cod();
                infoReferido.oferP1Desc = cicGetOferP1Desc();
                infoReferido.oferP1Precio = cicGetOferP1Precio();
                infoReferido.oferP1Delta = cicGetOferP1Delta();
                infoReferido.oferP2Cod = cicGetOferP2Cod();
                infoReferido.oferP2Desc = cicGetOferP2Desc();
                infoReferido.oferP2Precio = cicGetOferP2Precio();
                infoReferido.oferP2Delta = cicGetOferP2Delta();
                infoReferido.oferP3Cod = cicGetOferP3Cod();
                infoReferido.oferP3Desc = cicGetOferP3Desc();
                infoReferido.oferP3Precio = cicGetOferP3Precio();
                infoReferido.oferP3Delta = cicGetOferP3Delta();
                infoReferido.oferP4Cod = cicGetOferP4Cod();
                infoReferido.oferP4Desc = cicGetOferP4Desc();
                infoReferido.oferP4Precio = cicGetOferP4Precio();
                infoReferido.oferP4Delta = cicGetOferP4Delta();
                infoReferido.oferP5Cod = cicGetOferP5Cod();
                infoReferido.oferP5Desc = cicGetOferP5Desc();
                infoReferido.oferP5Precio = cicGetOferP5Precio();
                infoReferido.oferP5Delta = cicGetOferP5Delta();
                infoReferido.ventaProdCod = "";
                infoReferido.ventaSistemaId = "";
                infoReferido.ventaOossCod = "";
                infoReferido.generico01 = "";
                infoReferido.generico02 = "";
                infoReferido.generico03 = "";
                infoReferido.generico04 = "";
                infoReferido.generico05 = "";
                infoReferido.generico06 = "";
                infoReferido.generico07 = "";
                infoReferido.generico08 = "";
                infoReferido.generico09 = "";
                infoReferido.generico10 = "";
                infoReferido.generico11 = "";
                infoReferido.generico12 = "";
                infoReferido.generico13 = "";
                infoReferido.generico14 = "";
                infoReferido.generico15 = cicGetSystemAgentId();
                infoReferido.generico16 = "";
                infoReferido.generico17 = "";
                infoReferido.generico18 = "";
                infoReferido.generico19 = "";
                infoReferido.cuartil = "REFERIDO";
                infoReferido.sxbObservaciones = thisController.$this.find("#edObsReferido").val();
                infoReferido.sxbConvergencia = "";
                infoReferido.sxbGenerico1 = cicGetSbxGenerico1();
                infoReferido.sxbGenerico2 = "";
                infoReferido.sxbGenerico3 = "";
                infoReferido.sxbReferido = "R";
                infoReferido.campaignName = cicGetCampaignName();
                infoReferido.agent = cicGetSystemAgentId();

                httpInvoke("SaveReferido.ges", { param: infoReferido }, function (resp) {
                    var status = resp.status;
                    if (status == 0) {
                        showMsgBoxInfo(resp.message, "Insertar Referido");
                    } else {
                        enableButton(cmdEnviarReferido, true);
                        showMsgBoxAlert(resp.message, "Insertar Referido");
                    }
                }, function (msg) {
                    showMsgBoxError(msg, "Insertar Referido");
                    enableButton(cmdEnviarReferido, true);
                });

            }        
            else {
                enableButton(cmdEnviarReferido, true);
                return;
            }

        });
    },
    calculaEdadCliente: function(esRespaldo){
        var thisController = this;
        var dia = thisController.$this.find("#edDiaNacimiento" + (esRespaldo ? "Resp" : "")).val();
        var mes = thisController.$this.find("#edMesNacimiento" + (esRespaldo ? "Resp" : "")).val();
        var anno = thisController.$this.find("#edAnoNacimiento" + (esRespaldo ? "Resp" : "")).val();

        var txtVal = dia + "/" + mes + "/" + anno;

        if (thisController.isDate(txtVal)) {
            if (!thisController.isMayorEdad(txtVal)) {
                showMsgBoxAlert("No se puede vender a Clientes menores de edad", "Validacion Cliente");
                thisController.$this.find("#edEdad" + (esRespaldo ? "Resp" : "")).val("");

                thisController.$this.find("#edDiaNacimiento" + (esRespaldo ? "Resp" : "")).val("DD");
                thisController.$this.find("#edMesNacimiento" + (esRespaldo ? "Resp" : "")).val("MM");
                thisController.$this.find("#edAnoNacimiento" + (esRespaldo ? "Resp" : "")).val("AAAA");

                return;
            }
            if (thisController.isTerceraEdad(txtVal)) {
                showMsgBoxAlert("No se puede vender a Clientes con más de 70 años", "Validación Cliente");
                thisController.$this.find("#edEdad" + (esRespaldo ? "Resp" : "")).val("");

                thisController.$this.find("#edDiaNacimiento" + (esRespaldo ? "Resp" : "")).val("DD");
                thisController.$this.find("#edMesNacimiento" + (esRespaldo ? "Resp" : "")).val("MM");
                thisController.$this.find("#edAnoNacimiento" + (esRespaldo ? "Resp" : "")).val("AAAA");
                return;
            } else {
                var edad = thisController.calcularEdad(txtVal);
                if (thisController.isDate(txtVal))
                    thisController.$this.find("#edEdad" + (esRespaldo ? "Resp" : "")).val(edad);
            }
        } else {
            showMsgBoxAlert('Fecha No Válida, debe ingresar Fecha de Nacimiento correcta', "Validacion Fecha");
            thisController.$this.find("#edEdad" + (esRespaldo ? "Resp" : "")).val("");
            return;
        }

    },
    getCliente: function () {
        var thisController = this;
        var cliente = new Object();
        if (thisController.$this.find("#edClienteRespaldo").is(':checked')) {
            cliente.checkClienteRespaldo = thisController.$this.find("#edClienteRespaldo").is(':checked');
            cliente.nombreCliResp = thisController.$this.find("#edNombreClienteResp").val();
            cliente.rutCliResp = thisController.$this.find("#edRutClienteResp").val();
            cliente.serieCliResp = thisController.$this.find("#edSerieRutResp").val();
            var diaResp = thisController.$this.find("#edDiaNacimientoResp").val();
            var mesResp = thisController.$this.find("#edMesNacimientoResp").val();
            var anoResp = thisController.$this.find("#edAnoNacimientoResp").val();
            var fechaNacimientoResp = diaResp + "/" + mesResp + "/" + anoResp;
            cliente.fechaNacimientoCliResp = (thisController.isDate(fechaNacimientoResp) ? fechaNacimientoResp : "");
            cliente.emailCliResp = thisController.$this.find("#edEmailResp").val();
            cliente.fono1CliResp = thisController.$this.find("#edFonoContacto1Resp").val();
            cliente.fono2CliResp = thisController.$this.find("#edFonoContacto2Resp").val();
            cliente.fono3CliResp = thisController.$this.find("#edFonoContacto3Resp").val();
            cliente.calleCliResp = thisController.$this.find("#edCalleResp").val();
            cliente.entreCalleCliResp = thisController.$this.find("#edEntreCalleResp").val();
            cliente.yCalleCliResp = thisController.$this.find("#edYCalleResp").val();
            cliente.numeroCliResp = thisController.$this.find("#edNumeroResp").val();
            cliente.pisoCliResp = thisController.$this.find("#edPisoResp").val();
            cliente.deptoCliResp = thisController.$this.find("#edDeptoResp").val();
            var region = thisController.$this.find("#edRegionResp").val();
            var comuna = thisController.$this.find("#edComunaResp").val();
            cliente.regionCliResp = !region || region == "SELECCIONE" ? "" : region;
            cliente.comunaCliResp = !comuna || comuna == "SELECCIONE" ? "" : comuna;
            cliente.regionDescCliResp = !region || region == "SELECCIONE" ? "" : thisController.$this.find("#edRegionResp option:selected").text();
            cliente.comunaDescCliResp = !comuna || comuna == "SELECCIONE" ? "" : thisController.$this.find("#edComunaResp option:selected").text();

            cliente.notificarCliResp = thisController.$this.find("#edNotificarResp").is(':checked');

            cliente.nombreCli = thisController.$this.find("#edNombreClienteResp").val();
            cliente.rutCli = thisController.$this.find("#edRutClienteResp").val();
            cliente.serieCli = thisController.$this.find("#edSerieRutResp").val();
            var dia = thisController.$this.find("#edDiaNacimientoResp").val();
            var mes = thisController.$this.find("#edMesNacimientoResp").val();
            var ano = thisController.$this.find("#edAnoNacimientoResp").val();
            var fechaNacimiento = dia + "/" + mes + "/" + ano;
            cliente.fechaNacimientoCli = (thisController.isDate(fechaNacimiento) ? fechaNacimiento: "");
            cliente.emailCli = thisController.$this.find("#edEmailResp").val();
            cliente.fono1Cli = thisController.$this.find("#edFonoContacto1Resp").val();
            cliente.fono2Cli = thisController.$this.find("#edFonoContacto2Resp").val();
            cliente.fono3Cli = thisController.$this.find("#edFonoContacto3Resp").val();
            cliente.calleCli = thisController.$this.find("#edCalleResp").val();
            cliente.entreCalleCli = thisController.$this.find("#edEntreCalleResp").val();
            cliente.yCalleCli = thisController.$this.find("#edYCalleResp").val();
            cliente.numeroCli = thisController.$this.find("#edNumeroResp").val();
            cliente.pisoCli = thisController.$this.find("#edPisoResp").val();
            cliente.deptoCli = thisController.$this.find("#edDeptoResp").val();
            var region = thisController.$this.find("#edRegionResp").val();
            var comuna = thisController.$this.find("#edComunaResp").val();

            cliente.regionCli = !region || region == "SELECCIONE" ? "" : region;
            cliente.comunaCli = !comuna || comuna == "SELECCIONE" ? "" : comuna;
            cliente.regionDescCli = !region || region == "SELECCIONE" ? "" : thisController.$this.find("#edRegionResp option:selected").text();
            cliente.comunaDescCli = !comuna || comuna == "SELECCIONE" ? "" : thisController.$this.find("#edComunaResp option:selected").text();

            cliente.regionDescContCli = !region || region == "SELECCIONE" ? "" : thisController.$this.find("#edRegionResp option:selected").text();
            cliente.comunaDescContCli = !comuna || comuna == "SELECCIONE" ? "" : thisController.$this.find("#edComunaResp option:selected").text();

            cliente.regionDescConvCli = !region || region == "SELECCIONE" ? "" : thisController.$this.find("#edRegionResp option:selected").text();
            cliente.comunaDescConvCli = !comuna || comuna == "SELECCIONE" ? "" : thisController.$this.find("#edComunaResp option:selected").text();
            
            cliente.notificarCli = thisController.$this.find("#edNotificarResp").is(':checked');
        } else {
            cliente.nombreCli = thisController.$this.find("#edNombreCliente").val();
            cliente.rutCli = thisController.$this.find("#edRutCliente").val();
            cliente.serieCli = thisController.$this.find("#edSerieRut").val();
            var dia = thisController.$this.find("#edDiaNacimiento").val();
            var mes = thisController.$this.find("#edMesNacimiento").val();
            var ano = thisController.$this.find("#edAnoNacimiento").val();
            var fechaNacimiento = dia + "/" + mes + "/" + ano;
            cliente.fechaNacimientoCli = (thisController.isDate(fechaNacimiento) ? fechaNacimiento : "");
            cliente.emailCli = thisController.$this.find("#edEmail").val();
            cliente.fono1Cli = thisController.$this.find("#edFonoContacto1").val();
            cliente.fono2Cli = thisController.$this.find("#edFonoContacto2").val();
            cliente.fono3Cli = thisController.$this.find("#edFonoContacto3").val();
            cliente.calleCli = thisController.$this.find("#edCalle").val();
            cliente.entreCalleCli = thisController.$this.find("#edEntreCalle").val();
            cliente.yCalleCli = thisController.$this.find("#edYCalle").val();
            cliente.numeroCli = thisController.$this.find("#edNumero").val();
            cliente.pisoCli = thisController.$this.find("#edPiso").val();
            cliente.deptoCli = thisController.$this.find("#edDepto").val();
	        var region = thisController.$this.find("#edRegion").val();
	        var comuna = thisController.$this.find("#edComuna").val();

	        cliente.regionCli = !region || region == "SELECCIONE" ? "" : region;
	        cliente.comunaCli = !comuna || comuna == "SELECCIONE" ? "" : comuna;
	        cliente.regionDescCli = !region || region == "SELECCIONE" ? "" : thisController.$this.find("#edRegion option:selected").text();
	        cliente.comunaDescCli = !comuna || comuna == "SELECCIONE" ? "" : thisController.$this.find("#edComuna option:selected").text();

	        cliente.regionDescContCli = !region || region == "SELECCIONE" ? "" : thisController.$this.find("#edRegion option:selected").text();
	        cliente.comunaDescContCli = !comuna || comuna == "SELECCIONE" ? "" : thisController.$this.find("#edComuna option:selected").text();

	        cliente.regionDescConvCli = !region || region == "SELECCIONE" ? "" : thisController.$this.find("#edRegion option:selected").text();
	        cliente.comunaDescConvCli = !comuna || comuna == "SELECCIONE" ? "" : thisController.$this.find("#edComuna option:selected").text();

            cliente.notificarCli = thisController.$this.find("#edNotificar").is(':checked');
        }
        
        return cliente;
    },
    calcularEdad: function (fecha) {
        var fechaActual = new Date()
        var diaActual = fechaActual.getDate();
        var mmActual = fechaActual.getMonth() + 1;
        var yyyyActual = fechaActual.getFullYear();
        var FechaNac = fecha.split("/");
        var diaCumple = FechaNac[0];
        var mmCumple = FechaNac[1];
        var yyyyCumple = FechaNac[2];
        //retiramos el primer cero de la izquierda
        if (mmCumple.substr(0, 1) == 0) {
            mmCumple = mmCumple.substring(1, 2);
        }
        //retiramos el primer cero de la izquierda
        if (diaCumple.substr(0, 1) == 0) {
            diaCumple = diaCumple.substring(1, 2);
        }
        var edad = yyyyActual - yyyyCumple;

        //validamos si el mes de cumpleaños es menor al actual
        //o si el mes de cumpleaños es igual al actual
        //y el dia actual es menor al del nacimiento
        //De ser asi, se resta un año
        if ((mmActual < mmCumple) || (mmActual == mmCumple && diaActual < diaCumple)) {
            edad--;
        }
        return edad;
    },
    isDate: function (txtDate) {
        var currVal = txtDate;
        var fechaActual = new Date();
        var diaActual = fechaActual.getDay();
        var mmActual = fechaActual.getMonth();
        var yyyyActual = fechaActual.getFullYear();

        if (currVal == '')
            return false;

        var rxDatePattern = /^(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{4})$/; //Declare Regex
        var dtArray = currVal.match(rxDatePattern); // is format OK?

        if (dtArray == null)
            return false;

        //Checks for dd/mm/yyyy format.
        var dtDay = dtArray[1];
        var dtMonth = dtArray[3];
        var dtYear = dtArray[5];

        if (dtMonth < 1 || dtMonth > 12)
            return false;
        else if (dtDay < 1 || dtDay > 31)
            return false;
        else if ((dtMonth == 4 || dtMonth == 6 || dtMonth == 9 || dtMonth == 11) && dtDay == 31)
            return false;
        else if (dtMonth == 2) {
            var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
            if (dtDay > 29 || (dtDay == 29 && !isleap))
                return false;
        }

        else if (dtYear >= yyyyActual) {
            return false;
        }

        return true;
    },
    isMayorEdad: function (txtDate) {
        var currVal = txtDate;
        var fechaActual = new Date();
        var diaActual = fechaActual.getDay();
        var mmActual = fechaActual.getMonth();
        var yyyyActual = fechaActual.getFullYear();

        if (currVal == '')
            return false;

        var rxDatePattern = /^(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{4})$/; //Declare Regex
        var dtArray = currVal.match(rxDatePattern); // is format OK?

        if (dtArray == null)
            return false;

        //Checks for dd/mm/yyyy format.
        var dtDay = dtArray[1];
        var dtMonth = dtArray[3];
        var dtYear = dtArray[5];

        if (dtMonth < 1 || dtMonth > 12)
            return false;
        else if (dtDay < 1 || dtDay > 31)
            return false;
        else if ((dtMonth == 4 || dtMonth == 6 || dtMonth == 9 || dtMonth == 11) && dtDay == 31)
            return false;
        else if (dtMonth == 2) {
            var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
            if (dtDay > 29 || (dtDay == 29 && !isleap))
                return false;
        }

        else if (dtYear >= yyyyActual) {
            return false;
        }

        else if (dtYear >= (yyyyActual - 16)) {
            return false;
        }

        var fechaMaxima = new Date();
        //var fechaMinima = new Date();

        fechaMaxima.setFullYear(fechaMaxima.getFullYear() - 18, fechaMaxima.getMonth(), fechaMaxima.getDate());

        //fechaMinima.setFullYear(fechaMinima.getFullYear() - 70, fechaMaxima.getMonth(), fechaMaxima.getDate());

        var fechaIngresada = new Date();
        fechaIngresada.setFullYear(dtYear, dtMonth - 1, dtDay);

        //alert(fechaIngresada.toDateString() + " - " + fechaActual.toDateString());

        if (fechaIngresada > fechaMaxima) {
            return false;
        }

        return true;
    },
    isTerceraEdad: function (txtDate) {
        var currVal = txtDate;
        var fechaActual = new Date();
        var diaActual = fechaActual.getDay();
        var mmActual = fechaActual.getMonth();
        var yyyyActual = fechaActual.getFullYear();

        if (currVal == '')
            return false;

        var rxDatePattern = /^(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{4})$/; //Declare Regex
        var dtArray = currVal.match(rxDatePattern); // is format OK?

        if (dtArray == null)
            return false;

        //Checks for dd/mm/yyyy format.
        var dtDay = dtArray[1];
        var dtMonth = dtArray[3];
        var dtYear = dtArray[5];

        if (dtMonth < 1 || dtMonth > 12)
            return false;
        else if (dtDay < 1 || dtDay > 31)
            return false;
        else if ((dtMonth == 4 || dtMonth == 6 || dtMonth == 9 || dtMonth == 11) && dtDay == 31)
            return false;
        else if (dtMonth == 2) {
            var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
            if (dtDay > 29 || (dtDay == 29 && !isleap))
                return false;
        }

        else if (dtYear >= yyyyActual) {
            return false;
        }

        else if (dtYear >= (yyyyActual - 16)) {
            return false;
        }

        var fechaMinima = new Date();

        fechaMinima.setFullYear(fechaMinima.getFullYear() - 70, fechaMinima.getMonth(), fechaMinima.getDate());

        var fechaIngresada = new Date();
        fechaIngresada.setFullYear(dtYear, dtMonth - 1, dtDay);

        if (fechaIngresada < fechaMinima) {
            return true;
        }

        return false;
    },
    isFechaFutura: function (txtDate, horas, minutos) {
        var currVal = txtDate;
        var fechaActual = new Date();
        var diaActual = fechaActual.getDay();
        var mmActual = fechaActual.getMonth();
        var yyyyActual = fechaActual.getFullYear();

        if (currVal == '')
            return false;

        var rxDatePattern = /^(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{4})$/; //Declare Regex
        var dtArray = currVal.match(rxDatePattern); // is format OK?

        if (dtArray == null)
            return false;

        //Checks for dd/mm/yyyy format.
        dtDay = dtArray[1];
        dtMonth = dtArray[3];
        dtYear = dtArray[5];

        if (dtMonth < 1 || dtMonth > 12)
            return false;
        else if (dtDay < 1 || dtDay > 31)
            return false;
        else if ((dtMonth == 4 || dtMonth == 6 || dtMonth == 9 || dtMonth == 11) && dtDay == 31)
            return false;
        else if (dtMonth == 2) {
            var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
            if (dtDay > 29 || (dtDay == 29 && !isleap))
                return false;
        }

        else if (dtYear < yyyyActual) {
            return false;
        }

        var fechaMinima = new Date();
        var fechaIngresada = new Date();
        fechaIngresada.setFullYear(dtYear, dtMonth - 1, dtDay);
        fechaIngresada.setHours(horas, minutos, 0, 0);

        if (fechaIngresada < fechaMinima) {
            return false;
        }

        return true;
    },
    parseFecha: function (fechaIn) {
        if (fechaIn == "undefined" || !fechaIn) {
            return "";
        }

        else {
            var anio = fechaIn.substring(0, 4);
            var mes = fechaIn.substring(5, 7);
            var dia = fechaIn.substring(8, 10);
            var fechaFinal = dia + "/" + mes + "/" + anio;
            return fechaFinal;
        }
    }


};