var controller = {
    $this: null,
    productos: null,
    marcas: new Array(),
    modelosEquipos: new Array(),
    infoPlanes: new Array(),
    onBackSucursales: null,
    init: function (container, options) {
        this.$this = $(container.children()[0]);
        var thisController = this;
        cicTrace("Venta-Accesos-Movil - Inicio Init");
        var cmdAgregarProd = thisController.$this.find("#cmdAgregarProd").button();
        var cmdQuitarProd = thisController.$this.find("#cmdQuitarProd").button();

        cmdAgregarProd.click(function () { if (!isButtonEnabled(this)) return false; thisController.agregarProductos.call(thisController); });
        cmdQuitarProd.click(function () { if (!isButtonEnabled(this)) return false; thisController.quitarProducto.call(thisController); });

        enableButton(cmdAgregarProd, true);
        enableButton(cmdQuitarProd, false);

        var gridProductos = thisController.$this.find("#listaProdAsigMov").jqGrid({
            datatype: "local",
            autowidth: true,
            rowNum: 10000,
            editable: true,
            hidegrid: false,
            colNames: ["Id", "", "Producto", "Ciclo Fact.", "Tipo de Venta", "Fono a Portar", "Empresa", "Modo de Pago", "Cuotas", "Seguro"],
            colModel: [
			  { name: "id", index: "id", width: 1, hidden: true, key: true },
              { name: "idProducto", index: "idProducto", width: 1, hidden: true },
			  { name: "descPlan", index: "descPlan", width: 300 },
              { name: "cicloFacturacion", index: "cicloFacturacion", align: "center", width: 60 },
              { name: "TipoVenta", index: "TipoVenta", align: "center", width: 100 },
              { name: "fonoAPortar", index: "fonoAPortar", align: "center", width: 80 },
              { name: "OperadorDonante", index: "OperadorDonante", align: "center", width: 100 },
              { name: "modoPago", index: "modoPago", align: "center", width: 80 },
              { name: "cuota", index: "cuota", align: "center", width: 80 },
              { name: "ContratoSeguro", index: "ContratoSeguro", align: "center", width: 60, formatter: checkFormatter, unformat: checkUnformatter }
            ],
            caption: "Productos Vendidos de Parrilla",
            ondblClickRow: function (rowid, iRow, iCol, e) {
                clearSelection();
                thisController.quitarProducto();
            },
            onSelectRow: function (id) {
                var sel = (id != undefined);
                enableButton(cmdQuitarProd, sel);
            }
        });

        function checkFormatter(cellvalue, options, rowObject) {
            var html = "<div>";
            html += "<input id='edCheckVenta" + options.rowId + "' type='checkbox' disabled='disabled' " + (cellvalue ? "checked='checked'" : "") + "></input>";
            html += "</div>";
            return html;
        }

        function checkUnformatter(cellvalue, options, cell) {
            return thisController.$this.find('#edCheckVenta' + options.rowId).is(':checked');
        }

        attachJQGridToContainerPanel(thisController.$this.find("#cntListaProdAsigMov"), gridProductos);

        thisController.$this.find("#edCodigoPlan").change(function (event) {
            var selected = $(this).find('option:selected');
            
            //Equipos
            var equipoSelected = thisController.$this.find("#edModeloEquipo").val();

            if (selected.val() != "Seleccione") {
                var planSelected = $.grep(thisController.infoPlanes, function (plan) {
                    return ((plan.COD_PLAN + "|" + plan.PLAN) == selected.val());
                })[0];
                var equipos = planSelected.EQUIPOS.split(",");

                var listEquipos = $.grep(thisController.modelosEquipos, function (equipo) {
                    return $.inArray(equipo.ID.toString(), equipos) > -1;
                });

            } else {
                var listEquipos = thisController.modelosEquipos;
            }

            thisController.refrescaEquipos(listEquipos, equipoSelected);

            //Marcas
            var equipos = listEquipos;
            var marcaSelected = thisController.$this.find("#edMarca").val();

            if (selected.val() != "Seleccione") {
                var idsMarcas = new Array();
                $.each(equipos, function (i, equipo) {
                    if ($.inArray(equipo.ID_MARCA, idsMarcas) == -1) {
                        idsMarcas.push(equipo.ID_MARCA);
                    }
                });

                var listMarcas = $.grep(thisController.marcas, function (marca) {
                    return $.inArray(marca.ID, idsMarcas) > -1;
                });
            } else {
                var listMarcas = thisController.marcas;
            }

            thisController.refrescaMarcas(listMarcas, marcaSelected);

            thisController.$this.find('#edMarca').trigger('change');

        });

        thisController.$this.find("#edMarca").change(function (event) {
            var selected = $(this).find('option:selected');

            //Equipo
            var equipoSelected = thisController.$this.find("#edModeloEquipo").val();
            if (selected.val() != "Seleccione") {
                listEquipos = $.grep(thisController.modelosEquipos, function (equipo) {
                    return equipo.ID_MARCA == selected.val();
                });
            } else {
                var listEquipos = thisController.modelosEquipos;
            }

            var planSelected = thisController.$this.find("#edCodigoPlan").val();

            if (planSelected != "Seleccione") {
                var planSelecionado = $.grep(thisController.infoPlanes, function (plan) {
                    return ((plan.COD_PLAN + "|" + plan.PLAN) == planSelected);
                })[0];
                var equiposFiltrados = planSelecionado.EQUIPOS.split(",");
                var equiposValidos = new Array();
                $.each(listEquipos, function (i, equipo) {
                    if ($.inArray(equipo.ID.toString(), equiposFiltrados) > -1) {
                        equiposValidos.push(equipo);
                    }
                });
                var equipos = equiposValidos;
            } else {
                var equipos = listEquipos;
            }
            thisController.refrescaEquipos(equipos, equipoSelected);

            //Planes-CodPlanes
            if (selected.val() != "Seleccione") {
                var listPlanes = new Array();
                $.each(equipos, function (i, equipo) {
                    var planes = $.grep(thisController.infoPlanes, function (plan) {
                        var equiposPlan = plan.EQUIPOS.split(",");
                        return $.inArray(equipo.ID.toString(), equiposPlan) > -1
                    });
                    $.each(planes, function (i, plan) {
                        if ($.inArray(plan.ID, listPlanes) == -1) {
                            listPlanes.push(plan);
                        }
                    })
                })
            } else {
                var listPlanes = thisController.infoPlanes;
            }

            thisController.refrescaCodigoPlanes(listPlanes, planSelected);

        });

        thisController.$this.find("#edModeloEquipo").change(function (event) {
            var selected = $(this).find('option:selected');

            //Marca
            var marcaSelected = thisController.$this.find("edMarca").val();

            if (selected.val() != "Seleccione") {
                var listMarcas = $.grep(thisController.marcas, function (marca) {
                    return marca.ID == selected.data('marca');
                });
            } else {
                var listMarcas = thisController.marcas;
            }

            thisController.refrescaMarcas(listMarcas, marcaSelected);

            //Planes-CodPlanes
            var planSelected = thisController.$this.find("#edCodigoPlan").val();

            if (selected.val() != "Seleccione") {
                var listPlanes = $.grep(thisController.infoPlanes, function (plan) {
                    var equipos = plan.EQUIPOS.split(",");
                    return $.inArray(selected.val(), equipos) > -1
                })
            } else {
                var listPlanes = thisController.infoPlanes;
            }

            thisController.refrescaCodigoPlanes(listPlanes, planSelected);


        });

        thisController.$this.find("#edModoPago").change(function (event) {
            var modoPago = thisController.$this.find("#edModoPago").val();
            if (modoPago == 3301) {
                thisController.$this.find("#edCuotas").attr("disabled", "disabled");
                thisController.$this.find('#edCuotas').val("Seleccione");
            } else {
                thisController.$this.find("#edCuotas").removeAttr("disabled");
            }
        });

        thisController.$this.find("#edTipoVenta").change(function (event) {
            var tipoVenta = thisController.$this.find("#edTipoVenta").val();
            if (tipoVenta == 3801) {
                thisController.$this.find("#edFonoPortar").attr("disabled", "disabled");
                thisController.$this.find('#edOperadorDonante').val('Seleccione');
                thisController.$this.find("#edOperadorDonante").attr("disabled", "disabled");
                thisController.$this.find("#edFonoPortar").val('');

            } else {
                thisController.$this.find("#edFonoPortar").removeAttr("disabled");
                thisController.$this.find("#edOperadorDonante").removeAttr("disabled");
            }


        });

        thisController.$this.find(".telefono").inputmask({ mask: "99999999[9]", "placeholder": "" });
        thisController.$this.find(".telefono").blur(function () {
            if ($(this).val().length == 0) return;
            if (!$(this).inputmask("isComplete")) {
                showMsgBoxAlert("El telefono debe contener 8 o 9 dí­gitos");
                $(this).val("");
            }
        });

        cicTrace("Venta-Accesos-Movil - Fin Init");
    },
    refresca: function () {
        var thisController = this;
        cicTrace("Venta-Accesos Inicio Refresca");

        thisController.productos = new Array();

        var gridProductos = thisController.$this.find("#listaProdAsigMov").jqGrid();
        gridProductos.jqGrid("clearGridData");

        thisController.$this.find("#edOperadorDonante").val("Seleccione");
        thisController.$this.find("#edTipoCliente").val("Seleccione");
        thisController.$this.find("#edSexo").val("Seleccione");
        thisController.$this.find("#edEstadoCivil").val("Seleccione");
        thisController.$this.find("#edTipoVenta").val("Seleccione");
        thisController.$this.find("#edModoPago").val("Seleccione");
        thisController.$this.find("#edCuotas").val("Seleccione");
        thisController.$this.find("#edFonoPortar").val("");
        thisController.$this.find("#edSeguroMovistar").removeAttr("checked");

        if (cicGetCliCicloCod()) thisController.$this.find("#edCicloFacturacion").val(cicGetCliCicloCod());
        else thisController.$this.find("#edCicloFacturacion").val("Seleccione");

        thisController.refrescaCodigoPlanes(thisController.infoPlanes, "Seleccione");
        thisController.refrescaMarcas(thisController.marcas, "Seleccione");
        thisController.refrescaEquipos(thisController.modelosEquipos, "Seleccione");

        thisController.$this.find("#edFonoPortar").removeAttr("disabled");
        thisController.$this.find("#edOperadorDonante").removeAttr("disabled");
        thisController.$this.find("#edCuotas").removeAttr("disabled");

        cicTrace("Venta-Accesos Fin Refresca");

    },
    getProductosVenta: function () {
        var thisController = this;
        var productosVenta = new Array();
        var gridProductos = thisController.$this.find("#listaProdAsigMov").jqGrid();

        productosVenta = gridProductos.jqGrid('getRowData');

        return productosVenta;

    },
    agregarProductos: function () {
        var thisController = this;
        
        if (thisController.$this.find("#edCodigoPlan").val() == "Seleccione") {
            showMsgBoxAlert("Debe seleccionar Plan");
            return;
        }
        
        if (thisController.$this.find("#edMarca").val() == "Seleccione" || thisController.$this.find("#edModeloEquipo").val() == "Seleccione") {
            showMsgBoxAlert("Debe seleccionar Plan o Código de Plan");
            return;
        }

        var plan = thisController.$this.find("#edCodigoPlan option:selected").text();
        var marca = thisController.$this.find("#edMarca option:selected").text();
        var equipo = thisController.$this.find("#edModeloEquipo option:selected").text();
        var cicloFacturacion = thisController.$this.find("#edCicloFacturacion option:selected").text();
        var fonoAPortar = thisController.$this.find("#edFonoPortar").val();

        var OperadorDonante = thisController.$this.find("#edOperadorDonante option:selected").text();
        var TipoVenta = thisController.$this.find("#edTipoVenta option:selected").text();
        var modoPago = thisController.$this.find("#edModoPago option:selected").text();
        var cuota = thisController.$this.find("#edCuotas option:selected").text();
        var ContratoSeguro = thisController.$this.find("#edSeguroMovistar").is(':checked');
        var TipoVentaValidacion = thisController.$this.find("#edTipoVenta").val();

        var Concat = "Debe Seleccionar :\n";

        if (thisController.$this.find("#edCicloFacturacion").val() == "Seleccione") {
            Concat += "- Ciclo de Facturación\n";
        }

        if (TipoVenta == 'Seleccione') {
            Concat += "- Tipo De Venta\n";
        }
        if (modoPago == 'Seleccione') {
            Concat += "- Modo De pago\n";
            if (cuota == 'Seleccione') {
                Concat += "- Cuota\n";
            }
        } else {
            if (cuota == 'Seleccione' && modoPago == "Crédito") {
                Concat += "- Cuota\n";
            }
        }

        if ((TipoVentaValidacion == 'Seleccione' || TipoVentaValidacion == 31 || TipoVentaValidacion == 32) && (thisController.$this.find("#edFonoPortar").val().length < 1)) {

            Concat += "- Fono a portar\n";

            if (OperadorDonante == 'Seleccione') {
                Concat += "- Empresa u Operador Donante\n";
            }

        } else {
            if (OperadorDonante == 'Seleccione' && fonoAPortar.length > 1) {
                Concat += "- Empresa u Operador Donante\n";
            }

        }

        if (Concat.length > 20) {
            showMsgBoxAlert(Concat);
            return;
        }

        var producto = new Object();
        producto.descPlan = plan + " - " + marca + " " + equipo;    
        
        var planSelected = $.grep(thisController.infoPlanes, function (plan) {
            return ((plan.COD_PLAN + "|" + plan.PLAN) == thisController.$this.find("#edCodigoPlan").val());
        })[0];

        var equipos = planSelected.EQUIPOS.split(",");

        var indexEquipo = $.inArray(thisController.$this.find("#edModeloEquipo").val(), equipos);

        if (indexEquipo == -1) {
            showMsgBoxAlert("No se puede recuperar el identificador del producto");
            return;
        }

        var productos = planSelected.PRODUCTOS.split(",");

        var idProducto = productos[indexEquipo];

        //if ($.inArray(idProducto, thisController.productos) > -1) return;

        producto.idProducto = idProducto;
        producto.cicloFacturacion = cicloFacturacion;
        producto.fonoAPortar = fonoAPortar;
        producto.OperadorDonante = (OperadorDonante == "Seleccione" ? "" : OperadorDonante);
        producto.TipoVenta = TipoVenta;
        producto.modoPago = modoPago;
        producto.cuota = (cuota == "Seleccione" ? "" : cuota);
        producto.ContratoSeguro = ContratoSeguro;

        var grid = thisController.$this.find("#listaProdAsigMov");
        var rows = grid.getGridParam("reccount");

        rows++;
        producto.id = rows;
        grid.jqGrid("addRowData", producto.id, producto);

        thisController.productos.push(producto.id);

    },
    quitarProducto: function () {
        var thisController = this;

        var gridProductos = thisController.$this.find("#listaProdAsigMov");
        rowId = gridProductos.jqGrid("getGridParam", "selrow");
        if (!rowId) return;
        
        gridProductos.jqGrid("delRowData", rowId);
        var index = $.inArray(rowId, thisController.productos);
        thisController.productos.splice(index, 1);
    },
    getInfoVenta: function () {
        var infoVenta = new Object();
        infoVenta.datosVenta = this.getDatosVenta();
        infoVenta.productosVenta = this.getProductosVenta();
        return infoVenta;
    },
    getProductosVenta: function () {
        var thisController = this;
        var productosVenta = new Array();

        var gridProductos = thisController.$this.find("#listaProdAsigMov").jqGrid();

        productosVenta = gridProductos.jqGrid('getRowData');

        return productosVenta;

    },
    getDatosVenta: function () {
        var thisController = this;
        var datosVenta = new Object();

        var thisController = this;
        var datosVenta = new Object();
        var sexo = thisController.$this.find("#edSexo option:selected").text();
        datosVenta.sexo = (sexo == "Seleccione" ? "" : sexo);
        var estadoCivil = thisController.$this.find("#edEstadoCivil option:selected").text();
        datosVenta.estadoCivil = (estadoCivil == "Seleccione" ? "" : estadoCivil);

        return datosVenta;

    },
    loadWSData: function () {
        var thisController = this;

        thisController.refrescaDetallePreventa();        

        thisController.getMarcas();
        thisController.getEquipos();
        thisController.getPlanes();

    },
    refrescaDetallePreventa: function () {
        var thisController = this;
        cicTrace("GetDetPreventa: Movil");
        var parametros = {
            etiqueta: "",
            familia: "M"
        };

        httpInvoke("GetDetPreventa.ges", { param: parametros }, function (list) {
            var htmlOD = "<option value='Seleccione'>Seleccione</option>";
            var htmlTC = "<option value='Seleccione'>Seleccione</option>";
            var htmlSexo = "<option value='Seleccione'>Seleccione</option>";
            var htmlEC = "<option value='Seleccione'>Seleccione</option>";
            var htmlCF= "<option value='Seleccione'>Seleccione</option>";
            var htmlTV = "<option value='Seleccione'>Seleccione</option>";
            var htmlMP = "<option value='Seleccione'>Seleccione</option>";
            var htmlCuotas = "<option value='Seleccione'>Seleccione</option>";

            $.each(list, function (i, r) {
                switch ($.trim(r.ETIQUETA)) {
                    case "OD":
                        htmlOD += "<option value='" + r.ID_TIPO_DET_PREVENTA + "'>" + r.VALOR + "</option>";
                        break;
                    case "TC":
                        htmlTC += "<option value='" + r.ID_TIPO_DET_PREVENTA + "'>" + r.VALOR + "</option>";
                        break;
                    case "SX":
                        htmlSexo += "<option value='" + r.ID_TIPO_DET_PREVENTA + "'>" + r.VALOR + "</option>";
                        break;
                    case "EC":
                        htmlEC += "<option value='" + r.ID_TIPO_DET_PREVENTA + "'>" + r.VALOR + "</option>";
                        break;
                    case "CF":
                        htmlCF += "<option value='" + r.ID_TIPO_DET_PREVENTA + "'>" + r.VALOR + "</option>";
                        break;
                    case "TVE":
                        htmlTV += "<option value='" + r.ID_TIPO_DET_PREVENTA + "'>" + r.VALOR + "</option>";
                        break;
                    case "MP":
                        htmlMP += "<option value='" + r.ID_TIPO_DET_PREVENTA + "'>" + r.VALOR + "</option>";
                        break;
                    case "CU":
                        htmlCuotas += "<option value='" + r.ID_TIPO_DET_PREVENTA + "'>" + r.VALOR + "</option>";
                        break;
                }

                thisController.$this.find("#edOperadorDonante").html(htmlOD);
                thisController.$this.find("#edTipoCliente").html(htmlTC);
                thisController.$this.find("#edSexo").html(htmlSexo);
                thisController.$this.find("#edEstadoCivil").html(htmlEC);
                thisController.$this.find("#edCicloFacturacion").html(htmlCF);
                thisController.$this.find("#edTipoVenta").html(htmlTV);
                thisController.$this.find("#edModoPago").html(htmlMP);
                thisController.$this.find("#edCuotas").html(htmlCuotas);

            });

            app.callBackFinishLoad();
        }, null, true);
    },
    getMarcas: function () {
        var thisController = this;
        cicTrace("GetMarcas");
        httpInvoke("GetMarcas.ges", {}, function (list) {
            thisController.marcas = list;
            thisController.refrescaMarcas(list);

            app.callBackFinishLoad();
        }, null, true);
    },
    getEquipos: function () {
        var thisController = this;
        cicTrace("GetModelosEquipos");
        httpInvoke("GetModelosEquipos.ges", {}, function (list) {
            thisController.modelosEquipos = list;
            thisController.refrescaEquipos(list);

            app.callBackFinishLoad();
        }, null, true);
    },
    getPlanes: function () {
        var thisController = this;
        cicTrace("GetPlanes");
        var parametros = new Object();
        parametros.familia = "M";
        httpInvoke("GetPlanes.ges", {param: parametros}, function (list) {
            thisController.infoPlanes = list;            
            thisController.refrescaCodigoPlanes(list);
            app.callBackFinishLoad();
        }, null, true);
    },
    refrescaMarcas: function (list, selectedValue) {
        var thisController = this;

        var html = "<option value='Seleccione'>Seleccione</option>";
        $.each(list, function (i, r) {
            html += "<option value='" + r.ID + "'>" + r.NOMBRE + "</option>";
        });

        thisController.$this.find("#edMarca").html(html);

        if (list.length == 1) {
            thisController.$this.find("#edMarca option")[1].selected = true;
        } else {
            thisController.$this.find("#edMarca").val(selectedValue);
        }

    },
    refrescaEquipos: function (list, selectedValue) {
        var thisController = this;
        
        var html = "<option value='Seleccione'>Seleccione</option>";
        $.each(list, function (i, r) {
            html += "<option value='" + r.ID + "' data-marca='" + r.ID_MARCA + "'>" + r.NOMBRE + "</option>";
        });
        thisController.$this.find("#edModeloEquipo").html(html);

        if (list.length == 1) {
            thisController.$this.find("#edModeloEquipo option")[1].selected = true;
        } else {
            thisController.$this.find("#edModeloEquipo").val(selectedValue);
        }

    },
    refrescaCodigoPlanes: function (list, selectedValue) {
        var thisController = this;
        
        var html = "<option value='Seleccione'>Seleccione</option>";
        $.each(list, function (i, r) {
            html += "<option value='" + r.COD_PLAN + "|" + r.PLAN + "'>" + r.COD_PLAN + " [" + r.PLAN + "]</option>";
        });

        thisController.$this.find("#edCodigoPlan").html(html);

        if (list.length == 1) {
            thisController.$this.find("#edCodigoPlan option")[1].selected = true;
        } else {
            thisController.$this.find("#edCodigoPlan").val(selectedValue);
        }

    }
};