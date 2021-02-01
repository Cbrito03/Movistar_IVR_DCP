var securityToken = null;
var llamadasPendientes = {};
var bandera_ticket = false;
var amountObject = {};
var mensajeLlamadasMultiples = "Por favor espere a que la llamada anterior al servidor finalice antes de ejecutar una nueva petición.";
var urlBase = "Dispatcher.asmx/dispatch";

var url_ws = "http://esb.tchile.local:8011/AccountReceivables/PaymentManagement/PaymentManagementInterface/FindAccountDebts/V1";

var url_ws_DCP = "https://apix-dev.movistar.cl/";

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

function httpVaidaTicket(ticket)
{
    var result;

    var SendObj = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:typ="http://telefonica.cl/AccountReceivables/PaymentManagement/PaymentManagementInterface/FindAccountDebts/V1/types" xmlns:v1="http://telefonica.cl/EnterpriseApplicationIntegration/TEFHeader/V1">'+
        '<soapenv:Header/>'+
        '<soapenv:Body>'+
        '<typ:FindAccountDebtsRequest>'+
            '<typ:header>'+
                '<v1:userLogin>fpagos</v1:userLogin>'+
                '<v1:serviceChannel></v1:serviceChannel>'+
                '<!--Optional:-->'+
                '<v1:sessionCode>123456</v1:sessionCode>'+
                '<v1:application>Front de pagos COL</v1:application>'+
                '<!--Optional:-->'+
                '<v1:idMessage>1234</v1:idMessage>'+
                '<v1:ipAddress>1.1.1.1</v1:ipAddress>'+
                '<!--Optional:-->'+
                '<v1:functionalityCode>Anything</v1:functionalityCode>'+
                '<v1:transactionTimestamp>2020-09-28T12:36:00</v1:transactionTimestamp>'+
                '<v1:serviceName>ConsultaIntegral</v1:serviceName>'+
                '<v1:version>2.3</v1:version>'+
            '</typ:header>'+
            '<typ:data>'+
                '<typ:serviceName>ConsultaIntegral</typ:serviceName>'+
                '<typ:IDType>CodigoNumerico</typ:IDType>'+
                '<typ:IDValue>'+ticket+'</typ:IDValue>'+
                '<!--Optional:-->'+
                '<typ:secondaryIDType />'+
                '<!--Optional:-->'+
                '<typ:secondaryIDValue />'+
                '<typ:biller>800</typ:biller>'+
                '<typ:thirdPartyPayee>'+
                '<typ:partyRoleId>169001</typ:partyRoleId>'+
                '<typ:party>'+
                '<typ:partyId>1</typ:partyId>'+
                '</typ:party>'+
                '</typ:thirdPartyPayee>'+
                '<typ:operationDate>2020-09-28T12:36:00</typ:operationDate>'+
                '<!--Optional:-->'+
                '<typ:paging>'+
                '<!--Optional:-->'+
                '<typ:pageSize>0</typ:pageSize>'+
                '<!--Optional:-->'+
                '<typ:pageNumber>1</typ:pageNumber>'+
                '<!--Optional:-->'+
                '<typ:numberOfRows>0</typ:numberOfRows>'+
                '<!--Optional:-->'+
                '<typ:hasMore>false</typ:hasMore>'+
                '</typ:paging>'+
            '</typ:data>'+
        '</typ:FindAccountDebtsRequest>'+
    '</soapenv:Body>'+
    '</soapenv:Envelope>';

    var settings = {
        "async": false,
        "cache": false,
        "type": "POST",
        "crossDomain": true,
        "url": url_ws,
        "data": SendObj,
        "contentType": 'text/xml',
        "dataType": "xml"        
    };

    $.ajax(settings).done(function ( data, textStatus, jqXHR )
    {
        var msg = jqXHR.responseXML;

        var statusCode, statusDescription, amount;

        var x = msg.getElementsByTagName("typ:status");
        var y = msg.getElementsByTagName("typ:billingCustomerList")[0];
            y = y.getElementsByTagName("typ:billingCustomer")[0];
            y = y.getElementsByTagName("typ:customerAccountBalanceList")[0];
            y = y.getElementsByTagName("typ:customerAccountBalance")[0];
            y = y.getElementsByTagName("typ:paymentItem")[0];
            y = y.getElementsByTagName("typ:customerPayment")[0];
            y = y.getElementsByTagName("typ:amount")[0];
            
        amount = y.getElementsByTagName("typ:amount")[0].childNodes[0].nodeValue;
        
        for (var i = 0; i < x.length; i++)
        {
            statusCode = x[i].getElementsByTagName("typ:statusCode")[0].childNodes[0].nodeValue;
            statusDescription = x[i].getElementsByTagName("typ:statusDescription")[0].childNodes[0].nodeValue;
        }
        
        var ret = 
        {
            "statusCode" : statusCode,
            "statusDescription" : statusDescription,
            "amount" : amount,
            "ticket" : ticket
        };
        
        result = ret;
    }
    ).fail(function(jqXHR, textStatus, errorThrown)
    {
        var ret = 
        {
            "statusCode" : "Error",
            "statusDescription" : "Se genero un error al realizar consumir el Webservices",
            "amount" : 0,
            "ticket" : ticket
        };
        
        result = ret;             
    });

    return result;
}

function httpSendCallIVRDCP(postData, success, error)
{
    return $.ajax({
        url: url_ws_DCP + "SendCallIVRDCP",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: postData,
        dataType: "json",
        success: function (jRet)
        {
            var ret = $.evalJSON(jRet);

            if (ret.status == "OK")
            {
                success(ret);                
            }
            else
            {
                if (error != null)
                {
                    error(ret);
                }
                else
                {
                    showMsgBoxAlert(ret, "Error Interno Servicio RDCP");
                }
            }
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            if (error != null)
            {
                var msg = "Existe un error de comunicación con los servicios RDCP. Favor intente nuevamente. <br>Si el problema persiste contacte al administrador."
                error(textStatus);
            }
            else if (textStatus != "abort")
            {
                var msg = "Existe un error de comunicación con los servicios RDCP. Favor intente nuevamente. <br>Si el problema persiste contacte al administrador."
                showMsgBoxAlert(msg, "Error Comunicación");
            }               
        }
    });
}