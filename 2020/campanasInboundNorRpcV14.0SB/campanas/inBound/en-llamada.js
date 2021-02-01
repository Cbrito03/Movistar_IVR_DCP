var controller = {
    $this: null,
    onBackLoadingComplete: null,
    clienteController: null,    
    cierreController: null,
    onGetLlamadaConectada: null,
    onSetAtributoGrabacion: null,
    regionesComunasArray: null,
    onGetMetaDataObject: null,
    onGetMaxDiasAgenda: null,
    init: function (container, options) {
        this.$this = $(container.children()[0]);
        var thisController = this;
        var tabs = thisController.$this.find("#tabs").tabs();
        
        initializeTabsLayout(tabs);

        whenAutoloadReady("al-cliente", function () {
            cicTrace("whenAutoloadReady cliente");
            thisController.clienteController = thisController.$this.find("#al-cliente").data("controller");
            thisController.clienteController.onGetRegionesComunaArray = function () { return thisController.regionesComunasArray; }
            thisController.clienteController.onGetMetaDataObject = function () { return thisController.onGetMetaDataObject(); }
            thisController.checkActualiceRegionComunas();
            thisController.onBackLoadingComplete();
        });
        
        whenAutoloadReady("al-cierre", function () {
            cicTrace("whenAutoloadReady cierre");
            thisController.cierreController = thisController.$this.find("#al-cierre").data("controller");
            thisController.cierreController.getCliente = function () { return thisController.getCliente(); }
            thisController.cierreController.getLlamadaConectada = function () { return thisController.onGetLlamadaConectada(); }
            thisController.cierreController.onSetAtributoGrabacion = function (atributo, valor) { thisController.onSetAtributoGrabacion(atributo, valor); }
            thisController.cierreController.onGetRegionesComunaArray = function () { return thisController.regionesComunasArray; }
            thisController.checkActualiceRegionComunas();
            thisController.onBackLoadingComplete();
        });
        whenAutoloadReady("al-ReferredCalls", function () {
            cicTrace("whenAutoloadReady ReferredCalls");
            thisController.referredController = thisController.$this.find("#al-ReferredCalls").data("controller");
            thisController.referredController.onGetMaxDiasAgenda = function () { return thisController.onGetMaxDiasAgenda(); }
            thisController.referredController.onGetMetaDataObject = function () { return thisController.onGetMetaDataObject(); }
            thisController.onBackLoadingComplete();
        });
        whenAutoloadReady("al-ScheduledCallbacks", function () {
            cicTrace("whenAutoloadReady ScheduledCallbacks");
            thisController.schedulerController = thisController.$this.find("#al-ScheduledCallbacks").data("controller");
            thisController.schedulerController.onGetMaxDiasAgenda = function () { return thisController.onGetMaxDiasAgenda(); }
            thisController.schedulerController.onGetMetaDataObject = function () { return thisController.onGetMetaDataObject(); }
            thisController.onBackLoadingComplete();
        });

        thisController.getInfoRegionComunas();
    },
    refresca: function () {
        var thisController = this;
        cicTrace("EnLlamada Inicio Refresca");
        thisController.$this.find("#tabs").tabs({ active: 0 });

        thisController.clienteController.refresca();
        thisController.cierreController.refresca();

        thisController.referredController.refresca();
        thisController.schedulerController.refresca();

        thisController.onSetAtributoGrabacion("ATTR_Nombre_Campana", cicGetCampaignName());
        thisController.onSetAtributoGrabacion("ATTR_CUARTIL", cicGetCuartil());
        thisController.onSetAtributoGrabacion("ATTR_RUT_Cliente", cicGetCliRutConDV());
        thisController.onSetAtributoGrabacion("ATTR_CORRELACION", cicGetCallId());
        var esReferido = "N";
        if (cicGetCallArchivo() == "Manual Referido") {
            esReferido = "S";
        }
        thisController.onSetAtributoGrabacion("ATTR_REFERIDO", esReferido);

        cicTrace("EnLlamada Fin Refresca");
    },
    getCliente: function () {
        return this.clienteController.getCliente();
    },
    resetTabs: function () {
        var indexActual = this.$this.find("#tabs").tabs('option', 'active');
        this.$this.find("#tabs").tabs({ active: 0 }); //Cliente
        this.clienteController.setActiveTabs(0); //Datos Basicos Cliente
         this.$this.find("#tabs").tabs({ active: 3 }); //Cierre
        this.cierreController.setActiveTabs(0); //Ficha Cierre
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
            this.cierreController.initializeRegionComuna();
        }
    }
};