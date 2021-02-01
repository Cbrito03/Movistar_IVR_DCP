var controller = {
    $this: null,
    ReloadTimer: 1000,
    timer: null,
    onGetMaxDiasAgenda: null,
    init: function (container, options) {
        this.$this = $(container.children()[0]);

        var thisController = this;
        cicTrace("Listado Referidos - Inicio Init");

        var cmdActualizar = thisController.$this.find("#cmdActualizar").button({ icons: { primary: "ui-icon-refresh" } });
        cmdActualizar.click(function (event) {
            if (!isButtonEnabled(this)) {
                return false;
            } else {
                thisController.actualizar();
                return true;
            }
        });  

        var grid = thisController.$this.find("#listaReferidos").jqGrid({
            datatype: "local",
            //autowidth: true,
            rowNum: 10000,
            hidegrid: false,
            headertitles: true,
            scrollrows: true,
            shrinkToFit: false,
            colNames: ["Id", "Call Center", "Canal", "Servicio", "Ejecutivo", "Fecha Agendado", "Fecha &uacute;ltima atenci&oacute;n", "N&uacute;mero de intentos",
                       "N&uacute;mero de cliente", "Nombre del cliente", "Estado", "Resultado CPA", "Motivo", "i3Identity", "campaignName"],
            caption: "Referidos",
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
              { name: "campaignName", index: "campaignName", hidden: true }
            ],
            ondblClickRow: function (rowid, iRow, iCol, e) {
                clearSelection();
            },
            onSelectRow: function (id) {
                var sel = (id != undefined);
            },
            loadComplete: function () {
                if (thisController.$this.find("#listaReferidos").jqGrid('getGridParam', 'reccount') == 0) {
                    $(".ui-jqgrid-btable").css("height", "0.5px");
                }
                else {
                    $(".ui-jqgrid-btable").css("height", "0px");
                }

            }
        });

        attachJQGridToContainerPanel(thisController.$this.find("#listaReferidosContainer"), grid);


        cicTrace("Listado Referidos - Fin Init");

        thisController.setTooltipsOnColumnHeader($("#listaReferidos"), 1, "Outsourcer asignado a la campana.");
        thisController.setTooltipsOnColumnHeader($("#listaReferidos"), 2, "OU (outbound), IN (inbound), WEB.");
        thisController.setTooltipsOnColumnHeader($("#listaReferidos"), 3, "FIJ, MOV, MIG, TLM, SVALD, SVF, SVM.");
        thisController.setTooltipsOnColumnHeader($("#listaReferidos"), 4, "Agente que ingreso el referido.");
        thisController.setTooltipsOnColumnHeader($("#listaReferidos"), 5, "Fecha en la que se tiene agendada la siguiente llamada al número referido.");
        thisController.setTooltipsOnColumnHeader($("#listaReferidos"), 6, "Fecha de la última llamada hecha al número referido, puede ser nulo si no se ha logrado contactar o no se ha intentado discar aun.");
        thisController.setTooltipsOnColumnHeader($("#listaReferidos"), 7, "Intentos de llamada al número referido.");
        thisController.setTooltipsOnColumnHeader($("#listaReferidos"), 8, "Número telefónico de contacto del referido.");
        thisController.setTooltipsOnColumnHeader($("#listaReferidos"), 9, "Nombre de cliente referido.");
        var stringEstado = "Estado actual del registro: \n" +
                            "'A' Indica que el máximo de intentos se ha alcanzado para el registro. \n" +
                            "'C' Indica que es un registro llamable. \n" +
                            "'E' Indica que el registro se excluyó del proceso de marcación (una razón es por encontrarse en la DNC). \n" +
                            "'F' Indica que el registro es no llamable y debe ser revisado por los administradores del sistema. \n" +
                            "'I' Indica que el registro está en proceso por el discador, ya sea que está en proceso de marcación o en memoria del discador a punto de ser procesado. \n" +
                            "'J' Identifica registro de prioridad. \n" +
                            "'R' Registro re agendado de forma automática, típicamente cuando el cliente agendado no contesto el sistema l re agenda de forma automática. \n" +
                            "'S' Registro agendado. \n" +
                            "'U' Registro no llamable, tipificado con un código de terminación que no permite volver a llamarlo.";

        thisController.setTooltipsOnColumnHeader($("#listaReferidos"), 10, stringEstado);
        thisController.setTooltipsOnColumnHeader($("#listaReferidos"), 11, "Agente de gestión call center");
        thisController.setTooltipsOnColumnHeader($("#listaReferidos"), 12, "Tipificación automática del sistema  a la llamada generada o del agente cuando se ha procesado ya el registro.");



   
    },
    setTooltipsOnColumnHeader: function (gridRef, iColumn, text) {
        var thd = jQuery("thead:first", gridRef[0].grid.hDiv)[0];
        jQuery("tr.ui-jqgrid-labels th:eq(" + iColumn + ")", thd).attr("title", text);
    },
    refresca: function () {
        var thisController = this;
        var gridReferidos = thisController.$this.find("#listaReferidos").jqGrid();
        gridReferidos.jqGrid("clearGridData");
        httpInvoke("getReferidos.ges", { campaignName: cicGetCampaignName(), ejecutivo: cicGetSystemAgentId() }, function (ret) {
            thisController.$this.find("#lblErrMsg").text("");
            $.each(ret, function (i, g) {
                gridReferidos.jqGrid("addRowData", g.id, g);
            });
        }, function () {
            thisController.$this.find("#lblErrMsg").text("No es posible recuperar la información de Referidos. En caso de persistir el problema contactar al Administrador del Sistema.");
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
         this.timer = setTimeout(function () {
            thisController.timer = null;
            thisController.refresca();
            enableButton(thisController.$this.find("#cmdActualizar"), true);
        }, thisController.ReloadTimer);
    }
};