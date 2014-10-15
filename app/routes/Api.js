var express = require('express');
var async = require('async');
module.exports = (function () {

    var router = express.Router();

    router.use(function (req, res, next) {
        next();
    });

    router.route('/')
        .get(function (req, res) {
            //
        });

    return router;
})();