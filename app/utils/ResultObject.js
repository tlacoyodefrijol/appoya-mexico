function ResultObject (success, data, info, code) {
    this.success = success; //El llamado fue exito o no. true | false
    this.data = data; //La información resultante del llamado. Array, objeto, string.
    this.info = info; //Información extra no necesaria, por ejemplo, número de renglones, número de página.
    this.code = code; //Código numérico para revisiones más rápidas.
}

ResultObject.prototype.setValues = function (success, data, info, code)
{
    this.success = success;
    this.data = data;
    this.info = info;
    this.code = code;
};

ResultObject.prototype.ALL_OK = 201;
ResultObject.prototype.NO_CONTENT = 204;
ResultObject.prototype.NOT_FOUND = 404;
ResultObject.prototype.BAD_REQUEST = 400;
ResultObject.prototype.ERROR = 500;

/*****A partir de los 6xx son errores de base de datos********/
ResultObject.prototype.BD_ERROR = 600;
ResultObject.prototype.BD_NOT_FOUND = 604;
ResultObject.prototype.BD_DUPLICATE = 605;

/****A partir de los 7xx son errores devueltos por la API, significa que todo salio bien
 * pero la operacion no salio como se esperaba
 */
ResultObject.prototype.DUPLICATE = 700;
ResultObject.prototype.WRONG_PARAMS = 701;


module.exports = ResultObject;
