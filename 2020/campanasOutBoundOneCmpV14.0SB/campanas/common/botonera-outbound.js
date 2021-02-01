var controller = {
    $this: null,
    hayDebugger: false,
    panelLlamada: null,
    panelEstado: null,
    panelObservaciones: null,
    panelFinalizarVenta: null,
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
    globalConferenceObject: null,
    conferenceDestinyCallObjectAttempt: null,
    conferenceDestinyCallObject: null,
    ultimoRediscadoCallObject: null,
    onGetRutCliente: null,
    onBackFinalizarTransferencia: null,
    onBackFinLlamadaPorTransferencia: null,
    wrapUpCodesArray: new Array(),
    loadAllWrapCodes: false,
    nroMaximoLlamadas: 7,
    callIdOriginal: -1,
    conferenceDestinyConnected: false,
    clearTimer:0,
    TimerCall: 0,
    hasFirstCreateInConference: false,
    hasMuted: false,
	
	//adicionado 16072018
	  onAutomaticFinish: null,
    codFinalizacionAutomatico: null,
    descFinalizacionAutomatico: null,
    codFinalizacionDesconexion: null,
    descFinalizacionDesconexion: null,
    lastStatusAgent: "",
	

	cierreAutomaticoLlamada: 9,
    msgCierreAutomaticoLlamada: 8,
    cierreLlamadaTimeOut: null,
    msgCierreLlamadaTimeOut: null,
	deshabilitarrediscado: null,
	
    onFinishingCall: null,
    	//adicionado 16072018
		
    onCampaingMode: null,
    CallIDdeConferenciaMUTE: null,
   	firstDisconnect: true,
   	useBackOfficeLegAsMain: true,
   	onRefrescaBreak: null,
   	isTransferExecute: false,
   	maxDiasAgenda: 5,
   	maxDiasAgendaNormal: 30,
   	codFinalizacionLlamadaCaida: null,
   	descFinalizacionLlamadaCaida: null,
   	IVRConfirmation: null, //null, "PROCESSING", "SUCCESS", "ERROR", "ERROR_IVR_DISCONNECT", "INTERRUMPED",  "ERROR_IVR_CALL"
   	IVRCallObject: null,
   	IVRConfirmationCount: 0,
   	IVRMaximoEjecucionesConfirmation: 3,
    IVRDNISAudioAgente: null,
   	AgentCallObjectInConfirmation: null,
   	agentDisconnectConfirmation: false,
   	audioAgenteConnected: false,
    audioAgenteCallObject: null,
    init: function (container, options) {
        this.$this = $(container.children()[0]);
        var thisController = this;
       TimerCall= 0;
        this.$this.find("#panelEstado").zLayout().parent().css("padding", 6);
        this.$this.find("#panelLlamada").zLayout().parent().css("padding", 6);
        this.$this.find("#panelObservaciones").zLayout().parent().css("padding", 6);
        this.$this.find("#panelFinalizarVenta").zLayout().parent().css("padding", 6);

        if (window.cicDBGGetEventsWithListeners && cicDBGGetEventsWithListeners().length > 0) {
            this.hayDebugger = true;
            this.$this.find("#panelDebugger").zLayout().parent().css("padding", 6);
            var html = "";
            $.each(cicDBGGetEventsWithListeners(), function (i, e) {
                html += "<option value='" + e + "'>" + e + "</option>";
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
                showMsgBoxAlert("Debe seleccionar un estado de Break","");
                return;
            }
            showMsgBoxInfo("Usted solicitó ir a " + thisController.$this.find("#edEstadoBreak option:selected").text(),"");
            if (campana.estado == "break") {
                //Ya esta en Break. 
                thisController.ultimoEstadoBreakRequest = estadoBreak;
                thisController.requestBreak = true;
                thisController.onGoToBreak();
					clearTimeout(thisController.deshabilitarrediscado);
								    thisController.deshabilitarrediscado = null;
            }else if (campana.estado == "waiting") {
				
                thisController.ultimoEstadoBreakRequest = estadoBreak;
                thisController.requestBreak = true;
                cicRequestBreak();
            } else if (campana.estado == "call" || campana.estado == "preview") {
                thisController.ultimoEstadoBreakRequest = estadoBreak;
                thisController.requestBreak = true;
                cicRequestBreak();
                cicTrace("[Preview/Predictive]Agente Pide Break Id: " + thisController.ultimoEstadoBreakRequest);
            }
			clearTimeout(thisController.deshabilitarrediscado);
thisController.deshabilitarrediscado = null;
clearTimeout(thisController.cierreLlamadaTimeOut);
thisController.cierreLlamadaTimeOut = null;
			
			
        });
        
        
        thisController.$this.find("#cmdTerminarDescanso").click(function () {
            if (campana.estado != "break") return;
            cicEndBreak();
            thisController.onBackEndBreak();
        });

        thisController.$this.find("#cmdCancelarLlamada").click(function () {
    
            if (campana.estado != "call") return;

			if (thisController.isTransferExecute) return;
			
			if (thisController.IVRConfirmation == "PROCESSING") return;

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

        thisController.$this.find("#cmdConferencia").click(function () {
            if (campana.estado != "call") return;
            if (thisController.globalCallObject.state == "106") return;

            if (thisController.isTransferExecute) return;

            if (thisController.IVRConfirmation == "PROCESSING") return;
			
            var numero = thisController.$this.find("#edNumeroLlamada").val();
            if (!numero) {
                showMsgBoxAlert("Debe espeficar un número","");
                return;
            }            

            var inConference = false;
            var contador = 0;
            if (thisController.globalConferenceObject != null) {
                try {
                    var members = thisController.globalConferenceObject.startMemberIdsEnum;
                } catch (e) {
                    var members = null;
                }
                if (members != null) {
                    
                    var msg = "";
                    msg += "BO Id: " + thisController.conferenceDestinyCallObject.id + "\n";
                    msg += "Cli Id: " + thisController.globalCallObject.id + "\n";
                    msg += "Ori Id: " + thisController.callIdOriginal + "\n";
                    while (members.hasMoreElements()) {
                        var memberId = members.nextElement();
                        contador++;
                        msg += "Conference Member: " + memberId + "\n";
                        inConference = true;
                    }                    
                }
            }

            var isBackOfficeConnected = contador == 3;

            openDialog("campanas/common/popUpConferencia", {
                inConference: inConference,
                isBackOfficeConnected: isBackOfficeConnected,
                onLlamarBO: function () { thisController.llamarDestinoConferencia(numero); },
                onCortarBO: function () { thisController.cortarDestinoConferencia(); },
                onVolverCliente: function () { thisController.volverCliente(); },
                onHacerConferencia: function () { return thisController.establecerConferencia("BackOffice"); },
                onCancelarLlamada: function () { thisController.cancelarLLamadasDesdeConferencia(); }
            });

            
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
                    showMsgBoxInfo("Transferencia establecida exitosamente", "Transferencia" );
                } else {
                    if (response.type == "cutCall") { //Llamada Destino se corto antes de establecer transferencia  
                        thisController.volverClienteTrans();
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
                    onVolverCliente: function () { thisController.volverClienteTrans(); },
                    onHacerTransferencia: function () { return thisController.establecerTransferencia(); }
                });
           } else if (typeTransfer.toLowerCase() == "ivr"){
	
                

                cicTrace("IVRConfirmation Status: " + (thisController.IVRConfirmation ? thisController.IVRConfirmation : "Primer Intento"));

                if (thisController.IVRConfirmation) {
                    if (thisController.IVRConfirmationCount > thisController.IVRMaximoEjecucionesConfirmation) {
                        showMsgBoxAlert("Se ha superado el máximo de confirmaciones permitidas para una gestión.", "Confirmación de Venta");
                        return;
                    }
                }

                showMsgBoxConfirm("¿Esta seguro que desea ejecutar la Confirmación de Venta?", "Confirmación de Venta", function (result) {
                    if (result == "Si") {

                        cicTrace("Inicia Discado a IVR: " + numero);
                        thisController.llamarDestinoConferencia(numero);
                        var response = thisController.establecerConferencia("IVR");
                        if (response.status) {

                            thisController.IVRConfirmation = "PROCESSING";
                            $.blockUI({ message: '<h2><img src="img/busy.gif" /> IVR de Confirmación en curso. <br>Favor espere</h2>', css: { backgroundColor: '#004262', color: '#fff' } });

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
                                        if (StateString == "Desconectado [Desconexión remota]") {
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
                                showMsgBoxAlert(response.msg, "Confirmación de Venta");
                            } else if (response.type == "conference") { //No se pudo establacer conferencia
                                showMsgBoxAlert(response.msg, "Confirmación de Venta");
                            } else if (response.type == "backOfficeInConference") { //Llamada IVR esta cortada al agregar a conferencia
                                thisController.IVRConfirmation = "ERROR_IVR_CALL";
                                showMsgBoxAlert(response.msg, "Confirmación de Venta");
                            } else if (response.type == "clientInConference") { //Llamada CLiente esta cortada al agregar a conferencia
                                showMsgBoxAlert(response.msg, "Confirmación de Venta");
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
            if (thisController.globalCallObject.state == "106") return;

            if (thisController.isTransferExecute) return;

            if (thisController.IVRConfirmation == "PROCESSING") return;
			
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

            if (thisController.IVRConfirmation == "PROCESSING") return;
			
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
            TimerCall = 0;

            if (thisController.isTransferExecute) return;

            if (thisController.IVRConfirmation == "PROCESSING") return;

            if (campana.estado == "preview") {
				enableButton(thisController.$this.find("#cmdRediscar"), true);
                thisController.$this.find("#cmdRediscar").attr("src", "img/icons/redial.png");
                clearTimeout(clearTimer);
            }
            if (campana.estado != "call" && campana.estado != "preview") return;

            if (campana.estado == "call") {
                var estadoLlamada = "";

                try {
                    estadoLlamada = thisController.globalCallObject.state;
                } catch (e) {
                    estadoLlamada = "106"; //Se asume desconectada al no recuperar valor correctamente
                    cicTrace("Error al recuperar estado llamada. Error: " + e.message);
                }

                cicTrace("Call Status: " + estadoLlamada);

                if (estadoLlamada == "106") { //Disconnected

                    var intentosActuales = parseInt(cicGetAttemps());

                    if (isNaN(intentosActuales)) campana.estado == "preview" ? intentosActuales = -1 : intentosActuales = 0;

                    var intentosDisponibles = thisController.nroMaximoLlamadas - (intentosActuales + 1);

                    if (intentosDisponibles < 0) intentosDisponibles = 0;

                    if (intentosDisponibles = 0) {
                        showMsgBoxAlert("Se ha excedido el número máximo de llamadas para un registro", "Número Máximo Llamadas");
                        return;
                    }
                    
                    thisController.finalizarPorLLamadaCaida();
                  
                } else {
                    cicTrace("Agente '" + cicGetSystemAgentId() + "' redisca llamada conectada", "1");
                    showMsgBoxAlert("Favor no rediscar mientras se encuentre llamada en curso","");
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
        
        thisController.$this.find(".telefono").inputmask({ mask: "9999[9]", "placeholder": "" });
        thisController.$this.find(".telefono").blur(function () {
            if ($(this).val().length == 0) return;
            if (!$(this).inputmask("isComplete")) {
                showMsgBoxAlert("El teléfono debe contener 4 o 5 dígitos","");
                $(this).val("");
            }
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
        var panelFinalizarVenta = this.$this.find("#panelFinalizarVenta");
        panelFinalizarVenta.css("position", "absolute");
        panelFinalizarVenta.width(panelFinalizarVenta.parent().width());
        panelFinalizarVenta.height(panelFinalizarVenta.parent().height());
        panelFinalizarVenta.zLayout("doLayout");
        thisController.panelFinalizarVenta = panelFinalizarVenta;
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
	//Incluido en 16072018
      agentStatus: function () {
        var thisController = this;
        var estadoAgente = cicGetSystemClientStatus();
        this.$this.find("#lblEstadoAgente").text(estadoAgente);
        if (thisController.lastStatusAgent != estadoAgente) cicTrace("Nuevo Estado Agente: " + estadoAgente);
        //if (app.isInboundCall) {
            if (campana.estado == "call") {
                if (thisController.lastStatusAgent.toUpperCase() == "CAMPAIGN CALL" || thisController.lastStatusAgent.toUpperCase() == "LLAMADA DE CAMPAÑA") {
                    
					if (estadoAgente.toUpperCase() == "FOLLOW UP" || estadoAgente.toUpperCase() == "SEGUIMIENTO" ) {

					if (thisController.onFinishingCall()) {
                            cicTrace("No se inician Timers de cierre automatico de llamada ya que gestión esta en proceso de finalización");
                        } else {
    
	
							
                            cicTrace(".                                                                                            Se inician Timers para cierre automatico de llamada: " + thisController.cierreAutomaticoLlamada + " minutos");

							
							
                            var delta = thisController.cierreAutomaticoLlamada - thisController.msgCierreAutomaticoLlamada;
							//showMsgBoxAlert("Inicia timer:  "+delta);					
		
		
		                
                             thisController.deshabilitarrediscado = setTimeout(function () {
                                 
									thisController.$this.find("#cmdRediscar").attr("disabled", "disabled");
									thisController.$this.find("#cmdRediscar").attr("src", "img/icons/redialoff.png");
									clearTimeout(thisController.deshabilitarrediscado);
								    thisController.deshabilitarrediscado = null;
									
                                }, 2 * 1000 * 60);
							
								
                            if (delta > 0) {
                                thisController.msgCierreLlamadaTimeOut = setTimeout(function () {
                                    thisController.alertAutomaticFinish();
										clearTimeout(thisController.msgCierreLlamadaTimeOut);
								        thisController.msgCierreLlamadaTimeOut = null;
									
																	
                                }, thisController.msgCierreAutomaticoLlamada * 1000 * 60);

                            }


                            thisController.cierreLlamadaTimeOut = setTimeout(function () {
							
							//showMsgBoxAlert("Finaliza automatica:  "+delta);	
                     
						thisController.executeAutomaticFinish();
								clearTimeout(thisController.cierreLlamadaTimeOut);
								thisController.cierreLlamadaTimeOut = null;
							
                        }, thisController.cierreAutomaticoLlamada * 1000 * 60);

                        
					
						
						}
                    }
                }
                if (thisController.lastStatusAgent.toUpperCase() == "FOLLOW UP" || thisController.lastStatusAgent.toUpperCase() == "SEGUIMIENTO") {
					
					
                    if (estadoAgente.toUpperCase() == "AVAILABLE" || estadoAgente.toUpperCase() == "DISPONIBLE") {
                        cicTrace("Cierre automatico de llamada automatico por cambio de estado de agente");
                        //thisController.onAutomaticFinish();

                    } else if (app.hasLastCallExecuteManual && estadoAgente.toUpperCase() == "CAMPAIGN CALL" || estadoAgente.toUpperCase() == "LLAMADA DE CAMPAÑA") {
                        cicTrace("Se anula Timer de Cierre Automatico por Rellamada");
                        clearTimeout(thisController.msgCierreLlamadaTimeOut);
                        clearTimeout(thisController.cierreLlamadaTimeOut);
						clearTimeout(thisController.deshabilitarrediscado);
						
					 thisController.cierreLlamadaTimeOut = null;
                    }
                }
                thisController.lastStatusAgent = estadoAgente;
            }
        //}
        if (campana.estado == "break") {
										clearTimeout(thisController.deshabilitarrediscado);
								        thisController.deshabilitarrediscado = null;
										  clearTimeout(thisController.msgCierreLlamadaTimeOut);
                      
						clearTimeout(thisController.deshabilitarrediscado);
						  clearTimeout(thisController.cierreLlamadaTimeOut);
						thisController.cierreLlamadaTimeOut = null;
			
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
		
		 if (this.ultimoRediscadoCallObject != null) {
        showMsgBoxAlert("                                                En " + delta + " minutos se realizará el cierre automático de la llamada", "¡¡¡¡¡¡¡............... TIPIFIQUE este registro..............!!!!!!!               Cierre Automático CALLID:"+ this.ultimoRediscadoCallObject.id   );
   } else if(this.globalCallObject  != null){
	    showMsgBoxAlert("                                                En " + delta + " minutos se realizará el cierre automático de la llamada", "¡¡¡¡¡¡¡............... TIPIFIQUE este registro..............!!!!!!!               Cierre Automático CALLID:"+ this.globalCallObject.id      );
	   
	   }

   }
	//Incluido en 16072018
	
	,
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

        thisController.$this.find("#edNumeroLlamada").val("");
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
            if (TimerCall == 1) {
                clearTimeout(clearTimer);
            }
            thisController.$this.find("#botonera").accordion("option", { active: 0 });
            edFechaAgendar.datepicker("disable");
            speedDial.attr("disabled", "disabled");
            thisController.$this.find("#edNumeroLlamada").attr("disabled", "disabled");
            thisController.$this.find("#edAgendarHora").attr("disabled", "disabled");
            thisController.$this.find("#edAgendarMinutos").attr("disabled", "disabled");
            thisController.$this.find("#edEstadoBreak").val("Seleccione");
            thisController.ultimoEstadoBreakRequest = -1;
            thisController.callIdOriginal = -1;
            thisController.$this.find("#edObservaciones").attr("disabled", "disabled");
            thisController.conferenceDestinyConnected = false;
			enableButton(thisController.$this.find("#cmdRediscar"), true);
            thisController.$this.find("#cmdRediscar").attr("src", "img/icons/redial.png");
			
            enableButton(thisController.$this.find("#cmdRefresh"), false);
            thisController.IVRConfirmationCount = 0;
        } else if (campana.estado == "waiting") {           

            if (TimerCall == 1) {
                clearTimeout(clearTimer);
            }
            thisController.$this.find("#botonera").accordion("option", { active: 0 });
            edFechaAgendar.datepicker("disable");
            speedDial.attr("disabled", "disabled");
            thisController.$this.find("#edNumeroLlamada").attr("disabled", "disabled");
            thisController.$this.find("#edAgendarHora").attr("disabled", "disabled");
            thisController.$this.find("#edAgendarMinutos").attr("disabled", "disabled");
            thisController.$this.find("#edEstadoBreak").val("Seleccione");
            thisController.ultimoEstadoBreakRequest = -1;
            thisController.callIdOriginal = -1;
            thisController.$this.find("#edObservaciones").attr("disabled", "disabled");
            thisController.conferenceDestinyConnected = false;
            thisController.$this.find("#cmdRediscar").attr("src", "img/icons/redial.png");
			enableButton(thisController.$this.find("#cmdRediscar"), true);
            thisController.IVRConfirmationCount = 0;
        } else if (campana.estado == "break") {
		    thisController.$this.find("#edObservaciones").val("");
            
            if (TimerCall == 1) {
               clearTimeout(clearTimer);
			   clearTimeout(thisController.deshabilitarrediscado);
			    thisController.deshabilitarrediscado = null;
            }
            thisController.$this.find("#botonera").accordion("option", { active: 0 });
            edFechaAgendar.datepicker("disable");
            speedDial.attr("disabled", "disabled");
            thisController.$this.find("#edNumeroLlamada").attr("disabled", "disabled");
            thisController.$this.find("#edAgendarHora").attr("disabled", "disabled");
            thisController.$this.find("#edAgendarMinutos").attr("disabled", "disabled");
            thisController.$this.find("#edObservaciones").attr("disabled", "disabled");
            thisController.callIdOriginal = -1;
            thisController.conferenceDestinyConnected = false;
            thisController.$this.find("#cmdRediscar").attr("src", "img/icons/redial.png");
			enableButton(thisController.$this.find("#cmdRediscar"), true);
            thisController.IVRConfirmationCount = 0;
        } else if (campana.estado == "call") {
            
            thisController.conferenceDestinyCallObject = null;
            thisController.globalConferenceObject = null;
            thisController.hasFirstCreateInConference = false;
            thisController.useBackOfficeLegAsMain = true;
            thisController.hasMuted = false;
			thisController.CallIDdeConferenciaMUTE = null;
			thisController.firstDisconnect = true;
            thisController.$this.find("#botonera").accordion("option", { active: 2 });
            edFechaAgendar.datepicker("enable");
            speedDial.removeAttr("disabled");
            thisController.$this.find("#edNumeroLlamada").removeAttr("disabled");
            thisController.$this.find("#edAgendarHora").removeAttr("disabled");
            thisController.$this.find("#edAgendarMinutos").removeAttr("disabled");
            if (!thisController.requestBreak) {
                thisController.$this.find("#edEstadoBreak").val("Seleccione");
                thisController.ultimoEstadoBreakRequest = -1;
            }
            thisController.$this.find("#edObservaciones").removeAttr("disabled");
            

            if (thisController.onCampaingMode() == "predictive") {
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

            
            thisController.callIdOriginal = cicGetCallId();
            thisController.conferenceDestinyConnected = false;
            thisController.$this.find("#cmdRediscar").attr("src", "img/icons/redial.png");
			enableButton(thisController.$this.find("#cmdRediscar"), true);
			thisController.$this.find("#cmdRediscar").removeAttr("disabled");
			
            thisController.IVRConfirmationCount = 0;
        } else if (campana.estado == "preview") {
		cicTrace("Entra a  preview call" );
            TimerCall = 1;
            clearTimer = setTimeout(function () { thisController.TimerLlamada(); }, 30000);
            thisController.$this.find("#botonera").accordion("option", { active: 2 });
            edFechaAgendar.datepicker("enable");
            speedDial.attr("disabled", "disabled");
            thisController.$this.find("#edAgendarHora").removeAttr("disabled");
            thisController.$this.find("#edAgendarMinutos").removeAttr("disabled");
            if (!thisController.requestBreak) {
                thisController.$this.find("#edEstadoBreak").val("Seleccione");
                thisController.ultimoEstadoBreakRequest = -1;
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
            thisController.conferenceDestinyConnected = false;
            thisController.$this.find("#cmdRediscar").attr("src", "img/icons/redial.gif");  
			enableButton(thisController.$this.find("#cmdRediscar"), true);			
            
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
            showMsgBoxAlert("Error al intentar asignar un atributo (" + atributo + "=" + valor + ") a la grabacion: " + err + ". Si problema persiste favor contactar al Administrador de Sistemas.","");
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
		
		clearTimeout(thisController.deshabilitarrediscado);
	   

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
        
        var numero = cicGetAccLineaId();//modificado de    infoGestion.phoneNumber = cicGetNumberToDial();   16072018 

        var numeroPrefijo = 'tel:' + numero;

        thisController.ultimoRediscadoCallObject.dial(numeroPrefijo, false);            

        cicTrace("Before Setting Dialer Attributes Dialer_CampaignId and Dialer_Identity");
        thisController.ultimoRediscadoCallObject.setAttribute('Dialer_CampaignId', cicGetCampaignId());
        thisController.ultimoRediscadoCallObject.setAttribute('Dialer_Identity', cicGetI3Identity());
        //thisController.ultimoRediscadoCallObject.setAttribute('Dialer_BindingCCId', cicGet());
		
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

        if (StateId == "106" && thisController.IVRConfirmation == "PROCESSING") {
            thisController.finalizadaLlamadaIVRConfirmacion("CLIENT_DISCONNECT");
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
 var wrapUpCodesForFamilia = new Array();

       
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
                
                if (thisController.onCampaingMode() == "Preview") {
                    var result = $.grep(thisController.wrapUpCodesArray, function (wrapUpCode) {
                        return (wrapUpCode.ESTADO_FINALIZACION == "7");
                    })
                    var estado = new Object();
                    estado.value = "7";
                    estado.descripcion = "NO CONTACTADO";
                    estados.push(estado);
                }

				//Valida NUMERO CON AVAL - 8                
                if (thisController.onCampaingMode() == "preview") {
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
		
		 var wrapUpCodesForFamilia = new Array();
		     var familia = "F";
		 
		   var objectWrapUpCodesForFamilia = $.grep(thisController.wrapUpCodesArray, function (wrapUpCodeFamilia) {
            return (wrapUpCodeFamilia.familia == familia);
        });

        if (objectWrapUpCodesForFamilia.length > 0) wrapUpCodesForFamilia = objectWrapUpCodesForFamilia[0].list;
		
		
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
            case "FIJO":
                familia = "F";
                break;
            case "MOVIL":
                familia = "MO";
                break;
            case "SVA":
                familia = "S";
                break;
            case "MIGRACION":
                familia = "MI";
                break;
        }
        var parametros = {
            familia: familia
        };
        httpInvoke("GetWrapUpCodes.ges", { param: parametros }, function (list) {
            thisController.wrapUpCodesArray = list;
            thisController.loadAllWrapCodes = true;
            thisController.refreshEstadoFinalizacion();

            app.callBackFinishLoad();
            
        });
    },
    logOffCampana: function () {
        cicRequestLogoff();
    },
    getEstadoAgente: function () {
        //return this.$this.find("#edEstadoBreak option:selected").text();
        return cicGetSystemClientStatus();
    },
    TimerLlamada: function () {
        var thisController = this;
        
    
        cicPlacePreviewCall();
        thisController.hasMuted = false;
        thisController.$this.find("#cmdMudo").attr("src", "img/icons/muteOff3.png");
        TimerCall = 0;

    
    },
    cortarDestinoConferencia: function () {

        var thisController = this;

        if (thisController.globalConferenceObject != null) {
            var disconnectFromConference = false;

            try {
                var members = thisController.globalConferenceObject.startMemberIdsEnum;
            } catch (e) {
                var members = null;
            }
            if (members != null) {
                    
                var msg = "";
                msg += "BO Id: " + thisController.conferenceDestinyCallObject.id + "\n";
                msg += "MUTE ID: " + thisController.CallIDdeConferenciaMUTE + "\n";
                msg += "BO Id New: " + thisController.conferenceDestinyCallObjectAttempt.id + "\n";
                msg += "Cli Id: " + thisController.globalCallObject.id + "\n";
                msg += "Ori Id: " + thisController.callIdOriginal + "\n";
                while (members.hasMoreElements()) {
                    var memberId = members.nextElement();
                    msg += "Conference Member: " + memberId + "\n";
                    if (memberId != thisController.CallIDdeConferenciaMUTE && memberId != thisController.globalCallObject.id) {
                        thisController.globalConferenceObject.disconnectParty(memberId);
                        disconnectFromConference = true;
                    }
                }
                    
            }

            if (!disconnectFromConference) {
                if (thisController.conferenceDestinyCallObjectAttempt != null) thisController.conferenceDestinyCallObjectAttempt.disconnect();
            }
        }

                
        else {
            if (thisController.conferenceDestinyCallObjectAttempt != null) thisController.conferenceDestinyCallObjectAttempt.disconnect();
            if (thisController.conferenceDestinyCallObject != null) thisController.conferenceDestinyCallObject.disconnect();
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
    volverCliente: function () {
        var thisController = this;
        try {
            
            var findInConference = false;
            if (thisController.conferenceDestinyCallObjectAttempt != null) {
                if (thisController.globalConferenceObject != null) {
                    try {
                        var members = thisController.globalConferenceObject.startMemberIdsEnum;
                    } catch (e) {
                        var members = null;
                    }
                    if (members != null) {
                        while (members.hasMoreElements()) {
                            var memberId = members.nextElement();
                            if (memberId == thisController.conferenceDestinyCallObjectAttempt.id) {
                                findInConference = true;
                                break;
                            }
                        }
                    }
                }

                if (!findInConference) thisController.conferenceDestinyCallObjectAttempt.disconnect();

            }

            findInConference = false;

            if (thisController.conferenceDestinyCallObject != null) {
                if (thisController.globalConferenceObject != null) {
                    try {
                        var members = thisController.globalConferenceObject.startMemberIdsEnum;
                    } catch (e) {
                        var members = null;
                    }
                    if (members != null) {
                        while (members.hasMoreElements()) {
                            var memberId = members.nextElement();
                            if (memberId == thisController.conferenceDestinyCallObject.id) {
                                findInConference = true;
                                break;
                            }
                        }
                    }
                }

                if (!findInConference) thisController.conferenceDestinyCallObject.disconnect();

            }          
            
            if (thisController.CallIDdeConferenciaMUTE != null) {
                IS_Action_Pickup.CallID = thisController.CallIDdeConferenciaMUTE;
                IS_Action_Pickup.click();
            } else {
                thisController.globalCallObject.pickup();
            }            

        } catch (e) {
            showMsgBoxAlert("Se ha perdido comunicación con Cliente","");
        }
    },
    establecerConferencia: function (tipo) {

        var thisController = this;
        var response = new Object();
        response.status = true;
        response.type = ""
        response.msg = "";

        var hasInConferenceObject = thisController.CallIDdeConferenciaMUTE != null;

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
            response.msg = "Existe un error en comunicación con " + tipo + ". Favor contactar nuevamente.";
            return response;
        }

        try {
            if (thisController.globalConferenceObject == null) {
                thisController.globalConferenceObject = scripter.createConferenceObject();
            }
        } catch (ex) {
            response.status = false;
            response.type = "conference";
            response.msg = "Ha ocurrido un problema al momento de organizar la " + (tipo == "BackOffice" ? "conferencia" : " confirmación") +". Favor intentar nuevamente.";
            return response;
        }

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
            response.msg = "Se ha perdido comunicación con " + tipo + ". Favor contactar nuevamente.";
            return response;
        }

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

                if (tipo == "BackOffice") thisController.setAtributoGrabacion("ATTR_Conferencia", "S");

                return response;

            }

        } catch (ex) {
            
            thisController.conferenceDestinyConnected = false;

            thisController.disconnectConferencesParties(true);

            response.status = false;
            response.type = "clientInConference";
            response.msg = "Se ha perdido comunicación con Cliente. Favor contactar nuevamente y luego intentar establecer " + (tipo == "BackOffice" ? "conferencia." : "Confirmaación.");
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
    llamarDestino: function (numero) {
        var thisController = this;

        thisController.globalTransferenceObject = scripter.createCallObject();

        cicTrace("[Transference] Dial a Destino: " + numero);

        thisController.globalTransferenceObject.dial(numero, false);

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
	//Adicionado 16072018
 	 loadConfiguracion: function () {
		 
		   
     /*    var thisController = this;
		
		   
		    httpInvoke("GetConfiguracion.ges", {}, function (resp) {

		
 
            thisController.cierreAutomaticoLlamada = resp.cierreAutomaticoLlamada;
			
		
			
            thisController.msgCierreAutomaticoLlamada = resp.msgCierreAutomaticoLlamada;
           
			thisController.startCheckStatus();
            thisController.initializeTimer();

		
            var edFechaAgendar = thisController.$this.find("#edFechaAgendar").datepicker();
            var maximo = new Date();
            maximo.setDate(maximo.getDate() + thisController.maxDiasAgendaNormal);

            edFechaAgendar.datepicker("option", "maxDate", maximo);

            app.callBackFinishLoad("Botonera-GetConfiguracion");
        }
		
		); */
    }, 
	
	//Adicionado 16072018
	
    volverClienteTrans: function () {
        var thisController = this;

        if (thisController.globalTransferenceObject != null) {
            if (thisController.globalTransferenceObject.state != "106")
                thisController.globalTransferenceObject.disconnect();
        }

        thisController.globalTransferenceObject = null;

        cicTrace("[Transference] Volver con Cliente");

        thisController.globalCallObject.pickup();

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
    loadIVRConfirmacion: function () {
        var thisController = this;

        httpInvoke("GetIVRConfirmacion.ges", {}, function (resp) {
	   //adicionado 17072018
		  // thisController.cierreAutomaticoLlamada = resp.cierreAutomaticoLlamada;
				
         //   thisController.msgCierreAutomaticoLlamada = resp.msgCierreAutomaticoLlamada;
           
		//	thisController.startCheckStatus();
        //    thisController.initializeTimer();

		
		//adicionado17072018
		
            thisController.IVRMaximoEjecucionesConfirmation = resp.maxEjecucionesIVRConfirmacionVenta;
            thisController.IVRDNISAudioAgente = resp.dnisAudioAgenteIVRConfirmacionVenta;

            app.callBackFinishLoad("Botonera-GetIVRConfirmacion");
        });
    },
    finalizarPorLLamadaCaida: function () {
        var thisController = this;
	clearTimeout(thisController.deshabilitarrediscado);
			clearTimeout(thisController.deshabilitarrediscado);	
										clearTimeout(thisController.msgCierreLlamadaTimeOut);
											clearTimeout(thisController.cierreLlamadaTimeOut);
											
								    thisController.deshabilitarrediscado = null;
									  clearTimeout(thisController.cierreLlamadaTimeOut);
						thisController.cierreLlamadaTimeOut = null;
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

        var msgDesconexionAgente = "Estimado ejecutivo se ha desconectado su estación. Favor verificar correcta conexión de ésta.";

        if (type == "CLIENT_DISCONNECT") {
            thisController.IVRConfirmation = "INTERRUPTED";
            if (thisController.agentDisconnectConfirmation) showMsgBoxAlert(msgDesconexionAgente, "Confirmación de Venta");
            msg = "Se ha desconectado el cliente durante la validación de Confirmación de Venta.";
            showMsgBoxAlert(msg, "Confirmación de Venta");
            thisController.cancelarLLamadasDesdeConferencia();
        } else if (type == "IVR_DISCONNECT") {
            thisController.IVRConfirmationCount++;
            thisController.IVRConfirmation = "SUCCESS";
            if (thisController.agentDisconnectConfirmation) showMsgBoxAlert(msgDesconexionAgente, "Confirmación de Venta");
            msg = "Confirmación de Venta Finalizada.";
            showMsgBoxInfo(msg, "Confirmación de Venta");
            cicPickup(thisController.CallIDdeConferenciaMUTE);
            cicMute(thisController.CallIDdeConferenciaMUTE);
        } else if (type == "IVR_DISCONNECT_ERROR") {
            thisController.IVRConfirmation = "ERROR_IVR_DISCONNECT";
            if (thisController.agentDisconnectConfirmation) showMsgBoxAlert(msgDesconexionAgente, "Confirmación de Venta");
            msg = "Se ha desconectado el IVR de Confirmación de Venta.";
            showMsgBoxAlert(msg, "Confirmación de Venta");           
            cicPickup(thisController.CallIDdeConferenciaMUTE);
            cicMute(thisController.CallIDdeConferenciaMUTE);
        } else {
            thisController.IVRConfirmation = "ERROR";
            if (thisController.agentDisconnectConfirmation) showMsgBoxAlert(msgDesconexionAgente, "Confirmación de Venta");
            msg = "Ha ocurrido un error y se ha interrumpido la Confirmación de Venta.";
            showMsgBoxAlert(msg, "Confirmación de Venta");
            cicPickup(thisController.CallIDdeConferenciaMUTE);
            cicMute(thisController.CallIDdeConferenciaMUTE);
        }
        thisController.IVRCallObject = null;
        thisController.AgentCallObjectInConfirmation = null;
        thisController.agentDisconnectConfirmation = false;
        cicTrace("Confirmación de Venta Finalizada con " + thisController.IVRConfirmation + ". Msg: " + msg);
    },
    llamarDNISAudioAgente: function (numero) {
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
        newCallObjectAudioAgente.dial(numero, false);

        thisController.audioAgenteCallObject = newCallObjectAudioAgente;

    },
    
};