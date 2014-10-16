var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var schemaProfile = new Schema({
    _id: {type: String, enum: ['master', 'secretariat', 'ally', 'volunteer']}
},
    {collection:"Profile"});

schemaProfile.set('toJSON',
    {
        transform: function (doc, ret, options) {
            ret.id = ret._id;
            delete ret._id;
        }
    });

module.exports = mongoose.model('Profile', schemaProfile);
