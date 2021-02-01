var bandera_ticket = false;
var amountObject = {};
var controller = {
    $this: null,
    idReferido: "-1",
    onGetRegionesComunaArray: null,
    onGetMetaDataObject: null,
    init: function (container, options) {
        this.$this = $(container.children()[0]);
        var thisController = this;

        cicTrace("Cliente - Inicio Init");

        var tabsCliente = thisController.$this.find("#tabsCliente").tabs();

        initializeTabsLayout(tabsCliente);

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

        //Validaciones
        //RUT
        thisController.$this.find(".rut").blur(function () {
            var rutAValidar = $(this).val();
            var validacion = validateRut(rutAValidar);
            if (validacion) {
                showMsgBoxAlert(validacion, "Validación Rut");
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
        //thisController.$this.find(".telefono").inputmask('Regex', { regex: "[2-9][0-9]{8}" });
        thisController.$this.find(".telefono").blur(function () {
            if ($(this).val().length == 0) return;
            if (!$(this).inputmask("isComplete")) {
                showMsgBoxAlert("El teléfono debe contener 9 dígitos", "Validación Teléfono");
                $(this).val("");
            }
        });

        thisController.$this.find("#edEmail").blur(function () {
            if ($(this).val().length == 0) return;
            var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
            if (!re.test($(this).val())) {
                showMsgBoxAlert("El formato de email no es válido", "Validación Email");
                $(this).val("");
            }
        });

        thisController.$this.find("#edRegion").change(function () {
            thisController.refrescaComuna();
        });

       
        cicTrace("Cliente - Fin Init");
    },
    refresca: function () {
        cicTrace("cliente Inicio Refresca");
        var thisController = this;
        
        var cmdEnviarReferido = thisController.$this.find("#cmdEnviarReferido").button();
        enableButton(cmdEnviarReferido, true);
        thisController.idReferido = "-1";

        thisController.$this.find("#edNombreCliente").val(cicGetCliNombre());
        thisController.$this.find("#edRutCliente").val(cicGetCliRutConDV());
        thisController.$this.find("#edSerieRut").val("");
		thisController.$this.find("#edTicketValida").val("");
        thisController.$this.find("#edFonoContacto1").val(cicGetCliContacAlter());
        thisController.$this.find("#edFonoContacto2").val(cicGetCliContacAlterFijo());
        thisController.$this.find("#edFonoContacto3").val(cicGetCliContacAlterMovil());

        var metaDataObject = thisController.onGetMetaDataObject();
        var familia = (metaDataObject ? metaDataObject.callFamiliaId : cicGetCallFamiliaId());

        thisController.$this.find("#edEmail").val();
        thisController.$this.find("#edCalle").val(cicGetDirCalle());
        thisController.$this.find("#edEntreCalle").val("");
        thisController.$this.find("#edYCalle").val("");
        thisController.$this.find("#edNumero").val(cicGetDirNro());
        thisController.$this.find("#edPiso").val(cicGetDirPiso());
        thisController.$this.find("#edDepto").val(cicGetDirDepto());
        
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
            thisController.refrescaComuna();
        }
        
        //alert("Region: " + regionValue + "  -  Comuna: " + comunaValue);

        var fechaNacimiento = cicGetGenerico03();
        if (!fechaNacimiento) {
            thisController.$this.find("#edDiaNacimiento").val("DD");
            thisController.$this.find("#edMesNacimiento").val("MM");
            thisController.$this.find("#edAnoNacimiento").val("AAAA");
        } else {
            thisController.$this.find("#edDiaNacimiento").val(fechaNacimiento.substring(8));
            thisController.$this.find("#edMesNacimiento").val(fechaNacimiento.substring(5, 7));
            thisController.$this.find("#edAnoNacimiento").val(fechaNacimiento.substring(0, 4));
        }        
  
        thisController.$this.find("#edEdad").val("");
        thisController.$this.find("#edNombreReferido").val("");
        thisController.$this.find("#edTelefonoReferido").val("");
        thisController.$this.find("#edObsReferido").val("");

        thisController.$this.find("#edNotificar").removeAttr("checked");             

        cicTrace("cliente Fin Refresca");
    },
    refrescaComuna:function(){
        
        var regionSelected = this.$this.find("#edRegion").val();

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

        this.$this.find("#edComuna").html(html);

    },
    initializeRegionComuna: function () {

        var html = "<option value='SELECCIONE'>Seleccione</option>";
        $.each(this.onGetRegionesComunaArray(), function (i, r) {
            html += "<option value='" + r.numero + "' title='" + r.nombre + "'>" + r.nombre + "</option>";
        });

        this.$this.find("#edRegion").html(html);

    },
    setActiveTabs: function (index) {
        var thisController = this;
        thisController.$this.find("#tabsCliente").tabs({ active: index });
    },
    enviarReferido: function () {
        var thisController = this;
        
        var cmdEnviarReferido = thisController.$this.find("#cmdEnviarReferido").button();
        enableButton(cmdEnviarReferido, false);

        var nombre = thisController.$this.find("#edNombreReferido").val();
        var telefono = thisController.$this.find("#edTelefonoReferido").val();
        var observacion = thisController.$this.find("#edObsReferido").val();

        var msg = "";

        if (!nombre) {
            msg += "- Debe ingresar Nombre para ingresar un Cliente Referido. <br>";
        }
        if (!telefono) {
            msg += "- Debe ingresar Teléfono para ingresar un Cliente Referido. <br>";
        }

        if (observacion) {
            if (observacion.length > 200) {
                msg += "- Se excedió largo permitido para la Observación. <br>";
            }
        }

        if (msg.length > 0) {
            showMsgBoxAlert(msg, "Insertar Referido");
            enableButton(cmdEnviarReferido, true);
            return;
        }

        var msg = "Recuerda que solo puedes ingresar un solo número como Referido por cada registro.<br>";
        msg += "¿Estas seguro que deseas ingresar éste número?.<br>"

        var msgHeight = thisController.getHeightMessage(msg);

        showMsgBoxConfirm(msg, "Insertar Referido", function (result) {

            if (result == "Si") {
                
                var infoMetaObject = thisController.onGetMetaDataObject();

                var infoReferido = new Object();
                infoReferido.table = infoMetaObject.sxbGenerico1;
                infoReferido.callRegId = thisController.idReferido;
                infoReferido.callPaisId = infoMetaObject.callPaisId;
                infoReferido.callCallcenterId = infoMetaObject.callCallcenterId;
                infoReferido.callCanalId = infoMetaObject.callCanalId;
                infoReferido.callFamiliaId = infoMetaObject.callFamiliaId;
                infoReferido.callFecGestIni = "";
                infoReferido.callFecGestFin = "";
                infoReferido.callBatchId = infoMetaObject.callBatchId;
                infoReferido.callSistemaId = "ININ";
                infoReferido.callArchivo = "Manual Referido";
                infoReferido.accId = cicGetAccId();
                infoReferido.accLineaId = telefono;
                infoReferido.accCampanaId = infoMetaObject.accCampanaId;
                infoReferido.accHorario = infoMetaObject.accHorario;
                infoReferido.accArg1Id = infoMetaObject.accArg1Id;
                infoReferido.accArg2Id = infoMetaObject.accArg2Id;
                infoReferido.accArg3Id = infoMetaObject.accArg3Id;
                infoReferido.accPreg1 = infoMetaObject.accPreg1;
                infoReferido.accResp1 = "";
                infoReferido.accPreg2 = infoMetaObject.accPreg2;
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
                infoReferido.oferP1Cod = "";
                infoReferido.oferP1Desc = "";
                infoReferido.oferP1Precio = "";
                infoReferido.oferP1Delta = "";
                infoReferido.oferP2Cod = "";
                infoReferido.oferP2Desc = "";
                infoReferido.oferP2Precio = "";
                infoReferido.oferP2Delta = "";
                infoReferido.oferP3Cod = "";
                infoReferido.oferP3Desc = "";
                infoReferido.oferP3Precio = "";
                infoReferido.oferP3Delta = "";
                infoReferido.oferP4Cod = "";
                infoReferido.oferP4Desc = "";
                infoReferido.oferP4Precio = "";
                infoReferido.oferP4Delta = "";
                infoReferido.oferP5Cod = "";
                infoReferido.oferP5Desc = "";
                infoReferido.oferP5Precio = "";
                infoReferido.oferP5Delta = "";
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
                infoReferido.generico17 = (app.isInboundCall ? infoMetaObject.generico17 : cicGetGenerico17());
                infoReferido.generico18 = "";
                infoReferido.generico19 = "";
                infoReferido.cuartil = "REFERIDO";
                infoReferido.sxbObservaciones = observacion;
                infoReferido.sxbConvergencia = "";
                infoReferido.sxbGenerico1 = infoMetaObject.sxbGenerico1;
                infoReferido.sxbGenerico2 = "";
                infoReferido.sxbGenerico3 = "";
                infoReferido.sxbReferido = "R";
                infoReferido.campaignName = infoMetaObject.i3Campaignname;
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

        }, msgHeight);

    },
    calculaEdadCliente: function(esRespaldo){
        var thisController = this;
        var dia = thisController.$this.find("#edDiaNacimiento" + (esRespaldo ? "Resp" : "")).val();
        var mes = thisController.$this.find("#edMesNacimiento" + (esRespaldo ? "Resp" : "")).val();
        var anno = thisController.$this.find("#edAnoNacimiento" + (esRespaldo ? "Resp" : "")).val();

        var txtVal = dia + "/" + mes + "/" + anno;

        if (thisController.isDate(txtVal)) {
            if (!thisController.isMayorEdad(txtVal)) {
                showMsgBoxAlert("No se puede vender a Clientes menores de edad", "Validación Fecha Nacimento");
                thisController.$this.find("#edEdad" + (esRespaldo ? "Resp" : "")).val("");

                thisController.$this.find("#edDiaNacimiento" + (esRespaldo ? "Resp" : "")).val("DD");
                thisController.$this.find("#edMesNacimiento" + (esRespaldo ? "Resp" : "")).val("MM");
                thisController.$this.find("#edAnoNacimiento" + (esRespaldo ? "Resp" : "")).val("AAAA");

                return;
            }
            if (thisController.isTerceraEdad(txtVal)) {
                showMsgBoxAlert("No se puede vender a Clientes con más de 70 años", "Validación Fecha Nacimento");
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
            showMsgBoxAlert('Fecha No Válida, debe ingresar Fecha de Nacimiento correcta', "Validación Fecha Nacimento");
            thisController.$this.find("#edEdad").val("");
            return;
        }

    },
    getCliente: function () {
        var thisController = this;
        var cliente = new Object();
        var metaDataObject = thisController.onGetMetaDataObject();
        var familia = (metaDataObject ? metaDataObject.callFamiliaId : cicGetCallFamiliaId());
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
        cliente.notificarCli = thisController.$this.find("#edNotificar").is(':checked');
        
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
    },
    getHeightMessage: function(msg) {
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