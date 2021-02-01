var cicEventListeners = {};

function cicAddListener(eventName, callback) {
    cicEventListeners[eventName] = callback;
}

function getPrefijoMarcacionManual() {
    return "8186";
}

// Attributos CIC
function cicGetSbxConvergencia() {
    return (typeof IS_Attr_SXB_CONVERGENCIA == "undefined" ? null : (IS_Attr_SXB_CONVERGENCIA.value ? IS_Attr_SXB_CONVERGENCIA.value : ""));
}
function cicGetSbxReferido() {
    return (typeof IS_Attr_SXB_REFERIDO == "undefined" ? null : (IS_Attr_SXB_REFERIDO.value ? IS_Attr_SXB_REFERIDO.value : ""));
}

function cicGetCallId() {
    return (typeof IS_Attr_CallID == "undefined" ? null : (IS_Attr_CallID.value ? IS_Attr_CallID.value : ""));
}
function cicGetCampaignName() {
    return (typeof IS_Attr_CampaignName == "undefined" ? "[Nombre Campaña]" : (IS_Attr_CampaignName.value ? IS_Attr_CampaignName.value : "[Nombre Campaña]"));
}
function cicGetSystemAgentId() {
    return (typeof IS_System_AgentID == "undefined" ? null : (IS_System_AgentID.value ? IS_System_AgentID.value : ""));
}
function cicGetSystemAgentName() {
    return (typeof IS_System_AgentName == "undefined" ? null : (IS_System_AgentName.value ? IS_System_AgentName.value : ""));
}
function cicGetSystemClientStatus() {
    return (typeof IS_System_ClientStatus == "undefined" ? null : (IS_System_ClientStatus.value ? IS_System_ClientStatus.value : ""));
}
function cicSetCallId(callId) {
    IS_Attr_CallID.value = callId;
    return true;
}

function cicSetSbxReferido(callId) {
    IS_Attr_SXB_REFERIDO.value = callId;
    return true;
}


function cicSetSbxConvergencia(callId) {
    IS_Attr_SXB_CONVERGENCIA.value = callId;
    return true;
}
function cicGetSystemClientStatus() {
    return (typeof IS_System_ClientStatus == "undefined" ? null : (IS_System_ClientStatus.value ? IS_System_ClientStatus.value : ""));
}
function cicGetCampaignId() {
    return (typeof IS_Attr_CampaignID == "undefined" ? null : (IS_Attr_CampaignID.value ? IS_Attr_CampaignID.value : ""));
}

// Atributos campañas
function cicGetAccId() {
    return (typeof IS_Attr_ACC_ID == "undefined" ? null : (IS_Attr_ACC_ID.value ? IS_Attr_ACC_ID.value : ""));
}
function cicGetAccLineaId() {
    return (typeof IS_Attr_ACC_LINEA_ID == "undefined" ? null : (IS_Attr_ACC_LINEA_ID.value ? IS_Attr_ACC_LINEA_ID.value : ""));
}
function cicGetAccCampanaId() {
    return (typeof IS_Attr_ACC_CAMPANA_ID == "undefined" ? null : (IS_Attr_ACC_CAMPANA_ID.value ? IS_Attr_ACC_CAMPANA_ID.value : ""));
}
function cicGetAccHorario() {
    return (typeof IS_Attr_ACC_HORARIO == "undefined" ? null : (IS_Attr_ACC_HORARIO.value ? IS_Attr_ACC_HORARIO.value : ""));
}
function cicGetAccScore() {
    return (typeof IS_Attr_ACC_SCORE == "undefined" ? null : (IS_Attr_ACC_SCORE.value ? IS_Attr_ACC_SCORE.value : ""));
}
function cicGetAccPreg1() {
    return (typeof IS_Attr_ACC_PREG_1 == "undefined" ? null : (IS_Attr_ACC_PREG_1.value ? IS_Attr_ACC_PREG_1.value : ""));
}
function cicGetAccPreg2() {
    return (typeof IS_Attr_ACC_PREG_2 == "undefined" ? null : (IS_Attr_ACC_PREG_2.value ? IS_Attr_ACC_PREG_2.value : ""));
}
function cicGetAccArg1Id() {
    return (typeof IS_Attr_ACC_ARG1_ID == "undefined" ? null : (IS_Attr_ACC_ARG1_ID.value ? IS_Attr_ACC_ARG1_ID.value : ""));
}
function cicGetAccArg2Id() {
    return (typeof IS_Attr_ACC_ARG2_ID == "undefined" ? null : (IS_Attr_ACC_ARG2_ID.value ? IS_Attr_ACC_ARG2_ID.value : ""));
}
function cicGetAccArg3Id() {
    return (typeof IS_Attr_ACC_ARG3_ID == "undefined" ? null : (IS_Attr_ACC_ARG3_ID.value ? IS_Attr_ACC_ARG3_ID.value : ""));
}

