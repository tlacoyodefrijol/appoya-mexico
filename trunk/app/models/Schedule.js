var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var schemaSchedule = new Schema({
    sessions: [{
        day: Number,
        startHour: Date,
        endHour: Date
    }]
},
    {collection:"Schedule"});

schemaSchedule.set('toJSON',
    {
        transform: function (doc, ret, options) {
            ret.id = ret._id;
            delete ret._id;
        }
    });

module.exports = mongoose.model('Schedule', schemaSchedule);