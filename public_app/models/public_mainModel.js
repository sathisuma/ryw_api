
const { log } = require('forever');
var sqldb = require('../../config/dbconnect');
var dbutil = require(appRoot + '/utils/dbutils');
var moment = require('moment');




exports.getserviceslistMdl = function (callback) {
	var cntxtDtls = "in getserviceslistMdl";
	var QRY_TO_EXEC = `SELECT * FROM location_tbl WHERE location_status=0 order by location_name;`;

	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.getuserlocationMdl = function (dataarr, callback) {
	var cntxtDtls = "in getuserlocationMdl";
	var QRY_TO_EXEC = `SELECT id, location_image,   location_name, location_latitude, 
       location_longitude, 
       maximum_delivery_service_km,
       ROUND(12742 * ASIN(SQRT(0.5 - COS((location_latitude-?) * 0.01745329251) / 2 + COS(? * 0.01745329251) * COS(location_latitude * 0.01745329251) * (1 - COS((location_longitude-?) * 0.01745329251)) / 2)), 2) AS distance 
FROM location_tbl 
WHERE location_status = "0" 
HAVING distance < maximum_delivery_service_km 
ORDER BY distance, location_name ASC 
LIMIT 1;
`;


	let params = [dataarr.location_latitude, dataarr.location_latitude, dataarr.location_longitude]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};


exports.getlocationctgrylistMdl = function (callback) {
	var cntxtDtls = "in getlocationctgrylistMdl";
	var QRY_TO_EXEC = `SELECT id,category_name,category_image,category_ind,shop_items_tb_nm , regular_status,order_offer_amount,category_gst FROM category_tbl WHERE d_in=0 and category_active_status=0 order BY category_order`;

	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

// exports.getbannerslistMdl = function (dataarr, callback) {
// 	var cntxtDtls = "in getbannerslistMdl";	
// 	var QRY_TO_EXEC = `SELECT * FROM banners_lst_t WHERE d_in=0 AND location_id=? and category_id in (0,?)  ORDER BY id DESC`;

// 	let params = [dataarr.location_id,dataarr.category_id]
// 	if (callback && typeof callback == "function") {
// 		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
// 			callback(err, results);
// 			return;
// 		});
// 	}
// 	else
// 		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
// };

exports.getshopsubcategorylistMdl = function (dataarr, callback) {
	var cntxtDtls = "in getshopsubcategorylistMdl";
	var QRY_TO_EXEC = `SELECT id,GROUP_CONCAT(shop_id) as shop_id,category_id,sub_category_id,sub_category_name,sub_category_image,subcategory_tag_line  FROM shop_subcategory_list_t WHERE  d_in=0 and category_id=? and location_id=? GROUP BY sub_category_id ORDER BY sub_category_name;`;

	let params = [dataarr.category_id, dataarr.location_id]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};




exports.getbannerslistMdl = function (dataarr, callback) {
	var cntxtDtls = "in getbannerslistMdl";
	// var QRY_TO_EXEC = `SELECT id,location_id,banner_image,item_id,shop_id FROM banners_lst_t WHERE location_id IN (0,?) and category_id in (0,?) and d_in=0 ORDER BY id DESC`;
	var QRY_TO_EXEC = `SELECT * FROM banners_lst_t WHERE location_id IN (0,?) and category_id in (0,?) and d_in=0 ORDER BY id DESC`;
	
	let params = [dataarr.location_id,dataarr.category_id]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.getcategorybannerslistMdl = function (dataarr, callback) {
	var cntxtDtls = "in getcategorybannerslistMdl";
	var QRY_TO_EXEC = `SELECT id,location_id,categorybanner_image FROM category_banners_t WHERE location_id IN (0,?) and category_id in (0,?) and d_in=0 ORDER BY id DESC;`;
	
	let params = [dataarr.location_id,dataarr.category_id]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};



exports.getshoplistMdl = function (dataarr, callback) {
	const cntxtDtls = "in getshoplistMdl";
	let shop_id = '';
	if (dataarr.shop_id !== 0) {
		shop_id = `AND id IN (${dataarr.shop_id})`;
	}
	var current_time = moment().utcOffset("+05:30").format("HH:mm:ss");

	// SQL query template
	const QRY_TO_EXEC = `
    SELECT CASE WHEN shop_active_status = 1 THEN shop_active_status ELSE '0' END AS shop_org_active_status,
        CASE
            WHEN shop_active_status = 0 AND shop_open_time <= '${current_time}' AND shop_close_time2 >= '${current_time}' THEN 0
            WHEN shop_active_status = 0 AND shop_open_time2 <= '${current_time}' AND shop_close_time >= '${current_time}' THEN 0
            ELSE 1
        END AS shop_active_status,shop_items_tb_nm,packing_charges,
        coupon_status, del_charges_status, shop_image,YEAR(i_ts) AS shop_since,shop_unique_id,
        shop_open_time2, shop_close_time2, shop_open_time, shop_close_time, category_id, minimum_order, id AS shop_id, admin_percentage, minimum_km, minimum_del_charge, per_km_chargers, maximum_del_km, shop_name, shop_address,short_address, shop_phone_number, acceptTerms, special_offer_name, shop_rating,rating_count, shop_player_id, shop_gst_number, shop_fssai_lic,
        shop_active_status_name, shop_latitude, shop_longitude,special_offer_status,location_id,registered_shop_name,common_item_ind,
        (12742 * ASIN(SQRT(0.5 - COS((shop_latitude-?) * 0.01745329251) / 2 + COS(? * 0.01745329251) * COS(shop_latitude * 0.01745329251) * (1 - COS((shop_longitude-?) * 0.01745329251)) / 2))) AS distance
    FROM shop_list_t 
    WHERE d_in = 0 and public_visibility=0
    AND location_id = ? 
    AND category_id = ?

    ${shop_id}
    HAVING distance < maximum_del_km 
    ORDER BY shop_active_status;

    SELECT id, GROUP_CONCAT(shop_id), filter_id, filter_name 
    FROM shop_filter_list_t 
    WHERE d_in = 0 
    AND location_id = ? 
    AND category_id = ?
    GROUP BY filter_name;`

	//   ${shop_id}
	// Prepare parameters for query execution
	let params = [
		dataarr.shop_latitude, dataarr.shop_latitude, dataarr.shop_longitude,
		dataarr.location_id, dataarr.category_id,
		dataarr.location_id, dataarr.category_id
	];

	// if (dataarr.shop_id != 0) {
	// 	params.push(dataarr.shop_id);
	// }

	// Execute query with callback or return promise based on presence of callback
	if (callback && typeof callback === "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
		});
	} else {
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
	}
};


exports.getitemslistMdl = function (dataarr, callback) {
	var cntxtDtls = "in getitemslistMdl";
	// var QRY_TO_EXEC = `SELECT prescription_required,quantity_type,unique_code,id, shop_id, item_name, item_image, item_description,full_description, category_id, category_name, sub_category_id, sub_category_name, filter_one, actual_price, selling_price, discount_percentage, discount_amount, active_status, admin_percentage,item_gst FROM ?? WHERE d_in = 0 AND shop_id = ?   AND active_status=0 `;

	var QRY_TO_EXEC = `SELECT prescription_required,quantity_type,unique_code,id, shop_id, item_name, item_image, item_description,full_description, category_id, category_name, sub_category_id, sub_category_name, filter_one,filter_two, actual_price, selling_price, discount_percentage, discount_amount, active_status, admin_percentage,item_gst FROM ?? WHERE d_in = 0 AND shop_id = ?   AND active_status=0 `;

	let params = [dataarr.shop_items_tb_nm, dataarr.shop_id]; // table name and shop_id

	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	} else {
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
	}
};

exports.getrelateditemslistMdl = function (dataarr, callback) {
	var cntxtDtls = "in getrelateditemslistMdl";
	// var QRY_TO_EXEC = `SELECT unique_code,id,quantity_varient,quantity_type,filter_one, shop_id, item_name, item_image, item_description, category_id, category_name, sub_category_id, sub_category_name, filter_one, actual_price, selling_price, discount_percentage, discount_amount, active_status, admin_percentage,item_gst FROM ?? WHERE d_in = 0 AND shop_id = ? AND unique_code = ?`;
	var QRY_TO_EXEC = `SELECT *  FROM shop_extra_items_t WHERE item_id in (?,0) AND shop_id = ? AND d_in = 0  `;

	// let params = [dataarr.shop_items_tb_nm, dataarr.shop_id, dataarr.unique_code]; // table name and shop_id
	let params = [dataarr.id, dataarr.shop_id];

	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	} else {
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
	}
};



