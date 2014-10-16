/**
 * Created by Ramsés on 06/10/14.
 */
var Group = require('../../models/Group');
var Enrollment = require('../../models/Enrollment');
var Cycle = require('../../models/Cycle');
var ResultObject = require('../../utils/ResultObject');
var Utils = require('../../utils/Utils');
var async = require('async');

var api = {
    init: function (router)
    {
        router.route('/groups')
            .post(function (req, res) {
                console.log("valida");
                function cycles(cb) {
                    //console.log("cycles");
                    if (req.body.status) {
                        if (req.body.status == "active") {
                            Cycle.getActive("_id", function (err, res) {
                                if (err) {
                                    ro.code = ro.BD_ERROR;
                                    cb(err, null);
                                }
                                else {
                                    var cycles = Utils.idsToArray(res);
                                    cb(null, cycles);
                                }
                            });
                        }
                        else {
                            cb(null, null);
                        }
                    }
                    else {
                        cb(null, null);
                    }


                }

                function groups(cycles, cb) {
                    //console.log("groups", cycles, params, limit, skip);
                    var params = {};
                    if (req.body.cycle) {
                        params.cycle = req.body.cycle;
                    } else if (cycles)
                    {
                        params.cycle = {$in: cycles};
                    }
                    if (req.body.level) {
                        params.level = req.body.level;
                    }
                    var limit = !req.body.pageSize ? 100 : req.body.pageSize;
                    var skip = !req.body.pageNumber ? 0 : (req.body.pageNumber - 1) * limit;
                    var query = Group
                        .find(params)
                        .select("cycle name")
                        .limit(limit)
                        .skip(skip)
                        .populate({path: 'cycle', select: '_id name'})
                        .exec(cb);
                }

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

                async.waterfall([cycles, groups], cb);
            });
        router.route('/groups/count/active')
            .post(function (req, res) {
                function cycles(cb) {
                    //console.log("cycles");
                    Cycle.getActive("_id", function (err, res) {
                        if (err) {
                            ro.code = ro.BD_ERROR;
                            cb(err, null);
                        }
                        else {
                            var cycles = Utils.idsToArray(res);
                            cb(null, cycles);
                        }
                    });
                }

                function groups(cycles, cb) {
                    //console.log("groups", cycles, params, limit, skip);
                    var query = Group
                        .count({cycle:{$in: cycles}})
                        .exec(cb);
                }

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

                async.waterfall([cycles, groups], cb);
            });
        router.route('/group')
            .post(function (req, res) {
                ro = new ResultObject();
                Group
                    .findOne({_id: req.body.id})
                    .select({__v: false})
                    .populate({path: "cycle", select: "_id name"})
                    .exec(function (err, find) {
                        if (err) {
                            ro.success = false;
                            ro.code = ro.BD_ERROR;
                        }
                        else if (!find) {
                            ro.success = false;
                            ro.code = ro.NOT_FOUND;
                        }
                        else {
                            ro.data = find.toJSON();
                            ro.success = true;
                            ro.code = ro.ALL_OK;
                        }
                        res.json(ro);
                    });
                function checkInput(cb) {
                    var ro = new ResultObject();
                    var err = null;
                    if (!req.body.name || !req.body.level || !req.body.cycle) {
                        ro.success = false;
                        ro.info = 'Name, level and cycle are required fields';
                        ro.code = ro.BAD_REQUEST;
                        err = new Error();
                    }
                    cb(err, ro);
                }
            });
        router.route('/group/add')
            .post(function (req, res) {
                function checkInput(cb) {
                    var ro = new ResultObject();
                    var err = null;
                    if (!req.body.name  || !req.body.cycle) {
                        ro.success = false;
                        ro.info = 'Name, (level) and cycle are required fields';
                        ro.code = ro.BAD_REQUEST;
                        err = new Error();
                    }
                    cb(err, ro);
                }

                function findDuplicate(ro, cb) {
                    Group
                        .findOne({
                            name: req.body.name,
                            //level: req.body.level,
                            cycle: req.body.cycle
                        })
                        .select("_id")
                        .exec(function (err, result) {
                            if (!err && result) {
                                err = new Error();
                                ro.success = false;
                                ro.info = "Duplicate found (" + result._id + ")"
                                ro.code = ro.DUPLICATE;
                            }
                            else if (err) {
                                ro.info = err;
                                ro.code = ro.BD_ERROR;
                            }
                            cb(err, ro);
                        });
                }

                function addGroup(ro, cb) {
                    var group = new Group();
                    group.name = req.body.name;
                    //group.level = req.body.level;
                    group.cycle = req.body.cycle;
                    group.save(function (err, result) {
                        if (!err) {
                            ro.success = true;
                            ro.info = "Group added"
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

                async.waterfall([checkInput, findDuplicate, addGroup], cb);
            });
        router.route('/group/update')
            .post(function (req, res) {
                function checkInput(cb) {
                    var ro = new ResultObject();
                    var err = null;
                    if (!req.body.id || !req.body.name || !req.body.cycle) {
                        ro.success = false;
                        ro.info = 'Id, name, (level) and cycle are required fields';
                        ro.code = ro.BAD_REQUEST;
                        err = new Error();
                    }
                    cb(err, ro);
                }

                function findDuplicate(ro, cb) {
                    Group
                        .findOne({
                            _id: {$ne: req.body.id},
                            name: req.body.name,
                            level: req.body.level,
                            cycle: req.body.cycle
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

                function updateGroup(ro, cb) {
                    var condition = {_id: req.body.id},
                        update = {
                            name: req.body.name,
                            //level: req.body.level,
                            cycle: req.body.cycle
                        },
                        options = {multi: false}
                    Group.update(condition, update, options, function (err, affected) {
                        if (!err) {
                            if (affected > 0) {
                                ro.success = true;
                                ro.info = "Group updated"
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

                async.waterfall([checkInput, findDuplicate, updateGroup], cb);
            });
        router.route('/group/delete')
            .post(function (req, res) {
                function checkInput(cb) {
                    var ro = new ResultObject();
                    var err = null;
                    if (!req.body.id) {
                        ro.success = false;
                        ro.info = 'Id, name, level and cycle are required fields';
                        ro.code = ro.BAD_REQUEST;
                        err = new Error();
                    }
                    cb(err, ro);
                }

                function deleteGroup(ro, cb) {
                    var condition = {_id: req.body.id};
                    Group.remove(condition, function (err, affected) {
                        if (!err) {
                            if (affected > 0) {
                                ro.success = true;
                                ro.info = "Group deleted"
                                ro.data = affected;
                            }
                            else {
                                err = new Error();
                                ro.success = false;
                                ro.info = "No group deleted"
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

                async.waterfall([checkInput, deleteGroup], cb);
            });
        router.route("/group/enroll")
            .post(function (req, res) {
                function checkInput(cb) {
                    var ro = new ResultObject();
                    var err = null;
                    if (!req.body.user || !req.body.group || !req.body.role) {
                        ro.success = false;
                        ro.info = 'User, group and role are required fields';
                        ro.code = ro.BAD_REQUEST;
                        err = new Error();
                    }
                    cb(err, ro);
                }

                function findDuplicate(ro, cb) {
                    Enrollment
                        .findOne({
                            user: req.body.user,
                            group: req.body.group,
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
                    enrollment.group = req.body.group;
                    enrollment.role = req.body.role;
                    enrollment.date = new Date();
                    enrollment.save(function (err, result) {
                        if (!err) {
                            ro.success = true;
                            ro.info = "Enrollment added"
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

                async.waterfall([checkInput, findDuplicate, addEnrollment], cb);
            });
        router.route("/group/withdraw")
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
                    Enrollment.remove({_id: req.body.id},function (err, result) {
                        if (!err) {
                            ro.success = true;
                            ro.info = "Enrollment removed"
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
        router.route("/group/enrollments")
            .post(function (req, res) {
                function checkInput(cb) {
                    var ro = new ResultObject();
                    var err = null;
                    if (!req.body.group) {
                        ro.success = false;
                        ro.info = 'Group is a required field';
                        ro.code = ro.BAD_REQUEST;
                        err = new Error();
                    }
                    cb(err, ro);
                }

                function findEnrollments(ro, cb) {
                    var params = {};
                    params.group = req.body.group;
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
}
module.exports = api;