const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    body: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Post', PostSchema);
