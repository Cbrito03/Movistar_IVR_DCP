var urlBase_Ticket = "Dispatcher.asmx/validaTicket";

var urlBase_IVR = "Dispatcher.asmx/sendCallIVRDCP";

var bandera_ticket = false;
var amountObject = {};

$(".ticketV").blur(function ()
{
    var ticketAValidar = $(this).val();

    var tick = ticketAValidar.split("");
       
    var rutAsNumber = parseInt(ticketAValidar.substring(0, tick.length - 1));

    if (isNaN(rutAsNumber))
    {
        /*showMsgBoxAlert*/alert("El ticket tiene que ser solo números");
        $(this).val("");
        return ;
    }
	
	$("#edSpeedDial").find("option[value='xxxx']").remove();

	httpVaidaTicket(ticketAValidar, function (resp)
    {
        console.log("ONBlur :: resp :: ", resp);
		
		if (resp.statusCode === "0")
        {
            bandera_ticket = true;
            amountObject = resp;
            //showMsgBoxAlert(resp.statusDescription, "Validación Ticket");
            alert(resp.statusDescription);
            $("#edSpeedDial").append("<option value='xxxx'>IVR de pago (ciega)</option>");
            
        }
        else if(resp.statusCode != "0")
        {
			//$("#edSpeedDial").append("<option value='xxxx'>IVR de pago (ciega)</option>");
            bandera_ticket = false; // tiene que ser false
            amountObject = resp;
            //showMsgBoxAlert(resp.statusDescription, "Validación Ticket")
            alert(resp.statusDescription);
            $(this).val("");
        }
    },function (error)
    {
        //showMsgBoxAlert(resp.statusDescription + " - " + error.statusCode, "Error Validación Ticket")
        alert(error.statusDescription);
        console.log("ONBlur :: error :: ", error);
    });
});

function transferir()
{
	alert(bandera_ticket);
	console.log("amountObject :: ", amountObject);
	
	if (bandera_ticket)
    {
        //cicTrace("El ticket es valido y ejecutara el webServices httpSendCallIVRDCP");
		
		var postData = {
			"transId" : amountObject.ticket,
			"entityId" : "ec01",
			"merchantId" : "merchantId01",
			"originTel" : "990512907", // ANI
			"clientId" : "0",
			"transAmount" : amountObject.amount,
			"transAmountSinIVA" : "45600",
			"transAmountIVA" : "78900",
			"tokenized" : "0",
			"channel":"DCP",
			"aditionalData1": amountObject.ticket,
			"aditionalData2": "opcional2"
        }
				
		httpSendCallIVRDCP(postData, function (resp)
		{
			$("#edSpeedDial").find("option[value='xxxx']").remove();
			console.log("transferir :: resp :: ", resp);	
			//showMsgBoxAlert(resp.description, "Transferncia");
			alert(resp.description);	
		},function (error)
		{
			$("#edSpeedDial").find("option[value='xxxx']").remove();
			//showMsgBoxAlert(error.description + " - " + error.statusCode, "Error Transferencia")
			alert(error.description + " - " + error.statusCode);
			console.log("transferir :: error :: ", error);
		});
    }
    else
    {
		alert(bandera_ticket);
        console.log(bandera_ticket);
        return; 
    } 
}

function httpVaidaTicket(ticket, success, error, p_timeOut) 
{
    var result;

    var url_ws = "http://esb.tchile.local:8011/AccountReceivables/PaymentManagement/PaymentManagementInterface/FindAccountDebts/V1";

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
    
    var postData = { ticket: ticket, SendObj: SendObj, url_ws: url_ws };

    return $.ajax({
        timeout: p_timeOut,
        url: urlBase_Ticket,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: $.toJSON(postData),
        dataType: "json",
        success: function (jRet)
        {
            console.log("success :: jRet :: ",jRet);

            /*parser = new DOMParser();
            msg = parser.parseFromString(jRet.d,"text/xml");*/
			
			msg = new ActiveXObject("Microsoft.XMLDOM");
			msg.async = false;
			msg.loadXML(jRet.d); 

            console.log("Exito",msg);
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
                "amount" : 16,//amount,
                "ticket" : ticket
            };           

            success(ret);
            
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            console.log("Error :: jqXHR :: ",jqXHR);
            console.log("Error :: textStatus :: ",textStatus);
            console.log("Error :: errorThrown :: ",errorThrown);
			
			var msg = "Existe un error de comunicación con los servicios. Favor intente nuevamente. <br>Si el problema persiste contacte al administrador."

            var ret = 
            {
                "statusCode" : errorThrown,
                "statusDescription" : textStatus,
                "ticket" : ticket
            };
			
            /*showMsgBoxAlert*/ console.log(msg, "Error Comunicación");
			
            error(ret);                        
        }
    });
}

function httpSendCallIVRDCP(postData, success, error, p_timeOut)
{
	var url_ws_DCP = "https://apix-dev.movistar.cl/paymentManagement/V3/SendCallIVRDCP";

    objeto = JSON.stringify(postData);
    
    var postData = { SendObj: objeto, url_ws: url_ws_DCP };
    
    return $.ajax({
        timeout: p_timeOut,
        url: urlBase_IVR,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: $.toJSON(postData),
        dataType: "json",
        success: function (jRet)
        {
            var ret = JSON.parse(jRet.d)
			
			if(ret.status.code == "0000")
			{
				var result = 
				{
					"statusCode" : ret.status.code,
					"description" : ret.status.description,
					"transID" : ret.data.transID
				};
				
				success(result);
			}
			else 
			{
				var result = 
				{
					"statusCode" : ret.estado.codigoEstado,
					"description" : ret.estado.glosaEstado
				};
				
				error(result);
			}				
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            console.log("Error :: jqXHR :: ",jqXHR);
            console.log("Error :: textStatus :: ",textStatus);
            console.log("Error :: errorThrown :: ",errorThrown);
			
            var msg = "";
			
            if (error != null)
            {
                msg = "Existe un error de comunicación con los servicios. Favor intente nuevamente. <br>Si el problema persiste contacte al administrador."
                /*showMsgBoxAlert*/ console.log(msg, "Error Comunicación");
            }
            else if (textStatus != "abort")
            {
                msg = "Existe un error de comunicación con los servicios. Favor intente nuevamente. <br>Si el problema persiste contacte al administrador."
                /*showMsgBoxAlert*/ console.log(msg, "Error Comunicación");
            }
            
            var ret = 
            {
                "statusCode" : textStatus,
                "description" : msg,
                "errorThrown" : errorThrown,
                "detalles": jqXHR
            };

            error(ret);
        }
    });
}

function prueba()
{
    var obj = JSON.parse('{"firstName":"John", "lastName":"Doe"}');

    console.log("[Prueba] :: ", obj);

    $("#info").text(obj.firstName);
}