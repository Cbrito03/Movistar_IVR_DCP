var cicEventListeners = {};

var scripter = {
    callObject: {
        state: "105",
        setAttribute: function (atr, valor) { cicTrace("ATTR: " + atr + " - Valor: " + valor) },
        disconnect: function () { cicTrace("Disconected!") },
        getAttribute: function (valor) { cicTrace("get " + valor) },
        id: 1234567,
        Direction: 0,
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
        breakStatus: 2
        //, campaigns: ["Campaign1", "Campaign2"]
        , campaigns: ["CMP_CL_KO_OU_SVF"]
    },
    myQueue: {
        callObjectAddedHandler: ""
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
    var eventNames = [];
    for (var eventName in cicEventListeners) {
        eventNames.push(eventName);
    }
    return eventNames;
}
function cicDBGTriggerEvent(eventName) {
    var arg = null;
    if (eventName == "NewPredictiveCall") arg = 123456789;
    if (cicEventListeners[eventName]) cicEventListeners[eventName](arg);
}
function cicDBGlog(txt) {
    //console.log(txt);
}

// Attributos CIC
function cicGetCallId() { return 3001167640; }
function cicGetCampaignName() { return "CMP_CL_OV_OU_SVA"; } //CMP_CL_OV_OU_SVF
function cicGetSystemAgentId() { return "mari.socas"; }
function cicGetSystemClientStatus() { return "Disponible"}

// Artibutos Campañas
function cicGetAccId() { return "NO ARM" }
function cicGetAccLineaId() { return "000564598" }
function cicGetAccCampanaId() { return "CQC SVA" }
function cicGetAccHorario() { return "0" }
function cicGetAccScore() { return "0.75" }
function cicGetAccPreg1() { return "Que productos Movil tiene con la competencia?" }
function cicGetAccPreg2() { return "Cuanto paga por su plan?" }
function cicGetAccArg1Id() { return "" }
function cicGetAccArg2Id() { return "" }
function cicGetAccArg3Id() { return "" }
function cicGetCallFecGestIni() { return "2016-07-01" }
function cicGetCallFecGestFin() { return "2016-07-01" }
function cicGetCallRegId() { return "11234443" }
function cicGetCallPaisId() { return "CL" }
function cicGetCallCallCenterId() { return "OV"}
function cicGetCallFamiliaId() { return "SVF" } 
function cicGetCallBatchId() { return "88682" }
function cicGetCallSistemaId() { return "ARM" }
function cicGetCallArchivo() { return "ARMInIncamp_Mov.7.20160630" }
function cicGetVentaProdCod() { return "VentaProd" }
function cicGetVentaSistemaId() { return "SistemaV" }
function cicGetVentaOossCod() { return "VentaOOSS" }
function cicGetCuartil() { return "Cuartil" }
function cicGetZone() { return "Zone"}
function cicGetAttemps() { return "7" }
function cicGetStatus() { return "R" }
function cicGetI3Identity() { return "18022456" }
function cicGetI3SiteId() { return "I3SiteId" }
function cicGetI3ActiveCampaignId() { return "I3ActiveCampaignId" }
function cicGetI3AttemptsRemoteHangUp() { return "1" }
function cicGetI3AttemptsSystemHangUp() { return "2" }
function cicGetI3AttemptsAbandoned() { return "3" }
function cicGetI3AttemptsBusy() { return "4" }
function cicGetI3AttempsFax() { return "5" }
function cicGetI3AttempsNoAnswer() { return "6" }
function cicGetI3AttempsMachine() { return "7" }
function cicGetI3AttemptsRescheduled() { return "8" }
function cicGetI3AttemptsSitCallable() { return "9" }
function cicGetI3AttemptsDaily() { return "11" }
function cicGetI3LastCalledUtc() { return "2015-10-10" }
function cicGetI3RowId() { return "I3RowId" }
function cicGetSuccessResult() { return "6" }
function cicGetDncRegId() { return "" }
function cicGetToExclude() { return "" }
function cicGetExpiration() { return "" }
function cicGetRut() { return "" }
function cicGetNumberToDial() { return "64147424" }
function cicGetCliId() { return "123444" }
function cicGetCliNombre() { return "MANUEL IGNACIO CALDERON DIAZ" }
function cicGetCliRutConDV() { return "89696739" }
function cicGetCliContacAlter() { return "" }
function cicGetCliContacAlterFijo() { return "" }
function cicGetCliContacAlterMovil() { return "" }
function cicGetCliLineaAntiguedad() { return "" }
function cicGetCliAntiguedad() { return "" }
function cicGetCliCicloCod() { return "1" }
function cicGetCliUltBoletaMonto() { return "22148" }
function cicGetCliSegmento() { return "" }
function cicGetCliGse() { return "C3" }
function cicGetCliIndPortado() { return "" }
function cicGetDirCalle() { return "AV FRANCISCO COSTABAL" }
function cicGetDirNro() { return "12122" }
function cicGetDirPiso() { return "2" }
function cicGetDirDepto() { return "122" }
function cicGetDirComuna() { return "María Pinto" }
function cicGetDirCiudad() { return ""}
function cicGetDirRegion() { return "XIII. Metropolitana de Santiago" }
function cicGetProdVigDesc() { return "" }
function cicGetProdVigPrecio() { return "" }
function cicGetProdVigFinPromo() { return "" }
function cicGetOferP1Cod() { return "564646" }
function cicGetOferP1Desc() { return "" }
function cicGetOferP1Precio() { return "" }
function cicGetOferP1Delta() { return "" }
function cicGetOferP2Cod() { return "" }
function cicGetOferP2Desc() { return "" }
function cicGetOferP2Precio() { return "" }
function cicGetOferP2Delta() { return "" }
function cicGetOferP3Cod() { return "" }
function cicGetOferP3Desc() { return "" }
function cicGetOferP3Precio() { return "" }
function cicGetOferP3Delta() { return "" }
function cicGetOferP4Cod() { return "" }
function cicGetOferP4Desc() { return "" }
function cicGetOferP4Precio() { return "0" }
function cicGetOferP4Delta() { return "0" }
function cicGetOferP5Cod() { return "" }
function cicGetOferP5Desc() { return "" }
function cicGetOferP5Precio() { return "0" }
function cicGetOferP5Delta() { return "0" }
function cicGetGenerico01() { return "" }
function cicGetGenerico02() { return "" }
function cicGetGenerico03() { return "" }
function cicGetGenerico04() { return "" }
function cicGetGenerico05() { return "" }
function cicGetGenerico06() { return "" }
function cicGetGenerico07() { return "" }
function cicGetGenerico08() { return "" }
function cicGetGenerico09() { return "" }
function cicGetGenerico10() { return "" }
function cicGetGenerico11() { return "" }
function cicGetGenerico12() { return "" }
function cicGetGenerico13() { return "" }
function cicGetGenerico14() { return "" }
function cicGetGenerico15() { return "" }
function cicGetGenerico16() { return "" }
function cicGetGenerico17() { return "Claro" }
function cicGetGenerico18() { return "" }
function cicGetGenerico19() { return "" }
function cicGetSbxGenerico1() { return "TBL_CL_OV_OU_SVA" }//TBL_CL_OV_OU_SVF //TBL_TEST_QA_MOV002
function cicGetSbxGenerico2() { return "" } //valor
function cicSetSbxGenerico2(valor) { cicDBGlog("Set cicSetSbxGenerico2:" + valor); }
function cicSetGenerico15(valor) { cicDBGlog("Set cicSetGenerico15:" + valor); }
function cicGetSbxObservaciones() { return "65" }
function cicSetSbxObservaciones(valor) { cicDBGlog("Set cicSetSbxObservaciones:" + valor); }
function cicGetSbxConvergencia() { return "" }
function cicGetSbxReferido() { return "" }
function cicGetCallCanalId() { return "OU" }
function cicGetI3UploadId() { return "1223" }

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


