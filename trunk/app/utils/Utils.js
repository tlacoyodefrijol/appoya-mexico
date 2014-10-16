function Utils () {

}

Utils.prototype.idsToArray = function(array,idField) {
    idField =  typeof idField === 'undefined' ? "_id":idField;

    var res = [];
    for (i= 0; i<array.length; i++)
    {
        res.push(array[i][idField]);
    }
    return(res);
}

module.exports = new Utils();