exports.coupon_listMdl = function (dataarr, callback) {
	var cntxtDtls = "in coupon_listMdl";
	
	
	var QRY_TO_EXEC = `SELECT id,location_id,shop_id,coupon_name,coupon_description,coupon_percentage,coupon_upto_price,coupon_type,coupon_user_permission,coupon_category_id,coupon_max_price_limit FROM coupon_code_t where d_in=0 AND location_id=? and
	coupon_category_id in (0,?) and shop_id in (0,?) AND coupon_status=0 ORDER BY id DESC;`;

	let params = [dataarr.location_id, dataarr.coupon_category_id, dataarr.shop_id]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};


exports.notificationslistMdl = function (dataarr, callback) {
	var cntxtDtls = "in notificationslistMdl";
	var QRY_TO_EXEC = `SELECT id,notification_title,notification_description FROM notifications_t WHERE d_in=0 AND location_id=?`;

	let params = [dataarr.location_id]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};


exports.customerloginMdl = function (dataarr, callback) {
	var cntxtDtls = "in customerloginMdl";
	var QRY_TO_EXEC = `SELECT id,customer_name,customer_mobile_number,profile_image,customer_email FROM customer_list_t WHERE d_in=0 AND customer_mobile_number=?`;

	let params = [dataarr.customer_mobile_number]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};



exports.insertcustomerMdl = function (dataarr, callback) {
	var cntxtDtls = "in insertcustomerMdl";
	var current_date_time = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	var QRY_TO_EXEC = `INSERT INTO customer_list_t (customer_mobile_number,  customer_otp, i_ts) VALUES (?, ?, ?);`;

	// Prepare the parameters array
	let params = [dataarr.customer_mobile_number, dataarr.customer_otp, current_date_time];

	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.updatecustomerMdl = function (dataarr, callback) {
	var cntxtDtls = "in updatecustomerMdl";
	var QRY_TO_EXEC = `UPDATE customer_list_t SET customer_otp = ? WHERE customer_mobile_number = ?;`;

	// Prepare the parameters array
	let params = [dataarr.customer_otp, dataarr.customer_mobile_number];

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
	let params = [dataarr.user_id, 0, dataarr.location_id, dataarr.player_id];


	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};


exports.checkshopstatusMdl = function (shop_id, callback) {
	var cntxtDtls = "in checkshopstatusMdl";
	var QRY_TO_EXEC = `SELECT id,shop_name,shop_active_status FROM shop_list_t WHERE id = ? and shop_active_status=0 LIMIT 1`;

	let params = [shop_id]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.orderplacedMdl = function (dataarr, callback) {
	var cntxtDtls = "in orderplacedMdl";
	
	var QRY_TO_EXEC = ` INSERT INTO order_lst_t (
        order_id, customer_id, customer_name, customer_mobile_number, 
        category_id, admin_percentage, item_count, 
        total_amount, total_saving_amount, coupon_amount, delivery_charges, 
        grand_total, location_id, location_name, payment_type, payment_id, 
        razorpay_order_id, order_status, order_date, order_date_time, 
        order_instructions, coupon_type, coupon_id, delivery_address, 
        order_latitude, order_longitude, slot_timings, order_distance, 
        ext_del_charge, shop_id, vendor_otp, customer_otp, actual_total_amount, order_type, i_ts,delivery_charges_gst,handling_charges,packing_charges,packing_charges_gst,donation_charges,total_item_gst_amount,razorpay_charges,razorpay_gst,delivery_instruction,slot_indication,slot_date,slot_time,surcharges
    )  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`

	let params = [dataarr.order_id, dataarr.customer_id, dataarr.customer_name, dataarr.customer_mobile_number, dataarr.category_id, dataarr.admin_percentage, dataarr.item_count, dataarr.total_amount, dataarr.total_saving_amount, dataarr.coupon_amount, dataarr.delivery_charges, dataarr.grand_total, dataarr.location_id, dataarr.location_name, dataarr.payment_type, dataarr.payment_id, dataarr.razorpay_order_id || null, dataarr.order_status, dataarr.order_date, dataarr.order_date_time, dataarr.order_instructions, dataarr.coupon_type, dataarr.coupon_id, dataarr.delivery_address, dataarr.order_latitude, dataarr.order_longitude, dataarr.slot_timings, dataarr.order_distance, dataarr.ext_del_charge, dataarr.shop_id, dataarr.vendor_otp, dataarr.customer_otp, dataarr.actual_total_amount, dataarr.order_type, dataarr.order_date_time, dataarr.delivery_charges_gst, dataarr.handling_charges, dataarr.packing_charges, dataarr.packing_charges_gst, dataarr.donation_charges, dataarr.total_item_gst_amount,dataarr.razorpay_charges,dataarr.razorpay_gst,dataarr.delivery_instruction,dataarr.slot_indication,dataarr.slot_date,dataarr.slot_time,dataarr.surcharges ];

	// If callback is provided, use it
	if (callback && typeof callback === "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results); // Return the result from callback
		});
	} else {
		// If no callback, directly execute the query
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
	}
};



exports.updatepaymetdetails = function (dataarr, callback) {
	var cntxtDtls = "in updatepaymetdetails";
	var current_date_time = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");


	var QRY_TO_EXEC = `update order_lst_t SET payment_id = ?, razorpay_order_id = ?, order_status = ? WHERE id = ? ;
	SELECT order_id FROM order_lst_t WHERE id =?`

	// Prepare the parameters array
	let params = [dataarr.payment_id, dataarr.razorpay_order_id, 0, dataarr.id, dataarr.id];

	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};


exports.sub_orderplacedMdl = function (dataarr, order_id, callback) {
	var cntxtDtls = "in sub_orderplacedMdl";

	const QRY_TO_EXEC = `
        INSERT INTO sub_orders_items_t (
            order_id, item_name, item_image, item_id, category_id, sub_category_id, category_name, 
            sub_category_name, actualitem_price, item_price, sub_item_count, item_total_amount,  
            filter_name, item_description, saving_price, shop_id, filter_one,rack_code,item_gst_amount,item_gst,extra_items
        ) VALUES ?;`;

	console.log(QRY_TO_EXEC);


	// Map the dataarr to create an array of arrays for each row's values
	// let params = dataarr.map(item => [order_id, item.item_name, item.item_image, item.item_id, item.category_id, item.sub_category_id, item.category_name, item.sub_category_name, item.actualitem_price, item.item_price, item.sub_item_count, item.item_total_amount, item.filter_name, item.item_description, item.saving_price, item.shop_id, item.filter_one, item.rack_code, item.item_gst_amount, item.item_gst, item.extra_items !== undefined ? item.extra_items : null]);
	let params = dataarr.map(item => [order_id, item.item_name, item.item_image, item.item_id, item.category_id, item.sub_category_id, item.category_name, item.sub_category_name, item.actualitem_price, item.item_price, item.sub_item_count, item.item_total_amount, item.filter_name, item.item_description, item.saving_price, item.shop_id, item.filter_one, item.rack_code, item.item_gst_amount !== undefined ? item.item_gst_amount : null, item.item_gst !== undefined ? item.item_gst : null, item.extra_items !== undefined ? item.extra_items : null]);

	console.log(params);




	// If callback is provided, use it to handle the response
	if (callback && typeof callback === "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, [params], cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	} else {
		// If no callback, return the result directly
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, [params], cntxtDtls);
	}
};


exports.updateprescription_imageMdl = function (prescription_image,order_id, callback) {
	var cntxtDtls = "in updateprescription_imageMdl";
	var QRY_TO_EXEC = `UPDATE order_lst_t SET prescription_image = '${prescription_image}' WHERE id = ?;`
	let params = [order_id];
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};