function cicGetCallFecGestIni() {
    return (typeof IS_Attr_CALL_FEC_GEST_INI == "undefined" ? null : (IS_Attr_CALL_FEC_GEST_INI.value ? IS_Attr_CALL_FEC_GEST_INI.value : ""));
}
function cicGetCallFecGestFin() {
    return (typeof IS_Attr_CALL_FEC_GEST_FIN == "undefined" ? null : (IS_Attr_CALL_FEC_GEST_FIN.value ? IS_Attr_CALL_FEC_GEST_FIN.value : ""));
}
function cicGetCallRegId() {
    return (typeof IS_Attr_CALL_REG_ID == "undefined" ? null : (IS_Attr_CALL_REG_ID.value ? IS_Attr_CALL_REG_ID.value : ""));
}
function cicGetCallPaisId() {
    return (typeof IS_Attr_CALL_PAIS_ID == "undefined" ? null : (IS_Attr_CALL_PAIS_ID.value ? IS_Attr_CALL_PAIS_ID.value : ""));
}
function cicGetCallCallCenterId() {
    return (typeof IS_Attr_CALL_CALLCENTER_ID == "undefined" ? null : (IS_Attr_CALL_CALLCENTER_ID.value ? IS_Attr_CALL_CALLCENTER_ID.value : ""));
}
function cicGetCallCanalId() {
    return (typeof IS_Attr_CALL_CANAL_ID == "undefined" ? null : (IS_Attr_CALL_CANAL_ID.value ? IS_Attr_CALL_CANAL_ID.value : ""));
}
function cicGetCallFamiliaId() {
    return (typeof IS_Attr_CALL_FAMILIA_ID == "undefined" ? null : (IS_Attr_CALL_FAMILIA_ID.value ? IS_Attr_CALL_FAMILIA_ID.value : ""));
}
function cicGetCallBatchId() {
    return (typeof IS_Attr_CALL_BATCH_ID == "undefined" ? null : (IS_Attr_CALL_BATCH_ID.value ? IS_Attr_CALL_BATCH_ID.value : ""));
}
function cicGetCallSistemaId() {
    return (typeof IS_Attr_CALL_SISTEMA_ID == "undefined" ? null : (IS_Attr_CALL_SISTEMA_ID.value ? IS_Attr_CALL_SISTEMA_ID.value : ""));
}
function cicGetCallArchivo() {
    return (typeof IS_Attr_CALL_ARCHIVO == "undefined" ? null : (IS_Attr_CALL_ARCHIVO.value ? IS_Attr_CALL_ARCHIVO.value : ""));
}

function cicGetVentaProdCod() {
    return (typeof IS_Attr_VENTA_PROD_COD == "undefined" ? null : (IS_Attr_VENTA_PROD_COD.value ? IS_Attr_VENTA_PROD_COD.value : ""));
}
function cicGetVentaSistemaId() {
    return (typeof IS_Attr_VENTA_SISTEMA_ID == "undefined" ? null : (IS_Attr_VENTA_SISTEMA_ID.value ? IS_Attr_VENTA_SISTEMA_ID.value : ""));
}
function cicGetVentaOossCod() {
    return (typeof IS_Attr_VENTA_OOSS_COD == "undefined" ? null : (IS_Attr_VENTA_OOSS_COD.value ? IS_Attr_VENTA_OOSS_COD.value : ""));
}
function cicGetCuartil() {
    return (typeof IS_Attr_CUARTIL == "undefined" ? null : (IS_Attr_CUARTIL.value ? IS_Attr_CUARTIL.value : ""));
}
function cicSetCuartil(cuartil) {
    IS_Attr_CUARTIL.value = cuartil;
    return true;
}

