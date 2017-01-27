'use strict';

const Users = require('../models/users.js');

function BarHandler() {
    var self = this;
    this.getBars = function(req, res) {
            Users
                .findOne({
                    'github.id': req.user.github.id
                }, function(err, result) {
                    if (err) {
                        throw err;
                    }

                    res.send(result.goingTo);
                });
        },
        this.addToBar = function(req, res) {
            Users
                .findOneAndUpdate({
                    'github.id': req.user.github.id
                }, {
                    $addToSet: {
                        'goingTo': req.body.goingTo
                    }
                })
                .exec(function(err, result) {
                    if (err) {
                        throw err;
                    }

                    res.send(result.goingTo);
                });
        },
        this.removeFromBar = function(req, res) {
            Users
                .findOneAndUpdate({
                    'github.id': req.user.github.id
                }, {
                    $pull: {
                        'goingTo': req.body.goingTo
                    }
                })
                .exec(function(err, result) {
                    if (err) {
                        throw err;
                    }

                    res.send(result.goingTo);
                });
        },
        this.switchBar = function(req, res) {
            
            Users.findOne({
                'github.id': req.user.github.id
            }, (err, user) => {
                if (err) {
                    throw err;
                }

                if (user.goingTo.indexOf(req.body.goingTo) < 0) {
                    self.addToBar(req, res);
                }
                else {
                    self.removeFromBar(req, res);
                }
            });
        }
}


module.exports = BarHandler;
