var controller = {
    enableVolverClienteOnCortar: true,
    createInstance: function (html, initialData) {
        var thisController = this;
        var w = $(html).dialog({
            autoOpen: false,
            title: "Conferencia con BackOffice",
            closeOnEscape: false,
            closeText: "Cerrar",
            width: 800,
            height: 350,
            modal: true,
            position: "center",
            buttons: {
                "callBO":
                    {
                        text: "Llamar a BackOffice",
                        id: "cmdLLamarBO",
                        click: function () {
                            initialData.onLlamarBO();
                            $("#cmdLLamarBO").button("disable");
                            $("#cmdVolverCliente").button("disable");
                            $("#cmdCortarBO").button("enable");
                            $("#cmdCreateConferencia").button("enable");
                            $("#cmdCerrarVentana").button("disable");
                        }
                    },
                "cutCallBO":
                    {
                        text: "Cortar BackOffice",
                        id: "cmdCortarBO",
                        click: function () {
                            initialData.onCortarBO();
                            $("#cmdLLamarBO").button("enable");
                            $("#cmdCortarBO").button("disable");
                            if (thisController.enableVolverClienteOnCortar) {
                                $("#cmdVolverCliente").button("enable");
                            } else {
                                $("#cmdVolverCliente").button("disable");
                            }
                            $("#cmdCreateConferencia").button("disable");
                            $("#cmdCerrarVentana").button("enable");
                            initialData.inConference = false;
                            thisController.enableVolverClienteOnCortar = true;
                        }
                    },
                "backClient":
                    {
                        text: "Volver con el Cliente",
                        id: "cmdVolverCliente",
                        click: function () {
                            initialData.onVolverCliente();
                            $("#cmdVolverCliente").button("disable");
                            $("#cmdLLamarBO").button("enable");
                            $("#cmdCortarBO").button("disable");
                            $("#cmdCreateConferencia").button("disable");
                            $("#cmdCerrarVentana").button("enable");
                        }
                    },
                "setConference":
                    {
                        text: "Establecer Conferencia",
                        id: "cmdCreateConferencia",
                        click: function () {
                            var response = initialData.onHacerConferencia();
                            if (response.status) {
                                thisController.enableVolverClienteOnCortar = false;
                                initialData.inConference = true;
                                $("#cmdCortarBO").button("enable");
                                $("#cmdCreateConferencia").button("disable");
                                $("#cmdVolverCliente").button("disable");
                                $("#cmdLLamarBO").button("disable");
                                $("#cmdCerrarVentana").button("enable");
                                showMsgBoxAlert("Conferencia establecida exitosamente","");
                                //thisController.onCancel(w, initialData);
                            } else {
                                if (response.type == "cancel") { //Agente responde que NO ha establecido comunicación con BO
                                    return;
                                } else if (response.type == "destino"){ //Llamada BO se corto antes de establecer conferencia
                                    showMsgBoxAlert(response.msg,"");
                                    $("#cmdCortarBO").button("disable");
                                    $("#cmdLLamarBO").button("enable");
                                    $("#cmdVolverCliente").button("enable");
                                    $("#cmdCerrarVentana").button("disable");
                                    initialData.inConference = false;
                                } else if (response.type == "conference") { //No se pudo establacer conferencia
                                    showMsgBoxAlert(response.msg,"");
                                } else if (response.type == "destinoInConference") { //Llamada BO esta cortada al agregar a conferencia
                                    showMsgBoxAlert(response.msg,"");
                                    $("#cmdCortarBO").button("disable");
                                    $("#cmdLLamarBO").button("enable");
                                    $("#cmdVolverCliente").button("enable");
                                    $("#cmdCerrarVentana").button("disable");
                                    initialData.inConference = false;
                                } else if (response.type == "clientInConference") { //Llamada BO esta cortada al agregar a conferencia
                                    showMsgBoxAlert(response.msg,"");
                                    initialData.onCancelarLlamada();
                                    $("#cmdCortarBO").button("disable");
                                    $("#cmdCreateConferencia").button("disable");
                                    $("#cmdVolverCliente").button("disable");
                                    $("#cmdLLamarBO").button("disable");
                                    $("#cmdCerrarVentana").button("enable");
                                    initialData.inConference = false;
                                }
                            }
                            
                        }
                    },
                "cancel":
                    {
                        text: "Cerrar Ventana",
                        id: "cmdCerrarVentana",
                        click: function () {
                            thisController.onCancel(w, initialData)
                        }
                    }
            },
            open: function () {
                $(this).closest('.ui-dialog').find('.ui-dialog-titlebar-close').hide();
                $("#cmdLLamarBO").button({ icons: { primary: "ui-icon-check" } });
                $("#cmdCortarBO").button({ icons: { primary: "ui-icon-close" } });
                $("#cmdVolverCliente").button({ icons: { primary: "ui-icon-person" } });
                $("#cmdCreateConferencia").button({ icons: { primary: "ui-icon-signal-diag" } });
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
        if (initialData.inConference) {
            if (!initialData.isBackOfficeConnected) {
                $("#cmdCortarBO").button("disable");
            } else {
                $("#cmdLLamarBO").button("disable");
                this.enableVolverClienteOnCortar = false;
            }
            $("#cmdVolverCliente").button("disable");
            $("#cmdCreateConferencia").button("disable");
        } else {
            $("#cmdCortarBO").button("disable");
            $("#cmdVolverCliente").button("disable");
            $("#cmdCreateConferencia").button("disable");
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