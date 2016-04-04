module.exports = {
    adminlogin: function(data, callback) {
        if (data.password) {
            data.password = sails.md5(data.password);
            sails.query(function(err, db) {
                if (db) {
                    db.collection('user').find({
                        email: data.email,
                        password: data.password,
                        accesslevel: "admin"
                    }, {
                        password: 0,
                        forgotpassword: 0
                    }).toArray(function(err, found) {
                        if (err) {
                            callback({
                                value: false
                            });
                            console.log(err);
                            db.close();
                        } else if (found && found[0]) {
                            callback(found[0]);
                            db.close();
                        } else {
                            callback({
                                value: false,
                                comment: "No data found"
                            });
                            db.close();
                        }
                    });
                }
                if (err) {
                    console.log(err);
                    callback({
                        value: false
                    });
                }
            });
        } else {
            callback({
                value: false
            });
        }
    },
    adminsave: function(data, callback) {
        if (data.password && data.password != "") {
            data.password = sails.md5(data.password);
        }
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("user").find({
                    email: data.email
                }).toArray(function(err, data2) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false,
                            comment: "Error"
                        });
                        db.close();
                    } else if (data2 && data2[0]) {
                        callback({
                            value: false,
                            comment: "User already exists"
                        });
                        db.close();
                    } else {
                        data._id = sails.ObjectID();
                        data.timestamp = new Date();
                        db.collection('user').insert(data, function(err, created) {
                            if (err) {
                                console.log(err);
                                callback({
                                    value: false,
                                    comment: "Error"
                                });
                                db.close();
                            } else if (created) {
                                callback({
                                    value: true,
                                    comment: "created"
                                });
                                db.close();
                            } else {
                                callback({
                                    value: false,
                                    comment: "Not created"
                                });
                                db.close();
                            }
                        });
                    }
                });
            }
        });
    },
    save: function(data, callback) {
        if (data.password && data.password != "") {
            data.password = sails.md5(data.password);
        }
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                if (!data._id) {
                    db.collection("user").find({
                        mobile: data.mobile
                    }).toArray(function(err, data2) {
                        if (err) {
                            console.log(err);
                            callback({
                                value: false,
                                comment: "Error"
                            });
                            db.close();
                        } else if (data2 && data2[0]) {
                            callback({
                                value: false,
                                comment: "User already exists"
                            });
                            db.close();
                        } else {
                            if (data.consumer_id && data.consumer_id != "") {
                                User.readMoney({
                                    consumer: data.consumer_id
                                }, function(readRespo) {
                                    if (readRespo.value != false) {
                                        data.balance = readRespo.comment.balance;
                                        callSave();
                                    } else {
                                        data.balance = 0;
                                        callSave();
                                    }
                                });
                            } else {
                                data.balance = 0;
                                callSave();
                            }

                            function callSave() {
                                data._id = sails.ObjectID();
                                data.timestamp = new Date();
                                data.walletLimit = 10000;
                                data.referral = [];
                                data.notification = [];
                                data.favorite = [];
                                data.card = []
                                db.collection('user').insert(data, function(err, created) {
                                    if (err) {
                                        console.log(err);
                                        callback({
                                            value: false,
                                            comment: "Error"
                                        });
                                        db.close();
                                    } else if (created) {
                                        delete data.password;
                                        if (!data.referrer) {
                                            callback({
                                                value: true,
                                                _id: data._id,
                                                user: data
                                            });
                                        } else {
                                            User.findUserByMobile({
                                                mobile: data.referrer
                                            }, function(response) {
                                                console.log(response);
                                                var referrerUser = response;
                                                if (referrerUser.referral) {
                                                    referrerUser.referral.push({
                                                        _id: data._id,
                                                        amountearned: 0
                                                    });
                                                    User.save(referrerUser, function(responseReferrer) {
                                                        if (responseReferrer.value == true) {
                                                            Notification.notify({
                                                                new: true,
                                                                type: "referral",
                                                                name: data.name,
                                                                deviceid: response.notificationtoken.deviceid,
                                                                os: response.notificationtoken.os,
                                                                user: response._id
                                                            }, function(sent) {

                                                            });
                                                            callback({
                                                                value: true,
                                                                _id: data._id,
                                                                user: data
                                                            });
                                                            db.close();
                                                        } else {
                                                            callback(responseReferrer);
                                                            db.close();
                                                        }
                                                    })
                                                }
                                            });
                                        }
                                    } else {
                                        callback({
                                            value: false,
                                            comment: "Not created"
                                        });
                                        db.close();
                                    }
                                });
                            }
                        }
                    });
                } else {
                    var user = sails.ObjectID(data._id);
                    if (data.timestamp) {
                        data.timestamp = new Date(data.timestamp);
                    }
                    delete data._id
                    db.collection('user').update({
                        _id: user
                    }, {
                        $set: data
                    }, function(err, updated) {
                        if (err) {
                            console.log(err);
                            callback({
                                value: false,
                                comment: "Error"
                            });
                            db.close();
                        } else if (updated.result.nModified != 0 && updated.result.n != 0) {
                            callback({
                                value: true
                            });
                            db.close();
                        } else if (updated.result.nModified == 0 && updated.result.n != 0) {
                            callback({
                                value: true,
                                comment: "Data already updated"
                            });
                            db.close();
                        } else {
                            callback({
                                value: false,
                                comment: "No data found"
                            });
                            db.close();
                        }
                    });
                }
            }
        });
    },
    find: function(data, callback) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("user").find().toArray(function(err, found) {
                    if (err) {
                        callback({
                            value: false
                        });
                        db.close();
                    } else if (found && found[0]) {
                        callback(found);
                        db.close();
                    } else {
                        callback({
                            value: false,
                            comment: "No data found"
                        });
                        db.close();
                    }
                });
            }
        });
    },
    //Findlimited
    findlimited: function(data, callback) {
        var newreturns = {};
        newreturns.data = [];
        var check = new RegExp(data.search, "i");
        var pagesize = parseInt(data.pagesize);
        var pagenumber = parseInt(data.pagenumber);
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                callbackfunc1();

                function callbackfunc1() {
                    db.collection("user").count({
                        mobile: {
                            '$regex': check
                        }
                    }, function(err, number) {
                        if (number && number != "") {
                            newreturns.total = number;
                            newreturns.totalpages = Math.ceil(number / data.pagesize);
                            callbackfunc();
                        } else if (err) {
                            console.log(err);
                            callback({
                                value: false
                            });
                            db.close();
                        } else {
                            callback({
                                value: false,
                                comment: "Count of null"
                            });
                            db.close();
                        }
                    });

                    function callbackfunc() {
                        db.collection("user").find({
                            mobile: {
                                '$regex': check
                            }
                        }).skip(pagesize * (pagenumber - 1)).limit(pagesize).toArray(function(err, found) {
                            if (err) {
                                callback({
                                    value: false
                                });
                                console.log(err);
                                db.close();
                            } else if (found && found[0]) {
                                newreturns.data = found;
                                callback(newreturns);
                                db.close();
                            } else {
                                callback({
                                    value: false,
                                    comment: "No data found"
                                });
                                db.close();
                            }
                        });
                    }
                }
            }
        });
    },
    login: function(data, callback) {
        data.password = sails.md5(data.password);
        sails.query(function(err, db) {
            db.collection('user').find({
                mobile: data.mobile,
                password: data.password
            }, {
                password: 0
            }).toArray(function(err, found) {
                if (err) {
                    callback({
                        value: false
                    });
                    console.log(err);
                    db.close();
                }
                if (found && found[0]) {
                    if (found[0].forgotpassword) {
                        db.collection('user').update({
                            mobile: data.mobile,
                            password: data.password
                        }, {
                            $set: {
                                forgotpassword: ""
                            }
                        }, function(err, updated) {
                            if (err) {
                                console.log(err);
                                db.close();
                            } else if (updated) {
                                db.close();
                            }
                        });
                    }
                    delete found[0].forgotpassword;
                    callback(found[0]);
                } else {
                    db.collection('user').find({
                        mobile: data.mobile,
                        forgotpassword: data.password
                    }, {
                        password: 0,
                        forgotpassword: 0
                    }).toArray(function(err, found) {
                        if (err) {
                            callback({
                                value: false
                            });
                            console.log(err);
                            db.close();
                        }
                        if (found && found[0]) {
                            sails.ObjectID(data._id);
                            db.collection('user').update({
                                mobile: data.mobile
                            }, {
                                $set: {
                                    forgotpassword: "",
                                    password: data.password
                                }
                            }, function(err, updated) {
                                if (err) {
                                    console.log(err);
                                    db.close();
                                } else if (updated) {
                                    db.close();
                                }
                            });
                            callback(found[0]);
                        } else {
                            callback({
                                value: false
                            });
                            db.close();
                        }
                    });
                }
            });
        });
    },
    changepassword: function(data, callback) {
        if (data.password && data.password != "" && data.editpassword && data.editpassword != "") {
            data.password = sails.md5(data.password);
            var user = sails.ObjectID(data._id);
            var newpass = sails.md5(data.editpassword);
            sails.query(function(err, db) {
                if (err) {
                    console.log(err);
                    callback({
                        value: false,
                        comment: "Error"
                    });
                } else if (db) {
                    db.collection('user').update({
                        "_id": user,
                        "password": data.password
                    }, {
                        $set: {
                            "password": newpass
                        }
                    }, function(err, updated) {
                        if (err) {
                            console.log(err);
                            callback({
                                value: false,
                                comment: "Error"
                            });
                            db.close();
                        } else if (updated.result.nModified == 1 && updated.result.n == 1) {
                            callback({
                                value: true
                            });
                            db.close();
                        } else if (updated.result.nModified != 1 && updated.result.n == 1) {
                            callback({
                                value: false,
                                comment: "Same password"
                            });
                            db.close();
                        } else {
                            callback({
                                value: false,
                                comment: "No data found"
                            });
                            db.close();
                        }
                    });
                }
            });
        } else {
            callback({
                value: false,
                comment: "Please provide all parameters"
            });
        }
    },
    forgotpassword: function(data, callback) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection('user').find({
                    mobile: data.mobile
                }).toArray(function(err, data2) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                        db.close();
                    } else if (data2 && data2[0]) {
                        var text = "";
                        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                        for (var i = 0; i < 8; i++) {
                            text += possible.charAt(Math.floor(Math.random() * possible.length));
                        }
                        var encrypttext = sails.md5(text);
                        var user = sails.ObjectID(data2[0]._id);
                        db.collection('user').update({
                            mobile: data.mobile
                        }, {
                            $set: {
                                forgotpassword: encrypttext
                            }
                        }, function(err, updated) {
                            if (err) {
                                console.log(err);
                                callback({
                                    value: false
                                });
                                db.close();
                            } else if (updated) {
                                var template_name = "newpassword";
                                var template_content = [{
                                    "name": "newpassword",
                                    "content": "newpassword"
                                }]
                                var message = {
                                    "from_email": "info@paiso.in",
                                    "from_name": "PAiSO",
                                    "to": [{
                                        "email": data2[0].email,
                                        "type": "to"
                                    }],
                                    "global_merge_vars": [{
                                        "name": "password",
                                        "content": text
                                    }]
                                };
                                sails.mandrill_client.messages.sendTemplate({
                                    "template_name": template_name,
                                    "template_content": template_content,
                                    "message": message
                                }, function(result) {
                                    callback({
                                        value: true,
                                        comment: "Mail Sent"
                                    });
                                    db.close();
                                }, function(e) {
                                    console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
                                });
                            } else {
                                callback({
                                    value: false
                                });
                                db.close();
                            }
                        });
                    } else {
                        callback({
                            value: false,
                            comment: "No data found"
                        });
                        db.close();
                    }
                });
            }
        });
    },
    moneySend: function(data, callback) {
        var sender = data.name;
        User.findUserByMobile({
            mobile: data.mobile
        }, function(resp) {
            if (resp.value == false) {
                callback(resp);
            } else {
                data.name = _.cloneDeep(resp.name);
                User.sendMoney(data, function(response) {
                    if (response.value == true) {
                        Transaction.save({
                            from: data.user,
                            to: resp._id,
                            type: "sendmoney",
                            amount: data.amount,
                            mobile: data.mobile,
                            name: resp.name
                        }, function(response2) {
                            Notification.notify({
                                deviceid: resp.notificationtoken.deviceid,
                                os: resp.notificationtoken.os,
                                type: "sendmoney",
                                name: sender,
                                amount: data.amount,
                                comment: data.message,
                                user: resp._id
                            }, function(response3) {});
                            callback(response);
                        })
                    } else {
                        callback(response);
                    }
                })
            }
        });
    },
    redeem: function(data, callback) {
        User.removeMoney(data, function(resp) {
            if (resp.value == true) {
                if (data.hasoffer == true) {
                    var cashback = (data.offerpercent * data.amount) / 100;
                    User.addMoney({
                        consumer: data.consumer,
                        amount: cashback
                    }, function(response) {
                        var balance = 0;
                        User.readMoney({
                            consumer: data.consumer
                        }, function(readBalance) {
                            balance = readBalance.comment.balance;
                            User.save({
                                _id: data.user,
                                balance: balance
                            }, function(resp) {

                                if (response.value == true) {
                                    Transaction.save({
                                        from: data.user,
                                        to: data.vendor,
                                        type: "redeem",
                                        currentbalance: balance,
                                        amount: data.amount,
                                        name: data.username,
                                        email: data.email,
                                        vendor: data.vendorname,
                                        mobile: data.mobile,
                                        deviceid: data.deviceid,
                                        os: data.os,
                                        user: data.user,
                                        hasoffer: data.hasoffer,
                                        cashback: cashback,
                                        consumer: data.consumer,
                                        offerpercent: data.offerpercent
                                    }, function(response1) {
                                        if (response1.value) {
                                            callback(resp);
                                        } else {
                                            callback(response1);
                                        }
                                    });
                                } else {
                                    callback(response);
                                }
                            });
                        })
                    });
                } else {
                    var balance = 0;
                    User.readMoney({
                        consumer: data.consumer
                    }, function(readBalance) {
                        balance = readBalance.comment.balance;
                        User.save({
                            _id: data.user,
                            balance: balance
                        }, function(resp) {
                            Transaction.save({
                                from: data.user,
                                to: data.vendor,
                                type: "redeem",
                                currentbalance: balance,
                                amount: data.amount,
                                name: data.username,
                                email: data.email,
                                vendor: data.vendorname,
                                mobile: data.mobile,
                                deviceid: data.deviceid,
                                os: data.os,
                                user: data.user,
                                consumer: data.consumer
                            }, function(response1) {
                                if (response1.value) {
                                    callback(resp);
                                } else {
                                    callback(response1);
                                }
                            });
                        });
                    });

                }
            } else {
                callback(resp);
            }
        });
    },
    logout: function(data, callback) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("user").find({
                    _id: sails.ObjectID(data._id)
                }).toArray(function(err, data2) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                        db.close();
                    } else if (data2 && data2[0]) {
                        delete data2[0].password;
                        data2[0].notificationtoken = {};
                        User.save(data2[0], function(resp) {
                            if (resp.value) {
                                callback({
                                    value: true,
                                    comment: "Removed notification token."
                                });
                            }
                        });
                        db.close();
                    } else {
                        callback({
                            value: false,
                            comment: "No data found"
                        });
                        db.close();
                    }
                });
            }
        });
    },
    //Findlimited
    findone: function(data, callback) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("user").find({
                    _id: sails.ObjectID(data._id)
                }).toArray(function(err, data2) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                        db.close();
                    } else if (data2 && data2[0]) {
                        delete data2[0].password;
                        callback(data2[0]);
                        db.close();
                    } else {
                        callback({
                            value: false,
                            comment: "No data found"
                        });
                        db.close();
                    }
                });
            }
        });
    },
    findUserByMobile: function(data, callback) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("user").find({
                    mobile: data.mobile
                }).toArray(function(err, data2) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                        db.close();
                    } else if (data2 && data2[0]) {
                        delete data2[0].password;
                        callback(data2[0]);
                        db.close();
                    } else {
                        callback({
                            value: false,
                            comment: "No data found"
                        });
                        db.close();
                    }
                });
            }
        });
    },
    validateMobile: function(data, callback) {
        data.otp = Math.floor(100000 + Math.random() * 900000);
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("user").find({
                    mobile: data.mobile
                }).toArray(function(err, data2) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                        db.close();
                    } else if (data2 && data2[0]) {
                        delete data2[0].password;
                        callback({
                            value: true
                        });
                        db.close();
                    } else {
                        data.type = "otp";
                        Transaction.sendSMS(data, function(transrespo) {
                            if (transrespo.value == true) {
                                callback({
                                    value: false,
                                    comment: "No data found",
                                    otp: data.otp
                                });
                                db.close();
                            }
                        });
                    }
                });
            }
        });
    },
    updateReferrer: function(data, callback) {
        if (data._id) {
            var myid = data._id;
        }
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("user").find({
                    mobile: data.mobile,
                    "referral._id": data._id
                }).toArray(function(err, data2) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                        db.close();
                    } else if (data2 && data2[0]) {
                        var recieverid = data2[0]._id;
                        delete data2[0].password;
                        var i = 0;
                        _.each(data2[0].referral, function(key) {
                            i++;
                            if (key._id === myid) key.amountearned += data.amount / 100;
                            if (i === data2[0].referral.length) {
                                data2[0].balance += data.amount / 100;
                                User.save(data2[0], function(userrespo) {
                                    if (userrespo.value == true) {
                                        var usernoti = {
                                            type: "referral",
                                            deviceid: data2[0].notificationtoken.deviceid,
                                            os: data2[0].notificationtoken.os,
                                            amount: data.amount / 100,
                                            name: data.lastreferral,
                                            user: recieverid
                                        };
                                        Notification.notify(usernoti, callback);
                                    } else {
                                        callback({
                                            value: false
                                        });
                                    }
                                });
                            }
                        });
                    } else {
                        callback({
                            value: false,
                            comment: "No data found"
                        });
                        db.close();
                    }
                });
            }
        });
    },
    delete: function(data, callback) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            db.collection('user').remove({
                _id: sails.ObjectID(data._id)
            }, function(err, deleted) {
                if (deleted) {
                    callback({
                        value: true
                    });
                    db.close();
                } else if (err) {
                    console.log(err);
                    callback({
                        value: false
                    });
                    db.close();
                } else {
                    callback({
                        value: false,
                        comment: "No data found"
                    });
                    db.close();
                }
            });
        });
    },
    deleteall: function(data, callback) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            db.collection('user').remove({}, function(err, deleted) {
                if (deleted) {
                    callback({
                        value: true
                    });
                    db.close();
                } else if (err) {
                    console.log(err);
                    callback({
                        value: false
                    });
                    db.close();
                } else {
                    callback({
                        value: false,
                        comment: "No data found"
                    });
                    db.close();
                }
            });
        });
    },
    countusers: function(data, callback) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("user").count({}, function(err, number) {
                    if (number != null) {
                        callback(number);
                        db.close();
                    } else if (err) {
                        callback({
                            value: false
                        });
                        db.close();
                    } else {
                        callback({
                            value: false,
                            comment: "No user found"
                        });
                        db.close();
                    }
                });
            }
        });
    },
    countusersOverTime: function(data, callback) {
        var day = new Date();
        day.setHours(day.getHours() - 24);
        var weekly = new Date();
        weekly.setDate(weekly.getDate() - 7);
        var monthly = new Date();
        monthly.setDate(monthly.getDate() - 30);
        var newusers = {};
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                async.parallel([
                    function(callback) {
                        db.collection("user").count({
                            timestamp: {
                                '$gt': day
                            }
                        }, function(err, number) {
                            if (number != null) {
                                newusers.daily = number;
                                callback(null, number);

                            } else if (err) {
                                console.log(err);
                                callback(err, null);

                            } else {
                                callback(null, null);

                            }
                        });
                    },
                    function(callback) {
                        db.collection("user").count({
                            timestamp: {
                                '$gt': monthly
                            }
                        }, function(err, number) {
                            if (number != null) {
                                newusers.monthly = number;
                                callback(null, number);
                            } else if (err) {
                                console.log(err);
                                callback(err, null);
                            } else {
                                callback(null, null);
                            }
                        });
                    },
                    function(callback) {
                        db.collection("user").count({
                            timestamp: {
                                '$gt': weekly
                            }
                        }, function(err, number) {
                            if (number != null) {
                                newusers.weekly = number;
                                callback(null, number);
                            } else if (err) {
                                console.log(err);
                                callback(err, null);
                            } else {
                                callback(null, null);
                            }
                        });
                    },
                    function(callback) {
                        db.collection("user").count(function(err, number) {
                            if (number != null) {
                                newusers.overall = number;
                                callback(null, number);
                            } else if (err) {
                                console.log(err);
                                callback(err, null);
                            } else {
                                callback(null, null);
                            }
                        });
                    }
                ], function(err, result) {
                    if (err) {
                        callback({
                            value: false
                        });
                        db.close();
                    } else if (result) {
                        callback({
                            value: true,
                            result: newusers
                        });
                        db.close();
                    } else {
                        callback({
                            value: false
                        });
                        db.close();
                    }
                });
            }
        });
    },
    countusersintime: function(data, callback) {
        data.timestamp = new Date(data.timestamp);
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("user").count({
                    timestamp: {
                        '$gt': data.timestamp
                    }
                }, function(err, number) {
                    if (number != null) {
                        callback(number);
                        db.close();
                    } else if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                        db.close();
                    } else {
                        callback({
                            value: false,
                            comment: "No user found"
                        });
                        db.close();
                    }
                });
            }
        });
    },
    //////////////////////////////////////////////SHMART
    //////////////////////////////////////////////SIGNUP
    register: function(data, callback) {
        if (data.referrer && data.referrer != "") {
            sails.request.post({
                url: sails.shmart + "customers/getConsumerID",
                json: {
                    mobile_no: data.referrer,
                },
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
                    if (body.status == "success") {
                        callme();
                    } else {
                        callback({
                            value: false,
                            comment: body
                        });
                    }
                }
            });
        } else {
            callme();
        }

        function callme() {
            sails.request.post({
                url: sails.shmart + "customers/create",
                json: {
                    mobileNo: data.mobile,
                    email: data.email,
                    name_of_customer: data.name
                },
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
                    if (body.status == "success") {
                        sails.request.post({
                            url: sails.shmart + "customers/generateotp",
                            json: {
                                consumer_id: body.consumer_id,
                            },
                            headers: {
                                'Authorization': 'Basic ' + sails.auth,
                                'Content-Type': 'application/json'
                            }
                        }, function(err, http, body2) {
                            if (err) {
                                console.log(err);
                                callback({
                                    value: false,
                                    comment: err
                                });
                            } else {
                                if (body2.status == "success") {
                                    body2.consumer_id = body.consumer_id;
                                    callback({
                                        value: true,
                                        comment: body2
                                    });
                                } else {
                                    callback({
                                        value: false,
                                        comment: body2
                                    });
                                }
                            }
                        });
                    } else {
                        callback({
                            value: false,
                            comment: body
                        });
                    }
                }
            });
        }
    },
    checkMob: function(data, callback) {
        sails.request.post({
            url: sails.shmart + "customers/getConsumerID",
            json: {
                mobile_no: data.mobile,
            },
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
                if (body.status == "success") {
                    callback({
                        value: true,
                        comment: body
                    });
                } else {
                    callback({
                        value: false,
                        comment: body
                    });
                }
            }
        });
    },
    validateOTP: function(data, callback) {
        sails.request.post({
            url: sails.shmart + "customers/activate",
            json: {
                consumer_id: data.consumer,
                otp: data.otp
            },
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
                if (body.status == "success") {
                    callback({
                        value: true,
                        comment: body
                    });
                } else {
                    callback({
                        value: false,
                        comment: body
                    });
                }
            }
        });
    },
    //////////////////////////////////////////////TRANSACTION
    saveCard: function(data, callback) {
        sails.request.get({
            url: "http://paiso-123.appspot.com/index2.php?user=" + data
        }, function(err, http, body) {
            if (err) {
                console.log(err);
                callback({
                    value: false,
                    comment: err
                });
            } else {
                callback(sails.shmart + "cards/create/merchant_id/" + sails.merchantID + "/data/" + body);
            }
        });
    },
    addToWallet: function(data, callback) {
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        data.request = "";
        for (var i = 0; i < 11; i++) {
            data.request += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        sails.request.post({
            url: sails.shmart + "funds/create_saved_card_payment",
            json: {
                consumer_id: data.consumer,
                amount: data.amount,
                email: data.email,
                response_url: data.url,
                merchant_refID: data.request,
                user_card_unique_token: data.token,
                cvv: data.cvv
            },
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
                if (body.status == "success") {
                    callback({
                        value: true,
                        comment: body
                    });
                } else {
                    callback({
                        value: false,
                        comment: body
                    });
                }
            }
        });
    },
    netBanking: function(data, callback) {
        console.log("////////////////////");
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        data.request = "";
        for (var i = 0; i < 11; i++) {
            data.request += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        var jsonreq = {
            email: data.email,
            mobileNo: data.mobile,
            total_amount: data.amount,
            merchant_refID: data.request,
            response_url: data.url,
            checksum_method: "md5",
            app_used: "IFRAME_CHECKOUT"
        };
        console.log(jsonreq);
        sails.request.post({
            url: sails.iframe,
            json: jsonreq,
            headers: {
                'Authorization': 'Basic ' + sails.auth,
                'Content-Type': 'application/json'
            }
        }, function(err, http, body) {
            console.log("/////////////////////////////////////");
            if (err) {
                console.log(err);
                callback({
                    value: false,
                    comment: err
                });
            } else {
                console.log(body);
                if (body.status == "success") {
                    body.payment_url = "pay.sandbox.shmart.in/pay_post/initiate/" + sails.merchantID + "/" + data.request + "?app_version=v2";
                    callback({
                        value: true,
                        comment: body
                    });
                } else {
                    callback({
                        value: false,
                        comment: body
                    });
                }
            }
        });
    },
    walletAdd: function(data, callback) {
        var paisomoney = 0;
        Variable.find(data,function(resp){
          if(resp.value != false){
            data.amount = data.amount + (((resp[0].value)/100)*data.amount);
            User.addMoney({
                consumer: data.consumer,
                amount: data.amount
            }, function(response1) {
                if (!data.referrer) {
                    Transaction.save({
                        from: data.user,
                        from_name: data.name,
                        to_name: data.name,
                        to: data.user,
                        type: "balance",
                        amount: data.amount,
                        extra: paisomoney,
                        mobile: data.mobile
                    }, function(response4) {
                        User.readMoney({
                            consumer: data.consumer
                        }, function(readBalance) {
                            User.save({
                                _id: data.user,
                                balance: readBalance.comment.balance
                            }, function(resp) {
                                callback(response1);
                            });
                        });
                    })
                } else {
                    User.findUserByMobile({
                        mobile: data.referrer
                    }, function(response2) {
                        var extra = data.amount / 100;
                        if (response2.value == false) {
                            callback(response2);
                        } else {
                            response2.referral = _.map(response2.referral, function(key) {
                                if (key._id == data.user) {
                                    key.amountearned = key.amountearned + extra;
                                }
                                return key;
                            });
                            var request = {
                                consumer: response2.consumer_id,
                                amount: extra
                            };
                            User.addMoney(request, function(response3) {
                                if (response3.value == true) {
                                    Transaction.save({
                                        from: data.user,
                                        from_name: data.name,
                                        to_name: data.name,
                                        to: data.user,
                                        type: "balance",
                                        amount: data.amount,
                                        extra: paisomoney,
                                        mobile: data.mobile
                                    }, function(respo) {
                                        Transaction.save({
                                            from: data.user,
                                            from_name: data.name,
                                            to_name: response2.name,
                                            to: response2._id,
                                            type: "referralbalance",
                                            mobile: data.mobile,
                                            extra: extra
                                        }, function(response4) {
                                            Notification.notify({
                                                name: data.name,
                                                amount: extra,
                                                deviceid: response2.notificationtoken.deviceid,
                                                os: response2.notificationtoken.os,
                                                type: "referral",
                                                new: false,
                                                user: response2._id
                                            }, function(resp) {
                                                console.log(resp);
                                            });
                                            User.readMoney({
                                                consumer: response2.consumer
                                            }, function(readBalance) {
                                                response2.balance = readBalance.comment.balance;
                                                User.save({
                                                    _id: response2.user,
                                                    balance: response2.balance
                                                }, function(resp) {
                                                    User.readMoney({
                                                        consumer: data.consumer
                                                    }, function(readBalance) {
                                                        User.save({
                                                            _id: data.user,
                                                            balance: readBalance.comment.balance
                                                        }, function(resp) {
                                                            callback(response3);
                                                        });
                                                    })
                                                });
                                            })
                                        })
                                    });
                                } else {
                                    callback(response3);
                                }
                            })
                        }
                    })
                }
            })
          }else{
            callback({
              value :false,
              comment : "Variable not found"
            });
          }
        })

    },
    // readMoney: function(data, callback) {
    //     sails.request.get({
    //         url: sails.shmart + "balances/general/consumer_id/" + data.consumer,
    //         headers: {
    //             'Authorization': 'Basic ' + sails.auth,
    //             'Content-Type': 'application/json'
    //         }
    //     }, function(err, http, body) {
    //         if (err) {
    //             console.log(err);
    //             callback({
    //                 value: false,
    //                 comment: err
    //             });
    //         } else {
    //             body = JSON.parse(body);
    //             if (body.status == "success") {
    //                 User.readMoneyV(data, function(respo) {
    //                     if (respo.value != false) {
    //                         body.balance = parseFloat(body.balance) + parseFloat(respo.comment.balance);
    //                         callback({
    //                             value: true,
    //                             comment: body
    //                         });
    //                     } else {
    //                         callback({
    //                             value: true,
    //                             comment: body
    //                         });
    //                     }
    //                 });
    //             } else {
    //                 callback({
    //                     value: false,
    //                     comment: body
    //                 });
    //             }
    //         }
    //     });
    // },
    readMoney: function(data, callback) {
        sails.request.get({
            url: sails.shmart + "balances/voucher/consumer_id/" + data.consumer,
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
                body = JSON.parse(body);
                if (body.status == "success") {
                    callback({
                        value: true,
                        comment: body
                    });
                } else {
                    callback({
                        value: false,
                        comment: body
                    });
                }
            }
        });
    },
    addMoney: function(data, callback) {
        sails.request.post({
            url: sails.shmart + "vouchers/create",
            json: {
                amount: data.amount,
                consumer_id: data.consumer,
                expiry_date: "20990101000000"
            },
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
                if (body.status == "success") {
                    callback({
                        value: true,
                        comment: body
                    });
                } else {
                    callback({
                        value: false,
                        comment: body
                    });
                }
            }
        });
    },
    removeMoney: function(data, callback) {
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        data.ref = "";
        for (var i = 0; i < 9; i++) {
            data.ref += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        sails.request.post({
            url: sails.shmart + "debits/general",
            json: {
                consumer_id: data.consumer,
                mobileNo: data.mobile,
                total_amount: data.amount,
                email: data.email,
                merchant_refID: data.ref,
                otp: data.otp,
            },
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
                if (body.status == "Success") {
                    callback({
                        value: true,
                        comment: body
                    });
                } else {
                    callback({
                        value: false,
                        comment: body
                    });
                }
            }
        });
    },
    sendMoney: function(data, callback) {
        sails.request.post({
            url: sails.shmart + "wallet_transfers/",
            json: {
                consumer_id: data.consumer,
                friend_mobileNo: data.mobile,
                friend_email: data.email,
                amount: data.amount,
                message: data.message,
                friend_name: data.name
            },
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
                if (body.status == "success") {
                    callback({
                        value: true,
                        comment: body
                    });
                } else {
                    callback({
                        value: false,
                        comment: body
                    });
                }
            }
        });
    },
    generateOtpForDebit: function(data, callback) {
        sails.request.post({
            url: sails.shmart + "customers/generateotp",
            json: {
                consumer_id: data.consumer,
            },
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
                if (body.status == "success") {
                    callback({
                        value: true,
                        comment: body
                    });
                } else {
                    callback({
                        value: false,
                        comment: body
                    });
                }
            }
        });
    },
};
