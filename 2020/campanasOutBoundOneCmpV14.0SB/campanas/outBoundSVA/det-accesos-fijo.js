var controller = {
    $this: null,
    tabSelected: null,
    productos: null,
    firstLoad: true,
    init: function (container, options) {
        this.$this = $(container.children()[0]);
        var thisController = this;
        cicTrace("Venta-Accesos-Fijo - Inicio Init");

        var tabsGestion = thisController.$this.find("#tabsGestion").tabs({
            select: function (e, ui) { thisController.refrescaTab(ui.index); }
        });

        initializeTabsLayout(tabsGestion);
        

        var cmdAgregarProd = thisController.$this.find("#cmdAgregarProd").button();
        var cmdQuitarProd = thisController.$this.find("#cmdQuitarProd").button();

        cmdAgregarProd.click(function () { if (!isButtonEnabled(this)) return false; thisController.agregarProductos.call(thisController); });
        cmdQuitarProd.click(function () { if (!isButtonEnabled(this)) return false; thisController.quitarProducto.call(thisController); });

        enableButton(cmdAgregarProd, true);
        enableButton(cmdQuitarProd, false);

        var gridProductos = thisController.$this.find("#listaProdAsigFij").jqGrid({
            datatype: "local",
            autowidth: true,
            height: "350",
            rowNum: 10000,
            editable: true,
            hidegrid: false,
            colNames: ["id", "", "", "", "Producto"],
            colModel: [
			  { name: "id", index: "id", width: 1, hidden: true, key: true },
              { name: "servicio", index: "servicio", width: 1, hidden: true },
              { name: "tipo", index: "tipo", width: 1, hidden: true },
              { name: "producto", index: "producto", width: 1, hidden: true },
			  { name: "detalleProducto", index: "detalleProducto", width: 400 }
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
        attachJQGridToContainerPanel(thisController.$this.find("#cntListaProdAsigFij"), gridProductos);

        cicTrace("Venta-Accesos-Fijo - Fin Init");

    },
    refresca: function () {
        var thisController = this;
        
        cicTrace("Venta-Accesos Inicio Refresca");

        thisController.tabSelected = "Televisión";

        thisController.productos = new Array();
        
        var gridProductos = thisController.$this.find("#listaProdAsigFij").jqGrid();
        gridProductos.jqGrid("clearGridData");

        if (!thisController.firstLoad) {
            thisController.$this.find("#edTV option")[0].selected = true;
            thisController.$this.find("#edMigracionesTV option")[0].selected = true;
            thisController.$this.find("#edTipoTV option")[0].selected = true;
            thisController.$this.find("#edDecoDvr option")[0].selected = true;
            thisController.$this.find("#edDecoDht option")[0].selected = true;
            thisController.$this.find("#edCanalPrem1 option")[0].selected = true;
            thisController.$this.find("#edCanalPrem2 option")[0].selected = true;
            thisController.$this.find("#edDecoHD option")[0].selected = true;
            thisController.$this.find("#edBAF option")[0].selected = true;
            thisController.$this.find("#edTipoBAF option")[0].selected = true;
            thisController.$this.find("#edMigracionesBAF option")[0].selected = true;
            thisController.$this.find("#edBAS option")[0].selected = true;
            thisController.$this.find("#edSTB option")[0].selected = true;
            thisController.$this.find("#edMigracionesSTB option")[0].selected = true;
        }
        thisController.firstLoad = false;

        thisController.$this.find("#edGrupoISE").val("Seleccione");
        thisController.$this.find("#edLimiteCredito").val("Seleccione");
        thisController.$this.find("#edDMapas").val("Seleccione");
        thisController.$this.find("#edD21").val("Seleccione");


        cicTrace("Venta-Accesos Fin Refresca");

    },
    setActiveTabs: function (index) {
        var thisController = this;
        thisController.$this.find("#tabsGestion").tabs({ active: index });
    },
    refrescaTab: function (tabIndex) {
        var thisController = this;
        if (tabIndex == 0) {
            thisController.tabSelected = "Televisión";
        } else if (tabIndex == 1) {
            thisController.tabSelected = "Internet";
        } else {
            thisController.tabSelected = "Telefonía";
        }
    },
    agregarProductos: function () {
        var thisController = this;
        var listaProductos = new Array();

        if (thisController.tabSelected == "Televisión") {
            if (thisController.$this.find("#edTV option:selected").text() != "Sin Venta" && $.inArray(thisController.$this.find("#edTV").val(), thisController.productos) < 0) {
                var producto = {
                    servicio: "Televisión",
                    tipo: "TV",
                    producto: thisController.$this.find("#edTV").val(),
                    productoDesc: thisController.$this.find("#edTV option:selected").text()
                };
                producto.detalleProducto = producto.servicio + " - " + producto.tipo + " - " + producto.productoDesc;
                listaProductos.push(producto);
            }
            if (thisController.$this.find("#edMigracionesTV option:selected").text() != "Sin Venta" && $.inArray(thisController.$this.find("#edMigracionesTV").val(), thisController.productos) < 0) {
                var producto = {
                    servicio: "Televisión",
                    tipo: "Migraciones TV",
                    producto: thisController.$this.find("#edMigracionesTV").val(),
                    productoDesc: thisController.$this.find("#edMigracionesTV option:selected").text()
                };
                producto.detalleProducto = producto.servicio + " - " + producto.tipo + " - " + producto.productoDesc;
                listaProductos.push(producto);
            }
            if (thisController.$this.find("#edTipoTV option:selected").text() != "Sin Venta" && $.inArray(thisController.$this.find("#edTipoTV").val(), thisController.productos) < 0) {
                var producto = {
                    servicio: "Televisión",
                    tipo: "Tipo TV",
                    producto: thisController.$this.find("#edTipoTV").val(),
                    productoDesc: thisController.$this.find("#edTipoTV option:selected").text()
                };
                producto.detalleProducto = producto.servicio + " - " + producto.tipo + " - " + producto.productoDesc;
                listaProductos.push(producto);
            }
            if (thisController.$this.find("#edDecoDvr option:selected").text() != "Sin Venta" && $.inArray(thisController.$this.find("#edDecoDvr").val(), thisController.productos) < 0) {
                var producto = {
                    servicio: "Televisión",
                    tipo: "Deco DVR",
                    producto: thisController.$this.find("#edDecoDvr").val(),
                    productoDesc: thisController.$this.find("#edDecoDvr option:selected").text()
                };
                producto.detalleProducto = producto.servicio + " - " + producto.tipo + " - " + producto.productoDesc;
                listaProductos.push(producto);
            }
            if (thisController.$this.find("#edDecoDht option:selected").text() != "Sin Venta" && $.inArray(thisController.$this.find("#edDecoDht").val(), thisController.productos) < 0) {
                var producto = {
                    servicio: "Televisión",
                    tipo: "Deco DHT",
                    producto: thisController.$this.find("#edDecoDht").val(),
                    productoDesc: thisController.$this.find("#edDecoDht option:selected").text()
                };
                producto.detalleProducto = producto.servicio + " - " + producto.tipo + " - " + producto.productoDesc;
                listaProductos.push(producto);
            }
            if (thisController.$this.find("#edCanalPrem1 option:selected").text() != "Sin Canal Premium" && $.inArray(thisController.$this.find("#edCanalPrem1").val(), thisController.productos) < 0) {
                var producto = {
                    servicio: "Televisión",
                    tipo: "Canal Prem1",
                    producto: thisController.$this.find("#edCanalPrem1").val(),
                    productoDesc: thisController.$this.find("#edCanalPrem1 option:selected").text()
                };
                producto.detalleProducto = producto.servicio + " - " + producto.tipo + " - " + producto.productoDesc;
                listaProductos.push(producto);
            }
            if (thisController.$this.find("#edCanalPrem2 option:selected").text() != "Sin Canal Premium" && $.inArray(thisController.$this.find("#edCanalPrem2").val(), thisController.productos) < 0) {
                var producto = {
                    servicio: "Televisión",
                    tipo: "Canal Prem2",
                    producto: thisController.$this.find("#edCanalPrem2").val(),
                    productoDesc: thisController.$this.find("#edCanalPrem2 option:selected").text()
                };
                producto.detalleProducto = producto.servicio + " - " + producto.tipo + " - " + producto.productoDesc;
                listaProductos.push(producto);

            }
            if (thisController.$this.find("#edDecoHD option:selected").text() != "Sin Venta" && $.inArray(thisController.$this.find("#edDecoHD").val(), thisController.productos) < 0) {
                var producto = {
                    servicio: "Televisión",
                    tipo: "Deco HD",
                    producto: thisController.$this.find("#edDecoHD").val(),
                    productoDesc: thisController.$this.find("#edDecoHD option:selected").text()
                };
                producto.detalleProducto = producto.servicio + " - " + producto.tipo + " - " + producto.productoDesc;
                listaProductos.push(producto);
            }
            
        } else if (thisController.tabSelected == "Internet") {
            if (thisController.$this.find("#edBAF option:selected").text() != "Sin Venta" && $.inArray(thisController.$this.find("#edBAF").val(), thisController.productos) < 0) {
                var producto = {
                    servicio: "Internet",
                    tipo: "BAF",
                    producto: thisController.$this.find("#edBAF").val(),
                    productoDesc: thisController.$this.find("#edBAF option:selected").text()
                };
                producto.detalleProducto = producto.servicio + " - " + producto.tipo + " - " + producto.productoDesc;
                listaProductos.push(producto);
            }
            if (thisController.$this.find("#edTipoBAF option:selected").text() != "Sin Venta" && $.inArray(thisController.$this.find("#edTipoBAF").val(), thisController.productos) < 0) {
                var producto = {
                    servicio: "Internet",
                    tipo: "Tipo BAF",
                    producto: thisController.$this.find("#edTipoBAF").val(),
                    productoDesc: thisController.$this.find("#edTipoBAF option:selected").text()
                };
                producto.detalleProducto = producto.servicio + " - " + producto.tipo + " - " + producto.productoDesc;
                listaProductos.push(producto);
            }
            if (thisController.$this.find("#edMigracionesBAF option:selected").text() != "Sin Venta" && $.inArray(thisController.$this.find("#edMigracionesBAF").val(), thisController.productos) < 0) {
                var producto = {
                    servicio: "Internet",
                    tipo: "Migraciones BAF",
                    producto: thisController.$this.find("#edMigracionesBAF").val(),
                    productoDesc: thisController.$this.find("#edMigracionesBAF option:selected").text()
                };
                producto.detalleProducto = producto.servicio + " - " + producto.tipo + " - " + producto.productoDesc;
                listaProductos.push(producto);
            }
            if (thisController.$this.find("#edBAS option:selected").text() != "Sin Venta" && $.inArray(thisController.$this.find("#edBAS").val(), thisController.productos) < 0) {
                var producto = {
                    servicio: "Internet",
                    tipo: "BAS",
                    producto: thisController.$this.find("#edBAS").val(),
                    productoDesc: thisController.$this.find("#edBAS option:selected").text()
                };
                producto.detalleProducto = producto.servicio + " - " + producto.tipo + " - " + producto.productoDesc;
                listaProductos.push(producto);
            }
            
        } else {
            if (thisController.$this.find("#edSTB option:selected").text() != "Sin Venta" && $.inArray(thisController.$this.find("#edSTB").val(), thisController.productos) < 0) {
                var producto = {
                    servicio: "Telefonía",
                    tipo: "STB",
                    producto: thisController.$this.find("#edSTB").val(),
                    productoDesc: thisController.$this.find("#edSTB option:selected").text()
                };
                producto.detalleProducto = producto.servicio + " - " + producto.tipo + " - " + producto.productoDesc;
                listaProductos.push(producto);
            }
            if (thisController.$this.find("#edMigracionesSTB option:selected").text() != "Sin Venta" && $.inArray(thisController.$this.find("#edMigracionesSTB").val(), thisController.productos) < 0) {
                var producto = {
                    servicio: "Telefonía",
                    tipo: "Migraciones STB",
                    producto: thisController.$this.find("#edMigracionesSTB").val(),
                    productoDesc: thisController.$this.find("#edMigracionesSTB option:selected").text()
                };
                producto.detalleProducto = producto.servicio + " - " + producto.tipo + " - " + producto.productoDesc;
                listaProductos.push(producto);
            }
            
        }
        if (listaProductos.length > 0) {
            var grid = thisController.$this.find("#listaProdAsigFij");
            var rows = grid.getGridParam("reccount");

            $.each(listaProductos, function (i, r) {
                rows++;
                r.id = rows;
                grid.jqGrid("addRowData", r.id, r);
                thisController.productos.push(r.producto);
            });

        }
    },
    quitarProducto: function () {
        var thisController = this;

        var gridProductos = thisController.$this.find("#listaProdAsigFij");
        rowId = gridProductos.jqGrid("getGridParam", "selrow");
        if (!rowId) return;
        var idProducto = gridProductos.jqGrid("getRowData", rowId).id;
        var nombreProducto = gridProductos.jqGrid("getRowData", rowId).producto;

        gridProductos.jqGrid("delRowData", rowId);
        var index = $.inArray(nombreProducto, thisController.productos);
        thisController.productos.splice(index, 1);
    },
    getInfoVenta: function(){
        var infoVenta = new Object();
        infoVenta.datosVenta = this.getDatosVenta();
        infoVenta.productosVenta = this.getProductosVenta();
        return infoVenta;
    },
    getProductosVenta: function () {
        var thisController = this;
        var productosVenta = new Array();
        var gridProductos = thisController.$this.find("#listaProdAsigFij").jqGrid();

        productosVenta = gridProductos.jqGrid('getRowData');

        return productosVenta;

    },
    getDatosVenta: function(){
        var thisController = this;
        var datosVenta = new Object();
        var grupoIse = thisController.$this.find("#edGrupoISE option:selected").text();
        datosVenta.grupoIse = (grupoIse == "Seleccione" ? "" : grupoIse);
        var limiteCredito = thisController.$this.find("#edLimiteCredito option:selected").text();
        datosVenta.limiteCredito = (limiteCredito == "Seleccione" ? "" : limiteCredito);
        var dMapas = thisController.$this.find("#edDMapas option:selected").text();
        datosVenta.dMapas = (dMapas == "Seleccione" ? "" : dMapas);
        var d21 = thisController.$this.find("#edD21 option:selected").text();
        datosVenta.d21 = (d21 == "Seleccione" ? "" : d21);

        return datosVenta;

    },
    loadWSData: function(){
        var thisController = this;
        thisController.refrescaMixVenta();

        thisController.refrescaDetallePreventa();

    },
    refrescaMixVenta: function () {
        var thisController = this;
        cicTrace("refrescaMixVenta");
        httpInvoke("GetMixVentas.ges", {}, function (list) {
            var html = "<option value='Seleccione'>Seleccione</option>";
            $.each(list, function (i, r) {
                html += "<option value='" + r.ID_MIX_PREVENTA + "'>" + r.NOMBRE + "</option>";
            });
            thisController.$this.find("#edMixVenta").html(html);

            app.callBackFinishLoad();
        });
    },
    refrescaDetallePreventa: function () {
        var thisController = this;
        cicTrace("GetDetPreventa: Fijo");
        var parametros = {
            etiqueta: "",
            familia: "F"
        };
        httpInvoke("GetDetPreventa.ges", { param: parametros }, function (list) {
            var htmlGISE = "<option value='Seleccione'>Seleccione</option>";
            var htmlLC = "<option value='Seleccione'>Seleccione</option>";
            var htmlDMAP = "<option value='Seleccione'>Seleccione</option>";
            var htmlD21 = "<option value='Seleccione'>Seleccione</option>";
            var htmlTV   = "";
            var htmlMTV  = "";
            var htmlTTV  = "";
            var htmlDDVR = "";
            var htmlDDTH = "";
            var htmlCHP1 = "";
            var htmlCHP2 = "";
            var htmlDHD  = "";
            var htmlBAF  = "";
            var htmlTBAF = "";
            var htmlMBAF = "";
            var htmlBAS  = "";
            var htmlSTB  = "";
            var htmlMSTB = "";
            $.each(list, function (i, r) {
                switch($.trim(r.ETIQUETA)){
                    case "GISE":
                        htmlGISE+="<option value='" + r.ID_TIPO_DET_PREVENTA + "'>" + r.VALOR + "</option>";
                        break;
                    case "LC":
                        htmlLC += "<option value='" + r.ID_TIPO_DET_PREVENTA + "'>" + r.VALOR + "</option>";
                        break;
                    case "DMAP":
                        htmlDMAP += "<option value='" + r.ID_TIPO_DET_PREVENTA + "'>" + r.VALOR + "</option>";
                        break;
                    case "D21":
                        htmlD21 += "<option value='" + r.ID_TIPO_DET_PREVENTA + "'>" + r.VALOR + "</option>";
                        break;
                    case "TV":
                        htmlTV += "<option value='" + r.ID_TIPO_DET_PREVENTA + "'>" + r.VALOR + "</option>";
                        break;
                    case "MTV":
                        htmlMTV += "<option value='" + r.ID_TIPO_DET_PREVENTA + "'>" + r.VALOR + "</option>";
                        break;
                    case "TTV":
                        htmlTTV += "<option value='" + r.ID_TIPO_DET_PREVENTA + "'>" + r.VALOR + "</option>";
                        break;
                    case "DDVR":
                        htmlDDVR += "<option value='" + r.ID_TIPO_DET_PREVENTA + "'>" + r.VALOR + "</option>";
                        break;
                    case "DDTH":
                        htmlDDTH += "<option value='" + r.ID_TIPO_DET_PREVENTA + "'>" + r.VALOR + "</option>";
                        break;
                    case "CHP1":
                        htmlCHP1 += "<option value='" + r.ID_TIPO_DET_PREVENTA + "'>" + r.VALOR + "</option>";
                        break;
                    case "CHP2":
                        htmlCHP2 += "<option value='" + r.ID_TIPO_DET_PREVENTA + "'>" + r.VALOR + "</option>";
                        break;
                    case "DHD":
                        htmlDHD += "<option value='" + r.ID_TIPO_DET_PREVENTA + "'>" + r.VALOR + "</option>";
                        break;
                    case "BAF":
                        htmlBAF += "<option value='" + r.ID_TIPO_DET_PREVENTA + "'>" + r.VALOR + "</option>";
                        break;
                    case "TBAF":
                        htmlTBAF += "<option value='" + r.ID_TIPO_DET_PREVENTA + "'>" + r.VALOR + "</option>";
                        break;
                    case "MBAF":
                        htmlMBAF += "<option value='" + r.ID_TIPO_DET_PREVENTA + "'>" + r.VALOR + "</option>";
                        break;
                    case "BAS":
                        htmlBAS += "<option value='" + r.ID_TIPO_DET_PREVENTA + "'>" + r.VALOR + "</option>";
                        break;
                    case "STB":
                        htmlSTB += "<option value='" + r.ID_TIPO_DET_PREVENTA + "'>" + r.VALOR + "</option>";
                        break;
                    case "MSTB":
                        htmlMSTB += "<option value='" + r.ID_TIPO_DET_PREVENTA + "'>" + r.VALOR + "</option>";
                        break;
                }
            });

            thisController.$this.find("#edGrupoISE").html(htmlGISE);
            thisController.$this.find("#edLimiteCredito").html(htmlLC);
            thisController.$this.find("#edDMapas").html(htmlDMAP);
            thisController.$this.find("#edD21").html(htmlD21);
            thisController.$this.find("#edTV").html(htmlTV);
            thisController.$this.find("#edMigracionesTV").html(htmlMTV);
            thisController.$this.find("#edTipoTV").html(htmlTTV);
            thisController.$this.find("#edDecoDvr").html(htmlDDVR);
            thisController.$this.find("#edDecoDht").html(htmlDDTH);
            thisController.$this.find("#edCanalPrem1").html(htmlCHP1);
            thisController.$this.find("#edCanalPrem2").html(htmlCHP2);
            thisController.$this.find("#edDecoHD").html(htmlDHD);
            thisController.$this.find("#edBAF").html(htmlBAF);
            thisController.$this.find("#edTipoBAF").html(htmlTBAF);
            thisController.$this.find("#edMigracionesBAF").html(htmlMBAF);
            thisController.$this.find("#edBAS").html(htmlBAS);
            thisController.$this.find("#edSTB").html(htmlSTB);
            thisController.$this.find("#edMigracionesSTB").html(htmlMSTB);

            app.callBackFinishLoad();
        }, null, true);
    }
};