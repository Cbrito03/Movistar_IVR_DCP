var controller = {
    $this: null,
    onGetNumeroMaximoLlamadas: null,
    init: function (container, options) {
        this.$this = $(container.children()[0]);
        var thisController = this;
        this.$this.find("#lblNombreCampana").text("");
    },
    refresca: function (isConnected) {
        var thisController = this;

        cicTrace("Header Inicio Refresca");             

        if (campana.estado == "break" || campana.estado == "waiting") {
            thisController.$this.find("#iconoEstadoLlamada").hide();
            $('.fondo-oscuro').css('background-color', '#00344e');

            thisController.$this.find("#contenedorDatosRegistro").hide();
            thisController.$this.find("#tipo").html("");
            thisController.$this.find("#lblNombreCampana").html("");
            thisController.$this.find("#ofertaNro1").html("");
            thisController.$this.find("#ofertaNro2").html("");
            thisController.$this.find("#limiteCredito").html("");
            thisController.$this.find("#fono").html("");
            thisController.$this.find("#callId").html("");

        } else {

            if (isConnected == "undefined" || isConnected == null) {
                thisController.$this.find("#iconoEstadoLlamada").hide();

            } else {

                thisController.$this.find("#iconoEstadoLlamada").show();
                if (isConnected) {
                    thisController.$this.find("#iconoEstadoLlamada").attr("src", "img/icons/conectado.png")
                } else {
                    thisController.$this.find("#iconoEstadoLlamada").attr("src", "img/icons/desconectado.png");
                }

            }

           
            var numberToDial = cicGetNumberToDial();
            var campaignName = cicGetCampaignName();
            var familia = cicGetCallFamiliaId();
            var sxbReferido = cicGetSbxReferido();
            var sxbConvergencia = cicGetSbxConvergencia();
            var oferP1Desc = cicGetOferP1Desc();
            var oferP2Desc = cicGetOferP2Desc();
            var limiteCredito = cicGetOferP1Precio();
            
            var tipo = familia;

            if (tipo.toUpperCase() == "RWF") tipo = "Recupero Web Fijo";
            if (tipo.toUpperCase() == "RWM") tipo = "Recupero Web Móvil";

            thisController.$this.find("#contenedorDatosRegistro").show();
            var msgCallId = "Call ID: " + cicGetCallId();
            var msgFono = "Fono: " + numberToDial;
            var msgOfertaNro1 = "Oferta Solicitada: " + oferP1Desc;
            var msgOfertaNro2 = "Oferta Sugerida: " + oferP2Desc;
            var msgLimiteCredito = "Límite Crédito: " + limiteCredito;

            if (campana.estado == "preview") $('.fondo-oscuro').css('background-color', '#00FF00');

            if (sxbReferido == "R") {
                if (sxbConvergencia == "A") {
                    tipo += ' Referido Agendado';
                } else {
                    tipo += ' Referido';
                }
            } else if (sxbReferido == "A") {
                tipo += ' Agendado';
            } else if (sxbReferido == "C") {
                if (sxbConvergencia == "A") {
                    tipo += ' Convergente Agendado';
                } else {
                    tipo += ' Convergente';
                }
            } 

            thisController.$this.find("#tipo").html(tipo);

            thisController.$this.find("#callId").html(msgCallId);
            thisController.$this.find("#fono").html(msgFono);
            thisController.$this.find("#ofertaNro1").html(msgOfertaNro1);
            thisController.$this.find("#ofertaNro2").html(msgOfertaNro2);
            thisController.$this.find("#limiteCredito").html(msgLimiteCredito);
            thisController.$this.find("#lblNombreCampana").html(campaignName);

           
        }

        cicTrace("Header Fin Refresca");
    },
    parseFecha: function (fechaIn) {
        if (fechaIn == "undefined" || !fechaIn) {
            return "";
        }

        else {
            var anio = fechaIn.substring(0, 4);
            var mes = fechaIn.substring(5, 7);
            var dia = fechaIn.substring(8, 10);
            var fechaFinal = dia + "/" + mes + "/" + anio;
            return fechaFinal;
        }
    }
};