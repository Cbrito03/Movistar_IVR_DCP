var controller = {
    $this: null,
    init: function (container, options) {
        this.$this = $(container.children()[0]);

        var thisController = this;
        cicTrace("Detalle Oferta - Inicio Init");

        cicTrace("Detalle Oferta - Fin Init");

    },
    refresca: function () {
        var thisController = this;
        cicTrace("Oferta Inicio Refresca");
        thisController.$this.find("#edTipoRequerimiento").val(cicGetGenerico06());
        thisController.$this.find("#edCodigoPlan").val(cicGetGenerico10());
        thisController.$this.find("#edOrigen").val(cicGetGenerico08());
        thisController.$this.find("#edNumeroOferta").val(cicGetOferP1Cod());
        thisController.$this.find("#edCategoria").val(cicGetGenerico07());
        thisController.$this.find("#edCodigoEquipo").val(cicGetGenerico09());
        thisController.$this.find("#edPrecioOferta").val(cicGetOferP1Precio());
        thisController.$this.find("#edTipoSolicitud").val(cicGetGenerico11());
        thisController.$this.find("#edNombreOferta").val(cicGetOferP1Desc()); 
        thisController.$this.find("#edMix").val(cicGetGenerico12());
        cicTrace("Oferta Fin Refresca");
    },
    getInfoOferta: function () {
        var thisController = this;
        var datosOferta = new Object();

        datosOferta.tipoRequerimiento = vendeOferta ? thisController.$this.find("#edTipoRequerimiento").val() : "";
        datosOferta.codigoPlan = vendeOferta ? thisController.$this.find("#edCodigoPlan").val() : "";
        datosOferta.origen = vendeOferta ? thisController.$this.find("#edOrigen").val() : "";
        datosOferta.numeroOferta = vendeOferta ? thisController.$this.find("#edNumeroOferta").val() : "";
        datosOferta.categoria = vendeOferta ? thisController.$this.find("#edCategoria").val() : "";
        datosOferta.codigoEquipo = vendeOferta ? thisController.$this.find("#edCodigoEquipo").val() : "";
        datosOferta.precioOferta = vendeOferta ? thisController.$this.find("#edPrecioOferta").val() : "";
        datosOferta.tipoSolicitud = vendeOferta ? thisController.$this.find("#edTipoSolicitud").val() : "";
        datosOferta.nombreOferta = vendeOferta ? thisController.$this.find("#edNombreOferta").val() : "";
        
        return datosOferta;
    }
};