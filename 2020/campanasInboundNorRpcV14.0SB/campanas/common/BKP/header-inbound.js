var controller = {
    $this: null,
    onGetNumeroMaximoLlamadas: null,
    onGetIntentosManual: null,
    onGetMetaDataObject: null,
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
            thisController.$this.find("#lblOrigen").html("");
            thisController.$this.find("#lblNombreCampana").html("");
            thisController.$this.find("#fono").html("");
            thisController.$this.find("#callId").html("");
            thisController.$this.find("#clase").html("");
            thisController.$this.find("#infoIntentos").html("");
            
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

            var metaDataObject = thisController.onGetMetaDataObject();

            var attTipoServicio = (metaDataObject ? metaDataObject.attTipoServicio : attGetTipoServicio());
            var numberToDial = (metaDataObject ? metaDataObject.phoneNumber : cicGetNumberToDial());
            var campaignName = (metaDataObject ? metaDataObject.i3Campaignname : cicGetCampaignName());
            var familia = (metaDataObject ? metaDataObject.callFamiliaId : cicGetCallFamiliaId());
            var sxbReferido = (metaDataObject ? metaDataObject.sxbReferido : cicGetSbxReferido());
            var sxbConvergencia = (metaDataObject ? metaDataObject.sxbConvergencia : cicGetSbxConvergencia());
            var attOrigen = "";
            if (app.isInboundCall) {
                attOrigen = (metaDataObject ? metaDataObject.attOrigen : attGetOrigen());
            } else {
                attOrigen = cicGetGenerico16();
            }                                    

			if (numberToDial.indexOf("sip:") > -1 || numberToDial.indexOf("@") > -1) {
                numberToDial = numberToDial.replace("sip:", "");
                numberToDial = numberToDial.substring(0, numberToDial.indexOf("@"));
            }

            if (app.isInboundCall) {

                $('.fondo-oscuro').css('background-color', '#00344e');

                thisController.$this.find("#tipo").html(attTipoServicio);

                thisController.$this.find("#contenedorDatosRegistro").show();

                var msgCallId = "Call ID: " + cicGetCallId();
                var msgFono = "Fono  : " + numberToDial;

                var clase = "";
                if (familia && familia.toUpperCase().indexOf("FIJ") > -1) clase = "Fijo";
                if (familia && familia.toUpperCase().indexOf("MOV") > -1) clase = "Móvil";

                var maxIntentosManuales = thisController.onGetNumeroMaximoLlamadas("manual");

                var infoIntentos = "Intentos: ";
                //infoIntentos += "[Manual " + thisController.onGetIntentosManual() + (maxIntentosManuales > 0 ? " de " + maxIntentosManuales : "") + "]";               
                infoIntentos += "[Manual " + thisController.onGetIntentosManual() + "]";

                thisController.$this.find("#callId").html(msgCallId);
                thisController.$this.find("#fono").html(msgFono);
                thisController.$this.find("#lblNombreCampana").html(campaignName);       
                thisController.$this.find("#clase").html(clase);
                thisController.$this.find("#lblOrigen").html(attOrigen);
                thisController.$this.find("#infoIntentos").html(infoIntentos);

            } else {

                var tipo = "";

                thisController.$this.find("#contenedorDatosRegistro").show();
                var msgCallId = "Call ID: " + cicGetCallId();
                var msgFono = "Fono  : " + numberToDial;


                if (campana.estado == "preview") $('.fondo-oscuro').css('background-color', '#00FF00');

                var tipo =  "";

                if (familia.substring(0,3) == "NOR"){
                    tipo = "Inbound Normal";
                }else{
                    tipo = "Inbound Repercutido";
                    attOrigen = "";
                }                

                var clase = "";
                if (familia && familia.toUpperCase().indexOf("FIJ") > -1) clase = "Fijo";
                if (familia && familia.toUpperCase().indexOf("MOV") > -1) clase = "Móvil";

                var maxIntentosManuales = thisController.onGetNumeroMaximoLlamadas("manual");
                var maxIntentosDiscador = thisController.onGetNumeroMaximoLlamadas("discador");

                var intentos = cicGetAttemps();
                if (!intentos) intentos = 0;

                var infoIntentos = "Intentos:"
                /*
                infoIntentos += "[Discador " + (parseInt(intentos) + 1) + (maxIntentosDiscador > 0 ? " de " + maxIntentosDiscador : "") + "]";
                infoIntentos += "[Manual " + thisController.onGetIntentosManual() + (maxIntentosManuales > 0 ? " de " + maxIntentosManuales : "") + "]";
                */

                infoIntentos += "[Discador " + (parseInt(intentos) + 1) + "]";
                infoIntentos += "[Manual " + thisController.onGetIntentosManual() + "]";

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
                        tipo += ' Callback Agendado';
                    } else {
                        tipo += ' Callback';
                    }
                }

                if (!app.hasLastCallExecuteManual) thisController.$this.find("#tipo").html(tipo);

                thisController.$this.find("#callId").html(msgCallId);
                thisController.$this.find("#fono").html(msgFono);
                thisController.$this.find("#clase").html(clase);
                thisController.$this.find("#lblNombreCampana").html(campaignName);
                thisController.$this.find("#infoIntentos").html(infoIntentos);
                thisController.$this.find("#lblOrigen").html(attOrigen);

            }
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