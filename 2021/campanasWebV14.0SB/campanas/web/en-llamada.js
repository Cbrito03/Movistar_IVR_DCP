var controller = {
    $this: null,
    onBackLoadingComplete: null,
    clienteControllerASB: null,
    clienteController: null,
    cierreController: null,
    cierreControllerASB: null,
    referredController: null,
    schedulerController: null,
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

        whenAutoloadReady("al-cliente-asb", function () {
            cicTrace("whenAutoloadReady cliente-asb");
            thisController.clienteControllerASB = thisController.$this.find("#al-cliente-asb").data("controller");
            thisController.clienteControllerASB.onGetRegionesComunaArray = function () { return thisController.regionesComunasArray; }
            thisController.clienteControllerASB.onGetMetaDataObject = function () { return thisController.onGetMetaDataObject(); }
            thisController.checkActualiceRegionComunas();
            thisController.onBackLoadingComplete();
        });

        whenAutoloadReady("al-cliente", function () {
            cicTrace("whenAutoloadReady cliente");
            thisController.clienteController = thisController.$this.find("#al-cliente").data("controller");
            thisController.clienteController.onGetRegionesComunaArray = function () { return thisController.regionesComunasArray; }
            thisController.clienteController.onGetMetaDataObject = function () { return thisController.onGetMetaDataObject(); }
            thisController.checkActualiceRegionComunas();
            thisController.onBackLoadingComplete();
        });

        whenAutoloadReady("al-oferta", function () {
            cicTrace("whenAutoloadReady oferta");
            thisController.ofertaController = thisController.$this.find("#al-oferta").data("controller");
            thisController.onBackLoadingComplete();
        });

        whenAutoloadReady("al-cierre-asb", function () {
            cicTrace("whenAutoloadReady cierre-asb");
            thisController.cierreControllerASB = thisController.$this.find("#al-cierre-asb").data("controller");
            thisController.cierreControllerASB.onGetMetaDataObject = function () { return thisController.onGetMetaDataObject(); }
            thisController.cierreControllerASB.getCliente = function () { return thisController.getCliente(); }
            thisController.cierreControllerASB.getLlamadaConectada = function () { return thisController.onGetLlamadaConectada(); }
            thisController.cierreControllerASB.onSetAtributoGrabacion = function (atributo, valor) { thisController.onSetAtributoGrabacion(atributo, valor); }
            thisController.cierreControllerASB.onGetRegionesComunaArray = function () { return thisController.regionesComunasArray; }
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
        var metaDataObject = thisController.onGetMetaDataObject();
        var familia = (metaDataObject ? metaDataObject.callFamiliaId : cicGetCallFamiliaId());
        var sxbReferido = (metaDataObject ? metaDataObject.sxbReferido : cicGetSbxReferido());
        cicTrace("EnLlamada Inicio Refresca");

        if ((familia.indexOf("C2C") > -1 || familia.indexOf("CMB") > -1) && (sxbReferido != "R"))
        {
            thisController.$this.find("#liTabOferta").show();
            thisController.$this.find("#liTabClienteASB").show();
            thisController.$this.find("#liTabCliente").hide();
            thisController.clienteControllerASB.refresca();
            thisController.$this.find("#tabs").tabs({ active: 0 });
            thisController.$this.find("#liTabCierreASB").show();
            thisController.$this.find("#liTabCierre").hide();
            thisController.cierreControllerASB.refresca();
        }
        else {
            thisController.$this.find("#liTabOferta").hide();
            thisController.$this.find("#liTabClienteASB").hide();
            thisController.$this.find("#liTabCliente").show();
            thisController.clienteController.refresca();
            thisController.$this.find("#tabs").tabs({ active: 1 });
            thisController.$this.find("#liTabCierreASB").hide();
            thisController.$this.find("#liTabCierre").show();
            thisController.cierreController.refresca();
        }
        
        thisController.ofertaController.refresca();
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
        var thisController = this;

        var metaDataObject = thisController.onGetMetaDataObject();

        var familia = (metaDataObject ? metaDataObject.callFamiliaId : cicGetCallFamiliaId());
        var sxbReferido = (metaDataObject ? metaDataObject.sxbReferido : cicGetSbxReferido());

        if ((familia.indexOf("C2C") > -1 || familia.indexOf("CMB") > -1) && (sxbReferido != "R")) {
            return thisController.clienteControllerASB.getCliente();
        } else {
            return thisController.clienteController.getCliente();
        }
    },
    getRutCliente: function () {
        var thisController = this;

        var metaDataObject = thisController.onGetMetaDataObject();

        var familia = (metaDataObject ? metaDataObject.callFamiliaId : cicGetCallFamiliaId());
        var sxbReferido = (metaDataObject ? metaDataObject.sxbReferido : cicGetSbxReferido());

        if ((familia.indexOf("C2C") > -1 || familia.indexOf("CMB") > -1) && (sxbReferido != "R")) {
            return thisController.cierreControllerASB.getRutCliente();
        } else {
            return thisController.cierreController.getRutCliente();
        }
    },
    getInfoCierre: function () {
        var thisController = this;

        var metaDataObject = thisController.onGetMetaDataObject();

        var familia = (metaDataObject ? metaDataObject.callFamiliaId : cicGetCallFamiliaId());
        var sxbReferido = (metaDataObject ? metaDataObject.sxbReferido : cicGetSbxReferido());

        if ((familia.indexOf("C2C") > -1 || familia.indexOf("CMB") > -1) && (sxbReferido != "R")) {
            return thisController.cierreControllerASB.getInfoCierre();
        } else {
            return thisController.cierreController.getInfoCierre();
        }
    },
    resetTabs: function () {
        var thisController = this;
        var metaDataObject = thisController.onGetMetaDataObject();

        var indexActual = thisController.$this.find("#tabs").tabs('option', 'active');

        var familia = (metaDataObject ? metaDataObject.callFamiliaId : cicGetCallFamiliaId());
        var sxbReferido = (metaDataObject ? metaDataObject.sxbReferido : cicGetSbxReferido());

        cicTrace("EnLlamada Reset Tabs");

        if ((familia.indexOf("C2C") > -1 || familia.indexOf("CMB") > -1) && (sxbReferido != "R")) {
            thisController.$this.find("#tabs").tabs({ active: 0 }); //Cliente ASB
            thisController.clienteControllerASB.setActiveTabs(0); //Datos Basicos Cliente ASB

            thisController.$this.find("#tabs").tabs({ active: 3 }); //Cierre ASB
            thisController.cierreControllerASB.setActiveTabs(0); //Ficha Cierre ASB

            if (indexActual == 1) indexActual = 0;
            else if (indexActual == 4) indexActual = 3;
        } else {
            thisController.$this.find("#tabs").tabs({ active: 1 }); //Cliente
            thisController.clienteController.setActiveTabs(0); //Datos Basicos Cliente
            
            thisController.$this.find("#tabs").tabs({ active: 4 }); //Cierre
            thisController.cierreController.setActiveTabs(0); //Ficha Cierre

            if (indexActual == 0) indexActual = 1;
            else if (indexActual == 3) indexActual = 4;
        }
        

        thisController.$this.find("#tabs").tabs({ active: indexActual });
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
        var thisController = this;

        if (thisController.regionesComunasArray == null) return;

        if (this.clienteControllerASB != null) {
            this.clienteControllerASB.initializeRegionComuna();
        }

        if (this.cierreControllerASB != null) {
            this.cierreControllerASB.initializeRegionComuna();
        }
       
        if (this.clienteController != null) {
            this.clienteController.initializeRegionComuna();
        }

        if (this.cierreController != null) {
            this.cierreController.initializeRegionComuna();
        }
        
    }
};