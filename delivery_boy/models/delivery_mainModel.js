var sqldb = require('../../config/dbconnect');
var dbutil = require(appRoot + '/utils/dbutils');
var moment = require('moment');






//////////delivery_boy/////

exports.logincheckmdl = function (data, callback) {
    var cntxtDtls = "in logincheckmdl";
    var QRY_TO_EXEC = `SELECT *, CASE WHEN delivery_boy_executive_type = 1 THEN 'Grocery Delivery Executive' WHEN delivery_boy_executive_type = 2 THEN 'Merchant Delivery Executive' ELSE 'Unknown Type' END AS executive_name FROM delivery_boy_t WHERE delivery_boy_mobile_number = ? AND delivery_boy_password = ? AND d_in = '0'`;
    var values = [data.number, data.password];

    if (callback && typeof callback === "function") {
        dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, values, cntxtDtls, function (err, results) {
            callback(err, results);
        });
    } else {
        return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, values, cntxtDtls);
    }
};

exports.getnewcurrentordersmdl = function (data, callback) {
 
    var cntxtDtls = "in getnewcurrentordersmdl";
    var QRY_TO_EXEC = `SELECT * FROM order_lst_t WHERE location_id = ? AND order_status ='0' AND d_in = '0'`;
     var values = [data.location_id];
    if (callback && typeof callback === "function") {
        dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, values, cntxtDtls, function (err, results) {
            callback(err, results);
        });
    } else {
        return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, values, cntxtDtls);
    }
};

// exports.getcurrentordersmdl = function (data, callback) {
 
//     if (!data || !data.id) {
//         return callback({ status: 400, msg: "Invalid request: ID is required" }, null);
//     }

//     var cntxtDtls = "in getcurrentordersmdl";
//     var QRY_TO_EXEC2 = `SELECT * FROM delivery_boy_t WHERE delivery_boy_active_status=0 AND id=?`;
//     var values2 = [data.id];

//     dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC2, values2, cntxtDtls, function (err, deliveryboyresult) {
//         if (err) return callback(err, null);

//         var QRY_TO_EXEC;
//         var values = [data.id];

//         if (deliveryboyresult.length === 0) {
//             QRY_TO_EXEC = `SELECT o.delivery_boy_id, o.customer_id, o.order_id, o.customer_mobile_number, o.item_count,s.shop_name,s.shop_phone_number,s.shop_latitude,s.shop_longitude,s.shop_address,
//                 o.delivery_charges, o.total_amount, o.grand_total, o.order_type, o.location_id, o.customer_otp, 
//                 o.vendor_otp, o.order_distance, o.order_latitude, o.order_longitude, o.delivery_address, 
//                 DATE_FORMAT(o.order_date_time, "%h:%i") 
//                 FROM order_lst_t as o 
//                 JOIN category_tbl as c on c.id=o.category_id
//                 JOIN shop_list_t as s on s.id=o.shop_id
//                 WHERE o.delivery_boy_id = 1 AND o.order_status IN (2) 
//                 ORDER BY o.id DESC`;
//         } else {
//             QRY_TO_EXEC = `SELECT o.delivery_boy_id, o.customer_id, o.order_id, o.customer_mobile_number, o.item_count,
//                 o.delivery_charges, o.total_amount, o.grand_total, o.order_type, o.location_id, o.customer_otp, 
//                 o.vendor_otp, o.order_distance, o.order_latitude, o.order_longitude, o.delivery_address, 
//                 DATE_FORMAT(o.order_date_time, "%h:%i"), c.category_name, c.category_image,
//                 so.item_name, so.item_image, so.item_price, so.sub_item_count, so.item_total_amount
//                 FROM order_lst_t as o
//                 JOIN category_tbl as c on c.id=o.category_id
//                 JOIN sub_orders_items_t as so on so.order_id=o.id
//                 JOIN shop_list_t as s ON s.id = o.shop_id
//                 WHERE o.delivery_boy_id = ? AND o.order_status IN (1, 2) 
//                 ORDER BY o.id DESC`;
//         }

//         dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, values, cntxtDtls, function (err, result) {
//             if (err) return callback(err, null);

//             if (!result || result.length === 0) {
//                 return callback(null, { status: 200, delivery_status: deliveryboyresult.length !== 0, data: [] });
//             }

