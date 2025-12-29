const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SubscriberSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    subscribedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Subscriber', SubscriberSchema);