exports.getslot_bookingMdl = function (dataarr, callback) {
	var cntxtDtls = "in getslot_bookingMdl";
	var current_date = moment().utcOffset("+05:30").format("YYYY-MM-DD");
	var current_date_time = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");


	// 	,end_time,
	//   CASE 
	//     WHEN end_time < '00:00:00' THEN concat(DATE_ADD("${current_date}", INTERVAL 1 DAY), ' ', end_time)
	//     ELSE concat("${current_date}", ' ', end_time)
	//   END AS slot_timing

	var QRY_TO_EXEC = `SELECT slot_timings,end_time FROM slot_timings_t WHERE d_in = 0 AND location_id = ? AND slot_date = ?
  AND concat(?, ' ', end_time) > '${current_date_time}';`




	let params = [dataarr.location_id, dataarr.slot_date, dataarr.slot_date];

	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};


exports.getorderdetailsMdl = function (dataarr, callback) {
	var cntxtDtls = "in getorderdetailsMdl";
	var QRY_TO_EXEC = `SELECT * FROM sub_orders_items_t WHERE order_id=?;`;


	let params = [dataarr.order_id];

	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};



// exports.getorderlistMdl = function (dataarr, callback) {
// 	var cntxtDtls = "in getorderlistMdl";
// 	if(dataarr.order_id==0){
// 		var order_id = ` `;	
// 	} else {
// 		var order_id = ` and o.id =?`;
// 	}
// 	var QRY_TO_EXEC = `select o.location_name,o.customer_otp,o.order_status,DATE_FORMAT(o.order_date,"%d/%m/%Y") as order_date ,o.order_id,o.id,o.item_count,o.total_saving_amount,o.coupon_amount,o.delivery_charges,o.grand_total,o.payment_type,o.payment_id,o.accept_order_date_time,o.delivery_accepted_date_time,o.order_deliverd_date_time,o.deliveryboy_pickup_time,o.delivery_address,o.order_instructions,o.delivery_boy_array,o.order_cancel_msg,o.order_latitude,o.order_longitude,o.delivery_boy_latitude,o.delivery_boy_longitude,o.order_prepare_time,o.slot_timings,o.filter_name,o.shop_id,s.shop_name,s.shop_phone_number,s.category_id,s.shop_address,s.shop_latitude,s.shop_longitude,s.shop_image,DATE_FORMAT(o.order_date_time,"%h:%i") as order_time FROM order_lst_t as o JOIN shop_list_t AS s ON s.id=o.shop_id WHERE o.customer_id =?  ${order_id} order by o.id desc;`;


// 	let params = [dataarr.customer_id,dataarr.order_id];

// 	if (callback && typeof callback == "function") {
// 		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
// 			callback(err, results);
// 			return;
// 		});
// 	}
// 	else
// 		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
// };


exports.getorderlistMdl = function (dataarr, callback) {
	var cntxtDtls = "in getorderlistMdl";
	var QRY_TO_EXEC = `SELECT o.order_rating_status,o.rating_comment , o.location_name, o.customer_otp, o.order_status, DATE_FORMAT(o.order_date,"%d/%m/%Y") AS order_date, o.order_id, o.id, o.item_count,o.total_amount, o.total_saving_amount, o.coupon_amount, o.delivery_charges, o.grand_total, o.payment_type, o.payment_id, DATE_FORMAT(o.accept_order_date_time, '%Y-%m-%d %h:%i %p') as accept_order_date_time, DATE_FORMAT(o.delivery_accepted_date_time, '%Y-%m-%d %h:%i %p') as delivery_accepted_date_time, DATE_FORMAT(o.order_deliverd_date_time, '%Y-%m-%d %h:%i %p') as order_deliverd_date_time, o.deliveryboy_pickup_time, o.delivery_address, o.order_instructions, o.delivery_boy_array, o.order_cancel_msg, o.order_latitude, o.order_longitude, o.delivery_boy_latitude, o.delivery_boy_longitude, o.order_prepare_time, o.slot_timings, o.filter_name, o.shop_id, s.shop_name, s.shop_phone_number, s.category_id, s.shop_address,s.short_address, s.shop_latitude, s.shop_longitude, s.shop_image,DATE_FORMAT(o.order_date_time, '%Y-%m-%d %h:%i %p') as order_date_time, DATE_FORMAT(o.order_date_time,"%h:%i") AS order_time FROM order_lst_t AS o JOIN shop_list_t AS s ON s.id = o.shop_id WHERE o.order_status!=7 and o.customer_id = ? ${dataarr.order_id !== 0 ? 'AND o.id = ?' : ''} ORDER BY o.id DESC`;

	var params = [dataarr.customer_id, ...(dataarr.order_id !== 0 ? [dataarr.order_id] : [])];
	if (callback && typeof callback === "function") { dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, callback); } else { return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls); }
};

exports.getgrocery_sub_total_categoriesMdl = function (dataarr, callback) {
	var cntxtDtls = "in getgrocery_sub_total_categoriesMdl";
	var QRY_TO_EXEC = `SELECT id as sub_total_category_id,category_id,sub_category_id,category_name,sub_category_name,sub_total_category_name,sub_total_category_image FROM grocery_sub_total_category_t  WHERE d_in=0 and active_status=0
	 ORDER BY category_name,sub_category_name,sub_total_category_name;`;


	let params = [dataarr.customer_id];

	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};


exports.getgroucery_category_items_listMdl = function (dataarr, callback) {
	var cntxtDtls = "in getgroucery_category_items_listMdl";
	var common_id = 0;
	var cst_id = null; // Initialize cst_id

	// Correct comparison operators and logic
	if (dataarr.category_id !== undefined && dataarr.category_id !== 0) {
		common_id = `category_id=?`;
		cst_id = dataarr.category_id;
	}
	else if (dataarr.sub_category_id !== undefined && dataarr.sub_category_id !== 0) {
		common_id = `sub_category_id=?`;
		cst_id = dataarr.sub_category_id;
	}
	else if (dataarr.sub_total_category_id !== undefined && dataarr.sub_total_category_id !== 0) {
		common_id = `sub_total_category_id=?`;
		cst_id = dataarr.sub_total_category_id;
	}



	// Create the query
	var QRY_TO_EXEC = `SELECT * FROM z_grocery_item_list_t WHERE ${common_id}`;

	// Prepare parameters array
	let params = [cst_id];

	// If callback is provided, use it, otherwise return the promise
	if (callback && typeof callback === "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	} else {
		// If no callback is provided, return the promise
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
	}
};


// exports.getgroucery_search_items_listMdl = function (dataarr, callback) {
// 	var cntxtDtls = "in getgroucery_search_items_listMdl";
// 	const QRY_TO_EXEC = `SELECT * FROM z_grocery_item_list_t WHERE category_name LIKE CONCAT('%', ?, '%') OR sub_category_name LIKE CONCAT('%', ?, '%') OR sub_total_category_name LIKE CONCAT('%', ?, '%') OR item_name LIKE CONCAT('%', ?, '%');`;

// 	let params = [dataarr.search_term, dataarr.search_term, dataarr.search_term, dataarr.search_term];


// 	if (callback && typeof callback == "function") {
// 		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
// 			callback(err, results);
// 			return;
// 		});
// 	}
// 	else
// 		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
// };

exports.getgroucery_search_items_listMdl = function (dataarr, callback) {
    var cntxtDtls = "in getgroucery_search_items_listMdl";
    const QRY_TO_EXEC = `
        SELECT * FROM z_grocery_item_list_t
        WHERE LOWER(category_name) LIKE LOWER(CONCAT('%', ?, '%'))
           OR LOWER(sub_category_name) LIKE LOWER(CONCAT('%', ?, '%'))
           OR LOWER(sub_total_category_name) LIKE LOWER(CONCAT('%', ?, '%'))
           OR LOWER(item_name) LIKE LOWER(CONCAT('%', ?, '%'));
    `;

    let params = [
        dataarr.search_term,
        dataarr.search_term,
        dataarr.search_term,
        dataarr.search_term
    ];

    if (callback && typeof callback === "function") {
        dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
            callback(err, results);
            return;
        });
    } else {
        return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
    }
};

exports.get_subscription_timelineMdl = function (dataarr, callback) {
	var cntxtDtls = "in get_subscription_timelineMdl";
	const QRY_TO_EXEC = `SELECT * FROM subscription_timeline WHERE d_in=0`;

	let params = [];


	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};