//             callback(null, { status: 200, delivery_status: deliveryboyresult.length !== 0, data: result });
//         });
//     });
// };

exports.getcurrentordersmdl = function (data, callback) {
//  console.log(data,'93')
    if (!data || !data.id) {
        return callback({ status: 400, msg: "Invalid request: ID is required" }, null);
    }
    var cntxtDtls = "in getcurrentordersmdl";
    var checkDeliveryBoyQuery = `SELECT * FROM delivery_boy_t WHERE delivery_boy_active_status = 0 AND id = ?`;
    var deliveryBoyValues = [data.id];
    dbutil.sqlinjection(sqldb.MySQLConPool, checkDeliveryBoyQuery, deliveryBoyValues, cntxtDtls, function (err, deliveryboyresult) {
        if (err) return callback(err, null);
        if (deliveryboyresult.length === 0) {
            return callback(null, { status: 200, delivery_status: false, data: [] });
        }
        // Check if delivery boy has orders with order_status = 2
        var checkOrderQuery = `SELECT o.delivery_boy_id FROM order_lst_t as o WHERE o.delivery_boy_id = ? AND o.order_status IN (2, 8)`;
        var orderValues = [data.id];

        dbutil.sqlinjection(sqldb.MySQLConPool, checkOrderQuery, orderValues, cntxtDtls, function (err, existingOrders) {
            if (err) return callback(err, null);
            var QRY_TO_EXEC;
            var values;
            if (existingOrders.length > 0) {
                // If the delivery boy has orders with order_status = 2, get them
                // QRY_TO_EXEC = `SELECT s.shop_name,s.shop_address,s.shop_longitude,s.shop_name,s.shop_phone_number,s.shop_latitude,o.delivery_boy_id,o.category_id, o.customer_id, o.order_id, o.customer_mobile_number, 
                //         o.item_count, o.delivery_charges, o.total_amount, o.grand_total, o.order_type, o.location_id, o.id,o.order_status,
                //         o.customer_otp, o.vendor_otp, o.order_distance, o.order_latitude, o.order_longitude, o.order_date,
                //         o.delivery_address, DATE_FORMAT(o.order_date_time, "%h:%i") ,so.item_name, so.item_image, so.item_price, so.sub_item_count, so.item_total_amount
                //         FROM order_lst_t as o
                //           JOIN category_tbl as c on c.id = o.category_id
                //         JOIN sub_orders_items_t as so on so.order_id = o.id
                //         JOIN shop_list_t as s ON s.id = o.shop_id
                //         WHERE o.delivery_boy_id = ? AND o.order_status IN (2, 8)
                //         ORDER BY o.id DESC`;
                        
                        
                     QRY_TO_EXEC=`SELECT 
  o.id AS order_id,o.payment_type,
  o.order_id AS order_ids,
  s.shop_name,
  s.shop_address,
  s.shop_longitude,
  s.shop_latitude,
  s.shop_phone_number,
  o.delivery_boy_id,
  o.customer_id,
  o.category_id,
  o.customer_mobile_number,
  o.item_count,
  o.delivery_charges,
  o.total_amount,
  o.grand_total,
  o.order_type,
  o.location_id,
  o.order_status,
  o.customer_otp,
  o.vendor_otp,
  o.order_distance,
  o.order_latitude,
  o.order_longitude,
  o.order_date,
  o.delivery_address,
  DATE_FORMAT(o.order_date_time,"%h:%i %p") AS order_time,

  -- Aggregate item fields
  GROUP_CONCAT(so.item_name SEPARATOR '|') AS item_names,
  GROUP_CONCAT(so.item_image SEPARATOR '|') AS item_images,
  GROUP_CONCAT(so.item_price SEPARATOR '|') AS item_prices,
  GROUP_CONCAT(so.sub_item_count SEPARATOR '|') AS item_counts,
  GROUP_CONCAT(so.item_total_amount SEPARATOR '|') AS item_totals

FROM order_lst_t AS o
JOIN category_tbl AS c ON c.id = o.category_id
JOIN sub_orders_items_t AS so ON so.order_id = o.id
JOIN shop_list_t AS s ON s.id = o.shop_id

WHERE o.delivery_boy_id = ? AND o.order_status IN (2, 8)

GROUP BY o.id
ORDER BY o.id DESC;`   
                        
                        
                values = [data.id];
                    
            } else {
                // If no orders with order_status = 2, get new orders with order_status = 1 for the same location_id
                // QRY_TO_EXEC = `SELECT s.shop_name,s.shop_address,s.shop_longitude,s.shop_name,s.shop_phone_number,s.shop_latitude,o.delivery_boy_id,o.category_id, o.customer_id, o.order_id, o.customer_mobile_number, 
                //         o.item_count, o.delivery_charges, o.total_amount, o.grand_total, o.order_type, o.location_id, o.order_status,
                //         o.customer_otp, o.vendor_otp, o.order_distance, o.order_latitude, o.order_longitude, 
                //         o.delivery_address, DATE_FORMAT(o.order_date_time, "%h:%i"), c.category_name, c.category_image, 
                //         so.item_name, so.item_image, so.item_price, so.sub_item_count, so.item_total_amount
                //         FROM order_lst_t as o
                //         JOIN category_tbl as c on c.id = o.category_id
                //         JOIN sub_orders_items_t as so on so.order_id = o.id
                //         JOIN shop_list_t as s ON s.id = o.shop_id
                //         WHERE o.location_id = ? AND o.order_status = 1
                //         ORDER BY o.id DESC`;
                // QRY_TO_EXEC=`SELECT s.shop_name,s.shop_address,s.shop_longitude,s.shop_name,s.shop_phone_number,s.shop_latitude,o.delivery_boy_id,o.category_id, o.customer_id, o.order_id, o.customer_mobile_number, 
                //         o.item_count, o.delivery_charges, o.total_amount, o.grand_total, o.order_type, o.location_id, o.order_status,o.id,o.order_date,
                //         o.customer_otp, o.vendor_otp, o.order_distance, o.order_latitude, o.order_longitude, o.item_count,o.grand_total,o.actual_total_amount,
                //         o.delivery_address, DATE_FORMAT(o.order_date_time, "%h:%i"), c.category_name, c.category_image, 
                //         o.id
                //         FROM order_lst_t as o
                //         JOIN category_tbl as c on c.id = o.category_id
                //         JOIN shop_list_t as s ON s.id = o.shop_id
                //         WHERE o.location_id = ? AND o.order_status = 1 and o.d_in='0'
                //         ORDER BY o.id DESC`;
                 QRY_TO_EXEC=`SELECT s.shop_name,s.shop_address,s.shop_longitude,s.shop_name,s.shop_phone_number,s.shop_latitude,o.delivery_boy_id, o.customer_id,o.category_id, o.order_id,o.payment_type, o.customer_mobile_number, 
                        o.item_count, o.delivery_charges, o.total_amount, o.grand_total, o.order_type, o.location_id, o.order_status,o.id,o.order_date,
                        o.customer_otp, o.vendor_otp, o.order_distance, o.order_latitude, o.order_longitude, o.item_count,o.grand_total,o.actual_total_amount,
                        o.delivery_address, DATE_FORMAT(o.order_date_time, "%h:%i"), c.category_name, c.category_image, 
                        o.id As order_id ,o.order_id As order_ids, DATE_FORMAT(o.order_date_time, "%h:%i %p") AS order_time
                        FROM order_lst_t as o
                        JOIN category_tbl as c on c.id = o.category_id
                        JOIN shop_list_t as s ON s.id = o.shop_id
                        WHERE o.location_id = ? AND o.order_status = 1 and o.d_in='0'
                        ORDER BY o.id DESC`
                values = [data.delivery_boy_location_id];
          
            }
            
            
            dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, values, cntxtDtls, function (err, result) {
                if (err) return callback(err, null);

                return callback(null, { status: 200, delivery_status: true, data: result || [] });
            });
        });
    });
};






