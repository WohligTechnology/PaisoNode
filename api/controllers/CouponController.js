/**
 * CouponController
 *
 * @description :: Server-side logic for managing Coupons
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	save: function(req, res) {
        if (req.body._id) {
            if (req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                coupon();
            } else {
                res.json({
                    value: "false",
                    comment: "Coupon-id is incorrect"
                });
            }
        } else {
            coupon();
        }

        function coupon() {
            var print = function(data) {
                res.json(data);
            }
            Coupon.save(req.body, print);
        }
    },
    delete: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            Coupon.delete(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "Coupon-id is incorrect"
            });
        }
    },
    find: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Coupon.find(req.body, callback);
    },
    findone: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            Coupon.findone(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "Coupon-id is incorrect"
            });
        }
    },
    findlimited: function(req, res) {
        if (req.body.pagesize && req.body.pagesize != "" && req.body.pagenumber && req.body.pagenumber != "") {
            function callback(data) {
                res.json(data);
            };
            Coupon.findlimited(req.body, callback);
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    }
};

