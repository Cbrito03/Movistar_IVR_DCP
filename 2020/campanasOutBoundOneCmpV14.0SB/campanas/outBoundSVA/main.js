var controller = {
    $this: null,
    waitingController: null,
    breakController: null,
    callController: null,
    botoneraController: null,
    headerController: null,
    idGestion: -1,
    enviadoBO: false,
    dialerObj: null,
    intentosEnviarBO: 0,
    finishLoadingWSData: false,
    campaingMode: "undefined",
	  metaDataObject: null,
    finishingCall: false,

    init: function (container, options) {
        this.$this = $(container.children()[0]);
        var thisController = this;
        
        cicTrace("Init Main");

        app.callBackFinishLoad = function () {
            app.totalServicesLoaded++;
            cicTrace("Services Load Finish: " + app.totalServicesLoaded + " Of " + app.totalServicesCallToInitialize);
            if (app.totalServicesLoaded == app.totalServicesCallToInitialize) {
                thisController.finishLoadingWSData = true;
                thisController.checkInitialLoading();
            }
        }

        var cmdEnviarBO = thisController.$this.find("#cmdEnviarBO").button();
        var cmdFinalizar = thisController.$this.find("#cmdFinalizar").button();

        cmdEnviarBO.click(function (event) {
            if (!isButtonEnabled(this)) {
                return false;
            } else {
                thisController.enviarBO();
                return true;
            }
        });

        cmdEnviarBO.hide();

        cmdFinalizar.click(function (event) {
            if (!isButtonEnabled(this)) {
                return false;
            } else {
                thisController.finalizar();
                return true;
            }
        });
        
        var mainArea = this.$this.find("#mainArea").zPager({
            pages: [
                { code: "waiting", url: "campanas/common/esperando-llamada", initial: campana.estado == "waiting" || campana.estado == "initializing" },
                { code: "break", url: "campanas/common/en-break", initial: campana.estado == "break" },
                { code: "call", url: "campanas/outBoundSVA/en-llamada", initial: (campana.estado == "call" || campana.estado == "preview")}
            ],
            onReady: function () {
                thisController.waitingController = mainArea.zPager("controller", "waiting");
                thisController.breakController = mainArea.zPager("controller", "break");
                thisController.breakController.onGetEstadoAgente = function () {
                    return thisController.botoneraController.getEstadoAgente();
                }
                thisController.callController = mainArea.zPager("controller", "call");
                thisController.callController.onBackLoadingComplete = function () {
                    thisController.checkInitialLoading();
                }
                
                thisController.callController.onGetLlamadaConectada = function () {
                    return (thisController.botoneraController.getLlamadaConectada());
                }
                thisController.callController.onSwitchOffEnviadoBO = function () {
                    thisController.enviadoBO = false;
                }
                thisController.callController.onSetAtributoGrabacion = function (atributo, valor) {
                    thisController.botoneraController.setAtributoGrabacion(atributo, valor);
                }
                thisController.callController.onGetMaxDiasAgenda = function () {
                    return (thisController.botoneraController.maxDiasAgenda);
                }
            }
        });
        whenAutoloadReady("al-header", function () {
            cicTrace("whenAutoloadReady Header");
            thisController.headerController = thisController.$this.find("#al-header").data("controller");

            thisController.headerController.onGetNumeroMaximoLlamadas = function () {
                return thisController.botoneraController.nroMaximoLlamadas;
            }

            thisController.inicializaHeaderBotonera();

        });
		
        whenAutoloadReady("al-botonera", function () {
            cicTrace("whenAutoloadReady Botonera");
            thisController.botoneraController = thisController.$this.find("#al-botonera").data("controller");
            thisController.botoneraController.loadWrapUpCodes("SVA");
            thisController.botoneraController.loadSpeedDialList();
            thisController.botoneraController.loadMaxDiasAgenda();
            thisController.botoneraController.loadIVRConfirmacion();
			
			thisController.botoneraController.onFinishingCall = function () {
			clearTimeout(thisController.botoneraController.deshabilitarrediscado);
	       thisController.botoneraController.deshabilitarrediscado = null;
		   clearTimeout(thisController.botoneraController.cierreLlamadaTimeOut);
           thisController.botoneraController.cierreLlamadaTimeOut = null;
           clearTimeout(thisController.botoneraController.msgCierreLlamadaTimeOut);
           thisController.botoneraController.msgCierreLlamadaTimeOut = null;
        
                return thisController.finishingCall;
				
            }
          

   thisController.botoneraController.onAutomaticFinish = function () {
			
					 clearTimeout(thisController.botoneraController.deshabilitarrediscado);
	       thisController.botoneraController.deshabilitarrediscado = null;
		   clearTimeout(thisController.botoneraController.cierreLlamadaTimeOut);
           thisController.botoneraController.cierreLlamadaTimeOut = null;
           clearTimeout(thisController.botoneraController.msgCierreLlamadaTimeOut);
           thisController.botoneraController.msgCierreLlamadaTimeOut = null;
        
                thisController.finalizar(true);
				
				
            }


		  thisController.botoneraController.onBackEndBreak = function () {
                campana.estado = "waiting";
                thisController.cambioEstado();
				clearTimeout(thisController.botoneraController.deshabilitarrediscado);
	       thisController.botoneraController.deshabilitarrediscado = null;
		   clearTimeout(thisController.botoneraController.cierreLlamadaTimeOut);
           thisController.botoneraController.cierreLlamadaTimeOut = null;
           clearTimeout(thisController.botoneraController.msgCierreLlamadaTimeOut);
           thisController.botoneraController.msgCierreLlamadaTimeOut = null;
		   }
					

            thisController.botoneraController.onRefrescaHeader = function (isConnected) {
                thisController.headerController.refresca(isConnected);
            }

            thisController.botoneraController.onGoToBreak = function () {
                thisController.goToBreak();
            }

            thisController.botoneraController.onGetRutCliente = function () {
                return thisController.callController.cierreController.getRutCliente();
            }

            thisController.botoneraController.onCampaingMode = function () {
                return thisController.campaingMode;
            }

            thisController.botoneraController.onRefrescaBreak = function () {
                thisController.breakController.refresca();
            }

            thisController.inicializaHeaderBotonera();
          
        });
          
		  
		  
		  
        // Registrar Eventos
        cicAddListener("BreakGranted", function () {
            cicTrace("BreakGranted Event");
            thisController.goToBreak();
        });

        cicAddListener("PreviewDataPop", function () {
            //alert("PreviewDataPop Event");
            cicTrace("PreviewDataPop Event");
            thisController.isPreviewMode = true;
            campana.estado = "preview";
            thisController.campaingMode = "preview";
            thisController.loadingToCall();
        });

        cicAddListener("NewPreviewCall", function () {
            cicTrace("NewPreviewCall Event");
            thisController.campaingMode = "preview";
            campana.estado = "call";
            thisController.loadingToCall();
        });

        cicAddListener("NewPredictiveCall", function (callid) {
            cicTrace("NewPredictiveCall Event");

            if (app.hasLastCallExecuteManual) {
                cicTrace("Catch PredictiveEvent when Manual Call. Call ID: " + callid);

                if (thisController.botoneraController == null) {
                    cicTrace("Cant set Call Attributes thisController.botoneraController is null");
                    return;
                }

                if (thisController.botoneraController.ultimoRediscadoCallObject == null) {
                    cicTrace("Cant set Call Attributes thisController.botoneraController.ultimoRediscadoCallObject is null");
                    return;
                }

                thisController.botoneraController.ultimoRediscadoCallObject.setAttribute("ATTR_CALL_ID_ORIGINAL", thisController.botoneraController.callIdOriginal);
                thisController.botoneraController.ultimoRediscadoCallObject.setAttribute("ATTR_CORRELACION", thisController.botoneraController.callIdOriginal);
                thisController.botoneraController.ultimoRediscadoCallObject.setAttribute("ATTR_Nombre_Campana", cicGetCampaignName());
                thisController.botoneraController.ultimoRediscadoCallObject.setAttribute("ATTR_CUARTIL", cicGetCuartil());
                thisController.botoneraController.ultimoRediscadoCallObject.setAttribute("ATTR_Rediscado", "S");
                thisController.botoneraController.ultimoRediscadoCallObject.setAttribute("ATTR_MANUAL", "Llamada Rediscada");

                cicTrace("Success Setting Call Attributes");

                return;
            }

            thisController.campaingMode = "predictive";
            campana.estado = "call";
            thisController.loadingToCall();
        });

    },
    checkInitialLoading: function () {
        var thisController = this;

        //Check GUIs

        if (thisController.callController == null)
            return;
        if (thisController.callController.clienteController == null)
            return;
        if (thisController.callController.ofertaController == null)
            return;
        if (thisController.callController.gestionVentaController == null)
            return;
        if (thisController.callController.datosAdicionalesController == null)
            return;
        if (thisController.callController.cierreController == null)
            return;
        if (thisController.callController.referredController == null)
            return;
        if (thisController.callController.schedulerController == null)
            return;

        if (thisController.headerController == null)
            return;
        if (thisController.botoneraController == null)
            return;


        //Check Loading Data
        if (!thisController.finishLoadingWSData) return;

        campana.estado = "waiting";
        thisController.cambioEstado();

    },
    inicializaHeaderBotonera: function () {

        var thisController = this;

        if (thisController.headerController == null) return;
        if (thisController.botoneraController == null) return;        

        thisController.headerController.refresca();
        thisController.botoneraController.refresca();

        thisController.checkInitialLoading();

    },
    cambioEstado: function () {
        cicTrace("Cambio Estado: " + campana.estado);
        var thisController = this;
        var mainArea = thisController.$this.find("#mainArea");
        thisController.enviadoBO = false;
        thisController.idGestion = -1;
        thisController.intentosEnviarBO = 0;
        var cmdEnviarBO = thisController.$this.find("#cmdEnviarBO").button();
        thisController.botoneraController.refresca();
        if (campana.estado == "call") {
            mainArea.zPager("currentPage", "call");
			cicStage("0");
            thisController.headerController.refresca(true);
            if (thisController.campaingMode == "predictive") {
                thisController.callController.refresca();
                cicSetForeground();
                cicSelectPage();
            }
            cmdEnviarBO.show();
        }
        if (campana.estado == "break") {
            mainArea.zPager("currentPage", "break");
            thisController.headerController.refresca();
            thisController.breakController.refresca();
            cmdEnviarBO.hide();
            cicSetForeground();
            cicSelectPage();
            if (thisController.botoneraController.ultimoEstadoBreakRequest == "6") {
                setTimeout(function () {
                    thisController.botoneraController.logOffCampana();
                }, 2000);
            }
        }
        if (campana.estado == "waiting") {
            
            mainArea.zPager("currentPage", "waiting");

            if (thisController.botoneraController.requestBreak) {
                thisController.goToBreak();
                return;
            }
            thisController.headerController.refresca();
            cmdEnviarBO.hide();
            cicSetForeground();
            cicSelectPage();

            var cookingName = cicGetSystemAgentId() + "_" + "CampaingsLoaded";
            var loadedCampaings = readCookie(cookingName);
            if (loadedCampaings) {
                var counted = parseInt(loadedCampaings) + 1;
                createCookie(cookingName, counted, null);
            } else {
                var counted = 1;
                createCookie(cookingName, counted, null);
            }

            $.unblockUI();

            cicTrace("CampaingsLoaded: " + counted);
            var totalCampaingsActive = scripter.dialer.campaigns.length;
            cicTrace("TotalCampaingsActive: " + totalCampaingsActive);
            if (counted >= totalCampaingsActive) {
                cicTrace("Cambio Estado Agente a Available. Estado Actual: " + cicGetSystemClientStatus());
                cicClientStatus("Available");
            } else {
                cicTrace("Espera carga de otras campañas. Estado Actual: " + cicGetSystemClientStatus());
            }

        }
        if (campana.estado == "preview") {
            mainArea.zPager("currentPage", "call");
            thisController.headerController.refresca(true);
            thisController.callController.refresca();
            cicSetForeground();
            cicSelectPage();
        }

        if (campana.estado == "initializing") {
            thisController.headerController.refresca();
            cmdEnviarBO.hide();
            cicSetForeground();
            cicSelectPage();
        }
    },
    goToBreak: function () {
        var thisController = this;

        if (thisController.botoneraController != null) thisController.botoneraController.setAgentStatus(thisController.botoneraController.ultimoEstadoBreakRequest);
        thisController.botoneraController.requestBreak = false;
        thisController.botoneraController.ultimoEstadoBreakRequest = -1;

        if (campana.estado = "call" || campana.estado == "preview") {
            if (thisController.botoneraController.backOfficeCallObject != null) thisController.botoneraController.backOfficeCallObject.disconnect();
            if (!thisController.botoneraController.isTransferExecute && thisController.botoneraController.globalCallObject != null) thisController.botoneraController.globalCallObject.disconnect();
        }

        campana.estado = "break";
        thisController.cambioEstado();
    },
    loadingToCall: function () {
        var thisController = this;

        if (campana.estado != "call" && campana.estado != "preview")
            return;

        thisController.botoneraController.globalCallObject = scripter.callObject;
        thisController.dialerObj = scripter.dialer;

        thisController.botoneraController.globalCallObject.id = cicGetCallId();
        thisController.botoneraController.globalCallObject.stateChangeHandler = function (StateID, StateString) {
            thisController.botoneraController.cambiaEstadoLlamada(StateID, StateString);
        }

        thisController.botoneraController.globalCallObject.errorHandler = function (ErrorId, ErrorText) {
            thisController.botoneraController.errorEnLlamada(ErrorId, ErrorText);
        }

        thisController.cambioEstado();
    },
    enviarBO: function () {
        var thisController = this;
        cicTrace("Enviar BO");

        if (!thisController.callController.cierreController.generada) {
            showMsgBoxAlert("Debe generar la ficha antes de Enviar a BackOffice");
            cicTrace("[Main][EnviarBO] Ficha No Generada");
            return;
        }
        var info = thisController.getDataGestion(false, true);


        if (info) {

            //Valida Registro de CallId's segun rediscado
            var callIdOriginal = thisController.botoneraController.callIdOriginal;

            //i3Callid
            if (callIdOriginal == cicGetCallId()) {
                info.infoGestion.i3Callid = callIdOriginal;
                info.infoGestion.CallIdReintentos = "";
            } else {

                info.infoGestion.i3Callid = cicGetCallId();
                info.infoGestion.CallIdReintentos = callIdOriginal;

            }

            if (info.infoGestion.sxbObservaciones) {
                var observacionLength = info.infoGestion.sxbObservaciones.length;
                if (observacionLength > 600) {
                    showMsgBoxAlert("Excedió largo permitido para la observación")
                    return;
                }
            }
            if (info.infoGestion.despReferencia) {
                var referenciaLength = info.infoGestion.despReferencia.length;
                if (referenciaLength > 200) {
                    showMsgBoxAlert("Excedió largo permitido para la referencia de la dirección")
                    return;
                }
            }

            if (info.infoGestion.accResp1) {
                var resp1Length = info.infoGestion.accResp1.length;
                if (resp1Length > 200) {
                    showMsgBoxAlert("Excedió largo permitido para la respuesta N°1")
                    return;
                }

            }
            if (info.infoGestion.accResp2) {
                var resp2Length = info.infoGestion.accResp2.length;
                if (resp2Length > 200) {
                    showMsgBoxAlert("Excedió largo permitido para la respuesta N°2")
                    return;
                }

            }
        }
      
        cicTrace("[Main][enviarBO] info: " + info);

        if (info != null) {
            info.setDNC = false;
            var cmdEnviarBO = thisController.$this.find("#cmdEnviarBO").button();
            enableButton(cmdEnviarBO, false);
            httpInvoke("AddOrSaveGestionVenta.ges", { param: info }, function (resp) {
                thisController.enviadoBO = true;
                enableButton(cmdEnviarBO, true);
                thisController.idGestion = resp.idGestion;
                showMsgBoxInfo("La información fue enviada a BackOffice correctamente", "Informacion Correcta");
                cicTrace("[Main][enviarBO] Envio exitoso a BackOffice");
            }, function (msg) {
                showMsgBoxAlert(msg);
                enableButton(cmdEnviarBO, true);
            });
        }

    },
    finalizar: function (isAutomatic) {
        var thisController = this;
		clearTimeout(thisController.botoneraController.deshabilitarrediscado);
	       thisController.botoneraController.deshabilitarrediscado = null;
		   clearTimeout(thisController.botoneraController.cierreLlamadaTimeOut);
           thisController.botoneraController.cierreLlamadaTimeOut = null;
           clearTimeout(thisController.botoneraController.msgCierreLlamadaTimeOut);
           thisController.botoneraController.msgCierreLlamadaTimeOut = null;
        cicTrace("Finalizar en " + campana.estado);
		
		
		
		
        if (campana.estado == "waiting" || campana.estado == "break") {
            thisController.botoneraController.setAgentStatus("6"); //Fin Turno
            thisController.botoneraController.logOffCampana();
        }

        if (campana.estado == "call" || campana.estado == 'preview') {

            var codFinalizacion = thisController.botoneraController.getCodigoFinalizacion();
            cicTrace("Finalizar - CodFinalizacion '" + codFinalizacion + "'");
				clearTimeout(thisController.msgCierreLlamadaTimeOut);
                        clearTimeout(thisController.cierreLlamadaTimeOut);
						clearTimeout(thisController.deshabilitarrediscado);
						thisController.cierreLlamadaTimeOut = null;
						thisController.msgCierreLlamadaTimeOut= null;
						thisController.deshabilitarrediscado=null;
            
				  if (isAutomatic) {

  
   var codFinalizacion = "a3a3341e-6dca-491e-9e01-f8fcf2b073a3";
 // showMsgBoxAlert("Codigo Automatico:"+codFinalizacion );
  
   var estadoFinalizacion = "A";
	
 // showMsgBoxAlert("Codigo Automatico:"+estadoFinalizacion);
  
	
            
            }
            if (codFinalizacion == null || codFinalizacion == "Seleccione") {
                showMsgBoxAlert("Debe seleccionar un código de finalización");
                return;
            }

            var finalizaConVenta = false;

            var estadoFinalizacion = thisController.botoneraController.getEstadoFinalizacion();

            if (estadoFinalizacion == "1" || estadoFinalizacion == "2" || estadoFinalizacion == "3") {

                finalizaConVenta = true;

                if (thisController.idGestion == -1) {
                    showMsgBoxAlert("La información de Venta no fue enviada a Back Office, por lo tanto, no puede finalizar como Venta.");
                    return;
                }

            }

            //Controla cambios en Ficha no enviados a BO
            if (finalizaConVenta && !thisController.enviadoBO) {
                showMsgBoxAlert("Debe enviar a BackOffice los cambios en Ficha de Cierre");
                return;
            }


            var fechaAgendada;
            if (estadoFinalizacion == "4") {
                try {
                    fechaAgendada = thisController.botoneraController.getInfoAgendamiento();
                } catch (e) {
                    showMsgBoxInfo("Por favor, seleccione una fecha de agendamiento válida", "Fecha Agendamiento");
                    cicTrace("[Main][enviarBO] Error fecha Agendada: " + e);
                    return;
                }

                var intentosActuales = parseInt(cicGetAttemps());
                if (isNaN(intentosActuales)) intentosActuales = 0;
                var intentosDisponibles = thisController.botoneraController.nroMaximoLlamadas - (intentosActuales + 1)

                if (intentosDisponibles <= 0) {
                    showMsgBoxAlert("No es posible realizar un agendamiento debido a que se ha alcanzado el máximo de llamadas permitidas [" + thisController.botoneraController.nroMaximoLlamadas + "]");
                    cicTrace("[Main][EnviarBO] No puede agendar. Se alcanzo los [" + thisController.botoneraController.nroMaximoLlamadas + "] intentos permitidos");
                    return;
                }

            }

            var info = thisController.getDataGestion(true, finalizaConVenta);

            info.infoGestion.sxbReferido = cicGetSbxReferido();

            if (info) {

                //Valida Registro de CallId's segun rediscado
                var callIdOriginal = thisController.botoneraController.callIdOriginal;

                //i3Callid
                if (callIdOriginal == cicGetCallId()) {
                    info.infoGestion.i3Callid = callIdOriginal;
                    info.infoGestion.CallIdReintentos = "";
                } else {

                    info.infoGestion.i3Callid = cicGetCallId();
                    info.infoGestion.CallIdReintentos = callIdOriginal;

                }

                if (info.infoGestion.sxbObservaciones) {
                    var observacionLength = info.infoGestion.sxbObservaciones.length;
                    if (observacionLength > 600) {
                        showMsgBoxAlert("Excedió largo permitido para la observación")
                        return;
                    }
                }
                if (info.infoGestion.despReferencia) {
                    var referenciaLength = info.infoGestion.despReferencia.length;
                    if (referenciaLength > 200) {
                        showMsgBoxAlert("Excedió largo permitido para la referencia de la dirección")
                        return;
                    }
                }
            
                if (info.infoGestion.accResp1) {
                    var resp1Length = info.infoGestion.accResp1.length;
                    if (resp1Length > 200) {
                        showMsgBoxAlert("Excedió largo permitido para la respuesta N°1")
                        return;
                    }

                }
                if (info.infoGestion.accResp2) {
                    var resp2Length = info.infoGestion.accResp2.length;
                    if (resp2Length > 200) {
                        showMsgBoxAlert("Excedió largo permitido para la respuesta N°2")
                        return;
                    }

                }
            }

            cicTrace("[Main][enviarBO] info: " + info);
            if (info != null) {

                if (estadoFinalizacion == "4") {

                    var getClientesAgendar = thisController.callController.clienteController.getCliente();

                    info.infoGestion.cliContacAlter = getClientesAgendar.fono1Cli;
                    info.infoGestion.cliContacAlterFijo = getClientesAgendar.fono2Cli;
                    info.infoGestion.cliContacAlterMovil = getClientesAgendar.fono3Cli;
                    info.infoGestion.cliNombre = getClientesAgendar.nombreCli;
                    info.infoGestion.cliRutConDv = getClientesAgendar.rutCli;
                    info.infoGestion.dirCalle = getClientesAgendar.calleCli;
                    info.infoGestion.dirComuna = getClientesAgendar.comunaCli;
                    info.infoGestion.dirDepto = getClientesAgendar.deptoCli;
                    info.infoGestion.dirNro = getClientesAgendar.numeroCli;
                    info.infoGestion.dirPiso = getClientesAgendar.pisoCli;
                    info.infoGestion.dirRegion = getClientesAgendar.regionCli;

                    //HOA: Se agregar valores si es agendado y despues recuperarlos desde TBL_GESTION
                    info.infoGestion.webEmail = getClientesAgendar.emailCli;
                    info.infoGestion.fechaNacimiento = getClientesAgendar.fechaNacimientoCli;
                    info.infoGestion.dirEntreCalles = getClientesAgendar.entreCalleCli;
                    info.infoGestion.dirYCalles = getClientesAgendar.yCalleCli;
                    info.infoGestion.cliNumSerie = getClientesAgendar.serieCli;

                    var obsCtl = cicGetSbxObservaciones();

                    var idObs = parseInt(obsCtl);

                    if (isNaN(idObs)) {
                        idObs = -1;
                    }

                    info.idObs = idObs;

                    var cmdFinalizar = thisController.$this.find("#cmdFinalizar").button();

                    enableButton(cmdFinalizar, false);

                    httpInvoke("AddOrSaveObservacion.ges", { param: info }, function (resp) {
                        info.idObs = resp.idObs;
                        thisController.SegundaParteFinalizar(info, estadoFinalizacion, codFinalizacion, fechaAgendada, cmdFinalizar);
                    }, function (msg) {
                        showMsgBoxAlert("No fue posible realizar la operación. Favor intente de nuevamente.", "Fallo de Operación");
                        //-----------  esta observacion queda registrada pero no se va a usar, este caso no deberia ocurrir mucho.
                        enableButton(cmdFinalizar, true);
                    },
                    false,
                    5000);
                }
                else {
                    var cmdFinalizar = thisController.$this.find("#cmdFinalizar").button();
                    enableButton(cmdFinalizar, false);
                    cicTrace("[Main Out sva][finaliza] antes de invocar SegundaParteFinalizar");
                    thisController.SegundaParteFinalizar(info, estadoFinalizacion, codFinalizacion, fechaAgendada, cmdFinalizar);
                    cicTrace("[Main Out sva][finaliza] despues de invocar SegundaParteFinalizar");
                }
            }
        }
    },
    SegundaParteFinalizar: function (info, estadoFinalizacion, codFinalizacion, fechaAgendada, cmdFinalizar) {
        cicTrace("[Main out sva][SegundaParteFinalizar] INICIO ");
        var thisController = this;
        
        info.setDNC = false;
        if (codFinalizacion == "cbc921f2-a8ce-44b6-a88e-bd7eb378e1a1") {
            info.setDNC = true;
            cicTrace("Set DNC Phone: " + cicGetNumberToDial());
        }

        httpInvoke("AddOrSaveGestionVenta.ges", { param: info }, function (resp) {
            thisController.completaFinalizacionLlamada(resp, estadoFinalizacion, codFinalizacion, fechaAgendada, info);
            enableButton(cmdFinalizar, true);
        }, function (msg) {
            cicTrace("[Main][error AddOrSaveGestionVenta.ges] : " + msg);
            var resp = new Object();
            resp.idGestion = -1;
            thisController.completaFinalizacionLlamada(resp, estadoFinalizacion, codFinalizacion, fechaAgendada, info);
            enableButton(cmdFinalizar, true);
        },
        false,
        5000);
    },
    completaFinalizacionLlamada: function (respuestaBO, estadoFinalizacion, codFinalizacion, fechaAgendada,info) {
        var thisController = this;
        thisController.idGestion = respuestaBO.idGestion;
        cicTrace("[Main][enviarBO] Envio exitoso a BackOffice");

        if (estadoFinalizacion == "4") {
            //cicSetSbxObservaciones(thisController.botoneraController.getObservaciones());
            cicSetSbxObservaciones(info.idObs);
            cicSetSbxGenerico2(codFinalizacion);
            if (cicGetSbxReferido() == "R" || cicGetSbxReferido() == "C") {
                var convergenteAgendado = "A";
                cicSetSbxConvergencia(convergenteAgendado);
                cicTrace("Set SXB Convergencia como Agendado");
            } else {
                cicSetSbxReferido("A");
                cicTrace("Set SXB Referido como Agendado");
            }
            cicSetGenerico15(cicGetSystemAgentId());
            cicSetCliNombre(info.infoGestion.cliNombre);
            cicSetCliRutConDV(info.infoGestion.cliRutConDv);

            cicSetCliContacAlter(info.infoGestion.cliContacAlter);
            cicSetCliContacAlterFijo(info.infoGestion.cliContacAlterFijo);
            cicSetCliContacAlterMovil(info.infoGestion.cliContacAlterMovil);
            cicSetDirCalle(info.infoGestion.dirCalle);
            cicSetDirNro(info.infoGestion.dirNro);
            cicSetDirPiso(info.infoGestion.dirPiso);
            cicSetDirDepto(info.infoGestion.dirDepto);
            cicSetDirComuna(info.infoGestion.dirComuna);
            cicSetDirRegion(info.infoGestion.dirRegion);       
            
            var completeData = {
                agentid: cicGetSystemAgentId(),
                year: fechaAgendada.getFullYear(),
                month: fechaAgendada.getMonth() + 1,
                day: fechaAgendada.getDate(),
                hour: fechaAgendada.getHours(),
                minute: fechaAgendada.getMinutes(),
                wrapupcode: "Scheduled",
                abandoned: false
            };
        }
        else {
            var completeData = {
                wrapupcode: codFinalizacion
            };
        }

        cicCallComplete(completeData);


        if (thisController.botoneraController.backOfficeCallObject != null) thisController.botoneraController.backOfficeCallObject.disconnect();

        if (thisController.botoneraController.isTransferExecute) {
            thisController.botoneraController.globalCallObject.id = -1;
            thisController.botoneraController.globalCallObject = null;
        } else {
            thisController.botoneraController.globalCallObject.disconnect();
        }

        thisController.callController.resetTabs();

        //if (thisController.botoneraController.requestBreak && thisController.dialerObj.breakStatus == 2) {
        if (thisController.botoneraController.requestBreak) {
            thisController.goToBreak();
            return;
        } else {
            campana.estado = "waiting";
            thisController.cambioEstado();
        }

    },
    checkOfertaVendida: function(infoOfertas, nroOferta) {
        var reg = $.grep(infoOfertas, function (oferta) {
                    return oferta.id == nroOferta;
        });
        return (reg.length > 0 ? "1" : "0");
    },
    checkCantidadProductosOferta: function (infoOfertas, nroOferta) {
        var reg = $.grep(infoOfertas, function (oferta) {
             return oferta.id == nroOferta
        });
        if (reg.length == 0) return 0;
        else return reg[0].cantProductos;
    },
    getDataGestion: function (esFinalizar, recuperaDatosFicha) {
        var thisController = this;

        var infoCierre = new Object();

        infoCierre = thisController.callController.cierreController.getInfoCierre();

        if (recuperaDatosFicha) {

            //Validar Info
            if (!infoCierre.infoCliente.nombre) {
                showMsgBoxAlert("En la Ficha de Cierre 'Nombre y Apellidos' es obligatorio");
                return null;
            } else {
                var cliLength = infoCierre.infoCliente.nombre.length;
                if (cliLength > 100) {
                    showMsgBoxAlert("Excedió largo permitido para el nombre del Cliente")
                    return null;
                }
            }

            if (!infoCierre.infoCliente.rut) { //TODO Validar integridad
                showMsgBoxAlert("En la Ficha de Cierre 'Rut' es obligatorio");
                return null;
            }
            
            //validación de Vía de Certificación
            var via_certificacion = parseInt(infoCierre.infoCliente.certifSiglo) + parseInt(infoCierre.infoCliente.certifSMSUnifica);
            var familia = cicGetCallFamiliaId();

            if (familia != 'Svld' && infoCierre.infoVentaParrillas.ventasSva.length > 0) {

                if (via_certificacion != 1) {
                    showMsgBoxAlert("En la Ficha de Cierre 'Vía de Certificación' es obligatorio");
                    return null;
                }

                if (infoCierre.infoCliente.certifSiglo == "1" && (parseInt(infoCierre.infoCliente.certifSigloIVR) + parseInt(infoCierre.infoCliente.certifSigloEjecutivo) != 1)) {
                    showMsgBoxAlert("En la Ficha de Cierre para la Certificación Siglo es obligatorio seleccionar si es por 'IVR' o 'Ejecutivo' ");
                    return null;
                }


                if (infoCierre.infoCliente.certifSiglo == "1" && (infoCierre.infoCliente.certifSigloIVR == "1") && (!infoCierre.infoCliente.IDSigloIVR)) {
                    showMsgBoxAlert("En la Ficha de Cierre para la Certificación Siglo es obligatorio el ID del IVR");
                    return null;
                }


                if (infoCierre.infoCliente.certifSiglo == "1" && (infoCierre.infoCliente.certifSigloEjecutivo == "1") && (!infoCierre.infoCliente.IDSigloEjecutivo)) {
                    showMsgBoxAlert("En la Ficha de Cierre para la Certificación Siglo es obligatorio el ID del Ejecutivo");
                    return null;
                }
            }
           
            if (!infoCierre.infoCliente.calle) {
                showMsgBoxAlert("En la Ficha de Cierre 'Calle' es obligatorio");
                return;
            } else {
                var calleLength = infoCierre.infoCliente.calle.length;
                if (calleLength > 40) {
                    showMsgBoxAlert("Excedió largo permitido para  Calle");
                    return;
                }
            }
            if (!infoCierre.infoCliente.region) {
                showMsgBoxAlert("En la Ficha de Cierre 'Región' es obligatorio");
                return;
            } else {
                var regionLength = infoCierre.infoCliente.region.length;
                if (regionLength > 20) {
                    showMsgBoxAlert("Excedió largo permitido para Región");
                    return;
                }
            }
            if (!infoCierre.infoCliente.comuna) {

                showMsgBoxAlert("En la Ficha de Cierre 'Comuna' es obligatorio");
                return;

            } else {
                var comunaLength = infoCierre.infoCliente.comuna.length;
                if (comunaLength > 40) {
                    showMsgBoxAlert("Excedió largo permitido para Comuna");
                    return;
                }

            }



            if (infoCierre.infoCliente.depto) {

                var deptoLength = infoCierre.infoCliente.depto.length;
                if (deptoLength > 6) {
                    showMsgBoxAlert("Excedió largo permitido para Depto");
                    return null;
                }
            }

            if (infoCierre.infoCliente.entreCalle) {
                var entreCalleLength = infoCierre.infoCliente.entreCalle.length;
                if (entreCalleLength > 40) {
                    showMsgBoxAlert("Excedió largo permitido para Entre Calle");
                    return null;

                }

            }

            if (infoCierre.infoCliente.numero) {

                var numeroLength = infoCierre.infoCliente.numero.length;
                if (numeroLength > 6) {
                    showMsgBoxAlert("Excedió largo permitido para número de dirección particular");
                    return null;

                }

            }

            if (infoCierre.infoCliente.piso) {
                var pisoLength = infoCierre.infoCliente.piso.length;

                if (pisoLength > 2) {
                    showMsgBoxAlert("Excedió largo permitido para el piso");
                    return null;
                }

            }


            if (infoCierre.infoCliente.yCalle) {
                var calleLength = infoCierre.infoCliente.yCalle.length;

                if (calleLength > 40) {
                    showMsgBoxAlert("Excedió largo permitido para y Calle");
                    return null;
                }

            }

            //Validación Destino Logístico
            if (infoCierre.infoVentaParrillas.ventasMovil.length > 0) {

                if (!infoCierre.infoVentaParrillas.datosMovil.destinoLogistico) {
                    showMsgBoxAlert("En la Ficha de Cierre debe seleccionar el 'Destino Logístico' para los productos móvil");
                    return null;
                }

                if (infoCierre.infoVentaParrillas.datosMovil.destinoLogistico == "MC" && !infoCierre.infoVentaParrillas.datosMovil.sucursal) {
                    showMsgBoxAlert("En la Ficha de Cierre debe ingresar 'Sucursal' para Destino Logístico Multicanalidad");
                    return null;
                }
            }

        }

        var infoRequest = new Object();
        var infoGestion = new Object();
        infoGestion.idGestion = thisController.idGestion;
        infoGestion.callRegId = cicGetCallRegId();

        var estadoFinalizacion = thisController.botoneraController.getEstadoFinalizacion();

        if (esFinalizar) {
            infoGestion.fbackFinalizacionCod = thisController.botoneraController.getCodigoFinalizacion();
            infoGestion.fbackFinalizacionDesc = thisController.botoneraController.getCodigoFinalizacionDesc();
            
            if (estadoFinalizacion == "1" || estadoFinalizacion == "2" || estadoFinalizacion == "3") {
                infoGestion.idUltimoEstado = "2";
            } else {
                infoGestion.idUltimoEstado = "3";
            }
        } else {
            infoGestion.idUltimoEstado = "1";
            infoGestion.fbackFinalizacionCod = "";
            infoGestion.fbackFinalizacionDesc = "";
        }        

        infoGestion.fBackFecHora = "";
        infoGestion.callPaisId = cicGetCallPaisId();
        infoGestion.callCallcenterId = cicGetCallCallCenterId();
        infoGestion.callCanalId = cicGetCallCanalId();
        infoGestion.callFamiliaId = cicGetCallFamiliaId();
        infoGestion.callFecGestIni = thisController.parseFecha(cicGetCallFecGestIni());
        infoGestion.callFecGestFin = thisController.parseFecha(cicGetCallFecGestFin());
        infoGestion.callBatchId = cicGetCallBatchId();
        infoGestion.callSistemaId = cicGetCallSistemaId();
        infoGestion.callArchivo = cicGetCallArchivo();
        infoGestion.accId = cicGetAccId();
        infoGestion.accLineaId = cicGetAccLineaId();
        infoGestion.accCampanaId = cicGetAccCampanaId();
        infoGestion.accHorario = cicGetAccHorario();
        infoGestion.accArg1Id = cicGetAccArg1Id();
        infoGestion.accArg2Id = cicGetAccArg2Id();
        infoGestion.accArg3Id = cicGetAccArg3Id();
        infoGestion.accPreg1 = cicGetAccPreg1();
        infoGestion.accResp1 = infoCierre.infoRespuestas.resp1;
        infoGestion.accPreg2 = cicGetAccPreg2();
        infoGestion.accResp2 = infoCierre.infoRespuestas.resp2;
        infoGestion.accScore = cicGetAccScore();
        infoGestion.cliId = cicGetCliId();
        infoGestion.cliRutConDv = (recuperaDatosFicha ? infoCierre.infoCliente.rut : cicGetCliRutConDV());
        infoGestion.cliNombre = (recuperaDatosFicha ? infoCierre.infoCliente.nombre : cicGetCliNombre());
        infoGestion.cliSegmento = cicGetCliSegmento();
        infoGestion.cliGse = cicGetCliGse();
        infoGestion.cliAntiguedad = cicGetCliAntiguedad();
        infoGestion.cliLineaAntiguedad = cicGetCliLineaAntiguedad();
        infoGestion.cliCicloCod = (recuperaDatosFicha ? infoCierre.infoCliente.ciclo : cicGetCliCicloCod());
        infoGestion.cliIndPortado = cicGetCliIndPortado();
        infoGestion.cliUltBoletaMonto = cicGetCliUltBoletaMonto();
        infoGestion.cliContacAlter = (recuperaDatosFicha ? infoCierre.infoCliente.fono1 : cicGetCliContacAlter());
        infoGestion.cliContacAlterFijo = (recuperaDatosFicha ? infoCierre.infoCliente.fono2 : cicGetCliContacAlterFijo());
        infoGestion.cliContacAlterMovil = (recuperaDatosFicha ? infoCierre.infoCliente.fono3 : cicGetCliContacAlterMovil());
        infoGestion.prodVigDesc = cicGetProdVigDesc();
        infoGestion.prodVigPrecio = cicGetProdVigPrecio();
        infoGestion.prodVigFinPromo = thisController.parseFecha(cicGetProdVigFinPromo());
        infoGestion.dirCalle = (recuperaDatosFicha ? infoCierre.infoCliente.calle : cicGetDirCalle());
        infoGestion.dirNro = (recuperaDatosFicha ? infoCierre.infoCliente.numero : cicGetDirNro());
        infoGestion.dirPiso = (recuperaDatosFicha ? infoCierre.infoCliente.piso : cicGetDirPiso());
        infoGestion.dirDepto = (recuperaDatosFicha ? infoCierre.infoCliente.depto : cicGetDirDepto());
        infoGestion.dirComuna = (recuperaDatosFicha ? infoCierre.infoCliente.comuna : cicGetDirComuna());
        infoGestion.dirCiudad = "";
        infoGestion.dirRegion = (recuperaDatosFicha ? infoCierre.infoCliente.region : cicGetDirRegion());
        infoGestion.oferP1Cod = cicGetOferP1Cod();
        infoGestion.oferP1Desc = cicGetOferP1Desc();
        infoGestion.oferP1Precio = cicGetOferP1Precio();
        infoGestion.oferP1Delta = cicGetOferP1Delta();
        infoGestion.oferP1Vendido = (recuperaDatosFicha ? thisController.checkOfertaVendida(infoCierre.infoOfertas, "1") : "0");
        infoGestion.oferP1Cantidad = (recuperaDatosFicha ? thisController.checkCantidadProductosOferta(infoCierre.infoOfertas, "1") : "0");
        infoGestion.oferP2Cod = cicGetOferP2Cod();
        infoGestion.oferP2Desc = cicGetOferP2Desc();
        infoGestion.oferP2Precio = cicGetOferP2Precio();
        infoGestion.oferP2Delta = cicGetOferP2Delta();
        infoGestion.oferP2Vendido = (recuperaDatosFicha ? thisController.checkOfertaVendida(infoCierre.infoOfertas, "2") : "0");
        infoGestion.oferP2Cantidad = (recuperaDatosFicha ? thisController.checkCantidadProductosOferta(infoCierre.infoOfertas, "2") : "0");
        infoGestion.oferP3Cod = cicGetOferP3Cod();
        infoGestion.oferP3Desc = cicGetOferP3Desc();
        infoGestion.oferP3Precio = cicGetOferP3Precio();
        infoGestion.oferP3Delta = cicGetOferP3Delta();
        infoGestion.oferP3Vendido = (recuperaDatosFicha ? thisController.checkOfertaVendida(infoCierre.infoOfertas, "3") : "0");
        infoGestion.oferP3Cantidad = (recuperaDatosFicha ? thisController.checkCantidadProductosOferta(infoCierre.infoOfertas, "3") : "0");
        infoGestion.oferP4Cod = cicGetOferP4Cod();
        infoGestion.oferP4Desc = cicGetOferP4Desc();
        infoGestion.oferP4Precio = cicGetOferP4Precio();
        infoGestion.oferP4Delta = cicGetOferP4Delta();
        infoGestion.oferP4Vendido = (recuperaDatosFicha ? thisController.checkOfertaVendida(infoCierre.infoOfertas, "4") : "0");
        infoGestion.oferP4Cantidad = (recuperaDatosFicha ? thisController.checkCantidadProductosOferta(infoCierre.infoOfertas, "4") : "0");
        infoGestion.oferP5Cod = cicGetOferP5Cod();
        infoGestion.oferP5Desc = cicGetOferP5Desc();
        infoGestion.oferP5Precio = cicGetOferP5Precio();
        infoGestion.oferP5Delta = cicGetOferP5Delta();
        infoGestion.oferP5Vendido = (recuperaDatosFicha ? thisController.checkOfertaVendida(infoCierre.infoOfertas, "5") : "0");
        infoGestion.oferP5Cantidad = (recuperaDatosFicha ? thisController.checkCantidadProductosOferta(infoCierre.infoOfertas, "5") : "0");
        infoGestion.ventaProdCod = cicGetVentaProdCod();
        infoGestion.ventaSistemaId = cicGetVentaSistemaId();
        infoGestion.ventaOossCod = cicGetVentaOossCod();
        infoGestion.generico01 = cicGetGenerico01();

        //pagador
        infoGestion.generico02 = (recuperaDatosFicha ? infoCierre.infoCliente.nombrepagador : cicGetGenerico02());
        infoGestion.generico03 = (recuperaDatosFicha ? infoCierre.infoCliente.rutpagador : cicGetGenerico03());

        infoGestion.generico04 = cicGetGenerico04();
        infoGestion.generico05 = cicGetGenerico05();
        infoGestion.generico06 = cicGetGenerico06();
        infoGestion.generico07 = cicGetGenerico07();
        infoGestion.generico08 = cicGetGenerico08();
        infoGestion.generico09 = cicGetGenerico09();
        infoGestion.generico10 = cicGetGenerico10();


        infoGestion.generico11 = cicGetGenerico11();
        infoGestion.generico12 = cicGetGenerico12();
        infoGestion.generico13 = cicGetGenerico13();
        infoGestion.generico14 = cicGetGenerico14();
        infoGestion.generico15 = cicGetGenerico15();
        infoGestion.generico16 = cicGetGenerico16();
        infoGestion.generico17 = cicGetGenerico17();
        infoGestion.generico18 = cicGetGenerico18();
        infoGestion.generico19 = cicGetGenerico19();
        infoGestion.cuartil = cicGetCuartil();
        infoGestion.i3Identity = cicGetI3Identity();
        infoGestion.zone = cicGetZone();
        infoGestion.attempts = cicGetAttemps();
        infoGestion.status = cicGetStatus();
        infoGestion.i3Siteid = cicGetI3SiteId();
        infoGestion.i3Activecampaignid = cicGetI3ActiveCampaignId();
        infoGestion.i3Attemptsremotehangup = cicGetI3AttemptsRemoteHangUp();
        infoGestion.i3Attemptssystemhangup = cicGetI3AttemptsSystemHangUp();
        infoGestion.i3Attemptsabandoned = cicGetI3AttemptsAbandoned();
        infoGestion.i3Attemptsbusy = cicGetI3AttemptsBusy();
        infoGestion.i3Attemptsfax = cicGetI3AttempsFax();
        infoGestion.i3Attemptsnoanswer = cicGetI3AttempsNoAnswer();
        infoGestion.i3Attemptsmachine = cicGetI3AttempsMachine();
        infoGestion.i3Attemptsrescheduled = cicGetI3AttemptsRescheduled();
        infoGestion.i3Attemptssitcallable = cicGetI3AttemptsSitCallable();
        infoGestion.i3Attemptsdaily = cicGetI3AttemptsDaily();
        infoGestion.i3LastcalledUtc = thisController.parseFecha(cicGetI3LastCalledUtc());
        infoGestion.successresult = cicGetSuccessResult();
        infoGestion.i3UploadId = cicGetI3UploadId();
        infoGestion.i3Rowid = cicGetI3RowId();
        infoGestion.dncRegId = cicGetDncRegId();
     infoGestion.phoneNumber = cicGetAccLineaId();
        infoGestion.toExclude = cicGetToExclude();
        infoGestion.expiration = cicGetExpiration();
        infoGestion.fbackRegId = "";        
        infoGestion.fbackLinea = cicGetAccLineaId();
        infoGestion.fbackEstado = "0";
        infoGestion.i3Callid = cicGetCallId();
        infoGestion.folioUnifica = (recuperaDatosFicha ? infoCierre.infoCliente.folioUnifica : "");

        infoGestion.folioOl = "";
        infoGestion.folioMulticanalidad = "";
        infoGestion.destinoLogistico = "";
        infoGestion.movSucursal = "";

        if (recuperaDatosFicha && infoCierre.infoVentaParrillas.ventasMovil.length > 0) {
            infoGestion.destinoLogistico = infoCierre.infoVentaParrillas.datosMovil.destinoLogistico;
            infoGestion.movSucursal = infoCierre.infoVentaParrillas.datosMovil.sucursal;
        }

        infoGestion.webNumAtencionCamaleon = "";
        infoGestion.webEmail = (recuperaDatosFicha ? infoCierre.infoCliente.email : "");
        infoGestion.webDireccion = "";
        infoGestion.fechaNacimiento = (recuperaDatosFicha ? infoCierre.infoCliente.fechaNacimiento : "");
        if (esFinalizar) {
            if (estadoFinalizacion == "4") {

                var fechaAgendada = thisController.botoneraController.getInfoAgendamiento();

                var fecha = fechaAgendada.getDate() + "/" + (fechaAgendada.getMonth() + 1) + "/" + fechaAgendada.getFullYear();
                infoGestion.fechaAgendamiento = fecha;
            } else {
                infoGestion.fechaAgendamiento = "";
            }
        } else {
            infoGestion.fechaAgendamiento = "";
        }

        infoGestion.webTipoSolicitud = "";
        infoGestion.webAni = "";
        infoGestion.webCodigoEquipo = "";
        infoGestion.webCodigoPlan = "";
        infoGestion.webTipoRequerimiento = "";
        infoGestion.webOrigen = "";
        infoGestion.webCategoria = "";
        infoGestion.cmptcCompaniaActual = "";
        infoGestion.cmptcSrvLinea = "";
        infoGestion.cmptcSrvBa = "";
        infoGestion.cmptcSrvTv = "";
        infoGestion.cmptcSrvMovil = "";
        infoGestion.cmptcSrvRangoPrecios = "";
        infoGestion.tlmSrvLinea = "";
        infoGestion.tlmSrvBa = "";
        infoGestion.tlmSrvTv = "";
        infoGestion.tlmSrvMovil = "";

        //IVRSIGLO EJECUTIVOSIGLO  SMSUNIFICA
        if (infoCierre.infoCliente.certifSiglo == "1") {
            if (infoCierre.infoCliente.certifSigloIVR == "1") {
                infoGestion.svaViaCertificacion = "IVRSIGLO";
                infoGestion.folioSiglo = infoCierre.infoCliente.IDSigloIVR;
            }

            else if (infoCierre.infoCliente.certifSigloEjecutivo == "1") {
                infoGestion.svaViaCertificacion = "EJECUTIVOSIGLO";
                infoGestion.folioSiglo = infoCierre.infoCliente.IDSigloEjecutivo;
            }

        }


        else if (infoCierre.infoCliente.certifSMSUnifica == "1")
            infoGestion.svaViaCertificacion = "SMSUNIFICA";

        infoGestion.i3Userid = cicGetSystemAgentId();
        infoGestion.i3Campaignname = cicGetCampaignName();
        infoGestion.fbackCierreFecHora = "";
        infoGestion.useridBackoffice = "";
        infoGestion.tipoCliente = (recuperaDatosFicha ? infoCierre.infoCliente.tipoCliente : "");
        infoGestion.tipoVenta = (recuperaDatosFicha ? infoCierre.infoCliente.tipoVenta : "");
        infoGestion.oferP1Categoria = "";
        infoGestion.oferP2Categoria = "";
        infoGestion.oferP3Categoria = "";
        infoGestion.oferP4Categoria = "";
        infoGestion.oferP5Categoria = "";
        infoGestion.despCalle = "";
        infoGestion.despComuna = "";
        infoGestion.despDepto = "";
        infoGestion.despEntreCalles = "";
        infoGestion.despNro = "";
        infoGestion.despPersonaContactar = "";
        infoGestion.despPiso = "";
        infoGestion.despReferencia = "";
        infoGestion.despRegion = "";
        infoGestion.despYCalles = "";
        infoGestion.cliNumSerie = "";
        infoGestion.cliNotificar = "";
        infoGestion.dirEntreCalles = (recuperaDatosFicha ? infoCierre.infoCliente.entreCalle : "");
        infoGestion.dirYCalles = (recuperaDatosFicha ? infoCierre.infoCliente.yCalle : "");
        infoGestion.sxbObservaciones = thisController.botoneraController.getObservaciones();

        infoRequest.infoGestion = infoGestion;

        //Info Preventa
        var infoPreventa = new Object();
        var infoDetallePreventa = new Array();
        if (recuperaDatosFicha) {
            if (infoCierre.infoVentaParrillas.ventasFijo.length) {
                var infoVentaFijo = thisController.callController.ventaAccesosController.getDatosVentaAccesosFijo();
                infoPreventa.grupoIse = infoVentaFijo.grupoIse;
                infoPreventa.limiteCredito = infoVentaFijo.limiteCredito;
                infoPreventa.dMapas = infoVentaFijo.dMapas;
                infoPreventa.d21 = infoVentaFijo.d21;
                $.each(infoCierre.infoVentaParrillas.ventasFijo, function (i, r) {
                    var detallePreventa = new Object();
                    detallePreventa.idTipoDetPreventa = r.producto;
                    detallePreventa.nombre = "";
                    detallePreventa.idProducto = "";
                    infoDetallePreventa.push(detallePreventa);
                });
            }
            if (infoCierre.infoVentaParrillas.ventasMovil.length) {
                $.each(infoCierre.infoVentaParrillas.ventasMovil, function (i, r) {
                    var detallePreventa = new Object();
                    detallePreventa.idTipoDetPreventa = "";
                    detallePreventa.nombre = "";
                    detallePreventa.idProducto = r.idProducto;
                    detallePreventa.cicloFacturacion = r.cicloFacturacion;
                    detallePreventa.fonoAPortar = r.fonoAPortar;
                    detallePreventa.cuota = r.cuota;
                    detallePreventa.modoPago = r.modoPago;
                    detallePreventa.TipoVenta = r.TipoVenta;
                    detallePreventa.OperadorDonante = r.OperadorDonante;
                    if (r.ContratoSeguro) {
                        detallePreventa.ContratoSeguro = 1;
                    } else {
                        detallePreventa.ContratoSeguro = 0;
                    }
                    infoDetallePreventa.push(detallePreventa);
                });
            }
            if (infoCierre.infoVentaParrillas.ventasSva.length) {
                infoPreventa.cicloFacturacion = infoCierre.infoCliente.ciclo;
                infoPreventa.observacionVenta = infoCierre.infoVentaParrillas.datosSVA.obs;
                $.each(infoCierre.infoVentaParrillas.ventasSva, function (i, r) {
                    var detallePreventa = new Object();
                    detallePreventa.idTipoDetPreventa = "";
                    detallePreventa.nombre = "";
                    detallePreventa.idProducto = r.producto;
                    infoDetallePreventa.push(detallePreventa);
                });
            }
        }

        infoRequest.infoPreventa = infoPreventa;
        infoRequest.infoDetallePreventa = infoDetallePreventa;

        return infoRequest;

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