exports.getorderdetailsCtrlMdl = function (data, callback) {
    var cntxtDtls = "in getorderdetailsCtrlMdl";
    var QRY_TO_EXEC = `SELECT  s.shop_name, s.shop_unique_id,s.shop_address, s.category_id,s.shop_latitude,s.shop_longitude,s.shop_phone_number,o.customer_name,o.customer_mobile_number, f.franchise_name, f.franchise_mobile_number, f.location_id, o.id,o.slot_indication, o.vendor_otp, o.order_id,o.delivery_instruction, o.item_count, o.total_amount, o.payment_type, o.order_status,  o.order_date_time, o.order_instructions, o.payment_id, o.slot_timings, o.delivery_address, o.order_latitude, o.order_longitude, o.delivery_boy_array, o.delivery_boy_latitude, o.delivery_boy_longitude, DATE_FORMAT(o.order_date, "%d/%m/%Y") AS order_date, DATE_FORMAT(o.order_date_time, "%h:%i %p") AS order_time FROM order_lst_t AS o JOIN franchise_t AS f ON f.location_id = o.location_id JOIN shop_list_t AS s ON s.id = o.shop_id WHERE o.id = ?`;

    var values = [data.order_id];

    dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, values, cntxtDtls, function (err, orderresult) {
        if (err) return callback(err);
        var QRY_TO_EXEC2 = `SELECT * FROM sub_orders_items_t WHERE order_id = ?`;
        var values2 = [data.order_id]; // Corrected from data.orderid to data.order_id
        dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC2, values2, cntxtDtls, function (err, orderItems) {
            if (err) return callback(err);

            callback(null, { status: 200, orderdata: orderresult, orderitemdata: orderItems });
        });
    });
};


