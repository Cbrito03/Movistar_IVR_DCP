var isDebug = false;
var isMock = false;

var cicEventListeners = {};

function cicAddListener(eventName, callback) {
    cicEventListeners[eventName] = callback;
}

// Atributos Attendant
function attGetTipoServicio() {
    return scripter.callObject.getAttribute("ATTR_TIPO_SERVICIO");
}

function attGetCallIdKey() {
    return scripter.callObject.getAttribute("Eic_CallIdKey");
}

// Attributos CIC
function cicGetCallId() {
    if (app.isInboundCall) return scripter.callObject.getAttribute("Eic_CallId");
    return (typeof IS_Attr_CallID == "undefined" ? null : (IS_Attr_CallID.value ? IS_Attr_CallID.value : ""));
}



function cicGetCampaignName() {
    if (app.isInboundCall) return scripter.callObject.getAttribute("ATTR_CAMPAIGN");
    return (typeof IS_Attr_CampaignName == "undefined" ? "[Nombre Campaña]" : (IS_Attr_CampaignName.value ? IS_Attr_CampaignName.value : ""));
}
function cicGetSystemAgentId() {
    return (typeof IS_System_AgentID == "undefined" ? null : (IS_System_AgentID.value ? IS_System_AgentID.value : ""));
}
function cicGetSystemAgentName() {
    return (typeof IS_System_AgentName == "undefined" ? null : (IS_System_AgentName.value ? IS_System_AgentName.value : ""));
}
function cicGetSystemClientStatus() {
    if (app.isInboundCall) return scripter.myuser.statusMessage;
    return (typeof IS_System_ClientStatus == "undefined" ? null : (IS_System_ClientStatus.value ? IS_System_ClientStatus.value : ""));
}
function cicGetCampaignId() {
    return (typeof IS_Attr_CampaignID == "undefined" ? null : (IS_Attr_CampaignID.value ? IS_Attr_CampaignID.value : ""));
}

// Atributos campañas
function cicGetAccId() {
    if (app.isInboundCall) return scripter.callObject.getAttribute("ATTR_ACC_ID");
    return (typeof IS_Attr_ACC_ID == "undefined" ? null : (IS_Attr_ACC_ID.value ? IS_Attr_ACC_ID.value : ""));
}
function cicGetAccLineaId() {
    if (app.isInboundCall) return scripter.callObject.getAttribute("ATTR_ANI");
    return (typeof IS_Attr_ACC_LINEA_ID == "undefined" ? null : (IS_Attr_ACC_LINEA_ID.value ? IS_Attr_ACC_LINEA_ID.value : ""));
}
function cicGetAccCampanaId() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_ACC_CAMPANA_ID == "undefined" ? null : (IS_Attr_ACC_CAMPANA_ID.value ? IS_Attr_ACC_CAMPANA_ID.value : ""));
}
function cicGetAccHorario() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_ACC_HORARIO == "undefined" ? null : (IS_Attr_ACC_HORARIO.value ? IS_Attr_ACC_HORARIO.value : ""));
}
function cicGetAccScore() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_ACC_SCORE == "undefined" ? null : (IS_Attr_ACC_SCORE.value ? IS_Attr_ACC_SCORE.value : ""));
}
function cicGetAccPreg1() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_ACC_PREG_1 == "undefined" ? null : (IS_Attr_ACC_PREG_1.value ? IS_Attr_ACC_PREG_1.value : ""));
}
function cicGetAccPreg2() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_ACC_PREG_2 == "undefined" ? null : (IS_Attr_ACC_PREG_2.value ? IS_Attr_ACC_PREG_2.value : ""));
}
function cicGetAccArg1Id() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_ACC_ARG1_ID == "undefined" ? null : (IS_Attr_ACC_ARG1_ID.value ? IS_Attr_ACC_ARG1_ID.value : ""));
}
function cicGetAccArg2Id() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_ACC_ARG2_ID == "undefined" ? null : (IS_Attr_ACC_ARG2_ID.value ? IS_Attr_ACC_ARG2_ID.value : ""));
}
function cicGetAccArg3Id() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_ACC_ARG3_ID == "undefined" ? null : (IS_Attr_ACC_ARG3_ID.value ? IS_Attr_ACC_ARG3_ID.value : ""));
}

