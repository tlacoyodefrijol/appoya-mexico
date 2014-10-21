/**
 * Created by Robert on 16/10/14.
 */
var Event = require('../../models/Event');
var Enrollment = require('../../models/Enrollment');
var ResultObject = require('../../utils/ResultObject');
var async = require('async');

var api = {
    init: function (router) {
        router.route('/events')
            .post(function (req, res) {
                if (typeof req.body.status == 'undefined') {
                    res.send(new ResultObject(false, null, "Es necesario un status para la busqueda"
                        , ResultObject.prototype.BAD_REQUEST));
                    return;
                }

                var limit = !req.body.pageSize ? 100 : req.body.pageSize;
                var skip = !req.body.pageNumber ? 0 : (req.body.pageNumber - 1) * limit;

                var queryparams;
                var query;
                var date = new Date();

                switch (req.body.status) {
                    case 'active':
                        queryparams = {
                            $and: [
                                {
                                    $or: [
                                        {'beginning': {$lte: date}},
                                        {'beginning': null}
                                    ]
                                },
                                {
                                    $or: [{'end': {$gte: date}},
                                        {'end': null}
                                    ]
                                }
                            ]
                        };
                        break;
                    case 'inactive':
                        queryparams = {
                            $and: [
                                {
                                    $nor: [
                                        {'beginning': {$lte: date}},
                                        {'beginning': null}
                                    ]
                                },
                                {
                                    $nor: [{'end': {$gte: date}},
                                        {'end': null}
                                    ]
                                }
                            ]
                        };
                        break;
                    case 'available':
                        query = {
                            $or: [
                                {'end': {$gte: date}},
                                {'end': null}
                            ]
                        };
                        break;
                    case 'all':
                        queryparams = {};
                        break;
                }

                query = Event.find(queryparams);
                query.limit(limit);
                query.skip(skip);
                query.exec(function (err, result) {
                    if (err) {
                        res.send(new ResultObject(false, err, "Error buscando los eventos."
                            , ResultObject.prototype.BD_ERROR));
                    }
                    else {
                        res.send(new ResultObject(true, result, "Eventos encontrados con exito."
                            , ResultObject.prototype.ALL_OK));
                    }
                });
            });
        router.route('/events/count/active')
            .post(function (req, res) {

                function cb(err, result) {
                    var ro = new ResultObject();
                    if (err) {
                        ro.success = false;
                        ro.code = ro.BD_ERROR;
                    }
                    else {
                        ro.data = result;
                        ro.success = true;
                        ro.code = ro.ALL_OK;
                    }
                    res.json(ro);
                }

                var date = new Date();
                Event.count({
                    $and: [
                        {
                            $or: [
                                {'beginning': {$lte: date}},
                                {'beginning': null}
                            ]
                        },
                        {
                            $or: [{'end': {$gte: date}},
                                {'end': null}
                            ]
                        }
                    ]
                }).exec(cb);

            });
        router.route('/event')
            .post(function (req, res) {

                if (typeof req.body.id === 'undefined') {
                    res.send(new ResultObject(false, null, "Es necesario un id para la busqueda"
                        , ResultObject.prototype.BAD_REQUEST));

                    return;
                }

                Event
                    .findOne({_id: req.body.id})
                    .exec(function (err, find) {
                        if (err) {
                            rres.send(new ResultObject(false, err, "Ocurrio un error durante la busqueda."
                                , ResultObject.prototype.BAD_REQUEST));
                        }
                        else if (!find) {
                            res.send(new ResultObject(false, null, "No se enconro el evento epecificado."
                                , ResultObject.prototype.BD_NOT_FOUND));
                        }
                        else {
                            res.send(new ResultObject(true, find, "Evento encontrado con exito."
                                , ResultObject.prototype.ALL_OK));
                        }
                    });
            });
        router.route('/event/add')
            .post(function (req, res) {
                function checkInput(cb) {
                    var ro = new ResultObject();
                    var err = null;
                    if (!req.body.name) {
                        ro.success = false;
                        ro.info = 'Name is a required field';
                        ro.code = ro.BAD_REQUEST;
                        err = new Error();
                    }
                    cb(err, ro);
                }

                function findDuplicate(ro, cb) {
                    Event
                        .findOne({
                            name: req.body.name
                        })
                        .select("_id")
                        .exec(function (err, result) {
                            if (!err && result) {
                                err = new Error();
                                ro.success = false;
                                ro.info = "Duplicate found (" + result._id + ")"
                                ro.code = ro.BD_DUPLICATE;
                            }
                            else if (err) {
                                ro.info = err;
                                ro.code = ro.BD_ERROR;
                            }
                            cb(err, ro);
                        });
                }

                function addEvent(ro, cb) {
                    var event = new Event(req.body);
                    event.save(function (err, result) {
                        if (!err) {
                            ro.success = true;
                            ro.info = "Event added"
                            ro.data = result;
                        }
                        else {
                            ro.code = ro.BD_ERROR;
                        }
                        cb(err, ro);
                    });
                }

                function cb(err, ro) {
                    if (!err) {
                        ro.success = true;
                        ro.code = ro.ALL_OK;
                    }
                    else {
                        ro.success = false;
                    }
                    res.json(ro);
                }

                async.waterfall([checkInput, findDuplicate, addEvent], cb);
            });
        router.route('/event/update')
            .post(function (req, res) {
                function checkInput(cb) {
                    var ro = new ResultObject();
                    var err = null;
                    if (!req.body.id || !req.body.name) {
                        ro.success = false;
                        ro.info = 'Id and name are required fields';
                        ro.code = ro.BAD_REQUEST;
                        err = new Error();
                    }
                    cb(err, ro);
                }

                function findDuplicate(ro, cb) {
                    Event
                        .findOne({
                            _id: {$ne: req.body.id},
                            name: req.body.name
                        })
                        .select("_id")
                        .exec(function (err, result) {
                            if (!err && result) {
                                err = new Error();
                                ro.success = false;
                                ro.info = "Duplicate found (" + result._id + ")"
                                ro.code = ro.BD_DUPLICATE;
                            }
                            else if (err) {
                                ro.info = err;
                                ro.code = ro.BD_ERROR;
                            }
                            cb(err, ro);
                        });
                }

                function updateEvent(ro, cb) {
                    var condition = {_id: req.body.id},
                        update = req.body;
                    options = {multi: false}
                    Event.update(condition, update, options, function (err, affected) {
                        if (!err) {
                            if (affected > 0) {
                                ro.success = true;
                                ro.info = "Event updated"
                                ro.data = affected;
                            }
                            else {
                                err = new Error();
                                ro.success = false;
                                ro.info = "Nothing updated"
                                ro.code = ro.BD_NOT_FOUND;
                            }
                        }
                        else {
                            ro.code = ro.BD_ERROR;
                        }
                        cb(err, ro);
                    });
                }

                function cb(err, ro) {
                    if (!err) {
                        ro.success = true;
                        ro.code = ro.ALL_OK;
                    }
                    else {
                        ro.success = false;
                    }
                    res.json(ro);
                }

                async.waterfall([checkInput, findDuplicate, updateEvent], cb);
            });
        router.route('/event/delete')
            .post(function (req, res) {
                function checkInput(cb) {
                    var ro = new ResultObject();
                    var err = null;
                    if (!req.body.id) {
                        ro.success = false;
                        ro.info = 'Id is a required fields';
                        ro.code = ro.BAD_REQUEST;
                        err = new Error();
                    }
                    cb(err, ro);
                }

                function deleteEvent(ro, cb) {
                    var condition = {_id: req.body.id};
                    Event.remove(condition, function (err, affected) {
                        if (!err) {
                            if (affected > 0) {
                                ro.success = true;
                                ro.info = "Event deleted";
                                ro.data = affected;
                            }
                            else {
                                err = new Error();
                                ro.success = false;
                                ro.info = "No event deleted";
                                ro.code = ro.BD_NOT_FOUND;
                            }
                        }
                        else {
                            ro.code = ro.BD_ERROR;
                        }
                        cb(err, ro);
                    });
                }

                function cb(err, ro) {
                    if (!err) {
                        ro.success = true;
                        ro.code = ro.ALL_OK;
                    }
                    else {
                        ro.success = false;
                    }
                    res.json(ro);
                }

                async.waterfall([checkInput, deleteEvent], cb);
            });
        router.route("/event/enroll")
            .post(function (req, res) {
                function checkInput(cb) {
                    var ro = new ResultObject();
                    var err = null;
                    if (!req.body.user || !req.body.event || !req.body.role) {
                        ro.success = false;
                        ro.info = 'User, event and role are required fields';
                        ro.code = ro.BAD_REQUEST;
                        err = new Error();
                    }
                    cb(err, ro);
                }

                function findDuplicate(ro, cb) {
                    Enrollment
                        .findOne({
                            user: req.body.user,
                            event: req.body.event,
                            role: req.body.role
                        })
                        .select("_id")
                        .exec(function (err, result) {
                            if (!err && result) {
                                err = new Error();
                                ro.success = false;
                                ro.info = "Enrollment already exists (" + result._id + ")"
                                ro.code = ro.DUPLICATE;
                            }
                            else if (err) {
                                ro.info = err;
                                ro.code = ro.BD_ERROR;
                            }
                            cb(err, ro);
                        });
                }

                function addEnrollment(ro, cb) {
                    var enrollment = new Enrollment();
                    enrollment.user = req.body.user;
                    enrollment.event = req.body.event;
                    enrollment.role = req.body.role;
                    enrollment.date = new Date();
                    enrollment.save(function (err, result) {
                        if (!err) {
                            ro.success = true;
                            ro.info = "Enrollment added"
                            ro.data = result.id;
                        }
                        else {
                            ro.info = err.message;
                            ro.code = ro.BD_ERROR;
                        }
                        cb(err, ro);
                    });
                }

                function cb(err, ro) {
                    if (!err) {
                        ro.success = true;
                        ro.code = ro.ALL_OK;
                    }
                    else {
                        ro.success = false;
                    }
                    res.json(ro);
                }

                async.waterfall([checkInput, findDuplicate, addEnrollment], cb);
            });
        router.route("/event/withdraw")
            .post(function (req, res) {
                function checkInput(cb) {
                    var ro = new ResultObject();
                    var err = null;
                    if (!req.body.id) {
                        ro.success = false;
                        ro.info = 'ID enroll is a required fields';
                        ro.code = ro.BAD_REQUEST;
                        err = new Error();
                    }
                    cb(err, ro);
                }

                function deleteEnrollment(ro, cb) {
                    Enrollment.remove({_id: req.body.id}, function (err, result) {
                        if (!err) {
                            ro.success = true;
                            ro.info = "Enrollment removed";
                            ro.data = result.id;
                        }
                        else {
                            ro.code = ro.BD_ERROR;
                        }
                        cb(err, ro);
                    });
                }

                function cb(err, ro) {
                    if (!err) {
                        ro.success = true;
                        ro.code = ro.ALL_OK;
                    }
                    else {
                        ro.success = false;
                    }
                    res.json(ro);
                }

                async.waterfall([checkInput, deleteEnrollment], cb);
            });
        router.route("/event/enrollments")
            .post(function (req, res) {
                function checkInput(cb) {
                    var ro = new ResultObject();
                    var err = null;
                    if (!req.body.event) {
                        ro.success = false;
                        ro.info = 'Event is a required field';
                        ro.code = ro.BAD_REQUEST;
                        err = new Error();
                    }
                    cb(err, ro);
                }

                function findEnrollments(ro, cb) {
                    var params = {};
                    params.event = req.body.event;
                    if (req.body.role) {
                        params.role = req.body.role;
                    }
                    var limit = !req.body.pageSize ? 100 : req.body.pageSize;
                    var skip = !req.body.pageNumber ? 0 : (req.body.pageNumber - 1) * limit;
                    var query = Enrollment
                        .find(params)
                        .select("_id date role user")
                        .limit(limit)
                        .skip(skip)
                        .populate({path: 'user', select: 'name lastname profile serial'});
                    query.exec(cb);
                }

                function cb(err, ro) {
                    if (!err) {
                        ro.success = true;
                        ro.code = ro.ALL_OK;
                    }
                    else {
                        ro.success = false;
                    }
                    res.json(ro);
                }

                async.waterfall([checkInput, findEnrollments], cb);
            });
    }
};
module.exports = api;