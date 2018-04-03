const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');

const Favorites = require('../models/favorite');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.get(authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({'user': req.user._id})
    .populate('user movies')
    .then((favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({'user': req.user._id})
    .then((favorite) => {
        if (favorite == null) {
            Favorites.create({'user': req.user._id, 'movies':req.body})
            .then((favorite) => {
                console.log('Favorite Created ', req.body);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }, (err) => next(err))
        }
        else {
            for (i = 0, len = req.body.length; i < len; i++) { 
                if (favorite.movies.indexOf(req.body[i]._id)<0) {
                    favorite.movies.push(req.body[i]);
                }
            };
            favorite.save()
            .then((favorite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);                
            }, (err) => next(err))       
        }
    })
    .catch((err) => next(err));
})
.put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Favorites.remove({'user': req.user._id})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

favoriteRouter.route('/:movieId')
.get(authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorites) => {
        if (!favorites) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.json({"exists": false, "favorites": favorites});
        }
        else {
            if (favorites.movies.indexOf(req.params.movieId) < 0) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": false, "favorites": favorites});
            }
            else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": true, "favorites": favorites});
            }
        }

    }, (err) => next(err))
    .catch((err) => next(err))
})
.post(authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({'user': req.user._id})
    .then((favorite) => {
        if (favorite == null) {
            Favorites.create({'user': req.user._id, 'movies':req.params.movieId})
            .then((favorite) => {
                console.log('Favorite Created ', req.movieId);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }, (err) => next(err))
        }
        else {
            var para = mongoose.Types.ObjectId(req.params.movieId);
            if (favorite.movies.indexOf(para)<0) {
                favorite.movies.push(para);
            };
            favorite.save()
            .then((favorite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);                
            }, (err) => next(err))       
        }
    })
    .catch((err) => next(err));
})
.put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites/movieId');
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({'user': req.user._id})
    .then((favorite) => {
        var para = mongoose.Types.ObjectId(req.params.movieId);
        var idx = favorite.movies.indexOf(para);
        if (idx > -1) {
            favorite.movies.splice(idx, 1);
        };
        favorite.save()
        .then((favorite) => {
            Favorites.findById(favorite._id)
            .populate('user')
            .populate('movies')
            .then((favorite) => {
                console.log('Favorite Movie Deleted!', favorite);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            })
        }, (err) => next(err))
    })
    .catch((err) => next(err));
})

module.exports = favoriteRouter;