function cicGetCallFecGestIni() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_CALL_FEC_GEST_INI == "undefined" ? null : (IS_Attr_CALL_FEC_GEST_INI.value ? IS_Attr_CALL_FEC_GEST_INI.value : ""));
}
function cicGetCallFecGestFin() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_CALL_FEC_GEST_FIN == "undefined" ? null : (IS_Attr_CALL_FEC_GEST_FIN.value ? IS_Attr_CALL_FEC_GEST_FIN.value : ""));
}
function cicGetCallRegId() {
    if (app.isInboundCall) return scripter.callObject.getAttribute("ATTR_CALL_REG_ID");
    return (typeof IS_Attr_CALL_REG_ID == "undefined" ? null : (IS_Attr_CALL_REG_ID.value ? IS_Attr_CALL_REG_ID.value : ""));
}
function cicGetCallPaisId() {
    if (app.isInboundCall) return scripter.callObject.getAttribute("ATTR_PAIS");
    return (typeof IS_Attr_CALL_PAIS_ID == "undefined" ? null : (IS_Attr_CALL_PAIS_ID.value ? IS_Attr_CALL_PAIS_ID.value : ""));
}
function cicGetCallCallCenterId() {
    if (app.isInboundCall) return scripter.callObject.getAttribute("ATTR_SITE")
    return (typeof IS_Attr_CALL_CALLCENTER_ID == "undefined" ? null : (IS_Attr_CALL_CALLCENTER_ID.value ? IS_Attr_CALL_CALLCENTER_ID.value : ""));
}
function cicGetCallCanalId() {
    if (app.isInboundCall) return scripter.callObject.getAttribute("ATTR_CANAL");
    return (typeof IS_Attr_CALL_CANAL_ID == "undefined" ? null : (IS_Attr_CALL_CANAL_ID.value ? IS_Attr_CALL_CANAL_ID.value : ""));
}
function cicGetCallFamiliaId() {
    if (app.isInboundCall) return scripter.callObject.getAttribute("ATTR_FAMILIA");
    return (typeof IS_Attr_CALL_FAMILIA_ID == "undefined" ? null : (IS_Attr_CALL_FAMILIA_ID.value ? IS_Attr_CALL_FAMILIA_ID.value : ""));
}
function cicGetCallBatchId() {
    if (app.isInboundCall) return scripter.callObject.getAttribute("ATTR_CALL_BATCH_ID");
    return (typeof IS_Attr_CALL_BATCH_ID == "undefined" ? null : (IS_Attr_CALL_BATCH_ID.value ? IS_Attr_CALL_BATCH_ID.value : ""));
}
function cicGetCallSistemaId() {
    if (app.isInboundCall) return scripter.callObject.getAttribute("ATTR_CALL_SISTEMA_ID");
    return (typeof IS_Attr_CALL_SISTEMA_ID == "undefined" ? null : (IS_Attr_CALL_SISTEMA_ID.value ? IS_Attr_CALL_SISTEMA_ID.value : ""));
}
function cicGetCallArchivo() {
    if (app.isInboundCall) return scripter.callObject.getAttribute("ATTR_CALL_ARCHIVO");
    return (typeof IS_Attr_CALL_ARCHIVO == "undefined" ? null : (IS_Attr_CALL_ARCHIVO.value ? IS_Attr_CALL_ARCHIVO.value : ""));
}

function cicGetVentaProdCod() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_VENTA_PROD_COD == "undefined" ? null : (IS_Attr_VENTA_PROD_COD.value ? IS_Attr_VENTA_PROD_COD.value : ""));
}
function cicGetVentaSistemaId() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_VENTA_SISTEMA_ID == "undefined" ? null : (IS_Attr_VENTA_SISTEMA_ID.value ? IS_Attr_VENTA_SISTEMA_ID.value : ""));
}
function cicGetVentaOossCod() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_VENTA_OOSS_COD == "undefined" ? null : (IS_Attr_VENTA_OOSS_COD.value ? IS_Attr_VENTA_OOSS_COD.value : ""));
}
function cicGetCuartil() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_CUARTIL == "undefined" ? null : (IS_Attr_CUARTIL.value ? IS_Attr_CUARTIL.value : ""));
}
function cicGetZone() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_ZONE == "undefined" ? null : (IS_Attr_ZONE.value ? IS_Attr_ZONE.value : ""));
}
function cicGetAttemps() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_ATTEMPTS == "undefined" ? null : (IS_Attr_ATTEMPTS.value ? IS_Attr_ATTEMPTS.value : "0"));
}
function cicGetStatus() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_Status == "undefined" ? null : (IS_Attr_Status.value ? IS_Attr_Status.value : ""));
}

