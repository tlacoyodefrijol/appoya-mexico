var express = require('express');
var User = require('../models/User');
var UserAPI = require('./Administration/User');
var CycleAPI = require('./Administration/Cycle');
var GroupAPI = require('./Administration/Group');
var EventAPI = require('./Administration/Event');
var ResultObject = require('../utils/ResultObject');
var async = require('async');

module.exports = (function () {

    var router = express.Router();
    var ro;

    router.use(function (req, res, next) {
        next();
    });

    UserAPI.init(router);
    CycleAPI.init(router);
    GroupAPI.init(router);
    EventAPI.init(router);

    router.route('/login')
        .post(function (req, res) {
            User.findOne({username: req.body.username}, function (err, user) {
                if (err) {
                    res.send(new ResultObject(false, err, "Error al obtener el usuario.", ResultObject.prototype.BD_ERROR));
                }
                else {
                    if (user == null) {
                        res.send(new ResultObject(false, null, "No existe el usuario especificado.", ResultObject.prototype.BD_NOT_FOUND));
                    }
                    else if (user.secretword !== req.body.secretword) {
                        res.send(new ResultObject(false, null, "Los datos no coinciden", ResultObject.prototype.WRONG_PARAMS));
                    }
                    else {
                        req.session.userId = user.id;
                        req.session.userProfile = user.profile;
                        //req.session.userObject = find;
                        res.send(new ResultObject(true, user, "Datos correctos", ResultObject.prototype.ALL_OK));
                    }
                }
            })
                .populate('profile');
        });
    router.route('/logout')
        .post(function (req, res) {
            req.session.destroy();
            res.send(new ResultObject(true, null, "Sesión cerrada", ResultObject.prototype.ALL_OK));
        });

    return router;
})();