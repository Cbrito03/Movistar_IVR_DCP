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
    infoConfigConvergencia: null,
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
                { code: "call", url: "campanas/outBoundMigraciones/en-llamada", initial: (campana.estado == "call" || campana.estado == "preview")}
            ],
            onReady: function () {
                httpInvoke("getConfigConvergencia.ges", { }, function (resp) {
                    thisController.infoConfigConvergencia = resp;
                    app.callBackFinishLoad();
                }, function () {
                    thisController.infoConfigConvergencia = null;
                    app.callBackFinishLoad();
                });


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

                thisController.callController.onBackGetDisplayConvergencia = function (pais, callSite) {
                    cicTrace("CheckDisplayConvergencia Begin. Pais: " + pais + " - CallSite: " + callSite);

                    var displayConvergencia = false;

                    if (thisController.infoConfigConvergencia != null) {
                        var result = $.grep(thisController.infoConfigConvergencia, function (info) {
                            return (info.pais == pais && info.callCenterSite == callSite);
                        });
                        if (result.length == 1) { //Si no existe o existe más de uno
                            displayConvergencia = (result[0].tieneConvergencia == "Y");
                        }
                    }

                    cicTrace("CheckDisplayConvergencia Finish. Pais: " + pais + " - CallSite: " + callSite + " Display?: " + displayConvergencia);

                    return displayConvergencia;
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
            thisController.botoneraController.loadWrapUpCodes("MIGRACION");
            thisController.botoneraController.loadSpeedDialList();
            thisController.botoneraController.loadMaxDiasAgenda();
            thisController.botoneraController.loadIVRConfirmacion();
            thisController.botoneraController.onBackEndBreak = function () {
                campana.estado = "waiting";
                thisController.cambioEstado();
				
				
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
        if (thisController.callController.convergenciaController == null)
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
            if (thisController.botoneraController.conferenceDestinyCallObject != null) thisController.botoneraController.conferenceDestinyCallObject.disconnect();
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
            showMsgBoxAlert("Debe generar la ficha antes de Enviar a BackOffice","Generacion de ficha");
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
                    showMsgBoxAlert("Excedió largo permitido para la observación", "Validación Observación")
                    return;
                }
            }
            if (info.infoGestion.despReferencia) {
                var referenciaLength = info.infoGestion.despReferencia.length;
                if (referenciaLength > 200) {
                    showMsgBoxAlert("Excedió largo permitido para la referencia de la dirección", "Validacion Dirección")
                    return;
                }
            }

            if (info.infoGestion.accResp1) {
                var resp1Length = info.infoGestion.accResp1.length;
                if (resp1Length > 200) {
                    showMsgBoxAlert("Excedió largo permitido para la respuesta N°1", "Validación N°1")
                    return;
                }

            }
            if (info.infoGestion.accResp2) {
                var resp2Length = info.infoGestion.accResp2.length;
                if (resp2Length > 200) {
                    showMsgBoxAlert("Excedió largo permitido para la respuesta N°2", "Validación N°2")
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
                showMsgBoxInfo("La información fue enviada a BackOffice correctamente","Informacion Correcta");
                cicTrace("[Main][enviarBO] Envio exitoso a BackOffice");
            }, function (msg) {
                showMsgBoxAlert(msg,"");
                enableButton(cmdEnviarBO, true);
            });
        }

    },
    finalizar: function () {
        var thisController = this;
        cicTrace("Finalizar en " + campana.estado);
			clearTimeout(thisController.botoneraController.deshabilitarrediscado);
	       thisController.botoneraController.deshabilitarrediscado = null;
		   clearTimeout(thisController.botoneraController.cierreLlamadaTimeOut);
           thisController.botoneraController.cierreLlamadaTimeOut = null;
           clearTimeout(thisController.botoneraController.msgCierreLlamadaTimeOut);
           thisController.botoneraController.msgCierreLlamadaTimeOut = null;
        if (campana.estado == "waiting" || campana.estado == "break") {
            thisController.botoneraController.setAgentStatus("6"); //Fin Turno
            thisController.botoneraController.logOffCampana();
        }

        if (campana.estado == "call" || campana.estado == 'preview') {

            if (thisController.botoneraController.IVRConfirmation == "PROCESSING") return;

            var codFinalizacion = thisController.botoneraController.getCodigoFinalizacion();
            cicTrace("Finalizar - CodFinalizacion '" + codFinalizacion + "'");
            if (codFinalizacion == null || codFinalizacion == "Seleccione") {
                showMsgBoxAlert("Debe seleccionar un código de finalización","Validacón Código Finalización");
                return;
            }

            var finalizaConVenta = false;

            var estadoFinalizacion = thisController.botoneraController.getEstadoFinalizacion();

            if (estadoFinalizacion == "1" || estadoFinalizacion == "2" || estadoFinalizacion == "3") {

                finalizaConVenta = true;

                if (thisController.idGestion == -1) {
                    showMsgBoxAlert("La información de Venta no fue enviada a Back Office, por lo tanto, no puede finalizar como Venta.","Validación Back Office");
                    return;
                }

            }

            //Controla cambios en Ficha no enviados a BO
            if (finalizaConVenta && !thisController.enviadoBO) {
                showMsgBoxAlert("Debe enviar a BackOffice los cambios en Ficha de Cierre","Validación BackOffice");
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

                /*
                if (intentosDisponibles <= 0) {
                    alert("No es posible realizar un agendamiento debido a que se ha alcanzado el máximo de llamadas permitidas [" + thisController.botoneraController.nroMaximoLlamadas + "]");
                    cicTrace("[Main][EnviarBO] No puede agendar. Se alcanzo los [" + thisController.botoneraController.nroMaximoLlamadas + "] intentos permitidos");
                    return;
                }*/

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
                        showMsgBoxAlert("Excedió largo permitido para la observación","Validacion Observación")
                        return;
                    }
                }
                if (info.infoGestion.despReferencia) {
                    var referenciaLength = info.infoGestion.despReferencia.length;
                    if (referenciaLength > 200) {
                        showMsgBoxAlert("Excedió largo permitido para la referencia de la dirección","Validación dirección")
                        return;
                    }
                }

                if (info.infoGestion.accResp1) {
                    var resp1Length = info.infoGestion.accResp1.length;
                    if (resp1Length > 200) {
                        showMsgBoxAlert("Excedió largo permitido para la respuesta N°1","Validacion Respuesta N°1")
                        return;
                    }

                }
                if (info.infoGestion.accResp2) {
                    var resp2Length = info.infoGestion.accResp2.length;
                    if (resp2Length > 200) {
                        showMsgBoxAlert("Excedió largo permitido para la respuesta N°2","Validación N°2")
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
                    cicTrace("[Main Out fijo][finaliza] antes de invocar SegundaParteFinalizar");
                    thisController.SegundaParteFinalizar(info, estadoFinalizacion, codFinalizacion, fechaAgendada, cmdFinalizar);
                    cicTrace("[Main Out fijo][finaliza] despues de invocar SegundaParteFinalizar");
                }
            }
        }
    },
    SegundaParteFinalizar: function (info, estadoFinalizacion, codFinalizacion, fechaAgendada, cmdFinalizar) {
        cicTrace("[Main out fijo][SegundaParteFinalizar] INICIO ");
        var thisController = this;
        var tieneConvergencia = info.InfoConvergencia.checkConvergencia;
        var infoPersonalesConv = thisController.callController.convergenciaController.getInfoConvergencia();

        if (tieneConvergencia == 1) {

            var infoGestionConvergencia = new Object();
            var gestionConvergencia = info.InfoConvergencia;
            var gestionInfo = info.infoGestion;
            gestionInfo.cliRutConDv = infoPersonalesConv.rutCli;
            gestionInfo.cliContacAlter = infoPersonalesConv["fono2Cli"] ? infoPersonalesConv.fono2Cli : "";
            gestionInfo.accLineaId = infoPersonalesConv.fono1Cli;
            gestionInfo.dirCalle = infoPersonalesConv.calleCli;
            gestionInfo.dirComuna = infoPersonalesConv.comunaCli;
            gestionInfo.dirNro = infoPersonalesConv.numeroCli;
            gestionInfo.dirRegion = infoPersonalesConv.regionCli;
            gestionInfo.cliNombre = infoPersonalesConv.nombreCli;
            gestionInfo.Observaciones = infoPersonalesConv.Observaciones;
            gestionInfo.generico15 = cicGetSystemAgentId();
            infoGestionConvergencia.gestionConvergencia = gestionConvergencia;
            infoGestionConvergencia.gestionInfo = gestionInfo;

            httpInvoke("SaveConvergencia.ges", { param: infoGestionConvergencia }, function () {

            }, function (error) {

            });

        }

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
            } else {
                cicSetSbxReferido("A");
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
    checkOfertaVendida: function (infoOfertas, nroOferta) {
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
        var convergencia = thisController.callController.convergenciaController.checkConvergencia();
        var InfoConvergencia = new Object();
        InfoConvergencia = convergencia;

        if (recuperaDatosFicha) {

            //Validar Info
            if (!infoCierre.infoCliente.nombre) {
                showMsgBoxAlert("En la Ficha de Cierre 'Nombre y Apellidos' es obligatorio","Nombre y Apellido No Ingresado");
                return null;
            } else {
                var cliLength = infoCierre.infoCliente.nombre.length;
                if (cliLength > 100) {
                    showMsgBoxAlert("Excedió largo permitido para el nombre del Cliente","Validación Cliente")
                    return null;
                }
            }

            if (!infoCierre.infoCliente.rut) { //TODO Validar integridad
                showMsgBoxAlert("En la Ficha de Cierre 'Rut' es obligatorio","Rut No Ingresado");
                return null;
            }
            if (!infoCierre.infoCliente.serieRut) {
                showMsgBoxAlert("En la Ficha de Cierre '# Serie' es obligatorio","#Serie No Ingresado");
                return null;
            }
            if (!infoCierre.infoCliente.ciclo) {
                showMsgBoxAlert("En la Ficha de Cierre 'Ciclo de Facturación' es obligatorio","Ciclo de Facturación No Ingresado");
                return null;
            }
            if (!infoCierre.infoDespacho.nombre) {
                showMsgBoxAlert("En la Ficha de Cierre 'Nombre Persona Contactar' es obligatorio","Nombre Persona Contactar No Ingresado");
                return null;
            }
            if (!infoCierre.infoCliente.calle) {
                showMsgBoxAlert("En la Ficha de Cierre 'Calle' es obligatorio","Calle No Ingresada");
                return;
            } else {
                var calleLength = infoCierre.infoCliente.calle.length;
                if (calleLength > 40) {
                    showMsgBoxAlert("Excedió largo permitido para  Calle","Validación Calle");
                    return;
                }
            }
            if (!infoCierre.infoCliente.region) {
                showMsgBoxAlert("En la Ficha de Cierre 'Región' es obligatorio","Región No Ingresada");
                return;
            } else {
                var regionLength = infoCierre.infoCliente.region.length;
                if (regionLength > 20) {
                    showMsgBoxAlert("Excedió largo permitido para Región","Validación Regioón");
                    return;
                }
            }
            if (!infoCierre.infoCliente.comuna) {

                showMsgBoxAlert("En la Ficha de Cierre 'Comuna' es obligatorio","Comuna No Ingresada");
                return;

            } else {
                var comunaLength = infoCierre.infoCliente.comuna.length;
                if (comunaLength > 40) {
                    showMsgBoxAlert("Excedió largo permitido para Comuna","Validación Comuna");
                    return;
                }

            }



            if (infoCierre.infoCliente.depto) {

                var deptoLength = infoCierre.infoCliente.depto.length;
                if (deptoLength > 6) {
                    showMsgBoxAlert("Excedió largo permitido para Depto","Validación Depto");
                    return null;
                }
            }

            if (infoCierre.infoCliente.entreCalle) {
                var entreCalleLength = infoCierre.infoCliente.entreCalle.length;
                if (entreCalleLength > 40) {
                    showMsgBoxAlert("Excedió largo permitido para Entre Calle","Validación Calle");
                    return null;

                }

            }

            if (infoCierre.infoCliente.numero) {

                var numeroLength = infoCierre.infoCliente.numero.length;
                if (numeroLength > 6) {
                    showMsgBoxAlert("Excedió largo permitido para número de dirección particular","Validacion Dirección");
                    return null;

                }

            }

            if (infoCierre.infoCliente.piso) {
                var pisoLength = infoCierre.infoCliente.piso.length;

                if (pisoLength > 2) {
                    showMsgBoxAlert("Excedió largo permitido para el piso","Validación Piso");
                    return null;
                }

            }


            if (infoCierre.infoCliente.yCalle) {
                var calleLength = infoCierre.infoCliente.yCalle.length;

                if (calleLength > 40) {
                    showMsgBoxAlert("Excedió largo permitido para y Calle","Validación Calle");
                    return null;
                }

            }


            if (infoCierre.infoCliente.certifSiglo != 1) {
                showMsgBoxAlert("En la Ficha de Cierre 'Vía de Certificación' es obligatorio", "Vía de Certificación No Ingresada");
                return null;
            }

            if (infoCierre.infoCliente.certifSiglo == "1" && (parseInt(infoCierre.infoCliente.certifSigloIVR) + parseInt(infoCierre.infoCliente.certifSigloEjecutivo) != 1)) {
                showMsgBoxAlert("En la Ficha de Cierre para la Certificación Siglo es obligatorio seleccionar si es por 'IVR' o 'Ejecutivo' ","Certificacion Siglo No Seleccionada");
                return null;
            }


            if (infoCierre.infoCliente.certifSiglo == "1" && (infoCierre.infoCliente.certifSigloIVR == "1") && (!infoCierre.infoCliente.IDSigloIVR)) {
                showMsgBoxAlert("En la Ficha de Cierre para la Certificación Siglo es obligatorio el ID del IVR","Certificación Siglo No Seleccionada");
                return null;
            }


            if (infoCierre.infoCliente.certifSiglo == "1" && (infoCierre.infoCliente.certifSigloEjecutivo == "1") && (!infoCierre.infoCliente.IDSigloEjecutivo)) {
                showMsgBoxAlert("En la Ficha de Cierre para la Certificación Siglo es obligatorio el ID del Ejecutivo","Certificacion Siglo No Seleccionada");
                return null;
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
        infoGestion.cliRutConDv =  (recuperaDatosFicha ? infoCierre.infoCliente.rut : cicGetCliRutConDV());
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

        infoGestion.nombreCliRespaldo = infoCierre.infoCliente.nombreCliRespaldo ? infoCierre.infoCliente.nombreCliRespaldo : "";
        infoGestion.rutCliRespaldo = infoCierre.infoCliente.rutCliRespaldo ? infoCierre.infoCliente.rutCliRespaldo : "";
        infoGestion.serieCliRespaldo = infoCierre.infoCliente.serieCliRespaldo ? infoCierre.infoCliente.serieCliRespaldo : "";

        infoGestion.fechaNacimientoCliRespaldo = infoCierre.infoCliente.fechaNacimientoCliRespaldo ? infoCierre.infoCliente.fechaNacimientoCliRespaldo : "";
        infoGestion.emailCliRespaldo = infoCierre.infoCliente.emailCliRespaldo ? infoCierre.infoCliente.emailCliRespaldo : "";
        infoGestion.fono1CliRespaldo = infoCierre.infoCliente.fono1CliRespaldo ? infoCierre.infoCliente.fono1CliRespaldo : "";
        infoGestion.fono2CliRespaldo = infoCierre.infoCliente.fono2CliRespaldo ? infoCierre.infoCliente.fono2CliRespaldo : "";
        infoGestion.fono3CliRespaldo = infoCierre.infoCliente.fono3CliRespaldo ? infoCierre.infoCliente.fono3CliRespaldo : "";
        infoGestion.cicloRespaldo = infoCierre.infoCliente.cicloRespaldo ? infoCierre.infoCliente.cicloRespaldo : "";
        infoGestion.calleCliRespaldo = infoCierre.infoCliente.calleCliRespaldo ? infoCierre.infoCliente.calleCliRespaldo : "";
        infoGestion.entreCalleCliRespaldo = infoCierre.infoCliente.entreCalleCliRespaldo ? infoCierre.infoCliente.entreCalleCliRespaldo : "";
        infoGestion.yCalleCliRespaldo = infoCierre.infoCliente.yCalleCliRespaldo ? infoCierre.infoCliente.yCalleCliRespaldo : "";
        infoGestion.numeroCliRespaldo = infoCierre.infoCliente.numeroCliRespaldo ? infoCierre.infoCliente.numeroCliRespaldo : "";
        infoGestion.pisoCliRespaldo = infoCierre.infoCliente.pisoCliRespaldo ? infoCierre.infoCliente.pisoCliRespaldo : "";
        infoGestion.deptoCliRespaldo = infoCierre.infoCliente.deptoCliRespaldo ? infoCierre.infoCliente.deptoCliRespaldo : "";
        infoGestion.regionCliRespaldo = infoCierre.infoCliente.regionCliRespaldo ? infoCierre.infoCliente.regionCliRespaldo : "";
        infoGestion.comunaCliRespaldo = infoCierre.infoCliente.comunaCliRespaldo ? infoCierre.infoCliente.comunaCliRespaldo : "";
        infoGestion.notificacionClienteRespaldo = infoCierre.infoCliente.notificacionClienteRespaldo ? infoCierre.infoCliente.notificacionClienteRespaldo : "";

        infoGestion.oferP1Cod = cicGetOferP1Cod();
        infoGestion.oferP1Desc = cicGetOferP1Desc();
        infoGestion.oferP1Precio = cicGetOferP1Precio();
        infoGestion.oferP1Delta = cicGetOferP1Delta();
        infoGestion.oferP1Vendido = (recuperaDatosFicha ? thisController.checkOfertaVendida(infoCierre.infoOfertas, "1") : "0");
        infoGestion.oferP1Cantidad = (recuperaDatosFicha ? thisController.checkCantidadProductosOferta(infoCierre.infoOfertas, "1"): "0");
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
        infoGestion.oferP3Cantidad = (recuperaDatosFicha ? thisController.checkCantidadProductosOferta(infoCierre.infoOfertas, "3"): "0");
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
        infoGestion.generico02 = cicGetGenerico02();
        infoGestion.generico03 = cicGetGenerico03();
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
        infoGestion.phoneNumber = cicGetNumberToDial();
        infoGestion.toExclude = cicGetToExclude();
        infoGestion.expiration = cicGetExpiration();
        infoGestion.fbackRegId = "";        
        infoGestion.fbackLinea = cicGetNumberToDial();
        infoGestion.fbackEstado = "0"; 
        infoGestion.i3Callid = cicGetCallId(); 
        infoGestion.folioUnifica = "";
        infoGestion.folioSiglo = "";
        infoGestion.folioOl = "";
        infoGestion.folioMulticanalidad = "";
        infoGestion.destinoLogistico = "OL";
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

        //IVRSIGLO EJECUTIVOSIGLO IVRCERTIFICACION SMSUNIFICA
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
        infoGestion.tipoCliente = (recuperaDatosFicha ? infoCierre.infoCliente.tipoCliente: "");
        infoGestion.tipoVenta = (recuperaDatosFicha ? infoCierre.infoCliente.tipoVenta : "");
        infoGestion.oferP1Categoria = "";
        infoGestion.oferP2Categoria = "";
        infoGestion.oferP3Categoria = "";
        infoGestion.oferP4Categoria = "";
        infoGestion.oferP5Categoria = "";
        infoGestion.despCalle = (recuperaDatosFicha ? infoCierre.infoDespacho.calle : "");
        infoGestion.despComuna = (recuperaDatosFicha ? infoCierre.infoDespacho.comuna : "");
        infoGestion.despDepto = (recuperaDatosFicha ? infoCierre.infoDespacho.depto : "");
        infoGestion.despEntreCalles = (recuperaDatosFicha ? infoCierre.infoDespacho.entreCalle: "");
        infoGestion.despNro = (recuperaDatosFicha ? infoCierre.infoDespacho.numero : "");
        infoGestion.despPersonaContactar = (recuperaDatosFicha ? infoCierre.infoDespacho.nombre : "");
        infoGestion.despPiso = (recuperaDatosFicha ? infoCierre.infoDespacho.piso : "");
        infoGestion.despReferencia = (recuperaDatosFicha ? infoCierre.infoDespacho.referencia : "");
        infoGestion.despRegion = (recuperaDatosFicha ? infoCierre.infoDespacho.region : "");
        infoGestion.despYCalles = (recuperaDatosFicha ? infoCierre.infoDespacho.yCalle : "");
        infoGestion.cliNumSerie = (recuperaDatosFicha ? infoCierre.infoCliente.serieRut : "");
        infoGestion.cliNotificar = (recuperaDatosFicha ? infoCierre.infoCliente.notificar : "0");
        infoGestion.dirEntreCalles = (recuperaDatosFicha ? infoCierre.infoCliente.entreCalle : "");
        infoGestion.dirYCalles = (recuperaDatosFicha ? infoCierre.infoCliente.yCalle : "");
        infoGestion.sxbObservaciones = thisController.botoneraController.getObservaciones();
        infoGestion.movSucursal = "";

        infoGestion.sxbGenerico3 = thisController.botoneraController.IVRConfirmation == null ? "" : thisController.botoneraController.IVRConfirmation;

        infoRequest.InfoConvergencia = convergencia;
        infoRequest.infoGestion = infoGestion;

        //Info Preventa
        var infoPreventa = new Object();
        var infoDetallePreventa = new Array();
        if (recuperaDatosFicha) {
            if (infoCierre.infoVentaParrillas.length > 0) {
                infoPreventa.idMixPreventa = "";
                infoPreventa.canal = "";
                infoPreventa.familia = "";
                infoPreventa.fecha = "";
                infoPreventa.operadorDonante = "";
                infoPreventa.sexo = "";
                infoPreventa.edoCivil = "";
                infoPreventa.cicloFacturacion = infoCierre.infoCliente.ciclo;
                infoPreventa.modoPago = "";
                infoPreventa.cuotas = "";
                infoPreventa.fonoAPortar = "";
                infoPreventa.seguro = "";
                infoPreventa.grupoIse = "";
                infoPreventa.limiteCredito = "";
                infoPreventa.dMapas = "";
                infoPreventa.d21 = "";
                infoPreventa.observacionVenta = infoCierre.dataVenta.obs;
                $.each(infoCierre.infoVentaParrillas, function (i, r) {
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