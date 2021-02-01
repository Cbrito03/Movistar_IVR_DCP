var isDebug = true;
var isMock = false;

var cicEventListeners = {};

var scripter = {
    callObject: {
        state: "105",
        setAttribute: function (attr, valor) { cicTrace("Set ATTR: " + attr + " - Valor: " + valor) },
        disconnect: function () { cicTrace("Disconected!") },
        getAttribute: function (attr) {
            cicTrace("get " + attr);

            if (attr == "ATTR_PAIS") {
                return "PE";
            } else if (attr == "ATTR_OUTSOURCER") {
                return "AT";
            } else if (attr == "ATTR_SITE") {
                return "AT";
            } else if (attr == "ATTR_SITE_DESC") {
                return "MAQUINARIAS";
            } else if (attr == "ATTR_FAMILIA") {
                return "RPC";
            } else if (attr == "ATTR_CANAL") {
                return "IN";
            } else if (attr == "ATTR_TIPO_SERVICIO") {
                return "Repercutido";
            } else if (attr == "ATTR_CAMPAIGN") {
                return "CMP_PE_AT_IN_NORRPC";
            } else if (attr == "ATTR_TABLENAME") {
                return "TBL_PE_AT_IN_NORRPC";
            } else if (attr == "ATTR_CONTACTLIST") {
                return "CTL_PE_AT_IN_NORRPC";            
            } else if (attr == "ATTR_ANI") {
                return "323371976";
            } else if (attr == "ATTR_ACC_ID") {
                return "NO ARM";
            } else if (attr == "ATTR_CALL_BATCH_ID") {
                return "1";
            } else if (attr == "ATTR_CALL_SISTEMA_ID") {
                return "ARM";
            } else if (attr == "ATTR_CALL_ARCHIVO") {
                return "ARMInIncamp_Mov.5.20160208";
            } else if (attr == "ATTR_CALL_REG_ID") {
                return "212121212";
            } else if (attr == "ATTR_ORIGEN") {
                return "";
            }

            if (attr == "Eic_CallId") {
                return "987654321";
            } else if (attr == "Eic_RemoteAddress") {
                return "323371976";
            } else if (attr == "Eic_CallIdKey") {
                return "98765432120170404";
            }
            
            return "Get_" + attr;
        },
        id: 1234567,
        Direction: 0,
        stateChangeHandler: null,
        dial: function (numero, bool) {
            cicTrace("Dial: numero: " + numero + " - bool: " + bool)
        },
        pickup: function () {
            cicTrace("Pickup: " + this.id);
        },
        consultTransfer: function (id) {
            cicTrace("consultTransfer: " + this.id + " Call Id: " + id);
        }
    },
    dialer: {
        breakStatus: 2,
        campaigns: {
            length: 1
        }
    },
    myQueue: {
        callObjectAddedHandler: null,
        ObjectAddedHandler: null
    },
    myuser: {
        statusChangeHandler: null,
        statusMessage: "Available"
    },
    createCallObject: function () {
        return scripter.callObject;
    }

}


function cicAddListener(eventName, callback) {
    cicEventListeners[eventName] = callback;
}

// Debug
function cicDBGGetEventsWithListeners() {
    var eventData = [];
    for (var eventName in cicEventListeners) {

        if (eventName == "BreakGranted") {
            var event = new Object();
            event.eventName = eventName;
            event.eventDesc = "Otorgar Break";
            eventData.push(event);
        } else if (eventName == "PreviewDataPop") {
            var event = new Object();
            event.eventName = eventName;
            event.eventDesc = "Info Preview";
            eventData.push(event);
        } else if (eventName == "NewPreviewCall") {
            var event = new Object();
            event.eventName = eventName;
            event.eventDesc = "Llamada Preview";
            eventData.push(event);
        } else if (eventName == "ObjectAdded") {
            var event = new Object();
            event.eventName = eventName;
            event.eventDesc = "Inbound Call";
            eventData.push(event);
        } else if (eventName == "NewPredictiveCall") {
            var event = new Object();
            event.eventName = eventName;
            event.eventDesc = "Llamada Predictiva";
            eventData.push(event);
        } else {
            var event = new Object();
            event.eventName = eventName;
            event.eventDesc = eventName;
            eventData.push(event);
        }

        
    }
    return eventData;
}
function cicDBGTriggerEvent(eventName) {
    var arg = null;
    if (eventName == "ObjectAdded") {
        arg = 2;
        var arg1 = "2";
        if (cicEventListeners[eventName]) cicEventListeners[eventName](arg, arg1);
        return;
    }
   
    if (cicEventListeners[eventName]) cicEventListeners[eventName](arg);
}
function cicDBGlog(txt) {
    console.log(txt);
}

