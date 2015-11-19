/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {
    save: function (req, res) {
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
            var print = function (data) {
                res.json(data);
            }
            User.save(req.body, print);
        }
    },
    delete: function (req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function (data) {
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
    findorcreate: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        User.findorcreate(req.body, print);
    },
    find: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        User.find(req.body, callback);
    },
    countusers: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        User.countusers(req.body, callback);
    },
    adminlogin: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        User.adminlogin(req.body, callback);
    },
    findone: function (req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function (data) {
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
    findUserByMobile: function (req, res) {
        if (req.body.mobile && req.body.mobile != "") {
            var print = function (data) {
                res.json(data);
            }
            User.findUserByMobile(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "User-id is incorrect"
            });
        }
    },
    updateReferrer: function (req, res) {
        if (req.body.mobile && req.body.mobile != "" && req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function (data) {
                res.json(data);
            }
            User.updateReferrer(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "User-id is incorrect"
            });
        }
    },
    findlimited: function (req, res) {
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
    login: function (req, res) {
        if (req.body.mobile && req.body.mobile != "" && req.body.password && req.body.password != "") {
            var print = function (data) {
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