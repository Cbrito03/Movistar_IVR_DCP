var controller = {
    enableVolverClienteOnCortar: true,
    createInstance: function (html, initialData) {
        var thisController = this;
        var w = $(html).dialog({
            autoOpen: false,
            title: "Transferencia",
            closeOnEscape: false,
            closeText: "Cerrar",
            width: 800,
            height: 350,
            modal: true,
            position: "center",
            buttons: {
                "callDestino":
                    {
                        text: "Iniciar Transferencia",
                        id: "cmdLLamarDestino",
                        click: function () {
                            initialData.onLlamarDestino();
                            $("#cmdLLamarDestino").button("disable");
                            $("#cmdVolverCliente").button("disable");
                            $("#cmdCortarDestino").button("enable");
                            $("#cmdCreateTransferencia").button("enable");
                            $("#cmdCerrarVentana").button("disable");
                        }
                    },
                "cutCallDestino":
                    {
                        text: "Cortar Transferencia",
                        id: "cmdCortarDestino",
                        click: function () {
                            initialData.onCortarDestino();
                            $("#cmdLLamarDestino").button("enable");
                            $("#cmdCortarDestino").button("disable");
                            $("#cmdVolverCliente").button("enable");
                            $("#cmdCreateTransferencia").button("disable");
                            $("#cmdCerrarVentana").button("disable");
                        }
                    },
                "backClient":
                    {
                        text: "Volver con el Cliente",
                        id: "cmdVolverCliente",
                        click: function () {
                            initialData.onVolverCliente();
                            $("#cmdVolverCliente").button("disable");
                            $("#cmdLLamarDestino").button("enable");
                            $("#cmdCortarDestino").button("disable");
                            $("#cmdCreateTransferencia").button("disable");
                            $("#cmdCerrarVentana").button("enable");
                        }
                    },
                "setConference":
                    {
                        text: "Transferir",
                        id: "cmdCreateTransferencia",
                        click: function () {
                            var response = initialData.onHacerTransferencia();
                            if (response.status) {
                                $("#cmdCortarDestino").button("disable");
                                $("#cmdCreateTransferencia").button("disable");
                                $("#cmdVolverCliente").button("disable");
                                $("#cmdLLamarDestino").button("disable");
                                $("#cmdCerrarVentana").button("enable");
                                showMsgBoxInfo("Transferencia establecida exitosamente", "Transferencia");
                                
                            } else {
                                if (response.type == "cutCall"){ //Llamada Destino se corto antes de establecer transferencia
                                    showMsgBoxAlert(response.msg, "Transferencia");
                                    $("#cmdCortarDestino").button("disable");
                                    $("#cmdLLamarDestino").button("enable");
                                    $("#cmdVolverCliente").button("enable");
                                    $("#cmdCreateTransferencia").button("disable");
                                    $("#cmdCerrarVentana").button("disable");
                                } else if (response.type == "cutClient") { //Llamada Cliente se corto antes de establecer transferencia
                                    showMsgBoxAlert(response.msg, "Transferencia");
                                    $("#cmdCortarDestino").button("disable");
                                    $("#cmdLLamarDestino").button("disable");
                                    $("#cmdVolverCliente").button("disable");
                                    $("#cmdCreateTransferencia").button("disable");
                                    $("#cmdCerrarVentana").button("enable");
                                    initialData.onCortarDestino();
                                } else {
                                    showMsgBoxAlert(response.msg, "Transferencia");
                                }


                            }
                            
                        }
                    },
                "cancel":
                    {
                        text: "Cerrar Ventana",
                        id: "cmdCerrarVentana",
                        click: function () {
                            thisController.onCancel(w, initialData);
                        }
                    }
            },
            open: function () {
                $(this).closest('.ui-dialog').find('.ui-dialog-titlebar-close').hide();
                $("#cmdLLamarDestino").button({ icons: { primary: "ui-icon-check" } });
                $("#cmdCortarDestino").button({ icons: { primary: "ui-icon-close" } });
                $("#cmdVolverCliente").button({ icons: { primary: "ui-icon-person" } });
                $("#cmdCreateTransferencia").button({ icons: { primary: "ui-icon-signal-diag" } });
                $("#cmdCerrarVentana").button({ icons: { primary: "ui-icon-arrowreturnthick-1-n" } });
            }
        });

        attachRootLayoutPanelToDialog(w);
        w.bind("dialogclose", function () {
            thisController.destroyInstance(w, initialData);
        });
        return w;
    },
    init: function (w, initialData) {
        this.showRecord(w, initialData);
        if (initialData.isDestinoConnected) {
            $("#cmdLLamarDestino").button("disable");
            $("#cmdVolverCliente").button("disable");
            $("#cmdCerrarVentana").button("disable");
        } else {
            $("#cmdCortarDestino").button("disable");
            $("#cmdVolverCliente").button("disable");
            $("#cmdCreateTransferencia").button("disable");
        }           
              
    },
    showRecord: function (w, initialData) {
        
    },
    onCancel: function (w, initialData) {
        var thisController = this;
        w.dialog("close");
    },
    destroyInstance: function (w, initialData) {
        w.remove();
    }

}