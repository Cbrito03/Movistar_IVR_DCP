var controller = {
    $this: null,
    onBackLoadingComplete: null,
    fijoController: null,
    movilController: null,
    init: function (container, options) {
        this.$this = $(container.children()[0]);
        var thisController = this;
        var tabsVentaAccesos = thisController.$this.find("#tabsVentaAccesos").tabs();

        initializeTabsLayout(tabsVentaAccesos);

        whenAutoloadReady("al-fijo", function () {
            cicTrace("whenAutoloadReady fijo");
            thisController.fijoController = thisController.$this.find("#al-fijo").data("controller");
            thisController.fijoController.loadWSData();
            thisController.checkAllLoadingComplete();
        });
        whenAutoloadReady("al-movil", function () {
            cicTrace("whenAutoloadReady movil");
            thisController.movilController = thisController.$this.find("#al-movil").data("controller");
            thisController.movilController.loadWSData();
            thisController.checkAllLoadingComplete();
        });
        
    },
    refresca: function () {
        var thisController = this;
        cicTrace("VentaAccesos Inicio Refresca");
        thisController.$this.find("#tabsVentaAccesos").tabs({ active: 0 }); 

        thisController.fijoController.refresca();
        thisController.movilController.refresca();
        
        cicTrace("VentaAccesos Fin Refresca");
    },
    getInfoVentaFijo: function () {
        return this.fijoController.getInfoVenta();
    },
    getInfoVentaMovil: function () {
        return this.movilController.getInfoVenta();
    },
    getDatosVentaAccesosFijo: function () {
        return this.fijoController.getDatosVenta();
    },
    setActiveTabs: function (index) {
        var thisController = this;
        thisController.resetTabs();
        thisController.$this.find("#tabsVentaAccesos").tabs({ active: index });
    },
    resetTabs: function () {
        var indexActual = this.$this.find("#tabsVentaAccesos").tabs('option', 'active');
        this.$this.find("#tabsVentaAccesos").tabs({ active: 0 });
        this.fijoController.setActiveTabs(0);
        this.$this.find("#tabsVentaAccesos").tabs({ active: indexActual });
    },
    checkAllLoadingComplete: function () {
        var thisController = this;
        if (thisController.fijoController == null) return;
        if (thisController.movilController == null) return;
        thisController.onBackLoadingComplete();

    }
};