var sqldb = require('../../config/dbconnect');

var dbutil = require(appRoot + '/utils/dbutils');
var moment = require('moment');
var http = require("https");
var fs = require('fs');
var express = require('express');
router = express.Router();
const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");

const logoPath = path.join(__dirname, "../assets/Logo.png");
const logoPath1 = path.join(__dirname, "../assets/signature.png");
const logoPath2 = path.join(__dirname, "../assets/checkmark.png");

// **************************************************** Login Start **************************************************************************

exports.checkUserExistMdl = function (number, pwd, callback) {
	var cntxtDtls = "in checkUserExistMdl";
	var QRY_TO_EXEC = ` SELECT * from users where number = ? and  pwd = ? and d_in <> 1;`;
	let params = [number, pwd]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.getUserDataMdl = function (user_id, callback) {
	var cntxtDtls = "in getUserDataMdl";
	var QRY_TO_EXEC = `SELECT mm.* from main_module as mm join admin_permission as ps on mm.id=ps.module_id  where ps.user_id =? and ps.d_in <> 1 and mm.d_in=0 group by ps.module_id ORDER BY mm.main_module_order;
	SELECT mm.* from sub_module as mm join admin_permission as ps on mm.id=ps.sub_module_id  where ps.user_id =? and ps.d_in <> 1 and mm.d_in=0 order by module_order;`;
	let params = [user_id, user_id]
	if (callback && typeof callback == "function")
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.getupdatemodulesmdl = function (data, callback) {
	var cntxtDtls = "in getupdatemodulesmdl";
	var QRY_TO_EXEC = `SELECT CASE WHEN p.user_id IS NOT NULL THEN 'true' ELSE 'false' END AS check_sub_menu, p.user_id, sm.id, sm.module_id, m.title AS module_nm, sm.path AS link, sm.icon, sm.title AS label, sm.id, m.icon, p.d_in, CASE WHEN p.user_id IS NULL THEN 0 ELSE 1 END AS check_sub_menu, sm.module_order FROM sub_module AS sm JOIN main_module AS m ON sm.module_id = m.id LEFT JOIN (SELECT * FROM admin_permission WHERE user_id = ?) AS p ON p.sub_module_id = sm.id WHERE sm.d_in = 0 AND m.d_in = 0
    UNION
    SELECT CASE WHEN p.user_id IS NOT NULL THEN 'true' ELSE 'false' END AS check_sub_menu, p.user_id, NULL AS id, m.id AS module_id, m.title AS module_nm, m.path AS link, m.icon, m. title AS label, m.id, m.icon, NULL AS d_in, CASE WHEN p.user_id IS NULL THEN 0 ELSE 1 END AS check_sub_menu, m.main_module_order FROM main_module AS m LEFT JOIN (SELECT * FROM admin_permission WHERE user_id = ? ) AS p ON p.module_id = m.id WHERE m.title = 'Dashboard' AND m.d_in = 0 ORDER BY module_id;`;
	let values = [data.usr_id, data.usr_id]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, values, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, values, cntxtDtls);
};

exports.checkNumbermdl = function (data, callback) {
	var cntxtDtls = "in checkNumbermdl";
	var QRY_TO_EXEC = `select * from users where number= ? ;`;
	let params = [data.number]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.submitusersloginmdl = function (data, callback) {
	var cntxtDtls = "in submitusersloginmdl";
	var QRY_TO_EXEC = `INSERT INTO users(name, number,email,pwd) VALUES (?,?,?,?)`;
	let params = [data.name, data.number, data.email, data.pwd]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.submitpermissions = function (lastid, data, callback) {
	var cntxtDtls = "in submitpermissions";
	var host = data.selectedmoduleslist;
	var QRY_TO_EXEC = '';
	var MU_QRY_TO_EXEC = '';
	let params = [];
	for (let i = 0; i < host.length; i++) {
		QRY_TO_EXEC = `insert into admin_permission(user_id, module_id, sub_module_id) values(?,?,?);`;
		MU_QRY_TO_EXEC = MU_QRY_TO_EXEC + QRY_TO_EXEC;
		params.push(lastid, host[i].module_id, host[i].id);
	}
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, MU_QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.getuserlistmdl = function (callback) {
	var cntxtDtls = "in getuserlistmdl";
	var QRY_TO_EXEC = `SELECT l.id, name, l.number,l.email,l.pwd, GROUP_CONCAT(DISTINCT m.title) AS module_nm, COUNT(m.title) AS mcnt, GROUP_CONCAT(sm.title) AS sub_menu FROM admin_permission AS p JOIN sub_module AS sm ON p.sub_module_id = sm.id JOIN main_module AS m ON p.module_id = m.id JOIN users AS l ON l.id = p.user_id WHERE p.d_in = 0 AND l.d_in = 0 AND m.d_in = 0 AND l.admin_type != 3 GROUP BY p.user_id ORDER BY l.id DESC;`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.postusermenulistMdl = function (modulesData, module_id, usr_id, employeeDetails, callback) {
	var cntxtDtls = "in postusermenulistMdl";
	var QRY_TO_EXEC2 = `DELETE FROM admin_permission WHERE user_id = ?;`;
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC2, [usr_id], cntxtDtls, function (err, results1) {
			if (err) return callback(err, results1);
			var MU_QRY_TO_EXEC = '';
			var params = [];
			for (let i = 0; i < modulesData.length; i++) {
				MU_QRY_TO_EXEC += `INSERT INTO admin_permission(company_id, user_id, module_id, sub_module_id)
                                   VALUES(?, ?, ?, ?);`;
				params.push(0, modulesData[i][0], modulesData[i][1], modulesData[i][2])

			}
			var EMPLOYEE_QRY_TO_EXEC = `Update users set name = ?,number = ?,email = ?,pwd = ? where id = ?;`;
			var params1 = [employeeDetails[0], employeeDetails[1], employeeDetails[2], employeeDetails[3], usr_id]

			dbutil.sqlinjection(sqldb.MySQLConPool, MU_QRY_TO_EXEC + EMPLOYEE_QRY_TO_EXEC, [...params, ...params1], cntxtDtls, function (err, results) {
				callback(err, results);
				return;
			});
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC2, [usr_id], cntxtDtls);
};

exports.deleteusermdl = function (data, callback) {
	var cntxtDtls = "in deleteusermdl";
	var MU_QRY_TO_EXEC = '';
	var QRY_TO_EXEC = '';
	var params = [];
	for (var j = 0; j < data.length; j++) {
		var QRY_TO_EXEC = `Update users set d_in=1 where id= ?;`
		MU_QRY_TO_EXEC = MU_QRY_TO_EXEC + QRY_TO_EXEC;
		params.push(data[j])
	}
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, MU_QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

// ************* Login End **************//


// ************** App Users Start ************//

exports.getusersprofilemdl = function (data, callback) {
	var cntxtDtls = "in getusersprofilemdl";
	var QRY_TO_EXEC = `select * from users where id IN (?) and d_in=0`;
	var values = [data.user_id]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, values, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.updateuserpassword = function (data, callback) {
	var cntxtDtls = "in updateuserpassword";
	var QRY_TO_EXEC = `update users set pwd = ? where id IN (?)`;
	var values = [data.pwd, data.id]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, values, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.updateimagemdl = function (data, imageupload, callback) {
	var cntxtDtls = "in updateimagemdl";
	var QRY_TO_EXEC = `update users set image = ? where id IN (?) ;`;
	var params = [imageupload, data.id]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

// *************** App Users End ***************//

exports.addlocation = function (data, callback) {
	var cntxtDtls = "in addlocation";
	var QRY_TO_EXEC = `INSERT INTO location_tbl (location_name,location_latitude,location_longitude,maximum_delivery_service_km) VALUES (?,?,?,?);`;
	let params = [data.location_name, data.location_latitude, data.location_longitude, data.maximum_delivery_service_km]
	console.log(QRY_TO_EXEC, params);

	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.getlocation = function (callback) {
	var cntxtDtls = "in getlocation";
	var QRY_TO_EXEC = `SELECT * FROM location_tbl WHERE d_in = 0 ORDER BY id DESC;`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.updatelocation = function (data, callback) {
	var cntxtDtls = "in updatelocation";
	var QRY_TO_EXEC = `update location_tbl set location_name = ?,location_latitude = ?,location_longitude = ?,maximum_delivery_service_km = ? where id = ?;`;
	var params = [data.location_name, data.location_latitude, data.location_longitude, data.maximum_delivery_service_km, data.id]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.deletelocation = function (data, callback) {
	var cntxtDtls = "in deletelocation";
	var MU_QRY_TO_EXEC = '';
	var QRY_TO_EXEC = '';
	var params = [];
	for (var j = 0; j < data.length; j++) {
		var QRY_TO_EXEC = `Update location_tbl set d_in=1 where id = ?;`
		MU_QRY_TO_EXEC = MU_QRY_TO_EXEC + QRY_TO_EXEC;
		params.push(data[j])
	}
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, MU_QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.addbanner = function (data, imageupload, callback) {
	var cntxtDtls = "in addbanner";
	var createddate = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	var QRY_TO_EXEC = `INSERT INTO banners_lst_t (location_id,category_id,banner_image,banner_offer_title,i_ts) VALUES (?,?,?,?,?);`;
	let params = [data.location_id, data.category_id, imageupload, data.banner_offer_title, createddate]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.getbanner = function (data, callback) {
	var cntxtDtls = "in getbanner";
	var QRY_TO_EXEC = `SELECT a.*, CASE WHEN a.location_id = 0 THEN 'All' ELSE l.location_name END AS location_name, c.category_name FROM banners_lst_t AS a LEFT JOIN location_tbl AS l ON l.id = a.location_id LEFT JOIN category_tbl AS c ON c.id = a.category_id WHERE a.d_in = 0 `;

	var params = [];

	if (data.filters && data.filters.location !== undefined && data.filters.location !== '') {
		if (data.filters.location != "0") {
			QRY_TO_EXEC += ` AND a.location_id = ?`;
			params.push(data.filters.location);
		}
	} else {
		return callback(null, []);
	}

	if (params.length === 0 && data.filters.location != "0") {
		return callback(null, []);  // Ensures empty filter returns no data
	}

	QRY_TO_EXEC += ` ORDER BY a.id DESC;`;

	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.updatebanner = function (data, imageupload, callback) {
	var cntxtDtls = "in updatebanner";
	var QRY_TO_EXEC = `update banners_lst_t set location_id = ?,category_id = ?,banner_image = ?,banner_offer_title = ? where id = ?;`;
	var params = [data.location_id, data.category_id, imageupload, data.banner_offer_title, data.id]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.deletebanner = function (data, callback) {
	var cntxtDtls = "in deletebanner";
	var MU_QRY_TO_EXEC = '';
	var QRY_TO_EXEC = '';
	var params = [];
	for (var j = 0; j < data.length; j++) {
		var QRY_TO_EXEC = `Update banners_lst_t set d_in=1 where id = ?;`
		MU_QRY_TO_EXEC = MU_QRY_TO_EXEC + QRY_TO_EXEC;
		params.push(data[j])
	}
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, MU_QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.addnotifications = function (data, callback) {
	var cntxtDtls = "in addnotifications";
	var createddate = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	var QRY_TO_EXEC = `INSERT INTO notifications_t (notification_title,notification_description,location_id,location_name) VALUES (?,?,?,?);`;
	let params = [data.notification_title, data.notification_description, data.location_id, data.location_name]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.getnotifications = function (data, callback) {
	var cntxtDtls = "in getnotifications";
	var QRY_TO_EXEC = `SELECT a.* FROM notifications_t as a WHERE a.d_in = 0 `;

	var params = [];

	if (data.filters && data.filters.location !== undefined && data.filters.location !== '') {
		if (data.filters.location != "0") {
			QRY_TO_EXEC += ` AND a.location_id = ?`;
			params.push(data.filters.location);
		}
	} else {
		return callback(null, []);
	}

	if (params.length === 0 && data.filters.location != "0") {
		return callback(null, []);  // Ensures empty filter returns no data
	}

	QRY_TO_EXEC += ` ORDER BY a.id DESC;`;

	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.updatenotifications = function (data, callback) {
	var cntxtDtls = "in updatenotifications";
	var QRY_TO_EXEC = `update notifications_t set notification_title = ?,notification_description = ?, location_id = ?,location_name = ? where id = ?;`;
	var params = [data.notification_title, data.notification_description, data.location_id, data.location_name, data.id]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.deletenotifications = function (data, callback) {
	var cntxtDtls = "in deletenotifications";
	var MU_QRY_TO_EXEC = '';
	var QRY_TO_EXEC = '';
	var params = [];
	for (var j = 0; j < data.length; j++) {
		var QRY_TO_EXEC = `Update notifications_t set d_in=1 where id = ?;`
		MU_QRY_TO_EXEC = MU_QRY_TO_EXEC + QRY_TO_EXEC;
		params.push(data[j])
	}
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, MU_QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.addcoupon = function (data, callback) {
	var cntxtDtls = "in addcoupon";
	var QRY_TO_EXEC = `INSERT INTO coupon_code_t (location_id,coupon_name,coupon_description,coupon_percentage,coupon_upto_price,coupon_max_price_limit,entry_by) VALUES (?,?,?,?,?,?,?);`;
	let params = [data.location_id, data.coupon_name, data.coupon_description, data.coupon_percentage, data.coupon_upto_price, data.coupon_max_price_limit, data.entry_by]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.getcoupon = function (data, callback) {
	var cntxtDtls = "in getcoupon";
	var QRY_TO_EXEC = `SELECT a.*,b.location_name FROM coupon_code_t AS a LEFT JOIN location_tbl AS b ON b.id = a.location_id WHERE a.d_in = 0 `;
	var params = [];

	if (data.filters && data.filters.location !== undefined && data.filters.location !== '') {
		if (data.filters.location != "0") {
			QRY_TO_EXEC += ` AND a.location_id = ?`;
			params.push(data.filters.location);
		}
	} else {
		return callback(null, []);
	}

	if (params.length === 0 && data.filters.location != "0") {
		return callback(null, []);  // Ensures empty filter returns no data
	}

	QRY_TO_EXEC += ` ORDER BY a.id DESC;`;

	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.updatecoupon = function (data, callback) {
	var cntxtDtls = "in updatecoupon";
	var QRY_TO_EXEC = `update coupon_code_t set coupon_name = ?,coupon_description = ?, location_id = ?,coupon_percentage = ? ,coupon_upto_price = ?,coupon_max_price_limit = ? where id = ?;`;
	var params = [data.coupon_name, data.coupon_description, data.location_id, data.coupon_percentage, data.coupon_upto_price, data.coupon_max_price_limit, data.id]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.deletecoupon = function (data, callback) {
	var cntxtDtls = "in deletecoupon";
	var MU_QRY_TO_EXEC = '';
	var QRY_TO_EXEC = '';
	var params = [];
	for (var j = 0; j < data.length; j++) {
		var QRY_TO_EXEC = `Update coupon_code_t set d_in=1 where id = ?;`
		MU_QRY_TO_EXEC = MU_QRY_TO_EXEC + QRY_TO_EXEC;
		params.push(data[j])
	}
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, MU_QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.addsize = function (data, callback) {
	var cntxtDtls = "in addsize";
	var QRY_TO_EXEC = `INSERT INTO sizes_tbl (size) VALUES (?);`;
	let params = [data.size]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.getsize = function (callback) {
	var cntxtDtls = "in getsize";
	var QRY_TO_EXEC = `SELECT * FROM sizes_tbl WHERE d_in = 0 ORDER BY id DESC;`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.updatesize = function (data, callback) {
	var cntxtDtls = "in updatesize";
	var QRY_TO_EXEC = `update sizes_tbl set size = ? where id = ?;`;
	var params = [data.size, data.id]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.deletesize = function (data, callback) {
	var cntxtDtls = "in deletesize";
	var MU_QRY_TO_EXEC = '';
	var QRY_TO_EXEC = '';
	var params = [];
	for (var j = 0; j < data.length; j++) {
		var QRY_TO_EXEC = `Update sizes_tbl set d_in=1 where id = ?;`
		MU_QRY_TO_EXEC = MU_QRY_TO_EXEC + QRY_TO_EXEC;
		params.push(data[j])
	}
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, MU_QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.addcategory = function (data, imageupload, callback) {
	var cntxtDtls = "in addcategory";
	var QRY_TO_EXEC = `INSERT INTO category_tbl (category_name, category_image) VALUES (?, ?);`;
	var params = [data.category_name, imageupload]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.getcategory = function (callback) {
	var cntxtDtls = "in getcategory";
	var QRY_TO_EXEC = `SELECT * FROM category_tbl WHERE d_in=0 order by id desc;`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.updatecategory = function (data, imageupload, callback) {
	var cntxtDtls = "in updatecategory";
	var QRY_TO_EXEC = `update category_tbl set category_name = ?,category_image = ? where id = ?;`;
	var params = [data.category_name, imageupload, data.id]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.deletecategory = function (data, callback) {
	var cntxtDtls = "in deletecategory";
	var MU_QRY_TO_EXEC = '';
	var QRY_TO_EXEC = '';
	var params = [];
	for (var j = 0; j < data.length; j++) {
		var QRY_TO_EXEC = `Update category_tbl set d_in=1 where id = ?;`
		MU_QRY_TO_EXEC = MU_QRY_TO_EXEC + QRY_TO_EXEC;
		params.push(data[j])
	}
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, MU_QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.updatecategoryactivestatus = function (data, callback) {
	var cntxtDtls = "in updatecategoryactivestatus";
	var QRY_TO_EXEC = `update category_tbl set category_active_status = ? where id = ?;`;
	var params = [data.category_active_status, data.id]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.insertProduct = function (data, callback) {
	var cntxtDtls = "in insertProduct";
	var QRY_TO_EXEC = `INSERT INTO z_all_products (product_name, category_id, product_description) VALUES (?, ?, ?);`;
	var params = [data.product_name, data.category_id, data.product_description]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.insertVariant = function (data, callback) {
	var cntxtDtls = "in insertVariant";
	var QRY_TO_EXEC = `INSERT INTO product_variants (product_id, color_name, color_code) VALUES (?, ?, ?);`;
	var params = [data.product_id, data.color_name, data.color_code]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.insertVariantImage = function (data, imageupload, callback) {
	var cntxtDtls = "in insertVariantImage";
	var QRY_TO_EXEC = `INSERT INTO variant_images (product_id, varient_id, images) VALUES (?, ?, ?);`;
	var params = [data.product_id, data.variant_id, imageupload]
	
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.insertVariantSize = function (data, callback) {
	var cntxtDtls = "in insertVariantSize";
	var QRY_TO_EXEC = `INSERT INTO variant_sizes (product_id, varient_id, size, price) VALUES (?, ?, ?, ?);`;
	var params = [data.product_id, data.variant_id, data.size,data.price]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};