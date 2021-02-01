var controller = {
    $this: null,
    getCliente: null,
    init: function (container, options) {
        this.$this = $(container.children()[0]);
        var thisController = this;
        thisController.$this.find("#edConvergencia").removeAttr("checked");
        thisController.$this.find("#ConvNombreCliente").attr("disabled", "disabled");
		thisController.$this.find("#ConvRutCliente").attr("disabled", "disabled");
		thisController.$this.find("#ConvFonoContacto1").attr("disabled", "disabled");
		thisController.$this.find("#ConvFonoContacto2").attr("disabled", "disabled");
        thisController.$this.find("#convComuna").attr("disabled", "disabled");
        thisController.$this.find("#ConvCalleResp").attr("disabled", "disabled");
        thisController.$this.find("#ConvNumeroResp").attr("disabled", "disabled");
        thisController.$this.find("#convRegion").attr("disabled", "disabled");
        thisController.$this.find("#convComunaDesc").attr("disabled", "disabled");
        thisController.$this.find("#convRegionDesc").attr("disabled", "disabled");

        var cmdGenerarConvergencia = thisController.$this.find("#edConvergencia");
        thisController.$this.find("#ConvObservaciones").attr('maxlength', 200);
        thisController.$this.find("#ConvObservaciones").keyup(function (e)
        {
            var maximoCaracteres = 200;
            var box = $(this).val();
            var resta = maximoCaracteres - box.length;
            thisController.$this.find('#caja').html(resta);
  
            if (box.length > 200) {
                thisController.$this.find('#caja').html(200);
                var recortePalabra = thisController.$this.find("#ConvObservaciones").val();
                var res = recortePalabra.slice(0, 200);
                thisController.$this.find("#ConvObservaciones").val(res);
                var restaMaximo = maximoCaracteres - res.length;
                thisController.$this.find('#caja').html(restaMaximo);
                showMsgBoxAlert("No debe exceder los 200 caracteres", "Validación Observación");
               
            } else {

                if (resta <= 0) {
                    thisController.$this.find("#ConvObservaciones").attr('maxlength', 200);
                } else {

                    thisController.$this.find("#ConvObservaciones").removeAttr("maxlength");

                }
            }
            

        });

        cmdGenerarConvergencia.click(function () {


            var VerificacionDatos = thisController.$this.find("#ConvNombreCliente").val();

            var checkConvergencia = thisController.$this.find("#edConvergencia").is(':checked') ? "1" : "0";

            if (checkConvergencia = "0" && VerificacionDatos) {
                thisController.$this.find("#ConvNombreCliente").val("");
                thisController.$this.find("#convComuna").val("");
                thisController.$this.find("#ConvCalleResp").val("");
                thisController.$this.find("#ConvNumeroResp").val("");
                thisController.$this.find("#convRegion").val("");
                thisController.$this.find("#ConvFonoContacto1").val("");
                thisController.$this.find("#ConvRutCliente").val("");
                thisController.$this.find("#ConvFonoContacto2").val("");
                thisController.$this.find("#convComunaDesc").val("");
                thisController.$this.find("#convRegionDesc").val("");

                
                
            } else {

                thisController.getConvergencia.call(thisController);
            }

        });




    },
    refresca: function () {
        var thisController = this;
        thisController.$this.find("#edConvergencia").removeAttr("checked");
        thisController.$this.find("#ConvObservaciones").removeAttr("maxlength");
        thisController.$this.find("#ConvNombreCliente").val("");
        thisController.$this.find("#ConvRutCliente").val("");
        thisController.$this.find("#convComuna").val("");
        thisController.$this.find("#ConvCalleResp").val("");
        thisController.$this.find("#ConvNumeroResp").val("");
        thisController.$this.find("#convRegion").val("");
        thisController.$this.find("#ConvFonoContacto1").val("");
		thisController.$this.find("#ConvFonoContacto2").val("");
		thisController.$this.find("#ConvObservaciones").val("");
		thisController.$this.find("#convComunaDesc").val("");
		thisController.$this.find("#convRegionDesc").val("");
    },
    setActiveTabs: function (index) {
        var thisController = this;
        thisController.$this.find("#tabsCierre").tabs({ active: index });
    },
    checkConvergencia: function () {
        var thisController = this;
        var checkConvergencia = thisController.$this.find("#edConvergencia").is(':checked') ? "1" : "0";

            var pais = cicGetCallPaisId();
            var callCenter = cicGetCallCallCenterId();
            var ConvFijo = 'S';
            var ConvMovil = 'N';
        
            var parametros = {
                pais: pais,
                callCenter: callCenter,
                checkConvergencia: checkConvergencia,
                convFijo: ConvFijo,
                convMovil: ConvMovil
            };

            return parametros;
    },
    getConvergencia: function () {
        var thisController = this;

        //Check Datos Cliente
        var cliente = thisController.getCliente();


        if (!cliente.nombreCli) {
            showMsgBoxAlert("Debe ingresar el 'Nombre Cliente' en la pesta\u00f1a Clientes antes de generar una Convergencia", "Nombre No Ingresado");
            thisController.$this.find("#edConvergencia").removeAttr("checked");
            return;
        } else {

            var cliLength = cliente.nombreCli.length;
            if (cliLength > 100) {
                showMsgBoxAlert("Excedi\u00F3 largo permitido para el nombre del Cliente, \n por favor modifique nombre en pesta\u00f1a Cliente", "Valdiación Nombre");
                thisController.$this.find("#edConvergencia").removeAttr("checked");
                return;
            }
        }

		if (!cliente.rutCli) {
		    showMsgBoxAlert("Debe ingresar el 'Rut' en la pesta\u00f1a Clientes  antes de generar una Convergencia", "Rut No Ingresado");
            thisController.$this.find("#edConvergencia").removeAttr("checked");
            return;
		}

		if (!cliente.numeroCli) {
		    showMsgBoxAlert("Debe ingresar el 'N\u00famero' en la pesta\u00f1a Clientes  antes de generar una Convergencia", "Numero No Ingresado");
		    thisController.$this.find("#edConvergencia").removeAttr("checked");
		    return;
		} else {

		    var numeroLength = cliente.numeroCli.length;
		    if (numeroLength > 6) {
		        showMsgBoxAlert("Excedi\u00F3 largo permitido para el numero de direcci\u00F3n, \n por favor modifique numero de direcci\u00F3n en pesta\u00f1a Cliente", "Validacion Numero")
		        thisController.$this.find("#edConvergencia").removeAttr("checked");
		        return;
		    }
		}

        if (!cliente.calleCli) {
            showMsgBoxAlert("Debe ingresar la 'Calle' en la pesta\u00f1a Clientes  antes de generar una Convergencia", "Calle No ingresada");
            thisController.$this.find("#edConvergencia").removeAttr("checked");
            return;
        } else {
            var calleLength = cliente.calleCli.length;
            if (calleLength > 40) {
                showMsgBoxAlert("Excedi\u00F3 largo permitido para calle, \n por favor modifique calle en pesta\u00f1a Cliente", "Validacion Calle")
                thisController.$this.find("#edConvergencia").removeAttr("checked");
                return;

            }
        }

        if (!cliente.regionCli) {
            showMsgBoxAlert("Debe ingresar la 'Regi\u00f3n' en la pesta\u00f1a Clientes  antes de generar una Convergencia", "Region No Ingresada");
            thisController.$this.find("#edConvergencia").removeAttr("checked");
            return;
        } else {
            var regionLength = cliente.regionCli.length;
            if (regionLength > 20) {
                showMsgBoxAlert("Excedi\u00F3 largo permitido para regi\u00F3n, \n por favor modifique regi\u00F3n en pesta\u00f1a Cliente", "Validacion Region")
                thisController.$this.find("#edConvergencia").removeAttr("checked");
                return;
            }
        }

        if (!cliente.comunaCli) {
            showMsgBoxAlert("Debe ingresar la 'Comuna' en la pesta\u00f1a Clientes  antes de generar una Convergencia", "Comuna No Ingresada");
            thisController.$this.find("#edConvergencia").removeAttr("checked");
            return;
        } else {
            var comunaLength = cliente.comunaCli.length;
            if (comunaLength > 40) {
                showMsgBoxAlert("Excedi\u00F3 largo permitido para comuna, \n por favor modifique comuna en pesta\u00f1a Cliente", "Validacion Comuna");
                thisController.$this.find("#edConvergencia").removeAttr("checked");
                return;
            }
        }



        thisController.$this.find("#ConvFonoContacto1").val(cicGetNumberToDial());
		thisController.$this.find("#ConvFonoContacto2").val(cliente.fono1Cli);
        thisController.$this.find("#ConvNombreCliente").val(cliente.nombreCli);
		thisController.$this.find("#ConvRutCliente").val(cliente.rutCli);
        thisController.$this.find("#convComuna").val(cliente.comunaCli);
        thisController.$this.find("#ConvCalleResp").val(cliente.calleCli);
        thisController.$this.find("#ConvNumeroResp").val(cliente.numeroCli);
        thisController.$this.find("#convRegion").val(cliente.regionCli);
        thisController.$this.find("#convComunaDesc").val(cliente.comunaDescConvCli);
        thisController.$this.find("#convRegionDesc").val(cliente.regionDescConvCli);




    },
    getInfoConvergencia: function () {
        var thisController = this;
        var cliente = new Object();
        cliente.fono1Cli = thisController.$this.find("#ConvFonoContacto1").val();
        cliente.fono2Cli = thisController.$this.find("#ConvFonoContacto2").val();
        cliente.nombreCli = thisController.$this.find("#ConvNombreCliente").val();
		cliente.rutCli = thisController.$this.find("#ConvRutCliente").val();
        cliente.comunaCli = thisController.$this.find("#convComuna").val();
        cliente.calleCli = thisController.$this.find("#ConvCalleResp").val();
        cliente.numeroCli = thisController.$this.find("#ConvNumeroResp").val();
        cliente.regionCli = thisController.$this.find("#convRegion").val();
        cliente.Observaciones = thisController.$this.find("#ConvObservaciones").val();
        
        return cliente;

    }


   
};