function cicGetZone() {
    return (typeof IS_Attr_ZONE == "undefined" ? null : (IS_Attr_ZONE.value ? IS_Attr_ZONE.value : ""));
}
function cicGetAttemps() {
    return (typeof IS_Attr_ATTEMPTS == "undefined" ? null : (IS_Attr_ATTEMPTS.value ? IS_Attr_ATTEMPTS.value : "0"));
}
function cicGetStatus() {
    return (typeof IS_Attr_Status == "undefined" ? null : (IS_Attr_Status.value ? IS_Attr_Status.value : ""));
}

function cicGetI3Identity() {
    return (typeof IS_Attr_I3_IDENTITY == "undefined" ? null : (IS_Attr_I3_IDENTITY.value ? IS_Attr_I3_IDENTITY.value : ""));
}
function cicGetI3SiteId() {
    return (typeof IS_Attr_I3_SITEID == "undefined" ? null : (IS_Attr_I3_SITEID.value ? IS_Attr_I3_SITEID.value : ""));
}
function cicGetI3ActiveCampaignId() {
    return (typeof IS_Attr_I3_ACTIVECAMPAIGNID == "undefined" ? null : (IS_Attr_I3_ACTIVECAMPAIGNID.value ? IS_Attr_I3_ACTIVECAMPAIGNID.value : ""));
}
function cicGetI3AttemptsRemoteHangUp() {
    return (typeof IS_Attr_I3_ATTEMPTSREMOTEHANGUP == "undefined" ? null : (IS_Attr_I3_ATTEMPTSREMOTEHANGUP.value ? IS_Attr_I3_ATTEMPTSREMOTEHANGUP.value : ""));
}
function cicGetI3AttemptsSystemHangUp() {
    return (typeof IS_Attr_I3_ATTEMPTSSYSTEMHANGUP == "undefined" ? null : (IS_Attr_I3_ATTEMPTSSYSTEMHANGUP.value ? IS_Attr_I3_ATTEMPTSSYSTEMHANGUP.value : ""));
}
function cicGetI3AttemptsAbandoned() {
    return (typeof IS_Attr_I3_ATTEMPTSABANDONED == "undefined" ? null : (IS_Attr_I3_ATTEMPTSABANDONED.value ? IS_Attr_I3_ATTEMPTSABANDONED.value : ""));
}
function cicGetI3AttemptsBusy() {
    return (typeof IS_Attr_I3_ATTEMPTSBUSY == "undefined" ? null : (IS_Attr_I3_ATTEMPTSBUSY.value ? IS_Attr_I3_ATTEMPTSBUSY.value : ""));
}
function cicGetI3AttempsFax() {
    return (typeof IS_Attr_I3_ATTEMPTSFAX == "undefined" ? null : (IS_Attr_I3_ATTEMPTSFAX.value ? IS_Attr_I3_ATTEMPTSFAX.value : ""));
}
function cicGetI3AttempsNoAnswer() {
    return (typeof IS_Attr_I3_ATTEMPTSNOANSWER == "undefined" ? null : (IS_Attr_I3_ATTEMPTSNOANSWER.value ? IS_Attr_I3_ATTEMPTSNOANSWER.value : ""));
}
function cicGetI3AttempsMachine() {
    return (typeof IS_Attr_I3_ATTEMPTSMACHINE == "undefined" ? null : (IS_Attr_I3_ATTEMPTSMACHINE.value ? IS_Attr_I3_ATTEMPTSMACHINE.value : ""));
}
function cicGetI3AttemptsRescheduled() {
    return (typeof IS_Attr_I3_ATTEMPTSRESCHEDULED == "undefined" ? null : (IS_Attr_I3_ATTEMPTSRESCHEDULED.value ? IS_Attr_I3_ATTEMPTSRESCHEDULED.value : ""));
}
function cicGetI3AttemptsSitCallable() {
    return (typeof IS_Attr_I3_ATTEMPTSSITCALLABLE == "undefined" ? null : (IS_Attr_I3_ATTEMPTSSITCALLABLE.value ? IS_Attr_I3_ATTEMPTSSITCALLABLE.value : ""));
}
function cicGetI3AttemptsDaily() {
    return (typeof IS_Attr_I3_ATTEMPTSDAILY == "undefined" ? null : (IS_Attr_I3_ATTEMPTSDAILY.value ? IS_Attr_I3_ATTEMPTSDAILY.value : ""));
}
function cicGetI3LastCalledUtc() {
    return (typeof IS_Attr_I3_LASTCALLED_UTC == "undefined" ? null : (IS_Attr_I3_LASTCALLED_UTC.value ? IS_Attr_I3_LASTCALLED_UTC.value : ""));
}
function cicGetI3RowId() {
    return (typeof IS_Attr_I3_ROWID == "undefined" ? null : (IS_Attr_I3_ROWID.value ? IS_Attr_I3_ROWID.value : ""));
}

