/**
 * Created by Robert on 16/10/14.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var schemaEvent = new Schema({
        name: String,
        creator:{type: Schema.Types.ObjectId, ref: 'User'},
        beginning: Date,
        end: Date,
        usermin: Number,
        roles: Array,
        prizes: Array,
        kind: Array,
        description: String
    },
    {collection:"Event"});

schemaEvent.set('toJSON',
    {
        transform: function (doc, ret, options) {
            ret.id = ret._id;
            delete ret._id;
        }
    });

schemaEvent.statics.getActive = function(fields, cb)
{
    this.getActiveOn(fields, new Date(), cb);
};

schemaEvent.statics.getActiveOn = function(fields, date,cb)
{
    this.find(
        {$and: [
            {$or:[
                {'beginning':{$lte:date}},
                {'beginning':null}
            ]},
            {$or:[   {'end':{$gte:date}},
                {'end':null}
            ]}
        ]},
        fields,
        cb);
};

module.exports = mongoose.model('Event', schemaEvent);