function cicGetI3Identity() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_I3_IDENTITY == "undefined" ? null : (IS_Attr_I3_IDENTITY.value ? IS_Attr_I3_IDENTITY.value : ""));
}
function cicGetI3SiteId() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_I3_SITEID == "undefined" ? null : (IS_Attr_I3_SITEID.value ? IS_Attr_I3_SITEID.value : ""));
}
function cicGetI3ActiveCampaignId() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_I3_ACTIVECAMPAIGNID == "undefined" ? null : (IS_Attr_I3_ACTIVECAMPAIGNID.value ? IS_Attr_I3_ACTIVECAMPAIGNID.value : ""));
}
function cicGetI3AttemptsRemoteHangUp() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_I3_ATTEMPTSREMOTEHANGUP == "undefined" ? null : (IS_Attr_I3_ATTEMPTSREMOTEHANGUP.value ? IS_Attr_I3_ATTEMPTSREMOTEHANGUP.value : ""));
}
function cicGetI3AttemptsSystemHangUp() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_I3_ATTEMPTSSYSTEMHANGUP == "undefined" ? null : (IS_Attr_I3_ATTEMPTSSYSTEMHANGUP.value ? IS_Attr_I3_ATTEMPTSSYSTEMHANGUP.value : ""));
}
function cicGetI3AttemptsAbandoned() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_I3_ATTEMPTSABANDONED == "undefined" ? null : (IS_Attr_I3_ATTEMPTSABANDONED.value ? IS_Attr_I3_ATTEMPTSABANDONED.value : ""));
}
function cicGetI3AttemptsBusy() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_I3_ATTEMPTSBUSY == "undefined" ? null : (IS_Attr_I3_ATTEMPTSBUSY.value ? IS_Attr_I3_ATTEMPTSBUSY.value : ""));
}
function cicGetI3AttempsFax() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_I3_ATTEMPTSFAX == "undefined" ? null : (IS_Attr_I3_ATTEMPTSFAX.value ? IS_Attr_I3_ATTEMPTSFAX.value : ""));
}
function cicGetI3AttempsNoAnswer() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_I3_ATTEMPTSNOANSWER == "undefined" ? null : (IS_Attr_I3_ATTEMPTSNOANSWER.value ? IS_Attr_I3_ATTEMPTSNOANSWER.value : ""));
}
function cicGetI3AttempsMachine() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_I3_ATTEMPTSMACHINE == "undefined" ? null : (IS_Attr_I3_ATTEMPTSMACHINE.value ? IS_Attr_I3_ATTEMPTSMACHINE.value : ""));
}
function cicGetI3AttemptsRescheduled() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_I3_ATTEMPTSRESCHEDULED == "undefined" ? null : (IS_Attr_I3_ATTEMPTSRESCHEDULED.value ? IS_Attr_I3_ATTEMPTSRESCHEDULED.value : ""));
}
function cicGetI3AttemptsSitCallable() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_I3_ATTEMPTSSITCALLABLE == "undefined" ? null : (IS_Attr_I3_ATTEMPTSSITCALLABLE.value ? IS_Attr_I3_ATTEMPTSSITCALLABLE.value : ""));
}
function cicGetI3AttemptsDaily() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_I3_ATTEMPTSDAILY == "undefined" ? null : (IS_Attr_I3_ATTEMPTSDAILY.value ? IS_Attr_I3_ATTEMPTSDAILY.value : ""));
}
function cicGetI3LastCalledUtc() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_I3_LASTCALLED_UTC == "undefined" ? null : (IS_Attr_I3_LASTCALLED_UTC.value ? IS_Attr_I3_LASTCALLED_UTC.value : ""));
}
function cicGetI3RowId() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_I3_ROWID == "undefined" ? null : (IS_Attr_I3_ROWID.value ? IS_Attr_I3_ROWID.value : ""));
}