function cicGetSuccessResult() {
    return (typeof IS_Attr_SUCCESSRESULT == "undefined" ? null : (IS_Attr_SUCCESSRESULT.value ? IS_Attr_SUCCESSRESULT.value : ""));
}
function cicGetI3UploadId() {
    return (typeof IS_Attr_I3_UPLOAD_ID == "undefined" ? null : (IS_Attr_I3_UPLOAD_ID.value ? IS_Attr_SUCCESSRESULT.value : ""));
}

function cicGetDncRegId() {
    return (typeof IS_Attr_DNC_REG_ID == "undefined" ? null : (IS_Attr_DNC_REG_ID.value ? IS_Attr_DNC_REG_ID.value : ""));
}
function cicGetToExclude() {
    return (typeof IS_Attr_TO_EXCLUDE == "undefined" ? null : (IS_Attr_TO_EXCLUDE.value ? IS_Attr_TO_EXCLUDE.value : ""));
}
function cicGetExpiration() {
    return (typeof IS_Attr_EXPIRATION == "undefined" ? null : (IS_Attr_EXPIRATION.value ? IS_Attr_EXPIRATION.value : ""));
}

function cicGetRut() {
    return (typeof IS_Attr_Rut == "undefined" ? null : (IS_Attr_Rut.value ? IS_Attr_Rut.value : ""));
}
function cicGetNumberToDial() {
    return (typeof IS_Attr_Numbertodial == "undefined" ? null : (IS_Attr_Numbertodial.value ? IS_Attr_Numbertodial.value : ""));
}
function cicGetCliId() {
    return (typeof IS_Attr_CLI_ID == "undefined" ? null : (IS_Attr_CLI_ID.value ? IS_Attr_CLI_ID.value : ""));
}
function cicGetCliNombre() {
    return (typeof IS_Attr_CLI_NOMBRE == "undefined" ? null : (IS_Attr_CLI_NOMBRE.value ? IS_Attr_CLI_NOMBRE.value : ""));
}
function cicSetCliNombre(obs) {
    IS_Attr_CLI_NOMBRE.value = obs;
    return true;
}
function cicGetCliRutConDV() {
    return (typeof IS_Attr_CLI_RUT_CON_DV == "undefined" ? null : (IS_Attr_CLI_RUT_CON_DV.value ? IS_Attr_CLI_RUT_CON_DV.value : ""));
}
function cicSetCliRutConDV(obs) {
    IS_Attr_CLI_RUT_CON_DV.value = obs;
    return true;
}
function cicGetCliContacAlter() {
    return (typeof IS_Attr_CLI_CONTAC_ALTER == "undefined" ? null : (IS_Attr_CLI_CONTAC_ALTER.value ? IS_Attr_CLI_CONTAC_ALTER.value : ""));
}
function cicSetCliContacAlter(obs) {
    IS_Attr_CLI_CONTAC_ALTER.value = obs;
    return true;
}