// Atributos Attendant
function attGetTipoServicio() {
    return scripter.callObject.getAttribute("ATTR_TIPO_SERVICIO");
}

function attGetCallIdKey() {
    return scripter.callObject.getAttribute("Eic_CallIdKey");
}

function attGetOrigen() {
    return scripter.callObject.getAttribute("ATTR_ORIGEN");
}

// Attributos CIC
function cicGetCallId() {
    if (app.isInboundCall) return scripter.callObject.getAttribute("Eic_CallId");
    return 123456789;
}
function cicGetCampaignName() {
    if (app.isInboundCall) return scripter.callObject.getAttribute("ATTR_CAMPAIGN");
    return "CMP_PE_AT_IN_NORRPC";
}
function cicGetSystemAgentId() { return "hopazo"; }
function cicGetSystemClientStatus() { return "Available"}

// Artibutos Campañas

function cicGetCampaignId() {
    if (app.isInboundCall) return "";
    return "XXXX-SDDSSAAA";
}

function cicGetAccId() {
    if (app.isInboundCall) return "";
    return "AccId";
}
function cicGetAccLineaId() {
    if (app.isInboundCall) return scripter.callObject.getAttribute("ATTR_ANI");
    return "323371976";
}
function cicGetAccCampanaId() {
    if (app.isInboundCall) return "";
    return "AccCampanaId";
}
function cicGetAccHorario() {
    if (app.isInboundCall) return "";
    return "12";
}
function cicGetAccScore() {
    if (app.isInboundCall) return "";
    return "0.75";
}
function cicGetAccPreg1() {
    if (app.isInboundCall) return "";
    return "¿Pregunta 1?";
}
function cicGetAccPreg2() {
    if (app.isInboundCall) return "";
    return "¿Pregunta 2?";
}
function cicGetAccArg1Id() {
    if (app.isInboundCall) return "";
    return "Arg1Id";
}
function cicGetAccArg2Id() {
    if (app.isInboundCall) return "";
    return "Arg2Id";
}
function cicGetAccArg3Id() { return "" }
function cicGetCallFecGestIni() {
    if (app.isInboundCall) return "";
    return "2015-10-10";
}
function cicGetCallFecGestFin() {
    if (app.isInboundCall) return "";
    return "2015-10-30";
}
function cicGetCallRegId() {
    if (app.isInboundCall) return scripter.callObject.getAttribute("ATTR_CALL_REG_ID");
    return "11234443";
}
function cicGetCallPaisId() {
    if (app.isInboundCall) return scripter.callObject.getAttribute("ATTR_PAIS");
    return "PE";
}
function cicGetCallCallCenterId() {
    if (app.isInboundCall) return scripter.callObject.getAttribute("ATTR_SITE");
    return "AT";
}
function cicGetCallFamiliaId() {
    if (app.isInboundCall) return scripter.callObject.getAttribute("ATTR_FAMILIA");
    return "RPC";
}
function cicGetCallBatchId() {
    if (app.isInboundCall) return scripter.callObject.getAttribute("ATTR_CALL_BATCH_ID");
    return "";
}
function cicGetCallSistemaId() {
    if (app.isInboundCall) return scripter.callObject.getAttribute("ATTR_CALL_SISTEMA_ID");
    return "SISTEMA";
}
function cicGetCallArchivo() {
    if (app.isInboundCall) return scripter.callObject.getAttribute("ATTR_CALL_ARCHIVO");
    return "";
}
function cicGetVentaProdCod() {
    if (app.isInboundCall) return "";
    return "VentaProd";
}
function cicGetVentaSistemaId() {
    if (app.isInboundCall) return "";
    return "SistemaV";
}
function cicGetVentaOossCod() {
    if (app.isInboundCall) return "";
    return "VentaOOSS";
}
function cicGetCuartil() {
    if (app.isInboundCall) return "";
    return "Cuartil";
}
function cicGetZone() {
    if (app.isInboundCall) return "";
    return "Zone";
}
function cicGetAttemps() {
    if (app.isInboundCall) return "";
    return "7";
}
function cicGetStatus() {
    if (app.isInboundCall) return "";
    return "C";
}
function cicGetI3Identity() {
    if (app.isInboundCall) return "";
    return "12121212";
}
function cicGetI3SiteId() {
    if (app.isInboundCall) return "";
    return "I3SiteId";
}
function cicGetI3ActiveCampaignId() {
    if (app.isInboundCall) return "";
    return "I3ActiveCampaignId";
}
function cicGetI3AttemptsRemoteHangUp() {
    if (app.isInboundCall) return "";
    return "1";
}
function cicGetI3AttemptsSystemHangUp() {
    if (app.isInboundCall) return "";
    return "2";
}
function cicGetI3AttemptsAbandoned() {
    if (app.isInboundCall) return "";
    return "3";
}
function cicGetI3AttemptsBusy() {
    if (app.isInboundCall) return "";
    return "4";
}
function cicGetI3AttempsFax() {
    if (app.isInboundCall) return "";
    return "5";
}
function cicGetI3AttempsNoAnswer() {
    if (app.isInboundCall) return "";
    return "6";
}
function cicGetI3AttempsMachine() {
    if (app.isInboundCall) return "";
    return "7";
}
function cicGetI3AttemptsRescheduled() {
    if (app.isInboundCall) return "";
    return "8";
}
function cicGetI3AttemptsSitCallable() {
    if (app.isInboundCall) return "";
    return "9";
}
function cicGetI3AttemptsDaily() {
    if (app.isInboundCall) return "";
    return "11"
}
function cicGetI3LastCalledUtc() {
    if (app.isInboundCall) return "";
    return "2015-10-10";
}
function cicGetI3RowId() {
    if (app.isInboundCall) return "";
    return "I3RowId";
}
function cicGetSuccessResult() {
    if (app.isInboundCall) return "";
    return "6";
}
function cicGetDncRegId() {
    if (app.isInboundCall) return "";
    return "";
}
function cicGetToExclude() {
    if (app.isInboundCall) return "";
    return "";
}
function cicGetExpiration() {
    if (app.isInboundCall) return "";
    return "";
}
function cicGetRut() {
    if (app.isInboundCall) return "";
    return "111111111";
}
function cicGetNumberToDial() {
    if (app.isInboundCall) return scripter.callObject.getAttribute("Eic_RemoteAddress");
    return "323371976";
}
function cicGetCliId() {
    if (app.isInboundCall) return "";
    return "123444";
}
function cicGetCliNombre() {
    if (app.isInboundCall) return "";
    return "Herman Opazo";
}
function cicGetCliRutConDV() {
    if (app.isInboundCall) return "";
    return "143412512";
}
function cicGetCliContacAlter() {
    if (app.isInboundCall) return "";
    return "888888888";
}
function cicGetCliContacAlterFijo() {
    if (app.isInboundCall) return "";
    return "777777777";
}
function cicGetCliContacAlterMovil() {
    if (app.isInboundCall) return "";
    return "6666666666";
}
function cicGetCliLineaAntiguedad() {
    if (app.isInboundCall) return "";
    return "3";
}
function cicGetCliAntiguedad() {
    if (app.isInboundCall) return "";
    return "5";
}
function cicGetCliCicloCod() {
    if (app.isInboundCall) return "";
    return "1";
}
function cicGetCliUltBoletaMonto() {
    if (app.isInboundCall) return "";
    return "100000";
}
function cicGetCliSegmento() {
    if (app.isInboundCall) return "";
    return "Segmento";
}
function cicGetCliGse() {
    if (app.isInboundCall) return "";
    return "GSE";
}
function cicGetCliIndPortado() {
    if (app.isInboundCall) return "";
    return "0";
}
function cicGetDirCalle() {
    if (app.isInboundCall) return "";
    return "Nombre Calle";
}
function cicGetDirNro() {
    if (app.isInboundCall) return "";
    return "12122";
}
function cicGetDirPiso() {
    if (app.isInboundCall) return "";
    return "2";
}
function cicGetDirDepto() {
    if (app.isInboundCall) return "";
    return "122";
}
function cicGetDirComuna() {
    if (app.isInboundCall) return "";
    return "Villa Alemana";
}
function cicGetDirCiudad() {
    if (app.isInboundCall) return "";
    return "Villa Alemana";
}
function cicGetDirRegion() {
    if (app.isInboundCall) return "";
    return "V Región";
}
function cicGetProdVigDesc() {
    if (app.isInboundCall) return "";
    return "2010-11-12";
}
function cicGetProdVigPrecio() {
    if (app.isInboundCall) return "";
    return "30000";
}
function cicGetProdVigFinPromo() {
    if (app.isInboundCall) return "";
    return "2015-10-10";
}
function cicGetOferP1Cod() {
    if (app.isInboundCall) return "";
    return "Codigo 1";
}
function cicGetOferP1Desc() {
    if (app.isInboundCall) return "";
    return "";
}
function cicGetOferP1Precio() {
    if (app.isInboundCall) return "";
    return "10000";
}
function cicGetOferP1Delta() {
    if (app.isInboundCall) return "";
    return "10";
}
function cicGetOferP2Cod() {
    if (app.isInboundCall) return "";
    return "Codigo 2";
}
function cicGetOferP2Desc() {
    if (app.isInboundCall) return "";
    return "Oferta 2";
}
function cicGetOferP2Precio() {
    if (app.isInboundCall) return "";
    return "20000";
}
function cicGetOferP2Delta() {
    if (app.isInboundCall) return "";
    return "10";
}
function cicGetOferP3Cod() {
    if (app.isInboundCall) return "";
    return "Codigo 3";
}
function cicGetOferP3Desc() {
    if (app.isInboundCall) return "";
    return "Oferta 3";
}
function cicGetOferP3Precio() {
    if (app.isInboundCall) return "";
    return "30000";
}
function cicGetOferP3Delta() {
    if (app.isInboundCall) return "";
    return "10";
}
function cicGetOferP4Cod() {
    if (app.isInboundCall) return "";
    return "Codigo 4";
}
function cicGetOferP4Desc() {
    if (app.isInboundCall) return "";
    return "Oferta 4";
}
function cicGetOferP4Precio() {
    if (app.isInboundCall) return "";
    return "40000";
}
function cicGetOferP4Delta() {
    if (app.isInboundCall) return "";
    return "10";
}
function cicGetOferP5Cod() {
    if (app.isInboundCall) return "";
    return "Codigo 5";
}
function cicGetOferP5Desc() {
    if (app.isInboundCall) return "";
    return "Oferta 5";
}
function cicGetOferP5Precio() {
    if (app.isInboundCall) return "";
    return "50000";
}
function cicGetOferP5Delta() {
    if (app.isInboundCall) return "";
    return "10";
}
function cicGetGenerico01() {
    if (app.isInboundCall) return "";
    return "BOLSAS";
}
function cicGetGenerico02() {
    if (app.isInboundCall) return "";
    return "Nombre Pagador";
}
function cicGetGenerico03() {
    if (app.isInboundCall) return "";
    return "Rut Pagador";
}
function cicGetGenerico04() {
    if (app.isInboundCall) return "";
    return "1976-12-12";
}
function cicGetGenerico05() {
    if (app.isInboundCall) return "";
    return "herman.opazo@gmail.com";
}
function cicGetGenerico06() {
    if (app.isInboundCall) return "";
    return "Generico06";
}
function cicGetGenerico07() {
    if (app.isInboundCall) return "";
    return "";
}
function cicGetGenerico08() {
    if (app.isInboundCall) return "";
    return "Generico08";
}
function cicGetGenerico09() {
    if (app.isInboundCall) return "";
    return "Generico09"
}
function cicGetGenerico10() {
    if (app.isInboundCall) return "";
    return "Generico10";
}
function cicGetGenerico11() {
    if (app.isInboundCall) return "";
    return "Generico11";
}
function cicGetGenerico12() {
    if (app.isInboundCall) return "";
    return "Generico12";
}
function cicGetGenerico13() {
    if (app.isInboundCall) return "";
    return "Generico13";
}
function cicGetGenerico14() {
    if (app.isInboundCall) return "";
    return "Generico14";
}
function cicGetGenerico15() {
    if (app.isInboundCall) return "";
    return "Generico15";
}
function cicGetGenerico16() {
    if (app.isInboundCall) return "";
    return "Generico16";
}
function cicGetGenerico17() {
    if (app.isInboundCall) return "";
    return "Generico17";
}
function cicGetGenerico18() {
    if (app.isInboundCall) return "";
    return "Generico18";
}
function cicGetGenerico19() {
    if (app.isInboundCall) return "";
    return "Generico19";
}
function cicGetSbxGenerico1() {
    if (app.isInboundCall) return scripter.callObject.getAttribute("ATTR_TABLENAME");
    return "TBL_PE_AT_IN_NORRPC";
} 
function cicGetSbxGenerico2() {
    if (app.isInboundCall) return "";
    return "";
}

