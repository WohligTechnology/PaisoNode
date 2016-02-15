      var gcm = require('node-gcm');
      var apn = require('apn');
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
                                      notification: data
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
                              var attribute = "notification.$.";
                              _.forIn(data, function (value, key) {
                                  tobechanged[attribute + key] = value;
                              });
                              db.collection("user").update({
                                  "_id": user,
                                  "notification._id": data._id
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
                                  "notification": {
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
                          "notification.os": {
                              $exists: true
                          },
                          "notification.os": {
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
                              $unwind: "$notification"
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
                                  $unwind: "$notification"
                        }, {
                                  $match: matchobj
                        }, {
                                  $project: {
                                      notification: 1
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
                              "notification._id": sails.ObjectID(data._id)
                          }, {
                              "notification.$": 1
                          }).toArray(function (err, data2) {
                              if (data2 && data2[0] && data2[0].notification && data2[0].notification[0]) {
                                  callback(data2[0].notification[0]);
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
          notify: function (data, callback) {
            
              console.log(data);
              data.timestamp = new Date();
              var message = new gcm.Message();
              data.title = "";
              data.body = "";
              data.read = false;
              data.link = "";
              if (data.type === "referral") {
                  data.link = "app.referral";
                  if (data.new) {
                      data.title = 'New Referral';
                      data.body = data.name + ' signed up on PAiSO with your referral ID. Keep sharing to get more and more balance';

                  } else {
                      data.title = 'Balance Added';
                      data.body = data.name + ' credited amount Rs.' + data.amount + ' on referral to your wallet.';
                  }
              }
              if (data.type === "sendmoney") {
                  data.link = "app.wallet";
                  data.title = data.name + ' sent you balance.';
                  if (data.comment === undefined || data.comment === null || data.comment === "")
                      data.body = 'Rs. ' + data.amount + ' added to your wallet.';
                  else
                      data.body = 'Rs. ' + data.amount + ' have been added to your wallet.\n "' + data.comment + '."';
              }
              if (data.type === "redeem") {
                  console.log("has offer");
                  if (data.hasoffer) {
                      data.link = "app.wallet"
                      data.title = 'Balance Added on cashback',
                          data.body = 'Rs. ' + data.cashback + ' have been added to your wallet as cashback from ' + data.vendor;
                      delete data._id;
                  }
              }
              if (data.type === "broadcast") {
                  data.title = data.Btitle;
                  data.body = data.Bbody;
              }
              var options = {
                  "cert": "certs/cert.pem",
                  "key": "certs/key.pem",
                  "passphrase": null,
                  "gateway": "gateway.sandbox.push.apple.com",
                  "port": 2195,
                  "enhanced": true,
                  "cacheLength": 5
              };
              var apnConnection = new apn.Connection(options);
              if (data.os === "ios") {
                  var myDevice = new apn.Device(data.deviceid);
              }
              var note = new apn.Notification();
              note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
              note.badge = 3;
              note.sound = "ping.aiff";
              note.alert = data.title + " " + data.body;
              note.payload = {
                  'messageFrom': 'PAiSO'
              };
              message.addNotification('title', data.title);
              message.addNotification('body', data.body);
              var regTokens = [];
              regTokens.push(data.deviceid);
              var sender = new gcm.Sender('AIzaSyAEPTeKE18yipwH2k8Lx-Zr06UoBF95lbU');
              Notification.save(data, function (res) {
                  console.log("is getting saved");
                  console.log(res);
                  if (res.value) {
                      if (data.hasoffer) {
                          callback({
                              value: true,
                              comment: "no push. notification saved."
                          });
                      } else {
                          if (data.os === "ios") {
                              apnConnection.pushNotification(note, myDevice);
                              callback({
                                  value: true,
                                  comment: "ios"
                              });
                          } else if (data.os === "android")
                              console.log(sender);
                          console.log(message);
                          sender.send(message, {
                              registrationTokens: regTokens
                          }, function (err, response) {
                              if (err) {
                                  console.log(err);
                                  callback({
                                      value: false
                                  });
                              } else {
                                  console.log(response)
                                  callback({
                                      value: true,
                                      comment: response,
                                      data: data
                                  });
                              }
                          });
                      }
                  }
              });
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
                                  "notification.os": {
                                      $exists: true
                                  }
                              }
                    }, {
                              $unwind: "$notification"
                    }, {
                              $match: {
                                  "notification.os": {
                                      $exists: true
                                  }
                              }
                    }, {
                              $project: {
                                  notification: 1
                              }
                    }]).toArray(function (err, data2) {
                              if (data2 && data2[0] && data2[0].notification && data2[0].notification[0]) {
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
          },
          broadcast: function (data, callback) {
              var i = 0;
              var k=0;
              User.find(data, function (resp) {
                  if (resp.value != false) {
                      var length = resp.length;
                      _.each(resp, function (key) {

                          if (key.notificationtoken != undefined) {
                              k++;
                              var notifydata = {
                                  deviceid: key.notificationtoken.deviceid,
                                  os: key.notificationtoken.os,
                                  user: key._id,
                                  Btitle: data.title,
                                  Bbody: data.body,
                                  type: "broadcast"
                              };
                              Notification.notify(notifydata, function (notifyrespo) {
                                  i++;
                                  if (i == k) {
                                      callback({
                                          value: true,
                                          comment: "broadcasted"
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
                  }
              });
          }
      };
