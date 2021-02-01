var controller = {
    $this: null,
    onGetEstadoAgente: null,
    init: function (container, options) {
        this.$this = $(container.children()[0]);
    },
    refresca: function () {
        var thisController = this;
        var msg = "Usted se encuentra en estado '" + thisController.onGetEstadoAgente() + "', no está recibiendo llamadas";
        cicTrace("Refresca Break " + msg);
        thisController.$this.find("#lblMensaje").text(msg);
    }
};