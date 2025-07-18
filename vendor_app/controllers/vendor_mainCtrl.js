var moment = require('moment');

var sqldb = require('../../config/dbconnect');
var dbutil = require(appRoot + '/utils/dbutils');
var appmdl = require('../models/vendor_mainModel');
const request = require('request');
const axios = require('axios');
var fs = require('fs');

var unirest = require('unirest'); //for whtsapp 

process.env.SECRET_KEY = "thisismysecretkey";



// // vendor strat//

// exports.submitvendorloginCtrl = function (req, res) {
//     appmdl.submitvendorloginmdl(req.body, function (err, results) {
//         if (err) {
//             res.send({ "status": 500, "msg": err });
//             return;
//         }
//         res.send({ 'status': 200, 'data': results });
//     });
// }

// exports.getcurrentordersCtrl = function (req, res) {

//     appmdl.getcurrentordersmdl(req.body, function (err, results) {
//         if (err) {
//             res.send({ "status": 500, "msg": err });
//             return;
//         }
//         res.send({ 'status': 200, 'data': results });
//     });
// }

// exports.newgetorderdetailsCtrl = function (req, res) {
//     appmdl.newgetorderdetailsmdl(req.body, function (err, results) {
//         if (err) {
//             res.send({ "status": 500, "msg": err });
//             return;
//         }
//         res.send({ 'status': 200, 'data': results });
//     });
// }
// exports.updateorderstatusCtrl = function (req, res) {
//     var dataarr = req.body;
//     appmdl.updateorderstatusmdl(req.body, function (err, results) {
//         if (err) {
//             console.log(err);
            
//             res.send({ "status": 500, "msg": err });
//             return;
//         }
//         res.send({ 'status': 200, 'data': results });
        
//         appmdl.getdeliveryplayeridsMdl(dataarr, async function (err, delivery_results) {
//             if (err) {
//                 console.error("Database error:", err);
//                 res.status(500).send({ message: "Database error", error: err });
//                 return;
//             }
        
//             // Extract player_id from each RowDataPacket
//             const delivery_boy_tokes = delivery_results.map(row => row.player_id);
//             console.log(delivery_boy_tokes);
//             try {
//                 const payload = {
//                     title: "New Order",
//                     body: "You have received a new order.",
//                     token: delivery_boy_tokes,  // dynamically set from DB
//                     sound: "custom_sound"
//                 };
        
        
//                 const response = await axios.post(
//                     "http://ec2-13-126-76-184.ap-south-1.compute.amazonaws.com:9632/notifications/v1/sendNotification",
//                     payload
//                 );
//             } catch (error) {
            
//             }
//         });
        
//     });
// }
// exports.getdashboardordersCtrl = function (req, res) {
//     appmdl.getdashboardordersmdl(req.body, function (err, results) {
//         if (err) {
//             res.send({ "status": 500, "msg": err });
//             return;
//         }
//         res.send({ 'status': 200, 'data': results });
//     });
// }
// exports.getshoplistCtrl = function (req, res) {
//     appmdl.getshoplistmdl(req.body, function (err, results) {
//         if (err) {
//             res.send({ "status": 500, "msg": err });
//             return;
//         }
//         res.send({ 'status': 200, 'data': results });
//     });
// }



// exports.getbillinginformationCtrl = function (req, res) {
//     appmdl.getbillinginformationmdl(req.body, function (err, results) {
//         if (err) {
//             res.send({ "status": 500, "msg": err });
//             return;
//         }
//         res.send({ 'status': 200, 'data': results });
//     });
// }

// exports.updateshopstatusCtrl = function (req, res) {
//     appmdl.updateshopstatusmdl(req.body, function (err, results) {
//         if (err) {
//             res.send({ "status": 500, "msg": err });
//             return;
//         }
//         res.send({ 'status': 200, 'data': results });
//     });
// }
// exports.updatevendorspasswordCtrl = function (req, res) {
//     appmdl.updatevendorspasswordmdl(req.body, function (err, results) {
//         if (err) {
//             res.send({ "status": 500, "msg": err });
//             return;
//         }
//         res.send({ 'status': 200, 'data': results });
//     });
// }
// exports.updatepromocodeCtrl = function (req, res) {
//     appmdl.updatepromocodemdl(req.body, function (err, results) {
//         if (err) {
//             res.send({ "status": 500, "msg": err });
//             return;
//         }
//         res.send({ 'status': 200, 'data': results });
//     });
// }



