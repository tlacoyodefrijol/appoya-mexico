var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var schemaUser = new Schema({
    name: String,
    lastname: String,
    username: {type:String, required:true},
    secretword: {type:String, required:true},
    email: String,
    birthdate: Date,
    gender: {type:String, enum:['F','M']},
    bloodtype: {type: String, enum: ['O-','O+','A+','A-','B+','B-','AB+','AB-']},
    address: [{
        kind: {type: String, enum: ['home','office','relative']},
        street: String,
        number: String,
        interior: String,
        suburb: String,
        city: String,
        state: String,
        country: String,
        zip: {type: Number, min: 00000, max: 99999}
    }],
    phones: [{
        kind: {type: String, enum: ['home','office','mobile']},
        emergency: Boolean,
        number: String
    }],
    profile: [{type:String, ref:'Profile'}],
    curp: String,
    serial: String,
    children: [{type:Schema.Types.ObjectId, ref:'User'}]
},
    {collection:"User"});

schemaUser.set('toJSON',
    {
        transform: function (doc, ret, options) {
            ret.id = ret._id;
            delete ret._id;
        }
    });
schemaUser.index({name:'text',lastname:'text',serial:'text'},{name:'SearchByWord',default_language:'es'});
schemaUser.methods.age = function()
{

}
module.exports = mongoose.model('User', schemaUser);
