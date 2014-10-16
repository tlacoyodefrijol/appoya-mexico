/**
 * Created by Robert on 06/10/14.
 */
var User = require('../../models/User');
var Cycle = require('../../models/Cycle');
var Group = require('../../models/Group');
var Enrollment = require('../../models/Enrollment');
var ResultObject = require('../../utils/ResultObject');
var Utils = require('../../utils/Utils');
var async = require('async');

var api =
{
    init:function(router)
    {
        /*********************************************************************
         *                          USUARIO
         *********************************************************************/
        router.route('/user')
            .post(function (req, res) {
                if(typeof req.body.id === 'undefined')
                {
                    res.send(new ResultObject(false,null,"Es necesario un id para la busqueda"
                        ,ResultObject.prototype.BAD_REQUEST));
                }
                else
                {
                    //Obtenemos el usuario
                    User.findOne({_id:req.body.id},{secretword:0},function(err,user)
                    {
                        if(err)
                        {
                            res.send(new ResultObject(false,err,"Error al obtener el usuario."
                                ,ResultObject.prototype.BD_ERROR));
                        }
                        else if(user == null)
                        {
                            res.send(new ResultObject(false,null,"No existe el usuario especificado."
                                ,ResultObject.prototype.BD_NOT_FOUND));
                        }
                        else
                        {
                            res.send(new ResultObject(true,user,"Usuario encontrado con exito."
                                ,ResultObject.prototype.ALL_OK));
                        }
                    });
                }
            });
        router.route('/user/add')
            .post(function(req,res)
            {
                if(typeof req.body.username === 'undefined')
                {
                    res.send(new ResultObject(false,null,"Es necesario un nombre de usuario."
                        ,ResultObject.prototype.BAD_REQUEST));
                }
                else
                {
                    //Existe algun otro con el mismo nombre de usuario
                    User.findOne({username:req.body.username},{name:1},function(err,user)
                    {
                        if(err)
                        {
                            res.send(new ResultObject(false,err,"Error al comprobar si username es único."
                                ,ResultObject.prototype.BD_ERROR));
                        }
                        else if(user != null)
                        {
                            res.send(new ResultObject(false,null,"Ya existe el usuario: "+req.body.username+" ."
                                ,ResultObject.prototype.DUPLICATE));
                        }
                        else
                        {
                            var user = new User(req.body);
                            user.save(function(err)
                            {
                                if(err)
                                {
                                    if(err.name == 'ValidationError')
                                    {
                                        //faltan campos requeridos
                                        res.send(new ResultObject(false,err,"Faltan campos requeridos para crear al usuario."
                                            ,ResultObject.prototype.BAD_REQUEST));
                                    }
                                    else
                                    {
                                        res.send(new ResultObject(false,err,'Error al crear el usuario'
                                            ,ResultObject.prototype.BD_ERROR));
                                    }

                                    return;
                                }

                                res.send(new ResultObject(true,user,"Usuario agregado con exito"
                                    ,ResultObject.prototype.ALL_OK));
                            });
                        }
                    });
                }
            });
        router.route('/user/update')
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
                    User.update({_id:req.body.id},req.body,function(err,affected)
                    {
                        if(err)
                        {
                            res.send(new ResultObject(false,err,"Error al actualizar el usuario."
                                ,ResultObject.prototype.BD_ERROR));
                        }
                        else if(affected == 0)
                        {
                            res.send(new ResultObject(false,req.body,"No se encontro el usuario especificado."
                                ,ResultObject.prototype.BD_NOT_FOUND));
                        }
                        else
                        {
                            res.send(new ResultObject(true,req.body,"Usuario actualizado con exito."
                                ,ResultObject.prototype.ALL_OK));
                        }
                    });
                }
            });
        router.route('/user/delete')
            .post(function(req,res)
            {
                if(typeof req.body.id === 'undefined')
                {
                    res.send(new ResultObject(false,null,"Es necesario un id para eliminar al usuario."
                        ,ResultObject.prototype.BAD_REQUEST));
                }
                else
                {
                    //Eliminamos el usuario
                    User.remove({_id:req.body.id},function(err,affected)
                    {
                        if(err)
                        {
                            res.send(new ResultObject(false,err,"Error al eliminar el usuario."
                                ,ResultObject.prototype.BD_ERROR));
                        }
                        else if(affected == 0)
                        {
                            res.send(new ResultObject(false,req.body,"No se encontro el usuario especificado."
                                ,ResultObject.prototype.BD_NOT_FOUND));
                        }
                        else
                        {
                            res.send(new ResultObject(true,null,"Usuario eliminado con exito."
                                ,ResultObject.prototype.ALL_OK));
                        }
                    });
                }
            });
        /*********************************************************************
         *
         *********************************************************************/

        /*********************************************************************
         *                          USUARIOS
         *********************************************************************/
        router.route('/users')
            .post(function (req, res) {
                var limit = !req.body.pageSize   ? 100 : req.body.pageSize;
                var skip  = !req.body.pageNumber ?   0 : (req.body.pageNumber - 1) * limit;
                var options = !req.body.fields ? {secretword:0} : req.body.fields;
                var params;
                var sort = {};

                if(req.body.search && req.body.search != "")
                {
                    if(req.body.strictSearch)
                    {
                        req.body.search = '\"'+req.body.search+'\"';
                    }

                    params = {
                        profile: req.body.profile,
                        $text: {$search: req.body.search, $language: "es"}
                    };

                    options.score = {$meta:"textScore"};

                    sort = { score: { $meta: "textScore" } };
                }
                else
                {
                    params = {profile:req.body.profile};
                }

                if(typeof req.body.profile === 'undefined' || typeof req.body.status === 'undefined')
                {
                    res.send(new ResultObject(false,null,"Es necesario un profile y un status para la busqueda."
                        ,ResultObject.prototype.BAD_REQUEST));

                    return;
                }

                function finalCallback(err,result)
                {
                    if(err)
                    {
                        res.send(new ResultObject(false,err,"Ocurrio un error al obtener los usuarios."
                            ,ResultObject.prototype.BD_ERROR));}
                    else
                    {
                        res.send(new ResultObject(true,result,"usuarios obtenidos con exito", ResultObject.prototype.ALL_OK));
                    }
                }

                function getActiveUsers(err,ids)
                {
                    params._id = {$in:ids};

                    User.find(params
                        ,options)
                        .limit(limit)
                        .skip(skip)
                        .sort(sort)
                        .exec(finalCallback.bind(this));

                }

                function getInactiveUsers(err,ids)
                {
                    params._id = {$nin:ids};
                    User.find(params
                        ,options)
                        .limit(limit)
                        .skip(skip)
                        .sort(sort)
                        .exec(finalCallback);

                }

                var enroll;

                switch(req.body.status)
                {
                    case "active":
                        enroll = Object.create(getEnrollments);
                        enroll.getActives(getActiveUsers.bind(this));
                        break;
                    case "inactive":
                        enroll = Object.create(getEnrollments);
                        enroll.getActives(getInactiveUsers.bind(this));
                        break;
                    case "all":
                        User.find(params
                            ,options)
                            .limit(limit)
                            .skip(skip)
                            .sort(sort)
                            .exec(finalCallback.bind(this));
                        break;
                    default:
                        res.send(new ResultObject(false,null,"No se reconoce el status recibido."
                            ,ResultObject.prototype.BAD_REQUEST));
                        break;
                }
            });

        router.route('/users/count/active')
            .post(function (req, res) {
                if(typeof req.body.profile === 'undefined')
                {
                    res.send(new ResultObject(false,null,"Es necesario un profile."
                        ,ResultObject.prototype.BAD_REQUEST));
                }
                else if(req.body.profile != "student" && req.body.profile != "teacher")
                {
                    res.send(new ResultObject(false,null,"student y teacher son los unicos profiles aceptados."
                        ,ResultObject.prototype.BAD_REQUEST));
                }
                else
                {

                    function finalCallback(err,result)
                    {
                        if(err)
                        {
                            res.send(new ResultObject(false,err,"Ocurrio un error al obtener el conteo."
                                ,ResultObject.prototype.BD_ERROR));
                        }
                        else
                        {
                            res.send(new ResultObject(true,result,"Conteo exitoso.",
                                ResultObject.prototype.ALL_OK));
                        }
                    }

                   function countUsers(err,ids)
                    {
                        User.count(
                            {profile: req.body.profile,
                              _id:{$in:ids}
                            }).exec(finalCallback);

                    }

                    var enroll = Object.create(getEnrollments);
                    enroll.getActives(countUsers);
                }
            });
        /*********************************************************************
         *
         *********************************************************************/
    }
};

var getEnrollments =
{
    getActives:function(cb)
    {
        //Ciclos activos
        function cycles(cb) {

            Cycle.getActive("_id", function (err, res) {
                if (err) {
                    //Callback con error para async
                    cb(err, null);
                }
                else
                {
                    //Un arreglo de ids y no de objetos
                    var cycles = Utils.idsToArray(res);

                    //callback con los ciclos para async
                    cb(null, cycles);
                }
            });
        }

        //Encontramos los grupos con los ciclos activos
        function groups(cycles, cb) {
            Group.find({cycle:{$in:cycles}},{_id:1})
                .exec(function(err,result)
                {
                    if(err)
                    {
                        //Callback con error para async
                        cb(err,null);
                    }
                    else
                    {
                        cb(null,Utils.idsToArray(result));
                    }
                });
        }

        //Enrollments activos
        function enrollments(groups,cb)
        {
            Enrollment.find({group:{$in:groups}},{user:1})
                .exec(function(err,result)
                {
                    if(err)
                    {
                        //Callback con error para async
                        cb(err,null);
                    }
                    else
                    {
                        cb(null,Utils.idsToArray(result,"user"));
                    }
                });

        }

        async.waterfall([cycles,groups,enrollments],cb);
    }
};

module.exports = api;