// exports.getpromocodesCtrl = function (req, res) {
//     appmdl.getpromocodesmdl(req.body, function (err, results) {
//         if (err) {
//             res.send({ "status": 500, "msg": err });
//             return;
//         }
//         res.send({ 'status': 200, 'data': results });
//     });
// }

// exports.deletepromocodeCtrl = function (req, res) {
//     appmdl.deletepromocodemdl(req.body, function (err, results) {
//         if (err) {
//             res.send({ "status": 500, "msg": err });
//             return;
//         }
//         res.send({ 'status': 200, 'data': results });
//     });
// }
// exports.promocodeactiveCtrl = function (req, res) {
//     appmdl.promocodeactivemdl(req.body, function (err, results) {
//         if (err) {
//             res.send({ "status": 500, "msg": err });
//             return;
//         }
//         res.send({ 'status': 200, 'data': results });
//     });
// }
// exports.getproductslistdataCtrl = function (req, res) {
//     if (!req.body.shop_id) {
//         return res.send({ "status": 400, "msg": "shop_id is required" });
//     }
//     appmdl.getproductslistdatamdl(req.body, function (err, results) {
//         if (err) {
           
//             return res.send({ "status": 500, "msg": err.message || err });
//         }
//         res.send({ 'status': 200, 'data': results });
//     });
// };
// exports.updateshopproductsCtrl = function (req, res) {
//     appmdl.updateshopproductsmdl(req.body, function (err, results) {
//         if (err) {

//             return res.status(500).json({ "status": 500, "msg": "Failed to update product", "error": err });
//         }
//         res.status(200).json({ 'status': 200, 'data': results, "msg": "Product updated successfully" });
//     });
// };


// exports.postmain_player_id = function (req, res) {
//     // console.log(994 , req.body)
//     var data=req.body
//     appmdl.postmain_player_id(data, function (err, results) {
//         if (err) {
//             res.send({ "status": 500, "msg": err });
//             return;
//         }
//         res.send({ 'status': 200, 'data': results });
//     });
// }
// exports.updateproductactiveCtrl = function (req, res) {
//     var data=req.body
 
//     appmdl.updateproductactivesmdl(data, function (err, results) {
//         if (err) {
        
//             return res.status(500).json({ "status": 500, "msg": "Failed to update product", "error": err });
//         }
//         res.status(200).json({ 'status': 200, 'data': results, "msg": "Product updated successfully" });
//     });
// };

// //29032025//
// exports.getshopsforpayments = function (req, res) {
//     appmdl.getshopsforpaymentsmdl(req.body, function (err, results) {
//         if (err) {
//             res.send({ "status": 500, "msg": err });
//             return;
//         }
//         res.send({ 'status': 200, 'data': results });
//     });
// }

// exports.getpaymenthistory = function (req, res) {
//     appmdl.getpaymenthistory(req.body, function (err, results) {
//         if (err) {
//             res.send({ "status": 500, "msg": err });
//             return;
//         }
//         res.send({ 'status': 200, 'data': results });
//     });
// }


// exports.getuserssubcatgry = function (req, res) {
//     var data=req.body
//     appmdl.getuserssubcatgry(data, function (err, results) {
//         if (err) {
//             res.send({ "status": 500, "msg": err });
//             return;
//         }
//         res.send({ 'status': 200, 'data': results });
//     });
// }

