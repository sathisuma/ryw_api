var moment = require('moment');

var sqldb = require('../../config/dbconnect');
var dbutil = require(appRoot + '/utils/dbutils');
var appmdl = require('../models/delivery_mainModel');
const request = require('request');
var fs = require('fs');

process.env.SECRET_KEY = "thisismysecretkey";



//// delivery_boy////
exports.logincheckCtrl = function (req, res) {
    var data = req.body;
  
    // Validate input: Check if both number and password are provided
    if (!data.number || !data.password) {
        res.send({ "status": 500, "msg": "Mobile number and password are required" });
        return;
    }
    appmdl.logincheckmdl(data, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }

        // Check if any results are returned (i.e., valid credentials)
        if (results.length > 0) {
            res.send({ "status": 200, "data": results });
        } else {
            res.send({ "status": 500, "msg": "Invalid credentials" });
        }
    });
};

exports.getcurrentordersCtrl = function (req, res) {
    var data = req.body;

    appmdl.getcurrentordersmdl(data, function (err, results) {
        if (err) {
            
            return res.status(err.status || 500).send({ status: 500, msg: err.msg || "Internal Server Error" });
        }
        res.status(200).send(results);
    });
};



exports.getnewcurrentordersCtrl = function (req, res) {
    var data=req.body;
   
    appmdl.getnewcurrentordersmdl(data, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.getorderdetailsCtrl = function (req, res) {
    var data=req.body
    appmdl.getorderdetailsCtrlMdl(data, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}


exports.updateorderstatusCtrl = function (req, res) {
    var data=req.body
    appmdl.updateorderstatusmdl(data, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.checkdeliveryacceptstatusCtrl = function (req, res) {
    var data=req.body
    appmdl.checkdeliveryacceptstatusmdl(data, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.updatedeliverylatlngCtrl = function (req, res) {
    var data=req.body
    appmdl.updatedeliverylatlngmdl(data, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}
exports.updatedeliveryotpCtrl = function (req, res) {
    var data=req.body
    appmdl.updatedeliveryotpmdl(data, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}
exports.completedorderCtrl = function (req, res) {
    var data=req.body
     var image_url = data.imagesData
    if (image_url && image_url !== '') {
        var array = image_url.split(',');
        var base64Data = array[1];
        var datetimestamp = Date.now();
        var random_number = Math.floor(100000 + Math.random() * 900000);
        var unicnumber = random_number + '' + datetimestamp;
         var filetypeMatch = image_url.match(/^data:image\/(.*);base64,/);
    // var filetype = filetypeMatch ? filetypeMatch[1] : 'jpeg';
     var filetype = 'jpeg';
        fs.writeFile("../public_html/control.freshozapcart.com/uploaded_images/orders/" + unicnumber + "." + filetype, base64Data, 'base64', function (err) { });
        imageupload = "https://control.freshozapcart.com/uploaded_images/orders/" + unicnumber + '.' + filetype;
    }
    else {
        var imageupload = ' '
    }
     appmdl.completedordermdl(data, imageupload, function (err, results) {
        if (results) {
            // console.log("results", results);
            res.send({ 'status': 200, 'data': results });
            const updatedOrder = results;
            appmdl.deliveryboypayments(req.body, function (err, resulta) {
                if (resulta) {
                    // console.log("resulta", resulta);

                    appmdl.getdeliveryboyincentivesamount(req.body, function (err, resultb) {
                        if (resultb) {
                            // console.log("resultb", resultb);
                            appmdl.getincentivesdata(req.body, function (err, resultc) {
                                if (err) {
                                    res.send({ "status": 500, "msg": err });
                                    return;
                                }
                                // console.log("resultc", resultc);

                                resultc.sort((a, b) => a.order_count - b.order_count);
                                const updatedResults = resultb.map(item => {
                                    const orderCount = item.total_orders_per_day;
                                    let applicableSlab = resultc[0];
                                    for (let i = 0; i < resultc.length; i++) {
                                        if (orderCount < resultc[i].order_count) {
                                            break;
                                        }
                                        applicableSlab = resultc[i];
                                    }
                                    const each_order_earn = parseFloat(applicableSlab.each_order_earn);
                                    const total_incentive = orderCount * each_order_earn;
                                    return {
                                        ...item,
                                        each_order_earn,
                                        total_incentive
                                    };
                                });
                                // console.log("updatedResults", updatedResults);
                                const totalIncentiveSum = updatedResults.reduce((acc, curr) => acc + curr.total_incentive, 0);
                                const codAmount = resulta && resulta.data && resulta.data.length > 0 ? parseFloat(resulta.data[0].cod_amount) : 0;
                                const netAmount = totalIncentiveSum - codAmount;
                                // console.log("totalIncentiveSum", totalIncentiveSum, "codAmount", codAmount, "netAmount", netAmount);
                                if (!isNaN(netAmount)) {
                                    appmdl.updatedeliveryboywalletamount(netAmount,updatedOrder, req.body, function (err, resulta) {
                                        if (err) {
                                            res.send({ "status": 500, "msg": err });
                                            return;
                                        }
                                    });
                                } else {
                                    res.send({ 'status': 500 });
                                }                                
                            });
                        } else {
                            res.send({ 'status': 500 });
                        }
                    });
                } else {
                    res.send({ 'status': 500 });
                }
            });
        } else {
            res.send({ 'status': 500 });
        }
    });
}

exports.getprofiledataCtrl = function (req, res) {
    var data=req.body

    appmdl.getprofiledataCtrlmdl(data, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.updateprofiledataCtrl = function (req, res) {
   var data=req.body
   console.log(data)
    var image_url = data.imagesData
    var imageupload = '';
    console.log("Called")
    if (image_url && image_url.startsWith("data:image/")) {
        var array = image_url.split(',');
        var base64Data = array[1];
        var datetimestamp = Date.now();
        var random_number = Math.floor(100000 + Math.random() * 900000);
        var unicnumber = random_number + '' + datetimestamp;
         var filetypeMatch = image_url.match(/^data:image\/(.*);base64,/);
    // var filetype = filetypeMatch ? filetypeMatch[1] : 'jpeg';
     var filetype = 'jpeg';
        fs.writeFile("../public_html/control.freshozapcart.com/uploaded_images/registration/" + unicnumber + "." + filetype, base64Data, 'base64', function (err) { });
        imageupload = "https://control.freshozapcart.com/uploaded_images/registration/" + unicnumber + '.' + filetype;
    }
    else {
            console.log("Called11")

        var imageupload = data.profile_image
    }
    appmdl.updateprofiledatamdl(data, imageupload, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.updateoderstatdataCtrl = function (req, res) {
    var data=req.body
    var image_url = data.imagesData
    if (image_url && image_url !== '') {
        var array = image_url.split(',');
        var base64Data = array[1];
        var datetimestamp = Date.now();
        var random_number = Math.floor(100000 + Math.random() * 900000);
        var unicnumber = random_number + '' + datetimestamp;
         var filetypeMatch = image_url.match(/^data:image\/(.*);base64,/);
    // var filetype = filetypeMatch ? filetypeMatch[1] : 'jpeg';
     var filetype = 'jpeg';
        fs.writeFile("../public_html/control.freshozapcart.com/uploaded_images/orders/" + unicnumber + "." + filetype, base64Data, 'base64', function (err) { });
        imageupload = "https://control.freshozapcart.com/uploaded_images/orders/" + unicnumber + '.' + filetype;
    }
    else {
        var imageupload = ' '
    }
    appmdl.updateoderstatdatamdl(data,imageupload, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}
exports.updatelatlongsdataCtrl = function (req, res) {
    var data=req.body
    appmdl.updatelatlongsdatamdl(data, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.getordersdatewiseCtrl = function (req, res) {
    var data=req.body
    appmdl.getordersdatewisemdl(data, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.updateplayeridCtrl = function (req, res) {
    var data=req.body
    appmdl.updateplayeridmdl(data, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.getordercounts = function (req, res) {
    appmdl.getordercounts(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.getordercountsdetails = function (req, res) {
    appmdl.getordercountsdetails(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}





exports.deliveryboypayments = function (req, res) {
    var data=req.body
    appmdl.deliveryboypayments(data, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.getdeliveryboyincentivesamount = function (req, res) {
    appmdl.getdeliveryboyincentivesamount(req.body, function (err, results) {
        // console.log(22, results);
        if (results) {
            appmdl.getincentivesdata(req.body, function (err, resulta) {
                // console.log(21, resulta);

                if (err) {
                    res.send({ "status": 500, "msg": err });
                    return;
                }

                resulta.sort((a, b) => a.order_count - b.order_count);
                const updatedResults = results.map(item => {
                    const orderCount = item.total_orders_per_day;

                    let applicableSlab = resulta[0];
                    for (let i = 0; i < resulta.length; i++) {
                        if (orderCount < resulta[i].order_count) {
                            break;
                        }
                        applicableSlab = resulta[i];
                    }

                    const each_order_earn = parseFloat(applicableSlab.each_order_earn);
                    const total_incentive = orderCount * each_order_earn;

                    return {
                        ...item,
                        each_order_earn,
                        total_incentive
                    };

                });
                res.send({ 'status': 200, 'data': updatedResults });
                // console.log(11,updatedResults);
            });
        } else {
            res.send({ 'status': 500 });
        }
    });
}

exports.deliveryboypaymentreports = function (req, res) {
    var data=req.body
    appmdl.deliveryboypaymentreports(data, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.getdelboypaymentincentiveshistory = function (req, res) {
    appmdl.getdelboypaymentincentiveshistory(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.postplayer_idctrl = function (req, res) {
    var dataarr = req.body;  
     
    appmdl.checkpublic_playeridMdl(dataarr, function (err, checkresults) {
        
        if(checkresults.length==0) {
            dataarr.location_id = dataarr.location_id || 0;
            
            appmdl.postplayer_idmdl(dataarr, function (err, results) {
                res.send({ 'status': 200, 'data': results });
            })
        } else {
            res.send({ 'status': 200, 'data': dataarr });

            appmdl.insertcustomerplayerid(dataarr, function (err, playerids) {

            })
        }
        
    })
}


exports.deliveryboyactivestatus = function (req, res) {
    appmdl.deliveryboyactivestatus(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}