function cicGetSuccessResult() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_SUCCESSRESULT == "undefined" ? null : (IS_Attr_SUCCESSRESULT.value ? IS_Attr_SUCCESSRESULT.value : ""));
}
function cicGetI3UploadId() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_I3_UPLOAD_ID == "undefined" ? null : (IS_Attr_I3_UPLOAD_ID.value ? IS_Attr_SUCCESSRESULT.value : ""));
}

function cicGetDncRegId() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_DNC_REG_ID == "undefined" ? null : (IS_Attr_DNC_REG_ID.value ? IS_Attr_DNC_REG_ID.value : ""));
}
function cicGetToExclude() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_TO_EXCLUDE == "undefined" ? null : (IS_Attr_TO_EXCLUDE.value ? IS_Attr_TO_EXCLUDE.value : ""));
}
function cicGetExpiration() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_EXPIRATION == "undefined" ? null : (IS_Attr_EXPIRATION.value ? IS_Attr_EXPIRATION.value : ""));
}

function cicGetRut() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_Rut == "undefined" ? null : (IS_Attr_Rut.value ? IS_Attr_Rut.value : ""));
}

function cicGetNumberToDial() {
    if (app.isInboundCall) return scripter.callObject.getAttribute("ATTR_ANI");
    return (typeof IS_Attr_Numbertodial == "undefined" ? null : (IS_Attr_Numbertodial.value ? IS_Attr_Numbertodial.value : ""));
}
function cicGetCliId() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_CLI_ID == "undefined" ? null : (IS_Attr_CLI_ID.value ? IS_Attr_CLI_ID.value : ""));
}
function cicGetCliNombre() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_CLI_NOMBRE == "undefined" ? null : (IS_Attr_CLI_NOMBRE.value ? IS_Attr_CLI_NOMBRE.value : ""));
}
function cicGetCliRutConDV() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_CLI_RUT_CON_DV == "undefined" ? null : (IS_Attr_CLI_RUT_CON_DV.value ? IS_Attr_CLI_RUT_CON_DV.value : ""));
}
function cicGetCliContacAlter() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_CLI_CONTAC_ALTER == "undefined" ? null : (IS_Attr_CLI_CONTAC_ALTER.value ? IS_Attr_CLI_CONTAC_ALTER.value : ""));
}
function cicGetCliContacAlterFijo() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_CLI_CONTAC_ALTER_FIJO == "undefined" ? null : (IS_Attr_CLI_CONTAC_ALTER_FIJO.value ? IS_Attr_CLI_CONTAC_ALTER_FIJO.value : ""));
}
function cicGetCliContacAlterMovil() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_CLI_CONTAC_ALTER_MOVIL == "undefined" ? null : (IS_Attr_CLI_CONTAC_ALTER_MOVIL.value ? IS_Attr_CLI_CONTAC_ALTER_MOVIL.value : ""));
}
function cicGetCliLineaAntiguedad() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_CLI_LINEA_ANTIGUEDAD == "undefined" ? null : (IS_Attr_CLI_LINEA_ANTIGUEDAD.value ? IS_Attr_CLI_LINEA_ANTIGUEDAD.value : ""));
}
function cicGetCliAntiguedad() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_CLI_ANTIGUEDAD == "undefined" ? null : (IS_Attr_CLI_ANTIGUEDAD.value ? IS_Attr_CLI_ANTIGUEDAD.value : ""));
}
function cicGetCliCicloCod() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_CLI_CICLO_COD == "undefined" ? null : (IS_Attr_CLI_CICLO_COD.value ? IS_Attr_CLI_CICLO_COD.value : ""));
}
function cicGetCliUltBoletaMonto() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_CLI_ULT_BOLETA_MONTO == "undefined" ? null : (IS_Attr_CLI_ULT_BOLETA_MONTO.value ? IS_Attr_CLI_ULT_BOLETA_MONTO.value : ""));
}
function cicGetCliSegmento() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_CLI_SEGMENTO == "undefined" ? null : (IS_Attr_CLI_SEGMENTO.value ? IS_Attr_CLI_SEGMENTO.value : ""));
}
function cicGetCliGse() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_CLI_GSE == "undefined" ? null : (IS_Attr_CLI_GSE.value ? IS_Attr_CLI_GSE.value : ""));
}
function cicGetCliIndPortado() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_CLI_IND_PORTADO == "undefined" ? null : (IS_Attr_CLI_IND_PORTADO.value ? IS_Attr_CLI_IND_PORTADO.value : ""));
}
function cicGetDirCalle() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_DIR_CALLE == "undefined" ? null : (IS_Attr_DIR_CALLE.value ? IS_Attr_DIR_CALLE.value : ""));
}
function cicGetDirNro() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_DIR_NRO == "undefined" ? null : (IS_Attr_DIR_NRO.value ? IS_Attr_DIR_NRO.value : ""));
}
function cicGetDirPiso() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_DIR_PISO == "undefined" ? null : (IS_Attr_DIR_PISO.value ? IS_Attr_DIR_PISO.value : ""));
}
function cicGetDirDepto() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_DIR_DEPTO == "undefined" ? null : (IS_Attr_DIR_DEPTO.value ? IS_Attr_DIR_DEPTO.value : ""));
}
function cicGetDirComuna() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_DIR_COMUNA == "undefined" ? null : (IS_Attr_DIR_COMUNA.value ? IS_Attr_DIR_COMUNA.value : ""));
}
function cicGetDirCiudad() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_DIR_CIUDAD == "undefined" ? null : (IS_Attr_DIR_CIUDAD.value ? IS_Attr_DIR_CIUDAD.value : ""));
}
function cicGetDirRegion() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_DIR_REGION == "undefined" ? null : (IS_Attr_DIR_REGION.value ? IS_Attr_DIR_REGION.value : ""));
}
function cicGetProdVigDesc() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_PROD_VIG_DESC == "undefined" ? null : (IS_Attr_PROD_VIG_DESC.value ? IS_Attr_PROD_VIG_DESC.value : ""));
}
function cicGetProdVigPrecio() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_PROD_VIG_PRECIO == "undefined" ? null : (IS_Attr_PROD_VIG_PRECIO.value ? IS_Attr_PROD_VIG_PRECIO.value : ""));
}
function cicGetProdVigFinPromo() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_PROD_VIG_FIN_PROMO == "undefined" ? null : (IS_Attr_PROD_VIG_FIN_PROMO.value ? IS_Attr_PROD_VIG_FIN_PROMO.value : ""));
}
function cicGetOferP1Cod() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_OFER_P1_COD == "undefined" ? null : (IS_Attr_OFER_P1_COD.value ? IS_Attr_OFER_P1_COD.value : ""));
}
function cicGetOferP1Desc() {
    if (app.isInboundCall) return scripter.callObject.getAttribute("ATTR_OFER_P1_DESC");
    return (typeof IS_Attr_OFER_P1_DESC == "undefined" ? null : (IS_Attr_OFER_P1_DESC.value ? IS_Attr_OFER_P1_DESC.value : ""));
}
function cicGetOferP1Precio() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_OFER_P1_PRECIO == "undefined" ? null : (IS_Attr_OFER_P1_PRECIO.value ? IS_Attr_OFER_P1_PRECIO.value : ""));
}
function cicGetOferP1Delta() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_OFER_P1_DELTA == "undefined" ? null : (IS_Attr_OFER_P1_DELTA.value ? IS_Attr_OFER_P1_DELTA.value : ""));
}
function cicGetOferP2Cod() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_OFER_P2_COD == "undefined" ? null : (IS_Attr_OFER_P2_COD.value ? IS_Attr_OFER_P2_COD.value : ""));
}
function cicGetOferP2Desc() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_OFER_P2_DESC == "undefined" ? null : (IS_Attr_OFER_P2_DESC.value ? IS_Attr_OFER_P2_DESC.value : ""));
}
function cicGetOferP2Precio() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_OFER_P2_PRECIO == "undefined" ? null : (IS_Attr_OFER_P2_PRECIO.value ? IS_Attr_OFER_P2_PRECIO.value : ""));
}
function cicGetOferP2Delta() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_OFER_P2_DELTA == "undefined" ? null : (IS_Attr_OFER_P2_DELTA.value ? IS_Attr_OFER_P2_DELTA.value : ""));
}
function cicGetOferP3Cod() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_OFER_P3_COD == "undefined" ? null : (IS_Attr_OFER_P3_COD.value ? IS_Attr_OFER_P3_COD.value : ""));
}
function cicGetOferP3Desc() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_OFER_P3_DESC == "undefined" ? null : (IS_Attr_OFER_P3_DESC.value ? IS_Attr_OFER_P3_DESC.value : ""));
}
function cicGetOferP3Precio() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_OFER_P3_PRECIO == "undefined" ? null : (IS_Attr_OFER_P3_PRECIO.value ? IS_Attr_OFER_P3_PRECIO.value : ""));
}
function cicGetOferP3Delta() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_OFER_P3_DELTA == "undefined" ? null : (IS_Attr_OFER_P3_DELTA.value ? IS_Attr_OFER_P3_DELTA.value : ""));
}
function cicGetOferP4Cod() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_OFER_P4_COD == "undefined" ? null : (IS_Attr_OFER_P4_COD.value ? IS_Attr_OFER_P4_COD.value : ""));
}
function cicGetOferP4Desc() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_OFER_P4_DESC == "undefined" ? null : (IS_Attr_OFER_P4_DESC.value ? IS_Attr_OFER_P4_DESC.value : ""));
}
function cicGetOferP4Precio() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_OFER_P4_PRECIO == "undefined" ? null : (IS_Attr_OFER_P4_PRECIO.value ? IS_Attr_OFER_P4_PRECIO.value : ""));
}
function cicGetOferP4Delta() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_OFER_P4_DELTA == "undefined" ? null : (IS_Attr_OFER_P4_DELTA.value ? IS_Attr_OFER_P4_DELTA.value : ""));
}
function cicGetOferP5Cod() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_OFER_P5_COD == "undefined" ? null : (IS_Attr_OFER_P5_COD.value ? IS_Attr_OFER_P5_COD.value : ""));
}
function cicGetOferP5Desc() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_OFER_P5_DESC == "undefined" ? null : (IS_Attr_OFER_P5_DESC.value ? IS_Attr_OFER_P5_DESC.value : ""));
}
function cicGetOferP5Precio() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_OFER_P5_PRECIO == "undefined" ? null : (IS_Attr_OFER_P5_PRECIO.value ? IS_Attr_OFER_P5_PRECIO.value : ""));
}
function cicGetOferP5Delta() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_OFER_P5_DELTA == "undefined" ? null : (IS_Attr_OFER_P5_DELTA.value ? IS_Attr_OFER_P5_DELTA.value : ""));
}