// exports.additemsdetails = function (req, res) {
//     var data=req.body
//         var reviewImgArr = data.item_img
//     //console.log(data, "ctrlfdhgfhjjg");
//     if (reviewImgArr.length != 0) {
//         var image_url = reviewImgArr[0].reviewimg;
//         var array = image_url.split(',');
//         var base64Data = array[1];
//         var datetimestamp = Date.now();
//         var random_number = Math.floor(100000 + Math.random() * 900000);
//         var unicnumber = random_number + '' + datetimestamp;
//         var filetype = reviewImgArr[0].filetype;
//         fs.writeFile("../public_html/control.freshozapcart.com/freshozapcart_images/" + unicnumber + "." + filetype, base64Data, 'base64', function (err) { });
//         imageupload = "https://control.freshozapcart.com/freshozapcart_images/" + unicnumber + '.' + filetype;
//     }
//     else {
//         var imageupload = ' '
//     }
//     appmdl.additemsdetails(data,imageupload, function (err, results) {
//         if (err) {
//             res.send({ "status": 500, "msg": err });
//             return;
//         }
//         res.send({ 'status': 200, 'data': results });
//     });
// }

// exports.addsupportfromvendor = function (req, res) {
//     var data=req.body
//     appmdl.addsupportfromvendor(data, function (err, results) {
//         if (err) {
//             res.send({ "status": 500, "msg": err });
//             return;
//         }
//         res.send({ 'status': 200, 'data': results });
//     });
// }


//multitesting api//

// vendor strat//

