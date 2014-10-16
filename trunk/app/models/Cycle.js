var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schemaCycle = new Schema({
    name: String,
    beginning: Date,
    end: Date
}, {collection:"Cycle"});

schemaCycle.set('toJSON',
    {
        transform: function (doc, ret, options) {
            ret.id = ret._id;
            delete ret._id;
        }
    });


schemaCycle.statics.getActive = function(fields, cb)
{
    this.getActiveOn(fields, new Date(), cb);
}
schemaCycle.statics.getActiveOn = function(fields, date, cb)
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
}

module.exports = mongoose.model('Cycle', schemaCycle);
