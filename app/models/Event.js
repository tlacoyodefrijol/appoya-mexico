/**
 * Created by Robert on 16/10/14.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var schemaEvent = new Schema({
        name: String,
        beginning: Date,
        end: Date,
    },
    {collection:"Event"});

schemaEvent.set('toJSON',
    {
        transform: function (doc, ret, options) {
            ret.id = ret._id;
            delete ret._id;
        }
    });

module.exports = mongoose.model('Event', schemaEvent);