var controller = {
    $this: null,
    onGetNumeroMaximoLlamadas: null,
    init: function (container, options) {
        this.$this = $(container.children()[0]);
        var thisController = this;
        this.$this.find("#lblNombreCampana").text(cicGetCampaignName());
    },
    refresca: function (isConnected) {
        var thisController = this;
        cicTrace("Header Inicio Refresca");

        var tituloCamp = cicGetCallFamiliaId();
        var tituloCamp2 = tituloCamp.toLowerCase();
        if (campana.estado == "call" ) {
            if (tituloCamp == 'FIJ' || tituloCamp == 'Fij') {
                thisController.$this.find("#Titulo").html('Campa&ntilde;a Fijo');
            } else if (tituloCamp == 'MOV' || tituloCamp == 'Mov') {
                thisController.$this.find("#Titulo").html('Campa&ntilde;a Movil');
            } else if (tituloCamp == 'MIG' || tituloCamp == 'Mig') {
                thisController.$this.find("#Titulo").html('Campa&ntilde;a Migracion');
            }else if (tituloCamp == 'SVALD' || tituloCamp == 'Svald' || tituloCamp == 'Svm' || tituloCamp == 'Svf' || tituloCamp == 'SVF' || tituloCamp == 'SVM') {
                thisController.$this.find("#Titulo").html('Campa&ntilde;a Sva');
            }
        }

        if (campana.estado == "break" || campana.estado == "waiting") {
            thisController.$this.find("#iconoEstadoLlamada").hide();
            $('.fondo-oscuro').css('background-color', '#00344e');
            thisController.$this.find("#nBase2").html("");
        }else if (isConnected == "undefined" || isConnected == null) {
            thisController.$this.find("#iconoEstadoLlamada").hide();
        } else {
            thisController.$this.find("#iconoEstadoLlamada").show();
            if (isConnected) {
                thisController.$this.find("#iconoEstadoLlamada").attr("src", "img/icons/conectado.png")
            } else {
                thisController.$this.find("#iconoEstadoLlamada").attr("src", "img/icons/desconectado.png");
            }
        }


        thisController.$this.find("#lblNombreCampana").text(cicGetCampaignName());

        if (campana.estado == "waiting" || campana.estado == "break") {
            thisController.$this.find("#contenedorDatosRegistro").hide();
            thisController.$this.find("#Titulo").html("");
            thisController.$this.find("#nBase").html("");


        } else if (campana.estado == "call" || campana.estado == "preview") {

            var accCampana = cicGetAccCampanaId();
            thisController.$this.find("#nBase2").html(accCampana);
            
            thisController.$this.find("#contenedorDatosRegistro").show();
            var msgCallId ="Call ID: " + cicGetCallId();
            var msgFono   ="Fono  : " + cicGetAccLineaId();//modificado de    infoGestion.phoneNumber = cicGetNumberToDial();   16072018 
            if (campana.estado == "preview") $('.fondo-oscuro').css('background-color', '#00FF00');           

            if (cicGetSbxReferido() == "R") {
                
                thisController.$this.find("#Titulo").html('Cliente Referido');

                if (cicGetSbxConvergencia() == "A") {
                    thisController.$this.find("#Titulo").html("");
                    thisController.$this.find("#Titulo").html('Cliente Referido Agendado');
                }

            } else if (cicGetSbxReferido() == "A") {

                thisController.$this.find("#Titulo").html('Cliente Agendado');

                if (cicGetSbxConvergencia() == "A") {
                    thisController.$this.find("#Titulo").html("");
                    thisController.$this.find("#Titulo").html('Cliente Agendado');
                }


            } else if (cicGetSbxReferido() == "C") {

                thisController.$this.find("#Titulo").html('Cliente  Convergente');

                if (cicGetSbxConvergencia() == "A") {
                    thisController.$this.find("#Titulo").html("");
                    thisController.$this.find("#Titulo").html('Cliente Convergente Agendado');
                }

            } else {

               // thisController.$this.find("#Titulo").html("");
            }
            

        
			var intentosActuales = parseInt(cicGetAttemps());

			if (isNaN(intentosActuales)) campana.estado == "preview" ?  intentosActuales = -1 : intentosActuales = 0;

            var intentosDisponibles = thisController.onGetNumeroMaximoLlamadas() - (intentosActuales + 1);

            if (intentosDisponibles < 0) intentosDisponibles = 0;

            var msgIntentos = " Intentos Disponibles: " + intentosDisponibles;
            
            thisController.$this.find("#callId").text(msgCallId);
            thisController.$this.find("#fono").text(msgFono);
            thisController.$this.find("#Intentos").text(msgIntentos);


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