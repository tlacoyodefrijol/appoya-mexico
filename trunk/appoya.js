var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var db = require('./app/connection/db');

var appoya = express();
var port = process.env.PORT || 8080;


appoya.use(bodyParser.json());
appoya.use(bodyParser.urlencoded({extended: true}));
appoya.use(cookieParser());
appoya.use(session({
    secret: '<appoyatoken>',
    saveUninitialized: false,
    resave: true
}));

var routerApi   = require('./app/routes/Api');
var routerSite   = require('./app/routes/Site');

appoya.use(express.static(__dirname + '/public'));
appoya.use(favicon(__dirname + '/public/styles/favicon.ico'));

appoya.use('/api', routerApi);
appoya.use('/', routerSite);

appoya.listen(port);