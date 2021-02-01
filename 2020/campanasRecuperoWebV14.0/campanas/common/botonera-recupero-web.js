var controller = {
    $this: null,
    hayDebugger: false,
    panelLlamada: null,
    panelEstado: null,
    panelObservaciones: null,
    panelFinalizar: null,
    timerH: 0,
    timerM: 0,
    timerS: 0,
    onBackEndBreak: null,
    onRefrescaHeader: null,
    onGoToBreak: null,
    requestBreak: false,
    ultimoEstadoBreakRequest: "-1",
    globalCallObject: null,
    globalTransferenceObject: null,
    ultimoRediscadoCallObject: null,
    onGetRutCliente: null,
    onBackFinalizarTransferencia: null,
    onBackFinLlamadaPorTransferencia: null,
    wrapUpCodesArray: new Array(),
    loadAllWrapCodes: false,
    nroMaximoLlamadas: 7,
    callIdOriginal: -1,
    timerPlaceCall: null,
    activeTimerCall: false,
    timeOutPlaceCall: 10000,
    hasMuted: false,
    firstDisconnect: true,
    lastStatusAgent: "",
    isTransferExecute: false,
    onGoToBreak: null,
    onRefrescaBreak: null,
    maxDiasAgenda: 5,
    maxDiasAgendaNormal: 30,
   	codFinalizacionLlamadaCaida: null,
   	descFinalizacionLlamadaCaida: null,
    init: function (container, options) {
        this.$this = $(container.children()[0]);
        var thisController = this;
        thisController.activeTimerCall = false;
        this.$this.find("#panelEstado").zLayout().parent().css("padding", 6);
        this.$this.find("#panelLlamada").zLayout().parent().css("padding", 6);
        this.$this.find("#panelObservaciones").zLayout().parent().css("padding", 6);
        this.$this.find("#panelFinalizar").zLayout().parent().css("padding", 6);

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
            if (estadoBreak == "Seleccione") {
                showMsgBoxAlert("Debe seleccionar un estado de Break", "Solicitar Break");
                return;
            }
            showMsgBoxInfo("Usted solicitó ir a " + thisController.$this.find("#edEstadoBreak option:selected").text(), "Confirmación Break");

            if (campana.estado == "break") {
                
                thisController.ultimoEstadoBreakRequest = estadoBreak;
                thisController.requestBreak = true;
                thisController.onGoToBreak();
               
            } else if (campana.estado == "waiting") {
                
                thisController.ultimoEstadoBreakRequest = estadoBreak;
                thisController.requestBreak = true;
                cicRequestBreak();
               
            } else if (campana.estado == "call" || campana.estado == "preview") {
                thisController.ultimoEstadoBreakRequest = estadoBreak;
                thisController.requestBreak = true;
                cicRequestBreak();
                cicTrace("[Preview/Predictive]Agente Pide Break Id: " + thisController.ultimoEstadoBreakRequest);
                
            }
        });
        
        
        thisController.$this.find("#cmdTerminarDescanso").click(function () {
            if (campana.estado != "break") return;
            cicEndBreak();
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
            
            if (thisController.globalCallObject.state != "106") 
                thisController.globalCallObject.disconnect();
            
            thisController.hasMuted = false;
            thisController.$this.find("#cmdMudo").attr("src", "img/icons/muteOff3.png");

        });

        thisController.$this.find("#cmdTransferir").click(function () {
            if (campana.estado != "call") return;            
			
            if (thisController.isTransferExecute) return;

            if (thisController.globalCallObject.state == "106") return;

            var numero = thisController.$this.find("#edSpeedDial").val();

            if (numero == -1) {
                showMsgBoxAlert("Debe seleccionar un destino", "Transferencia");
                return;
            }

            cicTrace("[Ticket_DCP] :: [Status del Ticket] :: " + bandera_ticket);
            
            if (bandera_ticket)
            {
                cicTrace("[Ticket_DCP] :: [Ticket Valido] :: El ticket es valido y ejecutara el webServices httpSendCallIVRDCP");
                
                var telefono_DCP = cicGetNumberToDial();
        
                if (telefono_DCP.indexOf("sip:") > -1 || telefono_DCP.indexOf("@") > -1) {
                    telefono_DCP = telefono_DCP.replace("sip:", "");
                    telefono_DCP = telefono_DCP.substring(0, telefono_DCP.indexOf("@"));
                }
                
                cicTrace("[Ticket_DCP] :: [Ticket Valido] :: [telefono_DCP] :: " + telefono_DCP);
                            
                var postData = {
                    "transId" : amountObject.ticket,
                    "entityId" : "ec01",
                    "merchantId" : "merchantId01",
                    "originTel" : telefono_DCP.toString(),
                    "clientId" : "0",
                    "transAmount" : amountObject.amount,
                    "transAmountSinIVA" : "45600",
                    "transAmountIVA" : "78900",
                    "tokenized" : "0",
                    "channel":"DCP",
                    "aditionalData1": "opcional1",
                    "aditionalData2": "opcional2"
                }
                
                cicTrace("[Ticket_DCP] :: [Ticket Valido] :: [postData transId] :: " + amountObject.ticket);
                cicTrace("[Ticket_DCP] :: [Ticket Valido] :: [postData originTel] :: " + telefono_DCP);
                cicTrace("[Ticket_DCP] :: [Ticket Valido] :: [postData transAmount] :: " + amountObject.amount);
                cicTrace("[Ticket_DCP] :: [Ticket Valido] :: [postData channel] :: " + postData.channel);
                cicTrace("[Ticket_DCP] :: [Ticket Valido] :: [postData entityId] :: " + postData.entityId);
                cicTrace("[Ticket_DCP] :: [Ticket Valido] :: [postData merchantId] :: " + postData.merchantId);

                httpSendCallIVRDCP(postData, function (resp)
                {
                    cicTrace("[Ticket_DCP] :: [Ticket Valido] :: [SendCallIVRDCP] :: Se ejecuto Exitosamente");
                    cicTrace("[Ticket_DCP] :: [Ticket Valido] :: [SendCallIVRDCP] :: [Status Code]:: " + resp.statusCode);
                    if(resp.statusCode == "0000")
                    {
                        //thisController.$this.find("#edSpeedDial").children("option[value='600188']").hide();
                        thisController.$this.find('#edSpeedDial option[value="600188"]').attr('disabled', 'disabled').hide();
                        //showMsgBoxAlert("Transferencia Exitosa.", "Transferencia");                       
                        cicTrace("[Ticket_DCP] :: [Ticket Valido] :: [SendCallIVRDCP] :: [description y Status Code]:: " + resp.description + " " + resp.statusCode);
                    }
                    else
                    {
                        //thisController.$this.find("#edSpeedDial").children("option[value='600188']").hide();
                        thisController.$this.find('#edSpeedDial option[value="600188"]').attr('disabled', 'disabled').hide();
                        showMsgBoxAlert(resp.description, "Transferencia");
                        cicTrace("[Ticket_DCP] :: [Ticket Valido] :: [SendCallIVRDCP] :: [description y Status Code]:: " + resp.description + " " + resp.statusCode);
                    }
                    
                }, function (error)
                {
                    //thisController.$this.find("#edSpeedDial").children("option[value='600188']").hide();
                    thisController.$this.find('#edSpeedDial option[value="600188"]').attr('disabled', 'disabled').hide();
                    showMsgBoxAlert(error.description + " - " + error.statusCode, "Error Transferencia");
                    cicTrace("Error: " + error.description + " - " + error.statusCode);
                    cicTrace("[Ticket_DCP] :: [Ticket Valido] :: [SendCallIVRDCP] :: [ERROR] :: [description y Status Code]:: " + error.description + " " + error.statusCode);
                });
            }
            else
            {
                showMsgBoxInfo("Contenido :: [bandera_ticket] :: " + bandera_ticket, "Transferencia");
                cicTrace("[Ticket_DCP] :: [Status del Ticket] :: [No valido] ::" + bandera_ticket);
            } 

            var typeTransfer = thisController.$this.find("#edSpeedDial option:selected").attr("data-type");
            var key = thisController.$this.find("#edSpeedDial option:selected").attr("value");

            if (typeTransfer.toLowerCase() == "ciega") {

                thisController.llamarDestino(numero);
                var response = thisController.establecerTransferencia();

                if (response.status) {
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

                if(key == "600188")
                {
                    thisController.$this.find('#edSpeedDial option[value="600188"]').attr('disabled', 'disabled').hide();
                }

                thisController.$this.find('#edSpeedDial option[value="600188"]').attr('disabled', 'disabled').hide();
                
                response.type = ""
                response.msg = "";

            } else if (typeTransfer.toLowerCase() == "asistida") {
                var isDestinoConnected = (thisController.globalTransferenceObject == null ? false : thisController.globalTransferenceObject.state == "105");

                openDialog("campanas/common/popUpTransferencia", {
                    isDestinoConnected: isDestinoConnected,
                    onLlamarDestino: function () { thisController.llamarDestino(numero); },
                    onCortarDestino: function () { thisController.cortarDestino(); },
                    onVolverCliente: function () { thisController.volverCliente(); },
                    onHacerTransferencia: function () { return thisController.establecerTransferencia(); }
                });
            } else {
                showMsgBoxError("Tipo de Transferencia no es valida. Favor informar a Administrador de Sistemas", "Transferencia");
            }

        });

        thisController.$this.find("#cmdEspera").click(function () {
            if (campana.estado != "call") return;
            if (thisController.globalCallObject.state == "106") return;

			if (thisController.isTransferExecute) return;
			
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
            if (thisController.isTransferExecute) return;

            thisController.activeTimerCall = false;

            if (campana.estado == "preview") {
                thisController.$this.find("#cmdRediscar").attr("src", "img/icons/redial.png");
                clearTimeout(thisController.timerPlaceCall);
            }
            if (campana.estado != "call" && campana.estado != "preview") return;

            if (campana.estado == "call") {
                cicTrace("Call Status: " + thisController.globalCallObject.state);
                if (thisController.globalCallObject.state == "106") { //Disconnected
                    if (thisController.contadorManual <= 0) {
                        showMsgBoxAlert("Excedió el límite de discado manual", "Discado Manual");
                        return;
                    }
                    
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
        var panelFinalizar = this.$this.find("#panelFinalizar");
        panelFinalizar.css("position", "absolute");
        panelFinalizar.width(panelFinalizar.parent().width());
        panelFinalizar.height(panelFinalizar.parent().height());
        panelFinalizar.zLayout("doLayout");
        thisController.panelFinalizar = panelFinalizar;
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
        if (campana.estado == "break") {
            this.onRefrescaBreak();
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

        thisController.$this.find('#edSpeedDial option[value="600188"]').attr('disabled', 'disabled').hide();		
		
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

        thisController.initializeRestart();

        if (campana.estado == "initializing") {
            thisController.contadorManual = 5;
            thisController.$this.find("#intentoRedisc").html(thisController.contadorManual);
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
            thisController.$this.find("#edObservaciones").attr("disabled", "disabled");
            thisController.$this.find("#cmdRediscar").attr("src", "img/icons/redial.png");
            enableButton(thisController.$this.find("#cmdRefresh"), false);
        } else if (campana.estado == "waiting") {           

            thisController.contadorManual = 5;
            thisController.$this.find("#intentoRedisc").html(thisController.contadorManual);

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
            thisController.$this.find("#edObservaciones").attr("disabled", "disabled");            
            thisController.$this.find("#cmdRediscar").attr("src", "img/icons/redial.png");
        } else if (campana.estado == "break") {
		    thisController.$this.find("#edObservaciones").val("");
            thisController.contadorManual = 5;
            thisController.$this.find("#intentoRedisc").html(thisController.contadorManual);

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
            thisController.$this.find("#cmdRediscar").attr("src", "img/icons/redial.png");
        } else if (campana.estado == "call") {
            thisController.lastStatusAgent = "";
            thisController.contadorManual = 5;
            thisController.$this.find("#intentoRedisc").html(thisController.contadorManual);          
            thisController.hasMuted = false;
			thisController.firstDisconnect = true;
            thisController.$this.find("#botonera").accordion("option", { active: 2 });
            edFechaAgendar.datepicker("enable");
            speedDial.removeAttr("disabled");
            thisController.$this.find("#edNumeroLlamada").removeAttr("disabled");
            thisController.$this.find("#edAgendarHora").removeAttr("disabled");
            thisController.$this.find("#edAgendarMinutos").removeAttr("disabled");

            if (!thisController.requestBreak) {
                thisController.$this.find("#edEstadoBreak").val("Seleccione");
                thisController.ultimoEstadoBreakRequest = "-1";
            }

            if (app.lastCallType == "predictive") {

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
            thisController.callIdOriginal = cicGetCallId();
            thisController.$this.find("#cmdRediscar").attr("src", "img/icons/redial.png");

        } else if (campana.estado == "preview") {
            thisController.contadorManual = 5;
            thisController.$this.find("#intentoRedisc").html(thisController.contadorManual);

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
            thisController.$this.find("#cmdRediscar").attr("src", "img/icons/redial.gif");
        }


        thisController.refreshEstadoFinalizacion();
        thisController.refreshSubCodigoFinalizacion("Seleccione");

        cicTrace("Botonera Fin Refresca");
    },
    setAgentStatus: function (status) {
        var thisController = this;
        var estadoBreak = status;

        if (!status) {
            estadoBreak = (thisController.ultimoEstadoBreakRequest == -1 ? thisController.$this.find("#edEstadoBreak").val() : thisController.ultimoEstadoBreakRequest);
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
    ejecutarTransferencia: function (numero, idGestion) {
        var thisController = this;

        cicMarkCallForFinishing();

        thisController.globalCallObject.setAttribute("TipoLLamada", "ToFinishAgent");
        thisController.globalCallObject.setAttribute("idGestion", idGestion.toString());

        //cicWriteData();

        var transferData = new Object();
        transferData.recipient = numero;
        transferData.consult = false;

        cicTransfer(transferData);

        thisController.onBackFinLlamadaPorTransferencia();

    },
    hacerRediscado: function () {
        var thisController = this;

        if (thisController.globalConferenceObject != null) {
            try{
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

        thisController.CallIDdeConferenciaMUTE = null;
        thisController.ultimoRediscadoCallObject = scripter.createCallObject();
        
        var numero = cicGetNumberToDial();	

        var numeroPrefijo = 'tel:' + numero;

        thisController.ultimoRediscadoCallObject.dial(numeroPrefijo, false);            

        cicTrace("Before Setting Dialer Attributes Dialer_CampaignId and Dialer_Identity");
        thisController.ultimoRediscadoCallObject.setAttribute('Dialer_CampaignId', cicGetCampaignId());
        thisController.ultimoRediscadoCallObject.setAttribute('Dialer_Identity', cicGetI3Identity());
        cicTrace("After Setting Dialer Attributes Dialer_CampaignId and Dialer_Identity");

        thisController.globalCallObject.id = thisController.ultimoRediscadoCallObject.id;

        var campaingName = cicGetCampaignName();
        var cuartil = cicGetCuartil();

        cicTrace("Hacer Rediscado: Registrando CallIdOriginal: " + thisController.callIdOriginal);

        //thisController.ultimoRediscadoCallObject.setAttribute("CustomNum1", thisController.callIdOriginal);
        thisController.ultimoRediscadoCallObject.setAttribute("ATTR_CALL_ID_ORIGINAL", thisController.callIdOriginal);
        thisController.ultimoRediscadoCallObject.setAttribute("ATTR_CORRELACION", thisController.callIdOriginal);
        thisController.ultimoRediscadoCallObject.setAttribute("ATTR_Nombre_Campana", campaingName);
        thisController.ultimoRediscadoCallObject.setAttribute("ATTR_CUARTIL", cuartil);
        thisController.ultimoRediscadoCallObject.setAttribute("ATTR_Rediscado", "S");
        thisController.ultimoRediscadoCallObject.setAttribute("ATTR_MANUAL", "Llamada Rediscada");

        var rutCliente = cicGetCliRutConDV();
        var rutClienteCierre = thisController.onGetRutCliente();
        if (rutClienteCierre) {
            rutCliente = rutClienteCierre;
        }
        thisController.ultimoRediscadoCallObject.setAttribute("ATTR_RUT_Cliente", rutCliente);

        var esReferido = "N";
        if (cicGetCallArchivo() == "Manual Referido") {
            esReferido = "S";
        }
        thisController.ultimoRediscadoCallObject.setAttribute("ATTR_REFERIDO", esReferido);

        cicSetCallId(thisController.ultimoRediscadoCallObject.id);//Validar si necesario
       
        cicTrace("Agente '" + cicGetSystemAgentId() + "' ha rediscado a cliente. Nuevo CallId '" + thisController.ultimoRediscadoCallObject.id + "'")
    },
    cambiaEstadoLlamada: function (StateId, StateString) {

        var thisController = this;
        cicTrace("Nuevo estado LLamada: '" + StateId + "' - '" + StateString + "'");
        var isConnected = false;
        if (StateId == "105" || StateId == "6") { //Connected o OnHold
            isConnected = true;
        } else {
            isConnected = false;
        }
        
        cicTrace("[cambioEstadoLlamada] isConnected : " + isConnected);

        if (isConnected && thisController.isTransferExecute) {
            cicTrace("[cambioEstadoLlamada] Llamada Conectada pero fue Transferida. Se asume estado conexión 'false'");
            isConnected = false;
        }

        if (thisController.firstDisconnect && StateId == "106" || thisController.isTransferExecute) {
            thisController.firstDisconnect = false;
            cicStage("1");
        }

        thisController.onRefrescaHeader(isConnected);     

    },
    errorEnLlamada: function (ErrorId, ErrorText) {
        cicTrace("Error Llamada: '" + ErrorId + "' - '" + ErrorText + "'", "1");
        //alert("Error Llamada: '" + ErrorId + "' - '" + ErrorText + "'");
    },
    refreshEstadoFinalizacion: function () {
        var thisController = this;
        var estados = new Array();
        
        
        var estado = new Object();
        estado.value = "Seleccione";
        estado.descripcion = "Seleccione";
        estados.push(estado);

        if (!thisController.loadAllWrapCodes) return;
        
        if (campana.estado == "call"){
            var familia = cicGetCallFamiliaId();
            cicTrace("Familia: " + familia);
            if (familia) { //Si tiene valor esta en llamada
                //Valida VENTA - 1
				var result = $.grep(thisController.wrapUpCodesArray, function (wrapUpCode) {
					return (wrapUpCode.ESTADO_FINALIZACION == "1");
				})
				
				if (result.length > 0) {
					var estado = new Object();
					estado.value = "1";
					estado.descripcion = "VENTA";
					estados.push(estado);
				}

                //Valida VENTA NO TRIO - 2
				var result = $.grep(thisController.wrapUpCodesArray, function (wrapUpCode) {
					return (wrapUpCode.ESTADO_FINALIZACION == "2");
				})

				if (result.length > 0) {
					var estado = new Object();
					estado.value = "2";
					estado.descripcion = "VENTA NO TRIO";
					estados.push(estado);
				}
                
                //Valida VENTA RESPALDO - 3 
                
				var result = $.grep(thisController.wrapUpCodesArray, function (wrapUpCode) {
					return (wrapUpCode.ESTADO_FINALIZACION == "3");
				})

				if (result.length > 0) {
					var estado = new Object();
					estado.value = "3";
					estado.descripcion = "VENTA RESPALDO";
					estados.push(estado);
				}

				var esUltimoIntento = false;
				var intentos = cicGetAttemps();
				if (parseInt(intentos) + 1 == thisController.nroMaximoLlamadas) esUltimoIntento = true;

                //Valida AGENDAR - 4
                if (!esUltimoIntento) {
                    var result = $.grep(thisController.wrapUpCodesArray, function (wrapUpCode) {
                        return (wrapUpCode.ESTADO_FINALIZACION == "4");
                    })
                    var estado = new Object();
                    estado.value = "4";
                    estado.descripcion = "AGENDAR";
                    estados.push(estado);
                }
        
                //Valida NO EFECTIVO - 5
                var result = $.grep(thisController.wrapUpCodesArray, function (wrapUpCode) {
                    return (wrapUpCode.ESTADO_FINALIZACION == "5");
                })

                var estado = new Object();
                estado.value = "5";
                estado.descripcion = "NO EFECTIVO";
                estados.push(estado);
        

                //Valida RECHAZO - 6
                var result = $.grep(thisController.wrapUpCodesArray, function (wrapUpCode) {
                    return (wrapUpCode.ESTADO_FINALIZACION == "6");
                })
                var estado = new Object();
                estado.value = "6";
                estado.descripcion = "RECHAZO";
                estados.push(estado);

                //Valida NO CONTACTADO - 7
                if (app.lastCallType == "Preview") {
                    var result = $.grep(thisController.wrapUpCodesArray, function (wrapUpCode) {
                        return (wrapUpCode.ESTADO_FINALIZACION == "7");
                    })
                    var estado = new Object();
                    estado.value = "7";
                    estado.descripcion = "NO CONTACTADO";
                    estados.push(estado);
                }

				//Valida NUMERO CON AVAL - 8                
                if (app.lastCallType == "preview") {
                    var result = $.grep(thisController.wrapUpCodesArray, function (wrapUpCode) {
                        return (wrapUpCode.ESTADO_FINALIZACION == "8");
                    })
                    var estado = new Object();
                    estado.value = "8";
                    estado.descripcion = "NÚMERO CON AVAL";
                    estados.push(estado);
                }
            }

        }

        if (campana.estado == "preview") {

            var familia = cicGetCallFamiliaId();
            cicTrace("Familia: " + familia);

            if (familia) { //Si tiene valor esta en llamada              

                var esUltimoIntento = false;
                var intentos = cicGetAttemps();
                if (parseInt(intentos) + 1 == thisController.nroMaximoLlamadas) esUltimoIntento = true;
                //Valida AGENDAR - 4
                if (!esUltimoIntento) {
                    var result = $.grep(thisController.wrapUpCodesArray, function (wrapUpCode) {
                        return (wrapUpCode.ESTADO_FINALIZACION == "4");
                    })
                    var estado = new Object();
                    estado.value = "4";
                    estado.descripcion = "AGENDAR";
                    estados.push(estado);
                }

                //Valida NO CONTACTADO - 7
				var result = $.grep(thisController.wrapUpCodesArray, function (wrapUpCode) {
					return (wrapUpCode.ESTADO_FINALIZACION == "7");
				})
				var estado = new Object();
				estado.value = "7";
				estado.descripcion = "NO CONTACTADO";
				estados.push(estado);
            }
        }

        //Recupera WrapCode LLamada Caida
        var result = $.grep(thisController.wrapUpCodesArray, function (wrapUpCode) {
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
        if (estadoFinalizacion != "Seleccione") {
            var list = $.grep(thisController.wrapUpCodesArray, function (wrapUpCode) {
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
    loadWrapUpCodes: function (canal) {
        var thisController = this;
        var familia = "";
        switch (canal) {            
            case "RW-FIJO":
                familia = "RWF";
                break;
            case "RW-MOVIL":
                familia = "RWM";
                break;
            default:
                familia = "RW";
                break;
        }
        var parametros = {
            familia: familia
        };
        httpInvoke("GetWrapUpCodes.ges", { param: parametros }, function (list) {
            thisController.wrapUpCodesArray = list;
			thisController.loadAllWrapCodes = true;
            thisController.refreshEstadoFinalizacion();

            app.callBackFinishLoad("Botonera-GetWrapUpCodes");
            
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

            cicClientStatus("Follow Up");

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
    loadSpeedDialList: function () {
        var thisController = this;

        var speedDialSelect = thisController.$this.find("#edSpeedDial");
        var html = "<option value='-1'>Seleccione</option>";

        thisController.$this.find("#edSpeedDial").html(html);

        httpInvoke("GetSpeedDialList.ges", {}, function (list) {

            $.each(list, function (i, r)
            {
                if(r.numero == '600188')
                {
                    html += "<option style='display: none;' value='" + r.numero + "' title='" + r.nombre + "' data-type='" + r.tipo + "'>" + r.nombre + " (" + r.tipo + ")" + "</option>";
                }
                else
                {
                    html += "<option value='" + r.numero + "' title='" + r.nombre + "' data-type='" + r.tipo + "'>" + r.nombre + " (" + r.tipo + ")" + "</option>";
                }
            });

            thisController.$this.find("#edSpeedDial").html(html);

            thisController.$this.find('#edSpeedDial option[value="600188"]').attr('disabled', 'disabled').hide();

            app.callBackFinishLoad("Botonera-GetSpeedDialList");
        });

        thisController.$this.find('#edSpeedDial option[value="600188"]').attr('disabled', 'disabled').hide();
    },
    loadMaxDiasAgenda: function () {
        var thisController = this;

        httpInvoke("GetMaximoDiasAgenda.ges", {}, function (resp) {

            thisController.maxDiasAgenda = resp.maxDiasAgenda;
            thisController.maxDiasAgendaNormal = resp.maxDiasAgendaNormal;

            var edFechaAgendar = thisController.$this.find("#edFechaAgendar").datepicker();
            var maximo = new Date();
            maximo.setDate(maximo.getDate() + thisController.maxDiasAgendaNormal);
            
            edFechaAgendar.datepicker("option", "maxDate", maximo);

            app.callBackFinishLoad("Botonera-GetMaximoDiasAgenda");
        });
    },
    finalizarPorLLamadaCaida: function () {
        var thisController = this;

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
       
    },
    cambiaEstadoAgenteManualCall: function (nuevoEstadoAgente) {
        var thisController = this;
        cicTrace("Cambiando Estado Agenda a: " + nuevoEstadoAgente);
        cicClientStatus(nuevoEstadoAgente);

    }
};