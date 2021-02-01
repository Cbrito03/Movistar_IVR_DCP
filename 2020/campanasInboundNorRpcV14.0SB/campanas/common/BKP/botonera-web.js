var controller = {
    $this: null,
	 headerController: null,
    hayDebugger: false,
	deshabilitarrediscado: null,
    panelLlamada: null,
    panelEstado: null,
    panelObservaciones: null,
    timerH: 0,
    timerM: 0,
    timerS: 0,
    onBackEndBreak: null,
    onRefrescaHeader: null,
    requestBreak: false,
    ultimoEstadoBreakRequest: "-1",
    globalCallObject: null,
    globalTransferenceObject: null,
    ultimoRediscadoCallObject: null,
    onGetRutCliente: null,
    wrapUpCodesArray: new Array(),
	loadAllWrapCodes: false,
	callIdOriginal: -1,
	callIdKeyOriginal: -1,
	timerPlaceCall: null,
	activeTimerCall: false,
	timeOutPlaceCall: 10000,
    onCampaingMode: null,
    hasMuted: false,
    firstDisconnect: true,
    onAutomaticFinish: null,
    codFinalizacionAutomatico: null,
    descFinalizacionAutomatico: null,
    codFinalizacionDesconexion: null,
    descFinalizacionDesconexion: null,
    lastStatusAgent: "",
    isTransferExecute: false,
    onGoToBreak: null,
    onGetMetaDataObject: null,
    onRefrescaBreak: null,
    maxDiasAgenda: 5,
    maxDiasAgendaNormal: 30,
    maxIntentosDiscadorASB: -1,
    maxIntentosManualASB: -1,
    maxIntentosDiscadorIN: -1,
    maxIntentosManualIN: -1,
    maxIntentosDiscadorOUT: -1,
    maxIntentosManualOUT: -1,
    contadorManual: 0,
    cierreAutomaticoLlamada: 0,
    msgCierreAutomaticoLlamada: 0,
    cierreLlamadaTimeOut: null,
    msgCierreLlamadaTimeOut: null,
    onFinishingCall: null,
    codFinalizacionLlamadaCaida: null,
    descFinalizacionLlamadaCaida: null,
    onAddNewRegisterToContact: null,
    globalConferenceObject: null,
    conferenceDestinyCallObjectAttempt: null,
    conferenceDestinyCallObject: null,
    conferenceDestinyConnected: false,
    CallIDdeConferenciaMUTE: null,
    IVRConfirmation: null, //null, "PROCESSING", "SUCCESS", "ERROR", "ERROR_IVR_DISCONNECT", "INTERRUMPED",  "ERROR_IVR_CALL"
    IVRCallObject: null,
    IVRConfirmationCount: 0,
    IVRMaximoEjecucionesConfirmation: 3,
    IVRDNISAudioAgente: null,
    AgentCallObjectInConfirmation: null,
    agentDisconnectConfirmation: false,
    audioAgenteConnected: false,
    audioAgenteCallObject: null,
    hasFirstCreateInConference: false,
    init: function (container, options) {
        this.$this = $(container.children()[0]);
        var thisController = this;
        thisController.activeTimerCall = false;
        this.$this.find("#panelEstado").zLayout().parent().css("padding", 6);
        this.$this.find("#panelLlamada").zLayout().parent().css("padding", 6);
        this.$this.find("#panelObservaciones").zLayout().parent().css("padding", 6);        

        if (window.cicDBGGetEventsWithListeners && cicDBGGetEventsWithListeners().length > 0) {
            this.hayDebugger = true;
            this.$this.find("#panelDebugger").zLayout().parent().css("padding", 6);
            var html = "";
            $.each(cicDBGGetEventsWithListeners(), function (i, e) {
                html += "<option value='" + e.eventName + "'>" + e.eventDesc + "</option>";
            });
            this.$this.find("#edNombreEvento").html(html);
            this.$this.find("#cmdDispararEvento").click(function () {
                var nombreEvento = thisController.$this.find("#edNombreEvento").val();
                cicDBGTriggerEvent(nombreEvento);
            });

        } else {
            this.$this.find("#botonera").find("#tituloDebugger").remove();
            this.$this.find("#botonera").find("#panelDebuggerContainer").remove();
        }

        var botonera = this.$this.find("#botonera").accordion({
            heightStyle: "fill",
            activate: function (event, ui) { thisController.muestraPanel(ui.newPanel); thisController.layoutPaneles(); },
            create: function () { thisController.layoutPaneles(); },
            beforeActivate: function (event, ui) { thisController.escondePanel(ui.oldPanel); thisController.escondePanel(ui.newPanel);  }
        });

        botonera.data("on-layout-resize", function () {
            botonera.accordion("resize");
            thisController.layoutPaneles();
        });

        thisController.$this.find("#cmdSolicitarDescanso").click(function () {
            var estadoBreak = thisController.$this.find("#edEstadoBreak").val();
			
			thisController.$this.find("#cmdRediscar").attr("disabled", "disabled");
									thisController.$this.find("#cmdRediscar").attr("src", "img/icons/redialoff.png");
									clearTimeout(thisController.deshabilitarrediscado);
								    thisController.deshabilitarrediscado = null;
									
            if (estadoBreak == "Seleccione") {
                showMsgBoxAlert("Debe seleccionar un estado de Break", "Solicitar Break");
                return;
            }
            showMsgBoxInfo("Usted solicitó ir a " + thisController.$this.find("#edEstadoBreak option:selected").text(), "Confirmación Break");

            if (campana.estado == "break") {
                if (app.lastCallType == "inbound") {
                    thisController.ultimoEstadoBreakRequest = estadoBreak;
                    thisController.requestBreak = true;
                    thisController.onGoToBreak();
                } else {
                    thisController.ultimoEstadoBreakRequest = estadoBreak;
                    thisController.requestBreak = true;
                    thisController.onGoToBreak();
                }
            } else if (campana.estado == "waiting") {
                if (app.lastCallType == "inbound") {
                    thisController.ultimoEstadoBreakRequest = estadoBreak;
                    thisController.requestBreak = true;
                    thisController.onGoToBreak();
                } else {
                    thisController.ultimoEstadoBreakRequest = estadoBreak;
                    thisController.requestBreak = true;
                    cicRequestBreak();
                }
            } else if (campana.estado == "call" || campana.estado == "preview") {
                if (app.isInboundCall) {
                    thisController.ultimoEstadoBreakRequest = estadoBreak;
                    thisController.requestBreak = true;
                    cicTrace("[Inbound]Agente Pide Break Id: " + thisController.ultimoEstadoBreakRequest);
                } else {
                    thisController.ultimoEstadoBreakRequest = estadoBreak;
                    thisController.requestBreak = true;
                    cicRequestBreak();
                    cicTrace("[Preview/Predictive]Agente Pide Break Id: " + thisController.ultimoEstadoBreakRequest);
                }
            }
        });
        
        
        thisController.$this.find("#cmdTerminarDescanso").click(function () {
            if (campana.estado != "break") return;
            if (app.lastCallType == "inbound") thisController.requestBreak = false;
            else cicEndBreak();
            thisController.onBackEndBreak();
        });

        thisController.$this.find("#cmdCancelarLlamada").click(function () {

            if (campana.estado != "call") return;

            if (thisController.isTransferExecute) return;      
            
            if (thisController.globalConferenceObject != null) {
                try {
                    var members = thisController.globalConferenceObject.startMemberIdsEnum;
                } catch (e) {
                    var members = null;
                }
                if (members != null) {
                    while (members.hasMoreElements()) {
                        var memberId = members.nextElement();
                        thisController.globalConferenceObject.disconnectParty(memberId);
                    }
                }
                thisController.hasFirstCreateInConference = false;
            }

            if (thisController.globalCallObject != null && thisController.globalCallObject.state != "106")
                thisController.globalCallObject.disconnect();
            
            thisController.hasMuted = false;
            thisController.$this.find("#cmdMudo").attr("src", "img/icons/muteOff3.png");

        });

        thisController.$this.find("#cmdTransferir").click(function () {
		
            if (campana.estado != "call") return;

            if (thisController.isTransferExecute) return;

            if (thisController.globalCallObject.state == "106") return;

            if (thisController.IVRConfirmation == "PROCESSING") return;

            var numero = thisController.$this.find("#edSpeedDial").val();

            if (numero == -1) {
                showMsgBoxAlert("Debe seleccionar un destino", "Transferencia");
                return;
            }

            var typeTransfer = thisController.$this.find("#edSpeedDial option:selected").attr("data-type");


         if (typeTransfer.toLowerCase() == "ciega"  || typeTransfer.toLowerCase() == "asistida") {
			 
			      /*thisController.llamarDestino(numero);*/
				showMsgBoxInfo("Transferencia establecida exitosamente", "Transferencia");
				thisController.globalCallObject.blindTransfer(numero);
				thisController.isTransferExecute = true;


                thisController.cambiaEstadoLlamada(thisController.globalCallObject.state, thisController.globalCallObject.stateString);
              
			  /* if (response.status) {
                    showMsgBoxInfo("Transferencia establecida exitosamente", "Transferencia");
                } else {
                    if (response.type == "cutCall") { //Llamada Destino se corto antes de establecer transferencia  
                        thisController.volverCliente();
                    } else if (response.type == "cutClient") { //Llamada Cliente se corto antes de establecer transferencia
                        showMsgBoxAlert(response.msg, "Transferencia");
                        thisController.cortarDestino();
                    } else {
                        showMsgBoxAlert(response.msg, "Transferencia");
                    }
                }
                response.type = ""
                response.msg = "";
*/
                
                

                

            } else if (typeTransfer.toLowerCase() == "asistida") { 
                 var isDestinoConnected = (thisController.globalTransferenceObject == null ? false : thisController.globalTransferenceObject.state == "105");

                openDialog("campanas/common/popUpTransferencia", {
                    isDestinoConnected: isDestinoConnected,
                    onLlamarDestino: function () { thisController.llamarDestino(numero); },
                    onCortarDestino: function () { thisController.cortarDestino(); },
                    onVolverCliente: function () { thisController.volverCliente(); },
                    onHacerTransferencia: function () { return thisController.establecerTransferencia(); }
                });
            } else if (typeTransfer.toLowerCase() == "ivr") {

                cicTrace("IVRConfirmation Status: " + (thisController.IVRConfirmation ? thisController.IVRConfirmation : "Primer Intento"));

                if (thisController.IVRConfirmation) {
                    if (thisController.IVRConfirmationCount > thisController.IVRMaximoEjecucionesConfirmation) {
                        showMsgBoxAlert("Se ha superado el maximo de confirmaciones permitidas para una gestion.", "Confirmacion de Venta");
                        return;
                    }
                }

                showMsgBoxConfirm("¿Esta seguro que desea ejecutar la Confirmacion de Venta?", "Confirmacion de Venta", function (result) {
                    if (result == "Si") {

                        cicTrace("Inicia Discado a IVR: " + numero);
                        thisController.llamarDestinoConferencia(numero);
                        var response = thisController.establecerConferencia();
                        cicTrace("Resultado Establecer Conferencia: " + response.status);
                        if (response.status) {

                            thisController.IVRConfirmation = "PROCESSING";
                            $.blockUI({ message: '<h2><img src="img/busy.gif" /> IVR de Confirmacion en curso. <br>Favor espere</h2>', css: { backgroundColor: '#004262', color: '#fff' } });

                            if (thisController.globalConferenceObject != null) {
                                var idLegAgent = null;
                                var idLegIVR = thisController.conferenceDestinyCallObject.id;

                                try {
                                    var members = thisController.globalConferenceObject.startMemberIdsEnum;
                                } catch (e) {
                                    var members = null;
                                }
                                if (members != null) {

                                    var msg = "";
                                    msg += "IVR Id: " + thisController.conferenceDestinyCallObject.id + "\n";
                                    msg += "Cli Id: " + thisController.globalCallObject.id + "\n";
                                    msg += "Ori Id: " + thisController.callIdOriginal + "\n";
                                    msg += "Conf Id: " + thisController.globalConferenceObject.id + "\n";
                                    while (members.hasMoreElements()) {
                                        var memberId = members.nextElement();
                                        msg += "Conference Member: " + memberId + "\n";
                                        if (memberId != thisController.globalCallObject.id && memberId != idLegIVR) {
                                            idLegAgent = memberId;
                                        }
                                    }
                                    cicTrace("Ids Conference: " + msg);

                                    cicTrace("CallId for IVR Disconnect: " + idLegIVR);
                                    cicTrace("Call Id Agente en Hold: " + idLegAgent);
                                    cicHold(idLegAgent);
                                    cicMute(idLegAgent);
                                    thisController.CallIDdeConferenciaMUTE = idLegAgent;

                                }


                                thisController.IVRCallObject = scripter.createCallObject();

                                thisController.IVRCallObject.id = idLegIVR;

                                thisController.IVRCallObject.stateChangeHandler = function (StateID, StateString) {
                                    var isConnected = false;
                                    if (StateID == "106" && thisController.IVRConfirmation == "PROCESSING") {
                                        cicTrace("StateString IVR Disconnect: " + StateString);
                                        if (StateString == "Desconectado [DesconexiÃ³n remota]" || StateString == "Disconnected [Remote Disconnect]") {
                                            thisController.finalizadaLlamadaIVRConfirmacion("IVR_DISCONNECT");
                                        } else {
                                            thisController.finalizadaLlamadaIVRConfirmacion("IVR_DISCONNECT_ERROR");
                                        }
                                    }
                                }

                                if (idLegAgent) {
                                    thisController.AgentCallObjectInConfirmation = scripter.createCallObject();

                                    thisController.AgentCallObjectInConfirmation.id = idLegAgent;

                                    thisController.AgentCallObjectInConfirmation.stateChangeHandler = function (StateID, StateString) {
                                        if (StateID == "106" && thisController.IVRConfirmation == "PROCESSING") {
                                            cicTrace("StateString Agent Disconnect: " + StateString);
                                            thisController.agentDisconnectConfirmation = true;
                                        }
                                    }
                                }

                                thisController.llamarDNISAudioAgente(thisController.IVRDNISAudioAgente);

                            }
                        } else {
                            if (response.type == "backOffice") { //Llamada BO se corto antes de establecer conferencia
                                showMsgBoxAlert(response.msg, "ConfirmaciÃ³n de Venta");
                            } else if (response.type == "conference") { //No se pudo establacer conferencia
                                showMsgBoxAlert(response.msg, "ConfirmaciÃ³n de Venta");
                            } else if (response.type == "backOfficeInConference") { //Llamada IVR esta cortada al agregar a conferencia
                                thisController.IVRConfirmation = "ERROR_IVR_CALL";
                                showMsgBoxAlert(response.msg, "ConfirmaciÃ³n de Venta");
                            } else if (response.type == "clientInConference") { //Llamada CLiente esta cortada al agregar a conferencia
                                showMsgBoxAlert(response.msg, "ConfirmaciÃ³n de Venta");
                                thisController.cancelarLLamadasDesdeConferencia();
                            }
                        }


                    }
                });

            } else {
                showMsgBoxError("Tipo de Transferencia no es valida. Favor informar a Administrador de Sistemas", "Transferencia");
            }
            
        });

        thisController.$this.find("#cmdEspera").click(function () {
            if (campana.estado != "call") return;

            if (thisController.isTransferExecute) return;

            if (thisController.globalCallObject.state == "106") return;

            if (thisController.globalCallObject.isHeld) {
                thisController.globalCallObject.pickup();
                thisController.$this.find("#cmdEspera").attr("src", "img/icons/hold.png");
                cicTrace("Salir de Espera");
            }
            else {
                
                thisController.globalCallObject.hold();
                thisController.$this.find("#cmdEspera").attr("src", "img/icons/holdOff.png");
                cicTrace("Entrar a Espera");
            }
        });

        thisController.$this.find("#cmdMudo").click(function () {
            if (campana.estado != "call") return;
            if (thisController.globalCallObject.state == "106") return;
            
            if (thisController.isTransferExecute) return;

            var callId = thisController.globalCallObject.id;
            
            if (thisController.globalConferenceObject != null) {

                try {
                    var members = thisController.globalConferenceObject.startMemberIdsEnum;
                } catch (e) {
                    var members = null;
                }

                if (members != null) {
                    if (members.hasMoreElements()) {
                        callId = thisController.CallIDdeConferenciaMUTE;
                    }
                }

            }

            cicMute(callId);

            thisController.hasMuted = !thisController.hasMuted;

            if (!thisController.hasMuted) {
                cicTrace("Set No Mudo");
                thisController.$this.find("#cmdMudo").attr("src", "img/icons/muteOff3.png");

            }
            else {
                cicTrace("Set Mudo");
                thisController.$this.find("#cmdMudo").attr("src", "img/icons/mute3.png");
            } 
        });

        thisController.$this.find("#cmdRediscar").click(function () {
         //if (thisController.isTransferExecute) return;

            if (thisController.IVRConfirmation == "PROCESSING") return;

            thisController.activeTimerCall = false;

            if (campana.estado == "preview"    ) {
                thisController.$this.find("#cmdRediscar").attr("src", "img/icons/redial.png");
                clearTimeout(thisController.timerPlaceCall);
            }
            if (campana.estado != "call" && campana.estado != "preview") return;

            if (campana.estado == "call") {
                cicTrace("Call Status: " + thisController.globalCallObject.state);
                if (thisController.globalCallObject.state == "106") { //Disconnected

                    var maxIntentosManual = thisController.getMaximoIntentos("manual");

                    if (maxIntentosManual > 0 && thisController.contadorManual >= maxIntentosManual) {
                        showMsgBoxAlert("Excedió el límite de discado manual", "Discado Manual");
                        return;
                    }
                    thisController.contadorManual++;

                    //thisController.hacerRediscado();

                    thisController.finalizarPorLLamadaCaida();

                } else {
                    cicTrace("Agente '" + cicGetSystemAgentId() + "' redisca llamada conectada", "1");
                    showMsgBoxAlert("Favor no rediscar mientras se encuentre llamada en curso", "Discado Manual");
                }
            } else {
                cicTrace("Place Preview Call");
                cicPlacePreviewCall();
            }

            thisController.hasMuted = false;
            thisController.$this.find("#cmdMudo").attr("src", "img/icons/muteOff3.png");
            
        });
        
        thisController.$this.find("#edEstadoFinalizacion").change(function () {
            var selected = $(this).find('option:selected');
            thisController.refreshSubCodigoFinalizacion(selected.val());
        });
        
        
        thisController.startCheckStatus();
        thisController.initializeTimer();

        var edFechaAgendar = thisController.$this.find("#edFechaAgendar").datepicker();
        edFechaAgendar.css("top", "2px");
        edFechaAgendar.next(".ui-datepicker-trigger").css("vertical-align", "middle").css("cursor", "pointer");
        var now = new Date();
        edFechaAgendar.datepicker("option", "minDate", now);
        var maximo = new Date();
        maximo.setDate(now.getDate() + thisController.maxDiasAgendaNormal);
        edFechaAgendar.datepicker("option", "maxDate", maximo);
        edFechaAgendar.datepicker("setDate", now);

    },
    layoutPaneles: function () {
        var thisController = this;
        
        var panelEstado = this.$this.find("#panelEstado");
        panelEstado.css("position", "absolute");
        panelEstado.width(panelEstado.parent().width());
        panelEstado.height(panelEstado.parent().height());
        panelEstado.zLayout("doLayout");
        thisController.panelEstado = panelEstado;
        var panelLlamada = this.$this.find("#panelLlamada");
        panelLlamada.css("position", "absolute");
        panelLlamada.width(panelLlamada.parent().width());
        panelLlamada.height(panelLlamada.parent().height());
        panelLlamada.zLayout("doLayout");
        thisController.panelLlamada = panelLlamada;
        var panelObservaciones = this.$this.find("#panelObservaciones");
        panelObservaciones.css("position", "absolute");
        panelObservaciones.width(panelObservaciones.parent().width());
        panelObservaciones.height(panelObservaciones.parent().height());
        panelObservaciones.zLayout("doLayout");
        thisController.panelObservaciones = panelObservaciones;
        if (this.hayDebugger) {
            var panelDebugger = this.$this.find("#panelDebugger");
            panelDebugger.css("position", "absolute");
            panelDebugger.width(panelDebugger.parent().width());
            panelDebugger.height(panelDebugger.parent().height());
            panelDebugger.zLayout("doLayout");
        }
    },
    escondePanel: function (p) {
        var c = p.children()[0];
        $(c).hide();
    },
    muestraPanel: function (p) {
        var c = p.children()[0];
        $(c).show();
    }, 
    startCheckStatus: function () {
        var thisController = this;
        setInterval(function () {
            thisController.agentStatus()
        }, 1000);
    },
  agentStatus: function () {
        var thisController = this;
        var estadoAgente = cicGetSystemClientStatus();
        this.$this.find("#lblEstadoAgente").text(estadoAgente);
        if (thisController.lastStatusAgent != estadoAgente) cicTrace("Nuevo Estado Agente: " + estadoAgente);
        //if (app.isInboundCall) {
            if (campana.estado == "call") {
                if (thisController.lastStatusAgent.toUpperCase() == "CAMPAIGN CALL" || thisController.lastStatusAgent.toUpperCase() == "LLAMADA DE CAMPAÑA") {
                    if (estadoAgente.toUpperCase() == "FOLLOW UP" || estadoAgente.toUpperCase() == "SEGUIMIENTO") {
                       if (thisController.onFinishingCall()) {
                            cicTrace("No se inician Timers de cierre automatico de llamada ya que gestión esta en proceso de finalización");
                        } else {
                            cicTrace("Se inician Timers para cierre automatico de llamada: " + thisController.cierreAutomaticoLlamada + " minutos");
                            var delta = thisController.cierreAutomaticoLlamada - thisController.msgCierreAutomaticoLlamada;
							

							thisController.deshabilitarrediscado = setTimeout(function () {
                                 
									thisController.$this.find("#cmdRediscar").attr("disabled", "disabled");
									thisController.$this.find("#cmdRediscar").attr("src", "img/icons/redialoff.png");
									clearTimeout(thisController.deshabilitarrediscado);
								    thisController.deshabilitarrediscado = null;
									
                                }, 2 * 1000 * 60);
								
                            if (delta > 0) {
                                thisController.msgCierreLlamadaTimeOut = setTimeout(function () {
                                    thisController.alertAutomaticFinish();
                                }, thisController.msgCierreAutomaticoLlamada * 1000 * 60);
                            }
                            thisController.cierreLlamadaTimeOut = setTimeout(function () {
                                thisController.executeAutomaticFinish();
                            }, thisController.cierreAutomaticoLlamada * 1000 * 60);

                        }
                    }
                }
                if (thisController.lastStatusAgent.toUpperCase() == "FOLLOW UP" || thisController.lastStatusAgent.toUpperCase() == "SEGUIMIENTO") {
                    if (estadoAgente.toUpperCase() == "AVAILABLE" || estadoAgente.toUpperCase() == "DISPONIBLE") {
                        cicTrace("Cierre automatico de llamada automatico por cambio de estado de agente");
                        thisController.onAutomaticFinish();
							clearTimeout(thisController.deshabilitarrediscado );
                    } else if (app.hasLastCallExecuteManual && estadoAgente.toUpperCase() == "CAMPAIGN CALL" || estadoAgente.toUpperCase() == "LLAMADA DE CAMPAÑA") {
                        cicTrace("Se anula Timer de Cierre Automatico por Rellamada");
                        clearTimeout(thisController.msgCierreLlamadaTimeOut);
                        clearTimeout(thisController.cierreLlamadaTimeOut);
						clearTimeout(thisController.deshabilitarrediscado );
                    }
                }
                thisController.lastStatusAgent = estadoAgente;
            }
        //}
        if (campana.estado == "break") {
            this.onRefrescaBreak();
        }
    },
    executeAutomaticFinish: function(){
        cicTrace("Se inicia proceso de cierre automatico de llamada");
        this.onAutomaticFinish();
    },
   alertAutomaticFinish: function () {
        cicTrace("Se alerta proceso de cierre automatico de llamada");
        var delta = this.cierreAutomaticoLlamada - this.msgCierreAutomaticoLlamada;
		
		 if(this.globalCallObject  != null) {
        showMsgBoxAlert("                                                En " + delta + " minutos se realizará el cierre automático de la llamada", "¡¡¡¡¡¡¡............... TIPIFIQUE este registro..............!!!!!!!               Cierre Automático CALLID:"+ this.globalCallObject.id   );
   } else if (this.ultimoRediscadoCallObject != null){
	    showMsgBoxAlert("                                                En " + delta + " minutos se realizará el cierre automático de la llamada", "¡¡¡¡¡¡¡............... TIPIFIQUE este registro..............!!!!!!!               Cierre Automático CALLID:"+ this.ultimoRediscadoCallObject.id      );
	   
	   }

   },
    initializeTimer: function () {
        var thisController = this;
        setInterval(function () {
            thisController.timer()
        }
        , 1000);
    },
    initializeRestart: function(){
        this.timerH = 0;
        this.timerM = 0;
        this.timerS = 0;
    },
    timer: function () {
        var thisController = this;

        thisController.timerS++;

        if (thisController.timerS > 59) {
            thisController.timerM++;
            thisController.timerS = 0;
        }

        if (thisController.timerM > 59) {
            thisController.timerH++;
            thisController.timerM = 0;
        }

        var dispMin = thisController.timerM;
        if (thisController.timerM <= 9) {
            dispMin = "0" + thisController.timerM;
        }

        var dispSec = thisController.timerS;
        if (thisController.timerS <= 9) {
            dispSec = "0" + thisController.timerS;
        }

        if (thisController.timerH < 1) {
            // no show hours too
            thisController.$this.find("#lblTiempoEstado").text(dispMin + ":" + dispSec);
        }
        else {
            // show hours too
            var dispHr = thisController.timerH;
            if (thisController.timerH <= 9) {
                dispHr = "0" + thisController.timerH;
            }
            thisController.$this.find("#lblTiempoEstado").text(dispHr + ":" + dispMin + ":" + dispSec);
        }
    },
      refresca: function () {
        var thisController = this;
        
        cicTrace("Botonera Inicio Refresca");
		
		thisController.$this.find("#cmdEspera").removeAttr("src");
		thisController.$this.find("#cmdMudo").removeAttr("src");
		
		thisController.$this.find("#cmdEspera").attr("src", "img/icons/hold.png");
		thisController.$this.find("#cmdMudo").attr("src", "img/icons/muteOff3.png");
		
		
        thisController.$this.find("#lblNombreAgente").text(cicGetSystemAgentId());

        var edFechaAgendar = thisController.$this.find("#edFechaAgendar");
        var now = new Date();
        edFechaAgendar.datepicker("option", "minDate", now);
        edFechaAgendar.datepicker("setDate", now);
        thisController.$this.find("#edAgendarHora").val("--");
        thisController.$this.find("#edAgendarMinutos").val("--");
		
        var speedDial = thisController.$this.find("#edSpeedDial");
        speedDial.val("-1");

        thisController.isTransferExecute = false;
        app.hasLastCallExecuteManual = false;
        thisController.IVRConfirmation = null;

        thisController.initializeRestart();

        if (campana.estado == "initializing") {
            thisController.contadorManual = 0;
            if (!thisController.activeTimerCall) {
                clearTimeout(thisController.timerPlaceCall);
            }
            thisController.$this.find("#botonera").accordion("option", { active: 0 });
            edFechaAgendar.datepicker("disable");
            speedDial.attr("disabled", "disabled");
            thisController.$this.find("#edNumeroLlamada").attr("disabled", "disabled");
            thisController.$this.find("#edAgendarHora").attr("disabled", "disabled");
            thisController.$this.find("#edAgendarMinutos").attr("disabled", "disabled");
            thisController.$this.find("#edEstadoBreak").val("Seleccione");
            thisController.ultimoEstadoBreakRequest = "-1";
            thisController.callIdOriginal = -1;
            thisController.callIdKeyOriginal = -1;
            thisController.$this.find("#edObservaciones").attr("disabled", "disabled");
            thisController.$this.find("#cmdRediscar").attr("src", "img/icons/redial.png");
            enableButton(thisController.$this.find("#cmdRefresh"), false);
            thisController.conferenceDestinyConnected = false;
            thisController.IVRConfirmationCount = 0;
        } else if (campana.estado == "waiting") {           

            thisController.contadorManual = 0;

            if (!thisController.activeTimerCall) {
                clearTimeout(thisController.timerPlaceCall);
            }
            thisController.$this.find("#botonera").accordion("option", { active: 0 });
            edFechaAgendar.datepicker("disable");
            speedDial.attr("disabled", "disabled");
            thisController.$this.find("#edNumeroLlamada").attr("disabled", "disabled");
            thisController.$this.find("#edAgendarHora").attr("disabled", "disabled");
            thisController.$this.find("#edAgendarMinutos").attr("disabled", "disabled");
            if (!thisController.requestBreak) {
                thisController.$this.find("#edEstadoBreak").val("Seleccione");
                thisController.ultimoEstadoBreakRequest = "-1";
            }
            thisController.callIdOriginal = -1;
            thisController.callIdKeyOriginal = -1;
            thisController.$this.find("#edObservaciones").attr("disabled", "disabled");
            thisController.$this.find("#cmdRediscar").attr("src", "img/icons/redial.png");
            thisController.conferenceDestinyConnected = false;
            thisController.IVRConfirmationCount = 0;
        } else if (campana.estado == "break") {
		    thisController.$this.find("#edObservaciones").val("");
            thisController.contadorManual = 0;

            if (!thisController.activeTimerCall) {
                clearTimeout(thisController.timerPlaceCall);
            }
            thisController.$this.find("#botonera").accordion("option", { active: 0 });
            edFechaAgendar.datepicker("disable");
            speedDial.attr("disabled", "disabled");
            thisController.$this.find("#edNumeroLlamada").attr("disabled", "disabled");
            thisController.$this.find("#edAgendarHora").attr("disabled", "disabled");
            thisController.$this.find("#edAgendarMinutos").attr("disabled", "disabled");
            thisController.$this.find("#edObservaciones").attr("disabled", "disabled");
            thisController.callIdOriginal = -1;
            thisController.callIdKeyOriginal = -1;
            thisController.$this.find("#cmdRediscar").attr("src", "img/icons/redial.png");
            thisController.conferenceDestinyConnected = false;
            thisController.IVRConfirmationCount = 0;
        } else if (campana.estado == "call") {
            thisController.lastStatusAgent = "";
            thisController.contadorManual = 0;       
            thisController.hasMuted = false;
            thisController.conferenceDestinyCallObject = null;
            thisController.globalConferenceObject = null;
            thisController.hasFirstCreateInConference = false;
            thisController.hasMuted = false;
            thisController.CallIDdeConferenciaMUTE = null;
            thisController.conferenceDestinyConnected = false;
            thisController.IVRConfirmationCount = 0;
			thisController.firstDisconnect = true;
            thisController.$this.find("#botonera").accordion("option", { active: 2 });
            edFechaAgendar.datepicker("enable");
            speedDial.removeAttr("disabled");
            thisController.$this.find("#edNumeroLlamada").removeAttr("disabled");
            thisController.$this.find("#edAgendarHora").removeAttr("disabled");
            thisController.$this.find("#edAgendarMinutos").removeAttr("disabled");
			enableButton(thisController.$this.find("#cmdRediscar"), true);
            if (!thisController.requestBreak) {
                thisController.$this.find("#edEstadoBreak").val("Seleccione");
                thisController.ultimoEstadoBreakRequest = "-1";
            }

            if (app.isInboundCall)
                thisController.$this.find("#edObservaciones").val("");
            else if (app.lastCallType == "predictive") {

                var obsCtl = cicGetSbxObservaciones();
                var idObs = parseInt(obsCtl);

                if (!isNaN(idObs)) {
                    httpInvoke("getObservacion.ges", { idObs: idObs }, function (resp) {
                        cicTrace("Observacion recuperada Exitosamente Id: " + idObs);
                        thisController.$this.find("#edObservaciones").val(resp.obs);
                    }, function (msg) {
                        cicTrace("Error al recuperar Observacion Id:" + idObs + " - Error: " + msg);
                    });

                } else {
                    cicTrace("Observacion sin nueva modalidad...se despliega Observaciones desde Ctl");
                    thisController.$this.find("#edObservaciones").val(cicGetSbxObservaciones());
                }
            }

            thisController.$this.find("#edObservaciones").removeAttr("disabled");                        
            if (app.isInboundCall) thisController.callIdOriginal = thisController.globalCallObject.id;
            else thisController.callIdOriginal = cicGetCallId();
            thisController.callIdKeyOriginal = attGetCallIdKey();
            thisController.$this.find("#cmdRediscar").attr("src", "img/icons/redial.png");

            cicTrace("cicGetCampaignId(): " + cicGetCampaignId());


        } else if (campana.estado == "preview") {
            thisController.contadorManual = 0;

            thisController.activeTimerCall = true;
            thisController.timerPlaceCall = setTimeout(function () { thisController.timerAutoPlaceCall(); }, thisController.timeOutPlaceCall);
            thisController.$this.find("#botonera").accordion("option", { active: 2 });
            edFechaAgendar.datepicker("enable");
            speedDial.attr("disabled", "disabled");
            thisController.$this.find("#edAgendarHora").removeAttr("disabled");
            thisController.$this.find("#edAgendarMinutos").removeAttr("disabled");
            if (!thisController.requestBreak) {
                thisController.$this.find("#edEstadoBreak").val("Seleccione");
                thisController.ultimoEstadoBreakRequest = "-1";
            }
            thisController.$this.find("#edObservaciones").removeAttr("disabled");
              
            var obsCtl = cicGetSbxObservaciones();

            var idObs = parseInt(obsCtl);

            if (!isNaN(idObs)) {
                httpInvoke("getObservacion.ges", { idObs: idObs }, function (resp) {
                    cicTrace("Observacion recuperada Exitosamente Id: " + idObs);
                    thisController.$this.find("#edObservaciones").val(resp.obs);
                }, function (msg) {
                    cicTrace("Error al recuperar Observacion Id:" + idObs + " - Error: " + msg);
                });

            } else {
                cicTrace("Observacion sin nueva modalidad...se despliega Observaciones desde Ctl");
                thisController.$this.find("#edObservaciones").val(cicGetSbxObservaciones());
            }
            
            thisController.callIdOriginal = cicGetCallId();
            thisController.callIdKeyOriginal = attGetCallIdKey();
            thisController.$this.find("#cmdRediscar").attr("src", "img/icons/redial.gif");

            thisController.conferenceDestinyConnected = false;
            thisController.IVRConfirmationCount = 0;
			
        }


        thisController.refreshEstadoFinalizacion();
        thisController.refreshSubCodigoFinalizacion("Seleccione");

        cicTrace("Botonera Fin Refresca");
    },
	
    setAgentStatus: function (status) {
        var thisController = this;
        var estadoBreak = status;

        if (!status) {
            //estadoBreak = thisController.$this.find("#edEstadoBreak").val();
            estadoBreak = (thisController.ultimoEstadoBreakRequest == "-1" ? thisController.$this.find("#edEstadoBreak").val() : thisController.ultimoEstadoBreakRequest);
        }
        var statusKey = "";
        switch (estadoBreak) {
            case "1":
                statusKey = "Do Not disturb";
                break;
            case "2":
                statusKey = "In Restroom";
                break;
            case "3":
                statusKey = "Administration Task";
                break;
            case "4":
                statusKey = "At Training";
                break;
            case "5":
                statusKey = "Lunch Time";
                break;
            case "6":
                statusKey = "End Of Shift";
                break;
        }

        cicClientStatus(statusKey);

    }, 
    setAtributoGrabacion: function (atributo, valor) {
        var thisController = this;
        try {
            
            thisController.globalCallObject.setAttribute(atributo, valor);

            if (thisController.ultimoRediscadoCallObject != null) thisController.ultimoRediscadoCallObject.setAttribute(atributo, valor);

        }
        catch (err) {
            cicTrace("Error al intentar asignar un atributo (" + atributo + "=" + valor + ") a la grabacion: " + err);
        }
    },
	
	
    hacerRediscado: function (i3Identity) {
		 cicTrace("Inicio rediscado");
        var thisController = this;
clearTimeout(thisController.deshabilitarrediscado);
        thisController.ultimoRediscadoCallObject = scripter.createCallObject();

        var metaDataObject = thisController.onGetMetaDataObject();

        var numero =  (metaDataObject ? metaDataObject.phoneNumber : cicGetAccLineaId());
		
        if (numero.indexOf("sip:") > -1 || numero.indexOf("@") > -1) {
            numero = numero.replace("sip:", "");
            numero = numero.substring(0, numero.indexOf("@"));
        }
cicTrace("Asigno numero de rediscado"+ numero);
		var numeroPrefijo = 'tel:' + cicGetAccLineaId();
		
        thisController.ultimoRediscadoCallObject.dial(numeroPrefijo, false);
        cicTrace("Rediscado a :" + numeroPrefijo);
		
        if (app.isInboundCall) {
            cicTrace("Before Setting Dialer Attributes Dialer_CampaignId and Dialer_Identity Inbound Call");
            cicTrace("Seting CampaignId: " + metaDataObject.attCampaingId + " - i3Identity: " + i3Identity);
            thisController.ultimoRediscadoCallObject.setAttribute('Dialer_CampaignId', metaDataObject.attCampaingId);
            thisController.ultimoRediscadoCallObject.setAttribute('Dialer_Identity', i3Identity);
            cicTrace("After Setting Dialer Attributes Dialer_CampaignId and Dialer_Identity");
        } else {
            cicTrace("Before Setting Dialer Attributes Dialer_CampaignId and Dialer_Identity Outbound Call");
            cicTrace("Seting CampaignId: " + cicGetCampaignId() + " - i3Identity: " + cicGetI3Identity());
            thisController.ultimoRediscadoCallObject.setAttribute('Dialer_CampaignId', cicGetCampaignId());
            thisController.ultimoRediscadoCallObject.setAttribute('Dialer_Identity', cicGetI3Identity());
            cicTrace("After Setting Dialer Attributes Dialer_CampaignId and Dialer_Identity");
        }

        cicTrace("Preview Setting Rediscado");
        cicTrace("CallId Original: " + thisController.callIdOriginal);
        cicTrace("CallIdKey Original: " + thisController.callIdKeyOriginal);
        cicTrace("globalCallObject.id: " + thisController.globalCallObject.id);
        cicTrace("ultimoRediscadoCallObject.id: " + thisController.ultimoRediscadoCallObject.id);              

        thisController.globalCallObject.id = thisController.ultimoRediscadoCallObject.id;

        var rutCliente = (metaDataObject ? metaDataObject.rutCliente : cicGetCliRutConDV());
        var rutClienteCierre = thisController.onGetRutCliente();

        if (rutClienteCierre) {
            rutCliente = rutClienteCierre;
        }

        var esReferido = "N";
        var sxbReferido = (metaDataObject ? metaDataObject.sxbReferido : cicGetSbxReferido());
        if (sxbReferido == "R") {
            esReferido = "S";
        }
        

        var pais = (metaDataObject ? metaDataObject.callPaisId : cicGetCallPaisId());
        var callCenter = (metaDataObject ? metaDataObject.callCallcenterId : cicGetCallCallCenterId());
        var campaingName = (metaDataObject ? metaDataObject.i3Campaignname : cicGetCampaignName());
        var cuartil = (metaDataObject ? metaDataObject.cuartil : cicGetCuartil());

        thisController.ultimoRediscadoCallObject.setAttribute("ATTR_Nombre_OutSourcer", pais + "_" + callCenter);
        thisController.ultimoRediscadoCallObject.setAttribute("ATTR_CALL_ID_ORIGINAL", thisController.callIdKeyOriginal);
        thisController.ultimoRediscadoCallObject.setAttribute("ATTR_CORRELACION", thisController.callIdKeyOriginal);
        thisController.ultimoRediscadoCallObject.setAttribute("ATTR_Nombre_Campana", campaingName);
        thisController.ultimoRediscadoCallObject.setAttribute("ATTR_CUARTIL", cuartil);
        thisController.ultimoRediscadoCallObject.setAttribute("ATTR_Rediscado", "S");
        if (rutCliente) thisController.ultimoRediscadoCallObject.setAttribute("ATTR_RUT_Cliente", rutCliente);
        if (esReferido) thisController.ultimoRediscadoCallObject.setAttribute("ATTR_REFERIDO", esReferido);

        cicTrace("Inter Setting Rediscado");
        cicTrace("CallId Original: " + thisController.callIdOriginal);
        cicTrace("CallIdKey Original: " + thisController.callIdKeyOriginal);
        cicTrace("globalCallObject.id: " + thisController.globalCallObject.id);
        cicTrace("ultimoRediscadoCallObject.id: " + thisController.ultimoRediscadoCallObject.id);

        cicSetCallId(thisController.ultimoRediscadoCallObject.id);//Validar si necesario

        cicTrace("Post Setting Rediscado");
        cicTrace("CallId Original: " + thisController.callIdOriginal);
        cicTrace("CallIdKey Original: " + thisController.callIdKeyOriginal);
        cicTrace("globalCallObject.id: " + thisController.globalCallObject.id);
        cicTrace("ultimoRediscadoCallObject.id: " + thisController.ultimoRediscadoCallObject.id);
   
        cicTrace("Agente '" + cicGetSystemAgentId() + "' ha rediscado a cliente. Nuevo CallId '" + thisController.ultimoRediscadoCallObject.id + "'")
    },
    cambiaEstadoLlamada: function (StateId, StateString) {

        var thisController = this;
        cicTrace("Nuevo estado LLamada: '" + StateId + "' - '" + StateString + "'");

        var isConnected = false;
        if (StateId == "105" || StateId == "6") //Connected o OnHold
            isConnected = true;
        else
            isConnected = false;

        cicTrace("[cambioEstadoLlamada] isConnected : " + isConnected);

        if (isConnected && thisController.isTransferExecute) {
            cicTrace("[cambioEstadoLlamada] Llamada Conectada pero fue Transferida. Se asume estado conexión 'false'");
            isConnected = false;
        }

        if (thisController.firstDisconnect && StateId == "106" || thisController.isTransferExecute) {
			thisController.firstDisconnect = false;
			cicStage("1");
		}
        
        if (campana.estado == "call" && app.isInboundCall && StateId == "106") //Al desconectar una Inbound se setea como Desconexión Llamada
            if (thisController.globalCallObject != null && !thisController.onFinishingCall()) thisController.globalCallObject.setAttribute("ATTR_WRAPUPCODE", thisController.codFinalizacionDesconexion);

        if (StateId == "106" && thisController.IVRConfirmation == "PROCESSING") {
            thisController.finalizadaLlamadaIVRConfirmacion("CLIENT_DISCONNECT");
        }

        thisController.onRefrescaHeader(isConnected);

    },
    errorEnLlamada: function (ErrorId, ErrorText) {
        cicTrace("Error Llamada: '" + ErrorId + "' - '" + ErrorText + "'", "1");
       
    },
    refreshEstadoFinalizacion: function () {
        var thisController = this;
        var estados = new Array();

        var estado = new Object();
        estado.value = "Seleccione";
        estado.descripcion = "Seleccione";
        estados.push(estado);

        var wrapUpCodesForFamilia = new Array();

        if (!thisController.loadAllWrapCodes) return;

        var metaDataObject = thisController.onGetMetaDataObject();
        
        var familia = "WE";
        var familiaId = (metaDataObject ? metaDataObject.callFamiliaId : cicGetCallFamiliaId());

        if (familiaId.indexOf("C2C") > -1) familia = "WE";
        else if (familiaId.indexOf("CMB") > -1) familia = "WE";
        else if (familiaId.indexOf("8") > -1) familia = "WI";
        else {
            familia = "WO"; //OUTBOUND
        }

        var objectWrapUpCodesForFamilia = $.grep(thisController.wrapUpCodesArray, function (wrapUpCodeFamilia) {
            return (wrapUpCodeFamilia.familia == familia);
        });
        if (objectWrapUpCodesForFamilia.length > 0) wrapUpCodesForFamilia = objectWrapUpCodesForFamilia[0].list;

        if (campana.estado == "call") {        
            
            //Valida VENTA - 1
            var result = $.grep(wrapUpCodesForFamilia, function (wrapUpCode) {
                return (wrapUpCode.ESTADO_FINALIZACION == "1");
            })
            if (result.length > 0) {
                var estado = new Object();
                estado.value = "1";
                estado.descripcion = "VENTA";
                estados.push(estado);
            }
            

            //Valida RECHAZO COMERCIA - 2
            var result = $.grep(wrapUpCodesForFamilia, function (wrapUpCode) {
                return (wrapUpCode.ESTADO_FINALIZACION == "2");
            })

            if (result.length > 0) {
                var estado = new Object();
                estado.value = "2";
                estado.descripcion = "RECHAZO COMERCIAL";
                estados.push(estado);
            }

            //Valida FACTIBILIDAD - 3
            var result = $.grep(wrapUpCodesForFamilia, function (wrapUpCode) {
                return (wrapUpCode.ESTADO_FINALIZACION == "3");
            })

            if (result.length > 0) {
                var estado = new Object();
                estado.value = "3";
                estado.descripcion = "FACTIBILIDAD";
                estados.push(estado);
            }

            if (!app.isInboundCall) {
                var esUltimoIntento = false;
                var intentos = cicGetAttemps();
                if (thisController.maxIntentosDiscadorIN > 0 && parseInt(intentos) + 1 >= thisController.maxIntentosDiscadorIN) esUltimoIntento = true;

                if (!esUltimoIntento) {
                    //Valida AGENDAR - 4
                    var result = $.grep(wrapUpCodesForFamilia, function (wrapUpCode) {
                        return (wrapUpCode.ESTADO_FINALIZACION == "4");
                    });

                    if (result.length > 0) {
                        var estado = new Object();
                        estado.value = "4";
                        estado.descripcion = "AGENDAR";
                        estados.push(estado);
                    }
                }
            } else {
                //Valida AGENDAR - 4
                var result = $.grep(wrapUpCodesForFamilia, function (wrapUpCode) {
                    return (wrapUpCode.ESTADO_FINALIZACION == "4");
                });

                if (result.length > 0) {
                    var estado = new Object();
                    estado.value = "4";
                    estado.descripcion = "AGENDAR";
                    estados.push(estado);
                }
            }

            //Valida CONSULTA POST VENTA - 5
            var result = $.grep(wrapUpCodesForFamilia, function (wrapUpCode) {
                return (wrapUpCode.ESTADO_FINALIZACION == "5");
            })
            
            if (result.length > 0) {
                var estado = new Object();
                estado.value = "5";
                estado.descripcion = "CONSULTA POST VENTA";
                estados.push(estado);
            }

            //Valida CONSULTA OFERTA - 6
            var result = $.grep(wrapUpCodesForFamilia, function (wrapUpCode) {
                return (wrapUpCode.ESTADO_FINALIZACION == "6");
            })

            if (result.length > 0) {
                var estado = new Object();
                estado.value = "6";
                estado.descripcion = "CONSULTA OFERTA";
                estados.push(estado);
            }
        }

        if (campana.estado == "preview") {

            if (!app.isInboundCall) {
                var esUltimoIntento = false;
                var intentos = cicGetAttemps();
                if (thisController.maxIntentosDiscadorIN > 0 && parseInt(intentos) + 1 >= thisController.maxIntentosDiscadorIN) esUltimoIntento = true;

                if (!esUltimoIntento) {
                    //Valida AGENDAR - 4
                    var result = $.grep(wrapUpCodesForFamilia, function (wrapUpCode) {
                        return (wrapUpCode.ESTADO_FINALIZACION == "4");
                    })

                    if (result.length > 0) {
                        var estado = new Object();
                        estado.value = "4";
                        estado.descripcion = "AGENDAR";
                        estados.push(estado);
                    }
                }
            } else {
                //Valida AGENDAR - 4
                var result = $.grep(wrapUpCodesForFamilia, function (wrapUpCode) {
                    return (wrapUpCode.ESTADO_FINALIZACION == "4");
                })

                if (result.length > 0) {
                    var estado = new Object();
                    estado.value = "4";
                    estado.descripcion = "AGENDAR";
                    estados.push(estado);
                }
            }
           

            //Valida NO CONTACTADO - 7
            var result = $.grep(wrapUpCodesForFamilia, function (wrapUpCode) {
                return (wrapUpCode.ESTADO_FINALIZACION == "7");
            })
            var estado = new Object();
            estado.value = "7";
            estado.descripcion = "NO CONTACTADO";
            estados.push(estado);


        }

        //Recupera WrapCode Cierre Automatico
        var result = $.grep(wrapUpCodesForFamilia, function (wrapUpCode) {
            return (wrapUpCode.ESTADO_FINALIZACION == "A");
        })

        if (result.length > 0) {
            thisController.codFinalizacionAutomatico = result[0].GUID;
            thisController.descFinalizacionAutomatico = result[0].SUBMOTIVO;
        }

        //Recupera WrapCode Desconexión
        var result = $.grep(wrapUpCodesForFamilia, function (wrapUpCode) {
            return (wrapUpCode.ESTADO_FINALIZACION == "D");
        })

        if (result.length > 0) {
            thisController.codFinalizacionDesconexion = result[0].GUID;
            thisController.descFinalizacionDesconexion = result[0].SUBMOTIVO;
        }

        //Recupera WrapCode LLamada Caida
        var result = $.grep(wrapUpCodesForFamilia, function (wrapUpCode) {
            return (wrapUpCode.ESTADO_FINALIZACION == "C");
        })

        if (result.length > 0) {
            thisController.codFinalizacionLlamadaCaida = result[0].GUID;
            thisController.descFinalizacionLlamadaCaida = result[0].SUBMOTIVO;
        }


        var html = "";
        $.each(estados, function (i, r) {
            html += "<option value='" + r.value + "'>" + r.descripcion + "</option>";
        });

        thisController.$this.find("#edEstadoFinalizacion").html(html);
    },
    refreshSubCodigoFinalizacion: function (estadoFinalizacion) {
        var thisController = this;

        var list = new Array();

        var wrapUpCodesForFamilia = new Array();

        var metaDataObject = thisController.onGetMetaDataObject();

        //var familia = (metaDataObject ? metaDataObject.callFamiliaId : cicGetCallFamiliaId());

        var familia = "WE";
        var familiaId = (metaDataObject ? metaDataObject.callFamiliaId : cicGetCallFamiliaId());

        if (familiaId.indexOf("C2C") > -1) familia = "WE";
        else if (familiaId.indexOf("CMB") > -1) familia = "WE";
        else if (familiaId.indexOf("8") > -1) familia = "WI";
        else {
            familia = "WO"; //OUTBOUND
        }

        var objectWrapUpCodesForFamilia = $.grep(thisController.wrapUpCodesArray, function (wrapUpCodeFamilia) {
            return (wrapUpCodeFamilia.familia == familia);
        });

        if (objectWrapUpCodesForFamilia.length > 0) wrapUpCodesForFamilia = objectWrapUpCodesForFamilia[0].list;
        if (estadoFinalizacion != "Seleccione") {
            var list = $.grep(wrapUpCodesForFamilia, function (wrapUpCode) {
                return (wrapUpCode.ESTADO_FINALIZACION == estadoFinalizacion);
            })
        }
        var html = "<option value='Seleccione'>Seleccione</option>";
        $.each(list, function (i, r) {
            html += "<option value='" + r.GUID + "' title='" + r.SUBMOTIVO + "'>" + r.SUBMOTIVO + "</option>";
        });
        thisController.$this.find("#edSubEstadoFinalizacion").html(html);

    },
    getEstadoFinalizacion: function () {
        var thisController = this;
        return thisController.$this.find("#edEstadoFinalizacion").val();
    },
    getCodigoFinalizacion: function () {
        var thisController = this;
        return thisController.$this.find("#edSubEstadoFinalizacion").val();
    },
    getCodigoFinalizacionDesc: function () {
        var thisController = this;
        return thisController.$this.find("#edSubEstadoFinalizacion option:selected").text();
    },
    getInfoAgendamiento: function () {
        var thisController = this;
        var fechaAgendada = thisController.$this.find("#edFechaAgendar").datepicker("getDate");
        
        if (!fechaAgendada) throw ("Debe seleccionar una fecha de Agendamiento");

        var hour = thisController.$this.find("#edAgendarHora option:selected").text();
        var mins = thisController.$this.find("#edAgendarMinutos option:selected").text();

        cicTrace("hour: " + hour + " - mins: " + mins);

        if (hour == "--" || mins == "--") throw ("Debe seleccionar una hora de agendamiento");

        fechaAgendada.setHours(hour, mins, 0, 0);
        
        var now = new Date();

        if (fechaAgendada < now) throw ("Debe seleccionar una fecha hora mayor a la actual");

        return fechaAgendada;
    },
    getLlamadaConectada: function () {
        var thisController = this;        
        if (thisController.globalCallObject.state == "105") return true;
        return false;
    },
    getObservaciones: function () {
        var thisController = this;
        return thisController.$this.find("#edObservaciones").val();
    },
    loadWrapUpCodes: function () {
        var thisController = this;
        var parametros = {
            familia: "WE|WI|WO"
        };
        httpInvoke("GetWrapUpCodes.ges", { param: parametros }, function (list) {
            thisController.wrapUpCodesArray = list;
			thisController.loadAllWrapCodes = true;
            thisController.refreshEstadoFinalizacion();
            app.callBackFinishLoad("Botonera-GetWrapUpCodes");
        });
    },
    loadSpeedDialList: function () {
        var thisController = this;

        var speedDialSelect = thisController.$this.find("#edSpeedDial");
        var html = "<option value='-1'>Seleccione</option>";

        thisController.$this.find("#edSpeedDial").html(html);

        httpInvoke("GetSpeedDialList.ges", {}, function (list) {

            $.each(list, function (i, r) {
                html += "<option value='" + r.numero + "' title='" + r.nombre + "' data-type='" + r.tipo + "'>" + r.nombre + " (" + r.tipo + ")" + "</option>";
            });
            thisController.$this.find("#edSpeedDial").html(html);

            app.callBackFinishLoad("Botonera-GetSpeedDialList");
        });
    },
    logOffCampana: function () {
        cicRequestLogoff();
    },
    getEstadoAgente: function () {
        //return this.$this.find("#edEstadoBreak option:selected").text();
        return cicGetSystemClientStatus();
    },
    timerAutoPlaceCall: function () {
        var thisController = this;
        cicPlacePreviewCall();
        thisController.hasMuted = false;
        thisController.$this.find("#cmdMudo").attr("src", "img/icons/muteOff3.png");
        thisController.activeTimerCall = false;
        
    },
    cortarDestino: function () {        
        var thisController = this;

        if (thisController.globalTransferenceObject != null) {
            if (thisController.globalTransferenceObject.state != "106")
                thisController.globalTransferenceObject.disconnect();
        }

        thisController.globalTransferenceObject = null;

        cicTrace("[Transference] Desconectada llamada a destino");
    },
    llamarDestino: function (numero) {
        var thisController = this;
        
        thisController.globalTransferenceObject = scripter.createCallObject();

        cicTrace("[Transference] Dial a Destino: " + numero);

        try{
            thisController.globalTransferenceObject.dial(numero, false);
        } catch (ex) {
            cicTrace("[Transference] Error al conectar al destino");
        }
        

    },
    volverCliente: function () {
        var thisController = this;
        
        if (thisController.globalTransferenceObject != null) {
            if (thisController.globalTransferenceObject.state != "106")
                thisController.globalTransferenceObject.disconnect();
        }
       
        thisController.globalTransferenceObject = null;

        cicTrace("[Transference] Volver con Cliente");

        thisController.globalCallObject.pickup();

    },
    establecerTransferencia: function () {

        var thisController = this;
        var response = new Object();

        try {

            cicTrace("Inicia Transferencia globalCallObject.id: " + thisController.globalCallObject.id + " - globalTransferenceObject.id: " + thisController.globalTransferenceObject.id);
            
            if (thisController.globalTransferenceObject.state == "106") {
                response.status = false;
                response.type = "cutCall";
                response.msg = "La llamada a destino se ha desconectado. Favor intente nuevamente.";
                return response;
            }

            if (thisController.globalCallObject.state == "106") {
                response.status = false;
                response.type = "cutClient";
                response.msg = "La llamada del cliente se ha desconectado. Favor contactar nuevamente al cliente.";
                return response;
            }
          
            thisController.globalCallObject.consultTransfer(thisController.globalTransferenceObject.id);
            /*
            var transferData = new Object();
            transferData.consult = true;
            transferData.recipient = thisController.globalTransferenceObject.id;
            cicTransfer(transferData);
            */
            thisController.isTransferExecute = true;

            response.status = true;
            response.type = ""
            response.msg = "";

            thisController.cambiaEstadoLlamada(thisController.globalCallObject.state, thisController.globalCallObject.stateString);

            cicTrace("Finaliza Transferencia globalCallObject.id: " + thisController.globalCallObject.id + " - globalTransferenceObject.id: " + thisController.globalTransferenceObject.id);

        } catch (e) {
            response.status = false;
            response.type = "error"
            response.msg = "Se ha producido un error al generar la transferencia. Favor intente nuevamente.";
            cicTrace("Error no controlado al transferir: " + e.message);

        }
       
        return response;
    },
    loadConfiguracion: function () {
        var thisController = this;

        httpInvoke("GetConfiguracion.ges", {}, function (resp) {

            thisController.maxDiasAgenda = resp.maxDiasAgenda;
            thisController.maxDiasAgendaNormal = resp.maxDiasAgendaNormal;
            thisController.maxIntentosDiscadorASB = resp.maxIntentosDiscadorASB;
            thisController.maxIntentosManualASB = resp.maxIntentosManualASB;
            thisController.maxIntentosDiscadorIN = resp.maxIntentosDiscadorIN;
            thisController.maxIntentosManualIN = resp.maxIntentosManualIN;
            thisController.maxIntentosDiscadorOUT = resp.maxIntentosDiscadorOUT;
            thisController.maxIntentosManualOUT = resp.maxIntentosManualOUT;

            thisController.cierreAutomaticoLlamada = resp.cierreAutomaticoLlamada;
            thisController.msgCierreAutomaticoLlamada = resp.msgCierreAutomaticoLlamada;
            
            var edFechaAgendar = thisController.$this.find("#edFechaAgendar").datepicker();
            var maximo = new Date();
            maximo.setDate(maximo.getDate() + thisController.maxDiasAgendaNormal);

            edFechaAgendar.datepicker("option", "maxDate", maximo);

            app.callBackFinishLoad("Botonera-GetConfiguracion");
        });
    },
    getMaximoIntentos: function (tipo) {
        var thisController = this;
        var maximoIntentos = -1;        

        var metaDataObject = thisController.onGetMetaDataObject();

        var familiaId = (metaDataObject ? metaDataObject.callFamiliaId : cicGetCallFamiliaId());

        if (familiaId.indexOf("C2C") > -1) {
            if (tipo == "manual") {
                maximoIntentos = thisController.maxIntentosManualASB;
            } else if (tipo == "discador") {
                maximoIntentos = thisController.maxIntentosDiscadorASB;
            }
        }
        else if (familiaId.indexOf("CMB") > -1) {
            if (tipo == "manual") {
                maximoIntentos = thisController.maxIntentosManualASB;
            } else if (tipo == "discador") {
                maximoIntentos = thisController.maxIntentosDiscadorASB;
            }
        }
        else if (familiaId.indexOf("8") > -1) {
            if (tipo == "manual") {
                maximoIntentos = thisController.maxIntentosManualIN;
            } else if (tipo == "discador") {
                maximoIntentos = thisController.maxIntentosDiscadorIN;
            }
        }
        else {
            if (tipo == "manual") {
                maximoIntentos = thisController.maxIntentosManualOUT;
            } else if (tipo == "discador") {
                maximoIntentos = thisController.maxIntentosDiscadorOUT;
            }
        }

        return maximoIntentos;

    },
    finalizarPorLLamadaCaida: function () {
        var thisController = this;

        if (app.isInboundCall && !app.hasLastCallExecuteManual) {

            $.blockUI({ message: '<h2><img src="img/busy.gif" /> Rediscado en curso. <br>Favor espere</h2>', css: { backgroundColor: '#004262', color: '#fff' } });

            thisController.onAddNewRegisterToContact();

        } else {

            var completeData = {
                wrapupcode: thisController.codFinalizacionLlamadaCaida
            };

            cicCallComplete(completeData);

            app.hasLastCallExecuteManual = true;

            $.blockUI({ message: '<h2><img src="img/busy.gif" /> Rediscado en curso. <br>Favor espere</h2>', css: { backgroundColor: '#004262', color: '#fff' } });

            setTimeout(function () {
                $.unblockUI();
                thisController.hacerRediscado();
            }, 5000);

        }

    },
    callBackAddNewRegisterToContact: function (successCreateRegister, i3Identity) {
        var thisController = this;

        if (successCreateRegister) {

            thisController.globalCallObject.setAttribute("ATTR_WRAPUPCODE", thisController.codFinalizacionLlamadaCaida);

            app.hasLastCallExecuteManual = true;

            setTimeout(function () {
                $.unblockUI();
                thisController.hacerRediscado(i3Identity);
            }, 3000);

        } else {
            $.unblockUI();
            showMsgBoxAlert("No es posible realizar el rediscado. Favor intente nuevamente, si el problema persiste contacte un Administrador", "Discado Manual");
        }
    },
    llamarDestinoConferencia: function (numero) {
        var thisController = this;
        thisController.conferenceDestinyConnected = false;

        var newCallObjectDestiny = scripter.createCallObject();

        newCallObjectDestiny.stateChangeHandler = function (StateID, StateString) {
            var isConnected = false;
            if (StateID == "105") { //Connected
                thisController.conferenceDestinyConnected = true;
            } else {
                thisController.conferenceDestinyConnected = false;
            }
        }

        //LLamar al Destino
        newCallObjectDestiny.dial(numero, false);

        thisController.conferenceDestinyCallObjectAttempt = newCallObjectDestiny;

    },
    establecerConferencia: function () {
        cicTrace("Inicio Establecer Conferencia");
        var thisController = this;
        var response = new Object();
        response.status = true;
        response.type = ""
        response.msg = "";

        var hasInConferenceObject = thisController.CallIDdeConferenciaMUTE != null;
        cicTrace("Valida llamada al IVR");
        try {

            if (thisController.CallIDdeConferenciaMUTE == null) {
                thisController.CallIDdeConferenciaMUTE = thisController.conferenceDestinyCallObjectAttempt.id;
            }
            if (thisController.conferenceDestinyCallObject == null) {
                thisController.conferenceDestinyCallObject = thisController.conferenceDestinyCallObjectAttempt;
            } else {
                thisController.conferenceDestinyCallObject.id = thisController.conferenceDestinyCallObjectAttempt.id;
            }
        } catch (e) {
            thisController.conferenceDestinyConnected = false;
            response.status = false;
            response.type = "destino";
            response.msg = "Existe un error en comunicaciÃ³n con IVR. Favor contactar nuevamente.";

            cicTrace("Finaliza Establecer Conferencia con error");

            return response;
        }

        cicTrace("Crea Objeto Conferencia (en caso de no existir");
        try {
            if (thisController.globalConferenceObject == null) {
                thisController.globalConferenceObject = scripter.createConferenceObject();
            }
        } catch (ex) {
            response.status = false;
            response.type = "conference";
            response.msg = "Ha ocurrido un problema al momento de organizar la confirmaciÃ³n. Favor intentar nuevamente.";

            cicTrace("Finaliza Establecer Conferencia con error");

            return response;
        }

        cicTrace("Se agrega LLamada IVR a Conferencia");

        try {
            if (!thisController.hasFirstCreateInConference) {
                thisController.globalConferenceObject.Create(thisController.conferenceDestinyCallObject);
                thisController.hasFirstCreateInConference = true;
            } else {
                thisController.globalConferenceObject.add(thisController.conferenceDestinyCallObject);
            }
        } catch (ex) {

            thisController.conferenceDestinyConnected = false;
            if (thisController.conferenceDestinyCallObject != null) thisController.conferenceDestinyCallObject.disconnect();

            thisController.disconnectConferencesParties(false);

            response.status = false;
            response.type = "destinoInConference";
            response.msg = "Se ha perdido comunicaciÃ³n con IVR. Favor contactar nuevamente.";

            cicTrace("Finaliza Establecer Conferencia con error");

            return response;
        }

        cicTrace("Se agrega LLamada a Cliente");

        try {

            if (hasInConferenceObject) {
                IS_Action_Pickup.CallID = thisController.CallIDdeConferenciaMUTE;
                IS_Action_Pickup.click();
            } else {
                thisController.globalCallObject.pickup();
            }


            try {
                var members = thisController.globalConferenceObject.startMemberIdsEnum;
            } catch (e) {
                var members = null;
            }

            var existClientParty = false;

            if (members != null) {
                while (members.hasMoreElements()) {
                    var memberId = members.nextElement();
                    if (memberId == thisController.globalCallObject.id) {
                        existClientParty = true;
                        break;
                    }
                }

                if (!existClientParty)
                    thisController.globalConferenceObject.add(thisController.globalCallObject);

                cicTrace("Finaliza Establecer Conferencia de forma exitosa");

                return response;

            }

        } catch (ex) {

            thisController.conferenceDestinyConnected = false;

            thisController.disconnectConferencesParties(true);

            response.status = false;
            response.type = "clientInConference";
            response.msg = "Se ha perdido comunicaciÃ³n con Cliente. Favor contactar nuevamente y luego intentar establecer ConfirmaaciÃ³n.";

            cicTrace("Finaliza Establecer Conferencia con error");

            return response;

        }

    },
    cancelarLLamadasDesdeConferencia: function () {
        var thisController = this;

        if (campana.estado != "call") return;

        if (thisController.globalConferenceObject != null) {
            try {
                var members = thisController.globalConferenceObject.startMemberIdsEnum;
            } catch (e) {
                var members = null;
            }
            if (members != null) {
                while (members.hasMoreElements()) {
                    var memberId = members.nextElement();
                    thisController.globalConferenceObject.disconnectParty(memberId);
                }
            }
            thisController.hasFirstCreateInConference = false;
        }

        if (thisController.globalCallObject.state != "106")
            thisController.globalCallObject.disconnect();

        thisController.hasMuted = false;
        thisController.$this.find("#cmdMudo").attr("src", "img/icons/muteOff3.png");
    },
    disconnectConferencesParties: function (disconnectOriginal) {
        var thisController = this;

        if (thisController.globalConferenceObject != null) {
            try {
                var members = thisController.globalConferenceObject.startMemberIdsEnum;
            } catch (e) {
                var members = null;
            }

            if (members != null) {
                while (members.hasMoreElements()) {
                    var memberId = members.nextElement();
                    if (disconnectOriginal || memberId != thisController.callIdOriginal)
                        thisController.globalConferenceObject.disconnectParty(memberId);
                }
            }

            thisController.hasFirstCreateInConference = false;
        }

    },
    loadIVRConfirmacion: function () {
        var thisController = this;

        httpInvoke("GetIVRConfirmacion.ges", {}, function (resp) {

            thisController.IVRMaximoEjecucionesConfirmation = resp.maxEjecucionesIVRConfirmacionVenta;
            thisController.IVRDNISAudioAgente = resp.dnisAudioAgenteIVRConfirmacionVenta;

            app.callBackFinishLoad("Botonera-GetIVRConfirmacion");
        });
    },
    finalizadaLlamadaIVRConfirmacion: function (type) {
        var thisController = this;
        $.unblockUI();
        var msg = "";

        if (thisController.audioAgenteConnected && thisController.audioAgenteCallObject) {
            thisController.audioAgenteCallObject.disconnect();
            thisController.audioAgenteConnected = false;
            thisController.audioAgenteCallObject = null;
            if (thisController.AgentCallObjectInConfirmation) cicPickup(thisController.AgentCallObjectInConfirmation.id);
        }

        var msgDesconexionAgente = "Estimado ejecutivo se ha desconectado su estacion. Favor verificar correcta conexion de Ã©sta.";

        if (type == "CLIENT_DISCONNECT") {
            thisController.IVRConfirmation = "INTERRUPTED";
            if (thisController.agentDisconnectConfirmation) showMsgBoxAlert(msgDesconexionAgente, "ConfirmaciÃ³n de Venta");
            msg = "Se ha desconectado el cliente durante la validacion de Confirmacion de Venta.";
            showMsgBoxAlert(msg, "Confirmacion de Venta");
            thisController.cancelarLLamadasDesdeConferencia();
        } else if (type == "IVR_DISCONNECT") {
            thisController.IVRConfirmationCount++;
            thisController.IVRConfirmation = "SUCCESS";
            if (thisController.agentDisconnectConfirmation) showMsgBoxAlert(msgDesconexionAgente, "ConfirmaciÃ³n de Venta");
            msg = "Confirmacion de Venta Finalizada.";
            showMsgBoxInfo(msg, "ConfirmaciÃ³n de Venta");
            cicPickup(thisController.CallIDdeConferenciaMUTE);
            cicMute(thisController.CallIDdeConferenciaMUTE);
        } else if (type == "IVR_DISCONNECT_ERROR") {
            thisController.IVRConfirmation = "ERROR_IVR_DISCONNECT";
            if (thisController.agentDisconnectConfirmation) showMsgBoxAlert(msgDesconexionAgente, "ConfirmaciÃ³n de Venta");
            msg = "Se ha desconectado el IVR de Confirmacion de Venta.";
            showMsgBoxAlert(msg, "ConfirmaciÃ³n de Venta");
            cicPickup(thisController.CallIDdeConferenciaMUTE);
            cicMute(thisController.CallIDdeConferenciaMUTE);
        } else {
            thisController.IVRConfirmation = "ERROR";
            if (thisController.agentDisconnectConfirmation) showMsgBoxAlert(msgDesconexionAgente, "ConfirmaciÃ³n de Venta");
            msg = "Ha ocurrido un error y se ha interrumpido la Confirmacion de Venta.";
            showMsgBoxAlert(msg, "Confirmacion de Venta");
            cicPickup(thisController.CallIDdeConferenciaMUTE);
            cicMute(thisController.CallIDdeConferenciaMUTE);
        }
        thisController.IVRCallObject = null;
        thisController.AgentCallObjectInConfirmation = null;
        thisController.agentDisconnectConfirmation = false;
        cicTrace("Confirmacion de Venta Finalizada con " + thisController.IVRConfirmation + ". Msg: " + msg);
    },
    llamarDNISAudioAgente: function (numero) {
        cicTrace("Inicio Llamada Audio Espera Agente " + numero);
        var thisController = this;
        thisController.audioAgenteConnected = false;
        thisController.audioAgenteCallObject = null;

        var newCallObjectAudioAgente = scripter.createCallObject();

        newCallObjectAudioAgente.stateChangeHandler = function (StateID, StateString) {
            if (StateID == "105") { //Connected
                thisController.audioAgenteConnected = true;
            } else {
                thisController.audioAgenteConnected = false;
            }
        }

        //LLamar al Destino
        cicTrace("Ejecuta Llamada Audio Espera Agente " + numero);
        newCallObjectAudioAgente.dial(numero, false);

        thisController.audioAgenteCallObject = newCallObjectAudioAgente;
        cicTrace("Finaliza Llamada Audio Espera Agente " + numero);

    }

};