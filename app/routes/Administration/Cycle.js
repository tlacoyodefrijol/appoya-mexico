/**
 * Created by Robert on 06/10/14.
 */
var Cycle = require('../../models/Cycle');
var ResultObject = require('../../utils/ResultObject');

var api = {
    init:function(router)
    {
        /*********************************************************************
         *                          CICLO
         *********************************************************************/
        router.route('/cycle')
            .post(function (req, res) {
                if(typeof req.body.id === 'undefined')
                {
                    res.send(new ResultObject(false,null,"Es necesario un id para la busqueda"
                        ,ResultObject.prototype.BAD_REQUEST));
                }
                else
                {
                    //Obtenemos el ciclo
                    Cycle.findOne({_id:req.body.id},function(err,cycle)
                    {
                        if(err)
                        {
                            res.send(new ResultObject(false,err,"Error al obtener el ciclo."
                                ,ResultObject.prototype.BD_ERROR));
                        }
                        else if(cycle == null)
                        {
                            res.send(new ResultObject(false,null,"No existe el ciclo especificado."
                                ,ResultObject.prototype.BD_NOT_FOUND));
                        }
                        else
                        {
                            res.send(new ResultObject(true,cycle,"Ciclo encontrado con exito."
                                ,ResultObject.prototype.ALL_OK));
                        }
                    });
                }
            });
        router.route('/cycle/add')
            .post(function(req,res)
            {
                if(typeof req.body.name === 'undefined')
                {
                    res.send(new ResultObject(false,null,"Es necesario un nombre de ciclo."
                        ,ResultObject.prototype.BAD_REQUEST));
                }
                else {
                    //Existe algun otro con el mismo nombre de usuario
                    Cycle.findOne({name: req.body.name}, {name: 1}, function (err, cycle) {
                        if (err) {
                            res.send(new ResultObject(false, err, "Error al comprobar si el nombre es único.", ResultObject.prototype.BD_ERROR));
                        }
                        else if (cycle != null) {
                            res.send(new ResultObject(false, null, "Ya existe el ciclo: " + req.body.name + " .", ResultObject.prototype.DUPLICATE));
                        }
                        else {
                            var ncycle = new Cycle(req.body);
                            ncycle.save(function (err) {
                                if (err) {
                                    if (err.name == 'ValidationError') {
                                        //faltan campos requeridos
                                        res.send(new ResultObject(false, err, "Faltan campos requeridos para crear al ciclo.", ResultObject.prototype.BAD_REQUEST));
                                    }
                                    else {
                                        res.send(new ResultObject(false, err, 'Error al crear el ciclo', ResultObject.prototype.BD_ERROR));
                                    }

                                    return;
                                }

                                res.send(new ResultObject(true, ncycle, "Ciclo agregado con exito", ResultObject.prototype.ALL_OK));
                            });
                        }
                    });
                }

            });
        router.route('/cycle/update')
            .post(function(req,res)
            {
                if(typeof req.body.id === 'undefined')
                {
                    res.send(new ResultObject(false,null,"Es necesario un id para la actualizacion"
                        ,ResultObject.prototype.BAD_REQUEST));
                }
                else
                {
                    //Obtenemos el usuario
                    Cycle.update({_id:req.body.id},req.body,function(err,affected)
                    {
                        if(err)
                        {
                            res.send(new ResultObject(false,err,"Error al actualizar el ciclo."
                                ,ResultObject.prototype.BD_ERROR));
                        }
                        else if(affected == 0)
                        {
                            res.send(new ResultObject(false,req.body,"No se encontro el ciclo especificado."
                                ,ResultObject.prototype.BD_NOT_FOUND));
                        }
                        else
                        {
                            res.send(new ResultObject(true,req.body,"Ciclo actualizado con exito."
                                ,ResultObject.prototype.ALL_OK));
                        }
                    });
                }
            });
        router.route('/cycle/delete')
            .post(function(req,res)
            {
                if(typeof req.body.id === 'undefined')
                {
                    res.send(new ResultObject(false,null,"Es necesario un id para eliminar al ciclo."
                        ,ResultObject.prototype.BAD_REQUEST));
                }
                else
                {
                    //Eliminamos el usuario
                    Cycle.remove({_id:req.body.id},function(err,affected)
                    {
                        if(err)
                        {
                            res.send(new ResultObject(false,err,"Error al eliminar el ciclo."
                                ,ResultObject.prototype.BD_ERROR));
                        }
                        else if(affected == 0)
                        {
                            res.send(new ResultObject(false,req.body,"No se encontro el ciclo especificado."
                                ,ResultObject.prototype.BD_NOT_FOUND));
                        }
                        else
                        {
                            res.send(new ResultObject(true,null,"Ciclo eliminado con exito."
                                ,ResultObject.prototype.ALL_OK));
                        }
                    });
                }
            });
        /*********************************************************************
         *
         *********************************************************************/

        /*********************************************************************
         *                          CICLOS
         *********************************************************************/
        router.route('/cycles')
            .post(function (req, res) {
                var limit = !req.body.pageSize   ? 100 : req.body.pageSize;
                var skip  = !req.body.pageNumber ?   0 : (req.body.pageNumber - 1) * limit;

                if(typeof req.body.status === 'undefined')
                {
                    req.body.status = "active";
                }
                var sort;
                console.log(req.body.sort);
                if(req.body.sort && req.body.sort == "asc" )
                {
                   sort = {beginning: 1};
                }
                else
                {
                    sort = {beginning: -1}
                }
                var query;
                var date = new Date();
                switch(req.body.status)
                {
                    case 'active':
                        query = Cycle.find({$and:[
                            {$or:[
                                {'beginning':{$lte:date}},
                                {'beginning':null}
                            ]},
                            {$or:[   {'end':{$gte:date}},
                                {'end':null}
                            ]}
                        ]});

                        break;
                    case 'inactive':
                        query = Cycle.find
                        (
                            {
                                end: {$lt: date}
                            }
                        );
                        break;
                    case 'available':
                        query = Cycle.find({
                            $or:[
                                    {'end':{$gte:date}},
                                    {'end':null}
                                ]
                        });
                        break;
                    default:
                        query = Cycle.find();
                        break;
                }
                query.limit(limit);
                query.skip(skip);
                query.sort(sort);
                query.exec(function(err,result)
                {
                    if(err)
                    {
                        res.send(new ResultObject(false,err,"Error al obtener los ciclos."
                            ,ResultObject.prototype.BD_ERROR));
                        return;
                    }

                    res.send(new ResultObject(true,result,"Ciclos encontrados con exito"
                        ,ResultObject.prototype.ALL_OK));
                });
            });
        /*********************************************************************
         *
         *********************************************************************/
    }
};

module.exports = api;