exports.updateorderstatusmdl = function (data, callback) {
    var cntxtDtls = "in updateorderstatusmdl";
     var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
    var QRY_TO_EXEC = `UPDATE order_lst_t 
        SET delivery_boy_array = ?, delivery_boy_id = ?, order_status = ? ,delivery_accepted_date_time=?
        WHERE order_status = 1 AND id = ?`;
    // Convert deliveryarr to a JSON string before inserting
    var values = [JSON.stringify(data.deliveryarr), data.id, data.order_status,date, data.order_id];

    dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, values, cntxtDtls, function (err, results) {
        if (err) {
            return callback(err, null);
        }
        callback(null, results);
    });
};


exports.checkdeliveryacceptstatusmdl = function (data, callback) {
    var cntxtDtls = "in checkdeliveryacceptstatusmdl";
    var QRY_TO_EXEC2 = `SELECT d.delivery_boy_player_id, d.delivery_max_service_km, 
        (12742 * asin(sqrt(0.5 - cos((d.delivery_boy_latitude - s.shop_latitude) * 0.01745329251) / 2 + 
        cos(s.shop_latitude * 0.01745329251) * cos(d.delivery_boy_latitude * 0.01745329251) * 
        (1 - cos((d.delivery_boy_longitude - s.shop_longitude) * 0.01745329251)) / 2))) AS distance 
        FROM delivery_boy_t AS d  
        JOIN order_lst_t AS o ON o.id = ?  
        JOIN shop_list_t AS s ON s.id = o.shop_id                 
        WHERE o.order_status = 1 AND d.active_status = 0 AND d.id = ?  
        HAVING distance < d.delivery_max_service_km`;
    
    var values = [data.order_id, data.id];

    dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC2, values, cntxtDtls, function (err, delres) {
        if (err) {
            return callback(err, null);
        }
        callback(null, { status: 200, data: delres });
    });
};


exports.updatedeliverylatlngmdl = function (data, callback) {
    var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
    var cntxtDtls = "in updatedeliverylatlngmdl";
    var QRY_TO_EXEC2 = `UPDATE delivery_boy_t SET delivery_boy_latitude= ?, delivery_boy_longitude= ?, 
                        delivery_boy_lat_lng_time= ? WHERE id = ?`;
    var values = [data.latitude, data.longitude, date, data.id];

    dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC2, values, cntxtDtls, function (err, delres) {
        if (err) {
            return callback(err, null);
        }
        callback(null, { status: 200, data: delres });
    });
};



exports.updatedeliveryotpmdl = function (data, callback) {
    var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
    var cntxtDtls = "in updatedeliveryotpmdl";
    var QRY_TO_EXEC2 = `UPDATE order_lst_t SET order_status= '2',deliveryboy_pickup_time= ?,vendor_otp=? WHERE  id =?`;
    var values = [date,data.vendor_otp, data.id];

    dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC2, values, cntxtDtls, function (err, delres) {
        if (err) {
            return callback(err, null);
        }
        callback(null, { status: 200, data: delres });
    });
};