exports.get_wallet_amountsMdl = function (dataarr, callback) {
	var cntxtDtls = "in get_wallet_amountsMdl";
	const QRY_TO_EXEC = `SELECT * FROM wallent_amount_t WHERE d_in=0`;
	let params = [];
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.user_wallet_paymentMdl = function (dataarr, callback) {
	var cntxtDtls = "in user_wallet_paymentMdl";
	const QRY_TO_EXEC = `INSERT INTO user_wallet_t (user_id, location_id, wallet_amount, balance_amount) VALUES (?,?,?,?);`;
	let params = [dataarr.user_id, dataarr.location_id, dataarr.payment_amount, dataarr.payment_amount];

	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.checkuserwalletamountMdl = function (dataarr, callback) {
	var cntxtDtls = "in checkuserwalletamountMdl";
	const QRY_TO_EXEC = `SELECT * FROM user_wallet_t WHERE d_in=0 AND user_id=?`;
	let params = [dataarr.user_id];
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};


exports.user_sub_wallet_paymentMdl = function (dataarr, callback) {
	var cntxtDtls = "in user_sub_wallet_paymentMdl";
	const QRY_TO_EXEC = `INSERT INTO user_wallet_sub_t (user_id, razorpay_order_id, payment_amount, payment_status) VALUES (?,?,?,?);`;
	let params = [dataarr.user_id, dataarr.razorpay_order_id, dataarr.payment_amount, 1];
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.update_user_wallet_paymentCtrl = function (dataarr, callback) {
	var cntxtDtls = "in update_user_wallet_paymentCtrl";
	const QRY_TO_EXEC = `UPDATE user_wallet_sub_t SET payment_id = ?,payment_status=? WHERE razorpay_order_id = ?;`;
	let params = [dataarr.payment_id, 0, dataarr.razorpay_order_id];
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};


exports.update_main_user_wallet_paymentMdl = function (dataarr, callback) {
	var cntxtDtls = "in update_main_user_wallet_paymentMdl";
	const paymentAmount = parseInt(dataarr.payment_amount, 10); // Convert to integer

	const QRY_TO_EXEC = `UPDATE user_wallet_t SET wallet_amount = wallet_amount + ?, balance_amount = balance_amount + ? WHERE user_id = ?;`;

	let params = [paymentAmount, paymentAmount, dataarr.user_id];
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};


exports.get_user_wallet_amount_detailsMdl = function (dataarr, callback) {
	var cntxtDtls = "in get_user_wallet_amount_detailsMdl";
	const QRY_TO_EXEC = `SELECT * FROM user_wallet_t WHERE d_in=0 and user_id=?;
    SELECT * FROM user_wallet_sub_t WHERE d_in=0 AND user_id=? ORDER BY id DESC;`;
	let params = [dataarr.user_id, dataarr.user_id];
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};


exports.subscription_order_placedMdl = function (data, callback) {
	var cntxtDtls = "in subscription_order_placedMdl";
	var current_date = moment().utcOffset("+05:30").format("YYYY-MM-DD");
	var current_date_time = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	const QRY_TO_EXEC = `
        INSERT INTO subscription_order_list_t (
            subscription_order_date,customer_id, order_id, item_name, item_image, item_id, category_id, sub_category_id, category_name, 
            sub_category_name, actualitem_price, item_price, sub_item_count, item_total_amount,  
            filter_name, item_description, saving_price, shop_id, filter_one, subscription_type, received_items_quantity, received_items_prices,i_ts
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);  
    `;

	// Extract the values from the data object to match the placeholders in the query
	let params = [current_date,
		data.customer_id, data.order_id, data.item_name, data.item_image, data.item_id, data.category_id,
		data.sub_category_id, data.category_name, data.sub_category_name, data.actualitem_price, data.item_price,
		data.sub_item_count, data.item_total_amount, data.filter_name, data.item_description, data.saving_price,
		data.shop_id, data.filter_one, data.subscription_type, 0, 0, current_date_time
	];



	// If a callback is provided, use it to handle the response
	if (callback && typeof callback === "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			if (err) {
				return callback(err);
			}
			return callback(null, results);
		});
	} else {
		// If no callback is provided, directly return the result
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
	}
};