function cicGetCliContacAlterFijo() {
    return (typeof IS_Attr_CLI_CONTAC_ALTER_FIJO == "undefined" ? null : (IS_Attr_CLI_CONTAC_ALTER_FIJO.value ? IS_Attr_CLI_CONTAC_ALTER_FIJO.value : ""));
}
function cicSetCliContacAlterFijo(obs) {
    IS_Attr_CLI_CONTAC_ALTER_FIJO.value = obs;
    return true;
}

function cicGetCliContacAlterMovil() {
    return (typeof IS_Attr_CLI_CONTAC_ALTER_MOVIL == "undefined" ? null : (IS_Attr_CLI_CONTAC_ALTER_MOVIL.value ? IS_Attr_CLI_CONTAC_ALTER_MOVIL.value : ""));
}

function cicSetCliContacAlterMovil(obs) {
    IS_Attr_CLI_CONTAC_ALTER_MOVIL.value = obs;
    return true;
}
function cicGetCliLineaAntiguedad() {
    return (typeof IS_Attr_CLI_LINEA_ANTIGUEDAD == "undefined" ? null : (IS_Attr_CLI_LINEA_ANTIGUEDAD.value ? IS_Attr_CLI_LINEA_ANTIGUEDAD.value : ""));
}
function cicGetCliAntiguedad() {
    return (typeof IS_Attr_CLI_ANTIGUEDAD == "undefined" ? null : (IS_Attr_CLI_ANTIGUEDAD.value ? IS_Attr_CLI_ANTIGUEDAD.value : ""));
}
function cicGetCliCicloCod() {
    return (typeof IS_Attr_CLI_CICLO_COD == "undefined" ? null : (IS_Attr_CLI_CICLO_COD.value ? IS_Attr_CLI_CICLO_COD.value : ""));
}
function cicGetCliUltBoletaMonto() {
    return (typeof IS_Attr_CLI_ULT_BOLETA_MONTO == "undefined" ? null : (IS_Attr_CLI_ULT_BOLETA_MONTO.value ? IS_Attr_CLI_ULT_BOLETA_MONTO.value : ""));
}
function cicGetCliSegmento() {
    return (typeof IS_Attr_CLI_SEGMENTO == "undefined" ? null : (IS_Attr_CLI_SEGMENTO.value ? IS_Attr_CLI_SEGMENTO.value : ""));
}
function cicGetCliGse() {
    return (typeof IS_Attr_CLI_GSE == "undefined" ? null : (IS_Attr_CLI_GSE.value ? IS_Attr_CLI_GSE.value : ""));
}
function cicGetCliIndPortado() {
    return (typeof IS_Attr_CLI_IND_PORTADO == "undefined" ? null : (IS_Attr_CLI_IND_PORTADO.value ? IS_Attr_CLI_IND_PORTADO.value : ""));
}
function cicGetDirCalle() {
    return (typeof IS_Attr_DIR_CALLE == "undefined" ? null : (IS_Attr_DIR_CALLE.value ? IS_Attr_DIR_CALLE.value : ""));
}

function cicSetDirCalle(callId) {
    IS_Attr_DIR_CALLE.value = callId;
    return true;
}

function cicGetDirNro() {
    return (typeof IS_Attr_DIR_NRO == "undefined" ? null : (IS_Attr_DIR_NRO.value ? IS_Attr_DIR_NRO.value : ""));
}

function cicSetDirNro(callId) {
    IS_Attr_DIR_NRO.value = callId;
    return true;
}

function cicGetDirPiso() {
    return (typeof IS_Attr_DIR_PISO == "undefined" ? null : (IS_Attr_DIR_PISO.value ? IS_Attr_DIR_PISO.value : ""));
}

function cicSetDirPiso(callId) {
    IS_Attr_DIR_PISO.value = callId;
    return true;
}

function cicGetDirDepto() {
    return (typeof IS_Attr_DIR_DEPTO == "undefined" ? null : (IS_Attr_DIR_DEPTO.value ? IS_Attr_DIR_DEPTO.value : ""));
}

function cicSetDirDepto(callId) {
    IS_Attr_DIR_DEPTO.value = callId;
    return true;
}

