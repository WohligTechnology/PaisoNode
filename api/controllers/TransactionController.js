/**
 * TransactionController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    save: function (req, res) {
        if (req.body.to && req.body.to != "" && sails.ObjectID.isValid(req.body.to)) {
            user();
        } else {
            res.json({
                value: "false",
                comment: "Transaction-id is incorrect"
            });
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
    },analyseTransaction: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Transaction.analyseTransaction(req.body, callback);
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
    findByTypeUser: function (req, res) {
        console.log(req.body);
        if (req.body.type && req.body.type != "") {
            var print = function (data) {
                res.json(data);
            }
            Transaction.findByTypeUser(req.body, print);
        } else {
            {
                res.json({
                    value: false,
                    comment: "Enter the type of transaction"
                })
            }

        }
    },
    findPassbookEntry: function (req, res) {
        console.log(req.body);
        if (req.body.type && req.body.from && req.body.passbook && req.body.type != "" && req.body.from != "" && req.body.passbook != "" && sails.ObjectID.isValid(req.body.from)) {
            var print = function (data) {
                res.json(data);
            }
            Transaction.findPassbookEntry(req.body, print);
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
    },
    sendmail: function (req, res) {
        if (req.body.email && req.body.email != "") {
            var print = function (data) {
                res.json(data);
            }
            Transaction.sendmail(req.body, print);
        } else {
            res.json({
                value: false,
                comment: "Enter the type of transaction"
            });
        }
    },
    sendSMS: function (req, res) {
        if (req.body.mobile && req.body.mobile != "") {
            var print = function (data) {
                res.json(data);
            }
            Transaction.sendSMS(req.body, print);
        } else {
            res.json({
                value: false,
                comment: "Enter the type of transaction"
            });
        }
    }
};
