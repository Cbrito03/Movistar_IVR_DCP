function validateRut(stringRut) {
    var rut = stringRut.split("");
    if (rut.length != 9 && rut.length != 8) {
        return "El rut debe tener tener 8 o 9 caracteres";
    }    
    var rutAsNumber = parseInt(stringRut.substring(0, rut.length - 1));
    if (rutAsNumber == NaN) {
        return "Los primeros" + rut.length - 1 + "caracteres del rut deben ser dígitos";
    }
    var verificador = calculateVerificador(rutAsNumber.toString().split(""));
    var lastChar = rut[rut.length - 1];
    if (verificador >= 10) {
        if ((verificador == 11 && lastChar != 0) ||
            (verificador == 10 && lastChar.toUpperCase() != 'K')) {
            return "El rut no es válido";
        }
    }
    else {
        var lastDigit = parseInt(lastChar.toString());
        if (verificador != lastDigit) {
            return "El rut no es válido";
        }
    }
    return null;
}

function calculateVerificador(rutfirstDigits) {
    var digitReverseOrder = rutfirstDigits.reverse();
    var multiplicadores = [2, 3, 4, 5, 6, 7];
    var result = 0;
    var i = 0;
    for (var j = 0; j < digitReverseOrder.length; j++) {
        var dig = parseInt(digitReverseOrder[j]);
        result += dig * multiplicadores[i];
        i = (i + 1) % 6;
    }
    return (11 - result % 11);
}