function cicGetDirComuna() {
    return (typeof IS_Attr_DIR_COMUNA == "undefined" ? null : (IS_Attr_DIR_COMUNA.value ? IS_Attr_DIR_COMUNA.value : ""));
}
function cicSetDirComuna(callId) {
    IS_Attr_DIR_COMUNA.value = callId;
    return true;
}

function cicGetDirCiudad() {
    return (typeof IS_Attr_DIR_CIUDAD == "undefined" ? null : (IS_Attr_DIR_CIUDAD.value ? IS_Attr_DIR_CIUDAD.value : ""));
}
function cicGetDirRegion() {
    return (typeof IS_Attr_DIR_REGION == "undefined" ? null : (IS_Attr_DIR_REGION.value ? IS_Attr_DIR_REGION.value : ""));
}
function cicSetDirRegion(callId) {
    IS_Attr_DIR_REGION.value = callId;
    return true;
}

function cicGetProdVigDesc() {
    return (typeof IS_Attr_PROD_VIG_DESC == "undefined" ? null : (IS_Attr_PROD_VIG_DESC.value ? IS_Attr_PROD_VIG_DESC.value : ""));
}
function cicGetProdVigPrecio() {
    return (typeof IS_Attr_PROD_VIG_PRECIO == "undefined" ? null : (IS_Attr_PROD_VIG_PRECIO.value ? IS_Attr_PROD_VIG_PRECIO.value : ""));
}
function cicGetProdVigFinPromo() {
    return (typeof IS_Attr_PROD_VIG_FIN_PROMO == "undefined" ? null : (IS_Attr_PROD_VIG_FIN_PROMO.value ? IS_Attr_PROD_VIG_FIN_PROMO.value : ""));
}
function cicGetOferP1Cod() {
    return (typeof IS_Attr_OFER_P1_COD == "undefined" ? null : (IS_Attr_OFER_P1_COD.value ? IS_Attr_OFER_P1_COD.value : ""));
}
function cicGetOferP1Desc() {
    return (typeof IS_Attr_OFER_P1_DESC == "undefined" ? null : (IS_Attr_OFER_P1_DESC.value ? IS_Attr_OFER_P1_DESC.value : ""));
}
function cicGetOferP1Precio() {
    return (typeof IS_Attr_OFER_P1_PRECIO == "undefined" ? null : (IS_Attr_OFER_P1_PRECIO.value ? IS_Attr_OFER_P1_PRECIO.value : ""));
}
function cicGetOferP1Delta() {
    return (typeof IS_Attr_OFER_P1_DELTA == "undefined" ? null : (IS_Attr_OFER_P1_DELTA.value ? IS_Attr_OFER_P1_DELTA.value : ""));
}
function cicGetOferP2Cod() {
    return (typeof IS_Attr_OFER_P2_COD == "undefined" ? null : (IS_Attr_OFER_P2_COD.value ? IS_Attr_OFER_P2_COD.value : ""));
}
function cicGetOferP2Desc() {
    return (typeof IS_Attr_OFER_P2_DESC == "undefined" ? null : (IS_Attr_OFER_P2_DESC.value ? IS_Attr_OFER_P2_DESC.value : ""));
}
function cicGetOferP2Precio() {
    return (typeof IS_Attr_OFER_P2_PRECIO == "undefined" ? null : (IS_Attr_OFER_P2_PRECIO.value ? IS_Attr_OFER_P2_PRECIO.value : ""));
}
function cicGetOferP2Delta() {
    return (typeof IS_Attr_OFER_P2_DELTA == "undefined" ? null : (IS_Attr_OFER_P2_DELTA.value ? IS_Attr_OFER_P2_DELTA.value : ""));
}
function cicGetOferP3Cod() {
    return (typeof IS_Attr_OFER_P3_COD == "undefined" ? null : (IS_Attr_OFER_P3_COD.value ? IS_Attr_OFER_P2_COD.value : ""));
}
function cicGetOferP3Desc() {
    return (typeof IS_Attr_OFER_P3_DESC == "undefined" ? null : (IS_Attr_OFER_P3_DESC.value ? IS_Attr_OFER_P2_DESC.value : ""));
}
function cicGetOferP3Precio() {
    return (typeof IS_Attr_OFER_P3_PRECIO == "undefined" ? null : (IS_Attr_OFER_P3_PRECIO.value ? IS_Attr_OFER_P3_PRECIO.value : ""));
}
function cicGetOferP3Delta() {
    return (typeof IS_Attr_OFER_P3_DELTA == "undefined" ? null : (IS_Attr_OFER_P3_DELTA.value ? IS_Attr_OFER_P3_DELTA.value : ""));
}
function cicGetOferP4Cod() {
    return (typeof IS_Attr_OFER_P4_COD == "undefined" ? null : (IS_Attr_OFER_P4_COD.value ? IS_Attr_OFER_P4_COD.value : ""));
}
function cicGetOferP4Desc() {
    return (typeof IS_Attr_OFER_P4_DESC == "undefined" ? null : (IS_Attr_OFER_P4_DESC.value ? IS_Attr_OFER_P4_DESC.value : ""));
}
function cicGetOferP4Precio() {
    return (typeof IS_Attr_OFER_P4_PRECIO == "undefined" ? null : (IS_Attr_OFER_P4_PRECIO.value ? IS_Attr_OFER_P4_PRECIO.value : ""));
}
function cicGetOferP4Delta() {
    return (typeof IS_Attr_OFER_P4_DELTA == "undefined" ? null : (IS_Attr_OFER_P4_DELTA.value ? IS_Attr_OFER_P4_DELTA.value : ""));
}
function cicGetOferP5Cod() {
    return (typeof IS_Attr_OFER_P5_COD == "undefined" ? null : (IS_Attr_OFER_P5_COD.value ? IS_Attr_OFER_P5_COD.value : ""));
}
function cicGetOferP5Desc() {
    return (typeof IS_Attr_OFER_P5_DESC == "undefined" ? null : (IS_Attr_OFER_P5_DESC.value ? IS_Attr_OFER_P5_DESC.value : ""));
}
function cicGetOferP5Precio() {
    return (typeof IS_Attr_OFER_P5_PRECIO == "undefined" ? null : (IS_Attr_OFER_P5_PRECIO.value ? IS_Attr_OFER_P5_PRECIO.value : ""));
}
function cicGetOferP5Delta() {
    return (typeof IS_Attr_OFER_P5_DELTA == "undefined" ? null : (IS_Attr_OFER_P5_DELTA.value ? IS_Attr_OFER_P5_DELTA.value : ""));
}