exports.completedordermdl = function (data, imageupload, callback) {
	var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	const updateQuery = `UPDATE order_lst_t SET order_status= '3',customer_otp='0',image_capture_at_customer = ?,order_deliverd_date_time = ?,customer_otp=? WHERE delivery_boy_id=? and id=?`;
	const updateValues = [imageupload, date, data.delivery_otp, data.deliveryboy_id, data.order_id];

	dbutil.sqlinjection(sqldb.MySQLConPool, updateQuery, updateValues, 'in completedordermdl', function (err, result) {
		if (err) {
			callback(err);
			return;
		}
		const selectQuery = `SELECT * FROM order_lst_t WHERE id = ?`;
		const selectValues = [data.order_id];

		dbutil.sqlinjection(sqldb.MySQLConPool, selectQuery, selectValues, 'in completedordermdl select', function (err2, updatedRow) {
			if (err2) {
				callback(err2);
				return;
			}

			callback(null, updatedRow[0]); // Send back updated row
		});
	});
};

exports.getprofiledataCtrlmdl = function (data, callback) {
 
    var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
    var cntxtDtls = "in getprofiledataCtrlmdl";
    var QRY_TO_EXEC2 = `select *, CASE WHEN delivery_boy_executive_type = 1 THEN 'Grocery Delivery Executive' WHEN delivery_boy_executive_type = 2 THEN 'Merchant Delivery Executive' ELSE 'Unknown Type' END AS executive_name from delivery_boy_t where d_in='0' and id=?`;
    var values = [data.id];
    dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC2, values, cntxtDtls, function (err, delres) {
        if (err) {
            return callback(err, null);
        }
        callback(null, { status: 200, data: delres });
    });
};



exports.updateprofiledatamdl = function (data,imageupload, callback) {
    var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
    var cntxtDtls = "in updateprofiledatamdl";
    var QRY_TO_EXEC2 = `UPDATE delivery_boy_t SET delivery_boy_name= ?,delivery_boy_mobile_number=?,delivery_boy_password=?,delivery_boy_address=?, profile_img = ? WHERE id=?`;
    var values = [data.name,data.mobilenumber, data.password,data.address,imageupload,data.id];
    console.log(QRY_TO_EXEC2,values)
    dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC2, values, cntxtDtls, function (err, delres) {
        if (err) {
            return callback(err, null);
        }
        callback(null, { status: 200, data: delres });
    });
};



exports.updateoderstatdatamdl = function (data,imageupload, callback) {
    var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
    var cntxtDtls = "in updateoderstatdatamdl";
    var QRY_TO_EXEC2 = `UPDATE order_lst_t SET order_status='2',vendor_otp='0',	image_capture_at_vendor = ?,deliveryboy_pickup_time = ? WHERE id=?`;
    var values = [imageupload,date,data.id];
    dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC2, values, cntxtDtls, function (err, delres) {
        if (err) {
            return callback(err, null);
        }
        callback(null, { status: 200, data: delres });
    });
};



exports.updatelatlongsdatamdl = function (data, callback) {
    var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
    var cntxtDtls = "in updatelatlongsdatamdl";

    var QRY_TO_EXEC2 = `
        UPDATE order_lst_t 
        SET delivery_boy_latitude = ?, delivery_boy_longitude = ? 
        WHERE id = ?;

        UPDATE delivery_boy_t 
        SET delivery_boy_latitude = ?, delivery_boy_longitude = ?
        WHERE id = ?;
    `;

    var values = [
        data.latitude, data.longitude, data.order_id,  // First UPDATE statement
        data.latitude, data.longitude,  data.id  // Second UPDATE statement (with time)
    ];

    dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC2, values, cntxtDtls, function (err, delres) {
        if (err) {
            return callback(err, null);
        }
        callback(null, { status: 200, data: delres });
    });
};




