/**
 * TransactionController
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
                    comment: "Transaction-id is incorrect"
                });
            }
        } else {
            user();
        }

        function user() {
            var print = function (data) {
                res.json(data);
            }
            Transaction.save(req.body, print);
        }
    },
    delete: function (req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function (data) {
                res.json(data);
            }
            Transaction.delete(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "Transaction-id is incorrect"
            });
        }
    },
    find: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Transaction.find(req.body, callback);
    },
    findone: function (req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function (data) {
                res.json(data);
            }
            Transaction.findone(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "Transaction-id is incorrect"
            });
        }
    },
    findlimited: function (req, res) {
        if (req.body.pagesize && req.body.pagesize != "" && req.body.pagenumber && req.body.pagenumber != "") {
            function callback(data) {
                res.json(data);
            };
            Transaction.findlimited(req.body, callback);
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    //find the history of balance transactions in the Transaction collection type=balance
    findByType: function (req, res) {
        console.log(req.body);
        if (req.body.type && req.body.type != "") {
            var print = function (data) {
                res.json(data);
            }
            Transaction.findByType(req.body, print);
        } else {
            {
                res.json({
                    value: false,
                    comment: "Enter the type of transaction"
                })
            }

        }
    },
    findByTypeStatus: function (req, res) {
        console.log(req.body);
        if (req.body.type && req.body.status && req.body.type != "" && req.body.status) {
            var print = function (data) {
                res.json(data);
            }
            Transaction.findByTypeStatus(req.body, print);
        } else {
            {
                res.json({
                    value: false,
                    comment: "Enter the type of transaction"
                })
            }

        }
    }
};