function cicGetSbxConvergencia() {
    if (app.isInboundCall) return "";
    return (Math.floor(Math.random() * (2)) % 2 == 0 ? "A" : "");
}
function cicGetSbxReferido() {
    if (app.isInboundCall) return "";
    var result = Math.floor(Math.random() * (3));
    return (result % 3 == 0 ? "R" : result % 3 == 1 ? "A" : "C");
}
function cicGetCallCanalId() {
    if (app.isInboundCall) return scripter.callObject.getAttribute("ATTR_CANAL");
    return "IN";
}
function cicGetI3UploadId() {
    if (app.isInboundCall) return "";
    return "1223";
}
function cicGetSbxObservaciones() {
    if (app.isInboundCall) return "";
    return "1";
}

//Set Attr
function cicSetSbxGenerico2(valor) { cicDBGlog("Set cicSetSbxGenerico2:" + valor); }
function cicSetSbxObservaciones(valor) { cicDBGlog("Set cicSetSbxObservaciones:" + valor); }
function cicSetSbxConvergencia(valor) { cicDBGlog("Set cicSetSbxConvergencia:" + valor); }
function cicSetCliNombre(valor) { cicDBGlog("Set cicSetCliNombre:" + valor); }
function cicSetCliRutConDV(valor) { cicDBGlog("Set cicSetCliRutConDV:" + valor); }
function cicSetCliContacAlter(valor) { cicDBGlog("Set cicSetCliContacAlter:" + valor); }
function cicSetCliContacAlterFijo(valor) { cicDBGlog("Set cicSetCliContacAlterFijo:" + valor); }
function cicSetCliContacAlterMovil(valor) { cicDBGlog("Set cicSetCliContacAlterMovil:" + valor); }
function cicSetDirCalle(valor) { cicDBGlog("Set cicSetDirCalle:" + valor); }
function cicSetDirNro(valor) { cicDBGlog("Set cicSetDirNro:" + valor); }
function cicSetDirPiso(valor) { cicDBGlog("Set cicSetDirPiso:" + valor); }
function cicSetDirDepto(valor) { cicDBGlog("Set cicSetDirDepto:" + valor); }
function cicSetDirComuna(valor) { cicDBGlog("Set cicSetDirComuna:" + valor); }
function cicSetDirRegion(valor) { cicDBGlog("Set cicSetDirRegion:" + valor); }

