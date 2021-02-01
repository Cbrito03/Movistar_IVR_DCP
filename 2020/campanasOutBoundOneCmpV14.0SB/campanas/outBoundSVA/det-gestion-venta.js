var controller = {
    $this: null,
    productos: null,
    init: function (container, options) {
        this.$this = $(container.children()[0]);
        var thisController = this;
        var cmdAgregarProd = thisController.$this.find("#cmdAgregarProd").button();
        var cmdQuitarProd = thisController.$this.find("#cmdQuitarProd").button();

        cmdAgregarProd.click(function () { if (!isButtonEnabled(this)) return false; thisController.agregarProductos.call(thisController); });
        cmdQuitarProd.click(function () { if (!isButtonEnabled(this)) return false; thisController.quitarProducto.call(thisController); });

        enableButton(cmdAgregarProd, true);
        enableButton(cmdQuitarProd, false);

        var gridProductos = thisController.$this.find("#listaProdAsig").jqGrid({
            datatype: "local",
            autowidth: true,
            rowNum: 10000,
            hidegrid: false,
            colNames: ["id", "", "Producto", ],
            colModel: [
			  { name: "id", index: "id", hidden: true, key: true },
              { name: "producto", index: "producto", hidden: true },
			  { name: "detalleProducto", index: "detalleProducto", width: 300 }
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
        attachJQGridToContainerPanel(thisController.$this.find("#cntListaProdAsig"), gridProductos);

        thisController.$this.find("#edPlan").change(function (event) {
            var selected = $(this).find('option:selected');

            //Codigo Plan
            thisController.$this.find("#edCodigoPlan").val(selected.val());

        });

        thisController.$this.find("#edCodigoPlan").change(function (event) {
            var selected = $(this).find('option:selected');

            //Codigo Plan
            thisController.$this.find("#edPlan").val(selected.val());

        });

    },
    refresca: function () {
        var thisController = this;
        
        thisController.productos = new Array();

        var gridProductos = thisController.$this.find("#listaProdAsig").jqGrid();
        gridProductos.jqGrid("clearGridData");

        thisController.loadWSData();

        thisController.$this.find("#edObservacionesVenta").val("");

    },
    agregarProductos: function () {
        var thisController = this;

        if (thisController.$this.find("#edPlan").val() == "Seleccione" || thisController.$this.find("#edCodigoPlan").val() == "Seleccione") {
            showMsgBoxAlert("Debe seleccionar Plan o Código de Plan");
            return;
        }

        var plan = thisController.$this.find("#edPlan option:selected").text();
        
        var producto = new Object();
        producto.detalleProducto = plan;
        producto.producto = thisController.$this.find("#edPlan").val();

        if ($.inArray(producto.producto, thisController.productos) > -1) return;

        var grid = thisController.$this.find("#listaProdAsig");
        var rows = grid.getGridParam("reccount");

        rows++;
        producto.id = rows;
        grid.jqGrid("addRowData", producto.id, producto);

        thisController.productos.push(producto.producto);
        
    },
    quitarProducto: function () {
        var thisController = this;

        var gridProductos = thisController.$this.find("#listaProdAsig");
        rowId = gridProductos.jqGrid("getGridParam", "selrow");
        if (!rowId) return;
        var producto = gridProductos.jqGrid("getRowData", rowId).producto;

        gridProductos.jqGrid("delRowData", rowId);
        var index = $.inArray(producto, thisController.productos);
        thisController.productos.splice(index, 1);
    },
    getDatosVenta: function () {
        var thisController = this;
        var datosVenta = new Object();
        
        datosVenta.obs = thisController.$this.find("#edObservacionesVenta").val();

        return datosVenta;

    },
    getProductosVenta: function () {
        var thisController = this;
        var productosVenta = new Array();
        var gridProductos = thisController.$this.find("#listaProdAsig").jqGrid();

        productosVenta = gridProductos.jqGrid('getRowData');

        return productosVenta;

    },
    loadWSData: function () {
        var thisController = this;      
        var familia = "";
		/*
		if (cicGetCallFamiliaId() == "SVF") familia = "SF";
        if (cicGetCallFamiliaId() == "SVM") familia = "SM";
        if (cicGetCallFamiliaId() == "SVLD") familia = "SL";
				
		*/
		
		if (cicGetCallFamiliaId().toUpperCase() === "SVF") familia = "SF";
        if (cicGetCallFamiliaId().toUpperCase() === "SVM") familia = "SM";
        if (cicGetCallFamiliaId().toUpperCase() === "SVALD") familia = "SL";
        
        thisController.getPlanes(familia);
    },
    getPlanes: function (familia) {
        var thisController = this;
        var parametros = {
            familia: familia
        };
        httpInvoke("GetPlanes.ges", { param: parametros }, function (list) {
            thisController.refrescaPlanes(list);


        }, null, true);
    },
    refrescaPlanes: function (planes) {
        var thisController = this;

        var html = "<option value='Seleccione'>Seleccione</option>";
        var html_C = "<option value='Seleccione'>Seleccione</option>";
        $.each(planes, function (i, r) {
            html += "<option value='" + r.ID_PRODUCTO + "'>" + r.PLAN + " [" + r.COD_PLAN + "]</option>";
            html_C += "<option value='" + r.ID_PRODUCTO + "'>" + r.COD_PLAN + " [" + r.PLAN + "]</option>";
        });

        thisController.$this.find("#edPlan").html(html);
        thisController.$this.find("#edCodigoPlan").html(html_C);

    }
};