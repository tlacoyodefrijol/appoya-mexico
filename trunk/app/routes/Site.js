var express = require('express');

module.exports = (function () {

    var router = express.Router();

    router.use(function (req, res, next) {
        next();
    });
    router.route('/*')
        .get(function (req, res) {
            res.render('html', {view: 'html/home'}, function (err, html) {
                if (err) {
                    console.log('error: ', err);
                }
                else {
                    res.send(html);
                }
            });
        });

    return router;
})();