function cicGetGenerico01() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_GENERICO_01 == "undefined" ? null : (IS_Attr_GENERICO_01.value ? IS_Attr_GENERICO_01.value : ""));
}
function cicGetGenerico02() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_GENERICO_02 == "undefined" ? null : (IS_Attr_GENERICO_02.value ? IS_Attr_GENERICO_02.value : ""));
}
function cicGetGenerico03() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_GENERICO_03 == "undefined" ? null : (IS_Attr_GENERICO_03.value ? IS_Attr_GENERICO_03.value : ""));
}
function cicGetGenerico04() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_GENERICO_04 == "undefined" ? null : (IS_Attr_GENERICO_04.value ? IS_Attr_GENERICO_04.value : ""));
}
function cicGetGenerico05() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_GENERICO_05 == "undefined" ? null : (IS_Attr_GENERICO_05.value ? IS_Attr_GENERICO_05.value : ""));
}
function cicGetGenerico06() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_GENERICO_06 == "undefined" ? null : (IS_Attr_GENERICO_06.value ? IS_Attr_GENERICO_06.value : ""));
}
function cicGetGenerico07() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_GENERICO_07 == "undefined" ? null : (IS_Attr_GENERICO_07.value ? IS_Attr_GENERICO_07.value : ""));
}
function cicGetGenerico08() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_GENERICO_08 == "undefined" ? null : (IS_Attr_GENERICO_08.value ? IS_Attr_GENERICO_08.value : ""));
}
function cicGetGenerico09() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_GENERICO_09 == "undefined" ? null : (IS_Attr_GENERICO_09.value ? IS_Attr_GENERICO_09.value : ""));
}
function cicGetGenerico10() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_GENERICO_10 == "undefined" ? null : (IS_Attr_GENERICO_10.value ? IS_Attr_GENERICO_10.value : ""));
}
function cicGetGenerico11() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_GENERICO_11 == "undefined" ? null : (IS_Attr_GENERICO_11.value ? IS_Attr_GENERICO_11.value : ""));
}
function cicGetGenerico12() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_GENERICO_12 == "undefined" ? null : (IS_Attr_GENERICO_12.value ? IS_Attr_GENERICO_12.value : ""));
}
function cicGetGenerico13() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_GENERICO_13 == "undefined" ? null : (IS_Attr_GENERICO_13.value ? IS_Attr_GENERICO_13.value : ""));
}
function cicGetGenerico14() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_GENERICO_14 == "undefined" ? null : (IS_Attr_GENERICO_14.value ? IS_Attr_GENERICO_14.value : ""));
}
function cicGetGenerico15() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_GENERICO_15 == "undefined" ? null : (IS_Attr_GENERICO_15.value ? IS_Attr_GENERICO_15.value : ""));
}
function cicSetGenerico15(generico) {
    IS_Attr_GENERICO_15.value = generico;
    return true;
}
function cicGetGenerico16() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_GENERICO_16 == "undefined" ? null : (IS_Attr_GENERICO_16.value ? IS_Attr_GENERICO_16.value : ""));
}
function cicGetGenerico17() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_GENERICO_17 == "undefined" ? null : (IS_Attr_GENERICO_17.value ? IS_Attr_GENERICO_17.value : ""));
}
function cicSetGenerico17(generico) {
    IS_Attr_GENERICO_17.value = generico;
    return true;
}
function cicGetGenerico18() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_GENERICO_18 == "undefined" ? null : (IS_Attr_GENERICO_18.value ? IS_Attr_GENERICO_18.value : ""));
}
function cicGetGenerico19() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_GENERICO_19 == "undefined" ? null : (IS_Attr_GENERICO_19.value ? IS_Attr_GENERICO_19.value : ""));
}
function cicGetSbxObservaciones() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_SXB_OBSERVACIONES == "undefined" ? null : (IS_Attr_SXB_OBSERVACIONES.value ? IS_Attr_SXB_OBSERVACIONES.value : ""));
}
function cicGetSbxConvergencia() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_SXB_CONVERGENCIA == "undefined" ? null : (IS_Attr_SXB_CONVERGENCIA.value ? IS_Attr_SXB_CONVERGENCIA.value : ""));
}
function cicGetSbxReferido() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_SXB_REFERIDO == "undefined" ? null : (IS_Attr_SXB_REFERIDO.value ? IS_Attr_SXB_REFERIDO.value : ""));
}