exports.submitvendorloginCtrl = function (req, res) {
    appmdl.submitvendorloginmdl(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.getcurrentordersCtrl = function (req, res) {

    appmdl.getcurrentordersmdl(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.newgetorderdetailsCtrl = function (req, res) {
    appmdl.newgetorderdetailsmdl(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}
// exports.updateorderstatusCtrl = function (req, res) {
//     var dataarr = req.body;
//     appmdl.updateorderstatusmdl(req.body, function (err, results) {
//         if (err) {
        
            
//             res.send({ "status": 500, "msg": err });
//             return;
//         }
//         res.send({ 'status': 200, 'data': results });
        
//         appmdl.getdeliveryplayeridsMdl(dataarr, async function (err, delivery_results) {
//             if (err) {
              
//                 res.status(500).send({ message: "Database error", error: err });
//                 return;
//             }
        
//             // Extract player_id from each RowDataPacket
//             const delivery_boy_tokes = delivery_results.map(row => row.player_id);
            
//             try {
//                 const payload = {
//                     title: "New Order",
//                     body: "You have received a new order.",
//                     token: delivery_boy_tokes,  // dynamically set from DB
//                     sound: "custom_sound"
//                 };
        
        
//                 const response = await axios.post(
//                     "http://ec2-13-126-76-184.ap-south-1.compute.amazonaws.com:9632/notifications/v1/sendNotification",
//                     payload
//                 );
//             } catch (error) {
            
//             }
//         });
        
//     });
// }

exports.updateorderstatusCtrl = function (req, res) {
    var dataarr = req.body;
    appmdl.updateorderstatusmdl(req.body, function (err, results) {
        if (err) {


            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });

        appmdl.getdeliveryplayeridsMdl(dataarr, async function (err, delivery_results) {
            if (err) {

                res.status(500).send({ message: "Database error", error: err });
                return;
            }

            // Extract player_id from each RowDataPacket
            var delivery_boy_tokes = delivery_results.map(row => row.player_id);
            // console.log(delivery_boy_tokes);
            var request = require('request');
                var options = {
                  'method': 'POST',
                  'url': 'http://ec2-13-126-76-184.ap-south-1.compute.amazonaws.com/notifications/v1/sendNotification',
                  'headers': {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    "title": "New Order",
                    "body": "You have received a new order.",
                    "token": delivery_boy_tokes,
                    "sound": "custom_sound"
                })
        
               };
                request(options, function (error, response) {
                 
                  if (error) throw new Error(error);
                 
                });

                // try {
                //     const payload = {
                //         title: "New Order",
                //         body: "You have received a new order.",
                //         token: delivery_boy_tokes,  // dynamically set from DB
                //         sound: "custom_sound"
                //     };


                //     const response = await axios.post(
                //         "http://ec2-13-126-76-184.ap-south-1.compute.amazonaws.com/notifications/v1/sendNotification",
                //         payload
                //     );
                // } catch (error) {

                // }
            });

    });
}


exports.getdashboardordersCtrl = function (req, res) {
    appmdl.getdashboardordersmdl(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}
exports.getshoplistCtrl = function (req, res) {
    appmdl.getshoplistmdl(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}



exports.getbillinginformationCtrl = function (req, res) {
    appmdl.getbillinginformationmdl(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.updateshopstatusCtrl = function (req, res) {
    appmdl.updateshopstatusmdl(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}
exports.updatevendorspasswordCtrl = function (req, res) {
    appmdl.updatevendorspasswordmdl(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}
exports.updatepromocodeCtrl = function (req, res) {
    appmdl.updatepromocodemdl(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}



exports.getpromocodesCtrl = function (req, res) {
    appmdl.getpromocodesmdl(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.deletepromocodeCtrl = function (req, res) {
    appmdl.deletepromocodemdl(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}
exports.promocodeactiveCtrl = function (req, res) {
    appmdl.promocodeactivemdl(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}
exports.getproductslistdataCtrl = function (req, res) {
    if (!req.body.shop_id) {
        return res.send({ "status": 400, "msg": "shop_id is required" });
    }
    appmdl.getproductslistdatamdl(req.body, function (err, results) {
        if (err) {
           
            return res.send({ "status": 500, "msg": err.message || err });
        }
        res.send({ 'status': 200, 'data': results });
    });
};
exports.updateshopproductsCtrl = function (req, res) {
    appmdl.updateshopproductsmdl(req.body, function (err, results) {
        if (err) {

            return res.status(500).json({ "status": 500, "msg": "Failed to update product", "error": err });
        }
        res.status(200).json({ 'status': 200, 'data': results, "msg": "Product updated successfully" });
    });
};


exports.postmain_player_id = function (req, res) {
 
    var data=req.body
    appmdl.postmain_player_id(data, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}
exports.updateproductactiveCtrl = function (req, res) {
    var data=req.body
 
    appmdl.updateproductactivesmdl(data, function (err, results) {
        if (err) {
        
            return res.status(500).json({ "status": 500, "msg": "Failed to update product", "error": err });
        }
        res.status(200).json({ 'status': 200, 'data': results, "msg": "Product updated successfully" });
    });
};

//29032025//
exports.getshopsforpayments = function (req, res) {
 
    appmdl.getshopsforpaymentsmdl(req.body, function (err, results) {
        
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.getpaymenthistory = function (req, res) {
    appmdl.getpaymenthistory(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}


exports.getuserssubcatgry = function (req, res) {
    var data=req.body
    appmdl.getuserssubcatgry(data, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

// exports.additemsdetails = function (req, res) {
//     var data=req.body
//         var reviewImgArr = data.item_img

//     if (reviewImgArr.length != 0) {
//         var image_url = reviewImgArr[0].reviewimg;
//         var array = image_url.split(',');
//         var base64Data = array[1];
//         var datetimestamp = Date.now();
//         var random_number = Math.floor(100000 + Math.random() * 900000);
//         var unicnumber = random_number + '' + datetimestamp;
//         var filetype = reviewImgArr[0].filetype;
//         fs.writeFile("../public_html/control.freshozapcart.com/freshozapcart_images/" + unicnumber + "." + filetype, base64Data, 'base64', function (err) { });
//         imageupload = "https://control.freshozapcart.com/freshozapcart_images/" + unicnumber + '.' + filetype;
//     }
//     else {
//         var imageupload = ' '
//     }
//     appmdl.additemsdetails(data,imageupload, function (err, results) {
//         if (err) {
//             res.send({ "status": 500, "msg": err });
//             return;
//         }
//         res.send({ 'status': 200, 'data': results });
//     });
// }

exports.addsupportfromvendor = function (req, res) {
    var data=req.body
    appmdl.addsupportfromvendor(data, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}


exports.getshopidsdata = function (req, res) {
    var data=req.body
    appmdl.getshopidsdata(data, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}


exports.getcurrentordersbyidCtrl = function (req, res) {

    appmdl.getcurrentordersbyidCmdl(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}



//2605
exports.getdateresultsbydate = function (req, res) {
    appmdl.getdateresultsbydate(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}


//2705
exports.extraitems = function (req, res) {
    appmdl.extraitems(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

//2805//
exports.additemsdetails = function (req, res) {
    var data = req.body;
    var reviewImgArr = data.item_img;
    var imageupload = ' ';

    if (reviewImgArr.length != 0) {
        var image_url = reviewImgArr[0].reviewimg;
        var array = image_url.split(',');
        var base64Data = array[1];
        var datetimestamp = Date.now();
        var random_number = Math.floor(100000 + Math.random() * 900000);
        var unicnumber = random_number + '' + datetimestamp;
        var filetype = reviewImgArr[0].filetype;
        fs.writeFile(
            "../public_html/control.freshozapcart.com/freshozapcart_images/" + unicnumber + "." + filetype,
            base64Data,
            'base64',
            function (err) { }
        );
        imageupload = "https://control.freshozapcart.com/freshozapcart_images/" + unicnumber + '.' + filetype;
    }

    appmdl.insertItemIntoShopTable(data, imageupload, function (err, results) {
        if (err) return res.send({ status: 500, msg: err });

        const unique_code = results.uniquecode;
        data.unique_code = unique_code;

        appmdl.insertItemIntoMainTable(data, imageupload, function (err2, results2) {
            if (err2) return res.send({ status: 500, msg: err2 });

            if (data.tasks && data.tasks.length > 0) {
                appmdl.insertExtraItems(results.insertId, data, function (err3, results3) {
                    if (err3) return res.send({ status: 500, msg: err3 });
                    res.send({ status: 200 });
                });
            } else {
                res.send({ status: 200 });
            }
        });
    });
};





// exports.checkdeliveryboynotificationCtrl = async function (req, res) {
//     const delivery_boy_tokes= ["fwPMjaZySUy_LhfLln_bSr:APA91bF2DhWkL4nr2O4zmXyOZ_Hr4MkSapPpj0hgcnCtxC_Ermtv8nnNItXw3xOrES4UiO9DYSfgoJewLvTt6xUob94_YPh9V0VjGVww_WeMxMvUtF0zWyY"];
//     try {
//             const payload = {
//                 title: "New Order",
//                 body: "You have received a new order.",
//                 token: delivery_boy_tokes,  // dynamically set from DB
//                 sound: "custom_sound"
//             };
    
    
//             const response = await axios.post(
//                 "http://ec2-13-126-76-184.ap-south-1.compute.amazonaws.com:9632/notifications/v1/sendNotification",
//                 payload
//             );
//             res.send({ 'status': 200, 'data': [] });
//         } catch (error) {
//         res.send({ 'status': 300, 'data': [] });
//         }
// }

// const axios = require('axios');

// const axios = require('axios');

exports.checkdeliveryboynotificationCtrl = function (req, res) {

    // var delivery_boy_tokens = [
    //     "fwPMjaZySUy_LhfLln_bSr:APA91bF2DhWkL4nr2O4zmXyOZ_Hr4MkSapPpj0hgcnCtxC_Ermtv8nnNItXw3xOrES4UiO9DYSfgoJewLvTt6xUob94_YPh9V0VjGVww_WeMxMvUtF0zWyY"
    // ];

    // // Adjust this payload structure according to the API you're calling
    // var payload = {
    //     // tokens: delivery_boy_tokens,
    //     // notification: {
    //         title: "New Order",
    //         body: "You have received a new order.",
    //         sound: "custom_sound",
    //         token: [
    //     "fwPMjaZySUy_LhfLln_bSr:APA91bF2DhWkL4nr2O4zmXyOZ_Hr4MkSapPpj0hgcnCtxC_Ermtv8nnNItXw3xOrES4UiO9DYSfgoJewLvTt6xUob94_YPh9V0VjGVww_WeMxMvUtF0zWyY"
    // ]
    //     // }
    // };

    // var config = {
    //     method: 'post',
    //     timeout: 10000,
    //     maxBodyLength: Infinity,
    //     url: 'http://ec2-13-126-76-184.ap-south-1.compute.amazonaws.com:9632/notifications/v1/sendNotification',
    //     headers: { 
    //         'Content-Type': 'application/json'
    //     },
    //     data: payload
    // };

    // axios.request(config)
    //     .then(function (response) {
 
    //         res.send({
    //             status: 200,
    //             data: response
    //         });
    //     })
    //     .catch(function (error) {
    //         var errorMessage = JSON.stringify(error)
    //         console.error("Notification error:", errorMessage);
    //         res.send({
    //             status: 500,
    //             error: errorMessage
    //         });
    //     });
    var request = require('request');
        var options = {
          'method': 'POST',
          'url': 'http://ec2-13-126-76-184.ap-south-1.compute.amazonaws.com/notifications/v1/sendNotification',
          'headers': {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "title": "New Order",
            "body": "You have received a new order.",
            "token": [
              "cpXb1mXkTW6kU7sbTf4pfa:APA91bEsexZpqDOrxqcGmoIOnCy0j_X3fqI7_EKO9vDCK5TsNCKO4UfgX2T5ueqWlyrUlIb0WTTj0TZyFNGvAwNfxya0JbuRwVvYO7ydlHnMk7EDr37po8I"
            ],
            "sound": "custom_sound"
        })

};
request(options, function (error, response) {

  if (error) throw new Error(error);
 
});

};


exports.getextaritemsdata = function (req, res) {
    appmdl.getextaritemsdata(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.updateshopitems = function (req, res) {
    const payload = req.body;
    const data = normalizeProductData(payload);
    if (data.quantity_type === '0') {
        appmdl.updateshopitemsWithoutTasks(data, function (err, results) {
            if (err) {
         
                return res.status(500).send({ status: 500, msg: err });
            }
            res.send({ status: 200, msg: 'Updated without tasks', data: results });
        });
    } else {
        appmdl.updateshopitemsWithTasks(data, function (err, results) {
            if (err) {
                return res.status(500).send({ status: 500, msg: err });
            }
            const deletedVariantIds = data.deleted_variants || [];
            appmdl.updateshopextraitems(data, function (err2, result2) {
                if (err2) {              
                    return res.status(500).send({ status: 500, msg: err2 });
                }
                if (deletedVariantIds.length > 0) {
                    appmdl.updatedeletedshopitemsintasks(req.body, function (err3, result3) {
                        if (err3) {         
                            return res.status(500).send({ status: 500, msg: err3 });
                        }
                        res.send({ status: 200, msg: 'Updated with tasks, extra items, and deleted variants', data: results });
                    });
                } else {
                    res.send({ status: 200, msg: 'Updated with tasks & extra items', data: results });
                }
            });
        });
    }
};


function normalizeProductData(payload) {
    const product = payload.product || {};
    return {
        ...payload,
        ...product,
        sub_category_id: product.subCategory.id,
        sub_category_name: product.subCategory.name,
        filter_one: product.filter,
        item_name: product.itemName,
        item_description: product.itemDescription,
        item_gst: product.item_gst,
        quantity_type: product.quantity_type,
        actual_price: product.itemPrice,
        selling_price: product.sellingPrice,
        discount_percentage: product.discountPercentage,
        discount_amount: product.discountAmount,
        prescription_required: product.prescriptionRequired,
        tasks: product.variants || [],
        full_description: '',
        admin_percentage: payload.admin_percentage || 0,
        location_id: payload.location_id || '',
        entry_by: payload.entry_by || '',
    };
}





// exports.addshopitems = function (req, res) {
//     var data = req.body;

//     var reviewImgArr = data.shopimages;
//     var imageupload = ' ';

//     if (reviewImgArr && reviewImgArr.reviewimg) {
//         var image_url = reviewImgArr.reviewimg;
//         var array = image_url.split(',');
//         var base64Data = array[1];
//         var datetimestamp = Date.now();
//         var random_number = Math.floor(100000 + Math.random() * 900000);
//         var unicnumber = random_number + '' + datetimestamp;
//         var filetype = reviewImgArr.filetype;
//         const relativePath = "public_html/control.freshozapcart.com/uploaded_images/items";
//         const saveDir = path.join(__dirname, relativePath);
//         const savePath = path.join(saveDir, `${unicnumber}.${filetype}`);
//         // Ensure directory exists
//         if (!fs.existsSync(saveDir)) {
//             fs.mkdirSync(saveDir, { recursive: true });
//         }
//         // Write file
//         fs.writeFile(savePath, base64Data, 'base64', function (err) {
//             if (err) {
             
//                 return res.send({ status: 500, msg: 'Image upload failed' });
//             }

//             imageupload = "https://control.freshozapcart.com/uploaded_images/items/" + unicnumber + '.' + filetype;
//             continueShopItemInsertion();
//         });
//     } else {
//         continueShopItemInsertion();
//     }

//     function continueShopItemInsertion() {

//         if (data.quantity_type == '0') {
           
//             appmdl.addshopitemsWithoutTasks(req.body, imageupload, function (err, results) {
//                 if (results) {
//                     if (data.patch_ind != 1) {
//                         let unique_code = results.uniquecode;
//                         data.unique_code = unique_code;
//                         appmdl.addshopitemsinmaintbl(data, imageupload, function (err, results) {
//                             if (results) {
//                                 res.send({ 'status': 200 });
//                             } else {
//                                 res.send({ 'status': 500 });
//                             }
//                         });
//                     } else {
//                         res.send({ 'status': 200 });
//                     }
//                 } else {
//                     res.send({ 'status': 500 });
//                 }
//             });
//         } else {
//             appmdl.addshopitemsWithTasks(req.body, imageupload, function (err, results) {
//                 if (results) {
//                     appmdl.insertshopextraitems(results.insertId, req.body, function (err, resulta) {
//                         if (err) {
//                             res.send({ "status": 500, "msg": err });
//                             return;
//                         }
//                         res.send({ 'status': 200, 'data': results });
//                     });
//                 } else {
//                     res.send({ 'status': 200, 'data': results });
//                 }
//             });
//         }
//     }
// };

exports.addshopitems = function (req, res) {
    var data = req.body;

    var reviewImgArr = data.shopimages;
    

    var imageupload = ' ';

    var image_url = reviewImgArr.reviewimg; // Assuming it's an object with `reviewimg` key
    if (image_url && image_url.includes(',')) {
        var array = image_url.split(',');
         
        var base64Data = array[1];
        
        var datetimestamp = Date.now();
        var random_number = Math.floor(100000 + Math.random() * 900000);
        var unicnumber = random_number + '' + datetimestamp;

        fs.writeFile("../public_html/control.freshozapcart.com/uploaded_images/items/" + unicnumber + ".jpeg", base64Data, 'base64', function (err) {
            if (err) {
            
                res.send({ status: 500, msg: "Image upload failed" });
                return;
            }

            imageupload = "https://control.freshozapcart.com/uploaded_images/items/" + unicnumber + '.jpeg';

            // Continue DB operations after image saved
            continueShopItemInsertion();
        });
    } else {
   
        res.send({ status: 400, msg: "Invalid or missing image" });
        return;
    }

    function continueShopItemInsertion() {
        if (data.quantity_type == '0') {
            appmdl.addshopitemsWithoutTasks(req.body, imageupload, function (err, results) {
                if (results) {
                    if (data.patch_ind != 1) {
                        let unique_code = results.uniquecode;
                        data.unique_code = unique_code;
                        appmdl.addshopitemsinmaintbl(data, imageupload, function (err, results) {
                            if (results) {
                                res.send({ 'status': 200 });
                            } else {
                                res.send({ 'status': 500 });
                            }
                        });
                    } else {
                        res.send({ 'status': 200 });
                    }
                } else {
                    res.send({ 'status': 500 });
                }
            });
        } else {
            appmdl.addshopitemsWithTasks(req.body, imageupload, function (err, results) {
                if (results) {
                    appmdl.insertshopextraitems(results.insertId, req.body, function (err, resulta) {
                        if (err) {
                            res.send({ "status": 500, "msg": err });
                            return;
                        }
                        res.send({ 'status': 200, 'data': results });
                    });
                } else {
                    res.send({ 'status': 200, 'data': results });
                }
            });
        }
    }
};
exports.getshopdetailstitle = function (req, res) {
   
    appmdl.getshopdetailstitle(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}


exports.getsubcategoriestoclose = function (req, res) {
    appmdl.getsubcategoriestoclose(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}




exports.getversion = function (req, res) {
    appmdl.getversion(function (err, results) {
        if (err) {
            res.send(500, "Server Error");
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}