// Acciones
function cicPickup() { cicDBGlog("IS_Action_Pickup.click()"); }
function cicSetForeground() { cicDBGlog("IS_Action_SetForeground.click()"); }
function cicSelectPage() { cicDBGlog("IS_Action_SelectPage.click()"); }
function cicClientStatus(statuskey) {
    cicDBGlog("IS_Action_ClientStatus.statuskey = " + statuskey);
    cicDBGlog("IS_Action_ClientStatus.click()");
}

function cicStage(stageNumber) {
    cicDBGlog("IS_Action_Stage.stage = " + stageNumber);
    cicDBGlog("IS_Action_Stage.click()");
}

function cicRequestBreak() { cicDBGlog("IS_Action_RequestBreak.click()"); }
function cicTrace(msg) {
    cicDBGlog("IS_Action_Trace.message = " +  msg);
    cicDBGlog("IS_Action_Trace.level = 2");
    cicDBGlog("IS_Action_Trace.click()");
}
function cicMute() { cicDBGlog("IS_Action_Mute.click()"); }
function cicEndBreak() { cicDBGlog("IS_Action_EndBreak.click()"); }
function cicCallComplete() { cicDBGlog("IS_Action_CallComplete.click()"); }
function cicDisconnect(callId) {
    if (callId) {
        cicDBGlog("IS_Action_Disconnect.click(" + callId + ")");
    } else {
        cicDBGlog("IS_Action_Disconnect.click()");
    }
    
}
function cicTransfer(transferData) {
    cicDBGlog("IS_Action_Transfer.consult = " + transferData.consult);
    cicDBGlog("IS_Action_Transfer.recipient = " + transferData.recipient);
    cicDBGlog("IS_Action_Transfer.click()");
}
function cicHold() { cicDBGlog("IS_Action_Hold.click()"); }

function cicRequestLogoff() { cicDBGlog("IS_Action_RequestLogoff.click();"); }

function cicPlacePreviewCall() { cicDBGlog("IS_Action_PlacePreviewCall.click()"); }

function ObjectAdded(ObjType, ObjId) { cicDBGlog("ObjectAdded Event"); }

function CallObjectAdded(CallObject) { cicDBGlog("CallObjectAdded Event"); }
