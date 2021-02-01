var controller = {
    fechaDisponible: null,
    createInstance: function (html, initialData) {
        var thisController = this;
        var w = $(html).dialog({
            autoOpen: false,
            title: ("Reagenda Inmediata"),
            closeOnEscape: true,
            closeText: "Cerrar",
            width: 600,
            height: 210,
            modal: true,
            position: "center",
            buttons: {
                "Aceptar": {
                    text: "Aceptar",
                    click: function () { thisController.onOk(w, initialData); }
                }
            }
        });
        w.keyup(function (e) {
            if (e.keyCode == 13) {
                thisController.onOk(w, initialData);
            }
        });
        
       
        w.bind("dialogclose", function () {
            thisController.destroyInstance(w, initialData);
        });
      
        attachRootLayoutPanelToDialog(w);
    
        return w;
    },
    init: function (w, initialData) {
        var thisController = this;      
        w.find("#nomCli").html(initialData.infoRegistro.nombreCliente);
        w.find("#numCli").html(initialData.infoRegistro.numeroCliente);
        w.find("#lbFechaHoraAgendada").text(initialData.fechaHoraAgendada);
    },
    onOk: function (w, initialData) {
        w.dialog("close");
        initialData.onOk();
    },
    destroyInstance: function (w, initialData) {
        w.remove();
    }
}