exports.getordersdatewisemdl = function (data, callback) {
    var cntxtDtls = "in getordersdatewisemdl";
    var category_id = ``;
	if(data.delivery_boy_executive_type == 2){
   category_id = ` AND o.category_id != 4`; 
} else {
    category_id = ` AND o.category_id = 4`;  // use single =
}
    var QRY_TO_EXEC2 = `select s.shop_name, s.shop_unique_id, s.category_id, 
                        f.franchise_name, f.franchise_mobile_number, f.location_id,o.customer_name,o.customer_mobile_number,o.grand_total,
                        o.id, o.vendor_otp, o.order_id, 
                        o.item_count, o.total_amount, o.payment_type, o.order_status, 
                        o.order_date_time, o.order_instructions, o.payment_id, 
                        o.slot_timings, o.delivery_address, o.order_latitude, o.order_longitude, 
                        o.delivery_boy_array, o.delivery_boy_latitude, o.delivery_boy_longitude, 
                        DATE_FORMAT(o.order_date, "%d/%m/%Y") AS order_date  FROM order_lst_t AS o 
  JOIN franchise_t AS f ON f.location_id = o.location_id 
  JOIN shop_list_t AS s ON s.id = o.shop_id LEFT JOIN delivery_boy_t as d ON d.id = o.delivery_boy_id
     WHERE o.delivery_boy_id=? AND d.delivery_boy_executive_type =? and o.order_date >=? and o.order_date <=? AND o.order_status in (3,8,5) ${category_id};`;
    var values = [data.emp_id,data.delivery_boy_executive_type,data.f_date,data.t_date];
    console.log(QRY_TO_EXEC2, values)
    dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC2, values, cntxtDtls, function (err, delres) {
        if (err) {
            return callback(err, null);
        }
        callback(null, { status: 200, data: delres });
    });
};

exports.updateplayeridmdl = function (data, callback) {
    var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
    var cntxtDtls = "in updateplayeridmdl";
    var QRY_TO_EXEC2 = `UPDATE delivery_boy_t SET delivery_boy_player_id=? WHERE id=?`;
    var values = [data.player_id,data.id];
    dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC2, values, cntxtDtls, function (err, delres) {
        if (err) {
            return callback(err, null);
        }
        callback(null, { status: 200, data: delres });
    });
};

