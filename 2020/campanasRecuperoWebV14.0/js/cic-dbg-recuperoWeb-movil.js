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

            return "Get_" + attr;
        },
        id: 1234567,
        Direction: 1,
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

    if (cicEventListeners[eventName]) cicEventListeners[eventName](arg);
}
function cicDBGlog(txt) {
    console.log(txt);
}

function attGetCallIdKey() {
    return scripter.callObject.getAttribute("Eic_CallIdKey");
}

// Attributos CIC
function cicGetCallId() {
    return 123456789;
}
function cicGetCampaignName() {

    return "CMP_CL_SX_RW_RWM";
}
function cicGetSystemAgentId() { return "hopazo"; }
function cicGetSystemClientStatus() { return "Available" }

// Artibutos Campañas
function cicGetAccId() {

    return "AccId";
}
function cicGetAccLineaId() {

    return "323371976";
}
function cicGetAccCampanaId() {

    return "AccCampanaId";
}
function cicGetAccHorario() {

    return "12";
}
function cicGetAccScore() {

    return "0.75";
}
function cicGetAccPreg1() {

    return "¿Pregunta 1?";
}
function cicGetAccPreg2() {

    return "¿Pregunta 2?";
}
function cicGetAccArg1Id() {

    return "Arg1Id";
}
function cicGetAccArg2Id() {

    return "Arg2Id";
}
function cicGetAccArg3Id() { return "" }
function cicGetCallFecGestIni() {

    return "2015-10-10";
}
function cicGetCallFecGestFin() {

    return "2015-10-30";
}
function cicGetCallRegId() {

    return "11234443";
}
function cicGetCallPaisId() {

    return "CL";
}
function cicGetCallCallCenterId() {

    return "SX";
}
function cicGetCallFamiliaId() {

    return "Rwm";
}
function cicGetCallBatchId() {

    return "";
}
function cicGetCallSistemaId() {

    return "SISTEMA";
}
function cicGetCallArchivo() {

    return "";
}
function cicGetVentaProdCod() {

    return "VentaProd";
}
function cicGetVentaSistemaId() {

    return "SistemaV";
}
function cicGetVentaOossCod() {

    return "VentaOOSS";
}
function cicGetCuartil() {

    return "Cuartil";
}
function cicGetZone() {

    return "Zone";
}
function cicGetAttemps() {

    return "7";
}
function cicGetStatus() {

    return "C";
}
function cicGetI3Identity() {

    return "12121212";
}
function cicGetI3SiteId() {

    return "I3SiteId";
}
function cicGetI3ActiveCampaignId() {

    return "I3ActiveCampaignId";
}
function cicGetI3AttemptsRemoteHangUp() {

    return "1";
}
function cicGetI3AttemptsSystemHangUp() {

    return "2";
}
function cicGetI3AttemptsAbandoned() {

    return "3";
}
function cicGetI3AttemptsBusy() {

    return "4";
}
function cicGetI3AttempsFax() {

    return "5";
}
function cicGetI3AttempsNoAnswer() {

    return "6";
}
function cicGetI3AttempsMachine() {

    return "7";
}
function cicGetI3AttemptsRescheduled() {

    return "8";
}
function cicGetI3AttemptsSitCallable() {

    return "9";
}
function cicGetI3AttemptsDaily() {

    return "11"
}
function cicGetI3LastCalledUtc() {

    return "2015-10-10";
}
function cicGetI3RowId() {

    return "I3RowId";
}
function cicGetSuccessResult() {

    return "6";
}
function cicGetDncRegId() {

    return "";
}
function cicGetToExclude() {

    return "";
}
function cicGetExpiration() {

    return "";
}
function cicGetRut() {

    return "111111111";
}
function cicGetNumberToDial() {

    return "323371976";
}
function cicGetCliId() {

    return "123444";
}
function cicGetCliNombre() {

    return "Herman Opazo";
}
function cicGetCliRutConDV() {

    return "143412512";
}
function cicGetCliContacAlter() {

    return "888888888";
}
function cicGetCliContacAlterFijo() {

    return "777777777";
}
function cicGetCliContacAlterMovil() {

    return "6666666666";
}
function cicGetCliLineaAntiguedad() {

    return "3";
}
function cicGetCliAntiguedad() {

    return "5";
}
function cicGetCliCicloCod() {

    return "1";
}
function cicGetCliUltBoletaMonto() {

    return "100000";
}
function cicGetCliSegmento() {

    return "Segmento";
}
function cicGetCliGse() {

    return "GSE";
}
function cicGetCliIndPortado() {

    return "0";
}
function cicGetDirCalle() {

    return "Nombre Calle";
}
function cicGetDirNro() {

    return "12122";
}
function cicGetDirPiso() {

    return "2";
}
function cicGetDirDepto() {

    return "122";
}
function cicGetDirComuna() {

    return "05014";
}
function cicGetDirCiudad() {

    return "Villa Alemana";
}
function cicGetDirRegion() {

    return "05";
}
function cicGetProdVigDesc() {

    return "2010-11-12";
}
function cicGetProdVigPrecio() {

    return "30000";
}
function cicGetProdVigFinPromo() {

    return "2015-10-10";
}
function cicGetOferP1Cod() {

    return "Codigo 1";
}
function cicGetOferP1Desc() {

    return "Trio HD Pro M $12.000x6 meses (Mes 1-6 $37.990 Mes 7 $49.000)";
}
function cicGetOferP1Precio() {

    return "10000";
}
function cicGetOferP1Delta() {

    return "10";
}
function cicGetOferP2Cod() {

    return "Codigo 2";
}
function cicGetOferP2Desc() {

    return "Movil XL $30.000 x6 meses";
}
function cicGetOferP2Precio() {

    return "20000";
}
function cicGetOferP2Delta() {

    return "10";
}
function cicGetOferP3Cod() {

    return "Codigo 3";
}
function cicGetOferP3Desc() {

    return "Oferta 3";
}
function cicGetOferP3Precio() {

    return "30000";
}
function cicGetOferP3Delta() {

    return "10";
}
function cicGetOferP4Cod() {

    return "Codigo 4";
}
function cicGetOferP4Desc() {

    return "Oferta 4";
}
function cicGetOferP4Precio() {

    return "40000";
}
function cicGetOferP4Delta() {

    return "10";
}
function cicGetOferP5Cod() {

    return "Codigo 5";
}
function cicGetOferP5Desc() {

    return "Oferta 5";
}
function cicGetOferP5Precio() {

    return "50000";
}
function cicGetOferP5Delta() {

    return "10";
}
function cicGetGenerico01() {

    return "BOLSAS";
}
function cicGetGenerico02() {

    return "Nombre Pagador";
}
function cicGetGenerico03() {

    return "Rut Pagador";
}
function cicGetGenerico04() {

    return "1976-12-12";
}
function cicGetGenerico05() {

    return "herman.opazo@gmail.com";
}
function cicGetGenerico06() {

    return "Generico06";
}
function cicGetGenerico07() {

    return "";
}
function cicGetGenerico08() {

    return "Generico08";
}
function cicGetGenerico09() {

    return "Generico09"
}
function cicGetGenerico10() {

    return "Generico10";
}
function cicGetGenerico11() {

    return "Generico11";
}
function cicGetGenerico12() {

    return "Generico12";
}
function cicGetGenerico13() {

    return "Generico13";
}
function cicGetGenerico14() {

    return "Generico14";
}
function cicGetGenerico15() {

    return "Generico15";
}
function cicGetGenerico16() {

    return "Generico16";
}
function cicGetGenerico17() {

    return "Generico17";
}
function cicGetGenerico18() {

    return "Generico18";
}
function cicGetGenerico19() {

    return "Generico19";
}
function cicGetSbxGenerico1() {

    return "TBL_PE_AT_IN_TLM";
}
function cicGetSbxGenerico2() {

    return "";
}

function cicGetSbxConvergencia() {

    return (Math.floor(Math.random() * (2)) % 2 == 0 ? "A" : "");
}
function cicGetSbxReferido() {

    var result = Math.floor(Math.random() * (3));
    return (result % 3 == 0 ? "R" : result % 3 == 1 ? "A" : "C");
}
function cicGetCallCanalId() {

    return "RW";
}
function cicGetI3UploadId() {

    return "1223";
}
function cicGetSbxObservaciones() {

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
function cicSetSbxReferido(valor) { cicDBGlog("Set cicSetSbxReferido:" + valor); }


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
    cicDBGlog("IS_Action_Trace.message = " + msg);
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
