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
    idGrupoVentaNoTrio: "2",
    infoConfigConvergencia: null,
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
                thisController.finalizar();
                return true;
            }
        });

        var mainArea = this.$this.find("#mainArea").zPager({
            pages: [
                { code: "waiting", url: "campanas/common/esperando-llamada", initial: campana.estado == "waiting" || campana.estado == "initializing" },
                { code: "break", url: "campanas/common/en-break", initial: campana.estado == "break" },
                { code: "call", url: "campanas/recuperoWebMovil/en-llamada", initial: (campana.estado == "call" || campana.estado == "preview") }
            ],
            onReady: function () {

                httpInvoke("getConfigConvergencia.ges", {}, function (resp) {
                    thisController.infoConfigConvergencia = resp;
                    app.callBackFinishLoad("Main-getConfigConvergencia-Success");
                }, function () {
                    thisController.infoConfigConvergencia = null;
                    app.callBackFinishLoad("Main-getConfigConvergencia-Error");
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
            thisController.botoneraController.loadWrapUpCodes("RW-MOVIL");
            thisController.botoneraController.loadSpeedDialList();
            thisController.botoneraController.loadMaxDiasAgenda();

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
                return thisController.callController.cierreController.getRutCliente();
            }

            thisController.botoneraController.onRefrescaBreak = function () {
                thisController.breakController.refresca();
            }
            
            thisController.inicializaHeaderBotonera();

        });

        cicAddListener("PreviewDataPop", function () {
            cicTrace("PreviewDataPop Event");
            campana.estado = "preview";
            app.lastCallType = "preview";
            var callObject = scripter.callObject;
            thisController.loadingToCall(callObject);
        });

        cicAddListener("NewPreviewCall", function () {
            cicTrace("NewPreviewCall Event");
            campana.estado = "call";
            app.lastCallType = "preview";
            var callObject = scripter.callObject;
            thisController.loadingToCall(callObject);
        });
        
        cicAddListener("NewPredictiveCall", function () {
            cicTrace("NewPredictiveCall Event");
            campana.estado = "call";
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
        thisController.idGestion = -1;
        thisController.intentosEnviarBO = 0;
        thisController.botoneraController.refresca();
        if (campana.estado == "call") {
            
            mainArea.zPager("currentPage", "call");
            cicStage("0");
            thisController.headerController.refresca(false);
            if (app.lastCallType == "predictive") {
                thisController.callController.refresca();
                cicSetForeground();
                cicSelectPage();
            }
            
        }
        if (campana.estado == "break") {
            
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
            
            mainArea.zPager("currentPage", "waiting");

            if (thisController.botoneraController.requestBreak) {
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
                cicClientStatus("Available");
            } else {
                cicTrace("Espera carga de otras campañas. Estado Actual: " + cicGetSystemClientStatus());
            }

        }
        if (campana.estado == "preview") {
            
            mainArea.zPager("currentPage", "call");
            thisController.headerController.refresca(false);
            thisController.callController.refresca();
            cicSetForeground();
            cicSelectPage();
            
        }

        if (campana.estado == "initializing") {
            thisController.headerController.refresca();            
            cicSetForeground();
            cicSelectPage();
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
    finalizar: function () {
        var thisController = this;
        cicTrace("Finalizar en " + campana.estado);
        if (campana.estado == "waiting" || campana.estado == "break") {
            thisController.botoneraController.setAgentStatus("6"); //Fin Turno
            thisController.botoneraController.logOffCampana();
        }

        if (campana.estado == "call" || campana.estado == 'preview') {

            var codFinalizacion = thisController.botoneraController.getCodigoFinalizacion();
            cicTrace("Finalizar - CodFinalizacion '" + codFinalizacion + "'");
            if (codFinalizacion == null || codFinalizacion == "Seleccione") {
                showMsgBoxAlert("Debe seleccionar un código de finalización","Validación Codigo de Finalización");
                return;
            }

            var finalizaConVenta = false;

            var estadoFinalizacion = thisController.botoneraController.getEstadoFinalizacion();

            if (estadoFinalizacion == thisController.idGrupoVenta || estadoFinalizacion == thisController.idGrupoVentaNoTrio) {
                finalizaConVenta = true;
            }

            var fechaAgendada;
            if (estadoFinalizacion == thisController.idGrupoAgenda) {
                try {
                    fechaAgendada = thisController.botoneraController.getInfoAgendamiento();
                } catch (e) {
                    showMsgBoxAlert(e, "Validación Fecha Agendamiento");
                    cicTrace("[Main][Finalizar] Error fecha Agendada: " + e);
                    return;
                }
            }

            var info = thisController.getDataGestion(finalizaConVenta);

            if (info) {

                if (info.infoGestion.sxbObservaciones) {
                    var observacionLength = info.infoGestion.sxbObservaciones.length;
                    if (observacionLength > 600) {
                        showMsgBoxAlert("Excedió largo permitido para la observación", "Validación Observación");
                        return;
                    }
                }

  
                if (info.infoGestion.despReferencia) {
                    var referenciaLength = info.infoGestion.despReferencia.length;
                    if (referenciaLength > 200) {
                        showMsgBoxAlert("Excedió largo permitido para la referencia de la dirección", "Validación Referencia Dirección")
                        return;
                    }
                }
            }

            cicTrace("[Main][Finalizar] info: " + info);

            if (info != null) {

                var cmdFinalizar = thisController.$this.find("#cmdFinalizar").button();
                enableButton(cmdFinalizar, false);

                if (estadoFinalizacion == thisController.idGrupoAgenda) {

                    info.infoGestion.table = cicGetSbxGenerico1();
                    info.infoGestion.cuartil = "AGENDADO";
                    info.infoGestion.Agendamiento = thisController.dateTime2Object(fechaAgendada);
                    info.infoGestion.generico15 = cicGetSystemAgentId();
                    info.infoGestion.campaigname = cicGetCampaignName();
                    info.infoGestion.agent = cicGetSystemAgentId();
                    
                    var obsCtl = info.infoGestion.sxbObservaciones;

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
                        enableButton(cmdFinalizar, true);
                    },
                    false,
                    5000);

                } else {
                    cicTrace("[recuperoMovil][finaliza] Antes de invocar SegundaParteFinalizar");
                    thisController.SegundaParteFinalizar(info, estadoFinalizacion, codFinalizacion, fechaAgendada, cmdFinalizar);
                    cicTrace("[recuperoMovil][finaliza] Despues de invocar SegundaParteFinalizar");
                }
                

            }
        }
    },
    SegundaParteFinalizar: function (info, estadoFinalizacion, codFinalizacion, fechaAgendada, cmdFinalizar) {
        cicTrace("[recuperoFijo][SegundaParteFinalizar] Inicio");
        var thisController = this;       

        var tieneConvergencia = info.InfoConvergencia.checkConvergencia;
        var infoPersonalesConv = thisController.callController.convergenciaController.getInfoConvergencia();

        if (tieneConvergencia == 1) {

            var infoGestionConvergencia = new Object();
            var gestionConvergencia = info.InfoConvergencia;
            var gestionInfo = info.infoGestion;

            gestionInfo.cliRutConDv = infoPersonalesConv.rutCli;
            gestionInfo.cliContacAlter = infoPersonalesConv.fono2Cli;
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
        
        

        if (estadoFinalizacion == thisController.idGrupoAgenda) {

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
        }else {
            var completeData = {
                wrapupcode: codFinalizacion
            };
        }

        cicCallComplete(completeData);
        
        cicTrace("CallID to Finish: " + thisController.botoneraController.globalCallObject.id);
        cicTrace("StateCall to Finish: " + thisController.botoneraController.globalCallObject.state);
        cicTrace("ScripterCallObject.Id to Finish: " + scripter.callObject.id);

        var rutCliente = info.infoGestion.cliRutConDv;

        if (rutCliente) thisController.botoneraController.setAtributoGrabacion("ATTR_RUT_Cliente", rutCliente);       

        if (thisController.botoneraController.isTransferExecute) {
            thisController.botoneraController.globalCallObject.id = -1;
            thisController.botoneraController.globalCallObject = null;
        } else {
            thisController.botoneraController.globalCallObject.disconnect();
        }


        thisController.callController.resetTabs();

        
        if (thisController.botoneraController.requestBreak) {
            thisController.goToBreak();
        } else {
            campana.estado = "waiting";
            thisController.cambioEstado();
        }

        cicTrace("Finaliza Proceso Finalizacion");
    },
    getDataGestion: function (esVenta) {
        var thisController = this;

        var infoCierre = new Object();
        var infoCliente = new Object();

        var observaciones = "";
        var estadoFinalizacion = "";
        estadoFinalizacion = thisController.botoneraController.getEstadoFinalizacion();
        observaciones = thisController.botoneraController.getObservaciones();

        var convergencia = thisController.callController.convergenciaController.checkConvergencia();
        var InfoConvergencia = new Object();
        InfoConvergencia = convergencia;

        if (esVenta) {

            infoCierre = thisController.callController.cierreController.getInfoCierre();

            var descFinalizacion = thisController.botoneraController.getCodigoFinalizacionDesc();

            //Validar Info            
            var msg = "";
            if (!infoCierre.infoCliente.nombre) {
                msg += "En la Ficha de Cierre 'Nombre y Apellidos' es obligatorio <br>";
            }

            if (!infoCierre.infoCliente.rut) {
                msg += "En la Ficha de Cierre 'Rut' es obligatorio <br>";
            }

            if (!infoCierre.infoCliente.serieRut) {
                msg += "En la Ficha de Cierre '# Serie' es obligatorio <br>";
            }

            if (!infoCierre.infoCliente.fechaNacimiento) {
                msg += "En la Ficha de Cierre 'Fecha Nacimiento' es obligatorio <br>";
            }

            if (!infoCierre.infoCliente.fono1) {
                msg += "En la Ficha de Cierre 'Fono Contacto 1' es obligatorio <br>";
            }

            if (!infoCierre.infoCliente.fono2) {
                msg += "En la Ficha de Cierre 'Fono Contacto 2' es obligatorio <br>";
            }

            if (!infoCierre.infoCliente.email) {
                msg += "En la Ficha de Cierre 'Email' es obligatorio <br>";
            }

            //Dirección Particular

            if (!infoCierre.infoCliente.calle) {
                msg += "En la Ficha de Cierre 'Calle' es obligatorio <br>";
            }

            if (!infoCierre.infoCliente.numero) {
                msg += "En la Ficha de Cierre 'Número' es obligatorio <br>";
            }

            if (!infoCierre.infoCliente.entreCalle) {
                msg += "En la Ficha de Cierre 'Entre Calles' es obligatorio <br>";
            }

            if (!infoCierre.infoCliente.region) {
                msg += "En la Ficha de Cierre 'Región' es obligatorio <br>";
            }

            if (!infoCierre.infoCliente.comuna) {
                msg += "En la Ficha de Cierre 'Comuna' es obligatorio <br>";
            }

            //Observaciones
            if ($.trim(observaciones).length == 0) {
                msg += "Debe ingresar el detalle de la venta en 'Observaciones'<br>";
            }

            
            if (msg.length > 0) {

                var msgHeight = thisController.getHeightMessage(msg);

                showMsgBoxAlert(msg, "Validación de Información Cliente", msgHeight);
                return null;
            }

            //General 

            //Valida al menos una venta registrada
            if (!infoCierre.infoFolios.ventasFijo && !infoCierre.infoFolios.ventasSVA && !infoCierre.infoFolios.ventasMigraciones && !infoCierre.infoFolios.ventasMovil && !infoCierre.infoFolios.ventaOferta1 && !infoCierre.infoFolios.ventaOferta2) {
                msg += "En la Ficha de Cierre debe seleccionar venta de un producto y/o una oferta<br>";
                showMsgBoxAlert(msg, "Validación de Información Venta");
                return null;
            }

            //Fijo
            if (infoCierre.infoFolios.ventasFijo) {
                if (infoCierre.infoFolios.mixVenta == "-1") {
                    msg += "En la Ficha de Cierre debe seleccionar 'Mix Venta'<br>";
                }
            }

            //Movil
            if (infoCierre.infoFolios.ventasMovil) {

                if (!infoCierre.infoFolios.vendeAltaConEquipo && !infoCierre.infoFolios.vendeAltaSinEquipo && !infoCierre.infoFolios.vendePortaConEquipo && !infoCierre.infoFolios.vendePortaSinEquipo && !infoCierre.infoFolios.vendeBAM) {
                    msg += "En la Ficha de Cierre debe seleccionar al menos un 'Producto Móvil'<br>";
                } else {
                    if (!infoCierre.infoFolios.altoValor && !infoCierre.infoFolios.medioValor && !infoCierre.infoFolios.bajoValor) {
                        msg += "En la Ficha de Cierre debe seleccionar un 'Tipo de Producto'<br>";
                    }
                }

                if (infoCierre.infoFolios.vendeAltaConEquipo) {
                    if (infoCierre.infoFolios.cantidadAltaConEquipo == "") {
                        msg += "En la Ficha de Cierre debe ingresar cantidad para 'Alta Con Equipo'<br>";
                    }
                }

                if (infoCierre.infoFolios.vendeAltaSinEquipo) {
                    if (infoCierre.infoFolios.cantidadAltaSinEquipo == "") {
                        msg += "En la Ficha de Cierre debe ingresar cantidad para 'Alta Sin Equipo'<br>";
                    }
                }

                if (infoCierre.infoFolios.vendePortaConEquipo) {
                    if (infoCierre.infoFolios.cantidadPortaConEquipo == "") {
                        msg += "En la Ficha de Cierre debe ingresar cantidad para 'Porta Con Equipo'<br>";
                    }
                }

                if (infoCierre.infoFolios.vendePortaSinEquipo) {
                    if (infoCierre.infoFolios.cantidadPortaSinEquipo == "") {
                        msg += "En la Ficha de Cierre debe ingresar cantidad para 'Porta Sin Equipo'<br>";
                    }
                }

                if (infoCierre.infoFolios.vendeBAM) {
                    if (infoCierre.infoFolios.cantidadBAM == "") {
                        msg += "En la Ficha de Cierre debe ingresar cantidad para 'BAM'<br>";
                    }
                }
            }
      
            if (msg.length > 0) {

                var msgHeight = thisController.getHeightMessage(msg);

                showMsgBoxAlert(msg, "Validación de Información Venta", msgHeight);
                return null;
            }

        } else {

            infoCliente = thisController.callController.clienteController.getCliente();

            if (estadoFinalizacion == thisController.idGrupoAgenda) {
                //Validar Info Agenda          
                var msg = "";
                if (!infoCliente.nombreCli) {
                    msg += "Debe ingresar 'Nombre de Cliente' en 'Datos Básicos del Cliente'<br>";
                }

                if (!infoCliente.rutCli) {
                    msg += "Debe ingresar 'Rut' en 'Datos Básicos del Cliente'<br>";
                }

                if (msg.length > 0) {
                    showMsgBoxAlert(msg, "Validación de Información Agenda");
                    return null;
                }
            }

        }


        var infoRequest = new Object();
        var infoGestion = new Object();

        infoGestion.esVenta = esVenta;

        var idObs = -1;


        var obsCtl = cicGetSbxObservaciones();
        idObs = parseInt(obsCtl);
        if (isNaN(idObs)) {
            idObs = -1;
        }

        infoGestion.idObs = idObs;

        infoGestion.callRegId = cicGetCallRegId();
       
        infoGestion.fbackFinalizacionCod = thisController.botoneraController.getCodigoFinalizacion();
        infoGestion.fbackFinalizacionDesc = thisController.botoneraController.getCodigoFinalizacionDesc();

        if (estadoFinalizacion == thisController.idGrupoVenta || estadoFinalizacion == thisController.idGrupoVentaNoTrio) {
            infoGestion.idUltimoEstado = "2"; //Venta
        } else {
            infoGestion.idUltimoEstado = "3";
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
        infoGestion.accArg2Id = "";
        infoGestion.accArg3Id = "";
        infoGestion.accPreg1 = "";
        infoGestion.accResp1 = "";
        infoGestion.accPreg2 = "";
        infoGestion.accResp2 = "";
        infoGestion.accScore = "";
        infoGestion.cliId = cicGetCliId();
        infoGestion.cliRutConDv = (esVenta ? infoCierre.infoCliente.rut : infoCliente.rutCli);
        infoGestion.cliNombre = (esVenta ? infoCierre.infoCliente.nombre : infoCliente.nombreCli);
        infoGestion.cliSegmento = "";
        infoGestion.cliGse = "";
        infoGestion.cliAntiguedad = "";
        infoGestion.cliLineaAntiguedad = "";
        infoGestion.cliCicloCod = "";
        infoGestion.cliIndPortado = "";
        infoGestion.cliUltBoletaMonto = "";
        infoGestion.cliContacAlter = (esVenta ? infoCierre.infoCliente.fono1 : infoCliente.fono1Cli);
        infoGestion.cliContacAlterFijo = (esVenta ? infoCierre.infoCliente.fono2 : infoCliente.fono2Cli);
        infoGestion.cliContacAlterMovil = (esVenta ? infoCierre.infoCliente.fono3 : infoCliente.fono3Cli);
        infoGestion.cliNumSerie = (esVenta ? infoCierre.infoCliente.serieRut : infoCliente.serieCli);
        infoGestion.cliNotificar = (esVenta ? infoCierre.infoCliente.notificar : infoCliente.notificarCli) ? "1" : "0";
        infoGestion.webEmail = (esVenta ? infoCierre.infoCliente.email : infoCliente.emailCli);
        infoGestion.fechaNacimiento = (esVenta ? infoCierre.infoCliente.fechaNacimiento : infoCliente.fechaNacimientoCli);

        infoGestion.prodVigDesc = "";
        infoGestion.prodVigPrecio = "";
        infoGestion.prodVigFinPromo = "";
        infoGestion.dirCalle = (esVenta ? infoCierre.infoCliente.calle : infoCliente.calleCli);
        infoGestion.dirNro = (esVenta ? infoCierre.infoCliente.numero : infoCliente.numeroCli);
        infoGestion.dirPiso = (esVenta ? infoCierre.infoCliente.piso : infoCliente.pisoCli);
        infoGestion.dirDepto = (esVenta ? infoCierre.infoCliente.depto : infoCliente.deptoCli);
        infoGestion.dirComuna = (esVenta ? infoCierre.infoCliente.comuna : infoCliente.comunaCli);
        infoGestion.dirCiudad = "";
        infoGestion.dirRegion = (esVenta ? infoCierre.infoCliente.region : infoCliente.regionCli);
        infoGestion.dirEntreCalles = (esVenta ? infoCierre.infoCliente.entreCalle : infoCliente.entreCalleCli);
        infoGestion.dirYCalles = (esVenta ? infoCierre.infoCliente.yCalle : infoCliente.yCalleCli);
        infoGestion.oferP1Cod = "";
        infoGestion.oferP1Desc = cicGetOferP1Desc();
        infoGestion.oferP1Precio = cicGetOferP1Precio();
        infoGestion.oferP1Delta = "";

        var vendido = "0";
        var cantidad = "0";

        if (esVenta) {
            if (infoCierre.infoFolios.ventaOferta1) {
                vendido = "1";
                var oferta = cicGetOferP1Desc();
                cantidad = (oferta.toUpperCase().indexOf("TRIO") > -1 ? "3" : (oferta.toUpperCase().indexOf("DUO") > -1 ? "2" : "1"));
            }
        }

        infoGestion.oferP1Vendido = vendido;
        infoGestion.oferP1Cantidad = cantidad;
        infoGestion.oferP2Cod = "";
        infoGestion.oferP2Desc = cicGetOferP2Desc();
        infoGestion.oferP2Precio = ""
        infoGestion.oferP2Delta = "";

        var vendido = "0";
        var cantidad = "0";

        if (esVenta) {
            if (infoCierre.infoFolios.ventaOferta2) {
                vendido = "1";
                var oferta = cicGetOferP2Desc();
                cantidad = (oferta.toUpperCase().indexOf("TRIO") > -1 ? "3" : (oferta.toUpperCase().indexOf("DUO") > -1 ? "2" : "1"));
            }
        }

        infoGestion.oferP2Vendido = vendido;
        infoGestion.oferP2Cantidad = cantidad;
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
        infoGestion.ventaProdCod = "";
        infoGestion.ventaSistemaId = "";
        infoGestion.ventaOossCod = "";
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
        infoGestion.generico19 = thisController.botoneraController.isTransferExecute ? "Transfer" : "";

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

        var callIdOriginal = thisController.botoneraController.callIdOriginal;

        //i3Callid        
        infoGestion.i3Callid = callIdOriginal;

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

        infoGestion.destinoLogistico = "";
        infoGestion.movSucursal = "";

        infoGestion.webNumAtencionCamaleon = "";
        infoGestion.webDireccion = ""


        if (estadoFinalizacion == thisController.idGrupoAgenda) {
            var fechaAgendada = thisController.botoneraController.getInfoAgendamiento();
            infoGestion.fechaAgendamiento = thisController.dateTime2Object(fechaAgendada);
            infoGestion.Agendamiento = thisController.dateTime2Object(fechaAgendada);
            infoGestion.cuartil = cicGetSystemAgentId();
        } else {
            infoGestion.fechaAgendamiento = "";
            infoGestion.cuartil = cicGetCuartil();
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
        infoGestion.svaViaCertificacion = "";
        infoGestion.i3Userid = cicGetSystemAgentId();
        infoGestion.i3Campaignname = cicGetCampaignName();
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
        infoGestion.folioSiglo = "";
        infoGestion.folioUnifica = "";
        infoGestion.folioOl = "";
        infoGestion.folioMulticanalidad = "";

        infoGestion.sxbReferido = cicGetSbxReferido();
        infoGestion.sxbGenerico1 = cicGetSbxGenerico1();

        infoRequest.infoGestion = infoGestion;
        infoRequest.InfoConvergencia = convergencia;

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
                infoPreventa.idMixPreventa = ""; infoPreventa.canal = "";
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