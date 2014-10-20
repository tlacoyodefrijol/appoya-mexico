var mongoose = require('mongoose');
var dbConnection = mongoose.connection;
var User = require('../models/User');
var Profile = require('../models/Profile');

mongoose.connect('mongodb://localhost/appoyamx');
//mongoose.set('debug', true);

dbConnection.on('error', console.error.bind(console, 'connection error:'));
dbConnection.once('open', function () {

    User.findOne({username: 'master'}, function (err, find) {
        if (!find) {
            var _profile = new Profile();
            _profile._id = 'master';
            _profile.save(function(err,succ){
                var _master = new User();
                _master.username = 'master';
                _master.secretword = 'master';
                _master.profile.push(['master']);
                _master.save();
            });

            _profile = new Profile();
            _profile._id = 'secretaria';
            _profile.save();

            _profile = new Profile();
            _profile._id = 'aliado';
            _profile.save();

            _profile = new Profile();
            _profile._id = 'voluntario';
            _profile.save();
        }
    });
});

module.exports = mongoose;