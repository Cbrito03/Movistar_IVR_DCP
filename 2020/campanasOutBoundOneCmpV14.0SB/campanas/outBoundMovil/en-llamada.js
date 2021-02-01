var controller = {
    $this: null,
    onBackLoadingComplete: null,
    clienteController: null,
    ofertaController: null,
    gestionVentaController: null,
    datosAdicionalesController: null,
    cierreController: null,
    convergenciaController: null,
    referredController: null,
    schedulerController: null,
    onGetLlamadaConectada: null,
    onSwitchOffEnviadoBO: null,
    onSetAtributoGrabacion: null,
    onBackLoadingComplete: null,
    onBackGetDisplayConvergencia: null,
    regionesComunasArray: null,
    init: function (container, options) {
        this.$this = $(container.children()[0]);
        var thisController = this;
        var tabs = thisController.$this.find("#tabs").tabs();
        
        initializeTabsLayout(tabs);
        
        if (cicGetSbxConvergencia() == 1 || cicGetSbxConvergencia() == null) {
            thisController.$this.find("#liConvergencia").hide();
        } else {
            thisController.$this.find("#liConvergencia").show();
        }

        whenAutoloadReady("al-cliente", function () {
            cicTrace("whenAutoloadReady cliente");
            thisController.clienteController = thisController.$this.find("#al-cliente").data("controller");
	        thisController.clienteController.onGetRegionesComunaArray = function () { return thisController.regionesComunasArray; }
	        thisController.checkActualiceRegionComunas();
            thisController.onBackLoadingComplete();
        });
        whenAutoloadReady("al-oferta", function () {
            cicTrace("whenAutoloadReady oferta");
            thisController.ofertaController = thisController.$this.find("#al-oferta").data("controller");
            thisController.onBackLoadingComplete();
        });
        whenAutoloadReady("al-gestionVenta", function () {
            cicTrace("whenAutoloadReady gestionVenta");
            thisController.gestionVentaController = thisController.$this.find("#al-gestionVenta").data("controller");
            thisController.gestionVentaController.loadWSData();
            thisController.onBackLoadingComplete();
        });
        whenAutoloadReady("al-datosAdicionales", function () {
            cicTrace("whenAutoloadReady datosAdicionales");
            thisController.datosAdicionalesController = thisController.$this.find("#al-datosAdicionales").data("controller");
            thisController.onBackLoadingComplete();
        });
        whenAutoloadReady("al-cierre", function () {
            cicTrace("whenAutoloadReady cierre");
            thisController.cierreController = thisController.$this.find("#al-cierre").data("controller");
            thisController.cierreController.loadWSData();
            //thisController.cierreController.checkConvergencia();
            thisController.cierreController.getCliente = function () { return thisController.getCliente(); }
            thisController.cierreController.getProductosOferta = function () { return thisController.getProductosOferta(); }
            thisController.cierreController.getDatosOferta = function () { return thisController.getDatosOferta(); }
            thisController.cierreController.getDatosVenta = function () { return thisController.getDatosVenta(); }
            thisController.cierreController.getProductosVenta = function () { return thisController.getProductosVenta(); }
            thisController.cierreController.getLlamadaConectada = function () { return thisController.onGetLlamadaConectada(); }
            thisController.cierreController.switchOffEnviadoBO = function () { thisController.onSwitchOffEnviadoBO(); }
            thisController.cierreController.onSetAtributoGrabacion = function (atributo, valor) { thisController.onSetAtributoGrabacion(atributo, valor); }
            thisController.onBackLoadingComplete();
        });
        whenAutoloadReady("al-convergencia", function () {
            cicTrace("whenAutoloadReady convergencia");
            thisController.convergenciaController = thisController.$this.find("#al-convergencia").data("controller");
            thisController.convergenciaController.getCliente = function () { return thisController.getCliente(); }
            thisController.onBackLoadingComplete();
        });
        whenAutoloadReady("al-ReferredCalls", function () {
            cicTrace("whenAutoloadReady ReferredCalls");
            thisController.referredController = thisController.$this.find("#al-ReferredCalls").data("controller");
            thisController.referredController.onGetMaxDiasAgenda = function () { return thisController.onGetMaxDiasAgenda(); }
            thisController.onBackLoadingComplete();
        });
        whenAutoloadReady("al-ScheduledCallbacks", function () {
            cicTrace("whenAutoloadReady ScheduledCallbacks");
            thisController.schedulerController = thisController.$this.find("#al-ScheduledCallbacks").data("controller");
            thisController.schedulerController.onGetMaxDiasAgenda = function () { return thisController.onGetMaxDiasAgenda(); }
            thisController.onBackLoadingComplete();
        });
	thisController.getInfoRegionComunas();
    },
    refresca: function () {
        var thisController = this;
        
        cicTrace("EnLlamada Inicio Refresca");
        thisController.$this.find("#tabs").tabs({ active: 0 });
        thisController.clienteController.refresca();
        thisController.ofertaController.refresca();
        thisController.gestionVentaController.refresca();
        thisController.datosAdicionalesController.refresca();
        thisController.cierreController.refresca();
        thisController.convergenciaController.refresca();
        thisController.referredController.refresca();
        thisController.schedulerController.refresca();

        if ((thisController.onBackGetDisplayConvergencia != null && !thisController.onBackGetDisplayConvergencia(cicGetCallPaisId(), cicGetCallCallCenterId())) || cicGetSbxConvergencia() == 1 || cicGetSbxConvergencia() == null) {
            thisController.$this.find("#liConvergencia").hide();
        } else {
            thisController.$this.find("#liConvergencia").show();
        }

        thisController.onSetAtributoGrabacion("ATTR_Nombre_Campana", cicGetCampaignName());
        thisController.onSetAtributoGrabacion("ATTR_CUARTIL", cicGetCuartil());
        thisController.onSetAtributoGrabacion("ATTR_RUT_Cliente", cicGetCliRutConDV());
        thisController.onSetAtributoGrabacion("ATTR_CORRELACION", cicGetCallId());
        var esReferido = "N";
        if (cicGetCallArchivo() == "Manual Referido"){
            esReferido = "S";
        }
        thisController.onSetAtributoGrabacion("ATTR_REFERIDO", esReferido);

        cicTrace("EnLlamada Fin Refresca");
    },
    getCliente: function () {
        return this.clienteController.getCliente();
    },
    getProductosOferta: function () {
        return this.ofertaController.getProductosOferta();
    },
    getProductosVenta: function () {
        return this.gestionVentaController.getProductosVenta();
    }, 
    getDatosOferta: function () {
        return this.ofertaController.getDatosOferta();
    },
    getDatosVenta: function () {
        return this.gestionVentaController.getDatosVenta();
    },
    resetTabs: function () {
        var indexActual = this.$this.find("#tabs").tabs('option', 'active');
        this.$this.find("#tabs").tabs({ active: 0 });
        this.clienteController.setActiveTabs(0);
        this.$this.find("#tabs").tabs({ active: 4 });
        this.cierreController.setActiveTabs(0);
        this.$this.find("#tabs").tabs({ active: indexActual });
    },
    getInfoRegionComunas: function () {
        var thisController = this;

        httpInvoke("GetRegionesComunas.ges", {}, function (list) {

            thisController.regionesComunasArray = list;

            thisController.checkActualiceRegionComunas();

            app.callBackFinishLoad("EnLLamada-GetRegionesComunas");
        });
    },
    checkActualiceRegionComunas: function () {
       
        if (this.regionesComunasArray == null) return;

        if (this.clienteController != null) {
            this.clienteController.initializeRegionComuna();
        }
        
        if (this.cierreController != null) {
           // this.cierreController.initializeRegionComuna();
        }
    }
};