//Sixbell
function cicGetSbxGenerico1() {
    if (app.isInboundCall) return scripter.callObject.getAttribute("ATTR_TABLENAME");
    return (typeof IS_Attr_sxb_generico1 == "undefined" ? "" : (IS_Attr_sxb_generico1.value ? IS_Attr_sxb_generico1.value : ""));
}

function cicGetSbxGenerico2() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_sxb_generico2 == "undefined" ? "" : (IS_Attr_sxb_generico2.value ? IS_Attr_sxb_generico2.value : ""));
}

function cicGetSbxGenerico3() {
    if (app.isInboundCall) return "";
    return (typeof IS_Attr_sxb_generico3 == "undefined" ? "" : (IS_Attr_sxb_generico3.value ? IS_Attr_sxb_generico3.value : ""));
}


//Setter
function cicSetCallId(value) {
    IS_Attr_CallID.value = value;
    return true;
}

function cicSetCuartil(value) {
    IS_Attr_CUARTIL.value = value;
    return true;
}

function cicSetCliNombre(value) {
    IS_Attr_CLI_NOMBRE.value = value;
    return true;
}

function cicSetCliRutConDV(value) {
    IS_Attr_CLI_RUT_CON_DV.value = value;
    return true;
}

function cicSetCliContacAlter(value) {
    IS_Attr_CLI_CONTAC_ALTER.value = value;
    return true;
}
function cicSetCliContacAlterFijo(value) {
    IS_Attr_CLI_CONTAC_ALTER_FIJO.value = value;
    return true;
}

