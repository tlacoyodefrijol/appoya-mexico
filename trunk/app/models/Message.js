var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schemaMessage = new Schema({
    kind: {type: String, enum: ['message', 'news', 'alert', 'comment', 'post', 'note']},
    date: {type: Date, index: true},
    from: {type: Schema.Types.ObjectId, ref: 'User'},
    to: [{
        kind: {type: String, enum: ['all', 'user', 'profile', 'course', 'group']},
        subject_id: Schema.Types.ObjectId
        }],
    related: Schema.Types.ObjectId,
    subject: String,
    content: String,
    read: [{
        date: Date,
        user: {type: Schema.Types.ObjectId, ref: 'User', index: 1}
    }]
},
    {collection:"Message"});

schemaMessage.set('toJSON',
    {
        transform: function (doc, ret, options) {
            ret.id = ret._id;
            delete ret._id;
        }
    });

schemaMessage.index({"to.kind":1,"to.subject":1});
module.exports = mongoose.model('Message', schemaMessage);
