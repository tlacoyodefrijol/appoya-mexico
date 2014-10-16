var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var schemaGroup = new Schema({
    name: String,
    cycle: {type:Schema.Types.ObjectId, ref:'Cycle'}
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