exports.getordercounts = function (data, callback) {
	var cntxtDtls = "in getordercounts";
	const currentDate = new Date().toISOString().split('T')[0];
	if(data.delivery_boy_executive_type==2){
	    var QRY_TO_EXEC = `SELECT COUNT(*) AS total_orders, COUNT(CASE WHEN order_status = '3'  THEN 1 END) AS completed_orders, COUNT(CASE WHEN order_status IN (2,6)  THEN 1 END) AS incompleted_orders FROM order_lst_t WHERE location_id = ? AND delivery_boy_id = ? and category_id!=4 AND DATE(order_date_time) = ?;`;
	} else {
	    var QRY_TO_EXEC = `SELECT COUNT(*) AS total_orders, COUNT(CASE WHEN order_status = '3'  THEN 1 END) AS completed_orders, COUNT(CASE WHEN order_status = '2'  THEN 1 END) AS incompleted_orders FROM order_lst_t WHERE location_id = ? AND delivery_boy_id = ? and category_id=4 AND DATE(order_date_time) = ?;`;
	}
	let params = [data.location_id, data.delivery_boy_id,currentDate]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.getordercountsdetails = function (data, callback) {
	var cntxtDtls = "in getordercountsdetails";
	const currentDate = new Date().toISOString().split('T')[0];
	let QRY_TO_EXEC = '';
	let params = [];
	var category_id = ``;
	if(data.delivery_boy_executive_type==2){
	   category_id = ` AND a.category_id !=4`; 
	} else {
	    category_id = ` AND a.category_id ==4`; 
	}

	if (data.order_status == 1) {
		QRY_TO_EXEC = `
			SELECT  a.id,a.order_id, DATE_FORMAT(a.order_date_time, "%h:%i %p") AS order_time,a.payment_type,a.grand_total,a.order_date_time,a.delivery_address,b.shop_name,a.order_status FROM order_lst_t as a LEFT JOIN shop_list_t as b ON a.shop_id = b.id 
			WHERE a.delivery_boy_id = ? AND a.location_id = ? AND DATE(order_date_time) = ? ${category_id};
		`;
		params = [data.delivery_boy_id, data.location_id,currentDate];
		
	} else if (data.order_status == 3) {
		QRY_TO_EXEC = `
			SELECT a.id, a.order_id,DATE_FORMAT(a.order_date_time, "%h:%i %p") AS order_time,a.payment_type,a.grand_total,a.order_date_time,a.delivery_address,b.shop_name,a.order_status FROM order_lst_t as a LEFT JOIN shop_list_t as b ON a.shop_id = b.id 
			WHERE a.delivery_boy_id = ? AND a.location_id = ? AND a.order_status = ? AND DATE(order_date_time) = ? ${category_id};		`;
		params = [data.delivery_boy_id, data.location_id, data.order_status,currentDate];
	}else if (data.order_status == 2){
		QRY_TO_EXEC = `
			SELECT  a.id,a.order_id,DATE_FORMAT(a.order_date_time, "%h:%i %p") AS order_time,a.payment_type,a.grand_total,a.order_date_time,a.delivery_address,b.shop_name,a.order_status FROM order_lst_t as a LEFT JOIN shop_list_t as b ON a.shop_id = b.id 
			WHERE a.delivery_boy_id = ? AND a.location_id = ? AND a.order_status in (2,6) AND DATE(order_date_time) = ? ${category_id};
		`;
		params = [data.delivery_boy_id, data.location_id,currentDate];
	}
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};


exports.deliveryboypayments = function (data, callback) {
    var cntxtDtls = "in deliveryboypayments";
    var QRY_TO_EXEC2 = `SELECT a.deliveryboy_payment_otp, b.delivery_boy_id as deliveryboy_id, COUNT(b.id) AS total_orders, CONCAT(MIN(b.order_date), ' - ', MAX(b.order_date)) AS date_range, ROUND(SUM(b.grand_total),2) AS total_amount, JSON_ARRAYAGG(b.id) AS order_ids, SUM(b.delivery_charges) AS delivery_charges, SUM(CASE WHEN b.payment_type = 'Cash on Delivery' THEN 1 ELSE 0 END) AS cod_count, SUM(CASE WHEN b.payment_type = 'Pay Online' THEN 1 ELSE 0 END) AS pay_online_count, ROUND(SUM(CASE WHEN b.payment_type = 'Cash on Delivery' THEN b.grand_total ELSE 0 END),2) AS cod_amount, ROUND(SUM(CASE WHEN b.payment_type = 'Pay Online' THEN b.grand_total ELSE 0 END),2) AS pay_online_amount FROM order_lst_t AS b JOIN delivery_boy_t as a ON a.id = b.delivery_boy_id WHERE b.delivery_boy_payment_status = 0 AND b.order_status = 3 AND b.delivery_boy_id = ? `;
    var values = [data.deliveryboy_id];
    
    if (data.delivery_boy_executive_type == 2) {
		QRY_TO_EXEC2 += ` AND b.category_id != ?`;
		values.push(4);
	} else {
		QRY_TO_EXEC2 += ` AND b.category_id = ?`;
		values.push(4);
	}
    
    dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC2, values, cntxtDtls, function (err, delres) {
        if (err) {
            return callback(err, null);
        }
        callback(null, { status: 200, data: delres });
    });
};

exports.getdeliveryboyincentivesamount = function (data, callback) {
	var cntxtDtls = "in getdeliveryboyincentivesamount";
	var QRY_TO_EXEC = `Select a.order_deliverd_date_time,DATE_FORMAT(a.order_deliverd_date_time, '%d-%m-%Y') AS order_deliverd_date,COUNT(a.id) as total_orders_per_day FROM order_lst_t as a where a.delivery_boy_id = ? AND a.order_status = ? AND a.delivery_boy_payment_status = ? `;

	let value = [data.deliveryboy_id, 3, 0]

	if (data.delivery_boy_executive_type == 2) {
		QRY_TO_EXEC += ` AND a.category_id != ?`;
		value.push(4);
	} else {
		QRY_TO_EXEC += ` AND a.category_id = ?`;
		value.push(4);
	}

	QRY_TO_EXEC += ` GROUP BY DATE(a.order_deliverd_date_time)`;

	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, value, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, value, cntxtDtls);
};

