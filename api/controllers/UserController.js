/**
 * UserController
 *
 * @description :: Server-side logic for managing users
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
    adminsave: function(req, res) {
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
            User.adminsave(req.body, print);
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
    deleteall: function(req, res) {
        if (req.body) {
            var print = function(data) {
                res.json(data);
            }
            User.deleteall(req.body, print);
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
    countusersintime: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        User.countusersintime(req.body, callback);
    },
    countusersOverTime: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        User.countusersOverTime(req.body, callback);
    },
    adminlogin: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        User.adminlogin(req.body, callback);
    },
    changepassword: function(req, res) {
        if (req.body) {
            if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                var print = function(data) {
                    res.json(data);
                }
                User.changepassword(req.body, print);
            } else {
                res.json({
                    value: "false",
                    comment: "User-id is incorrect"
                });
            }
        } else {
            res.json({
                value: "false",
                comment: "Please provide parameters"
            });
        }
    },
    forgotpassword: function(req, res) {
        if (req.body) {
            if (req.body.mobile && req.body.mobile != "") {
                var print = function(data) {
                    res.json(data);
                }
                User.forgotpassword(req.body, print);
            } else {
                res.json({
                    value: "false",
                    comment: "Please provide parameters"
                });
            }
        } else {
            res.json({
                value: "false",
                comment: "Please provide parameters"
            });
        }
    },
    findone: function(req, res) {
        if (req.body) {
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
        } else {
            res.json({
                value: "false",
                comment: "User-id is incorrect"
            });
        }
    },
    logout: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            User.logout(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "User-id is incorrect"
            });
        }
    },
    findUserByMobile: function(req, res) {
        if (req.body.mobile && req.body.mobile != "") {
            var print = function(data) {
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
    validateMobile: function(req, res) {
        if (req.body.mobile && req.body.mobile != "") {
            var print = function(data) {
                res.json(data);
            }
            User.validateMobile(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "User-id is incorrect"
            });
        }
    },
    updateReferrer: function(req, res) {
        if (req.body.mobile && req.body.mobile != "" && req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
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
    },
    //////////////////////////////////////////////SHMART
    //////////////////////////////////////////////SIGNUP
    register: function(req, res) {
        if (req.body) {
            var print = function(data) {
                res.json(data);
            }
            User.register(req.body, print);
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    checkMob: function(req, res) {
        if (req.body) {
            if (req.body.mobile && req.body.mobile != "") {
                var print = function(data) {
                    res.json(data);
                }
                User.checkMob(req.body, print);
            } else {
                res.json({
                    value: false,
                    comment: "Please provide mobile number"
                });
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    validateOTP: function(req, res) {
        if (req.body) {
            if (req.body.consumer && req.body.consumer != "" && req.body.otp && req.body.otp != "") {
                var print = function(data) {
                    res.json(data);
                }
                User.validateOTP(req.body, print);
            } else {
                res.json({
                    value: false,
                    comment: "Please provide parameters"
                });
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    //////////////////////////////////////////////TRANSACTION
    saveCard: function(req, res) {
        if (req.query) {
            if (req.query.consumer) {
                User.saveCard(req.query.consumer, function(data) {
                    if (data.indexOf("/") != -1) {
                        res.json({
                            link: data
                        });
                    } else {
                        res.json(data);
                    }
                });
            } else {
                res.json({
                    value: false,
                    comment: "Please provide parameters"
                });
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    getListOfCards: function(req, res) {
        if (req.body) {
            if (req.body.consumer) {
                sails.request.get({
                    url: sails.shmart + "cards/cards_list/user_id/" + req.body.consumer,
                    headers: {
                        'Authorization': 'Basic ' + sails.auth,
                        'Content-Type': 'application/json'
                    }
                }, function(err, http, body) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false,
                            comment: err
                        });
                    } else {
                        if (err) {
                            console.log(err);
                            res.json({
                                value: false,
                                comment: err
                            });
                        } else {
                            body = JSON.parse(body);
                            if (body.status == "success") {
                                if (body.cards[0] == 0) {
                                    body.cards = [];
                                    res.json({
                                        value: true,
                                        comment: body
                                    });
                                } else {
                                    res.json({
                                        value: true,
                                        comment: body
                                    });
                                }
                            } else {
                                res.json({
                                    value: false,
                                    comment: body
                                });
                            }
                        }
                    }
                });
            } else {
                res.json({
                    value: false,
                    comment: "Please provide parameters"
                });
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    getListOfV: function(req, res) {
        if (req.body) {
            if (req.body.consumer) {
                sails.request.get({
                    url: sails.shmart + "vouchers/list/consumer_id/" + req.body.consumer,
                    headers: {
                        'Authorization': 'Basic ' + sails.auth,
                        'Content-Type': 'application/json'
                    }
                }, function(err, http, body) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false,
                            comment: err
                        });
                    } else {
                        if (err) {
                            console.log(err);
                            res.json({
                                value: false,
                                comment: err
                            });
                        } else {
                            body = JSON.parse(body);
                            if (body.status == "success") {
                                if (body.vouchers[0] == 0) {
                                    body.vouchers = [];
                                    res.json({
                                        value: true,
                                        comment: body
                                    });
                                } else {
                                    res.json({
                                        value: true,
                                        comment: body
                                    });
                                }
                            } else {
                                res.json({
                                    value: false,
                                    comment: body
                                });
                            }
                        }
                    }
                });
            } else {
                res.json({
                    value: false,
                    comment: "Please provide parameters"
                });
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    addToWallet: function(req, res) {
        if (req.body) {
            if (req.body.consumer && req.body.amount) {
                User.addToWallet(req.body, function(data) {
                    res.json(data);
                });
            } else {
                res.json({
                    value: false,
                    comment: "Please provide parameters"
                });
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    netBanking: function(req, res) {
        if (req.body) {
            if (req.body.email && req.body.amount) {
                User.netBanking(req.body, function(data) {
                    res.json(data);
                });
            } else {
                res.json({
                    value: false,
                    comment: "Please provide parameters"
                });
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    responseCheck: function(req, res) {
        console.log(req.body);
        if (req.body) {
            if (req.body.status && parseInt(req.body.status) == 0 && req.body.status_msg && req.body.status_msg == "Success") {
                res.redirect('http://wohlig.co.in/paisoapk/success.html');
            } else {
                res.redirect('http://wohlig.co.in/paisoapk/fail.html');
            }
        } else {
            res.redirect('http://wohlig.co.in/paisoapk/fail.html');
        }
    },
    readMoney: function(req, res) {
        if (req.body) {
            if (req.body.consumer) {
                User.readMoney(req.body, function(data) {
                    res.json(data);
                });
            } else {
                res.json({
                    value: false,
                    comment: "Please provide parameters"
                });
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    readMoneyV: function(req, res) {
        if (req.body) {
            if (req.body.consumer) {
                User.readMoneyV(req.body, function(data) {
                    res.json(data);
                });
            } else {
                res.json({
                    value: false,
                    comment: "Please provide parameters"
                });
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    addMoney: function(req, res) {
        if (req.body) {
            if (req.body.consumer) {
                User.addMoney(req.body, function(data) {
                    res.json(data);
                });
            } else {
                res.json({
                    value: false,
                    comment: "Please provide parameters"
                });
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    walletAdd: function(req, res) {
        if (req.body) {
            if (req.body.consumer) {
                User.walletAdd(req.body, function(data) {
                    res.json(data);
                });
            } else {
                res.json({
                    value: false,
                    comment: "Please provide parameters"
                });
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    removeMoney: function(req, res) {
        if (req.body) {
            if (req.body.consumer && req.body.amount) {
                User.removeMoney(req.body, function(data) {
                    res.json(data);
                });
            } else {
                res.json({
                    value: false,
                    comment: "Please provide parameters"
                });
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    sendMoney: function(req, res) {
        if (req.body) {
            if (req.body.consumer && req.body.amount) {
                User.sendMoney(req.body, function(data) {
                    res.json(data);
                });
            } else {
                res.json({
                    value: false,
                    comment: "Please provide parameters"
                });
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    redeem: function(req, res) {
        if (req.body) {
            if (req.body.consumer && req.body.amount && req.body.vendor && sails.ObjectID.isValid(req.body.vendor) && req.body.user && sails.ObjectID.isValid(req.body.user)) {
                User.redeem(req.body, function(data) {
                    res.json(data);
                });
            } else {
                res.json({
                    value: false,
                    comment: "Please provide parameters"
                });
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    moneySend: function(req, res) {
        if (req.body) {
            if (req.body.consumer && req.body.amount) {
                User.moneySend(req.body, function(data) {
                    res.json(data);
                });
            } else {
                res.json({
                    value: false,
                    comment: "Please provide parameters"
                });
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    generateOtpForDebit: function(req, res) {
        if (req.body) {
            if (req.body.consumer) {
                User.generateOtpForDebit(req.body, function(data) {
                    res.json(data);
                });
            } else {
                res.json({
                    value: false,
                    comment: "Please provide parameters"
                });
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    //////////////////////////////////////////////SHMART
    //////////////////////////////////////////////Extra APIs
    generateOTP: function(req, res) {
        if (req.body) {
            if (req.body.consumer) {
                sails.request.post({
                    url: sails.shmart + "customers/generateotp",
                    json: {
                        consumer_id: req.body.consumer,
                    },
                    headers: {
                        Authorization: 'Basic ' + sails.auth,
                        'Content-Type': 'application/json'
                    }
                }, function(err, http, body) {
                    if (err) {
                        console.log(err);
                        res.json({
                            value: false,
                            comment: err
                        });
                    } else {
                        if (body.status == "success") {
                            res.json({
                                value: true,
                                comment: body
                            });
                        } else {
                            res.json({
                                value: false,
                                comment: body
                            });
                        }
                    }
                });
            } else {
                res.json({
                    value: false,
                    comment: "Please provide parameters"
                });
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    getConsumerId: function(req, res) {
        if (req.body) {
            if (req.body.mobile) {
                sails.request.post({
                    url: sails.shmart + "customers/getConsumerID",
                    json: {
                        mobile_no: req.body.mobile,
                    },
                    headers: {
                        Authorization: 'Basic ' + sails.auth,
                        'Content-Type': 'application/json'
                    }
                }, function(err, http, body) {
                    if (err) {
                        console.log(err);
                        res.json({
                            value: false,
                            comment: err
                        });
                    } else {
                        if (body.status == "success") {
                            res.json({
                                value: true,
                                comment: body
                            });
                        } else {
                            res.json({
                                value: false,
                                comment: body
                            });
                        }
                    }
                });
            } else {
                res.json({
                    value: false,
                    comment: "Please provide parameters"
                });
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    checkStatus: function(req, res) {
        if (req.body) {
            if (req.body.consumer) {
                sails.request.get({
                    url: sails.shmart + "customers/activation_status/consumer_id/" + req.body.consumer,
                    headers: {
                        Authorization: 'Basic ' + sails.auth,
                        'Content-Type': 'application/json'
                    }
                }, function(err, http, body) {
                    if (err) {
                        console.log(err);
                        res.json({
                            value: false,
                            comment: err
                        });
                    } else {
                        body = JSON.parse(body);
                        if (body.status == "success") {
                            res.json({
                                value: true,
                                comment: body
                            });
                        } else {
                            res.json({
                                value: false,
                                comment: body
                            });
                        }
                    }
                });
            } else {
                res.json({
                    value: false,
                    comment: "Please provide parameters"
                });
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    //////////////////////////////////////////////
};
