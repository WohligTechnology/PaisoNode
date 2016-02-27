var http = require('http');
var moment = require('moment');
module.exports = {
    save: function (data, callback) {
        data.from = sails.ObjectID(data.from);
        if (data.to)
            data.to = sails.ObjectID(data.to);
        if (data.type === "redeem")
            data.vouchernumber = Math.floor(100000000 + Math.random() * 900000000000000);
        console.log(data);
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                if (!data._id) {
                    data.timestamp = new Date();
                    if (data.type === "redeem") {
                        data.validtill = new Date();
                        data.validtill.setMonth(data.validtill.getMonth() + 12);
                    }
                    // data.status = "pending";
                    data.passbook = "available";
                    data._id = sails.ObjectID();
                    db.collection('transaction').insert(data, function (err, created) {
                        if (err) {
                            console.log(err);
                            callback({
                                value: false,
                                comment: "Error"
                            });
                            db.close();
                        } else if (created) {
                            if (data.type == "redeem") {
                                data.validtill = moment(data.validtill).format("%20Do%20MMM,%20YYYY%20");
                                var template_name = "paiso";
                                var template_content = [{
                                    "name": "paiso",
                                    "content": "paiso"
         }]
                                var message = {
                                    "from_email": "info@paiso.in",
                                    "from_name": "PAiSO",
                                    "to": [{
                                        "email": data.email,
                                        "type": "to"
        }],
                                    "global_merge_vars": [{
                                        "name": "note",
                                        "content": "Hiiiii"
        }, {
                                        "name": "brand",
                                        "content": data.vendor
         }, {
                                        "name": "vouchernumber",
                                        "content": data.vouchernumber
         }, {
                                        "name": "amount",
                                        "content": data.amount
         }, {
                                        "name": "name",
                                        "content": data.name
         }, {
                                        "name": "referral",
                                        "content": data.mobile
         }, {
                                        "name": "banner",
                                        "content": "http://www.barcodes4.me/barcode/c128c/" + data.vouchernumber + ".png"
         }, {
                                        "name": "validtill",
                                        "content": data.validtill.split("%20").join(" ")
         }]
                                };
                                sails.mandrill_client.messages.sendTemplate({
                                    "template_name": template_name,
                                    "template_content": template_content,
                                    "message": message
                                }, function (result) {
                                    console.log(result);
                                    var m_names = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
                                    data.currentbalance = data.currentbalance.toFixed(2);
                                    data.timestamp = moment(data.timestamp).format("%20Do%20MMM,%20YYYY%20HH:mm%20a%20");
                                    Transaction.sendSMS(data, function (transrespo) {
                                        if (transrespo.value == true) {
                                            if (data.hasoffer) {
                                                Notification.notify(data, function (response) {
                                                        callback({
                                                            value: true,
                                                            comment: "everything done successfully"
                                                        });
                                                        db.close();
                                                });
                                            } else {
                                                callback({
                                                    value: true,
                                                    comment: "everything done successfully"
                                                });
                                                db.close();
                                            }
                                        }
                                    });

                                }, function (e) {
                                    callback('A mandrill error occurred: ' + e.name + ' - ' + e.message);
                                });
                            } else {
                                Transaction.sendSMS(data, function (transrespo) {
                                    if (transrespo.value == true) {
                                        callback({
                                            value: true,
                                            comment: "everything done successfully"
                                        });
                                        db.close();
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
                } else {
                    data.timestamp = new Date();

                    var transaction = sails.ObjectID(data._id);
                    delete data._id
                    db.collection('transaction').update({
                        _id: transaction
                    }, {
                        $set: data
                    }, function (err, updated) {
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
    sendSMS: function (data, callback) {
        console.log(data);
        if (data.type === "otp") {
          var pathurl = '/WebSMS/SMSAPI.jsp?username=Paiso&password=chirag123&sendername=PAISOO&mobileno=91' + data.mobile + '&message=Dear' + data.name + 'Welcome to Paiso, Your OTP is' + data.otp;
            var options = {
                host: 'bulksms.mysmsmantra.com',
                port: 8080,
                path: encodeURI(pathurl)
            };
            http.get(options, function (res) {
                callback({
                    value: true
                });
            }).on('error', function (e) {
                callback({
                    value: false
                });
            });
        } else if (data.type === "redeem") {
          var pathurl='/WebSMS/SMSAPI.jsp?username=Paiso&password=chirag123&sendername=PAISOO&mobileno=91' + data.mobile + '&message=Dear' + data.name + 'Voucher No' + data.vouchernumber + 'for Rs' + data.amount + 'spent on Brand' + data.vendorname + 'Time' + data.timestamp + 'Valid Till' + data.validtill + '(Current Balance' + data.currentbalance + ').';
            var options = {
                host: 'bulksms.mysmsmantra.com',
                port: 8080,
                path: encodeURI(pathurl)
            };
            http.get(options, function (res) {
                callback({
                    value: true
                });
            }).on('error', function (e) {
                callback({
                    value: false
                });
            });
        } else if (data.type === "balance") {
          var pathurl='/WebSMS/SMSAPI.jsp?username=Paiso&password=chirag123&sendername=PAISOO&mobileno=91' + data.mobile + '&message=Dear' + data.name + ',Rs' + (data.amount * (110 / 100)).toFixed(2) + 'have been added to your Paiso wallet.Your current balance is Rs' + data.currentbalance;
            var options = {
                host: 'bulksms.mysmsmantra.com',
                port: 8080,
                path: encodeURI(pathurl)
            };
            http.get(options, function (res) {
                callback({
                    value: true
                });
            }).on('error', function (e) {
                callback({
                    value: false
                });
            });
        } else if (data.type === "sendmoney") {
          var pathurl='/WebSMS/SMSAPI.jsp?username=Paiso&password=157699462&sendername=PAISOO&mobileno=91' + data.mobile + '&message=Your balance of Rs' + data.amount + 'Has been successfully transferred User' + data.name + 'No' + data.mobile;
            var options = {
                host: 'bulksms.mysmsmantra.com',
                port: 8080,
                path:encodeURI(pathurl)
            };
            http.get(options, function (res) {
                callback({
                    value: true
                });
            }).on('error', function (e) {
                callback({
                    value: false
                });
            });
        }else{
          callback({
            value:true
          })
        }
    },
    find: function (data, callback) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("transaction").find().toArray(function (err, found) {
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
    findlimited: function (data, callback) {
        var newreturns = {};
        newreturns.data = [];
        var checkFrom = new RegExp(data.from, "i");
        var checkTo = new RegExp(data.to, "i");
        var checkType = new RegExp(data.type, "i");
        var pagesize = parseInt(data.pagesize);
        var pagenumber = parseInt(data.pagenumber);
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                callbackfunc1();

                function callbackfunc1() {
                    db.collection("transaction").count({
                      $or:[{
                        from :{
                          '$regex':checkFrom
                        }
                      },{
                        to :{
                          '$regex':checkTo
                        }
                      },{
                        type :{
                          '$regex':checkType
                        }
                      }]
                    },function (err, number) {
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
                        db.collection("transaction").find({
                          $or:[{
                            from :{
                              '$regex':checkFrom
                            }
                          },{
                            to :{
                              '$regex':checkTo
                            }
                          },{
                            type :{
                              '$regex':checkType
                            }
                          }]
                        }).skip(pagesize * (pagenumber - 1)).limit(pagesize).toArray(function (err, found) {
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
    findByType: function (data, callback) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("transaction").find({
                    type: data.type
                }).toArray(function (err, data2) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                        db.close();
                    } else if (data2 && data2[0]) {
                        delete data2[0].password;
                        callback(data2);
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
    findByTypeUser: function (data, callback) {
        console.log(data);
        if (data.from && data.from != "") {
            data.from = sails.ObjectID(data.from);
        }
        if (data.to && data.to != "") {
            data.to = sails.ObjectID(data.to);
        }
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("transaction").find({
                    type: data.type,
                    $or: [{
                        from: data.from
                    }, {
                        to: data.to
                    }]
                }).toArray(function (err, data2) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                        db.close();
                    } else if (data2 && data2[0]) {
                        callback(data2);
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
    findPassbookEntry: function (data, callback) {
        console.log(data);
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("transaction").find({
                    type: data.type,
                    from: sails.ObjectID(data.from),
                    passbook: data.passbook
                }).sort({
                    timestamp: -1
                }).toArray(function (err, data2) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                        db.close();
                    } else if (data2 && data2[0]) {
                        delete data2[0].password;
                        callback(data2);
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
    findByTypeStatus: function (data, callback) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("transaction").find({
                    type: data.type,
                    status: data.status
                }).toArray(function (err, data2) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                        db.close();
                    } else if (data2 && data2[0]) {
                        delete data2[0].password;
                        callback(data2);
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
    findone: function (data, callback) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("transaction").find({
                    _id: sails.ObjectID(data._id)
                }).toArray(function (err, data2) {
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
    delete: function (data, callback) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            db.collection('transaction').remove({
                _id: sails.ObjectID(data._id)
            }, function (err, deleted) {
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
    sendmail: function (data, callback) {
        var template_name = "paiso";
        var template_content = [{
            "name": "paiso",
            "content": "paiso"
         }]
        var message = {
            "from_email": "gadarohan17@gmail.com",
            "from_name": "Rohan",
            "to": [{
                "email": data.email,
                "type": "to"
        }],
            "global_merge_vars": [{
                "name": "note",
                "content": "Hiiiii"
        }]
        };
        sails.mandrill_client.messages.sendTemplate({
            "template_name": template_name,
            "template_content": template_content,
            "message": message
        }, function (result) {
            callback({
                value: "true",
                comment: "Mail Sent"
            });
        }, function (e) {
            callback('A mandrill error occurred: ' + e.name + ' - ' + e.message);
        });
    }
};
