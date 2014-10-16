var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var schemaGroup = new Schema({
    name: String,
    level: {type:Schema.Types.ObjectId},
    cycle: {type:Schema.Types.ObjectId, ref:'Cycle'},
    courses: [
        {
            content:{type:Schema.Types.ObjectId, ref:'ContentTree'},
            schedule:{type:Schema.Types.ObjectId, ref:'Schedule'}
        }]
},
    {collection:"Group"});

schemaGroup.set('toJSON',
    {
        transform: function (doc, ret, options) {
            ret.id = ret._id;
            delete ret._id;
        }
    });

module.exports = mongoose.model('Group', schemaGroup);
