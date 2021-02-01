var controller = {
    $this: null,
    onBackLoadingComplete: null,
    clienteController: null,
    ofertaController: null,
    gestionVentaController: null,
    datosAdicionalesController: null,
    cierreController: null,
    ventaAccesosController: null,
	referredController: null,
    schedulerController: null,
    onGetLlamadaConectada: null,
    onSwitchOffEnviadoBO: null,
    onSetAtributoGrabacion: null,
    onBackLoadingComplete: null,
    regionesComunasArray: null,
    init: function (container, options) {
        this.$this = $(container.children()[0]);
        var thisController = this;
        var tabs = thisController.$this.find("#tabs").tabs();

        initializeTabsLayout(tabs);

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
            thisController.ofertaController.loadWSData();
            thisController.onBackLoadingComplete();
        });
        whenAutoloadReady("al-gestionVenta", function () {
            cicTrace("whenAutoloadReady gestionVenta");
            thisController.gestionVentaController = thisController.$this.find("#al-gestionVenta").data("controller");
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
            thisController.cierreController.getCliente = function () { return thisController.getCliente(); }
            thisController.cierreController.getProductosOferta = function () { return thisController.getProductosOferta(); }
            thisController.cierreController.getDatosOferta = function () { return thisController.getDatosOferta(); }
            thisController.cierreController.getProductosVenta = function () { return thisController.getProductosVenta(); }
            thisController.cierreController.getDatosVenta = function () { return thisController.getDatosVenta(); }
            thisController.cierreController.getProductosAccesos = function () { return thisController.getProductosAccesos(); }
            thisController.cierreController.getLlamadaConectada = function () { return thisController.onGetLlamadaConectada(); }
            thisController.cierreController.switchOffEnviadoBO = function () { thisController.onSwitchOffEnviadoBO(); }
            thisController.cierreController.onSetAtributoGrabacion = function (atributo, valor) { thisController.onSetAtributoGrabacion(atributo, valor); }
            thisController.cierreController.loadWSData();
            thisController.onBackLoadingComplete();
        });
        whenAutoloadReady("al-ventaAccesos", function () {
            cicTrace("whenAutoloadReady ventaAccesos");
            thisController.ventaAccesosController = thisController.$this.find("#al-ventaAccesos").data("controller");
            thisController.ventaAccesosController.onBackLoadingComplete = function () {
                thisController.onBackLoadingComplete();
            }
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
        thisController.$this.find("#tabs").tabs("select", 0);
        thisController.clienteController.refresca();
        thisController.ofertaController.refresca();
        thisController.gestionVentaController.refresca();
        thisController.ventaAccesosController.refresca();
        thisController.datosAdicionalesController.refresca();
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

        var certificacion = cicGetGenerico01();
        var call;
        if (cicGetCallCallCenterId() == "AL" && cicGetCallPaisId() == "CL") { call = "ACTIONLINE"; }
        if (cicGetCallCallCenterId() == "DI") { call = "DIGITEX"; } //PERU?
        //if (cicGetCallCallCenterId() == "DI") { call = "DIGITEX"; }  //COLOMBIA?
        if (cicGetCallCallCenterId() == "KO") { call = "KONEXIA"; }
        if (cicGetCallCallCenterId() == "AT") { call = "ATENTO"; } //PERU?
        //if (cicGetCallCallCenterId() == "AT") { call = "ATENTO"; }  //COLOMBIA?}


        if (cicGetCallCallCenterId() == "AL" && cicGetCallPaisId() == "PE") { call = "PERU"; }

        
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
    getProductosAccesos: function () {
        var productosAccesos = new Object();
        productosAccesos.infoFijo = this.ventaAccesosController.getInfoVentaFijo();
        productosAccesos.infoMovil = this.ventaAccesosController.getInfoVentaMovil();
        return productosAccesos;
    },
    resetTabs: function () {
        var indexActual = this.$this.find("#tabs").tabs('option', 'active');
        this.$this.find("#tabs").tabs({ active: 0 });
        this.clienteController.setActiveTabs(0);
        this.$this.find("#tabs").tabs({ active: 3 }); 
        this.ventaAccesosController.setActiveTabs(0); 
        this.$this.find("#tabs").tabs({ active: 5 });
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
            //this.cierreController.initializeRegionComuna();
        }
    },
    getCertificacionSiglo: function () {
        var certificacion = thisController.cicGetGenerico01();
        //http://10.181.21.28/webpopupivr/webpopup/webpopup.do?accion=obtenerOfertaCliente&ani=90512907&id=57692231&call=DIGITEX&Inbound=S
        var urlpartHTTP = "http://10.181.21.28/webpopupivr/webpopup/webpopup.do?accion=obtenerOfertaCliente&";
       // var numero = thisController.cicGetNumberToDial();
        var numero = 90512907;

        var urlpartANI = "ani=" + numero;
        var urlpartEXT = "&id=" + "57692231";
        var urlpartCALL = "&call="+"DIGITEX";
        var urlpartIN = "&Inbound=S";

        var URL = urlpartHTTP + urlpartANI + urlpartEXT + urlpartCALL + urlpartIN;
        window.open(URL);
       
    }
};