function cicGetGenerico01() {
    return (typeof IS_Attr_GENERICO_01 == "undefined" ? null : (IS_Attr_GENERICO_01.value ? IS_Attr_GENERICO_01.value : ""));
}
function cicGetGenerico02() {
    return (typeof IS_Attr_GENERICO_02 == "undefined" ? null : (IS_Attr_GENERICO_02.value ? IS_Attr_GENERICO_02.value : ""));
}
function cicGetGenerico03() {
    return (typeof IS_Attr_GENERICO_03 == "undefined" ? null : (IS_Attr_GENERICO_03.value ? IS_Attr_GENERICO_03.value : ""));
}
function cicGetGenerico04() {
    return (typeof IS_Attr_GENERICO_04 == "undefined" ? null : (IS_Attr_GENERICO_04.value ? IS_Attr_GENERICO_04.value : ""));
}
function cicGetGenerico05() {
    return (typeof IS_Attr_GENERICO_05 == "undefined" ? null : (IS_Attr_GENERICO_05.value ? IS_Attr_GENERICO_05.value : ""));
}
function cicGetGenerico06() {
    return (typeof IS_Attr_GENERICO_06 == "undefined" ? null : (IS_Attr_GENERICO_06.value ? IS_Attr_GENERICO_06.value : ""));
}
function cicGetGenerico07() {
    return (typeof IS_Attr_GENERICO_07 == "undefined" ? null : (IS_Attr_GENERICO_07.value ? IS_Attr_GENERICO_07.value : ""));
}
function cicGetGenerico08() {
    return (typeof IS_Attr_GENERICO_08 == "undefined" ? null : (IS_Attr_GENERICO_08.value ? IS_Attr_GENERICO_08.value : ""));
}
function cicGetGenerico09() {
    return (typeof IS_Attr_GENERICO_09 == "undefined" ? null : (IS_Attr_GENERICO_09.value ? IS_Attr_GENERICO_09.value : ""));
}
function cicGetGenerico10() {
    return (typeof IS_Attr_GENERICO_10 == "undefined" ? null : (IS_Attr_GENERICO_10.value ? IS_Attr_GENERICO_10.value : ""));
}
function cicGetGenerico11() {
    return (typeof IS_Attr_GENERICO_11 == "undefined" ? null : (IS_Attr_GENERICO_11.value ? IS_Attr_GENERICO_11.value : ""));
}
function cicGetGenerico12() {
    return (typeof IS_Attr_GENERICO_12 == "undefined" ? null : (IS_Attr_GENERICO_12.value ? IS_Attr_GENERICO_12.value : ""));
}
function cicGetGenerico13() {
    return (typeof IS_Attr_GENERICO_13 == "undefined" ? null : (IS_Attr_GENERICO_13.value ? IS_Attr_GENERICO_13.value : ""));
}
function cicGetGenerico14() {
    return (typeof IS_Attr_GENERICO_14 == "undefined" ? null : (IS_Attr_GENERICO_14.value ? IS_Attr_GENERICO_14.value : ""));
}
function cicGetGenerico15() {
    return (typeof IS_Attr_GENERICO_15 == "undefined" ? null : (IS_Attr_GENERICO_15.value ? IS_Attr_GENERICO_15.value : ""));
}
function cicGetGenerico16() {
    return (typeof IS_Attr_GENERICO_16 == "undefined" ? null : (IS_Attr_GENERICO_16.value ? IS_Attr_GENERICO_16.value : ""));
}
function cicGetGenerico17() {
    return (typeof IS_Attr_GENERICO_17 == "undefined" ? null : (IS_Attr_GENERICO_17.value ? IS_Attr_GENERICO_17.value : ""));
}
function cicGetGenerico18() {
    return (typeof IS_Attr_GENERICO_18 == "undefined" ? null : (IS_Attr_GENERICO_18.value ? IS_Attr_GENERICO_18.value : ""));
}
function cicGetGenerico19() {
    return (typeof IS_Attr_GENERICO_19 == "undefined" ? null : (IS_Attr_GENERICO_19.value ? IS_Attr_GENERICO_19.value : ""));
}

