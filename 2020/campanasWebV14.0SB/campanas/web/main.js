//---------ver 13

var controller = {
    $this: null,
    waitingController: null,
    breakController: null,
    callController: null,
    botoneraController: null,
    headerController: null,
    idGestion: -1,
    dialerObj: null,
    intentosEnviarBO: 0,
    finishLoadingWSData: false,
    idGrupoAgenda: "4",
    idGrupoVenta: "1",
    waitForGetMetadata: 3000,
    metaDataObject: null,
    finishingCall: false,
    init: function (container, options) {
        this.$this = $(container.children()[0]);
        var thisController = this;

        cicTrace("Init Main");

        app.callBackFinishLoad = function (service) {
            app.totalServicesLoaded++;
            cicTrace("Services '" + service + "' Load Finish: " + app.totalServicesLoaded + " Of " + app.totalServicesCallToInitialize);
            if (app.totalServicesLoaded == app.totalServicesCallToInitialize) {
                thisController.finishLoadingWSData = true;
                thisController.checkInitialLoading();
            }
        }

        var cmdFinalizar = thisController.$this.find("#cmdFinalizar").button();

        cmdFinalizar.click(function (event) {
            if (!isButtonEnabled(this)) {
                return false;
            } else {
                thisController.finalizar(false);
                return true;
            }
        });

        var mainArea = this.$this.find("#mainArea").zPager({
            pages: [
                { code: "waiting", url: "campanas/common/esperando-llamada", initial: campana.estado == "waiting" || campana.estado == "initializing" },
                { code: "break", url: "campanas/common/en-break", initial: campana.estado == "break" },
                { code: "call", url: "campanas/web/en-llamada", initial: (campana.estado == "call" || campana.estado == "preview") }
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
               
                thisController.callController.onSetAtributoGrabacion = function (atributo, valor) {
                    thisController.botoneraController.setAtributoGrabacion(atributo, valor);
                }

                thisController.callController.onGetMetaDataObject = function () {
                    return thisController.metaDataObject;
                }

                thisController.callController.onGetMaxDiasAgenda = function () {
                    return (thisController.botoneraController.maxDiasAgenda);
                }

            }
        });
        whenAutoloadReady("al-header", function () {
            cicTrace("whenAutoloadReady Header");
            thisController.headerController = thisController.$this.find("#al-header").data("controller");
            thisController.headerController.onGetNumeroMaximoLlamadas = function (tipo) {
                return thisController.botoneraController.getMaximoIntentos(tipo);
            }

            thisController.headerController.onGetIntentosManual = function () {
                return thisController.botoneraController.contadorManual;
            }

            thisController.headerController.onGetMetaDataObject = function () {
                return thisController.metaDataObject;
            }

            thisController.inicializaHeaderBotonera();

        });
        whenAutoloadReady("al-botonera", function () {
            cicTrace("whenAutoloadReady Botonera");
            thisController.botoneraController = thisController.$this.find("#al-botonera").data("controller");
            thisController.botoneraController.loadWrapUpCodes();
            thisController.botoneraController.loadSpeedDialList();
            thisController.botoneraController.loadConfiguracion();
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
			
            thisController.botoneraController.onAddNewRegisterToContact = function () {
                thisController.addNewRegisterToContact();
            }

                      thisController.botoneraController.onBackEndBreak = function () {
                campana.estado = "waiting";
                thisController.cambioEstado();
            }
            thisController.botoneraController.onGoToBreak = function () {
                thisController.goToBreak();
            }
            thisController.botoneraController.onRefrescaHeader = function (isConnected) {
                thisController.headerController.refresca(isConnected);
            }
            thisController.botoneraController.onGetRutCliente = function () {
                return thisController.callController.getRutCliente();
            }
            thisController.botoneraController.onCampaingMode = function () {
                return thisController.campaingMode;
            }

            thisController.botoneraController.onGetMetaDataObject = function () {
                return thisController.metaDataObject;
            }

            thisController.botoneraController.onRefrescaBreak = function () {
                thisController.breakController.refresca();
            }
            
            thisController.inicializaHeaderBotonera();

        });

        // Registrar Eventos
        
        cicAddListener("ObjectAdded", function (objType, objId) {
            cicTrace("ObjectAdded Event - objType: " + objType + " - objId: " + objId);
            // objType == 2 are call objects
            if (objType == 2) {
                if (!isDebug) {
                    scripter.callObject.id = objId;
                    var objCall = scripter.createCallObject();
                    objCall.id = objId;
                } else {
                    objCall = scripter.callObject;
                }
                var direction = objCall.Direction;
                
                cicTrace("ObjectAdded Event - Direction: " + direction);

                if (direction != 0) {
                    cicTrace("ObjectAdded se descarta por dirección");
                    return; //En telemensajeria es Outbound (0:Inbound 1:Outbound 2:Intermediate)
                }
                
                var attrFamilia = objCall.getAttribute("ATTR_FAMILIA");

                cicTrace("ObjectAdded Event - AttrFamilia: " + attrFamilia);

                //alert("ObjectAdded Direction: " + direction + " -- attrFamilia: " + attrFamilia);

                if (attrFamilia.substring(0,2) != "80") {
                    cicTrace("ObjectAdded se descarta por familia");
                    return; //Si no tiene este atributo se descarta para evitar otras llamadas Inbound al grupo
                }


                // Reset the object added handler
                scripter.myQueue.objectAddedHandler = null;

                campana.estado = "call";

                app.isInboundCall = true;
                app.lastCallType = "inbound";

                thisController.loadingToCall(objCall);

            } else {
                cicTrace("[ObjectAdded] Is not CallObject Type. Receive " + objType);
            }

        });                
        
        cicAddListener("PreviewDataPop", function () {
            cicTrace("PreviewDataPop Event");

            if (app.hasLastCallExecuteManual) {
                cicTrace("Catch PreviewDataPop when Manual Call");

                if (app.isInboundCall) {
                    app.isInboundCall = false;
                    app.lastCallType = "preview";
                    setTimeout(function () { thisController.getValuesFromMetadata(); }, thisController.waitForGetMetadata);
                }

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

            if (app.makeRecordBinding) {
                cicTrace("Catch PreviewDataPop when Inbound Record Binding");
                app.makeRecordBinding = false;
                app.isInboundCall = false;
                app.lastCallType = "preview";
                setTimeout(function () { thisController.getValuesFromMetadata(); }, thisController.waitForGetMetadata);

                thisController.botoneraController.globalCallObject = scripter.callObject;
                thisController.botoneraController.globalCallObject.id = cicGetCallId();

                thisController.botoneraController.globalCallObject.stateChangeHandler = function (StateID, StateString) {
                    thisController.botoneraController.cambiaEstadoLlamada(StateID, StateString);
                }

                thisController.botoneraController.globalCallObject.errorHandler = function (ErrorId, ErrorText) {
                    thisController.botoneraController.errorEnLlamada(ErrorId, ErrorText);
                }

                return;
            }

            campana.estado = "preview";
            app.isInboundCall = false;
            app.lastCallType = "preview";
            var callObject = scripter.callObject;
            thisController.loadingToCall(callObject);
        });

        cicAddListener("NewPreviewCall", function () {
            cicTrace("NewPreviewCall Event");
            // Reset the object added handler

            if (app.hasLastCallExecuteManual) {
                cicTrace("Catch NewPreviewCall when Manual Call");

                if (app.isInboundCall) {
                    app.isInboundCall = false;
                    app.lastCallType = "preview";
                }
               
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

            if (app.makeRecordBinding) {
                cicTrace("Catch NewPreviewCall when Inbound Record Binding");
                app.makeRecordBinding = false;
                app.isInboundCall = false;
                app.lastCallType = "preview";
                setTimeout(function () { thisController.getValuesFromMetadata(); }, thisController.waitForGetMetadata);

                thisController.botoneraController.globalCallObject = scripter.callObject;
                thisController.botoneraController.globalCallObject.id = cicGetCallId();

                thisController.botoneraController.globalCallObject.stateChangeHandler = function (StateID, StateString) {
                    thisController.botoneraController.cambiaEstadoLlamada(StateID, StateString);
                }

                thisController.botoneraController.globalCallObject.errorHandler = function (ErrorId, ErrorText) {
                    thisController.botoneraController.errorEnLlamada(ErrorId, ErrorText);
                }
                return;
            }

            scripter.myQueue.objectAddedHandler = null; //Se desactiva object add handler
            campana.estado = "call";
            app.isInboundCall = false;
            app.lastCallType = "preview";
            var callObject = scripter.callObject;
            thisController.loadingToCall(callObject);
        });
        
        cicAddListener("NewPredictiveCall", function (callid) {
            cicTrace("NewPredictiveCall Event");

            if (app.hasLastCallExecuteManual) {
                cicTrace("Catch NewPredictiveCall when Manual Call. Call ID: " + callid);

                if (app.isInboundCall) {
                    app.isInboundCall = false;
                    app.lastCallType = "predictive";
                    setTimeout(function () { thisController.getValuesFromMetadata(); }, thisController.waitForGetMetadata);
                }

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

            if (app.makeRecordBinding) {
                cicTrace("Catch NewPredictiveCall when Inbound Record Binding");
                app.makeRecordBinding = false;
                app.isInboundCall = false;
                app.lastCallType = "preview";
                setTimeout(function () { thisController.getValuesFromMetadata(); }, thisController.waitForGetMetadata);

                thisController.botoneraController.globalCallObject = scripter.callObject;
                thisController.botoneraController.globalCallObject.id = cicGetCallId();

                thisController.botoneraController.globalCallObject.stateChangeHandler = function (StateID, StateString) {
                    thisController.botoneraController.cambiaEstadoLlamada(StateID, StateString);
                }

                thisController.botoneraController.globalCallObject.errorHandler = function (ErrorId, ErrorText) {
                    thisController.botoneraController.errorEnLlamada(ErrorId, ErrorText);
                }
                return;
            }

            // Reset the object added handler
            scripter.myQueue.objectAddedHandler = null; //Se desactiva object add handler
            campana.estado = "call";
            app.isInboundCall = false;
            app.lastCallType = "predictive";
            var callObject = scripter.callObject;
            thisController.loadingToCall(callObject);
        });
        
        cicAddListener("BreakGranted", function () {
            cicTrace("BreakGranted Event");
            if (campana.estado != "break") thisController.goToBreak();
        });

    },
    checkInitialLoading: function () {
        var thisController = this;

        //Check GUIs

        if (thisController.callController == null)
            return;

        if (thisController.callController.clienteController == null)
            return;

        if (thisController.callController.clienteControllerASB == null)
            return;

        if (thisController.callController.cierreController == null)
            return;

        if (thisController.callController.cierreControllerASB == null)
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
        thisController.idGestion = -1;
        thisController.intentosEnviarBO = 0;
        thisController.botoneraController.refresca();
        if (campana.estado == "call") {
            app.makeRecordBinding = false;
            mainArea.zPager("currentPage", "call");
            cicStage("0");
            thisController.headerController.refresca(false);
            if (app.isInboundCall || app.lastCallType == "predictive") {
                thisController.metaDataObject = null;
                thisController.callController.refresca();
                setTimeout(function () {
                    thisController.getValuesFromMetadata();
                    
                    if (app.isInboundCall) {
                        thisController.addNewRegisterToContactRB();
                    }
                    
                }, thisController.waitForGetMetadata);
            }
            cicSetForeground();
            cicSelectPage();
        }
        if (campana.estado == "break") {
            thisController.metaDataObject = null;
            mainArea.zPager("currentPage", "break");
            thisController.headerController.refresca();
            thisController.breakController.refresca();
            cicSetForeground();
            cicSelectPage();
            if (thisController.botoneraController.ultimoEstadoBreakRequest == "6") {
                setTimeout(function () {
                    thisController.botoneraController.logOffCampana();
                }, 2000);
            }
            thisController.botoneraController.requestBreak = false;
            thisController.botoneraController.ultimoEstadoBreakRequest = "-1";
        }
        if (campana.estado == "waiting") {
            thisController.metaDataObject = null;
            mainArea.zPager("currentPage", "waiting");

            if (thisController.botoneraController.requestBreak) {
                cicTrace("Agente habia pedido break");
                thisController.goToBreak();
                return;
            }

            thisController.headerController.refresca();
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
                scripter.myQueue.objectAddedHandler = ObjectAdded;
                cicClientStatus("Available");
            } else {
                cicTrace("Espera carga de otras campañas. Estado Actual: " + cicGetSystemClientStatus());
            }

        }
        if (campana.estado == "preview") {
            thisController.metaDataObject = null;
            mainArea.zPager("currentPage", "call");
            thisController.headerController.refresca(false);
            thisController.callController.refresca();
            cicSetForeground();
            cicSelectPage();
            setTimeout(function () { thisController.getValuesFromMetadata(); }, thisController.waitForGetMetadata);
        }

        if (campana.estado == "initializing") {
            thisController.headerController.refresca();            
            cicSetForeground();
            cicSelectPage();
            if (isDebug) scripter.myQueue.callObjectAddedHandler = CallObjectAdded;
        }
    },
    goToBreak: function () {
        var thisController = this;

        if (thisController.botoneraController != null) {
            cicTrace("Setea Estado Agente por Break: " + thisController.botoneraController.ultimoEstadoBreakRequest);
            thisController.botoneraController.setAgentStatus(thisController.botoneraController.ultimoEstadoBreakRequest);
        }
        if (campana.estado == "call" || campana.estado == "preview") {

            if (!thisController.botoneraController.isTransferExecute && thisController.botoneraController.globalCallObject != null) thisController.botoneraController.globalCallObject.disconnect();
        }

        campana.estado = "break";
        thisController.cambioEstado();
    },
    loadingToCall: function (callObject) {
        var thisController = this;

        if (campana.estado != "call" && campana.estado != "preview")
            return;

        cicTrace("loadingToCall callObject.id: " + callObject.id);

        thisController.botoneraController.globalCallObject = callObject;
        thisController.dialerObj = scripter.dialer;

        if (app.isInboundCall) {
            thisController.botoneraController.globalCallObject.id = callObject.id;
        }else{
            thisController.botoneraController.globalCallObject.id = cicGetCallId();
        }

        cicTrace("loadingToCall thisController.botoneraController.globalCallObject.id: " + thisController.botoneraController.globalCallObject.id);

        thisController.botoneraController.globalCallObject.stateChangeHandler = function (StateID, StateString) {
            thisController.botoneraController.cambiaEstadoLlamada(StateID, StateString);
        }

        thisController.botoneraController.globalCallObject.errorHandler = function (ErrorId, ErrorText) {
            thisController.botoneraController.errorEnLlamada(ErrorId, ErrorText);
        }

        if (!app.isInboundCall) thisController.botoneraController.globalCallObject.setAttribute("ATTR_Nombre_OutSourcer", cicGetCallPaisId() + "_" + cicGetCallCallCenterId());

        thisController.cambioEstado();
    },
    finalizar: function (isAutomatic) {
			
        var thisController = this;
        cicTrace("Inicio Finalizar en " + campana.estado);
	clearTimeout(thisController.botoneraController.deshabilitarrediscado);
	       thisController.botoneraController.deshabilitarrediscado = null;
		   clearTimeout(thisController.botoneraController.cierreLlamadaTimeOut);
           thisController.botoneraController.cierreLlamadaTimeOut = null;
           clearTimeout(thisController.botoneraController.msgCierreLlamadaTimeOut);
           thisController.botoneraController.msgCierreLlamadaTimeOut = null;
        
		


        cicTrace("isAutomatic:" + isAutomatic);

        if (campana.estado == "waiting" || campana.estado == "break") {
            thisController.botoneraController.setAgentStatus("6"); //Fin Turno
            thisController.botoneraController.logOffCampana();
        }

        if (campana.estado == "call" || campana.estado == 'preview') {
            if (thisController.botoneraController.IVRConfirmation == "PROCESSING") return;
            thisController.finishingCall = true;

            var codFinalizacion = "";
            var finalizaConVenta = false;
            var estadoFinalizacion = "";
            var fechaAgendada;

            if (!isAutomatic) {
				
		        codFinalizacion = thisController.botoneraController.getCodigoFinalizacion();
                cicTrace("Finalizar - CodFinalizacion '" + codFinalizacion + "'");
                if (codFinalizacion == null || codFinalizacion == "Seleccione") {
                    showMsgBoxAlert("Debe seleccionar un código de finalización", "Finalización");
                    thisController.finishingCall = false;
                    return;
                }

                estadoFinalizacion = thisController.botoneraController.getEstadoFinalizacion();

                if (estadoFinalizacion == thisController.idGrupoVenta) {
                    finalizaConVenta = true;
                }

                if (estadoFinalizacion == thisController.idGrupoAgenda) {
                    try {
                        fechaAgendada = thisController.botoneraController.getInfoAgendamiento();
                    } catch (e) {
                        thisController.finishingCall = false;
                        showMsgBoxAlert(e, "Validación Fecha Agendamiento", "medium");
                        cicTrace("[Main][Finalizar] Error fecha Agendada: " + e);
                        return;
                    }
                }

            } else {
                var codFinalizacion = thisController.botoneraController.codFinalizacionAutomatico;
                var estadoFinalizacion = thisController.botoneraController.descFinalizacionAutomatico;
            }

            var info = thisController.getDataGestion(finalizaConVenta, isAutomatic);

            if (info) {

                if (info.infoGestion.sxbObservaciones) {
                    var observacionLength = info.infoGestion.sxbObservaciones.length;
                    if (observacionLength > 600) {
                        showMsgBoxAlert("Excedió largo permitido para la observación", "Validación Observación");
                        thisController.finishingCall = false;
                        return;
                    }
                }

  
                if (info.infoGestion.despReferencia) {
                    var referenciaLength = info.infoGestion.despReferencia.length;
                    if (referenciaLength > 200) {
                        showMsgBoxAlert("Excedió largo permitido para la referencia de la dirección", "Validación Referencia Dirección")
                        thisController.finishingCall = false;
                        return;
                    }
                }
            }

            cicTrace("[Main][Finalizar] hasInfo: " + (info!=null));

            if (info != null) {

                var cmdFinalizar = thisController.$this.find("#cmdFinalizar").button();
                enableButton(cmdFinalizar, false);

                if (estadoFinalizacion == thisController.idGrupoAgenda) {

                    info.infoGestion.table = thisController.metaDataObject.sxbGenerico1;
                    info.infoGestion.Agendamiento = thisController.dateTime2Object(fechaAgendada);
                    info.infoGestion.cuartil = "AGENDADO";
                    info.infoGestion.campaignName = thisController.metaDataObject.i3Campaignname;
                    info.infoGestion.generico15 = cicGetSystemAgentId();
                    info.infoGestion.agent = cicGetSystemAgentId();

                    if (app.isInboundCall) {
                        info.infoGestion.sxbReferido = "A";
                        if (!isMock) {
                            httpInvoke("SaveAgendado.ges", { param: info.infoGestion }, function () {
                            }, function (error) {
                            });

                        }

                    } else {
                        var obsCtl = thisController.metaDataObject.observaciones;

                        var idObs = parseInt(obsCtl);

                        if (isNaN(idObs)) {
                            idObs = -1;
                        }

                        info.idObs = idObs;

                        httpInvoke("AddOrSaveObservacion.ges", { param: info }, function (resp) {
                            info.idObs = resp.idObs;
                            thisController.SegundaParteFinalizar(info, estadoFinalizacion, codFinalizacion, fechaAgendada, cmdFinalizar);
                        }, function (msg) {
                            showMsgBoxError("No fue posible realizar la operacion. Favor intente de nuevamente.", "Finaliza Gestión");
                            //-----------  esta observacion queda registrada pero no se va a usar, este caso no deberia ocurrir mucho.
                            thisController.finishingCall = false;
                            enableButton(cmdFinalizar, true);
                        },
                        false,
                        5000);

                        return;
                    }

                }
                
                if (!isMock) {

                    cicTrace("[web][finaliza] Antes de invocar SegundaParteFinalizar");
                    thisController.SegundaParteFinalizar(info, estadoFinalizacion, codFinalizacion, fechaAgendada, cmdFinalizar);
                    cicTrace("[web][finaliza] Despues de invocar SegundaParteFinalizar");

                } else {
                    thisController.completaFinalizacionLlamada(estadoFinalizacion, codFinalizacion, fechaAgendada, info);
                    enableButton(cmdFinalizar, true);
                }

            }
        }
    },
    SegundaParteFinalizar: function (info, estadoFinalizacion, codFinalizacion, fechaAgendada, cmdFinalizar) {
        cicTrace("[web][SegundaParteFinalizar] Inicio");
        var thisController = this;       

        httpInvoke("AddOrSaveGestionVenta.ges", { param: info }, function (resp) {
            thisController.completaFinalizacionLlamada(estadoFinalizacion, codFinalizacion, fechaAgendada, info);
            enableButton(cmdFinalizar, true);
        }, function (msg) {
            cicTrace("[Main][Error AddOrSaveGestionVenta.ges] : " + msg);
            thisController.completaFinalizacionLlamada(estadoFinalizacion, codFinalizacion, fechaAgendada, info);
            enableButton(cmdFinalizar, true);
        },
        false,
        5000);
    },
    completaFinalizacionLlamada: function (estadoFinalizacion, codFinalizacion, fechaAgendada, info) {
        var thisController = this;
        
        cicTrace("Inicia Proceso Finalizacion");
        
        if (app.isInboundCall) {

            thisController.botoneraController.setAtributoGrabacion("ATTR_WRAPUPCODE", codFinalizacion);

        } else {

            if (estadoFinalizacion == thisController.idGrupoAgenda) {

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
                cicSetGenerico17(info.infoGestion.generico17);
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
            }else {
                var completeData = {
                    wrapupcode: codFinalizacion
                };
            }

            cicCallComplete(completeData);
        }
        
         if (thisController.botoneraController.cierreLlamadaTimeOut) {
            cicTrace("Se anula Timer de Cierre Automatico por Finalizacion");
            clearTimeout(thisController.botoneraController.cierreLlamadaTimeOut);
            thisController.botoneraController.cierreLlamadaTimeOut = null;
        }

        if (thisController.botoneraController.msgCierreLlamadaTimeOut) {
            cicTrace("Se anula Timer de Msg Cierre Automatico por Finalizacion");
            clearTimeout(thisController.botoneraController.msgCierreLlamadaTimeOut);
            thisController.botoneraController.msgCierreLlamadaTimeOut = null;
        }
        
        cicTrace("CallID to Finish: " + thisController.botoneraController.globalCallObject.id);
        cicTrace("StateCall to Finish: " + thisController.botoneraController.globalCallObject.state);
        cicTrace("ScripterCallObject.Id to Finish: " + scripter.callObject.id);

        var rutCliente = info.infoGestion.cliRutConDv;

        if (rutCliente) thisController.botoneraController.setAtributoGrabacion("ATTR_RUT_Cliente", rutCliente);	
		/*Agregado*/
	
		/*thisController.botoneraController.globalTransferenceObject.status
		
        /* Se quita para evitar cortar la llamada de Transferencia.
        if (thisController.botoneraController.globalTransferenceObject != null) {
            if (thisController.botoneraController.globalTransferenceObject.state != "106")
                thisController.botoneraController.globalTransferenceObject.disconnect();
        }
        */

        if (thisController.botoneraController.isTransferExecute) {
            thisController.botoneraController.globalCallObject.id = -1;
            thisController.botoneraController.globalCallObject = null;
        } else {
            thisController.botoneraController.globalCallObject.disconnect();
        }


        thisController.callController.resetTabs();

        if (app.isInboundCall) {
            if (thisController.botoneraController.requestBreak) {
                thisController.goToBreak();
            } else {
                campana.estado = "waiting";
                thisController.cambioEstado();
            }
        } else {
            if (thisController.botoneraController.requestBreak) {
                thisController.goToBreak();
            } else {
                campana.estado = "waiting";
                thisController.cambioEstado();
            }
        }
        app.isInboundCall = false;

        thisController.finishingCall = false;

        cicTrace("Finaliza Proceso Finalizacion");
    },
    getDataGestion: function (esVenta, isAutomatic) {
        var thisController = this;

        var infoCierre = new Object();
        var infoCliente = new Object();

        var observaciones = "";
        var estadoFinalizacion = "";
        estadoFinalizacion = thisController.botoneraController.getEstadoFinalizacion();
        observaciones = thisController.botoneraController.getObservaciones();

        var familia = (thisController.metaDataObject ? thisController.metaDataObject.callFamiliaId : cicGetCallFamiliaId());
        var sxbReferido = (thisController.metaDataObject ? thisController.metaDataObject.sxbReferido : cicGetSbxReferido());

        var esRegistroASB = false;

        if ((familia.indexOf("C2C") > -1 || familia.indexOf("CMB") > -1) && (sxbReferido != "R")) {
            esRegistroASB = true;
        }

        if (esVenta) {

            infoCierre = thisController.callController.getInfoCierre();

            var descFinalizacion = thisController.botoneraController.getCodigoFinalizacionDesc();

            //Validar Info            
            var msg = "";
            if (!infoCierre.infoCliente.nombre) {
                msg += "- 'Nombre y Apellidos' es obligatorio<br>";
            }

            if (!infoCierre.infoCliente.rut) {
                msg += "- 'Rut' es obligatorio<br>";
            }

            if (descFinalizacion.toUpperCase() == "VENTA SIN SISTEMA") {

                if (!infoCierre.infoCliente.serieRut) {
                    msg += "- '# Serie' es obligatorio<br>";
                }

                if (!infoCierre.infoCliente.fechaNacimiento) {
                    msg += "- 'Fecha Nacimiento' es obligatorio<br>";
                }

                if (!infoCierre.infoCliente.fono1) {
                    msg += "- 'Fono Contacto 1' es obligatorio<br>";
                }

                if (!infoCierre.infoCliente.fono2) {
                    msg += "- 'Fono Contacto 2' es obligatorio<br>";
                }

                if (!infoCierre.infoCliente.email) {
                    msg += "- 'Email' es obligatorio<br>";
                }

                //Dirección Particular                

                if (esRegistroASB) {

                    if (!infoCierre.infoCliente.direccion) {
                        msg += "- 'Dirección' es obligatorio<br>";
                    }

                } else {
                    if (!infoCierre.infoCliente.calle) {
                        msg += "- 'Calle' es obligatorio<br>";
                    }

                    if (!infoCierre.infoCliente.numero) {
                        msg += "- 'Número' es obligatorio<br>";
                    }

                    if (!infoCierre.infoCliente.entreCalle) {
                        msg += "- 'Entre Calles' es obligatorio<br>";
                    }
                }

                if (!infoCierre.infoCliente.region) {
                    msg += "- 'Región' es obligatorio<br>";
                }

                if (!infoCierre.infoCliente.comuna) {
                    msg += "- 'Comuna' es obligatorio<br>";
                }

                //Observaciones
                if ($.trim(observaciones).length == 0) {
                    msg += "- Debe ingresar el detalle de la venta en 'Observaciones'<br>";
                }

            }


            if (msg.length > 0) {

                msg = "Para finalizar como " + (descFinalizacion.toUpperCase() != "VENTA SIN SISTEMA" ? "Venta" : "Venta sin Sistema") + " debe generar la ficha de Cierre: <br>" + msg;

                var msgHeight = thisController.getHeightMessage(msg);

                showMsgBoxAlert(msg, "Validación de Información Cliente", msgHeight);
                return null;
            }

            //General 
            //Valida al menos una venta registrada
            if (!infoCierre.infoFolios.ventasFijo && !infoCierre.infoFolios.ventasSVA && !infoCierre.infoFolios.ventasMigraciones && !infoCierre.infoFolios.ventasMovil && !(esRegistroASB && infoCierre.infoOferta.ventaOferta)) {
                msg += "- Debe seleccionar venta de un producto" + (esRegistroASB ? " o de la oferta<br>" : "<br>");
            }

            if (msg.length > 0) {

                msg = "Para finalizar como " + (descFinalizacion.toUpperCase() != "VENTA SIN SISTEMA" ? "Venta" : "Venta sin Sistema") + ": <br>" + msg;

                var msgHeight = thisController.getHeightMessage(msg);

                showMsgBoxAlert(msg, "Validación de Información Cliente", msgHeight);
                return null;
            }

            //Fijo
            if (infoCierre.infoFolios.ventasFijo) {
                if (infoCierre.infoFolios.mixVenta == "-1") {
                    msg += "- Debe seleccionar 'Mix Venta'<br>";
                }
            }

            //Movil
            if (infoCierre.infoFolios.ventasMovil) {

                if (!infoCierre.infoFolios.vendeAltaConEquipo && !infoCierre.infoFolios.vendeAltaSinEquipo && !infoCierre.infoFolios.vendePortaConEquipo && !infoCierre.infoFolios.vendePortaSinEquipo && !infoCierre.infoFolios.vendeBAM) {
                    msg += "- Debe seleccionar al menos un 'Producto Móvil'<br>";
                } else {
                    if (!infoCierre.infoFolios.altoValor && !infoCierre.infoFolios.medioValor && !infoCierre.infoFolios.bajoValor) {
                        msg += "- Debe seleccionar un 'Tipo de Producto'<br>";
                    }
                }

                if (infoCierre.infoFolios.vendeAltaConEquipo) {
                    if (infoCierre.infoFolios.cantidadAltaConEquipo == "") {
                        msg += "- Debe ingresar cantidad para 'Alta Con Equipo'<br>";
                    }
                }

                if (infoCierre.infoFolios.vendeAltaSinEquipo) {
                    if (infoCierre.infoFolios.cantidadAltaSinEquipo == "") {
                        msg += "- Debe ingresar cantidad para 'Alta Sin Equipo'<br>";
                    }
                }

                if (infoCierre.infoFolios.vendePortaConEquipo) {
                    if (infoCierre.infoFolios.cantidadPortaConEquipo == "") {
                        msg += "- Debe ingresar cantidad para 'Porta Con Equipo'<br>";
                    }
                }

                if (infoCierre.infoFolios.vendePortaSinEquipo) {
                    if (infoCierre.infoFolios.cantidadPortaSinEquipo == "") {
                        msg += "- Debe ingresar cantidad para 'Porta Sin Equipo'<br>";
                    }
                }

                if (infoCierre.infoFolios.vendeBAM) {
                    if (infoCierre.infoFolios.cantidadBAM == "") {
                        msg += "- Debe ingresar cantidad para 'BAM'<br>";
                    }
                }
            }

            if (descFinalizacion.toUpperCase() == "VENTA") {

                //Fijo
                if (infoCierre.infoFolios.ventasFijo) {
                    if (infoCierre.infoFolios.folioUnifica == "") {
                        msg += "- Debe ingresar 'Folio Unifica'<br>";
                    }
                }

                //Movil
                if (infoCierre.infoFolios.ventasMovil) {
                    if (infoCierre.infoFolios.folioOL == "" && infoCierre.infoFolios.folioMC == "") {
                        msg += "- Debe ingresar 'Folio Operador Logístico ó Multicanalidad'<br>";
                    }
                }

                //SVA - Migraciones
                if (infoCierre.infoFolios.ventasSVA || infoCierre.infoFolios.ventasMigraciones) {
                    if (infoCierre.infoFolios.folioSiglo == "") {
                        msg += "- Debe ingresar 'Folio Siglo'<br>";
                    }
                }

                //Oferta
                if (esRegistroASB && infoCierre.infoOferta.ventaOferta) {
                    if (infoCierre.infoOferta.folioOferta == "") {
                        msg += "- Debe ingresar 'Folio Oferta'<br>";
                    }
                }

            }

            if (msg.length > 0) {

                msg = "Para finalizar como " + (descFinalizacion.toUpperCase() != "VENTA SIN SISTEMA" ? "Venta" : "Venta sin Sistema") + " debe completar la información de los productos" + (esRegistroASB ? " y/o de la oferta" : "") + " vendida: <br>" + msg;

                var msgHeight = thisController.getHeightMessage(msg);

                showMsgBoxAlert(msg, "Validación de Información Venta", msgHeight);
                return null;
            }

        } else {

            infoCliente = thisController.callController.getCliente();

            if (estadoFinalizacion == thisController.idGrupoAgenda) {
                //Validar Info Agenda          
                var msg = "";
                if (!infoCliente.nombreCli) {
                    msg += "- 'Nombre de Cliente'<br>";
                }

                if (!infoCliente.rutCli) {
                    msg += "- 'Rut'<br>";
                }

                if (msg.length > 0) {

                    msg = "Para agendar debe ingresar en 'Datos Básicos del Cliente': <br>" + msg;

                    showMsgBoxAlert(msg, "Validación de Información Agenda");
                    return null;
                }
            }

        }


        var infoRequest = new Object();
        var infoGestion = new Object();

        infoGestion.esVenta = esVenta;
        
        var idObs = -1;

        if (!app.isInboundCall) {
            var obsCtl = cicGetSbxObservaciones();
            idObs = parseInt(obsCtl);
            if (isNaN(idObs)) {
                idObs = -1;
            }
        }
        

        infoGestion.idObs = idObs;

        infoGestion.callRegId = thisController.metaDataObject.callRegId;
       
        if (!isAutomatic) {            
            infoGestion.fbackFinalizacionCod = thisController.botoneraController.getCodigoFinalizacion();
            infoGestion.fbackFinalizacionDesc = thisController.botoneraController.getCodigoFinalizacionDesc();
        } else {
            estadoFinalizacion = thisController.botoneraController.codFinalizacionAutomatico;
            infoGestion.fbackFinalizacionCod = estadoFinalizacion;
            infoGestion.fbackFinalizacionDesc = thisController.botoneraController.descFinalizacionAutomatico;

        }
        

        if (estadoFinalizacion == thisController.idGrupoVenta) {
            if (infoGestion.fbackFinalizacionDesc.toUpperCase() == "VENTA") infoGestion.idUltimoEstado = "6"; //Venta Emitida
            else infoGestion.idUltimoEstado = "8"; //Venta Sin Sistema
        } else {
            infoGestion.idUltimoEstado = "3";
        }

        infoGestion.fBackFecHora = "";
        infoGestion.callPaisId = app.isInboundCall ? thisController.metaDataObject.callPaisId : cicGetCallPaisId();
        infoGestion.callCallcenterId =  app.isInboundCall ? thisController.metaDataObject.callCallcenterId :cicGetCallCallCenterId() ;
        infoGestion.callCanalId =  app.isInboundCall ? thisController.metaDataObject.callCanalId : cicGetCallCanalId();
        infoGestion.callFamiliaId =  app.isInboundCall ? thisController.metaDataObject.callFamiliaId : cicGetCallFamiliaId();
        infoGestion.callFecGestIni = thisController.parseFecha(app.isInboundCall ? "" : cicGetCallFecGestIni());
        infoGestion.callFecGestFin = thisController.parseFecha(app.isInboundCall ? "" : cicGetCallFecGestFin());
        infoGestion.callBatchId =  app.isInboundCall  ? thisController.metaDataObject.callBatchId : cicGetCallBatchId();
        infoGestion.callSistemaId =  app.isInboundCall ? thisController.metaDataObject.callSistemaId : cicGetCallSistemaId();
        infoGestion.callArchivo = app.isInboundCall ? thisController.metaDataObject.callArchivo : cicGetCallArchivo();
        infoGestion.accId = app.isInboundCall ? thisController.metaDataObject.accId : cicGetAccId();
        infoGestion.accLineaId = app.isInboundCall ? thisController.metaDataObject.accLineaId : cicGetAccLineaId();
        infoGestion.accCampanaId = app.isInboundCall ? thisController.metaDataObject.accCampanaId : cicGetAccCampanaId();
        infoGestion.accHorario = app.isInboundCall ? thisController.metaDataObject.accHorario : cicGetAccHorario();
        infoGestion.accArg1Id = app.isInboundCall ?  thisController.metaDataObject.accArg1Id : cicGetAccArg1Id();
        infoGestion.accArg2Id = app.isInboundCall ? thisController.metaDataObject.accArg2Id : cicGetAccArg2Id();
        infoGestion.accArg3Id = app.isInboundCall ? thisController.metaDataObject.accArg3Id : cicGetAccArg3Id();
        infoGestion.accPreg1 = app.isInboundCall ? thisController.metaDataObject.accPreg1 : cicGetAccPreg1();
        infoGestion.accResp1 = "";
        infoGestion.accPreg2 = app.isInboundCall ? thisController.metaDataObject.accPreg2 : cicGetAccPreg2();
        infoGestion.accResp2 = "";
        infoGestion.accScore = app.isInboundCall ? thisController.metaDataObject.accScore : cicGetAccScore();
        infoGestion.cliId = app.isInboundCall ? thisController.metaDataObject.cliId : cicGetCliId();
        infoGestion.cliRutConDv = (esVenta ? infoCierre.infoCliente.rut : infoCliente.rutCli);
        infoGestion.cliNombre = (esVenta ? infoCierre.infoCliente.nombre : infoCliente.nombreCli);
        infoGestion.cliSegmento = app.isInboundCall ?  thisController.metaDataObject.cliSegmento : cicGetCliSegmento();
        infoGestion.cliGse = app.isInboundCall ? thisController.metaDataObject.cliGse : cicGetCliGse();
        infoGestion.cliAntiguedad = app.isInboundCall ? thisController.metaDataObject.cliAntiguedad : cicGetCliAntiguedad();
        infoGestion.cliLineaAntiguedad = app.isInboundCall ? thisController.metaDataObject.cliLineaAntiguedad : cicGetCliLineaAntiguedad();
        infoGestion.cliCicloCod = "";
        infoGestion.cliIndPortado = app.isInboundCall ? thisController.metaDataObject.cliIndPortado : cicGetCliIndPortado();
        infoGestion.cliUltBoletaMonto = app.isInboundCall ? thisController.metaDataObject.cliUltBoletaMonto : cicGetCliUltBoletaMonto();
        infoGestion.cliContacAlter = (esVenta ? infoCierre.infoCliente.fono1 : infoCliente.fono1Cli);
        infoGestion.cliContacAlterFijo = (esVenta ? infoCierre.infoCliente.fono2 : infoCliente.fono2Cli);
        infoGestion.cliContacAlterMovil = (esVenta ? infoCierre.infoCliente.fono3 : infoCliente.fono3Cli);
        infoGestion.cliNumSerie = (esVenta ? infoCierre.infoCliente.serieRut : infoCliente.serieCli);
        infoGestion.cliNotificar = (esVenta ? infoCierre.infoCliente.notificar : infoCliente.notificarCli) ? "1" : "0";
        infoGestion.webEmail = (esVenta ? infoCierre.infoCliente.email : infoCliente.emailCli);
        infoGestion.fechaNacimiento = (esVenta ? infoCierre.infoCliente.fechaNacimiento : infoCliente.fechaNacimientoCli);

        infoGestion.prodVigDesc = app.isInboundCall ? thisController.metaDataObject.prodVigDesc : cicGetProdVigDesc();
        infoGestion.prodVigPrecio = app.isInboundCall ? thisController.metaDataObject.prodVigPrecio : cicGetProdVigPrecio();
        infoGestion.prodVigFinPromo = thisController.parseFecha(app.isInboundCall ? thisController.metaDataObject.prodVigFinPromo : cicGetProdVigFinPromo());
        infoGestion.dirDireccion = (esVenta ? infoCierre.infoCliente.direccion : infoCliente.direccionCli);
        infoGestion.dirCalle = (!esRegistroASB ? (esVenta ? infoCierre.infoCliente.calle : infoCliente.calleCli) : ""); 
        infoGestion.dirNro = (!esRegistroASB ? (esVenta ? infoCierre.infoCliente.numero : infoCliente.numeroCli) : "");
        infoGestion.dirPiso = (!esRegistroASB ? (esVenta ? infoCierre.infoCliente.piso : infoCliente.pisoCli) : ""); 
        infoGestion.dirDepto = (!esRegistroASB ? (esVenta ? infoCierre.infoCliente.depto : infoCliente.deptoCli) : ""); 
        infoGestion.dirComuna = (esVenta ? infoCierre.infoCliente.comuna : infoCliente.comunaCli);
        infoGestion.dirCiudad = "";
        infoGestion.dirRegion = (esVenta ? infoCierre.infoCliente.region : infoCliente.regionCli);
        infoGestion.dirEntreCalles = (!esRegistroASB ? (esVenta ? infoCierre.infoCliente.entreCalle : infoCliente.entreCalleCli) : "");
        infoGestion.dirYCalles = (!esRegistroASB ? (esVenta ? infoCierre.infoCliente.yCalle : infoCliente.yCalleCli) : ""); 
        infoGestion.oferP1Cod = app.isInboundCall ? "" : cicGetOferP1Cod();
        infoGestion.oferP1Desc = app.isInboundCall ? "" : cicGetOferP1Desc();
        infoGestion.oferP1Precio = app.isInboundCall ? "" : cicGetOferP1Precio();
        infoGestion.oferP1Delta = "";
        infoGestion.oferP1Vendido = app.isInboundCall ? "" : (esRegistroASB && esVenta? (infoCierre.infoOferta.ventaOferta ? "1" : "0") : "");
        infoGestion.oferP1Cantidad = app.isInboundCall ? "" : (esRegistroASB && esVenta ? (infoCierre.infoOferta.ventaOferta ? 1 : 0) : "");
        infoGestion.oferP2Cod = "";
        infoGestion.oferP2Desc = "";
        infoGestion.oferP2Precio = "";
        infoGestion.oferP2Delta = "";
        infoGestion.oferP2Vendido = "";
        infoGestion.oferP2Cantidad = "";
        infoGestion.oferP3Cod = "";
        infoGestion.oferP3Desc = "";
        infoGestion.oferP3Precio = "";
        infoGestion.oferP3Delta = "";
        infoGestion.oferP3Vendido = "";
        infoGestion.oferP3Cantidad = "";
        infoGestion.oferP4Cod = "";
        infoGestion.oferP4Desc = "";
        infoGestion.oferP4Precio = "";
        infoGestion.oferP4Delta = "";
        infoGestion.oferP4Vendido = "";
        infoGestion.oferP4Cantidad = "";
        infoGestion.oferP5Cod = "";
        infoGestion.oferP5Desc = "";
        infoGestion.oferP5Precio = "";
        infoGestion.oferP5Delta = "";
        infoGestion.oferP5Vendido = "";
        infoGestion.oferP5Cantidad = "";
        infoGestion.ventaProdCod = app.isInboundCall ? thisController.metaDataObject.ventaProdCod : cicGetVentaProdCod();
        infoGestion.ventaSistemaId = app.isInboundCall ? thisController.metaDataObject.ventaSistemaId : cicGetVentaSistemaId();
        infoGestion.ventaOossCod = app.isInboundCall ? thisController.metaDataObject.ventaOossCod : cicGetVentaOossCod();
        infoGestion.generico01 = app.isInboundCall ? thisController.metaDataObject.generico01 : cicGetGenerico01();
        infoGestion.generico02 = app.isInboundCall ? thisController.metaDataObject.generico02 : cicGetGenerico02();
        infoGestion.generico03 = app.isInboundCall ? thisController.metaDataObject.generico03 : cicGetGenerico03();
        infoGestion.generico04 = app.isInboundCall ? thisController.metaDataObject.generico04 : cicGetGenerico04();
        infoGestion.generico05 = app.isInboundCall ? thisController.metaDataObject.generico05 : cicGetGenerico05();
        infoGestion.generico06 = app.isInboundCall ? thisController.metaDataObject.generico06 : cicGetGenerico06();
        infoGestion.generico07 = app.isInboundCall ? thisController.metaDataObject.generico07 : cicGetGenerico07();
        infoGestion.generico08 = app.isInboundCall ? thisController.metaDataObject.generico08 : cicGetGenerico08();
        infoGestion.generico09 = app.isInboundCall ? thisController.metaDataObject.generico09 : cicGetGenerico09();
        infoGestion.generico10 = app.isInboundCall ? thisController.metaDataObject.generico10 : cicGetGenerico10();
        infoGestion.generico11 = app.isInboundCall ? thisController.metaDataObject.generico11 : cicGetGenerico11();
        infoGestion.generico12 = app.isInboundCall ? thisController.metaDataObject.generico12 : cicGetGenerico12();
        infoGestion.generico13 = app.isInboundCall ? thisController.metaDataObject.generico13 : cicGetGenerico13();
        infoGestion.generico14 = app.isInboundCall ? thisController.metaDataObject.generico14 : cicGetGenerico14();
        infoGestion.generico15 = app.isInboundCall ? thisController.metaDataObject.generico15 : cicGetGenerico15();
        infoGestion.generico16 = app.isInboundCall ? thisController.metaDataObject.generico16 : (esRegistroASB && esVenta && infoCierre.infoOferta.ventaOferta ? infoCierre.infoOferta.folioOferta : "");
        infoGestion.generico17 = app.isInboundCall ? thisController.metaDataObject.generico17 : cicGetGenerico17();
        infoGestion.generico18 = app.isInboundCall ? thisController.metaDataObject.generico18 : cicGetGenerico18();
        infoGestion.generico19 = thisController.botoneraController.isTransferExecute ? "Transfer" : "";
        
        infoGestion.i3Identity = app.isInboundCall ? thisController.metaDataObject.i3Identity : cicGetI3Identity();
        infoGestion.zone = app.isInboundCall ? thisController.metaDataObject.zone : cicGetZone();
        infoGestion.attempts = app.isInboundCall ? thisController.metaDataObject.attempts : cicGetAttemps();
        infoGestion.status = app.isInboundCall ? thisController.metaDataObject.status : cicGetStatus();
        infoGestion.i3Siteid = app.isInboundCall ? thisController.metaDataObject.i3Siteid : cicGetI3SiteId();
        infoGestion.i3Activecampaignid = app.isInboundCall ? thisController.metaDataObject.i3Activecampaignid : cicGetI3ActiveCampaignId();
        infoGestion.i3Attemptsremotehangup = app.isInboundCall ? thisController.metaDataObject.i3Attemptsremotehangup : cicGetI3AttemptsRemoteHangUp();
        infoGestion.i3Attemptssystemhangup = app.isInboundCall ? thisController.metaDataObject.i3Attemptssystemhangup : cicGetI3AttemptsSystemHangUp();
        infoGestion.i3Attemptsabandoned = app.isInboundCall ? thisController.metaDataObject.i3Attemptsabandoned : cicGetI3AttemptsAbandoned();
        infoGestion.i3Attemptsbusy = app.isInboundCall ? thisController.metaDataObject.i3Attemptsbusy : cicGetI3AttemptsBusy();
        infoGestion.i3Attemptsfax = app.isInboundCall ? thisController.metaDataObject.i3Attemptsfax : cicGetI3AttempsFax();
        infoGestion.i3Attemptsnoanswer = app.isInboundCall ? thisController.metaDataObject.i3Attemptsnoanswer : cicGetI3AttempsNoAnswer();
        infoGestion.i3Attemptsmachine = app.isInboundCall ? thisController.metaDataObject.i3Attemptsmachine : cicGetI3AttempsMachine();
        infoGestion.i3Attemptsrescheduled = app.isInboundCall ? thisController.metaDataObject.i3Attemptsrescheduled : cicGetI3AttemptsRescheduled();
        infoGestion.i3Attemptssitcallable = app.isInboundCall ? thisController.metaDataObject.i3Attemptssitcallable : cicGetI3AttemptsSitCallable();
        infoGestion.i3Attemptsdaily = app.isInboundCall ? thisController.metaDataObject.i3Attemptsdaily : cicGetI3AttemptsDaily();
        infoGestion.i3LastcalledUtc = thisController.parseFecha(app.isInboundCall ? thisController.parseFecha(thisController.metaDataObject.i3LastcalledUtc) : cicGetI3LastCalledUtc());
        infoGestion.successresult = app.isInboundCall ? thisController.metaDataObject.successresult : cicGetSuccessResult();
        infoGestion.i3UploadId = app.isInboundCall ? thisController.metaDataObject.i3UploadId : cicGetI3UploadId();
        infoGestion.i3Rowid = app.isInboundCall ? thisController.metaDataObject.i3Rowid : cicGetI3RowId();
        infoGestion.dncRegId = app.isInboundCall ? thisController.metaDataObject.dncRegId : cicGetDncRegId();

        var numberToDial = app.isInboundCall ? thisController.metaDataObject.phoneNumber : cicGetAccLineaId();
        var fbackLinea = app.isInboundCall ? thisController.metaDataObject.fbackLinea : cicGetAccLineaId();

        if (numberToDial.indexOf("sip:") > -1 || numberToDial.indexOf("@") > -1) {
            numberToDial = numberToDial.replace("sip:", "");
            numberToDial = numberToDial.substring(0, numberToDial.indexOf("@"));
        }

        if (fbackLinea.indexOf("sip:") > -1 || fbackLinea.indexOf("@") > -1) {
            fbackLinea = fbackLinea.replace("sip:", "");
            fbackLinea = fbackLinea.substring(0, fbackLinea.indexOf("@"));
        }


        infoGestion.phoneNumber = numberToDial;
        infoGestion.toExclude = app.isInboundCall ? thisController.metaDataObject.toExclude : cicGetToExclude();
        infoGestion.expiration = app.isInboundCall ? thisController.metaDataObject.expiration : cicGetExpiration();
        infoGestion.fbackRegId = "";
        infoGestion.fbackLinea = fbackLinea;
        infoGestion.fbackEstado = "0";

        

        /*

        var callIdOriginal = thisController.botoneraController.callIdOriginal;

        //i3Callid
        var callIdKeyOriginal = thisController.botoneraController.callIdKeyOriginal;
        infoGestion.i3Callid = (callIdKeyOriginal ? callIdKeyOriginal : callIdOriginal);

        //i3CallidRellamada
        if (callIdOriginal == thisController.botoneraController.globalCallObject.id) {
            infoGestion.callIdRellamada = "";
        } else {
            if (thisController.botoneraController.isTransferExecute) {
                if (thisController.botoneraController.ultimoRediscadoCallObject != null) {
                    infoGestion.callIdRellamada = thisController.botoneraController.ultimoRediscadoCallObject.id;
                }
                else {
                    cicTrace("No es posible recuperar IdLlamada Rediscado luego de una Transferencia");
                    infoGestion.callIdRellamada = "";
                }
            } else {
                infoGestion.callIdRellamada = thisController.botoneraController.globalCallObject.id;
            }
        }
        */

        //i3Callid //i3CallidRellamada
        var callIdOriginal = thisController.botoneraController.callIdOriginal;
        var callIdKeyOriginal = thisController.botoneraController.callIdKeyOriginal;

        if (callIdOriginal != thisController.botoneraController.globalCallObject.id) {
			 infoGestion.i3Callid = thisController.botoneraController.globalCallObject.id;
            infoGestion.callIdRellamada = (callIdKeyOriginal ? callIdKeyOriginal : callIdOriginal);
                   
        } else {
            infoGestion.callIdRellamada = "";
            infoGestion.i3Callid = (callIdKeyOriginal ? callIdKeyOriginal : callIdOriginal);  
        }        

        infoGestion.destinoLogistico = "";
        infoGestion.movSucursal = "";

        infoGestion.webNumAtencionCamaleon = app.isInboundCall ? "" : (esRegistroASB ? cicGetGenerico01() : "");
        infoGestion.webDireccion = app.isInboundCall ? "" : (esRegistroASB ? (esVenta ? infoCierre.infoCliente.direccion : infoCliente.direccionCli) : "");


        if (estadoFinalizacion == thisController.idGrupoAgenda) {
            var fechaAgendada = thisController.botoneraController.getInfoAgendamiento();
            infoGestion.fechaAgendamiento = thisController.dateTime2Object(fechaAgendada);
            infoGestion.Agendamiento = thisController.dateTime2Object(fechaAgendada);
            infoGestion.cuartil = cicGetSystemAgentId();
        } else {
            infoGestion.fechaAgendamiento = "";
            infoGestion.cuartil = app.isInboundCall ? thisController.metaDataObject.cuartil : cicGetCuartil();
        }
        
        infoGestion.webTipoSolicitud = app.isInboundCall ? "" : (esRegistroASB ? cicGetGenerico11() : "");
        infoGestion.webAni = app.isInboundCall ? "" : (esRegistroASB ? cicGetAccLineaId() : "");
        infoGestion.webCodigoEquipo = app.isInboundCall ? "" : (esRegistroASB ? cicGetGenerico09() : "");
        infoGestion.webCodigoPlan = app.isInboundCall ? "" : (esRegistroASB ? cicGetGenerico10() : "");
        infoGestion.webTipoRequerimiento = app.isInboundCall ? "" : (esRegistroASB ? cicGetGenerico06() : "");
        infoGestion.webOrigen = app.isInboundCall ? "" : (esRegistroASB ? cicGetGenerico08() : "");
        infoGestion.webCategoria = app.isInboundCall ? "" : (esRegistroASB ? cicGetGenerico07() : "");
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
        infoGestion.svaViaCertificacion = "";
        infoGestion.i3Userid = cicGetSystemAgentId();
        infoGestion.i3Campaignname = app.isInboundCall ? thisController.metaDataObject.i3Campaignname : cicGetCampaignName();
        infoGestion.fbackCierreFecHora = "";
        infoGestion.useridBackoffice = "";
        infoGestion.tipoCliente = "";
        infoGestion.tipoVenta = "";
        infoGestion.oferP1Categoria = "";
        infoGestion.oferP2Categoria = "";
        infoGestion.oferP3Categoria = "";
        infoGestion.oferP4Categoria = "";
        infoGestion.oferP5Categoria = "";
       
        infoGestion.despCalle = (esVenta ? infoCierre.infoDespacho.calle : "");
        infoGestion.despComuna = (esVenta ? infoCierre.infoDespacho.comuna : "");
        infoGestion.despDepto = (esVenta ? infoCierre.infoDespacho.depto : "");
        infoGestion.despEntreCalles = (esVenta ? infoCierre.infoDespacho.entreCalle : "");
        infoGestion.despNro = (esVenta ? infoCierre.infoDespacho.numero : "");
        infoGestion.despPersonaContactar = (esVenta ? infoCierre.infoDespacho.nombre : "");
        infoGestion.despPiso = (esVenta ? infoCierre.infoDespacho.piso : "");
        infoGestion.despReferencia = (esVenta ? infoCierre.infoDespacho.referencia : "");
        infoGestion.despRegion = (esVenta ? infoCierre.infoDespacho.region : "");
        infoGestion.despYCalles = (esVenta ? infoCierre.infoDespacho.yCalle : "");

        infoGestion.sxbObservaciones = observaciones;

        infoGestion.svaViaCertificacion = "";
        infoGestion.folioSiglo = (esVenta ? infoCierre.infoFolios.folioSiglo : "");
        infoGestion.folioUnifica = (esVenta ? infoCierre.infoFolios.folioUnifica : "");
        infoGestion.folioOl = (esVenta ? infoCierre.infoFolios.folioOL : "");
        infoGestion.folioMulticanalidad = (esVenta ? infoCierre.infoFolios.folioMC : "");

        infoGestion.sxbReferido = app.isInboundCall ? thisController.metaDataObject.sxbReferido : cicGetSbxReferido();
        infoGestion.sxbGenerico1 = app.isInboundCall ? thisController.metaDataObject.sxbGenerico1 : cicGetSbxGenerico1();

        infoGestion.sxbGenerico3 = thisController.botoneraController.IVRConfirmation == null ? "" : thisController.botoneraController.IVRConfirmation;

        infoRequest.infoGestion = infoGestion;

        //Info Preventa
        var infoPreventas = new Array();

        if (esVenta) {
            if (infoCierre.infoFolios.ventasFijo) {
                var preventa = new Object();
                var infoPreventa = new Object();
                infoPreventa.idMixPreventa = infoCierre.infoFolios.mixVenta;
                infoPreventa.canal = "";
                infoPreventa.familia = "FIJO";
                infoPreventa.fecha = "";
                infoPreventa.operadorDonante = "";
                infoPreventa.sexo = "";
                infoPreventa.edoCivil = "";
                infoPreventa.cicloFacturacion = "";
                infoPreventa.modoPago = "";
                infoPreventa.cuotas = "";
                infoPreventa.fonoAPortar = "";
                infoPreventa.seguro = "";
                infoPreventa.grupoIse = "";
                infoPreventa.limiteCredito = "";
                infoPreventa.dMapas = "";
                infoPreventa.d21 = "";
                infoPreventa.observacionVenta = "";
                preventa.infoPreventa = infoPreventa;
                infoPreventas.push(preventa);
            }

            if (infoCierre.infoFolios.ventasSVA) {
                var preventa = new Object();
                var infoPreventa = new Object();
                infoPreventa.idMixPreventa = "";
                infoPreventa.canal = "";
                infoPreventa.familia = "SVA";
                infoPreventa.fecha = "";
                infoPreventa.operadorDonante = "";
                infoPreventa.sexo = "";
                infoPreventa.edoCivil = "";
                infoPreventa.cicloFacturacion = "";
                infoPreventa.modoPago = "";
                infoPreventa.cuotas = "";
                infoPreventa.fonoAPortar = "";
                infoPreventa.seguro = "";
                infoPreventa.grupoIse = "";
                infoPreventa.limiteCredito = "";
                infoPreventa.dMapas = "";
                infoPreventa.d21 = "";
                infoPreventa.observacionVenta = "";
                preventa.infoPreventa = infoPreventa;
                infoPreventas.push(preventa);
            }

            if (infoCierre.infoFolios.ventasMigraciones) {
                var preventa = new Object();
                var infoPreventa = new Object();
                infoPreventa.idMixPreventa = "";
                infoPreventa.canal = "";
                infoPreventa.familia = "MIGRACIONES";
                infoPreventa.fecha = "";
                infoPreventa.operadorDonante = "";
                infoPreventa.sexo = "";
                infoPreventa.edoCivil = "";
                infoPreventa.cicloFacturacion = "";
                infoPreventa.modoPago = "";
                infoPreventa.cuotas = "";
                infoPreventa.fonoAPortar = "";
                infoPreventa.seguro = "";
                infoPreventa.grupoIse = "";
                infoPreventa.limiteCredito = "";
                infoPreventa.dMapas = "";
                infoPreventa.d21 = "";
                infoPreventa.observacionVenta = "";
                preventa.infoPreventa = infoPreventa;
                infoPreventas.push(preventa);
            }

            if (infoCierre.infoFolios.ventasMovil) {
                var preventa = new Object();
                var infoPreventa = new Object();
                infoPreventa.idMixPreventa = "";
                infoPreventa.canal = "";
                infoPreventa.familia = "MOVIL";
                infoPreventa.fecha = "";
                infoPreventa.operadorDonante = "";
                infoPreventa.sexo = "";
                infoPreventa.edoCivil = "";
                infoPreventa.cicloFacturacion = "";
                infoPreventa.modoPago = "";
                infoPreventa.cuotas = "";
                infoPreventa.fonoAPortar = "";
                infoPreventa.seguro = "";
                infoPreventa.grupoIse = (infoCierre.infoFolios.altoValor ? "1" : "0") + "|" + (infoCierre.infoFolios.medioValor ? "1" : "0") + "|" + (infoCierre.infoFolios.bajoValor ? "1" : "0");
                infoPreventa.limiteCredito = "";
                infoPreventa.dMapas = "";
                infoPreventa.d21 = "";
                infoPreventa.observacionVenta = "";
                preventa.infoPreventa = infoPreventa;

                var infoDetallePreventa = new Array();
                if (infoCierre.infoFolios.vendeAltaConEquipo) {
                    for (var i = 0; i < parseInt(infoCierre.infoFolios.cantidadAltaConEquipo) ; i++) {
                        var detallePreventa = new Object();
                        detallePreventa.TipoVenta = "Alta Con Equipo";
                        infoDetallePreventa.push(detallePreventa);
                    }
                }

                if (infoCierre.infoFolios.vendeAltaSinEquipo) {
                    for (var i = 0; i < parseInt(infoCierre.infoFolios.cantidadAltaSinEquipo) ; i++) {
                        var detallePreventa = new Object();
                        detallePreventa.TipoVenta = "Alta Sin Equipo";
                        infoDetallePreventa.push(detallePreventa);
                    }
                }

                if (infoCierre.infoFolios.vendePortaConEquipo) {
                    for (var i = 0; i < parseInt(infoCierre.infoFolios.cantidadPortaConEquipo) ; i++) {
                        var detallePreventa = new Object();
                        detallePreventa.TipoVenta = "Porta Con Equipo";
                        infoDetallePreventa.push(detallePreventa);
                    }
                }

                if (infoCierre.infoFolios.vendePortaSinEquipo) {
                    for (var i = 0; i < parseInt(infoCierre.infoFolios.cantidadPortaSinEquipo) ; i++) {
                        var detallePreventa = new Object();
                        detallePreventa.TipoVenta = "Porta Sin Equipo";
                        infoDetallePreventa.push(detallePreventa);
                    }
                }

                if (infoCierre.infoFolios.vendeBAM) {
                    for (var i = 0; i < parseInt(infoCierre.infoFolios.cantidadBAM) ; i++) {
                        var detallePreventa = new Object();
                        detallePreventa.TipoVenta = "BAM";
                        infoDetallePreventa.push(detallePreventa);
                    }
                }

                preventa.infoDetallePreventa = infoDetallePreventa;
                infoPreventas.push(preventa);

            }
        }

        infoRequest.infoPreventas = infoPreventas;

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
    },
    dateTime2Object: function (dt) {
        return {
            ano: dt.getFullYear(),
            mes: dt.getMonth() + 1,
            dia: dt.getDate(),
            hora: dt.getHours(),
            minuto: dt.getMinutes(),
            segundo: dt.getSeconds()
        };
    },
    getValuesFromMetadata: function () {
        var thisController = this;
        var pais = cicGetCallPaisId();

        if (!pais) {
            //Condicion que valida en caso que Metadata no este cargada
            setTimeout(function () { thisController.getValuesFromMetadata(); }, thisController.waitForGetMetadata);
            cicTrace("No se ha encontrado metadata 'pais'. Se reintentará en " + thisController.waitForGetMetadata/1000 + " segundos");
        }

        cicTrace("Se inicia carga de Metadata en 'metaDataObject'.");

        var metadata = new Object();

        metadata.callPaisId = cicGetCallPaisId();
        metadata.callCallcenterId = cicGetCallCallCenterId();
        metadata.callCanalId = cicGetCallCanalId();
        metadata.callFamiliaId = cicGetCallFamiliaId();
        metadata.callBatchId = cicGetCallBatchId();
        metadata.callSistemaId = cicGetCallSistemaId();
        metadata.callArchivo = cicGetCallArchivo();
        metadata.callRegId = cicGetCallRegId();
        metadata.accId = cicGetAccId();
        metadata.accLineaId = cicGetAccLineaId();
        metadata.accCampanaId = cicGetAccCampanaId();
        metadata.accHorario = cicGetAccHorario();
        metadata.accArg1Id = cicGetAccArg1Id();
        metadata.accArg2Id = cicGetAccArg2Id();
        metadata.accArg3Id = cicGetAccArg3Id();
        metadata.accPreg1 = cicGetAccPreg1();
        metadata.accPreg2 = cicGetAccPreg2();
        metadata.accScore = cicGetAccScore();
        metadata.cliId = cicGetCliId();
        metadata.cliSegmento = cicGetCliSegmento();
        metadata.cliGse = cicGetCliGse();
        metadata.cliAntiguedad = cicGetCliAntiguedad();
        metadata.cliLineaAntiguedad = cicGetCliLineaAntiguedad();
        metadata.cliIndPortado = cicGetCliIndPortado();
        metadata.cliUltBoletaMonto = cicGetCliUltBoletaMonto();
        metadata.prodVigDesc = cicGetProdVigDesc();
        metadata.prodVigPrecio = cicGetProdVigPrecio();
        metadata.prodVigFinPromo = cicGetProdVigFinPromo();
        metadata.oferP1Desc = cicGetOferP1Desc();

        metadata.ventaProdCod = cicGetVentaProdCod();
        metadata.ventaSistemaId = cicGetVentaSistemaId();
        metadata.ventaOossCod = cicGetVentaOossCod();
        metadata.generico01 = cicGetGenerico01();
        metadata.generico02 = cicGetGenerico02();
        metadata.generico03 = cicGetGenerico03();
        metadata.generico04 = cicGetGenerico04();
        metadata.generico05 = cicGetGenerico05();
        metadata.generico06 = cicGetGenerico06();
        metadata.generico07 = cicGetGenerico07();
        metadata.generico08 = cicGetGenerico08();
        metadata.generico09 = cicGetGenerico09();
        metadata.generico10 = cicGetGenerico10();
        metadata.generico11 = cicGetGenerico11();
        metadata.generico12 = cicGetGenerico12();
        metadata.generico13 = cicGetGenerico13();
        metadata.generico14 = cicGetGenerico14();
        metadata.generico15 = cicGetGenerico15();
        metadata.generico16 = cicGetGenerico16();
        metadata.generico17 = (app.isInboundCall ? attGetDNIS() : cicGetGenerico17());
        metadata.generico18 = cicGetGenerico18();
        metadata.generico19 = cicGetGenerico19();

        metadata.rutCliente = cicGetCliRutConDV();

        metadata.i3Identity = cicGetI3Identity();
        metadata.zone = cicGetZone();
        metadata.attempts = cicGetAttemps();
        metadata.status = cicGetStatus();
        metadata.i3Siteid = cicGetI3SiteId();
        metadata.i3Activecampaignid = cicGetI3ActiveCampaignId();
        metadata.i3Attemptsremotehangup = cicGetI3AttemptsRemoteHangUp();
        metadata.i3Attemptssystemhangup = cicGetI3AttemptsSystemHangUp();
        metadata.i3Attemptsabandoned = cicGetI3AttemptsAbandoned();
        metadata.i3Attemptsbusy = cicGetI3AttemptsBusy();
        metadata.i3Attemptsfax = cicGetI3AttempsFax();
        metadata.i3Attemptsnoanswer = cicGetI3AttempsNoAnswer();
        metadata.i3Attemptsmachine = cicGetI3AttempsMachine();
        metadata.i3Attemptsrescheduled = cicGetI3AttemptsRescheduled();
        metadata.i3Attemptssitcallable = cicGetI3AttemptsSitCallable();
        metadata.i3Attemptsdaily = cicGetI3AttemptsDaily();
        metadata.i3LastcalledUtc = cicGetI3LastCalledUtc();
        metadata.successresult = cicGetSuccessResult();
        metadata.i3UploadId = cicGetI3UploadId();
        metadata.i3Rowid = cicGetI3RowId();
        metadata.dncRegId = cicGetDncRegId();
        metadata.phoneNumber = cicGetAccLineaId();;
			
        //04302018 Ivan Rocha  se cambia durante patch 30 , esta linea para tomar el valor desde el attributo de la contact y no del contecto de scripter, linea antigua:   metadata.phoneNumber = cicGetNumberToDial();
	    //metadata.phoneNumber= cicGetAccLineaId();
        metadata.toExclude = cicGetToExclude();
        metadata.expiration = cicGetExpiration();
        metadata.fbackLinea = cicGetAccLineaId();;
        metadata.cuartil = cicGetCuartil();
        metadata.i3Campaignname = cicGetCampaignName();

        metadata.sxbReferido = cicGetSbxReferido();
        metadata.sxbConvergencia = cicGetSbxConvergencia();
        metadata.sxbGenerico1 = cicGetSbxGenerico1();
        metadata.observaciones = cicGetSbxObservaciones();

        metadata.attTipoServicio = attGetTipoServicio();
        metadata.attDNIS = attGetDNIS();
		metadata.attCampaingId = scripter.callObject.getAttribute("ATTR_CAMPAIGNID");

        thisController.metaDataObject = metadata;

        cicTrace("Se finaliza carga de Metadata en 'metaDataObject'.");

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
    },
    addNewRegisterToContact:function(){
        var thisController = this;

        var infoMetaObject = thisController.metaDataObject;

        var infoCliente = thisController.callController.clienteController.getCliente();

        var infoReg = new Object();
        infoReg.table = infoMetaObject.sxbGenerico1;
        infoReg.callRegId = "-1";
        infoReg.callPaisId = infoMetaObject.callPaisId;
        infoReg.callCallcenterId = infoMetaObject.callCallcenterId;
        infoReg.callCanalId = infoMetaObject.callCanalId;
        infoReg.callFamiliaId = infoMetaObject.callFamiliaId;
        infoReg.callFecGestIni = "";
        infoReg.callFecGestFin = "";
        infoReg.callBatchId = infoMetaObject.callBatchId;
        infoReg.callSistemaId = "ININ";
        infoReg.callArchivo = "Llamada Manual";
        infoReg.accId = cicGetAccId();
        infoReg.accLineaId = infoMetaObject.phoneNumber;
        infoReg.accCampanaId = infoMetaObject.accCampanaId;
        infoReg.accHorario = infoMetaObject.accHorario;
        infoReg.accArg1Id = infoMetaObject.accArg1Id;
        infoReg.accArg2Id = infoMetaObject.accArg2Id;
        infoReg.accArg3Id = infoMetaObject.accArg3Id;
        infoReg.accPreg1 = infoMetaObject.accPreg1;
        infoReg.accResp1 = "";
        infoReg.accPreg2 = infoMetaObject.accPreg2;
        infoReg.accResp2 = "";
        infoReg.accScore = "";
        infoReg.cliId = "";
        infoReg.cliRutConDv = infoCliente.rutCli;
        infoReg.cliNombre = infoCliente.nombreCli;
        infoReg.cliSegmento = "";
        infoReg.cliGse = "";
        infoReg.cliAntiguedad = "";
        infoReg.cliLineaAntiguedad = "";
        infoReg.cliCicloCod = "";
        infoReg.cliIndPortado = "";
        infoReg.cliUltBoletaMonto = "";
        infoReg.cliContacAlter = infoCliente.fono1Cli;
        infoReg.cliContacAlterFijo = infoCliente.fono2Cli;
        infoReg.cliContacAlterMovil = infoCliente.fono3Cli;
        infoReg.prodVigDesc = "";
        infoReg.prodVigPrecio = "";
        infoReg.prodVigFinPromo = "";
        infoReg.dirCalle = infoCliente.calleCli;
        infoReg.dirNro = infoCliente.numeroCli;
        infoReg.dirPiso = infoCliente.pisoCli;
        infoReg.dirDepto = infoCliente.deptoCli;
        infoReg.dirComuna = infoCliente.comunaCli;
        infoReg.dirCiudad = "";
        infoReg.dirRegion = infoCliente.regionCli;
        infoReg.oferP1Cod = "";
        infoReg.oferP1Desc = "";
        infoReg.oferP1Precio = "";
        infoReg.oferP1Delta = "";
        infoReg.oferP2Cod = "";
        infoReg.oferP2Desc = "";
        infoReg.oferP2Precio = "";
        infoReg.oferP2Delta = "";
        infoReg.oferP3Cod = "";
        infoReg.oferP3Desc = "";
        infoReg.oferP3Precio = "";
        infoReg.oferP3Delta = "";
        infoReg.oferP4Cod = "";
        infoReg.oferP4Desc = "";
        infoReg.oferP4Precio = "";
        infoReg.oferP4Delta = "";
        infoReg.oferP5Cod = "";
        infoReg.oferP5Desc = "";
        infoReg.oferP5Precio = "";
        infoReg.oferP5Delta = "";
        infoReg.ventaProdCod = "";
        infoReg.ventaSistemaId = "";
        infoReg.ventaOossCod = "";
        infoReg.generico01 = "";
        infoReg.generico02 = "";
        infoReg.generico03 = "";
        infoReg.generico04 = "";
        infoReg.generico05 = "";
        infoReg.generico06 = "";
        infoReg.generico07 = "";
        infoReg.generico08 = "";
        infoReg.generico09 = "";
        infoReg.generico10 = "";
        infoReg.generico11 = "";
        infoReg.generico12 = "";
        infoReg.generico13 = "";
        infoReg.generico14 = "";
        infoReg.generico15 = cicGetSystemAgentId();
        infoReg.generico16 = "";
        infoReg.generico17 = infoMetaObject.attDNIS;
        infoReg.generico18 = "";
        infoReg.generico19 = "";
        infoReg.cuartil = "REFERIDO";
        infoReg.sxbObservaciones = thisController.botoneraController.getObservaciones();
        infoReg.sxbConvergencia = "";
        infoReg.sxbGenerico1 = infoMetaObject.sxbGenerico1;
        infoReg.sxbGenerico2 = "";
        infoReg.sxbGenerico3 = "";
        infoReg.sxbReferido = "";
        infoReg.campaignName = infoMetaObject.i3Campaignname;
        infoReg.agent = cicGetSystemAgentId();

        httpInvoke("addRegisterToContact.ges", { param: infoReg }, function (resp) {
            var status = resp.status;
            if (status == 0) {
                var i3Identity = resp.i3Identity;
                cicTrace("Insertar Registro Inbound para Rellamada Manual exitoso. I3Identity" + i3Identity);
                thisController.botoneraController.callBackAddNewRegisterToContact(true, i3Identity);
            } else {
                cicTrace("Error al insertar Registro Inbound para Rellamada Manual:" + resp.message);
                thisController.botoneraController.callBackAddNewRegisterToContact(false);
            }
        }, function (msg) {
            cicTrace("Error No controlado al insertar Registro Inbound para Rellamada Manual:" + msg);
            thisController.botoneraController.callBackAddNewRegisterToContact(false);
        });

    },
    addNewRegisterToContactRB: function () {
        var thisController = this;

        var infoMetaObject = thisController.metaDataObject;

        var infoCliente = thisController.callController.clienteController.getCliente();

        var infoReg = new Object();
        infoReg.table = infoMetaObject.sxbGenerico1;
        infoReg.callRegId = "-1";
        infoReg.callPaisId = infoMetaObject.callPaisId;
        infoReg.callCallcenterId = infoMetaObject.callCallcenterId;
        infoReg.callCanalId = infoMetaObject.callCanalId;
        infoReg.callFamiliaId = infoMetaObject.callFamiliaId;
        infoReg.callFecGestIni = "";
        infoReg.callFecGestFin = "";
        infoReg.callBatchId = infoMetaObject.callBatchId;
        infoReg.callSistemaId = "ININ";
        infoReg.callArchivo = "Inbound Binding";
        infoReg.accId = cicGetAccId();
        infoReg.accLineaId = infoMetaObject.phoneNumber;
        infoReg.accCampanaId = infoMetaObject.accCampanaId;
        infoReg.accHorario = infoMetaObject.accHorario;
        infoReg.accArg1Id = infoMetaObject.accArg1Id;
        infoReg.accArg2Id = infoMetaObject.accArg2Id;
        infoReg.accArg3Id = infoMetaObject.accArg3Id;
        infoReg.accPreg1 = infoMetaObject.accPreg1;
        infoReg.accResp1 = "";
        infoReg.accPreg2 = infoMetaObject.accPreg2;
        infoReg.accResp2 = "";
        infoReg.accScore = "";
        infoReg.cliId = "";
        infoReg.cliRutConDv = infoCliente.rutCli;
        infoReg.cliNombre = infoCliente.nombreCli;
        infoReg.cliSegmento = "";
        infoReg.cliGse = "";
        infoReg.cliAntiguedad = "";
        infoReg.cliLineaAntiguedad = "";
        infoReg.cliCicloCod = "";
        infoReg.cliIndPortado = "";
        infoReg.cliUltBoletaMonto = "";
        infoReg.cliContacAlter = infoCliente.fono1Cli;
        infoReg.cliContacAlterFijo = infoCliente.fono2Cli;
        infoReg.cliContacAlterMovil = infoCliente.fono3Cli;
        infoReg.prodVigDesc = "";
        infoReg.prodVigPrecio = "";
        infoReg.prodVigFinPromo = "";
        infoReg.dirCalle = infoCliente.calleCli;
        infoReg.dirNro = infoCliente.numeroCli;
        infoReg.dirPiso = infoCliente.pisoCli;
        infoReg.dirDepto = infoCliente.deptoCli;
        infoReg.dirComuna = infoCliente.comunaCli;
        infoReg.dirCiudad = "";
        infoReg.dirRegion = infoCliente.regionCli;
        infoReg.oferP1Cod = "";
        infoReg.oferP1Desc = "";
        infoReg.oferP1Precio = "";
        infoReg.oferP1Delta = "";
        infoReg.oferP2Cod = "";
        infoReg.oferP2Desc = "";
        infoReg.oferP2Precio = "";
        infoReg.oferP2Delta = "";
        infoReg.oferP3Cod = "";
        infoReg.oferP3Desc = "";
        infoReg.oferP3Precio = "";
        infoReg.oferP3Delta = "";
        infoReg.oferP4Cod = "";
        infoReg.oferP4Desc = "";
        infoReg.oferP4Precio = "";
        infoReg.oferP4Delta = "";
        infoReg.oferP5Cod = "";
        infoReg.oferP5Desc = "";
        infoReg.oferP5Precio = "";
        infoReg.oferP5Delta = "";
        infoReg.ventaProdCod = "";
        infoReg.ventaSistemaId = "";
        infoReg.ventaOossCod = "";
        infoReg.generico01 = "";
        infoReg.generico02 = "";
        infoReg.generico03 = "";
        infoReg.generico04 = "";
        infoReg.generico05 = "";
        infoReg.generico06 = "";
        infoReg.generico07 = "";
        infoReg.generico08 = "";
        infoReg.generico09 = "";
        infoReg.generico10 = "";
        infoReg.generico11 = "";
        infoReg.generico12 = "";
        infoReg.generico13 = "";
        infoReg.generico14 = "";
        infoReg.generico15 = cicGetSystemAgentId();
        infoReg.generico16 = "";
        infoReg.generico17 = infoMetaObject.attDNIS;
        infoReg.generico18 = "";
        infoReg.generico19 = "";
        infoReg.cuartil = "REFERIDO";
        infoReg.sxbObservaciones = thisController.botoneraController.getObservaciones();
        infoReg.sxbConvergencia = "";
        infoReg.sxbGenerico1 = infoMetaObject.sxbGenerico1;
        infoReg.sxbGenerico2 = "";
        infoReg.sxbGenerico3 = "";
        infoReg.sxbReferido = "";
        infoReg.campaignName = infoMetaObject.i3Campaignname;
        infoReg.agent = cicGetSystemAgentId();

        httpInvoke("addRegisterToContact.ges", { param: infoReg }, function (resp) {
            var status = resp.status;
            if (status == 0) {
                var i3Identity = resp.i3Identity;
                app.makeRecordBinding = true;
                cicTrace("Insertar Registro Inbound para Record Binding exitoso.");
                cicTrace("Before Setting Dialer Attributes Dialer_CampaignId and Dialer_Identity Inbound Call");
                cicTrace("Seting CampaignId: " + infoMetaObject.attCampaingId + " - i3Identity: " + i3Identity);                
                thisController.botoneraController.globalCallObject.setAttribute('Dialer_CampaignId', infoMetaObject.attCampaingId);
                thisController.botoneraController.globalCallObject.setAttribute('Dialer_Identity', i3Identity);
				thisController.botoneraController.globalCallObject.setAttribute('Dialer_NumberToDial', cicGetNumberToDial());
				
                cicTrace("After Setting Dialer Attributes Dialer_CampaignId and Dialer_Identity");
            } else {
                cicTrace("Error al insertar Registro Inbound para Record Binding:" + resp.message);                
            }
        }, function (msg) {
            cicTrace("Error No controlado al insertar Registro Inbound para Record Binding:" + msg);            
        });

    }

};