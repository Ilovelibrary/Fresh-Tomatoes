const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');

const Movies = require('../models/movie');
const User = require('../models/user');

const movieRouter = express.Router();

movieRouter.use(bodyParser.json());

movieRouter.route('/')
.get((req,res,next) => {
    Movies.find(req.query)
    .populate('comments.author')
    .then((movies) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(movies);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Movies.create(req.body)
    .then((movie) => {
        console.log('Movie Created ', movie);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(movie);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /movies');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Movies.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});


movieRouter.route('/:movieId')
.get((req,res,next) => {
    Movies.findById(req.params.movieId)
    .populate('comments.author')
    .then((movie) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(movie);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /movies/'+ req.params.movieId);
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Movies.findByIdAndUpdate(req.params.movieId, {
        $set: req.body
    }, { new: true })
    .then((movie) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(movie);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Movies.findByIdAndRemove(req.params.movieId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});


movieRouter.route('/:movieId/comments')
.get((req,res,next) => {
    Movies.findById(req.params.movieId)
    .populate('comments.author')
    .then((movie) => {
        if (movie != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(movie.comments);
        }
        else {
            err = new Error('Movie ' + req.params.movieId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    Movies.findById(req.params.movieId)
    .then((movie) => {
        if (movie != null) {
            req.body.author = req.user._id;
            movie.comments.push(req.body);
            movie.save()
            .then((movie) => {
                Movies.findById(movie._id)
                .populate('comments.author')
                .then((movie) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(movie);
                })                 
            }, (err) => next(err));
        }
        else {
            err = new Error('Movie ' + req.params.movieId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /movies/'
        + req.params.movieId + '/comments');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Movies.findById(req.params.movieId)
    .then((movie) => {
        if (movie != null) {
            for (var i = (movie.comments.length -1); i >= 0; i--) {
                movie.comments.id(movie.comments[i]._id).remove();
            }
            movie.save()
            .then((movie) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(movie);                
            }, (err) => next(err));
        }
        else {
            err = new Error('Movie ' + req.params.movieId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));    
});


movieRouter.route('/:movieId/comments/:commentId')
.get((req,res,next) => {
    Movies.findById(req.params.movieId)
    .populate('comments.author') 
    .then((movie) => {
        if (movie != null && movie.comments.id(req.params.commentId) != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(movie.comments.id(req.params.commentId));
        }
        else if (movie == null) {
            err = new Error('Movie ' + req.params.movieId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /movies/'+ req.params.movieId
        + '/comments/' + req.params.commentId);
})
.put(authenticate.verifyUser, (req, res, next) => {
    Movies.findById(req.params.movieId)
    .then((movie) => {

        if (movie != null && movie.comments.id(req.params.commentId) != null) {
            var id1 = req.user;
            var id2 = movie.comments.id(req.params.commentId).author;
            if (id1.equals(id2)) {
                if (req.body.rating) {
                    movie.comments.id(req.params.commentId).rating = req.body.rating;
                }
                if (req.body.comment) {
                    movie.comments.id(req.params.commentId).comment = req.body.comment;                
                }
                movie.save()
                .then((movie) => {
                    Movies.findById(movie._id)
                    .populate('comments.author')
                    .then((movie) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(movie);  
                    })                
                }, (err) => next(err));
            }
            else {
                err = new Error('You are not authorized to updated the comment');
                err.status = 403;
                return next(err);            
            }
        }
        else if (movie == null) {
            err = new Error('Movie ' + req.params.movieId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Movies.findById(req.params.movieId)
    .then((movie) => {
        if (movie != null && movie.comments.id(req.params.commentId) != null) {
            var id1 = req.user;
            var id2 = movie.comments.id(req.params.commentId).author;
            if (id1.equals(id2)) {
                movie.comments.id(req.params.commentId).remove();
                movie.save()
                .then((movie) => {
                    Movies.findById(movie._id)
                    .populate('comments.author')
                    .then((movie) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(movie);  
                    })                           
                }, (err) => next(err));
            }
            else {
                err = new Error('You are not authorized to delete the comment');
                err.status = 403;
                return next(err);    
            }
        }
        else if (movie == null) {
            err = new Error('Movie ' + req.params.movieId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = movieRouter;