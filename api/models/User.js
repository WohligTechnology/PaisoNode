// var insertdata = {};
// var request = require('request');
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
                                value: "false"
                            });
                            console.log(err);
                            db.close();
                        } else if (found && found[0]) {
                            callback(found[0]);
                            db.close();
                        } else {
                            callback({
                                value: "false",
                                comment: "No data found"
                            });
                            db.close();
                        }
                    });
                }
                if (err) {
                    console.log(err);
                    callback({
                        value: "false"
                    });
                }
            });
        } else {
            callback({
                value: false
            });
        }
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
                            data._id = sails.ObjectID();
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
                                        id: data._id
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
                } else {
                    var user = sails.ObjectID(data._id);
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
    // findorcreate: function (data, callback) {
    //     var orfunc = {};
    //     var insertdata = {};
    //     var updatedata = {
    //         _id: data._id
    //     };
    //     if (data.provider == "Twitter") {
    //         updatedata.tweetid = data.id;
    //         updatedata.token = data.token;
    //         updatedata.tokenSecret = data.tokenSecret;

    //         insertdata.tweetid = data.id;
    //         insertdata.provider = data.provider;
    //         insertdata.username = data.username;
    //         insertdata.name = data.displayName;
    //         if (data.photos[0]) {
    //             insertdata.profilepic = data.photos[0].value;
    //         }
    //         insertdata.token = data.token;
    //         insertdata.tokenSecret = data.tokenSecret;
    //         orfunc.tweetid = data.id;
    //         dbcall(insertdata, updatedata);
    //     } else {
    //         updatedata.fbid = data.id;
    //         updatedata.accessToken = data.accessToken;
    //         updatedata.refreshToken = data.refreshToken;

    //         insertdata.fbid = data.id;
    //         insertdata.provider = data.provider;
    //         insertdata.username = data.username;
    //         insertdata.name = data.displayName;
    //         if (data.photos && data.photos[0]) {
    //             insertdata.profilepic = data.photos[0].value;
    //         }
    //         if (data.emails && data.emails[0]) {
    //             insertdata.email = data.emails[0].value;
    //         }
    //         insertdata.accessToken = data.accessToken;
    //         insertdata.refreshToken = data.refreshToken;
    //         orfunc.fbid = data.id;
    //         dbcall(insertdata, updatedata);
    //     }

    //     function dbcall(data, updatedata) {
    //         sails.query(function (err, db) {
    //             if (err) {
    //                 callback({
    //                     value: false
    //                 });
    //             }
    //             if (!updatedata._id) {
    //                 data._id = sails.ObjectID();
    //                 db.collection('user').find(orfunc).toArray(function (err, found) {
    //                     if (err) {
    //                         console.log(err);
    //                     }
    //                     if (found.length != 0 && found[0]) {
    //                         var data2 = found[0];
    //                         data2.id = found[0]._id;
    //                         delete data2.accessToken;
    //                         delete data2.token;
    //                         delete data2.tokenSecret;
    //                         delete data2.gallery;
    //                         delete data2.post;
    //                         callback(null, data2);
    //                     } else {

    //                         request.get({
    //                             url: "https://graph.facebook.com/oauth/access_token?client_id=1475701386072240&client_secret=6e46460c7bb3fb4f06182d89eb7514b9&grant_type=fb_exchange_token&fb_exchange_token=" + data.accessToken
    //                         }, function (err, httpResponse, body) {
    //                             var accesstoken = body.split("&");
    //                             accesstoken = accesstoken[0].split("=");
    //                             data.accessToken = accesstoken[1];
    //                             db.collection('user').insert(data, function (err, created) {
    //                                 if (err) {
    //                                     console.log(err);
    //                                     callback({
    //                                         value: false
    //                                     });
    //                                 }
    //                                 if (created) {
    //                                     data.id = created.ops[0]._id;
    //                                     delete data.accessToken;
    //                                     delete data.token;
    //                                     delete data.tokenSecret;
    //                                     callback(null, data);
    //                                 }
    //                             });

    //                         });
    //                     }
    //                 });
    //             } else {
    //                 var user = updatedata._id;
    //                 delete updatedata._id;

    //                 db.collection('user').update({
    //                     "_id": sails.ObjectID(user)
    //                 }, {
    //                     $set: updatedata
    //                 }, function (err, updated) {
    //                     if (err) {
    //                         console.log(err);
    //                         callback({
    //                             value: false
    //                         });
    //                     }
    //                     if (updatedata) {
    //                         updatedata.id = user;
    //                         delete updatedata.accessToken;
    //                         delete updatedata.token;
    //                         delete updatedata.tokenSecret;
    //                         callback(null, updated);
    //                     }
    //                 });
    //             }

    //         });
    //     }
    // },
};