exports.getsubscripitioin_ordersMdl = function (dataarr, callback) {
	var cntxtDtls = "in getsubscripitioin_ordersMdl";
	const QRY_TO_EXEC = `SELECT * FROM subscription_order_list_t WHERE d_in=0 AND customer_id=?`;
	let params = [dataarr.customer_id];
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.getrecieved_subscripitioin_order_itemMdl = function (dataarr, callback) {
	var cntxtDtls = "in getrecieved_subscripitioin_order_itemMdl";
	const QRY_TO_EXEC = `SELECT * FROM recieved_subscription_order_times_t WHERE d_in=0 AND order_id=?`;
	let params = [dataarr.order_id];
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.getwalletdeductionMdl = function (dataarr, callback) {
	var cntxtDtls = "in getwalletdeductionMdl";
	const QRY_TO_EXEC = `SELECT * FROM recieved_subscription_order_times_t WHERE d_in=0 AND customer_id=?`;
	let params = [dataarr.customer_id];
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.getsubcategoryallMdl = function (dataarr, callback) {
	var cntxtDtls = "in getsubcategoryallMdl";
	const QRY_TO_EXEC = `SELECT * FROM sub_category_tbl WHERE d_in=0 order by category_id asc`;
	// const QRY_TO_EXEC = `SELECT * FROM shop_subcategory_list_t WHERE d_in=0 GROUP BY sub_category_id;`;
	let params = [];
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};





exports.search_grocery_itemsMdl = function (dataarr, callback) {
	
	
	var cntxtDtls = "in search_grocery_itemsMdl";

	const QRY_TO_EXEC = `SELECT 
    item_name AS search_text,
    MAX(item_image) AS search_image,
    MAX(id) AS id,
    '5' AS search_type,
    'Grocery Item' AS search_tagline,
    'z_grocery_item_list_t' AS table_name
FROM z_grocery_item_list_t
WHERE LOWER(item_name) LIKE LOWER(CONCAT('%', ?, '%')) AND d_in = 0 AND location_id = ?
GROUP BY item_name`;

	const params = [
		dataarr.searchterm, dataarr.location_id,  // 10
	];


	if (callback && typeof callback === "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	} else {
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
	}
};

exports.search_allitemsmdl = function (dataarr, callback) {
	var cntxtDtls = "in search_allitemsmdl";


	const QRY_TO_EXEC = `

SELECT 
    item_name AS search_text,
    MAX(item_image) AS search_image,
    MAX(id) AS id,
    '1' AS search_type,
    'Food Item' AS search_tagline,
    'z_food_restaurant_item_lst_t' AS table_name
FROM z_food_restaurant_item_lst_t
WHERE LOWER(item_name) LIKE LOWER(CONCAT('%', ?, '%')) AND d_in = 0 AND location_id = ? 
GROUP BY item_name

UNION ALL

SELECT 
    item_name AS search_text,
    MAX(item_image) AS search_image,
    MAX(id) AS id,
    '1' AS search_type,
    'Electronics Item' AS search_tagline,
    'z_electronics_item_lst_t' AS table_name
FROM z_electronics_item_lst_t
WHERE LOWER(item_name) LIKE LOWER(CONCAT('%', ?, '%')) AND d_in = 0 AND location_id = ? 
GROUP BY item_name

UNION ALL

SELECT 
    item_name AS search_text,
    MAX(item_image) AS search_image,
    MAX(id) AS id,
    '1' AS search_type,
    'Gifts & Toys Item' AS search_tagline,
    'z_gifts_toys_item_lst_t' AS table_name
FROM z_gifts_toys_item_lst_t
WHERE LOWER(item_name) LIKE LOWER(CONCAT('%', ?, '%')) AND d_in = 0 AND location_id = ? 
GROUP BY item_name

UNION ALL

SELECT 
    item_name AS search_text,
    MAX(item_image) AS search_image,
    MAX(id) AS id,
    '1' AS search_type,
    'Home & Apparel Item' AS search_tagline,
    'z_home_appreals_item_lst_t' AS table_name
FROM z_home_appreals_item_lst_t
WHERE LOWER(item_name) LIKE LOWER(CONCAT('%', ?, '%')) AND d_in = 0 AND location_id = ? 
GROUP BY item_name


UNION ALL

SELECT 
    item_name AS search_text,
    MAX(item_image) AS search_image,
    MAX(id) AS id,
    '1' AS search_type,
    'Kitchen & Pooja Item' AS search_tagline,
    'z_kitchen_appliances_pooja_store_item_lst_t' AS table_name
FROM z_kitchen_appliances_pooja_store_item_lst_t
WHERE LOWER(item_name) LIKE LOWER(CONCAT('%', ?, '%')) AND d_in = 0 AND location_id = ? 
GROUP BY item_name


UNION ALL

SELECT 
    item_name AS search_text,
    MAX(item_image) AS search_image,
    MAX(id) AS id,
    '1' AS search_type,
    'Meat Item' AS search_tagline,
    'z_meat_item_lst_t' AS table_name
FROM z_meat_item_lst_t
WHERE LOWER(item_name) LIKE LOWER(CONCAT('%', ?, '%')) AND d_in = 0 AND location_id = ? 
GROUP BY item_name

UNION ALL

SELECT 
    item_name AS search_text,
    MAX(item_image) AS search_image,
    MAX(id) AS id,
    '1' AS search_type,
    'Pet Store Item' AS search_tagline,
    'z_pet_store_item_lst_t' AS table_name
FROM z_pet_store_item_lst_t
WHERE LOWER(item_name) LIKE LOWER(CONCAT('%', ?, '%')) AND d_in = 0 AND location_id = ? 
GROUP BY item_name

UNION ALL

SELECT 
    item_name AS search_text,
    MAX(item_image) AS search_image,
    MAX(id) AS id,
    '1' AS search_type,
    'Pharmacy Item' AS search_tagline,
    'z_pharmacy_store_item_lst_t' AS table_name
FROM z_pharmacy_store_item_lst_t
WHERE LOWER(item_name) LIKE LOWER(CONCAT('%', ?, '%')) AND d_in = 0 AND location_id = ? 
GROUP BY item_name

UNION ALL

SELECT 
    shop_name AS search_text,
    MAX(shop_image) AS search_image,
    MAX(id) AS id,
    '2' AS search_type,
    'Merchant' AS search_tagline,
    'shop_list_t' AS table_name
FROM shop_list_t
WHERE LOWER(shop_name) LIKE LOWER(CONCAT('%', ?, '%')) AND d_in = 0 and public_visibility=0 AND location_id = ? 
GROUP BY shop_name

UNION ALL

SELECT 
    category_name AS search_text,
    MAX(category_image) AS search_image,
    MAX(id) AS id,
    '3' AS search_type,
    'Category' AS search_tagline,
    'category_tbl' AS table_name
FROM category_tbl
WHERE LOWER(category_name) LIKE LOWER(CONCAT('%', ?, '%')) AND d_in = 0
GROUP BY category_name

UNION ALL

SELECT 
    sub_category_name AS search_text,
    MAX(sub_category_image) AS search_image,
    MAX(id) AS id,
    '4' AS search_type,
    'Sub Category' AS search_tagline,
    'shop_subcategory_list_t' AS table_name
FROM sub_category_tbl
WHERE LOWER(sub_category_name) LIKE LOWER(CONCAT('%', ?, '%')) AND d_in = 0
GROUP BY sub_category_name




`;



	const params = [
		dataarr.searchterm, dataarr.location_id,  // 1
		dataarr.searchterm, dataarr.location_id,  // 2
		dataarr.searchterm, dataarr.location_id,  // 3
		dataarr.searchterm, dataarr.location_id,  // 4
		dataarr.searchterm, dataarr.location_id,  // 5
		dataarr.searchterm, dataarr.location_id,  // 6
		dataarr.searchterm, dataarr.location_id,  // 7
		dataarr.searchterm, dataarr.location_id,  // 8
		dataarr.searchterm, dataarr.location_id,  // 9

		dataarr.searchterm, dataarr.location_id,  // 11 - shop_list_t
		dataarr.searchterm,                       // 12 - category_tbl
		dataarr.searchterm,                       // 13 - sub_category_tbl
		dataarr.searchterm, dataarr.location_id,  // 10
	];

	

	if (callback && typeof callback === "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	} else {
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
	}
};


exports.searchitemsfullmdl = function (dataarr, callback) {
	var cntxtDtls = "in searchitemsfullmdl";
	

	var QRY_TO_EXEC = `SELECT * FROM ?? WHERE d_in = 0 AND id = ? AND active_status=0`;
	let params = [dataarr.table_name, dataarr.id]; // table name and shop_id`
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.getsearchshoplistMdl = function (dataarr, callback) {
	var cntxtDtls = "in getsearchshoplistMdl";
	var QRY_TO_EXEC = `SELECT GROUP_CONCAT(shop_id) as shop_ids,category_id  FROM ?? WHERE item_name LIKE CONCAT('%', ?, '%') and location_id=? group by item_name;`;
	let params = [dataarr.table_name, dataarr.search_text, dataarr.location_id]; // table name and shop_id`
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};


exports.getsearchcategoriesshoplistMdl = function (dataarr, callback) {
	var cntxtDtls = "in getsearchshoplistMdl";
	var QRY_TO_EXEC = `SELECT GROUP_CONCAT(id) as shop_ids,category_id  FROM ?? WHERE category_id = ? and location_id=? group by category_id;`;
	let params = [dataarr.table_name, dataarr.id, dataarr.location_id]; // table name and shop_id`
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};


exports.getsearchsubcategoriesshoplistMdl = function (dataarr, callback) {
	var cntxtDtls = "in getsearchsubcategoriesshoplistMdl";
	var QRY_TO_EXEC = `SELECT GROUP_CONCAT(shop_id) as shop_ids,category_id  FROM ?? WHERE sub_category_id = ? and location_id=? group by sub_category_id;`;
	
	
	let params = [dataarr.table_name, dataarr.id, dataarr.location_id]; // table name and shop_id`
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};
exports.getsearchgroceryitemslistMdl = function (dataarr, callback) {
	var cntxtDtls = "in getsearchgroceryitemslistMdl";
	var QRY_TO_EXEC = `SELECT GROUP_CONCAT(shop_id) as shop_ids,category_id  FROM ?? WHERE sub_category_id = ? and location_id=? group by sub_category_id;`;
	let params = [dataarr.table_name, dataarr.id, dataarr.location_id]; // table name and shop_id`
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
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


exports.update_customer_delivery_addressMdl = function (dataarr, id, callback) {
	var cntxtDtls = "in update_customer_delivery_addressMdl";
	var QRY_TO_EXEC = `UPDATE customer_delivery_address_t SET address_type = ?, full_address = ?, customer_latitude = ?, customer_longitude = ?, location_id = ? WHERE id = ?;`;

	let params = [dataarr.address_type, dataarr.full_address, dataarr.customer_latitude, dataarr.customer_longitude, dataarr.location_id, id];

	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.post_customer_delivery_addressMdl = function (dataarr, callback) {
	var cntxtDtls = "in post_customer_delivery_addressMdl";
	var QRY_TO_EXEC = `INSERT INTO customer_delivery_address_t (customer_name,customer_mobile_number,address_type, full_address, customer_latitude, customer_longitude, location_id, customer_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`;

	let params = [dataarr.customer_name, dataarr.customer_mobile_number, dataarr.address_type, dataarr.full_address, dataarr.customer_latitude, dataarr.customer_longitude, dataarr.location_id, dataarr.customer_id];

	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};






exports.check_delivery_typeMdl = function (dataarr, callback) {
	var cntxtDtls = "in check_delivery_typeMdl";
	var QRY_TO_EXEC = `SELECT * FROM customer_delivery_address_t WHERE d_in = 0 AND customer_id = ? and address_type=?`
	let params = [dataarr.customer_id, dataarr.address_type];
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.get_customer_delivery_addressMdl = function (dataarr, callback) {
	var cntxtDtls = "in get_customer_delivery_addressMdl";
	var QRY_TO_EXEC = `SELECT * FROM customer_delivery_address_t WHERE d_in = 0 AND customer_id = ?`
	let params = [dataarr.customer_id];
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.delete_customer_addressMdl = function (dataarr, callback) {
	var cntxtDtls = "in delete_customer_addressMdl";
	var QRY_TO_EXEC = `DELETE FROM customer_delivery_address_t WHERE id = ? and customer_id=?`
	let params = [dataarr.id, dataarr.customer_id];
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.application_common_apiMdl = function (dataarr, callback) {
	var cntxtDtls = "in application_common_apiMdl";
	var QRY_TO_EXEC = `SELECT * FROM application_table WHERE d_in=0 LIMIT 1`
	let params = [dataarr.id, dataarr.customer_id];
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.getprofileMdl = function (dataarr, callback) {
	var cntxtDtls = "in getprofileMdl";
	
	
	var QRY_TO_EXEC = `SELECT * FROM customer_list_t WHERE id=? AND d_in=0;`
	let params = [dataarr.customer_id];
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.update_customer_profileMdl = function (imageupload, dataarr, callback) {
	var cntxtDtls = "in update_customer_profileMdl";
	
	var QRY_TO_EXEC = `UPDATE customer_list_t SET profile_image = ? , customer_name = ?, customer_mobile_number = ?, customer_email = ? , 	customer_dob = ? , gender = ? , anniversary = ? WHERE id = ?;`;
	
	let params = [imageupload, dataarr.customer_name, dataarr.customer_mobile_number, dataarr.customer_email, dataarr.customer_dob, dataarr.gender, dataarr.anniversary, dataarr.customer_id];
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};



exports.get_shop_playersidsMdl = function (user_id,user_type, callback) {
	var cntxtDtls = "in get_shop_playersidsMdl";
	var QRY_TO_EXEC = `SELECT player_id FROM player_ids_list_t WHERE user_type IN(?) and user_id=? and d_in=0 order by id desc limit 1;`
	let params = [user_type, user_id];
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};


exports.get_related_productsMdl = function (dataarr, callback) {
	var cntxtDtls = "in get_related_productsMdl";
	

	var QRY_TO_EXEC = `SELECT *  FROM z_grocery_item_list_t WHERE sub_total_category_id = ? and d_in=0;`
	let params = [dataarr.sub_total_category_id];
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.getappversionsMdl = function (dataarr, callback) {
	var cntxtDtls = "in getappversionsMdl";
	var QRY_TO_EXEC = `SELECT * FROM apps_version_t WHERE d_in=0`
	let params = [dataarr.sub_total_category_id, dataarr.location_id];
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.bannertgetproductsMld = function (dataarr, callback) {
	var cntxtDtls = "in bannertgetproductsMld";
	var QRY_TO_EXEC = `-- Step 1: Get the table name from the subquery
SET @table_name = (SELECT s.shop_items_tb_nm FROM shop_list_t as s WHERE s.id = ?);

-- Step 2: Build the query dynamically
SET @sql_query = CONCAT('SELECT * FROM ', @table_name, ' WHERE shop_id = ?');

-- Step 3: Prepare and execute the dynamic query
PREPARE stmt FROM @sql_query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;`
	let params = [dataarr.shop_id, dataarr.shop_id];
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};


exports.cancleorderMdl = function (dataarr, callback) {
	var cntxtDtls = "in cancleorderMdl";
	var QRY_TO_EXEC = `UPDATE order_lst_t SET order_status = '4' WHERE id = ?;`
	let params = [dataarr.order_id];
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.checkorderstatusMdl = function (dataarr, callback) {
	var cntxtDtls = "in checkorderstatusMdl";
	var QRY_TO_EXEC = `select * from order_lst_t where order_status = '0' and id = ?;`
	let params = [dataarr.order_id];
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.postapprating = function (data, callback) {
	var cntxtDtls = "in postapprating";
	var QRY_TO_EXEC = `INSERT INTO app_rating_t (usr_id , rating , comment) VALUES (?,?,?);`
	let params = [data.usr_id, data.rating, data.comment];
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.postorderrating = function (data, callback) {
	var cntxtDtls = "in postorderrating";
	var QRY_TO_EXEC = `	update  order_lst_t set order_rating_status = ? ,rating_comment = ? where id = ?`
	let params = [data.rating, data.comment, data.order_id]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};


exports.updateshoprating = function (data, callback) {
	var cntxtDtls = "in updateshoprating";
	var GET_CURRENT_VALUES = `SELECT shop_rating FROM shop_list_t WHERE id = ?`;
	dbutil.sqlinjection(sqldb.MySQLConPool, GET_CURRENT_VALUES, [data.shop_id], cntxtDtls, function (err, results) {
		if (err) {
			if (callback && typeof callback == "function") callback(err, null);
			return;
		}

		if (results.length === 0) {
			if (callback && typeof callback == "function") callback(new Error("Shop not found"), null);
			return;
		}

		let currentRating = results[0].shop_rating || 0;
		let totalRatings = results[0].total_ratings || 0;

		let newRating;
		if (totalRatings === 0) {
			newRating = data.rating;
			totalRatings = 1;
		} else {
			newRating = ((currentRating * totalRatings) + data.rating) / (totalRatings + 1);
			newRating = parseFloat(newRating).toFixed(1);  // Round to 1 decimal place
			totalRatings += 1;
		}

		var QRY_TO_EXEC = `UPDATE shop_list_t  
            SET shop_rating = ?,rating_count = rating_count + 1
            WHERE id = ?`;

		let params = [newRating, data.shop_id];

		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			if (callback && typeof callback == "function") {
				callback(err, results);
			}
		});
	});
};

exports.updatesmsCount = function (data, loginotp, callback) {
	var cntxtDtls = "in updatesmsCount";
	var QRY_TO_EXEC = `Update sms_count_t set sms_count = ( sms_count +  1 );INSERT INTO sms_details_t (customer_number,otp) VALUES (?,?);`
	let params = [data.customer_mobile_number, loginotp];
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};


exports.getsingleshopdetailsMdl = function (dataarr, callback) {
	const cntxtDtls = "in getshoplistMdl";
	let shop_id = '';


	if (dataarr.shop_id !== 0) {
		shop_id = `AND id IN (${dataarr.shop_id})`;
	}

	var current_time = moment().utcOffset("+05:30").format("HH:mm:ss");

	// SQL query template
	const QRY_TO_EXEC = `
    SELECT 
		CASE WHEN shop_active_status = 1 THEN shop_active_status ELSE '0' END AS shop_org_active_status,

        CASE
            WHEN shop_active_status = 0 AND shop_open_time <= '${current_time}' AND shop_close_time2 >= '${current_time}' THEN '0'
            WHEN shop_active_status = 0 AND shop_open_time2 <= '${current_time}' AND shop_close_time >= '${current_time}' THEN '0'
            ELSE '1'
        END AS shop_active_status,shop_items_tb_nm,packing_charges,
        coupon_status, del_charges_status, shop_image,YEAR(i_ts) AS shop_since,shop_unique_id,
        shop_open_time2, shop_close_time2, shop_open_time, shop_close_time, category_id, minimum_order, id AS shop_id, admin_percentage, minimum_km, minimum_del_charge, per_km_chargers, maximum_del_km, shop_name, shop_address,short_address, shop_phone_number, acceptTerms, special_offer_name, shop_rating,rating_count, shop_player_id, shop_gst_number, shop_fssai_lic,
        shop_active_status_name, shop_latitude, shop_longitude,special_offer_status,location_id,registered_shop_name,common_item_ind,
        (12742 * ASIN(SQRT(0.5 - COS((shop_latitude-?) * 0.01745329251) / 2 + COS(? * 0.01745329251) * COS(shop_latitude * 0.01745329251) * (1 - COS((shop_longitude-?) * 0.01745329251)) / 2))) AS distance
    FROM shop_list_t 
    WHERE d_in = 0 and public_visibility=0
    AND location_id = ? 

    ${shop_id}
    HAVING distance < maximum_del_km 
    ORDER BY shop_active_status;`

	//   ${shop_id}
	// Prepare parameters for query execution
	let params = [
		dataarr.shop_latitude, dataarr.shop_latitude, dataarr.shop_longitude,
		dataarr.location_id
	];

	// if (dataarr.shop_id != 0) {
	// 	params.push(dataarr.shop_id);
	// }

	// Execute query with callback or return promise based on presence of callback
	if (callback && typeof callback === "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
		});
	} else {
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
	}
};

exports.addwishlistMdl = function (data, callback) {
	var cntxtDtls = "in addwishlistMdl";
	var QRY_TO_EXEC = `INSERT INTO wishlist_t (location_id, wishlist_id, wishlist_type, table_name, customer_id,shop_id) VALUES (?,?,?,?,?,?);`
	let params = [data.location_id, data.wishlist_id, data.wishlist_type, data.table_name, data.customer_id, data.shop_id];
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.deletewishlistMdl = function (data, callback) {
	var cntxtDtls = "in deletewishlistMdl";


	var QRY_TO_EXEC = `DELETE FROM wishlist_t WHERE id=?`
	let params = [data.id];
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.getuserwishlistMdl = function (data, callback) {
	var cntxtDtls = "in getuserwishlistMdl";


	var QRY_TO_EXEC = `SELECT count(*) as unique_item_count,* FROM wishlist_t WHERE customer_id=? AND d_in=0 and shop_id=? GROUP BY unique_code`
	let params = [data.customer_id, data.shop_id];
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.sameshopoutletsMdl = function (dataarr, callback) {
	const cntxtDtls = "in sameshopoutletsMdl";
	let shop_id = '';
	var current_time = moment().utcOffset("+05:30").format("HH:mm:ss");

	// SQL query template
	const QRY_TO_EXEC = `
    SELECT CASE WHEN shop_active_status = 1 THEN shop_active_status ELSE '0' END AS shop_org_active_status,
        CASE
            WHEN shop_active_status = 0 AND shop_open_time <= '${current_time}' AND shop_close_time2 >= '${current_time}' THEN 0
            WHEN shop_active_status = 0 AND shop_open_time2 <= '${current_time}' AND shop_close_time >= '${current_time}' THEN 0
            ELSE 1
        END AS shop_active_status,shop_items_tb_nm,packing_charges,
        coupon_status, del_charges_status, shop_image,YEAR(i_ts) AS shop_since,shop_unique_id,
        shop_open_time2, shop_close_time2, shop_open_time, shop_close_time, category_id, minimum_order, id AS shop_id, admin_percentage, minimum_km, minimum_del_charge, per_km_chargers, maximum_del_km, shop_name, shop_address,short_address, shop_phone_number, acceptTerms, special_offer_name, shop_rating,rating_count, shop_player_id, shop_gst_number, shop_fssai_lic,
        shop_active_status_name, shop_latitude, shop_longitude,special_offer_status,location_id,registered_shop_name,common_item_ind,
        (12742 * ASIN(SQRT(0.5 - COS((shop_latitude-?) * 0.01745329251) / 2 + COS(? * 0.01745329251) * COS(shop_latitude * 0.01745329251) * (1 - COS((shop_longitude-?) * 0.01745329251)) / 2))) AS distance
    FROM shop_list_t 
    WHERE d_in = 0 and public_visibility=0
    AND location_id = ? 
    AND category_id = ?
	AND shop_unique_id = ?

    
    HAVING distance < maximum_del_km 
    ORDER BY shop_active_status;`

	//   ${shop_id}
	// Prepare parameters for query execution
	let params = [
		dataarr.shop_latitude, dataarr.shop_latitude, dataarr.shop_longitude,
		dataarr.location_id, dataarr.category_id,
		dataarr.shop_unique_id
	];

	// if (dataarr.shop_id != 0) {
	// 	params.push(dataarr.shop_id);
	// }

	// Execute query with callback or return promise based on presence of callback
	if (callback && typeof callback === "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
		});
	} else {
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
	}
};



exports.getslotdatesMdl = function (data, callback) {
	var cntxtDtls = "in getslotdatesMdl";
	var current_date = moment().utcOffset("+05:30").format("YYYY-MM-DD");
let params = [current_date, data.location_id];

	var current_date = moment().utcOffset("+05:30").format("YYYY-MM-DD");
	var QRY_TO_EXEC = `SELECT 
  location_id,
  DATE_FORMAT(slot_date, '%d %b') AS display,
  DATE_FORMAT(slot_date, '%Y-%m-%d') AS slot_date, 
  CASE
      WHEN slot_date = DATE(CONVERT_TZ(UTC_TIMESTAMP(), '+00:00', '+05:30')) THEN 'Today'
      WHEN slot_date = DATE_ADD(DATE(CONVERT_TZ(UTC_TIMESTAMP(), '+00:00', '+05:30')), INTERVAL 1 DAY) THEN 'Tomorrow'
      ELSE DATE_FORMAT(slot_date, '%W')
  END AS label
FROM slot_timings_t
WHERE slot_date >= ? AND location_id = ?
GROUP BY slot_date
ORDER BY slot_date
LIMIT 7;`;


	

	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.getcategorydetailsMdl = function (data, callback) {
	var cntxtDtls = "in getcategorydetailsMdl";
	
	var QRY_TO_EXEC = `SELECT * FROM category_tbl WHERE id = ?`
	let params = [data.id];
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.getmerchentratingsMdl = function (data, callback) {
	var cntxtDtls = "in getmerchentratingsMdl";
	var QRY_TO_EXEC = `SELECT order_rating,order_comments,c.customer_name,c.id as customer_id,c.profile_image FROM order_lst_t as o 
JOIN customer_list_t as c on o.customer_id=c.id
WHERE o.shop_id = ? and o.order_rating != 0;`
	let params = [data.shop_id];
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.getshop_offercelistMdl = function (data, callback) {
	var cntxtDtls = "in getshoporrderslistMdl";
	var QRY_TO_EXEC = `SELECT * FROM coupon_code_t WHERE shop_id=? and d_in=0;
`
	let params = [data.shop_id];
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.checkshop_slot_timingsMdl = function (data, callback) {
	var cntxtDtls = "in checkshop_slot_timingsMdl";
		
	const QRY_TO_EXEC = `
    SELECT 
	CASE WHEN shop_active_status = 1 THEN shop_active_status ELSE '0' END AS shop_org_active_status,
    CASE
        WHEN shop_active_status = 0 AND shop_open_time <= ? AND shop_close_time2 >= ? THEN 0
        WHEN shop_active_status = 0 AND shop_open_time2 <= ? AND shop_close_time >= ? THEN 0
        ELSE 1
    END AS shop_active_status
FROM shop_list_t 
WHERE d_in = 0 and public_visibility=0 AND location_id = ? AND id = ?;`

	let params = [data.end_time,data.end_time,data.end_time,data.end_time,data.location_id,data.shop_id];
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.get_offer_bannersMdl = function (data, callback) {
	var cntxtDtls = "in get_offer_bannersMdl";
	
	
	var QRY_TO_EXEC = `SELECT * FROM shop_offers_tbl WHERE location_id=? and category_id in (0,?) and d_in=0;`;
	let params = [data.location_id,data.category_id];
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.recomrecommended_for_you_shopsMdl = function (dataarr, callback) {
	var cntxtDtls = "in recomrecommended_for_you_shopsMdl";
	
	
	var current_time = moment().utcOffset("+05:30").format("HH:mm:ss");

	// SQL query template
	const QRY_TO_EXEC = `
    SELECT CASE WHEN shop_active_status = 1 THEN shop_active_status ELSE '0' END AS shop_org_active_status,
        CASE
            WHEN shop_active_status = 0 AND shop_open_time <= '${current_time}' AND shop_close_time2 >= '${current_time}' THEN 0
            WHEN shop_active_status = 0 AND shop_open_time2 <= '${current_time}' AND shop_close_time >= '${current_time}' THEN 0
            ELSE 1
        END AS shop_active_status,shop_items_tb_nm,packing_charges,
        coupon_status, del_charges_status, shop_image,YEAR(i_ts) AS shop_since,shop_unique_id,
        shop_open_time2, shop_close_time2, shop_open_time, shop_close_time, category_id, minimum_order, id AS shop_id, admin_percentage, minimum_km, minimum_del_charge, per_km_chargers, maximum_del_km, shop_name, shop_address,short_address, shop_phone_number, acceptTerms, special_offer_name, shop_rating,rating_count, shop_player_id, shop_gst_number, shop_fssai_lic,
        shop_active_status_name, shop_latitude, shop_longitude,special_offer_status,location_id,registered_shop_name,common_item_ind,
        (12742 * ASIN(SQRT(0.5 - COS((shop_latitude-?) * 0.01745329251) / 2 + COS(? * 0.01745329251) * COS(shop_latitude * 0.01745329251) * (1 - COS((shop_longitude-?) * 0.01745329251)) / 2))) AS distance
    FROM shop_list_t 
    WHERE d_in = 0 and public_visibility=0
    AND location_id = ? 
    AND category_id = ?  AND recommended_for_you=1 
    HAVING distance < maximum_del_km 
    ORDER BY shop_active_status;`;
	

	let params = [
		dataarr.shop_latitude, dataarr.shop_latitude, dataarr.shop_longitude,
		dataarr.location_id, dataarr.category_id
	];

	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};


exports.getuserwishlistfulldata = function (data, callback) {
	var cntxtDtls = "in getuserwishlistfulldata";
	
	
	var QRY_TO_EXEC = `SELECT * FROM shop_list_t as a join wishlist_t as b on a.id = b.wishlist_id where b.customer_id = ? and b.wishlist_type =? and b.location_id= ?  ;
	SELECT * FROM wishlist_t as a join z_food_restaurant_item_lst_t as b on a.wishlist_id = b.id where a.customer_id = ? and a.wishlist_type=? and b.location_id= ?;
`
	let params = [data.customer_id, 0, data.location_id , data.customer_id, 1 ,data.location_id ];
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};
exports.deleteaccountMdl = function (data, callback) {
	var cntxtDtls = "in deleteaccountMdl";
	
	
	var QRY_TO_EXEC = `UPDATE customer_list_t SET d_in = '1' WHERE id = 2;;
`
	let params = [data.customer_id ];
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.public_complaitsMdl = function (data, callback) {
	
	
	var cntxtDtls = "in public_complaitsMdl";	
	var current_date_time = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	var QRY_TO_EXEC = `INSERT INTO customer_complaints_t (description, complaint_image, customer_id, phone_number, customer_name, i_ts) VALUES (?, ?, ?, ?, ?, ?);`;
	let params = [data.description,data.complaint_image,data.customer_id,data.phone_number,data.customer_name,current_date_time ];
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.getbanneritemslistMdl = function (data, callback) {
	
	var cntxtDtls = "in getbanneritemslistMdl";	
	var QRY_TO_EXEC = `SELECT item_id,banner_offer_title FROM banners_lst_t WHERE shop_id=? AND d_in=0;`;
	
	let params = [data.shop_id ];
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};




// Exported function
exports.generateslottimeingMdl = function (data, callback) {
	var cntxtDtls = "in generateslottimeingMdl";

	// Configuration
	const startHour = 6;  // Start at 6:30 AM
	const endHour = 22;   // End at 10:30 PM
	const locationId = 2;
	const locationName = "Vijayawada";

	// Get current date and the date one month later
	const today = moment().startOf('day'); // Today at 12:00 AM
	const oneMonthLater = moment().add(1, 'month');

	// Helper functions for time formatting
	const formatTime = (time) => time.format('hh:mmA'); // e.g., 06:30AM
	const format24HrTime = (time) => time.format('HH:mm'); // e.g., 05:30

	// Store slot data for SQL queries
	let slotData = [];

	let currentDate = today.clone();

	// Loop through the next month
	while (currentDate.isBefore(oneMonthLater)) {
		for (let hour = startHour; hour <= endHour; hour++) {
			const startTime = currentDate.clone().hours(hour).minutes(30); // Starting at X:30
			const endTime = startTime.clone().add(1, 'hour');
			const customerDeadlineTime = startTime.clone().subtract(1, 'hour'); // 1 hour before the start time

			const slotTimings = `${formatTime(startTime)} - ${formatTime(endTime)}`;
			const endTimeStr = format24HrTime(customerDeadlineTime);
			const slotRange = startTime.hour();

			const sql = `(NULL, '${slotTimings}', '${currentDate.format('YYYY-MM-DD')}', '${endTimeStr}', '${locationId}', '${locationName}', '0', '${slotRange}', NOW(), '0')`;
			slotData.push(sql);
		}
		currentDate.add(1, 'day'); // Move to the next day
	}

	// Create the final SQL query
	const QRY_TO_EXEC = "INSERT INTO `slot_timings_t` (`id`, `slot_timings`, `slot_date`, `end_time`, `location_id`, `location_name`, `active_status`, `slot_range`, `slot_datetime`, `d_in`) VALUES\n" + slotData.join(",\n") + ";";

	// Proceed with the callback function if it's provided
	let params = [data.customer_id, data.shop_id]; // These may not be necessary depending on the context of your SQL
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else {
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
	}
};

exports.getscheduleorderslistMdl = function (callback) {
	var cntxtDtls = "in getscheduleorderslistMdl";
	var current_time = moment().utcOffset("+05:30").format("HH:mm:ss");
	var current_date = moment().utcOffset("+05:30").format("YYYY-MM-DD");
	var QRY_TO_EXEC = `SELECT id, order_id, slot_date, slot_time, slot_indication,customer_id,shop_id FROM order_lst_t WHERE slot_indication = 1 AND slot_date = "${current_date}"
  AND slot_time <= "${current_time}" AND order_status=0;`;
  
  
	let params = [];
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.updateordersMdl = function (data,callback) {
	var cntxtDtls = "in updateordersMdl";
	
	var QRY_TO_EXEC = `update order_lst_t set slot_indication=0 WHERE id=${data.id}`;
  
	let params = [data];
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.setpublicvisibilityshopsMdl = function (table_name,callback) {
	var cntxtDtls = "in setpublicvisibilityshopsMdl";
	
	var QRY_TO_EXEC = `UPDATE shop_list_t s
	LEFT JOIN ${table_name} i ON s.id = i.shop_id
	SET s.public_visibility = CASE
		WHEN i.shop_id IS NULL THEN 1
		ELSE 0
	END
	WHERE s.shop_items_tb_nm = '${table_name}' and s.id!=1;`;
  
	let params = [];
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.getcurrentnotificatinsMdl = function (callback) {
	var cntxtDtls = "in getcurrentnotificatinsMdl";
	var current_time = moment().utcOffset("+05:30").format("HH:mm");
	console.log(current_time);
	
	var QRY_TO_EXEC = `SELECT *
FROM schedule_notifications_t
WHERE notification_time = "${current_time}" and notification_date = DAYNAME(CONVERT_TZ(NOW(), @@session.time_zone, '+05:30'));`;


  
	let params = [];
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};


exports.updatename = function (data,callback) {
	var cntxtDtls = "in updatename";
	
	var QRY_TO_EXEC = `update customer_list_t set customer_name= ? WHERE customer_mobile_number=?`;
  
	let params = [data.name,data.number];
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};


exports.getpublic_notificationsMdl = function (data, callback) {
	var cntxtDtls = "in getpublic_notificationsMdl";
	var QRY_TO_EXEC = `SELECT * FROM player_ids_list_t WHERE location_id = ? AND user_type = 0 AND player_id !="null" AND user_id!=0 AND CHAR_LENGTH(player_id) < 50 GROUP BY player_id;`
	let params = [data.location_id];
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};


exports.getversion = function (callback) {
	var cntxtDtls = "in getversion";
	var QRY_TO_EXEC = ` select * from version_tbl where d_in='0';
 `;
	let params = [];
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	} else {
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
	}
};

exports.razorpaypaymentsuccessMdl = function (dataarr, callback) {
    const cntxtDtls = "in razorpaypaymentsuccessMdl";
    
    const QRY_TO_EXEC = `
        UPDATE order_lst_t 
        SET payment_id = ?, order_status = ?, 
        WHERE razorpay_order_id = ?
    `;

    const params = [dataarr.payment_id, dataarr.order_status, dataarr.razorpay_order_id];

    if (callback && typeof callback === "function") {
        dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
            callback(err, results);
        });
    } else {
        return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
    }
};
