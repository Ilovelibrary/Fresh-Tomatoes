const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var commentSchema = new Schema({
    rating:  {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment:  {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true,
    usePushEach: true
});

var movieSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean,
        default: false
    },
    year: { 
        type: String
    },
    description: {
        type: String,
        default: ""
    },
    IMDbrating: {
        type: String
    },
    urlPoster: {
        type: String
    },
    urlTrailer: {
        type: String
    },
    comments:[commentSchema]
}, {
    usePushEach: true
});

var Movies = mongoose.model('Movie', movieSchema);
module.exports = Movies;