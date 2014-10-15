var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var express = require('express');
var path = require('path');

var appoya = express();
var port = process.env.PORT || 8080;

appoya.use(bodyParser.json());
appoya.use(bodyParser.urlencoded({extended: true}));
appoya.use(cookieParser());
appoya.use(session({
    secret: '<lernittoken>',
    saveUninitialized: false,
    resave: true
}));

var routerApi   = require('./app/routes/Api');

appoya.use('/api', routerApi);
appoya.use(express.static(__dirname + '/public'));


appoya.listen(port);