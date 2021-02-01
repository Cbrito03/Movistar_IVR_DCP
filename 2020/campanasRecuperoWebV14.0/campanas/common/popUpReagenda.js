var controller = {
    fechaDisponible: null,
    createInstance: function (html, initialData) {
        var thisController = this;
        var w = $(html).dialog({
            autoOpen: false,
            title: ("Reagendar"),
            closeOnEscape: true,
            closeText: "Cerrar",
            width: 550,
            height: 300,
            modal: true,
            position: "center",
            buttons: {
                "Aceptar": {
                    text: "Aceptar",
                    click: function () { thisController.onOk(w, initialData); }
                }, "Cancelar": {
                    text: "Cancelar",
                    click: function () { thisController.onCancel(w, initialData); }
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

        w.find("#edReagendamientoHora").val("--");
        w.find("#edReagendamientoMinutos").val("--");
        
        var edFechaReagendamiento = w.find("#edFechaReagendamiento").datepicker();
        edFechaReagendamiento.css("top", "2px");
        edFechaReagendamiento.next(".ui-datepicker-trigger").css("vertical-align", "middle").css("cursor", "pointer");
        var now = new Date();
        edFechaReagendamiento.datepicker("option", "minDate", now);
        var maximo = new Date();
        maximo.setDate(now.getDate() + initialData.maxDiasAgenda);
        edFechaReagendamiento.datepicker("option", "maxDate", maximo);
        edFechaReagendamiento.datepicker("setDate", now);

        attachRootLayoutPanelToDialog(w);

        w.find("input[type=radio][name=tipoAgendamiento]").change(function () {
            if (this.value == 'INMEDIATO') {
                w.find("#edFechaReagendamiento").datepicker('disable');
                w.find("#edReagendamientoHora").attr("disabled", "disabled");
                w.find("#edReagendamientoMinutos").attr("disabled", "disabled");
            }
            else if (this.value == 'MANUAL') {
                w.find("#edFechaReagendamiento").datepicker('enable');
                w.find("#edReagendamientoHora").removeAttr("disabled");
                w.find("#edReagendamientoMinutos").removeAttr("disabled");
            }
        });

        return w;
    },
    init: function (w, initialData) {
        var thisController = this;
        httpInvoke("getFechaHoraAgendaDisponible.ges", { campaignName: initialData.infoRegistro.campaignName, ejecutivo: initialData.infoRegistro.ejecutivo }, function (ret) {
            if (ret.status == 0) {
                w.find("#lbProximaFechaHora").text(ret.fechaDisponibleStr);
                thisController.fechaDisponible = ret.fechaDisponible;
            } else {
                w.find("#lbProximaFechaHora").text("No Disponible");
            }

        },
        null,
        true);
        w.find("#edFechaReagendamiento").attr("disabled", "disabled");
        w.find("#edReagendamientoHora").attr("disabled", "disabled");
        w.find("#edReagendamientoMinutos").attr("disabled", "disabled");
        w.find("#nomCli").html(initialData.infoRegistro.nombreCliente);
        w.find("#numCli").html(initialData.infoRegistro.numeroCliente);
        w.find('input:radio[name=tipoAgendamiento]').val(['INMEDIATO']);
          
    },
    reagendar: function (w, initialData, referido, fechaReagendamiento, tipo) {
        var thisController = this;

        httpInvoke("reagendarRegistro.ges", { infoRegistro: referido, fechaReagendamiento: fechaReagendamiento, tipo: tipo }, function (ret) {
            if (ret.status == 0) {
                showMsgBoxInfo("Se realizado el reagendamiento de forma exitosa", "Reagendar");
                thisController.onCancel(w, initialData);
            } else {
                showMsgBoxAlert(ret.msg, "Reagendar");
            }
            
        }, function (error) {
            showMsgBoxAlert("No se logro realizar el reagendamiento. Favor intente nuevamente.", "Reagendar");
        },
        true);
    },
    
    onOk: function (w, initialData) {
        var thisController = this;
        
        if (w.find('input:radio[name=tipoAgendamiento]:checked').val() == "MANUAL") {
            var fechaReagendamiento = w.find("#edFechaReagendamiento").datepicker("getDate");

            if (!fechaReagendamiento) {
                showMsgBoxAlert("Debe seleccionar una fecha de agendamiento", "Reagendar");
                return;
            }

            var hour = w.find("#edReagendamientoHora option:selected").text();
            var mins = w.find("#edReagendamientoMinutos option:selected").text();

            if (hour == "--" || mins == "--") {
                showMsgBoxAlert("Debe seleccionar una hora de agendamiento", "Reagendar");
                return;
            }

            fechaReagendamiento.setHours(hour, mins, 0, 0);

            var now = new Date();

            if (fechaReagendamiento < now) {
                showMsgBoxAlert("Debe seleccionar una fecha hora mayor a la actual", "Reagendar");
                return;
            }

            var fecha = thisController.dateTime2Object(fechaReagendamiento);

        } else {
            if (!thisController.fechaDisponible) {
                showMsgBoxAlert("No se puede agendar de forma inmediata ya que no se pudo recuperar la próxima fecha disponible", "Reagendar");
                return;
            }

            var fecha = thisController.fechaDisponible;

        }
        

        thisController.reagendar(w, initialData, initialData.infoRegistro, fecha, initialData.tipo);

    },
    onCancel: function (w, initialData) {
        w.dialog("close");
    },
    destroyInstance: function (w, initialData) {
        w.remove();
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
    }
}