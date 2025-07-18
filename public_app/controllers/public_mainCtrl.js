var moment = require('moment');

var sqldb = require('../../config/dbconnect');
var dbutil = require(appRoot + '/utils/dbutils');
var appmdl = require('../models/public_mainModel');
const request = require('request');
process.env.SECRET_KEY = "thisismysecretkey";
const Razorpay = require('razorpay');
const noticationsfile = require('../../notification/notification')
var fs = require('fs');
const cron = require('node-cron');


// cron.schedule('* * * * *', () => {
//     appmdl.getscheduleorderslistMdl(function (err, results) {
//         if (results.length > 0) {
//             results.map(obj => {
//                 appmdl.updateordersMdl(obj, function (err, results) {
//                 })
//                 sendordernotificatins(obj.order_id, obj.shop_id, "");
//             })
//         }


//     });
//     // Your code here
// appmdl.getcurrentnotificatinsMdl(function (err, results) {
  
//     if(results.length>0){
//         sendschedulenotifications(results[0]);
//     }
    
    
// })
    
// });



cron.schedule('0 * * * *', () => { // Runs every hour at minute 0
    const tablelist = [
        "z_electronics_item_lst_t",
        "z_food_restaurant_item_lst_t",
        "z_frozen_food_item_lst_t",
        "z_gifts_toys_item_lst_t",
        "z_home_appreals_item_lst_t",
        "z_kitchen_appliances_pooja_store_item_lst_t",
        "z_meat_item_lst_t",
        "z_pet_store_item_lst_t",
        "z_pharmacy_store_item_lst_t",
        "z_stationary_games_item_lst_t"
    ];

    tablelist.forEach((tableName) => {
        appmdl.setpublicvisibilityshopsMdl(tableName, function (err, results) {
            if (err) {
                // console.error(`Error updating ${tableName}:`, err);
            } else {
                // console.log(`Successfully updated public_visibility for ${tableName}`);
            }
        });
    });
});

// ************ // get razorpayorder id **************
// var instance = new Razorpay({ key_id: "rzp_live_tZgZCC254NtRmU", key_secret: "udUhy5EDlUkSfn5vnXSiiaKu" }) // godavariwave
// exports.generateorderidCtrl = function (req, res) {
//     var dataarr = req.body;    
//     var instance = new Razorpay({ key_id: "rzp_live_Z0s14kBB3gb2XC", key_secret: "pz05X4mukgUTcBVOwgzn03Ei" }) // fresho zapcart 
//     // dataarr.order_amount = 1 * 100;
//     var options = {
//         amount: dataarr.order_amount.toFixed(2),  // amount in the smallest currency unit        
//         currency: "INR",
//         receipt: "rcp1"
//     };

//     console.log(options);
    
//     instance.orders.create(options, function (err, order) {
//         res.send({ orderId: order });
//     });
// }
exports.generateorderidCtrl = function (req, res) {
    var dataarr = req.body;
    var instance = new Razorpay({ key_id: "rzp_live_Z0s14kBB3gb2XC", key_secret: "pz05X4mukgUTcBVOwgzn03Ei" });
    // dataarr.order_amount = 100*100;
    var options = {
        amount: Math.round(Number(dataarr.order_amount)), // Clean integer in paise
        currency: "INR",
        receipt: "rcp1"
    };

  

    instance.orders.create(options, function (err, order) {
        if (err) {
       
            return res.status(500).send({ error: err });
        }
        res.send({ orderId: order });
    });
}

// ************ // get razorpayorder id **************

exports.getserviceslistCtrl = function (req, res) {
    appmdl.getserviceslistMdl(function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}


exports.getuserlocationCtrl = function (req, res) {
    var dataarr = req.body;
    appmdl.getuserlocationMdl(dataarr, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        if (results.length == 0) {
            res.send({ 'status': 300, 'data': [] });
        } else {
            res.send({ 'status': 200, 'data': results });
        }

    });
}

