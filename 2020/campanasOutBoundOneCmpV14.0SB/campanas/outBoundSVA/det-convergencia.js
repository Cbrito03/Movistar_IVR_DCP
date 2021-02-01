var controller = {
    $this: null,
    init: function (container, options) {
        this.$this = $(container.children()[0]);
        var thisController = this;
        thisController.$this.find("#edConvergencia").removeAttr("checked");
    },
    refresca: function () {
        var thisController = this;
        thisController.$this.find("#edConvergenciaM").removeAttr("checked");
        thisController.$this.find("#edConvergenciaF").removeAttr("checked");
    },
    setActiveTabs: function (index) {
        var thisController = this;
        thisController.$this.find("#tabsCierre").tabs({ active: index });
    },
    checkConvergencia: function () {
        var thisController = this;
        var checkConvergenciaF = thisController.$this.find("#edConvergenciaF").is(':checked') ? "1" : "0";
        var checkConvergenciaM = thisController.$this.find("#edConvergenciaM").is(':checked') ? "1" : "0";

            var pais = cicGetCallPaisId();
            var callCenter = cicGetCallCallCenterId();
            var checkConvergencia = 0;
            if (checkConvergenciaF == 1 || checkConvergenciaM == 1) {

                checkConvergencia = 1;

            }


            if (checkConvergenciaF == 1) {
                var ConvFijo = 'S';
            } else {
                var ConvFijo = 'N';
            }
            
            if (checkConvergenciaM == 1) {
                var ConvMovil = 'S';
            } else {
                var ConvMovil = 'N';
            }
            var parametros = {
                pais: pais,
                callCenter: callCenter,
                checkConvergenciaF: checkConvergenciaF,
                checkConvergenciaM: checkConvergenciaM,
                checkConvergencia : checkConvergencia,
                convFijo: ConvFijo,
                convMovil: ConvMovil
            };

            return parametros;
    }

   
};