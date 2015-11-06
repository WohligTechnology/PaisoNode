/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
// var passport = require('passport'),
//     TwitterStrategy = require('passport-twitter').Strategy,
//     FacebookStrategy = require('passport-facebook').Strategy,
//     GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// passport.use(new TwitterStrategy({
//         consumerKey: "LPazfO26oP6KrjYCWlQJfUZq1",
//         consumerSecret: "SJ8tuzeiGvM7YZvRoHqXSk8LLThpn6DPg2BMtuBrgR9n01DQBD",
//         callbackURL: sails.myurl + "user/callbackt"
//     },
//     function(token, tokenSecret, profile, done) {
//         profile.token = token;
//         profile.tokenSecret = tokenSecret;
//         profile.provider = "Twitter";
//         User.findorcreate(profile, done);
//     }
// ));
// passport.use(new FacebookStrategy({
//         clientID: "1475701386072240",
//         clientSecret: "6e46460c7bb3fb4f06182d89eb7514b9",
//         callbackURL: sails.myurl + "user/callbackf"
//     },
//     function(accessToken, refreshToken, profile, done) {
//         profile.accessToken = accessToken;
//         profile.refreshToken = refreshToken;
//         profile.provider = "Facebook";
//         User.findorcreate(profile, done);
//     }
// ));

// passport.use(new GoogleStrategy({
//         clientID: "1037714210694-1hha4c8pbfr3v3922u1o9rq9ahqe58qe.apps.googleusercontent.com",
//         clientSecret: "evdpiycmTSRae_mk2vQVWBzZ",
//         callbackURL: "callbackg"
//     },
//     function(token, tokenSecret, profile, done) {
//         profile.token = token;
//         profile.tokenSecret = tokenSecret;
//         profile.provider = "Google";
//         console.log(profile);
//         // User.findorcreate(profile, done);
//     }
// ));

// passport.serializeUser(function(user, done) {
//     done(null, user);
// });

// passport.deserializeUser(function(id, done) {
//     done(null, id);
// });
// var request = require('request');
module.exports = {
    /////////////////////////////
    //LOGIN FUNCTIONS
    // logint: function(req, res) {
    //     var user = req.param("user");

    //     passport.use(new TwitterStrategy({
    //             consumerKey: "LPazfO26oP6KrjYCWlQJfUZq1",
    //             consumerSecret: "SJ8tuzeiGvM7YZvRoHqXSk8LLThpn6DPg2BMtuBrgR9n01DQBD",
    //             callbackURL: sails.myurl + "user/callbackt"
    //         },
    //         function(token, tokenSecret, profile, done) {
    //             profile.token = token;
    //             profile.tokenSecret = tokenSecret;
    //             profile.provider = "Twitter";
    //             if (user && sails.ObjectID.isValid(user)) {
    //                 profile._id = user;
    //             }
    //             User.findorcreate(profile, done);
    //         }
    //     ));

    //     var loginid = req.param("loginid");
    //     req.session.loginid = loginid;
    //     passport.authenticate('twitter')(req, res);
    // },
    // loginf: function(req, res) {
    //     var user = req.param("user");

    //     passport.use(new FacebookStrategy({
    //             clientID: "1475701386072240",
    //             clientSecret: "6e46460c7bb3fb4f06182d89eb7514b9",
    //             callbackURL: sails.myurl + "user/callbackf"
    //         },
    //         function(accessToken, refreshToken, profile, done) {
    //             profile.accessToken = accessToken;
    //             profile.refreshToken = refreshToken;
    //             profile.provider = "Facebook";
    //             if (user && sails.ObjectID.isValid(user)) {
    //                 profile._id = user;
    //             }
    //             User.findorcreate(profile, done);
    //         }
    //     ));

    //     var loginid = req.param("loginid");
    //     req.session.loginid = loginid;
    //     passport.authenticate('facebook', {
    //         scope: 'email,public_profile,publish_actions'
    //     })(req, res);
    // },
    // loging: function(req, res) {
    //     var user = req.param("user");

    //     passport.use(new GoogleStrategy({
    //             clientID: "1037714210694-1hha4c8pbfr3v3922u1o9rq9ahqe58qe.apps.googleusercontent.com",
    //             clientSecret: "evdpiycmTSRae_mk2vQVWBzZ",
    //             callbackURL: "callbackg"
    //         },
    //         function(token, tokenSecret, profile, done) {
    //             profile._json.token = token;
    //             profile._json.tokenSecret = tokenSecret;
    //             profile._json.provider = "Google";
    //             console.log(profile._json);
    //             // User.findorcreate(profile, done);
    //         }
    //     ));

    //     var loginid = req.param("loginid");
    //     req.session.loginid = loginid;
    //     passport.authenticate('google', {
    //         scope: "openid profile email"
    //     })(req, res);
    // },
    // callbackt: passport.authenticate('twitter', {
    //     successRedirect: '/user/success',
    //     failureRedirect: '/user/fail'
    // }),
    // callbackg: passport.authenticate('google', {
    //     successRedirect: '/user/success',
    //     failureRedirect: '/user/fail'
    // }),
    // callbackf: passport.authenticate('facebook', {
    //     successRedirect: '/user/success',
    //     failureRedirect: '/user/fail'
    // }),
    // success: function(req, res, data) {
    //     if (req.session.passport) {
    //         sails.sockets.blast("login", {
    //             loginid: req.session.loginid,
    //             status: "success",
    //             user: req.session.passport.user
    //         });
    //     }
    //     res.view("success");
    // },
    // fail: function(req, res) {
    //     sails.sockets.blast("login", {
    //         loginid: req.session.loginid,
    //         status: "fail"
    //     });
    //     res.view("fail");
    // },
    // profile: function(req, res) {
    //     if (req.session.passport) {
    //         res.json(req.session.passport.user);
    //     } else {
    //         res.json({});
    //     }
    // },
    // logout: function(req, res) {
    //     req.session.destroy(function(err) {
    //         res.send(req.session);
    //     });
    // },
    ///////////////////////////
    save: function(req, res) {
        if (req.body._id) {
            if (req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                user();
            } else {
                res.json({
                    value: "false",
                    comment: "User-id is incorrect"
                });
            }
        } else {
            user();
        }

        function user() {
            var print = function(data) {
                res.json(data);
            }
            User.save(req.body, print);
        }
    },
    delete: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            User.delete(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "User-id is incorrect"
            });
        }
    },
    findorcreate: function(req, res) {
        var print = function(data) {
            res.json(data);
        }
        User.findorcreate(req.body, print);
    },
    find: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        User.find(req.body, callback);
    },
    countusers: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        User.countusers(req.body, callback);
    },
    adminlogin: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        User.adminlogin(req.body, callback);
    },
    findone: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            User.findone(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "User-id is incorrect"
            });
        }
    },
    findlimited: function(req, res) {
        if (req.body.pagesize && req.body.pagesize != "" && req.body.pagenumber && req.body.pagenumber != "") {
            function callback(data) {
                res.json(data);
            };
            User.findlimited(req.body, callback);
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    login: function(req, res) {
        if (req.body.mobile && req.body.mobile != "" && req.body.password && req.body.password != "") {
            var print = function(data) {
                res.json(data);
            }
            User.login(req.body, print);
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    }
};
