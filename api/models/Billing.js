module.exports = {
    save: function (data, callback) {
        if (data.user && data.user != "") {
            sails.query(function (err, db) {
                if (err) {
                    console.log(err);
                    callback({
                        value: false
                    });
                }
                if (db) {
                    var user = sails.ObjectID(data.user);
                    delete data.user;
                    if (!data._id) {
                        data._id = sails.ObjectID();
                        db.collection("user").update({
                            _id: user
                        }, {
                            $push: {
                                billing: data
                            }
                        }, function (err, updated) {
                            if (err) {
                                console.log(err);
                                callback({
                                    value: false
                                });
                                db.close();
                            } else if (updated) {
                                callback({
                                    value: true
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
                    } else {
                        data._id = sails.ObjectID(data._id);
                        var tobechanged = {};
                        var attribute = "billing.$.";
                        _.forIn(data, function (value, key) {
                            tobechanged[attribute + key] = value;
                        });
                        db.collection("user").update({
                            "_id": user,
                            "billing._id": data._id
                        }, {
                            $set: tobechanged
                        }, function (err, updated) {
                            if (err) {
                                console.log(err);
                                callback({
                                    value: false
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
        } else {
            callback({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    delete: function (data, callback) {
        if (data.user && data.user != "") {
            var user = sails.ObjectID(data.user);
            delete data.user;
            data._id = sails.ObjectID(data._id);
            sails.query(function (err, db) {
                if (err) {
                    console.log(err);
                    callback({
                        value: false
                    });
                }
                if (db) {
                    db.collection("user").update({
                        _id: user
                    }, {
                        $pull: {
                            "billing": {
                                "_id": sails.ObjectID(data._id)
                            }
                        }
                    }, function (err, updated) {
                        if (err) {
                            console.log(err);
                            callback({
                                value: false
                            });
                            db.close();
                        } else if (updated) {
                            callback({
                                value: true
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
                comment: "Please provide parameters"
            });
        }
    },
    //Findlimited
    findlimited: function (data, callback) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                var newreturns = {};
                var check = new RegExp(data.search, "i");
                var pagesize = data.pagesize;
                var pagenumber = data.pagenumber;
                var user = sails.ObjectID(data.user);
                var matchobj = {
                    "billing.paymentmethod": {
                        $exists: true
                    },
                    "billing.paymentmethod": {
                        $regex: check
                    }
                };
                callbackfunc1();

                function callbackfunc1() {
                    db.collection("user").aggregate([{
                        $match: {
                            _id: user
                        }
                    }, {
                        $unwind: "$billing"
                    }, {
                        $match: matchobj
                    }, {
                        $group: {
                            _id: user,
                            count: {
                                $sum: 1
                            }
                        }
                    }, {
                        $project: {
                            count: 1
                        }
                    }]).toArray(function (err, result) {
                        if (result && result[0]) {
                            newreturns.total = result[0].count;
                            newreturns.totalpages = Math.ceil(result[0].count / data.pagesize);
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
                        db.collection("user").aggregate([{
                            $match: {
                                _id: user
                            }
                        }, {
                            $unwind: "$billing"
                        }, {
                            $match: matchobj
                        }, {
                            $project: {
                                billing: 1
                            }
                        }]).skip(pagesize * (pagenumber - 1)).limit(pagesize).toArray(function (err, found) {
                            if (found && found[0]) {
                                newreturns.data = found;
                                callback(newreturns);
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
                    }
                }
            }
        });
    },
    //Findlimited
    findone: function (data, callback) {
        if (data.user && data.user != "") {
            var user = sails.ObjectID(data.user);
            sails.query(function (err, db) {
                if (err) {
                    console.log(err);
                    callback({
                        value: false
                    });
                }
                if (db) {
                    db.collection("user").find({
                        _id: user,
                        "billing._id": sails.ObjectID(data._id)
                    }, {
                        "billing.$": 1
                    }).toArray(function (err, data2) {
                        if (data2 && data2[0] && data2[0].billing && data2[0].billing[0]) {
                            callback(data2[0].billing[0]);
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
                }
            });
        } else {
            callback({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    find: function (data, callback) {
        if (data.user && data.user != "") {
            var user = sails.ObjectID(data.user);
            sails.query(function (err, db) {
                if (err) {
                    console.log(err);
                    callback({
                        value: false
                    });
                }
                if (db) {
                    db.collection("user").aggregate([{
                        $match: {
                            _id: user,
                            "billing.paymentmethod": {
                                $exists: true
                            }
                        }
                    }, {
                        $unwind: "$billing"
                    }, {
                        $match: {
                            "billing.paymentmethod": {
                                $exists: true
                            }
                        }
                    }, {
                        $project: {
                            billing: 1
                        }
                    }]).toArray(function (err, data2) {
                        if (data2 && data2[0] && data2[0].billing && data2[0].billing[0]) {
                            callback(data2);
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
                }
            });
        } else {
            callback({
                value: false,
                comment: "Please provide parameters"
            });
        }
    }
};