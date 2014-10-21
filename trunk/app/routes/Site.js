var express = require('express');
var root = './public';
var User = require('../models/User');

module.exports = (function () {

    var router = express.Router();

    router.route('/*')
        .all(function (req, res, next) {
            //console.log('.all')
            /*if (req.session.userId === undefined && req.url !== '/') {
                //console.log('if ',req.session.userId, req.url)
                res.redirect('/');
            }
            else if (req.session.userId !== undefined && req.url === '/') {
                //console.log('else if ',req.session.userId, req.url)
                res.redirect('/tablero');
            }
            else {
                //console.log('else ',req.session.userId, req.url)
                //res.sendFile('index.html', {'root': root});
                res.sendFile('index.html', {'root': root});
            }*/
            res.sendFile('index.html', {'root': root});
        });
    return router;
})();