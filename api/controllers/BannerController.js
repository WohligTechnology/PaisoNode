/**
 * BannerController
 *
 * @description :: Server-side logic for managing Banners
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	save: function(req, res) {
        if (req.body._id) {
            if (req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                user();
            } else {
                res.json({
                    value: "false",
                    comment: "Banner-id is incorrect"
                });
            }
        } else {
            user();
        }

        function user() {
            var print = function(data) {
                res.json(data);
            }
            Banner.save(req.body, print);
        }
    },
    delete: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            Banner.delete(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "Banner-id is incorrect"
            });
        }
    },
    find: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Banner.find(req.body, callback);
    },
    findone: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            Banner.findone(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "Banner-id is incorrect"
            });
        }
    },
    findlimited: function(req, res) {
        if (req.body.pagesize && req.body.pagesize != "" && req.body.pagenumber && req.body.pagenumber != "") {
            function callback(data) {
                res.json(data);
            };
            Banner.findlimited(req.body, callback);
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    }
};

