var express = require('express');
var root = './public';
var User = require('../models/User');

module.exports = (function () {

    var router = express.Router();

    router.route('/*')
        .all(function (req, res, next) {
            console.log('')
            if (req.session.userId === undefined && req.url !== '/') {
                res.redirect('/');
            }
            else if (req.session.userId !== undefined && req.url === '/') {
                res.redirect('/dashboard');
            }
            else {
                //res.sendFile('index.html', {'root': root});
                res.sendFile('index.html', {'root': root});
            }
        });
    return router;
})();