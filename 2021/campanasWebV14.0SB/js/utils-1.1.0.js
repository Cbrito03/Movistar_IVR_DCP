function clearSelection() {
  var sel ;
  if(document.selection && document.selection.empty){
    document.selection.empty() ;
  } else if(window.getSelection) {
    sel=window.getSelection();
    if(sel && sel.removeAllRanges)
      sel.removeAllRanges() ;
  }
}

function enableButton(button, enabled) {
	var b = $(button);
	if (enabled) {
		b.removeAttr("disabled"); 
		b.removeClass("ui-state-disabled");
	} else {
		b.attr("disabled", "disabled");
		b.addClass("ui-state-disabled");
	}
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

function isButtonEnabled(button) {
	var b = $(button);
	if (b.attr("disabled")) return false;
	return true;
}

function calcularEdad(fecha) {
    var fechaActual = new Date()
    var diaActual = fechaActual.getDate();
    var mmActual = fechaActual.getMonth() + 1;
    var yyyyActual = fechaActual.getFullYear();
    var FechaNac = fecha.split("/");
    var diaCumple = FechaNac[0];
    var mmCumple = FechaNac[1];
    var yyyyCumple = FechaNac[2];
    //retiramos el primer cero de la izquierda
    if (mmCumple.substr(0, 1) == 0) {
        mmCumple = mmCumple.substring(1, 2);
    }
    //retiramos el primer cero de la izquierda
    if (diaCumple.substr(0, 1) == 0) {
        diaCumple = diaCumple.substring(1, 2);
    }
    var edad = yyyyActual - yyyyCumple;

    //validamos si el mes de cumpleaños es menor al actual
    //o si el mes de cumpleaños es igual al actual
    //y el dia actual es menor al del nacimiento
    //De ser asi, se resta un año
    if ((mmActual < mmCumple) || (mmActual == mmCumple && diaActual < diaCumple)) {
        edad--;
    }
    return edad;
}

function isDate(txtDate) {
    var currVal = txtDate;
    var fechaActual = new Date();
    var diaActual = fechaActual.getDay();
    var mmActual = fechaActual.getMonth();
    var yyyyActual = fechaActual.getFullYear();

    if (currVal == '')
        return false;

    var rxDatePattern = /^(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{4})$/; //Declare Regex
    var dtArray = currVal.match(rxDatePattern); // is format OK?

    if (dtArray == null)
        return false;

    //Checks for dd/mm/yyyy format.
    var dtDay = dtArray[1];
    var dtMonth = dtArray[3];
    var dtYear = dtArray[5];

    if (dtMonth < 1 || dtMonth > 12)
        return false;
    else if (dtDay < 1 || dtDay > 31)
        return false;
    else if ((dtMonth == 4 || dtMonth == 6 || dtMonth == 9 || dtMonth == 11) && dtDay == 31)
        return false;
    else if (dtMonth == 2) {
        var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
        if (dtDay > 29 || (dtDay == 29 && !isleap))
            return false;
    }

    else if (dtYear >= yyyyActual) {
        return false;
    }

    return true;
}

function isMayorEdad(txtDate) {
    var currVal = txtDate;
    var fechaActual = new Date();
    var diaActual = fechaActual.getDay();
    var mmActual = fechaActual.getMonth();
    var yyyyActual = fechaActual.getFullYear();

    if (currVal == '')
        return false;

    var rxDatePattern = /^(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{4})$/; //Declare Regex
    var dtArray = currVal.match(rxDatePattern); // is format OK?

    if (dtArray == null)
        return false;

    //Checks for dd/mm/yyyy format.
    var dtDay = dtArray[1];
    var dtMonth = dtArray[3];
    var dtYear = dtArray[5];

    if (dtMonth < 1 || dtMonth > 12)
        return false;
    else if (dtDay < 1 || dtDay > 31)
        return false;
    else if ((dtMonth == 4 || dtMonth == 6 || dtMonth == 9 || dtMonth == 11) && dtDay == 31)
        return false;
    else if (dtMonth == 2) {
        var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
        if (dtDay > 29 || (dtDay == 29 && !isleap))
            return false;
    }

    else if (dtYear >= yyyyActual) {
        return false;
    }

    else if (dtYear >= (yyyyActual - 16)) {
        return false;
    }

    var fechaMaxima = new Date();
    //var fechaMinima = new Date();

    fechaMaxima.setFullYear(fechaMaxima.getFullYear() - 18, fechaMaxima.getMonth(), fechaMaxima.getDate());

    //fechaMinima.setFullYear(fechaMinima.getFullYear() - 70, fechaMaxima.getMonth(), fechaMaxima.getDate());

    var fechaIngresada = new Date();
    fechaIngresada.setFullYear(dtYear, dtMonth - 1, dtDay);

    //alert(fechaIngresada.toDateString() + " - " + fechaActual.toDateString());

    if (fechaIngresada > fechaMaxima) {
        return false;
    }

    return true;
}

function isTerceraEdad(txtDate) {
    var currVal = txtDate;
    var fechaActual = new Date();
    var diaActual = fechaActual.getDay();
    var mmActual = fechaActual.getMonth();
    var yyyyActual = fechaActual.getFullYear();

    if (currVal == '')
        return false;

    var rxDatePattern = /^(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{4})$/; //Declare Regex
    var dtArray = currVal.match(rxDatePattern); // is format OK?

    if (dtArray == null)
        return false;

    //Checks for dd/mm/yyyy format.
    var dtDay = dtArray[1];
    var dtMonth = dtArray[3];
    var dtYear = dtArray[5];

    if (dtMonth < 1 || dtMonth > 12)
        return false;
    else if (dtDay < 1 || dtDay > 31)
        return false;
    else if ((dtMonth == 4 || dtMonth == 6 || dtMonth == 9 || dtMonth == 11) && dtDay == 31)
        return false;
    else if (dtMonth == 2) {
        var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
        if (dtDay > 29 || (dtDay == 29 && !isleap))
            return false;
    }

    else if (dtYear >= yyyyActual) {
        return false;
    }

    else if (dtYear >= (yyyyActual - 16)) {
        return false;
    }

    var fechaMinima = new Date();

    fechaMinima.setFullYear(fechaMinima.getFullYear() - 70, fechaMinima.getMonth(), fechaMinima.getDate());

    var fechaIngresada = new Date();
    fechaIngresada.setFullYear(dtYear, dtMonth - 1, dtDay);

    if (fechaIngresada < fechaMinima) {
        return true;
    }

    return false;
}

function isFechaFutura(txtDate, horas, minutos) {
    var currVal = txtDate;
    var fechaActual = new Date();
    var diaActual = fechaActual.getDay();
    var mmActual = fechaActual.getMonth();
    var yyyyActual = fechaActual.getFullYear();

    if (currVal == '')
        return false;

    var rxDatePattern = /^(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{4})$/; //Declare Regex
    var dtArray = currVal.match(rxDatePattern); // is format OK?

    if (dtArray == null)
        return false;

    //Checks for dd/mm/yyyy format.
    dtDay = dtArray[1];
    dtMonth = dtArray[3];
    dtYear = dtArray[5];

    if (dtMonth < 1 || dtMonth > 12)
        return false;
    else if (dtDay < 1 || dtDay > 31)
        return false;
    else if ((dtMonth == 4 || dtMonth == 6 || dtMonth == 9 || dtMonth == 11) && dtDay == 31)
        return false;
    else if (dtMonth == 2) {
        var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
        if (dtDay > 29 || (dtDay == 29 && !isleap))
            return false;
    }

    else if (dtYear < yyyyActual) {
        return false;
    }

    var fechaMinima = new Date();
    var fechaIngresada = new Date();
    fechaIngresada.setFullYear(dtYear, dtMonth - 1, dtDay);
    fechaIngresada.setHours(horas, minutos, 0, 0);

    if (fechaIngresada < fechaMinima) {
        return false;
    }

    return true;
}

function parseFecha(fechaIn) {
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

function createCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    }
    else var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}

function showMsgBoxInfo(msg, title, heightLevel) {
    showMsgBox(msg, title, "info", null, heightLevel);
}

function showMsgBoxError(msg, title, heightLevel) {
    showMsgBox(msg, title, "error", null, heightLevel);
}

function showMsgBoxAlert(msg, title, heightLevel) {
    showMsgBox(msg, title, "alert", null, heightLevel);
}

function showMsgBoxConfirm(msg, title, success, heightLevel) {
    showMsgBox(msg, title, "confirm", success, heightLevel);
}

function showMsgBox(msg, title, type, success, heightLevel) {
    if (success) {
        if (heightLevel) {
            $.msgBox({
                title: title,
                content: msg,
                type: type,
                success: success,
                buttons: [{ value: "Si" }, { value: "No" }],
                heightLevel: heightLevel
            });
        } else {
            $.msgBox({
                title: title,
                content: msg,
                type: type,
                success: success,
                buttons: [{ value: "Si" }, { value: "No" }]
            });
        }
    } else {

        if (heightLevel) {
            $.msgBox({
                title: title,
                content: msg,
                type: type,
                heightLevel: heightLevel
            });
        } else {
            $.msgBox({
                title: title,
                content: msg,
                type: type
            });
        }

        
    }
    
}