exports.getincentivesdata = function (data, callback) {
	var cntxtDtls = "in getincentivesdata";
	var QRY_TO_EXEC = `SELECT a.order_count, a.each_order_earn FROM delivery_boy_incentives_t as a WHERE a.delivery_executive_type = ?`;

	let value = [data.delivery_boy_executive_type];

	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, value, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, value, cntxtDtls);
};

exports.updatedeliveryboywalletamount = function (netAmount,updatedOrder, data, callback) {
	var cntxtDtls = "in updatedeliveryboywalletamount";
	var QRY_TO_EXEC = `UPDATE delivery_boy_t SET `;
	let value = [];

	if (data.delivery_boy_executive_type == 2) {
		QRY_TO_EXEC += ` merchant_wallet_amount = ?`;
	} else {
		QRY_TO_EXEC += ` grocery_wallet_amount = ?`;
	}
	QRY_TO_EXEC += ` WHERE id = ?`;

	value.push(netAmount, data.deliveryboy_id);

	dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, value, cntxtDtls, function (err, results) {
		if (err) {
			callback && callback(err);
			return;
		}

		const insertQuery = `INSERT INTO deliveryboy_order_records_t 
            (order_id,deliveryboy_id, grand_total, payment_type, order_date_time) 
            VALUES (?, ?, ?, ?, ?)`;

		const insertValues = [
			updatedOrder.id,
			updatedOrder.delivery_boy_id || 0,
			updatedOrder.grand_total || 0,
			updatedOrder.payment_type || 0,
			updatedOrder.order_date_time || 0
		];

		dbutil.sqlinjection(sqldb.MySQLConPool, insertQuery, insertValues, 'in insert deliveryboy_payment_history', function (insertErr, insertRes) {
			if (insertErr) {
				callback && callback(insertErr);
				return;
			}
			callback && callback(null, { update: results, insert: insertRes });
		});
	});
};


exports.deliveryboypaymentreports = function (data, callback) {
    var cntxtDtls = "in deliveryboypaymentreports";
    var QRY_TO_EXEC2 = `SELECT * FROM deliveryboy_payment_t where deliveryboy_id = ? AND executive_mode = ? AND DATE(payment_date_time) BETWEEN ? AND ?;`;
    var values = [data.deliveryboy_id,data.delivery_boy_executive_type,data.fromdate,data.todate];
    dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC2, values, cntxtDtls, function (err, delres) {
        if (err) {
            return callback(err, null);
        }
        callback(null, { status: 200, data: delres });
    });
};

exports.getdelboypaymentincentiveshistory = function (data, callback) {
	var cntxtDtls = "in getdelboypaymentincentiveshistory";
	var QRY_TO_EXEC = `select * From deliveryboy_payment_incentives_t where payment_id = ? ;`;
	let value = [data.payment_id]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, value, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, value, cntxtDtls);
};

exports.postplayer_idmdl = function (dataarr, callback) {
	var cntxtDtls = "in postplayer_idmdl";
	var QRY_TO_EXEC = `INSERT INTO player_ids_list_t (user_id , player_id, user_type,location_id) VALUES (?, ? , ? ,?);`;
	
	let params = [dataarr.user_id, dataarr.player_id, dataarr.user_type, dataarr.location_id];
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.checkpublic_playeridMdl = function (dataarr, callback) {
	var cntxtDtls = "in checkpublic_playeridMdl";
	var QRY_TO_EXEC = `SELECT * FROM player_ids_list_t WHERE player_id=?`
	let params = [dataarr.player_id];
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.insertcustomerplayerid = function (dataarr, callback) {
	var cntxtDtls = "in insertcustomerplayerid";
	var QRY_TO_EXEC = "UPDATE player_ids_list_t SET user_id = ?, user_type = ?, location_id = ? WHERE player_id = ?;";
	let params = [dataarr.user_id, 2 , dataarr.location_id, dataarr.player_id];


	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.deliveryboyactivestatus = function (data, callback) {
	var cntxtDtls = "in deliveryboyactivestatus";
		var QRY_TO_EXEC = `update delivery_boy_t set delivery_boy_active_status = ? where id = ?;`;
	var params = [data.active_status, data.deliveryboy_id]

	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