function cicSetCliContacAlterMovil(value) {
    IS_Attr_CLI_CONTAC_ALTER_MOVIL.value = value;
    return true;
}
function cicSetDirCalle(value) {
    IS_Attr_DIR_CALLE.value = value;
    return true;
}
function cicSetDirNro(value) {
    IS_Attr_DIR_NRO.value = value;
    return true;
}
function cicSetDirPiso(value) {
    IS_Attr_DIR_PISO.value = value;
    return true;
}

function cicSetDirDepto(value) {
    IS_Attr_DIR_DEPTO.value = value;
    return true;
}
function cicSetDirComuna(value) {
    IS_Attr_DIR_COMUNA.value = value;
    return true;
}

function cicSetDirRegion(value) {
    IS_Attr_DIR_REGION.value = value;
    return true;
}

function cicSetSbxObservaciones(value) {
    IS_Attr_SXB_OBSERVACIONES.value = value;
    return true;
}

function cicSetSbxReferido(value) {
    IS_Attr_SXB_REFERIDO.value = value;
    return true;
}
function cicSetSbxConvergencia(value) {
    IS_Attr_SXB_CONVERGENCIA.value = value;
    return true;
}

function cicSetSbxGenerico2(value) {
    IS_Attr_sxb_generico2.value = value;
    return true;
}