function cicGetSbxObservaciones() {
    return (typeof IS_Attr_SXB_OBSERVACIONES == "undefined" ? null : (IS_Attr_SXB_OBSERVACIONES.value ? IS_Attr_SXB_OBSERVACIONES.value : ""));
}
function cicSetSbxObservaciones(obs) {
    IS_Attr_SXB_OBSERVACIONES.value = obs;
    return true;
}




/*function cicGetSbxConvergencia(x) {
    IS_Attr_SXB_CONVERGENCIA.value = x;
    return true;
}*/


//Sixbell
function cicGetSbxGenerico1() {
    return (typeof IS_Attr_sxb_generico1 == "undefined" ? "" : (IS_Attr_sxb_generico1.value ? IS_Attr_sxb_generico1.value : ""));
}

function cicGetSbxGenerico2() {
    return (typeof IS_Attr_sxb_generico2 == "undefined" ? "" : (IS_Attr_sxb_generico2.value ? IS_Attr_sxb_generico2.value : ""));
}

function cicSetSbxGenerico2(valor) {
    IS_Attr_sxb_generico2.value = valor;
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
function IS_Event_NewPredictiveCall(callid) {
    if (cicEventListeners["NewPredictiveCall"]) cicEventListeners["NewPredictiveCall"](callid);
}
function IS_Event_BreakGranted() {
    if (cicEventListeners["BreakGranted"]) cicEventListeners["BreakGranted"]();
}
function IS_Event_PreviewDataPop() {
    if (cicEventListeners["PreviewDataPop"]) cicEventListeners["PreviewDataPop"]();
}
function IS_Event_NewPreviewCall() {
    if (cicEventListeners["NewPreviewCall"]) cicEventListeners["NewPreviewCall"]();
}