var securityToken = null;
var llamadasPendientes = {};
var mensajeLlamadasMultiples = "Por favor espere a que la llamada anterior al servidor finalice antes de ejecutar una nueva petición.";
var urlBase = "Dispatcher.asmx/dispatch";
var urlBase_ticket = "Dispatcher.asmx/validaTicket";
var urlBase_IVR = "Dispatcher.asmx/sendCallIVRDCP";

function httpInvoke(serviceName, arg, success, error, permiteLlamadasMultiples) {
	if (!permiteLlamadasMultiples) {
		if (llamadasPendientes[serviceName] == true) {
			alert("[" + serviceName + "]" + mensajeLlamadasMultiples);
			if (error) error(mensajeLlamadasMultiples);
			return null;
		}
		llamadasPendientes[serviceName] = true;
	}
	if (arg == null) arg={};
	if (securityToken != null) arg.token = securityToken;
	var jArgs = $.toJSON(arg);
	var postData = $.toJSON({ serviceName: serviceName, jArgs: jArgs });
	return $.ajax({
	    url: urlBase,
	    type: "POST",
	    contentType: "application/json; charset=utf-8",
	    //data: encodeURIComponent(postData),
	    data: postData,
	    dataType: "json",
		success: function (jRet) {
		    llamadasPendientes[serviceName] = false;
		    var ret = $.evalJSON(jRet.d);

		    if (ret.status == "OK") {
		        if (success != null) {
		            if (ret.object != null) {
		                if (ret.basicReturnType) success(ret.object.value);
		                else success(ret.object);
		            }
		            else if (ret.collection != null) success(ret.collection);
		            else success();
		        }
		    } else {
		        if (error != null) {
		            error(ret.message);
		        } else {
		            showMsgBoxAlert(ret.message, "Error Interno Servicio");
		        }
		    }
		},
		error: function (jqXHR, textStatus, errorThrown) {
		    llamadasPendientes[serviceName] = false;
		    if (error != null) {
		        var msg = "Existe un error de comunicación con los servicios. Favor intente nuevamente. <br>Si el problema persiste contacte al administrador."
		        error(textStatus);
		    } else if (textStatus != "abort") {
		        var msg = "Existe un error de comunicación con los servicios. Favor intente nuevamente. <br>Si el problema persiste contacte al administrador."
		        //alert(textStatus, "Error");
                showMsgBoxAlert(msg, "Error Comunicación");
		    }		        
		}
	});
}

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}