// Acciones
function cicPickup() { IS_Action_Pickup.click(); }
function cicSetForeground() { IS_Action_SetForeground.click(); }
function cicSelectPage() { IS_Action_SelectPage.click(); }
function cicRequestBreak() { IS_Action_RequestBreak.click(); }
function cicTrace(msg, level) {
    //Levels
    //0 = Error
    //1 = Warning
    //2 = Status
    //3 = Notes
    level = level || "2";
    IS_Action_Trace.message = "[DBG][CallID: " + cicGetCallId() + "]" + msg;
    IS_Action_Trace.level = level;
    IS_Action_Trace.click();
}
function cicMute(callId) {
    if (callId) {
        IS_Action_Mute.CallID = callId;
    }
    IS_Action_Mute.click();
}
function cicEndBreak() { IS_Action_EndBreak.click(); }
function cicCallComplete(completeData) {

    if (completeData.wrapupcode == "Scheduled") {
        IS_Action_CallComplete.agentid = completeData.agentid;
        IS_Action_CallComplete.year = completeData.year;
        IS_Action_CallComplete.month = completeData.month;
        IS_Action_CallComplete.day = completeData.day;
        IS_Action_CallComplete.hour = completeData.hour;
        IS_Action_CallComplete.minute = completeData.minute;
        IS_Action_CallComplete.abandoned = completeData.abandoned;
    } else if (completeData.wrapupcode == "Not Reached") {
        IS_Action_CallComplete.abandoned = completeData.abandoned;
    }

    if (completeData.wrapupcode != "") IS_Action_CallComplete.WrapupCode = completeData.wrapupcode;

    IS_Action_CallComplete.click();
}
function cicDisconnect(callId) {
    if (callId) {
        IS_Action_Disconnect.click(callId);
    } else {
        IS_Action_Disconnect.click();
    }

}
function cicTransfer(transferData) {
    IS_Action_Transfer.consult = transferData.consult;
    IS_Action_Transfer.recipient = transferData.recipient;
    IS_Action_Transfer.click();
}

function cicHold() { IS_Action_Hold.click(); }
function cicRequestLogoff() { IS_Action_RequestLogoff.click(); }

function cicMarkCallForFinishing() { IS_Action_MarkCallForFinishing.click(); }

function cicWriteData() { IS_Action_WriteData.click(); }


function cicClientStatus(statuskey) {
    IS_Action_ClientStatus.statuskey = statuskey;
    IS_Action_ClientStatus.click();
}

function cicStage(stageNumber) {
    IS_Action_Stage.stage = stageNumber;
    IS_Action_Stage.click();
}

function cicPlacePreviewCall() { IS_Action_PlacePreviewCall.click(); }

// Eventos
function IS_Event_BreakGranted() {
    if (cicEventListeners["BreakGranted"]) cicEventListeners["BreakGranted"]();
}
function IS_Event_PreviewDataPop() {
    if (cicEventListeners["PreviewDataPop"]) cicEventListeners["PreviewDataPop"]();
}
function IS_Event_NewPreviewCall() {
    if (cicEventListeners["NewPreviewCall"]) cicEventListeners["NewPreviewCall"]();
}
function ObjectAdded(ObjType, ObjId) {
    if (cicEventListeners["ObjectAdded"]) cicEventListeners["ObjectAdded"](ObjType, ObjId);
}
function IS_Event_NewPredictiveCall(callid) {
    if (cicEventListeners["NewPredictiveCall"]) cicEventListeners["NewPredictiveCall"](callid);
}
