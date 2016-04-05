/**
 * VariableController
 *
 * @description :: Server-side logic for managing variables
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
                    comment: "Variable-id is incorrect"
                });
            }
        } else {
            user();
        }

        function user() {
            var print = function(data) {
                res.json(data);
            }
            Variable.save(req.body, print);
        }
    },
    delete: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            Variable.delete(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "Variable-id is incorrect"
            });
        }
    },
    find: function(req, res) {
        if (req.body) {
            function callback(data) {
                res.json(data);
            };
            Variable.find(req.body, callback);
        } else {
            res.json({
                value: "false",
                comment: "Variable-id is incorrect"
            });
        }
    },
    findone: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            Variable.findone(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "Please provide parameters"
            });
        }
    },
    findlimited: function(req, res) {
        if (req.body.pagesize && req.body.pagesize != "" && req.body.pagenumber && req.body.pagenumber != "") {
            function callback(data) {
                res.json(data);
            };
            Variable.findlimited(req.body, callback);
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    }
};
