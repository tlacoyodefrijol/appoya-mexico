var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schemaEnrollment = new Schema({
    user: {type:Schema.Types.ObjectId, ref:'User'}, // ID del usuario
    role: {type: String, enum: ['supervisor', 'voluntario', 'aliado']}, // Qué rol tomará el usuario en esta inscripción
    event: {type:Schema.Types.ObjectId, ref:'Event'}, // A que eventos inscribe al usuario
    group: {type:Schema.Types.ObjectId, ref:'Group'}, // A qué grupos inscribe al usuario
    date: Date // Fecha de inscripción
},
    {collection:"Enrollment"});

schemaEnrollment.set('toJSON',
    {
        transform: function (doc, ret, options) {
            ret.id = ret._id;
            delete ret._id;
        }
    });


schemaEnrollment.statics.enroll = function(user, group, role, cb)
{

};

module.exports = mongoose.model('Enrollment', schemaEnrollment);
