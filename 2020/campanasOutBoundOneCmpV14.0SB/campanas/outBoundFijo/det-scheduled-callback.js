var controller = {
    $this: null,
    ReloadTimer: 1000,
    timer: null,
    onGetMaxDiasAgenda: null,
    init: function (container, options) {
        this.$this = $(container.children()[0]);

        var thisController = this;
        cicTrace("Listado Agendados - Inicio Init");

        var cmdActualizar = thisController.$this.find("#cmdActualizar").button({ icons: { primary: "ui-icon-refresh" } });
        cmdActualizar.click(function (event) {
            if (!isButtonEnabled(this)) {
                return false;
            } else {
                thisController.actualizar();
                return true;
            }
        });
        
        var cmdReagendar = thisController.$this.find("#cmdReagendar").button({ icons: { primary: "ui-icon-calendar" } });
        cmdReagendar.click(function (event) {
            if (!isButtonEnabled(this)) {
                return false;
            } else {
                thisController.reagendar();
                return true;
            }
        });
        enableButton(cmdReagendar, false);

        var cmdReagendarInmediato = thisController.$this.find("#cmdReagendarInmediato").button({ icons: { primary: "ui-icon-clock" } });
        cmdReagendarInmediato.click(function (event) {
            if (!isButtonEnabled(this)) {
                return false;
            } else {
                thisController.reagendarInmediato();
                return true;
            }
        });
        enableButton(cmdReagendarInmediato, false);

        var grid = thisController.$this.find("#listaAgendados").jqGrid({
            datatype: "local",
            //autowidth: true,
            rowNum: 10000,
            hidegrid: false,
            headertitles: true,
            scrollrows: true,
            shrinkToFit: false,
            colNames: ["Id", "Call Center", "Canal", "Servicio", "Ejecutivo", "Fecha Agendado", "Fecha &uacute;ltima atenci&oacute;n", "N&uacute;mero de intentos",
                       "N&uacute;mero de cliente", "Nombre del cliente", "Estado", "Resultado CPA", "Motivo", "i3Identity", "campaignName", "puedeReagendar"],
            caption: "Agendados",
            colModel: [
			  { name: "id", index: "id", hidden: true, key: true },
              { name: "callCenter", index: "callCenter", width: 60, align: "center" },
              { name: "canal", index: "canal", width: 50, align: "center" },
			  { name: "servicio", index: "servicio", width: 60, align: "center" },
			  { name: "ejecutivo", index: "ejecutivo", width: 100, align: "center" },
              { name: "fechaAgenda", index: "fechaAgenda", width: 140, align: "center" },
              { name: "fechaUltAtencion", index: "fechaUltAtencion", width: 130, align: "center" },
              { name: "numIntentos", index: "numIntentos", width: 80, align: "center" },
              { name: "numCliente", index: "numCliente", width: 80, align: "center" },
              { name: "nomCliente", index: "nomCliente", width: 150, align: "left" },
              { name: "estado", index: "estado", width: 50, align: "center" },
              { name: "resultadoCPA", index: "resultadoCPA", width: 150, align: "left" },
              { name: "motivo", index: "motivo", width: 140, align: "left" },
              { name: "i3Identity", index: "i3Identity", hidden: true },
              { name: "campaignName", index: "campaignName", hidden: true },
              { name: "puedeReagendar", index: "puedeReagendar", hidden: true }
            ],
            ondblClickRow: function (rowid, iRow, iCol, e) {
                clearSelection();
            },
            onSelectRow: function (id) {
                var sel = (id != undefined);
                var data = grid.jqGrid("getRowData", id);
                enableButton(thisController.$this.find("#cmdReagendar"), (data.puedeReagendar == "S"));
                enableButton(thisController.$this.find("#cmdReagendarInmediato"), (data.puedeReagendar == "S"));
            },
            loadComplete: function () {
                if (thisController.$this.find("#listaAgendados").jqGrid('getGridParam', 'reccount') == 0) {
                    $(".ui-jqgrid-btable").css("height", "0.5px");
                }
                else {
                    $(".ui-jqgrid-btable").css("height", "0px");
                }

            }
        });

        attachJQGridToContainerPanel(thisController.$this.find("#listaAgendadosContainer"), grid);

        cicTrace("Listado Agendados - Fin Init");

        thisController.setTooltipsOnColumnHeader($("#listaAgendados"), 1, "Outsourcer asignado a la campana.");
        thisController.setTooltipsOnColumnHeader($("#listaAgendados"), 2, "OU (outbound), IN (inbound), WEB.");
        thisController.setTooltipsOnColumnHeader($("#listaAgendados"), 3, "FIJ, MOV, MIG, TLM, SVALD, SVF, SVM.");
        thisController.setTooltipsOnColumnHeader($("#listaAgendados"), 4, "Agente de gestión call center.");
        thisController.setTooltipsOnColumnHeader($("#listaAgendados"), 5, "Fecha en la que se tiene agendada la llamada listada.");
        thisController.setTooltipsOnColumnHeader($("#listaAgendados"), 6, "Fecha de la última llamada hecha al número agendado, puede ser nulo si no se ha logrado contactar o no se ha intentado aun.");
        thisController.setTooltipsOnColumnHeader($("#listaAgendados"), 7, "Intentos de llamada al número agendado.");
        thisController.setTooltipsOnColumnHeader($("#listaAgendados"), 8, "Número telefónico de contacto de la agenda.");
        thisController.setTooltipsOnColumnHeader($("#listaAgendados"), 9, "Nombre de cliente agendado.");
        var stringEstado = "Estado actual del registro: \n" +
                            "'A' Indica que el máximo de intentos se ha alcanzado para el registro. \n" +
                            "'C' Indica que es un registro llamable. \n" +
                            "'E' Indica que el registro se excluyó del proceso de marcación (una razón es por encontrarse en la DNC). \n" +
                            "'F' Indica que el registro es no llamable y debe ser revisado por los administradores del sistema. \n" +
                            "'I' Indica que el registro está en proceso por el discador, ya sea que está en proceso de marcación o en memoria del discador a punto de ser procesado. \n" +
                            "'J' Identifica registro de prioridad. \n" +
                            "'R' Registro re agendado de forma automática, típicamente cuando el cliente agendado no contesto, el sistema lo re agenda de forma automática. \n" +
                            "'S' Registro agendado. \n" +
                            "'U' Registro no llamable, tipificado con un código de terminación que no permite volver a llamarlo.";

        thisController.setTooltipsOnColumnHeader($("#listaAgendados"), 10, stringEstado);
        thisController.setTooltipsOnColumnHeader($("#listaAgendados"), 11, "Agente de gestión call center");
        thisController.setTooltipsOnColumnHeader($("#listaAgendados"), 12, "Tipificación automática del sistema  a la llamada generada o del agente cuando se ha procesado ya el registro.");

    },
    setTooltipsOnColumnHeader: function (grid, iColumn, text) {
        var thd = jQuery("thead:first", grid[0].grid.hDiv)[0];
        jQuery("tr.ui-jqgrid-labels th:eq(" + iColumn + ")", thd).attr("title", text);
    },
    refresca: function () {
        var thisController = this;
        var gridReferidos = thisController.$this.find("#listaAgendados").jqGrid();
        gridReferidos.jqGrid("clearGridData");
        httpInvoke("getAgendados.ges", { campaignName: cicGetCampaignName(), ejecutivo: cicGetSystemAgentId() }, function (ret) {
            thisController.$this.find("#lblErrMsg").text("");
            $.each(ret, function (i, g) {
                gridReferidos.jqGrid("addRowData", g.id, g);
            });
        }, function () {
            thisController.$this.find("#lblErrMsg").text("No es posible recuperar la información de Agendados. En caso de persistir el problema contactar al Administrador del Sistema.");
        },
        true
        );
    },
    actualizar: function () {
        thisController = this;
        thisController.ReloadBtnEnableTimer();
    },
    ReloadBtnEnableTimer: function () {
        var thisController = this;
        if (this.timer) {
            clearTimeout(this.timer);
        }
        enableButton(thisController.$this.find("#cmdActualizar"), false);
        enableButton(thisController.$this.find("#cmdReagendar"), false);
        enableButton(thisController.$this.find("#cmdReagendarInmediato"), false);
        this.timer = setTimeout(function () {
            thisController.timer = null;
            thisController.refresca();
            enableButton(thisController.$this.find("#cmdActualizar"), true);
        }, thisController.ReloadTimer);
    },
    reagendar: function () {
        var thisController = this;
        var grid = this.$this.find("#listaAgendados");
        var rowId = grid.jqGrid("getGridParam", "selrow");
        if (!rowId) return;
        var agendado = grid.jqGrid("getRowData", rowId);
        var infoRegistro = new Object();
        infoRegistro.nombreCliente = agendado.nomCliente;
        infoRegistro.numeroCliente = agendado.numCliente;
        infoRegistro.ejecutivo = agendado.ejecutivo;
        infoRegistro.i3Identity = agendado.i3Identity;
        infoRegistro.campaignName = agendado.campaignName;

        openDialog("campanas/common/popUpReagendaManual", {
            infoRegistro: infoRegistro,
            tipo: "MANUAL",
            maxDiasAgenda: thisController.onGetMaxDiasAgenda(),
            onOk: function () {
                thisController.actualizar();
            }
        });
    },
    reagendarInmediato: function () {
        var thisController = this;
        var grid = this.$this.find("#listaAgendados");
        var rowId = grid.jqGrid("getGridParam", "selrow");
        if (!rowId) return;

        var agendado = grid.jqGrid("getRowData", rowId);
        var infoRegistro = new Object();
        infoRegistro.nombreCliente = agendado.nomCliente;
        infoRegistro.numeroCliente = agendado.numCliente;
        infoRegistro.ejecutivo = agendado.ejecutivo;
        infoRegistro.i3Identity = agendado.i3Identity;
        infoRegistro.campaignName = agendado.campaignName;

        $.blockUI({ message: '<h2><img src="img/busy.gif" />Procesando por favor espere...</h2>', css: { backgroundColor: '#004262', color: '#fff' } });
        httpInvoke("reagendarRegistro.ges", { infoRegistro: infoRegistro, fechaReagendamiento: new Object(), tipo: "INMEDIATA" }, function (ret) {
            if (ret.status == 0) {
                openDialog("campanas/common/popUpReagendaInmediata", {
                    infoRegistro: infoRegistro,
                    fechaHoraAgendada: ret.fechaHoraAgendada,
                    onOk: function () {
                        thisController.actualizar();
                    }
                });
            } else {
                showMsgBoxAlert(ret.msg, "Reagendar");
            }
            $.unblockUI();
        }, function (error) {
            showMsgBoxAlert("No se logro realizar el reagendamiento. Favor intente nuevamente.", "Reagendar");
            $.unblockUI();
        },
        true);

        
    }
};