exports.getlocationctgrylistCtrl = function (req, res) {
    var dataarr = req.body;
    appmdl.getlocationctgrylistMdl(function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.getshopsubcategorylistCtrl = function (req, res) {
    var dataarr = req.body;
    appmdl.getshopsubcategorylistMdl(dataarr, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}



exports.getbannerslistCtrl = function (req, res) {
    var dataarr = req.body;
    appmdl.getbannerslistMdl(dataarr, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.getcategorybannerslistCtrl = function (req, res) {
    var dataarr = req.body;
    appmdl.getcategorybannerslistMdl(dataarr, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}



exports.getshoplistCtrl = function (req, res) {
    var dataarr = req.body;
    appmdl.getshoplistMdl(dataarr, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.getitemslistCtrl = function (req, res) {
    var dataarr = req.body;
    appmdl.getitemslistMdl(dataarr, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.getrelateditemslistCtrl = function (req, res) {
    var dataarr = req.body;
    appmdl.getrelateditemslistMdl(dataarr, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}



exports.coupon_listCtrl = function (req, res) {
    var dataarr = req.body;
    appmdl.coupon_listMdl(dataarr, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.notificationslistCtrl = function (req, res) {
    var dataarr = req.body;
    appmdl.notificationslistMdl(dataarr, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}




exports.orderplacedCtrl = function (req, res) {
    var dataarr = req.body;
    
    appmdl.checkshopstatusMdl(req.body.shop_id, function (err, status_results) {
        if(status_results.length==0){
            res.send({ 'status': 400, 'data': status_results });
        } else {
            var user_player_id = dataarr.user_player_id;
            var shop_id = dataarr.shop_id;
            var franchise_player_id = dataarr.franchise_player_id;

            if (dataarr.coupon_type == undefined || dataarr.coupon_type == null || dataarr.coupon_type == '') {
                dataarr.coupon_type = 0;
            }
            dataarr.vendor_otp = Math.floor(1001 + Math.random() * 9000);
            dataarr.customer_otp = Math.floor(1001 + Math.random() * 9000);
            var suborder_array = dataarr.sub_order_array;

            if (dataarr.deliveryType == 0) {
                const order_date_time = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');
                const random_number = Math.floor(Math.random() * 1000);
                const padded_random_number = random_number.toString().padStart(3, '0'); // Ensures it's 3 digits
                dataarr.order_id = order_date_time.replace(/[- :]/g, "") + padded_random_number;

                dataarr.order_date = moment().utcOffset("+05:30").format('YYYY-MM-DD');
                dataarr.order_date_time = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');
                dataarr.slot_date = moment().utcOffset("+05:30").format('YYYY-MM-DD');
                dataarr.slot_time = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');

            } else {
                const order_date_time = dataarr.order_date_time;

                const random_number = Math.floor(Math.random() * 1000);
                const padded_random_number = random_number.toString().padStart(3, '0'); // Ensures it's 3 digits
                dataarr.order_id = order_date_time.replace(/[- :]/g, "") + padded_random_number;
            }

            if (dataarr.payment_type == "Pay Online") {
                dataarr.razorpay_charges = (dataarr.grand_total * 2) / 100;
                dataarr.razorpay_gst = (dataarr.razorpay_charges * 18) / 100;
            } else {
                dataarr.razorpay_charges = 0
                dataarr.razorpay_gst = 0
            }



            appmdl.orderplacedMdl(dataarr, function (err, order_results) {

                res.send({ 'status': 200, 'id': order_results.insertId, 'order_id': dataarr.order_id, 'order_date_time': dataarr.order_date_time, 'order_date': dataarr.order_date });
                appmdl.sub_orderplacedMdl(suborder_array, order_results.insertId, function (err, sub_order_results) {

                })

                if (dataarr.payment_type == "Cash on Delivery" && dataarr.slot_indication == 0) {
                    sendordernotificatins(dataarr.order_id, shop_id, user_player_id);
                }



                if (req.body.prescriptionRequired == true) {
                    var image_url = req.body.prescription_image;
                    var array = image_url.split(',');
                    var base64Data = array[1];
                    var datetimestamp = Date.now();
                    var random_number = Math.floor(100000 + Math.random() * 900000);
                    var unicnumber = random_number + '' + datetimestamp;

                    fs.writeFile("../public_html/control.freshozapcart.com/uploaded_images/orders/" + unicnumber + ".jpeg", base64Data, 'base64', function (err) {
                    });
                    var prescription_image = "https://control.freshozapcart.com/uploaded_images/orders/" + unicnumber + '.jpeg';



                    appmdl.updateprescription_imageMdl(prescription_image, order_results.insertId, function (err, sub_order_results) {

                    })

                }



            })
        }
     })   
    
}









exports.getuserloginotpCtrl = function (req, res) {
    var cntxtDtls = "in getuserloginotpCtrl";


    var dataarr = req.body;

    if (dataarr.customer_mobile_number == 7993563933) {
        var loginotp = '2025';
    } else {
        var loginotp = Math.floor(1001 + Math.random() * 9000);
    }

    request(`https://sms.sunstechit.com/app/smsapi/index.php?key=267F517F17E9C2&campaign=0&routeid=13&type=text&contacts=${dataarr.customer_mobile_number}&senderid=FZTOTP&msg=Your OTP for verification is ${loginotp}. Do not share this with anyone. - NAKSHATRA RPL E COMM&template_id=1207174402569116367`, function (error, response, body) {
    })

    appmdl.updatesmsCount(dataarr, loginotp, function (err, results) { })

    res.send({ "status": 200, "loginotp": loginotp });
}



exports.customerloginCtrl = function (req, res) {
    var cntxtDtls = "in customerloginCtrl";

    var dataarr = req.body;

    dataarr.customer_otp = Math.floor(Math.random() * 9000) + 1000;

    appmdl.customerloginMdl(dataarr, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        if (results.length == 0) {
            appmdl.insertcustomerMdl(dataarr, function (err, insertresults) {
                var logindta = { "customer_id": insertresults.insertId, "customer_mobile_number": dataarr.customer_mobile_number, customer_otp: dataarr.customer_otp }
                res.send({ 'status': 200, 'data': logindta });
                dataarr.user_id = insertresults.insertId;
                appmdl.insertcustomerplayerid(dataarr, function (err, playerids) {

                })
            })
        } else {

            var logindta = { "customer_id": results[0].id, "customer_mobile_number": results[0].customer_mobile_number, "customer_name": results[0].customer_name, customer_otp: dataarr.customer_otp }
            res.send({ 'status': 200, 'data': logindta });
            appmdl.updatecustomerMdl(dataarr, function (err, updateresults) {

            })
            appmdl.insertcustomerplayerid(dataarr, function (err, playerids) {

            })
        }
        // res.send({ 'status': 200, 'data': results });
    });

}


exports.getslot_bookingCtrl = function (req, res) {
    var dataarr = req.body;
    appmdl.getslot_bookingMdl(dataarr, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.getorderdetailsCtrl = function (req, res) {
    var dataarr = req.body;
    appmdl.getorderdetailsMdl(dataarr, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.getorderlistCtrl = function (req, res) {
    var dataarr = req.body;
    appmdl.getorderlistMdl(dataarr, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.updatepaymetdetails = function (req, res) {
    var dataarr = req.body;

    appmdl.updatepaymetdetails(dataarr, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results[0] });
        if (dataarr.slot_indication == 0) {
            sendordernotificatins(results[1][0].order_id, dataarr.shop_id, dataarr.user_player_id);
        }



    });
}



exports.getgrocery_sub_total_categoriesCtrl = function (req, res) {
    var dataarr = req.body;
    appmdl.getgrocery_sub_total_categoriesMdl(dataarr, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }


        // Separate data into 3 arrays
        const categoryArray = [];
        const subCategoryArray = [];
        const subTotalCategoryArray = [];

        const seenCategoryIds = new Set();
        const seenSubCategoryIds = new Set();
        const seenSubTotalCategoryIds = new Set();

        results.forEach(item => {
            // Category array (category_id, category_name, category_image)
            if (!seenCategoryIds.has(item.category_id)) {
                categoryArray.push({
                    category_id: item.category_id,
                    category_name: item.category_name,
                    category_image: item.sub_total_category_image  // assuming category image is same as sub_total_category_image
                });
                seenCategoryIds.add(item.category_id);
            }

            // Sub-category array (sub_category_id, sub_category_name, sub_total_category_image, category_id)
            if (!seenSubCategoryIds.has(item.sub_category_id)) {
                subCategoryArray.push({
                    sub_category_id: item.sub_category_id,
                    sub_category_name: item.sub_category_name,
                    sub_total_category_image: item.sub_total_category_image,
                    category_id: item.category_id
                });
                seenSubCategoryIds.add(item.sub_category_id);
            }

            // Sub-total category array (sub_total_category_name, sub_total_category_image, sub_total_category_id, sub_category_id)
            if (!seenSubTotalCategoryIds.has(item.sub_total_category_id)) {
                subTotalCategoryArray.push({
                    sub_total_category_name: item.sub_total_category_name,
                    sub_total_category_image: item.sub_total_category_image,
                    sub_total_category_id: item.sub_total_category_id,
                    sub_category_id: item.sub_category_id
                });
                seenSubTotalCategoryIds.add(item.sub_total_category_id);
            }
        });


        res.send({ 'status': 200, 'categoryArray': categoryArray, 'subCategoryArray': subCategoryArray, 'subTotalCategoryArray': subTotalCategoryArray });
    });
}

exports.getgroucery_category_items_listCtrl = function (req, res) {
    var dataarr = req.body;
    appmdl.getgroucery_category_items_listMdl(dataarr, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.getgroucery_search_items_listCtrl = function (req, res) {
    var dataarr = req.body;
    appmdl.getgroucery_search_items_listMdl(dataarr, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.get_subscription_timelineCtrl = function (req, res) {
    var dataarr = req.body;
    appmdl.get_subscription_timelineMdl(dataarr, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}


exports.get_wallet_amountsCtrl = function (req, res) {
    var dataarr = req.body;
    appmdl.get_wallet_amountsMdl(dataarr, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.user_wallet_paymentCtrl = function (req, res) {
    var dataarr = req.body;

    appmdl.user_sub_wallet_paymentMdl(dataarr, function (err, results) {
        res.send({ 'status': 200, 'data': results });
    })




}


exports.update_user_wallet_paymentCtrl = function (req, res) {
    var dataarr = req.body;

    appmdl.checkuserwalletamountMdl(dataarr, function (err, wallet_user_results) {
        if (wallet_user_results.length == 0) {
            appmdl.user_wallet_paymentMdl(dataarr, function (err, results) {
                if (err) {
                    res.send({ 'status': 500, 'data': results });
                    return;
                }
                res.send({ 'status': 200, 'data': results });
                appmdl.update_user_wallet_paymentCtrl(dataarr, function (err, results) {

                })
            });
        } else {
            appmdl.update_main_user_wallet_paymentMdl(dataarr, function (err, results) {
                if (err) {
                    res.send({ 'status': 500, 'data': results });
                    return;
                }
                res.send({ 'status': 200, 'data': results });
                appmdl.update_user_wallet_paymentCtrl(dataarr, function (err, results) {

                })
            });
        }
    })

}

exports.get_user_wallet_amount_detailsCtrl = function (req, res) {
    var dataarr = req.body;

    appmdl.get_user_wallet_amount_detailsMdl(dataarr, function (err, results) {
        res.send({ 'status': 200, 'data': results });
    })
}


exports.subscription_order_placedCtrl = function (req, res) {
    var dataarr = req.body;

    const order_date_time = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');
    const random_number = Math.floor(Math.random() * 1000);
    const padded_random_number = random_number.toString().padStart(3, '0'); // Ensures it's 3 digits
    dataarr.order_id = order_date_time.replace(/[- :]/g, "") + padded_random_number;

    appmdl.subscription_order_placedMdl(dataarr, function (err, results) {
        res.send({ 'status': 200, 'data': results });
    })
}

exports.getsubscripitioin_ordersCtrl = function (req, res) {
    var dataarr = req.body;
    appmdl.getsubscripitioin_ordersMdl(dataarr, function (err, results) {
        res.send({ 'status': 200, 'data': results });
    })
}

exports.getrecieved_subscripitioin_order_itemCtrl = function (req, res) {
    var dataarr = req.body;
    appmdl.getrecieved_subscripitioin_order_itemMdl(dataarr, function (err, results) {
        res.send({ 'status': 200, 'data': results });
    })
}


exports.getwalletdeductionCtrl = function (req, res) {
    var dataarr = req.body;
    appmdl.getwalletdeductionMdl(dataarr, function (err, results) {
        res.send({ 'status': 200, 'data': results });
    })
}

exports.getsubcategoryallctrl = function (req, res) {
    var dataarr = req.body;
    appmdl.getsubcategoryallMdl(dataarr, function (err, results) {
        res.send({ 'status': 200, 'data': results });
    })
}

exports.search_allitemsctrl = function (req, res) {
    var dataarr = req.body;
    appmdl.search_allitemsmdl(dataarr, function (err, results) {

        appmdl.search_grocery_itemsMdl(dataarr, function (err, grocery_results) {
            // res.send({ 'status': 200, 'data': results });

            const mergedResults = [...results, ...grocery_results]; // merging arrays
            res.send({ status: 200, data: mergedResults });
        })

    })
}
// exports.search_grocery_itemsCtrl = function (req, res) {
//     var dataarr = req.body;
//     appmdl.search_grocery_itemsMdl(dataarr, function (err, results) {
//         res.send({ 'status': 200, 'data': results });
//     })
// }


exports.searchitemsfullctrl = function (req, res) {
    var dataarr = req.body;
    appmdl.searchitemsfullmdl(dataarr, function (err, results) {
        res.send({ 'status': 200, 'data': results });
    })
}
exports.getsearchshoplistCtrl = function (req, res) {
    var dataarr = req.body;
    appmdl.getsearchshoplistMdl(dataarr, function (err, results) {
        res.send({ 'status': 200, 'data': results });
    })
}


exports.postplayer_idctrl = function (req, res) {
    var dataarr = req.body;

    appmdl.checkpublic_playeridMdl(dataarr, function (err, checkresults) {

        if (checkresults.length == 0) {
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
exports.post_customer_delivery_addressCtrl = function (req, res) {
    var dataarr = req.body;
    appmdl.check_delivery_typeMdl(dataarr, function (err, check_address_results) {
        if (check_address_results.length == 0) {
            appmdl.post_customer_delivery_addressMdl(dataarr, function (err, results) {
                res.send({ 'status': 200, 'data': results });
            })
        } else {
            appmdl.update_customer_delivery_addressMdl(dataarr, check_address_results[0].id, function (err, results) {
                res.send({ 'status': 200, 'data': results });
            })
        }
    })

}

exports.get_customer_delivery_addressCtrl = function (req, res) {
    var dataarr = req.body;
    appmdl.get_customer_delivery_addressMdl(dataarr, function (err, results) {
        res.send({ 'status': 200, 'data': results });
    })
}

exports.delete_customer_addressCtrl = function (req, res) {
    var dataarr = req.body;
    appmdl.delete_customer_addressMdl(dataarr, function (err, results) {
        res.send({ 'status': 200, 'data': results });
    })
}

exports.application_common_apiCtrl = function (req, res) {
    var dataarr = req.body;
    appmdl.application_common_apiMdl(dataarr, function (err, results) {
        res.send({ 'status': 200, 'data': results });
    })
}

exports.getprofileCtrl = function (req, res) {
    var dataarr = req.body;
    appmdl.getprofileMdl(dataarr, function (err, results) {
        res.send({ 'status': 200, 'data': results });
    })
}
exports.update_customer_profileCtrl = function (req, res) {
    var data = req.body;

    if (data.iamgeeevnt == 0) {
        imageupload = data.pervious_image
    }
    else {
        var reviewImgArr = data.image;
        var image_url = reviewImgArr;
        var array = image_url.split(',');
        var base64Data = array[1];
        var datetimestamp = Date.now();
        var random_number = Math.floor(100000 + Math.random() * 900000);
        var unicnumber = random_number + '' + datetimestamp;
        var filetype = 'jpg';

        fs.writeFile("../public_html/control.freshozapcart.com/freshozapcart_images/" + unicnumber + "." + filetype, base64Data, 'base64', function (err) {
        });
        imageupload = "https://control.freshozapcart.com/freshozapcart_images/" + unicnumber + '.' + filetype;

    }

    appmdl.update_customer_profileMdl(imageupload, data, function (err, results) {
        res.send({ 'status': 200, 'data': results, 'imageupload': imageupload });
    })
}

exports.get_related_productsCtrl = function (req, res) {
    var dataarr = req.body;
    appmdl.get_related_productsMdl(dataarr, function (err, results) {
        res.send({ 'status': 200, 'data': results });
    })
}

exports.getappversionsCtrl = function (req, res) {
    var dataarr = req.body;
    appmdl.getappversionsMdl(dataarr, function (err, results) {
        res.send({ 'status': 200, 'data': results });
    })
}
exports.bannertgetproductsCtrl = function (req, res) {
    var dataarr = req.body;
    appmdl.bannertgetproductsMld(dataarr, function (err, results) {
        res.send({ 'status': 200, 'data': results[3] });
    })
}

exports.cancleorderCtrl = function (req, res) {
    var dataarr = req.body;
    appmdl.checkorderstatusMdl(dataarr, function (err, check_results) {
        if (check_results.length == 0) {
            res.send({ 'status': 300, 'data': check_results });
        } else {
            appmdl.cancleorderMdl(dataarr, function (err, results) {

                res.send({ 'status': 200, 'data': results });
            })
        }

    })

}

exports.checksamplenotificationCtrl = function (req, res) {
    var order_id = "123457";
    var big_picture = "https://godavariwave.com/big_picture.jpg";
    var large_icon = "https://godavariwave.com/large_icon.jpg";
    // var small_icon = "https://godavariwave.com/small_icon.jpg";

    noticationsfile.checkingnotification(
        ["6f38756e-f301-4ef3-8f8a-a64107feeb12"], // deviceId should always be in an array
        "You have received a new order from Fresh Zap Cart",
        "os_v2_app_pne4tdod7rbm3ntoz2yziuycpsc4qy3g466uhyvu5tggt2stl6i4wcp53r3mef76zssvsf72idhswxddtufzzs4zrau5lr4vhllmbsy", // Secret key
        "7b49c98d-c3fc-42cd-b66e-ceb19453027c", // App ID
        "publicsound", // Android sound
        "ic_stat_onesignal_default", // small icon
        order_id, // title (this could be the order id or an actual title like "New Order")
        "c01acac8-8e06-46ec-9e31-36527ab0f5e9", // Android channel ID
        big_picture, // Big image
        large_icon // Large icon
    );

    res.send({ 'status': 200 });
};

exports.postapprating = function (req, res) {
    appmdl.postapprating(req.body, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.postorderrating = function (req, res) {
    appmdl.postorderrating(req.body, function (err, results) {
        if (results) {
            appmdl.updateshoprating(req.body, function (err, resultsa) {
                if (err) {
                    res.send({ 'status': 500, 'data': resultsa });
                    return;
                }
                res.send({ 'status': 200, 'data': resultsa });
            });
        }
    });
}

exports.getsingleshopdetailsCtrl = function (req, res) {
    appmdl.getsingleshopdetailsMdl(req.body, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.getsearchcategoriesshoplistCtrl = function (req, res) {
    appmdl.getsearchcategoriesshoplistMdl(req.body, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.getsearchsubcategoriesshoplistCtrl = function (req, res) {
    appmdl.getsearchsubcategoriesshoplistMdl(req.body, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}
exports.getsearchgroceryitemslistCtrl = function (req, res) {
    appmdl.getsearchgroceryitemslistMdl(req.body, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}


exports.addwishlistCtrl = function (req, res) {
    appmdl.addwishlistMdl(req.body, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}
exports.deletewishlistCtrl = function (req, res) {
    appmdl.deletewishlistMdl(req.body, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}
exports.getuserwishlistCtrl = function (req, res) {
    appmdl.getuserwishlistMdl(req.body, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.sameshopoutletsCtrl = function (req, res) {
    appmdl.sameshopoutletsMdl(req.body, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.getslotdatesCtrl = function (req, res) {

    appmdl.getslotdatesMdl(req.body, function (err, results) {

        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }

        res.send({ 'status': 200, 'data': results });
    });
}

exports.getcategorydetailsCtrl = function (req, res) {
    appmdl.getcategorydetailsMdl(req.body, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.delivery_instructionsCtrl = function (req, res) {
    const deliveryInstructions = [
        {
            icon: '🚪',
            label: 'Leave at door',
            value: 'leave_at_door'
        },
        {
            icon: '🛡️',
            label: 'Leave with guard',
            value: 'leave_with_guard'
        },
        {
            icon: '📵',
            label: 'Avoid calling',
            value: 'avoid_calling'
        },
        {
            icon: '🔕',
            label: "Don't ring the bell",
            value: 'dont_ring_bell'
        },
        {
            icon: '🐶',
            label: 'Pet at home',
            value: 'pet_at_home'
        }
    ];


    res.send({ 'status': 200, 'data': deliveryInstructions });

}
exports.getmerchentratingsCtrl = function (req, res) {
    appmdl.getmerchentratingsMdl(req.body, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.getshop_offercelistCtrl = function (req, res) {
    appmdl.getshop_offercelistMdl(req.body, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.checkshop_slot_timingsCtrl = function (req, res) {
    appmdl.checkshop_slot_timingsMdl(req.body, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}




exports.generateslottimeingCtrl = function (req, res) {
    appmdl.generateslottimeingMdl(req.body, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.get_offer_bannersCtrl = function (req, res) {
    appmdl.get_offer_bannersMdl(req.body, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}
exports.recomrecommended_for_you_shopsCtrl = function (req, res) {
    appmdl.recomrecommended_for_you_shopsMdl(req.body, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.getuserwishlistfulldata = function (req, res) {
    appmdl.getuserwishlistfulldata(req.body, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.deleteaccountCtrl = function (req, res) {
    appmdl.deleteaccountMdl(req.body, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.getbanneritemslistCtrl = function (req, res) {
    appmdl.getbanneritemslistMdl(req.body, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.public_complaitsCtrl = function (req, res) {
 
    
    if (req.body.complaint_image) {
        var image_url = req.body.complaint_image;
        var array = image_url.split(',');
        var base64Data = array[1];
        var datetimestamp = Date.now();
        var random_number = Math.floor(100000 + Math.random() * 900000);
        var unicnumber = random_number + '' + datetimestamp;

        fs.writeFile("../public_html/control.freshozapcart.com/uploaded_images/orders/" + unicnumber + ".jpeg", base64Data, 'base64', function (err) {
        });
        var complaint_image = "https://control.freshozapcart.com/uploaded_images/orders/" + unicnumber + '.jpeg';
        req.body.complaint_image=complaint_image;
        appmdl.public_complaitsMdl(req.body, function (err, results) {
            if (err) {
                res.send({ 'status': 500, 'data': results });
                return;
            }
            res.send({ 'status': 200, 'data': results });
        });

    } else {
        var complaint_image ="";
        appmdl.public_complaitsMdl(req.body, function (err, results) {
            if (err) {
                res.send({ 'status': 500, 'data': results });
                return;
            }
            res.send({ 'status': 200, 'data': results });
        });
    }

    
}




sendordernotificatins = function (order_id, shop_id, user_player_id) {
    var big_picture = "https://godavariwave.com/big_picture.jpg";
    var large_icon = "https://godavariwave.com/large_icon.jpg";
    // var small_icon = "https://godavariwave.com/small_icon.jpg";   

    appmdl.get_shop_playersidsMdl(shop_id, 1, function (err, shop_player_id_result) {
        if (shop_player_id_result.length > 0) {
            noticationsfile.checkingnotification(
                [shop_player_id_result[0].player_id], // deviceId should always be in an array
                "You have received a new order from Fresho Zapcart",
                "os_v2_app_atebnzqxazgj5eqmf34rhu5x7x2proa6w5aebjnxaorksw7n5vv4ejaohfgr3hj4mk4eekxalsfvsrajrakoi7knsyvnpngfte7iatq", // Secret key (API Key)
                "04c816e6-1706-4c9e-920c-2ef913d3b7fd", // App ID
                "vendorsound", // Android sound
                "ic_stat_onesignal_default", // Small icon
                order_id, // Title (could be the order ID or a custom title like "New Order")
                "cd93c38c-537d-4107-8f53-355a9cdb685b", // Android channel ID
                big_picture, // Big image
                large_icon // Large icon
            );
        }
    })

    if (user_player_id != "") {
        noticationsfile.checkingnotification(
            [user_player_id], // deviceId should always be in an array
            // ["649ab623-1f6c-417b-beca-7a2f25dfd418"],
            "Thank you for your purchase from Fresho Zapcart!",
            "os_v2_app_pne4tdod7rbm3ntoz2yziuycpsc4qy3g466uhyvu5tggt2stl6i4wcp53r3mef76zssvsf72idhswxddtufzzs4zrau5lr4vhllmbsy", // Secret key
            "7b49c98d-c3fc-42cd-b66e-ceb19453027c", // App ID
            "publicsound", // Android sound
            "ic_stat_onesignal_default", // small icon
            order_id, // title (this could be the order id or an actual title like "New Order")
            "c01acac8-8e06-46ec-9e31-36527ab0f5e9", // Android channel ID
            big_picture, // Big image
            large_icon // Large icon
        );
    }
}


sendschedulenotifications = function (notificationdata) {
    var big_picture = "https://godavariwave.com/big_picture.jpg";
    var large_icon = "https://godavariwave.com/large_icon.jpg";
    // var small_icon = "https://godavariwave.com/small_icon.jpg";   

    appmdl.getpublic_notificationsMdl(notificationdata,  function (err, player_id_result) {
       if(player_id_result.length>0){
            var playerIds = player_id_result.map(player => player.player_id);
           
            
                if (playerIds.length > 0) {
                noticationsfile.checkingnotification(
                    playerIds, // deviceId should always be in an array
                    // ["a71a4a34-d343-4d26-b1eb-53b9eebac489"],
                    notificationdata.notification_description,
                    "os_v2_app_pne4tdod7rbm3ntoz2yziuycpsc4qy3g466uhyvu5tggt2stl6i4wcp53r3mef76zssvsf72idhswxddtufzzs4zrau5lr4vhllmbsy", // Secret key
                    "7b49c98d-c3fc-42cd-b66e-ceb19453027c", // App ID
                    "publicsound", // Android sound
                    "ic_stat_onesignal_default", // small icon
                    notificationdata.notification_title, // title (this could be the order id or an actual title like "New Order")
                    "c01acac8-8e06-46ec-9e31-36527ab0f5e9", // Android channel ID
                    big_picture, // Big image
                    large_icon // Large icon
                );
            }
       }
        
    })

    
}


exports.checksocketsCtrl = function (req, res) {
    const data = { status: 200, message: 'New booking received!' };
    global.io.emit('newbookings', data); // <== This fires the event
  
    res.send(data);
};




exports.getversion = function (req, res) {
    appmdl.getversion(function (err, results) {
        if (err) {
            res.send(500, "Server Error");
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}


exports.updatename = function (req, res) {
    appmdl.updatename(req.body, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

const crypto = require('crypto'); 

exports.razorpaypaymentsuccessCtrl = function (req, res) {
    const RAZORPAY_SECRET = 'SVECCs6eZ4xp_6V@2025'; // Must match the one in Razorpay Webhook Dashboard

    const body = JSON.stringify(req.body);
    const receivedSignature = req.headers['x-razorpay-signature'];

    const expectedSignature = crypto
        .createHmac('sha256', RAZORPAY_SECRET)
        .update(body)
        .digest('hex');

    if (receivedSignature !== expectedSignature) {
        return res.status(400).json({ status: 400, message: 'Invalid signature' });
    }

    
    try {
        const payload = req.body.payload.payment.entity;

        const dataarr = {
            payment_id: payload.id,
            razorpay_order_id: payload.order_id,
            order_status: 1 
        };

        appmdl.razorpaypaymentsuccessMdl(dataarr, function (err, results) {
            if (err) {
               
                return res.status(500).json({ status: 500, message: 'Database error' });
            }

            return res.status(200).json({ status: 200, message: 'Payment updated', data: results[0] });
        });

    } catch (error) {
       
        return res.status(500).json({ status: 500, message: 'Server error' });
    }
};














