var sqldb = require('../config/dbconnect');
var dbutil = require(appRoot + '/utils/dbutils');
var moment = require('moment');
var http = require("https");
var fs = require('fs');
var express = require('express');
router = express.Router();
const nodemailer = require("nodemailer");


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
	var QRY_TO_EXEC = `SELECT l.id, name, l.number,l.email,l.pwd, GROUP_CONCAT(DISTINCT m.title) AS module_nm, COUNT(m.title) AS mcnt, GROUP_CONCAT(sm.title) AS sub_menu FROM admin_permission AS p JOIN sub_module AS sm ON p.sub_module_id = sm.id JOIN main_module AS m ON p.module_id = m.id JOIN users AS l ON l.id = p.user_id WHERE p.d_in = 0 AND l.d_in = 0 AND m.d_in = 0 GROUP BY p.user_id;`;
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

//******************Website Contact Data******************//

exports.websitecontact = function (data, callback) {
  var cntxtDtls = "in websitecontact";
  var QRY_TO_EXEC = `INSERT INTO contact_data (name,email,phonenumber,subject,message) VALUES ('${data.name}','${data.email}','${data.phn_number}','${data.subject}','${data.mssg}');`;
  if (callback && typeof callback == "function") {
    dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
      callback(err, results);
      return;
    });
  }
  else
    return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

//******************Website Contact Data******************//

// ************** App Users Start ************//

exports.getusersprofilemdl = function (data, callback) {
	var cntxtDtls = "in getusersprofilemdl";
	var QRY_TO_EXEC = `select * from users where id = ? and d_in=0`;
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
	var QRY_TO_EXEC = `update users set pwd = ? where id = ?`;
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
	var QRY_TO_EXEC = `update users set image = ? where id = ? ;`;
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

// *************Main module Start *************//

exports.shop_registration = function (data, imageUploadbank, imageUploadagreement, imageUploadk1, imageUploadk2, imageUploadk3, imageUploadshop, callback) {
	var cntxtDtls = "in shop_registration";
	var createddate = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	// var escapedDescription = data.description.replace(/'/g, "''");
	// var escapedDescription_tel = data.description_tel.replace(/'/g, "''");
	let randomOTP = Math.floor(100000 + Math.random() * 900000);
	var QRY_TO_EXEC = `INSERT INTO shop_list_t (shop_name,shop_phone_number,shop_email,shop_address,shop_latitude,shop_longitude,shop_fssai_lic,shop_lic,shop_drug_lic,shop_pancard,admin_percentage,shop_gst_number,registration_fee,total_registration_fee,shop_bank_details,shop_agreement_copy,shop_interiors_image1,shop_interiors_image2,shop_interiors_image3,shop_image,category_id,location_id,shop_unique_id,acceptTerms,i_ts,shop_open_time,shop_open_time2,shop_close_time,shop_close_time2,shop_password,shop_items_tb_nm,packing_charges,max_free_delivery_cost,minimum_order,minimum_km,minimum_del_charge,per_km_chargers,maximum_del_km,vendor_payment_otp) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`;

	let values = [data.shop_name, data.shop_phone_number,data.shop_email, data.shop_address, data.shop_latitude, data.shop_longitude, data.shop_fssai_lic, data.shop_lic, data.shop_drug_lic, data.shop_pancard, data.admin_percentage, data.shop_gst_number || "Not Applicable", data.registration_fee, data.total_registration_fee, imageUploadbank, imageUploadagreement, imageUploadk1, imageUploadk2, imageUploadk3, imageUploadshop, data.category_id, data.location_id, data.shop_unique_id || "0", data.acceptTerms, createddate, data.shop_open_time, data.shop_open_time, data.shop_close_time, data.shop_close_time, "123456", data.table_name, data.packing_charges, data.max_free_delivery_cost, data.minimum_order, data.minimum_km, data.minimum_del_charge, data.per_km_chargers, data.maximum_del_km,randomOTP]

	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, values, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, values, cntxtDtls);
};

exports.insertshopsubcategory = function (insertId, data, callback) {
	var cntxtDtls = "in insertshopsubcategory";
	var host = data.sub_category;
	var MU_QRY_TO_EXEC = '';
	var QRY_TO_EXEC = '';
	var params = [];
	for (let i = 0; i < host.length; i++) {
		QRY_TO_EXEC = `insert into shop_subcategory_list_t (shop_id,location_id,category_id, sub_category_id, sub_category_name,sub_category_image) values(?,?,?,?,?,?);`;
		MU_QRY_TO_EXEC = MU_QRY_TO_EXEC + QRY_TO_EXEC;
		params.push(insertId, data.location_id, data.category_id, host[i].id, host[i].name, host[i].image);
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

exports.insertshopfilter = function (insertId, data, callback) {
	var cntxtDtls = "in insertshopfilter";
	var host = data.filter_id;
	var MU_QRY_TO_EXEC = '';
	var QRY_TO_EXEC = '';
	var params = [];
	for (let i = 0; i < host.length; i++) {
		QRY_TO_EXEC = `insert into shop_filter_list_t (shop_id,location_id,category_id, filter_id, filter_name) values(?,?,?,?,?);`;
		MU_QRY_TO_EXEC = MU_QRY_TO_EXEC + QRY_TO_EXEC;
		params.push(insertId, data.location_id, data.category_id, host[i].id, host[i].name);
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

exports.insertshopintosearchkey = function (insertId, data, imageUploadshop, callback) {
	var cntxtDtls = "in insertshopintosearchkey";
	var QRY_TO_EXEC = `INSERT INTO search_type_t (search_key_type,search_text,search_image,search_id,search_table) VALUES (?,?,?,?,?);`;
	let value = ['3', data.shop_name, imageUploadshop, insertId, data.table_name]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, value, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, value, cntxtDtls);
};

exports.addshopdatainuserstbl = function (insertId, data, callback) {
	var cntxtDtls = "in addshopdatainuserstbl";
	var QRY_TO_EXEC = `INSERT INTO users (admin_type ,name ,number ,email,address,shop_id,shop_category_id,pwd) VALUES (?,?,?,?,?,?,?,?);`;
	let value = ['3', data.shop_name, data.shop_phone_number,data.shop_email, data.shop_address, insertId, data.category_id, '123456']
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, value, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, value, cntxtDtls);
};

exports.addshoppermissions = function (insertId, data, callback) {
	var cntxtDtls = "in addshoppermissions";
	var host = [
		{ module_id: 4, sub_module_id: 22 },
		{ module_id: 4, sub_module_id: 6 },
		{ module_id: 6, sub_module_id: 26 },
		{ module_id: 11, sub_module_id: 28 },
	];
	var MU_QRY_TO_EXEC = '';
	var QRY_TO_EXEC = '';
	var params = [];
	for (let i = 0; i < host.length; i++) {
		QRY_TO_EXEC = `insert into admin_permission (user_id,module_id,sub_module_id) values(?,?,?);`;
		MU_QRY_TO_EXEC = MU_QRY_TO_EXEC + QRY_TO_EXEC;
		params.push(insertId, host[i].module_id, host[i].sub_module_id);
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

exports.updateshopid = function (lastid, callback) {
	var cntxtDtls = "in updateshopid";
	var QRY_TO_EXEC = `UPDATE shop_list_t set shop_unique_id  = ? where id = ?;`;
	var value = [lastid, lastid]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, value, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, value, cntxtDtls);
};

exports.sendregistrationsuccessemail = function (data, callback) {
    if (!data.shop_email || !data.shop_name) {
        return callback(new Error("Missing required fields"), null);
    }

    sendSuccessEmail(data.shop_email, data.shop_name, callback);
};


function sendSuccessEmail(email, shopName, callback) {
  let transporter = nodemailer.createTransport({
     host: "localhost",  // Use localhost as per GoDaddy's instructions
    port: 25,           // Use port 25 (not 465 or 587)
    secure: false,      // Must be false for port 25
    // auth: {
    //     user: "Support@freshozapcart.com",
    //     pass: "Babloo@!9515" // Ensure this is correct
    // },
    tls: {
        rejectUnauthorized: false // Allow self-signed certificates
    }
});

    let mailOptions = {
        from: "Support@freshozapcart.com",
        to: email,
        subject: "Merchant Registration Successful!",
        html: `
        <meta charset=UTF-8><meta content="width=device-width,initial-scale=1"name=viewport>
        <style>
            body {font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;}
            .container {width: 100%; max-width: 600px; margin: 20px auto; background-color: #fff; padding: 20px;
                        border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,.1); text-align: center;}
            .header {background-color: #007bff; color: #fff; text-align: center; padding: 15px;
                     border-radius: 8px 8px 0 0; font-size: 22px; font-weight: 700;}
            .content {padding: 20px; font-size: 16px; color: #333; text-align: left;}
            .highlight {font-weight: 700;}
            .footer {text-align: center; font-size: 14px; color: #777; margin-top: 20px;}
        </style>

        <div class="container">
            <div class="content">
                <h3>Congratulations, <span class="highlight">${shopName}</span>!</h3>
                <p>Your merchant has been <span class="highlight">successfully registered</span> on our platform.</p>
                <p>Our verification team is reviewing your registration details, and the process will be 
                  <span class="highlight">completed within the next 48 hours</span>. 
                  Once verified, you will receive a confirmation email with further instructions.</p>
                <p><span class="highlight">Thank you for choosing Freshozapcart!</span> 
                  We are excited to support your business and help you grow.</p>
                <p>If you have any questions, feel free to contact our support team.</p>
                <p>Best Regards,<br><strong>Freshozapcart Team</strong></p>
            </div>
        </div>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);
            return callback(error, null);
        } else {
            console.log("Email sent: " + info.response);
            return callback(null, { message: "Email sent successfully" });
        }
          
    });
}


exports.getshopreg = function (data, callback) {
	var cntxtDtls = "in getshopreg";
	var QRY_TO_EXEC = `SELECT a.*, CONCAT_WS(',', a.shop_interiors_image1, a.shop_interiors_image2, a.shop_interiors_image3) AS images, DATE_FORMAT(a.i_ts, '%d-%m-%Y') AS date, l.location_name, c.category_name,GROUP_CONCAT(DISTINCT s.sub_category_id ORDER BY s.sub_category_id SEPARATOR ',') AS subcategory_ids, GROUP_CONCAT(DISTINCT s.sub_category_name ORDER BY s.sub_category_name SEPARATOR ', ') AS subcategories,GROUP_CONCAT(DISTINCT f.filter_id ORDER BY f.filter_id SEPARATOR ',') AS filter_ids, GROUP_CONCAT(DISTINCT f.filter_name ORDER BY f.filter_name SEPARATOR ', ') AS filters,CONCAT( DATE_FORMAT(STR_TO_DATE(a.shop_open_time, '%H:%i:%s'), '%I:%i %p'), ' - ', DATE_FORMAT(STR_TO_DATE(a.shop_close_time, '%H:%i:%s'), '%I:%i %p')) AS shop_timings FROM shop_list_t AS a LEFT JOIN location_tbl AS l ON l.id = a.location_id LEFT JOIN category_tbl AS c ON c.id = a.category_id LEFT JOIN shop_subcategory_list_t AS s ON s.shop_id = a.id LEFT JOIN shop_filter_list_t AS f ON f.shop_id = a.id WHERE a.d_in = 0 `;

	var params = [];

	if (data.filters.location) {
		QRY_TO_EXEC += ` AND a.location_id = ?`;
		params.push(data.filters.location);
	}

	if (data.filters.shop) {
		QRY_TO_EXEC += ` AND a.id = ?`;
		params.push(data.filters.shop);
	}

	if (params.length === 0) {
		return callback(null, []);
	}

	QRY_TO_EXEC += ` GROUP BY a.id ORDER BY a.id DESC`;


	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.getgroupbyshop = function (callback) {
	var cntxtDtls = "in getgroupbyshop";
	var QRY_TO_EXEC = `SELECT a.* FROM shop_list_t as a WHERE a.d_in=0 GROUP BY shop_unique_id ORDER BY a.id ASC;`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.updateshopreg = function (data, imageUploadbank, imageUploadagreement, imageUploadshop, imageUploadk1, imageUploadk2, imageUploadk3, callback) {
	var cntxtDtls = "in updateshopreg";
	var QRY_TO_EXEC = `update shop_list_t set shop_name = ?,shop_phone_number = ?,shop_email = ?,location_id = ?,category_id = ?,shop_address = ?, shop_latitude = ? , shop_longitude = ? , shop_fssai_lic = ? , shop_lic = ?, shop_pancard = ?, admin_percentage = ?, shop_gst_number = ?, shop_bank_details = ?, shop_agreement_copy = ?,shop_image = ?, shop_interiors_image1 = ?, shop_interiors_image2 = ? ,shop_interiors_image3 = ?,shop_open_time = ?,shop_open_time2 = ?,shop_close_time = ?,shop_close_time2 = ?,shop_items_tb_nm = ?,packing_charges = ?,max_free_delivery_cost = ?,minimum_order = ?, minimum_km = ?,minimum_del_charge = ?,per_km_chargers = ?,maximum_del_km = ?,registration_fee = ?,total_registration_fee = ? where id = ?;`;

	let values = [data.shop_name, data.shop_phone_number, data.shop_email,data.location_id, data.category_id, data.shop_address, data.shop_latitude, data.shop_longitude, data.shop_fssai_lic, data.shop_lic, data.shop_pancard, data.admin_percentage, data.shop_gst_number || "Not Applicable", imageUploadbank, imageUploadagreement, imageUploadshop, imageUploadk1, imageUploadk2, imageUploadk3, data.shop_open_time, data.shop_open_time, data.shop_close_time, data.shop_close_time, data.table_name, data.packing_charges, data.max_free_delivery_cost, data.minimum_order, data.minimum_km, data.minimum_del_charge, data.per_km_chargers, data.maximum_del_km,data.registration_fee,data.total_registration_fee, data.id]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, values, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, values, cntxtDtls);
};

exports.updateshopsubcategory = function (data, callback) {
	var cntxtDtls = "in updateshopsubcategory";
	var host = data.sub_category;
	var DELETE_QRY = `DELETE FROM shop_subcategory_list_t WHERE shop_id = ?;`;
	var INSERT_QRY = '';
	var params = [data.id];

	for (let i = 0; i < host.length; i++) {
		INSERT_QRY += `INSERT INTO shop_subcategory_list_t (shop_id,location_id,category_id, sub_category_id, sub_category_name, sub_category_image) VALUES (?, ?, ?, ?, ? , ?);`;
		params.push(data.id, data.location_id, data.category_id, host[i].id, host[i].name, host[i].image);
	}

	var FINAL_QRY = DELETE_QRY + INSERT_QRY; // Combine delete and insert queries

	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, FINAL_QRY, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	} else {
		return dbutil.sqlinjection(sqldb.MySQLConPool, FINAL_QRY, params, cntxtDtls);
	}
};

exports.updateshopfilter = function (data, callback) {
	var cntxtDtls = "in updateshopfilter";
	var host = data.filter_id;
	var DELETE_QRY = `DELETE FROM shop_filter_list_t WHERE shop_id = ?;`;
	var INSERT_QRY = '';
	var params = [data.id];

	for (let i = 0; i < host.length; i++) {
		INSERT_QRY += `INSERT INTO shop_filter_list_t (shop_id,location_id,category_id,filter_id, filter_name) VALUES (?, ?, ?, ?, ?);`;
		params.push(data.id, data.location_id, data.category_id, host[i].id, host[i].name);
	}

	var FINAL_QRY = DELETE_QRY + INSERT_QRY; // Combine delete and insert queries

	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, FINAL_QRY, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	} else {
		return dbutil.sqlinjection(sqldb.MySQLConPool, FINAL_QRY, params, cntxtDtls);
	}
};

exports.updateshopintosearchkey = function (data, imageUploadshop, callback) {
	var cntxtDtls = "in updateshopintosearchkey";
	var QRY_TO_EXEC = `UPDATE search_type_t SET search_text = ?, search_image = ?,search_table = ? WHERE search_id = ? AND search_key_type = ?;`;
	let params = [data.shop_name, imageUploadshop, data.table_name, data.id, '3'];

	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
		});
	} else {
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
	}
};

exports.deleteshopreg = function (data, callback) {
	var cntxtDtls = "in deleteshopreg";
	var MU_QRY_TO_EXEC = '';
	var QRY_TO_EXEC = '';
	var params = [];
	for (var j = 0; j < data.length; j++) {
		var QRY_TO_EXEC = `Update shop_list_t set d_in=1 where id = ?;`
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

exports.updateshopactivestatus = function (data, callback) {
	var cntxtDtls = "in updateshopactivestatus";
	var QRY_TO_EXEC = `update shop_list_t set shop_active_status = ? where id = ?;`;
	var params = [data.shop_active_status, data.id]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.updateditemactivestatus = function (data, callback) {
	var cntxtDtls = "in updateditemactivestatus";
	var QRY_TO_EXEC = `update ${data.table_name} set active_status = ? where id = ?;`;
	var params = [data.active_status, data.id]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

// ************* MainModules End **********//

// ************* masters Start **********//

exports.addlocation = function (data, imageupload, callback) {
	var cntxtDtls = "in addlocation";
	var QRY_TO_EXEC = `INSERT INTO location_tbl (location_name,location_image,location_latitude,location_longitude,maximum_delivery_service_km) VALUES (?,?,?,?,?);`;
	let params = [data.location_name, imageupload, data.location_latitude, data.location_longitude, data.maximum_delivery_service_km]
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

exports.updatelocation = function (data, imageupload, callback) {
	var cntxtDtls = "in updatelocation";
	var QRY_TO_EXEC = `update location_tbl set location_name = ?,location_image = ?, location_latitude = ?,location_longitude = ?,maximum_delivery_service_km = ? where id = ?;`;
	var params = [data.location_name, imageupload, data.location_latitude, data.location_longitude, data.maximum_delivery_service_km, data.id]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.updatelocationnameintables = function (data, callback) {
	var cntxtDtls = "in updatelocationnameintables";
	var QRY_TO_EXEC = `update banners_lst_t set location_name = ? where location_id = ?;
	                update coupon_code_t set location_name = ? where location_id = ?;
					update notifications_t set location_name = ? where location_id = ?;
					update racks_list_t set location_name = ? where location_id = ?;
					update slot_timings_t set location_name = ? where location_id = ?;`;
	var params = [data.location_name, data.id, data.location_name, data.id, data.location_name, data.id, data.location_name, data.id, data.location_name, data.id]
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

exports.addcategory = function (data, imageupload, callback) {
	var cntxtDtls = "in addcategory";

	function sanitizeTableName(categoryName) {
		return categoryName
			.toLowerCase() // Convert to lowercase
			.replace(/[^a-z0-9]/gi, '_') // Replace non-alphanumeric characters with underscores
			.replace(/_+/g, '_') // Replace multiple underscores with a single one
			.replace(/^_|_$/g, ''); // Remove leading or trailing underscores
	}

	var sanitizedCategory = sanitizeTableName(data.category_name);
	var tableName = `z_${sanitizedCategory}_item_lst_t`;

	// var tableName = `shop_item_tbl_${data.category_name.replace(/\s+/g, '_')}`;
	// var tableName = `z_${data.category_name.replace(/\s+/g, '_')}_item_lst_t`;

	var createTableQuery = `CREATE TABLE ${tableName} (
                        id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
                        shop_id varchar(255) NOT NULL DEFAULT '',                        
                        item_id int(11) NOT NULL DEFAULT 0,
                        item_name varchar(255) NOT NULL DEFAULT '',
                        item_image varchar(255) DEFAULT '',
                        item_description longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
						category_id int(11) NOT NULL,
                        category_name varchar(255) NOT NULL DEFAULT '',
                        sub_category_id int(11) NOT NULL,
                        sub_category_name varchar(255) NOT NULL DEFAULT '',
                        filter_one text DEFAULT NULL,
                        filter_two text DEFAULT NULL,
                        actual_price varchar(255) NOT NULL DEFAULT '0',
                        selling_price varchar(255) NOT NULL DEFAULT '0',
                        discount_percentage varchar(255) NOT NULL DEFAULT '0',
                        discount_amount varchar(255) NOT NULL DEFAULT '0',
						admin_percentage INT(11) NOT NULL DEFAULT '0',
                        active_status varchar(20) NOT NULL DEFAULT '0' COMMENT 'if item active 0 else 1',
                        item_priority int(11) NOT NULL DEFAULT 0,
						entry_by int(11) NOT NULL DEFAULT 0,
                        i_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        d_in int(11) NOT NULL DEFAULT 0
                      )`;

	var shopname = tableName.toLowerCase();

	var insertCategoryQuery = `INSERT INTO category_tbl (category_name, category_image, shop_items_tb_nm) VALUES (?, ?, ?);`;

	let params = [data.category_name, imageupload, shopname];
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, createTableQuery, [], cntxtDtls, function (err) {
			if (err) {
				callback(err, null);
				return;
			}
			dbutil.sqlinjection(sqldb.MySQLConPool, insertCategoryQuery, params, cntxtDtls, function (err, results) {
				callback(err, results);
				return;
			});
		});
	} else {
		return dbutil.sqlinjection(sqldb.MySQLConPool, createTableQuery, [], cntxtDtls)
			.then(() => dbutil.sqlinjection(sqldb.MySQLConPool, insertCategoryQuery, params, cntxtDtls));
	}
};

exports.addcategoryintosearch = function (insertId, data, imageupload, callback) {
	var cntxtDtls = "in addcategoryintosearch";
	var QRY_TO_EXEC = `INSERT INTO search_type_t (search_key_type,search_text,search_image,search_id,search_table) VALUES (?,?,?,?,?);`;
	let params = ['1', data.category_name, imageupload, insertId, 'shop_list_t']
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

exports.updatecategoryinsearch = function (data, imageupload, callback) {
	var cntxtDtls = "in updatecategoryinsearch";
	var QRY_TO_EXEC = `UPDATE search_type_t SET search_text = ?, search_image = ? WHERE search_id = ? AND search_key_type = ?;
                        UPDATE sub_category_tbl SET category_name = ? WHERE category_id = ?;
						UPDATE main_filter_tbl SET category_name = ? WHERE category_id = ?;
						UPDATE ${data.table_name} SET category_name = ? WHERE category_id = ?;`;
	let params = [data.category_name, imageupload, data.id, '1', data.category_name, data.id, data.category_name, data.id, data.category_name, data.id];

	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
		});
	} else {
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
	}
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

exports.addsubcategory = function (data, imageupload, callback) {
	var cntxtDtls = "in addsubcategory";
	var QRY_TO_EXEC = `INSERT INTO sub_category_tbl (sub_category_name,sub_category_image,category_id,category_name) VALUES (?,?,?,?);`;
	let params = [data.sub_category_name, imageupload, data.category_id, data.category_name]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.addsubcategoryintosearch = function (insertId, data, imageupload, callback) {
	var cntxtDtls = "in addsubcategoryintosearch";
	var QRY_TO_EXEC = `INSERT INTO search_type_t (search_key_type,search_text,search_image,search_id,search_table) VALUES (?,?,?,?,?);`;
	let params = ['2', data.sub_category_name, imageupload, insertId, 'shop_subcategory_list_t']
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.getsubcategory = function (callback) {
	var cntxtDtls = "in getsubcategory";
	var QRY_TO_EXEC = `SELECT * FROM sub_category_tbl WHERE d_in=0 order by id desc;`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.updatesubcategory = function (data, imageupload, callback) {
	var cntxtDtls = "in updatesubcategory";
	var QRY_TO_EXEC = `update sub_category_tbl set category_id = ?,category_name = ?,sub_category_name = ?,sub_category_image = ? where id = ?;`;
	var params = [data.category_id, data.category_name, data.sub_category_name, imageupload, data.id]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.updatesubcategoryinsearch = function (data, imageupload, callback) {
	var cntxtDtls = "in updatesubcategoryinsearch";
	var QRY_TO_EXEC = `Update search_type_t set search_text = ?,search_image = ? where search_id = ? AND search_key_type = ?;
	                 Update ${data.table_name} set sub_category_name = ? where sub_category_id = ?;
					 Update shop_subcategory_list_t set sub_category_name = ?,sub_category_image = ? where sub_category_id = ?;`;
	let params = [data.sub_category_name, imageupload, data.id, '2', data.sub_category_name, data.id, data.sub_category_name, imageupload, data.id]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.deletesubcategory = function (data, callback) {
	var cntxtDtls = "in deletesubcategory";
	var MU_QRY_TO_EXEC = '';
	var QRY_TO_EXEC = '';
	var params = [];
	for (var j = 0; j < data.length; j++) {
		var QRY_TO_EXEC = `Update sub_category_tbl set d_in=1 where id = ?;`
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

exports.getmatchedcategory = function (id, callback) {
	var cntxtDtls = "in getmatchedcategory";
	var QRY_TO_EXEC = `SELECT * FROM sub_category_tbl WHERE category_id = ? AND d_in = 0 ORDER BY sub_category_name ASC;`;
	let params = [id]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.addmainfilter = function (data, callback) {
	var cntxtDtls = "in addmainfilter";
	var createddate = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	var QRY_TO_EXEC = `INSERT INTO main_filter_tbl (category_id,category_name,main_filter_name,i_ts) VALUES (?,?,?,?);`;
	let params = [data.category_id, data.category_name, data.main_filter_name, createddate]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.getmainfilter = function (callback) {
	var cntxtDtls = "in getmainfilter";
	var QRY_TO_EXEC = `SELECT * FROM main_filter_tbl WHERE d_in=0 order by id desc;`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.updatemainfilter = function (data, callback) {
	var cntxtDtls = "in updatemainfilter";
	var QRY_TO_EXEC = `update main_filter_tbl set category_id = ?,category_name = ?,main_filter_name = ? where id = ?;`;
	var params = [data.category_id, data.category_name, data.main_filter_name, data.id]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.updatefiltersintables = function (data, callback) {
	var cntxtDtls = "in updatefiltersintables";
	var QRY_TO_EXEC = `update shop_filter_list_t set filter_name = ? where filter_id = ?;`;
	var params = [data.main_filter_name, data.id]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.deletemainfilter = function (data, callback) {
	var cntxtDtls = "in deletemainfilter";
	var MU_QRY_TO_EXEC = '';
	var QRY_TO_EXEC = '';
	var params = [];
	for (var j = 0; j < data.length; j++) {
		var QRY_TO_EXEC = `Update main_filter_tbl set d_in=1 where id = ?;`
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
	var QRY_TO_EXEC = `INSERT INTO banners_lst_t (location_id,location_name,banner_image,shop_id,item_id,item_name,i_ts) VALUES (?,?,?,?,?,?,?);`;
	let params = [data.location_id, data.location_name, imageupload, data.shop_id, data.item_id, data.item_name, createddate]
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
	var QRY_TO_EXEC = `SELECT a.*,b.shop_name FROM banners_lst_t as a LEFT JOIN shop_list_t as b ON a.shop_id = b.id WHERE a.d_in = 0 `;

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
	var QRY_TO_EXEC = `update banners_lst_t set location_id = ?,location_name = ?,shop_id = ?,item_id = ?,item_name = ?,banner_image = ? where id = ?;`;
	var params = [data.location_id, data.location_name, data.shop_id, data.item_id, data.item_name, imageupload, data.id]
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
	var QRY_TO_EXEC = `INSERT INTO coupon_code_t (location_id,location_name,shop_id,coupon_name,coupon_description,coupon_percentage,coupon_upto_price,coupon_max_price_limit,entry_by) VALUES (?,?,?,?,?,?,?,?,?);`;
	let params = [data.location_id, data.location_name, data.shop_id, data.coupon_name, data.coupon_description, data.coupon_percentage, data.coupon_upto_price, data.coupon_max_price_limit, data.entry_by]
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
	var QRY_TO_EXEC = `SELECT a.*, CASE WHEN a.shop_id = 0 THEN 'All' ELSE b.shop_name END AS shop_name FROM coupon_code_t AS a LEFT JOIN shop_list_t AS b ON b.id = a.shop_id WHERE a.d_in = 0 `;
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
	var QRY_TO_EXEC = `update coupon_code_t set coupon_name = ?,coupon_description = ?, location_id = ?,location_name = ? ,shop_id = ?,coupon_percentage = ? ,coupon_upto_price = ?,coupon_max_price_limit = ? where id = ?;`;
	var params = [data.coupon_name, data.coupon_description, data.location_id, data.location_name, data.shop_id, data.coupon_percentage, data.coupon_upto_price, data.coupon_max_price_limit, data.id]
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

exports.adddeliveryboy = function (data, callback) {
	var cntxtDtls = "in adddeliveryboy";
	var QRY_TO_EXEC = `INSERT INTO delivery_boy_t (delivery_boy_name,delivery_boy_mobile_number,delivery_boy_password,delivery_boy_address,delivery_boy_location_id,delivery_boy_franchise_id,entry_by) VALUES (?,?,?,?,?,?,?);`;
	let params = [data.delivery_boy_name, data.delivery_boy_mobile_number, data.delivery_boy_password, data.delivery_boy_address, data.delivery_boy_location_id, data.delivery_boy_franchise_id, data.entry_by]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.getdeliveryboy = function (callback) {
	var cntxtDtls = "in getdeliveryboy";
	var QRY_TO_EXEC = `SELECT a.*,b.location_name,c.franchise_name FROM delivery_boy_t as a LEFT JOIN location_tbl as b ON a.delivery_boy_location_id = b.id LEFT JOIN franchise_t as c ON c.id = a.delivery_boy_franchise_id WHERE a.d_in = 0 ORDER BY a.id DESC;`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.updatedeliveryboy = function (data, callback) {
	var cntxtDtls = "in updatedeliveryboy";
	var QRY_TO_EXEC = `update delivery_boy_t set delivery_boy_name = ?,delivery_boy_mobile_number = ?,delivery_boy_address = ?,delivery_boy_location_id = ?,delivery_boy_franchise_id = ? where id = ?;`;
	var params = [data.delivery_boy_name, data.delivery_boy_mobile_number, data.delivery_boy_address, data.delivery_boy_location_id, data.delivery_boy_franchise_id, data.id]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.deletedeliveryboy = function (data, callback) {
	var cntxtDtls = "in deletedeliveryboy";
	var MU_QRY_TO_EXEC = '';
	var QRY_TO_EXEC = '';
	var params = [];
	for (var j = 0; j < data.length; j++) {
		var QRY_TO_EXEC = `Update delivery_boy_t set d_in=1 where id = ?;`
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

exports.updatedeliveryboyactivestatus = function (data, callback) {
	var cntxtDtls = "in updatedeliveryboyactivestatus";
	var QRY_TO_EXEC = `update delivery_boy_t set delivery_boy_active_status = ? where id = ?;`;
	var params = [data.delivery_boy_active_status, data.id]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.addfranchise = function (data, callback) {
	var cntxtDtls = "in addfranchise";
	let locationIdString = Array.isArray(data.location_id) ? data.location_id.join(",") : data.location_id;
	var QRY_TO_EXEC = `INSERT INTO franchise_t (franchise_name,franchise_mobile_number,location_id,entry_by) VALUES (?,?,?,?);`;
	let params = [data.franchise_name, data.franchise_mobile_number, locationIdString, data.entry_by]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.updatefranchiseidintolocation = function (insertId, data, callback) {
	var cntxtDtls = "in updatefranchiseidintolocation";
	var host = data.location_id
	var MU_QRY_TO_EXEC = '';
	var QRY_TO_EXEC = '';
	var params = [];
	for (let i = 0; i < host.length; i++) {
		QRY_TO_EXEC = `Update location_tbl set franchise_id = ? where id = ?;`;
		MU_QRY_TO_EXEC = MU_QRY_TO_EXEC + QRY_TO_EXEC;
		params.push(insertId, host[i]);
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

exports.addfranchisedatainuserstbl = function (insertId, data, callback) {
	var cntxtDtls = "in addfranchisedatainuserstbl";
	var QRY_TO_EXEC = `INSERT INTO users (admin_type ,name ,number ,shop_id, pwd) VALUES (?,?,?,?,?);`;
	let value = ['2', data.franchise_name, data.franchise_mobile_number, insertId, '123456']
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, value, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, value, cntxtDtls);
};

exports.addfranchisepermissions = function (insertId, data, callback) {
	var cntxtDtls = "in addfranchisepermissions";
	var host = [
		{ module_id: 5, sub_module_id: 4 },
		{ module_id: 5, sub_module_id: 5 },
		{ module_id: 8, sub_module_id: 7 },
		{ module_id: 5, sub_module_id: 9 },
		{ module_id: 5, sub_module_id: 10 },
		{ module_id: 8, sub_module_id: 11 },
		{ module_id: 12, sub_module_id: 6 },
		{ module_id: 3, sub_module_id: 13 },
		{ module_id: 3, sub_module_id: 14 },
		{ module_id: 3, sub_module_id: 15 },
		{ module_id: 3, sub_module_id: 16 },
		{ module_id: 7, sub_module_id: 17 },
		{ module_id: 7, sub_module_id: 18 },
		{ module_id: 7, sub_module_id: 19 },
		{ module_id: 7, sub_module_id: 20 },
		{ module_id: 8, sub_module_id: 21 },
		{ module_id: 4, sub_module_id: 22 },
		{ module_id: 6, sub_module_id: 23 },
	];
	var MU_QRY_TO_EXEC = '';
	var QRY_TO_EXEC = '';
	var params = [];
	for (let i = 0; i < host.length; i++) {
		QRY_TO_EXEC = `insert into admin_permission (user_id,module_id,sub_module_id) values(?,?,?);`;
		MU_QRY_TO_EXEC = MU_QRY_TO_EXEC + QRY_TO_EXEC;
		params.push(insertId, host[i].module_id, host[i].sub_module_id);
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

exports.getfranchise = function (callback) {
	var cntxtDtls = "in getfranchise";
	var QRY_TO_EXEC = `SELECT a.*, GROUP_CONCAT(b.location_name ORDER BY FIELD(b.id, a.location_id) SEPARATOR ', ') AS location_names FROM franchise_t AS a LEFT JOIN location_tbl AS b ON FIND_IN_SET(b.id, a.location_id) WHERE a.d_in = 0 GROUP BY a.id ORDER BY a.id DESC;`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.updatefranchise = function (data, callback) {
	var cntxtDtls = "in updatefranchise";
	let locationIdString = Array.isArray(data.location_id) ? data.location_id.join(",") : data.location_id;
	var QRY_TO_EXEC = `update franchise_t set franchise_name = ?,franchise_mobile_number = ?,location_id = ? where id = ?;`;
	var params = [data.franchise_name, data.franchise_mobile_number, locationIdString, data.id]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.editfranchiseidinlocation = function (data, callback) {
	var cntxtDtls = "in editfranchiseidinlocation";
	let locations = Array.isArray(data.location_id) ? data.location_id : [data.location_id];
	var MU_QRY_TO_EXEC = '';
	var params = [];

	let resetQuery = `UPDATE location_tbl SET franchise_id = 0 WHERE franchise_id = ?;`;
	MU_QRY_TO_EXEC += resetQuery;
	params.push(data.id);

	locations.forEach(locationId => {
		MU_QRY_TO_EXEC += ` UPDATE location_tbl SET franchise_id = ? WHERE id = ?;`;
		params.push(data.id, locationId);
	});
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, MU_QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	} else {
		return dbutil.sqlinjection(sqldb.MySQLConPool, MU_QRY_TO_EXEC, params, cntxtDtls);
	}
};

exports.deletefranchise = function (data, callback) {
	var cntxtDtls = "in deletefranchise";
	var MU_QRY_TO_EXEC = '';
	var QRY_TO_EXEC = '';
	var params = [];
	for (var j = 0; j < data.length; j++) {
		var QRY_TO_EXEC = `Update franchise_t set d_in=1 where id = ?;`
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

// ************* masters End **********//

// ************* masters End **********//

exports.getcustomerlist = function (data, callback) {
	var cntxtDtls = "in getcustomerlist";
	var QRY_TO_EXEC = `SELECT a.*, COUNT(o.id) AS total_orders, SUM(CASE WHEN o.order_status = 3 THEN 1 ELSE 0 END) AS completed_orders, SUM(CASE WHEN o.order_status = 5 THEN 1 ELSE 0 END) AS rejected_orders, SUM(CASE WHEN o.order_status IN (1,2) THEN 1 ELSE 0 END) AS pending_orders FROM customer_list_t AS a LEFT JOIN order_lst_t AS o ON a.id = o.customer_id WHERE a.location_id = ? GROUP BY a.id ORDER BY a.id DESC;`;
	let params = [data.filters.location]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.getuserwalletlist = function (data, callback) {
	var cntxtDtls = "in getuserwalletlist";
	var QRY_TO_EXEC = `SELECT a.*,b.customer_name,b.customer_mobile_number,DATE_FORMAT(a.i_ts, '%Y-%m-%d %H:%i:%s') AS formatted_date_time FROM user_wallet_t as a LEFT JOIN customer_list_t AS b ON a.user_id = b.id WHERE a.location_id = ? ORDER BY a.id DESC;`;
	let params = [data.filters.location]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.getsubscriptionlist = function (data, callback) {
	var cntxtDtls = "in getsubscriptionlist";
	var QRY_TO_EXEC = `SELECT a.*,b.measurement_type,b.rack_code,c.customer_name,c.customer_mobile_number,c.location_name,DATE_FORMAT(a.subscription_start_date, '%Y-%m-%d') AS start_date FROM subscription_order_list_t as a LEFT JOIN z_grocery_item_list_t as b ON a.item_id = b.id LEFT JOIN customer_list_t as c ON a.customer_id = c.id WHERE c.location_id = ? ORDER BY a.id DESC;`;
	let params = [data.filters.location]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.getwalletpayments = function (data, callback) {
	var cntxtDtls = "in getwalletpayments";
	var QRY_TO_EXEC = `SELECT a.*,DATE_FORMAT(a.i_ts, '%Y-%m-%d %H:%i:%s') AS formatted_date_time FROM user_wallet_sub_t as a WHERE a.user_id = ? ORDER BY a.id DESC;`;
	let params = [data.id]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.getsubscriptiondetails = function (data, callback) {
	var cntxtDtls = "in getsubscriptiondetails";
	var QRY_TO_EXEC = `SELECT a.*,DATE_FORMAT(a.received_date_time, '%Y-%m-%d %H:%i:%s') AS formatted_date_time FROM recieved_subscription_order_times_t as a WHERE a.order_id = ? ORDER BY a.id DESC;`;
	let params = [data.id]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.getsubscriptionstogenerate = function (data, callback) {
	var cntxtDtls = "in getsubscriptionstogenerate";
	var QRY_TO_EXEC = `SELECT a.*,b.customer_name FROM subscription_order_list_t as a LEFT JOIN customer_list_t as b ON a.customer_id = b.customer_name WHERE a.next_delivery_date = ? AND a.subscription_status = '0';`;
	let params = [data.pickdate]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.getsubscriptionstoreports = function (data, callback) {
	var cntxtDtls = "in getsubscriptionstoreports";
	var QRY_TO_EXEC = `SELECT a.*,b.customer_name,DATE_FORMAT(a.subscription_order_date, '%Y-%m-%d') AS formatted_date FROM recieved_subscription_order_times_t as a LEFT JOIN customer_list_t as b ON a.customer_id = b.customer_name WHERE a.subscription_order_date = ? ;`;
	let params = [data.pickdate]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.submitsubscriptionorders = function (data, callback) {
	var cntxtDtls = "in submitsubscriptionorders";
	var host = data.subscriptions;
	var QRY_TO_EXEC = '';
	var MU_QRY_TO_EXEC = '';
	let params = [];
	for (let i = 0; i < host.length; i++) {
		QRY_TO_EXEC = `insert into recieved_subscription_order_times_t (order_id, subscription_order_id,customer_id,item_name,subscription_type,subscription_order_date,received_quantity,received_item_amount,delivery_boy_id,delivery_boy_name) values(?,?,?,?,?,?,?,?,?,?);`;
		MU_QRY_TO_EXEC = MU_QRY_TO_EXEC + QRY_TO_EXEC;
		params.push(host[i].id, host[i].order_id, host[i].customer_id, host[i].item_name, host[i].subscription_type, host[i].next_delivery_date, host[i].sub_item_count, host[i].item_total_amount, host[i].delivery_boy_id, host[i].delivery_boy_name);
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

exports.updatesinglesubscription = function (data, callback) {
	var cntxtDtls = "in updatesinglesubscription";
	var QRY_TO_EXEC = `Update recieved_subscription_order_times_t set delivery_boy_id = ?,delivery_boy_name = ? where id = ?;`;
	let params = [data.delivery_boy_id, data.delivery_boy_name, data.order_id]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.getdeliveryboyslist = function (callback) {
	var cntxtDtls = "in getdeliveryboyslist";
	var QRY_TO_EXEC = `SELECT a.id,a.delivery_boy_name,a.delivery_boy_mobile_number FROM delivery_boy_t AS a WHERE a.d_in = 0 AND delivery_boy_active_status = 0 ORDER BY a.delivery_boy_name DESC;`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.getorderslist = function (data, callback) {
	var cntxtDtls = "in getorderslist";
	var QRY_TO_EXEC = `SELECT a.*,b.category_name,DATE_FORMAT(a.order_date_time, '%d-%m-%Y %H:%i:%s') AS orderdate, CONCAT(a.customer_name, ' (', a.customer_mobile_number, ')') AS customer_info,c.shop_name,c.shop_phone_number,c.shop_address FROM order_lst_t as a LEFT JOIN category_tbl as b ON a.category_id = b.id LEFT JOIN shop_list_t as c ON a.shop_id = c.id where 1=1 `;

	var params = [];
	if (data.from_date && data.to_date) {
		QRY_TO_EXEC += ` AND DATE(a.order_date_time) BETWEEN ? AND ?`;
		params.push(data.from_date, data.to_date);
	}

	if (data.category_id) {
		QRY_TO_EXEC += ` AND a.category_id = ?`;
		params.push(data.category_id);
	}

	if (data.location_id) {
		QRY_TO_EXEC += ` AND a.location_id = ?`;
		params.push(data.location_id);
	}

	if (data.shop_id) {
		QRY_TO_EXEC += ` AND a.shop_id = ?`;
		params.push(data.shop_id);
	}

	QRY_TO_EXEC += ` ORDER BY a.id DESC`;

	if (params.length === 0) {
		return callback(null, []);
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

exports.updateorderstatus = function (data, callback) {
	var cntxtDtls = "in updateorderstatus";
	var QRY_TO_EXEC = `Update order_lst_t set order_status = ? where id = ?`;
	let params = [data.value, data.id]

	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.getorderdetails = function (data, callback) {
	var cntxtDtls = "in getorderdetails";
	var QRY_TO_EXEC = `SELECT a.*,b.shop_name FROM sub_orders_items_t as a LEFT JOIN shop_list_t AS b ON a.shop_id = b.id WHERE a.order_id = ? ;`;
	let params = [data.id]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.getcustomerorderdetails = function (data, callback) {
	var cntxtDtls = "in getcustomerorderdetails";
	var QRY_TO_EXEC = `SELECT a.*,b.shop_name FROM sub_orders_items_t as a LEFT JOIN shop_list_t AS b ON a.shop_id = b.id WHERE a.order_id = ? ;`;
	let params = [data.id]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.getshopsforpayments = function (data, callback) {
	var cntxtDtls = "in getshopsforpayments";
	var QRY_TO_EXEC = `SELECT a.id, a.vendor_payment_otp,a.admin_percentage, SUM(b.admin_payment) as admin_share,CONCAT(a.shop_name, ' (', a.shop_phone_number, ')') AS shop_info, a.shop_image, COUNT(b.id) AS total_orders, CONCAT(MIN(b.order_date), ' - ', MAX(b.order_date)) AS date_range, SUM(b.grand_total) AS total_amount,SUM(b.delivery_charges_gst + b.packing_charges_gst + b.razorpay_gst) AS gst_charges, SUM(b.razorpay_charges) as online_charges, JSON_ARRAYAGG(b.id) AS order_ids,SUM(b.delivery_charges_gst) as total_delivery_gst,SUM(b.packing_charges_gst) as total_packing_gst,SUM(b.razorpay_gst) as total_razorpay_gst FROM shop_list_t AS a JOIN order_lst_t AS b ON a.id = b.shop_id WHERE a.d_in = '0' AND b.vendor_payment_status = 0 AND b.order_status = 3 `;

	var params = [];

	if (data.filters.location) {
		QRY_TO_EXEC += ` AND a.location_id = ?`;
		params.push(data.filters.location);
	}

	if (data.filters.category) {
		QRY_TO_EXEC += ` AND a.category_id = ?`;
		params.push(data.filters.category);
	}

	QRY_TO_EXEC += ` GROUP BY a.id, a.shop_name, a.shop_phone_number, a.shop_image ORDER BY a.shop_name `;

	if (params.length === 0) {
		return callback(null, []);
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

exports.submitpaymentdetails = function (data, callback) {
	var cntxtDtls = "in submitpaymentdetails";
	var createddate = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	var QRY_TO_EXEC = `INSERT INTO vendor_payment_t (vendor_id,payment_dates ,order_ids,total_orders, total_amount_A,admin_share_B,admin_percentage,total_delivery_gst,total_packing_gst,total_razorpay_gst,gst_charges_C,online_charges_D,misc_deductions_E,total_payment_amount,payment_date_time) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`;
	let value = [data.vendor_id, data.payment_dates, JSON.stringify(data.order_ids), data.total_orders, data.total_amount, data.admin_share, data.admin_percentage, data.total_delivery_gst, data.total_packing_gst, data.total_razorpay_gst, data.gst_charges, data.online_charges, data.miscDeductions, data.total_payment_amount, createddate]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, value, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, value, cntxtDtls);
};


exports.updatevendorpaymentstatus = function (data, callback) {
	var cntxtDtls = "in updatevendorpaymentstatus";
	var host = Array.isArray(data.order_ids) ? data.order_ids : JSON.parse(data.order_ids);
	var QRY_TO_EXEC = '';
	var MU_QRY_TO_EXEC = '';
	let params = [];
	for (let i = 0; i < host.length; i++) {
		QRY_TO_EXEC = `UPDATE order_lst_t SET vendor_payment_status = ? where id = ? ;`;
		MU_QRY_TO_EXEC = MU_QRY_TO_EXEC + QRY_TO_EXEC;
		params.push('1', host[i]);
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

exports.updatepaymentotp = function (data, callback) {
	var cntxtDtls = "in updatepaymentotp";
	let randomOTP = Math.floor(100000 + Math.random() * 900000);
	var QRY_TO_EXEC = `UPDATE shop_list_t set vendor_payment_otp = ? where id = ? ;`;
	let value = [randomOTP, data.vendor_id]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, value, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, value, cntxtDtls);
};

exports.getpaymenthistory = function (data, callback) {
	var cntxtDtls = "in getpaymenthistory";
	var QRY_TO_EXEC = `SELECT a.*,b.shop_name,b.shop_phone_number,b.location_id,b.category_id,DATE_FORMAT(a.payment_date_time, '%Y-%m-%d %H:%i:%s') AS settlement_date_time FROM vendor_payment_t as a LEFT JOIN shop_list_t as b ON a.vendor_id = b.id WHERE 1=1 `;

	var params = [];

	if (data.filters.location) {
		QRY_TO_EXEC += ` AND b.location_id = ?`;
		params.push(data.filters.location);
	}

	if (data.filters.category) {
		QRY_TO_EXEC += ` AND b.category_id = ?`;
		params.push(data.filters.category);
	}

	if (data.filters.shop) {
		QRY_TO_EXEC += ` AND a.vendor_id = ?`;
		params.push(data.filters.shop);
	}

	QRY_TO_EXEC += ` ORDER BY a.id `;

	if (params.length === 0) {
		return callback(null, []);
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

// ************* masters End **********//

// ************* Products Start **********//

exports.getmatchedfilter = function (id, callback) {
	var cntxtDtls = "in getmatchedfilter";
	var QRY_TO_EXEC = `SELECT * FROM main_filter_tbl WHERE category_id = ? AND d_in = 0 ORDER BY main_filter_name ASC;`;
	let params = [id]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.additems = function (data, imageupload, callback) {
	var cntxtDtls = "in additems";
	var createddate = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	var QRY_TO_EXEC = `INSERT INTO z_all_items_t (category_id,category_name,sub_category_id,sub_category_name,item_name,item_description,item_image,filter_one,actual_price,selling_price,discount_percentage,discount_amount,i_ts,entry_by) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?);`;
	let params = [data.category_id, data.category_name, data.sub_category_id, data.sub_category_name, data.item_name, data.item_description, imageupload, data.filter_one, data.actual_price, data.selling_price, data.discount_percentage, data.discount_amount, createddate, data.entry_by]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.additemintosearch = function (insertId, data, imageupload, callback) {
	var cntxtDtls = "in additemintosearch";
	var QRY_TO_EXEC = `INSERT INTO search_type_t (search_key_type,search_text,search_image,search_id,search_table) VALUES (?,?,?,?,?);`;
	let params = ['4', data.item_name, imageupload, insertId, data.table_name]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.getitems = function (data, callback) {
	var cntxtDtls = "in getitems";
	var QRY_TO_EXEC = `SELECT * FROM z_all_items_t WHERE category_id = ? AND d_in = 0 ORDER BY id DESC;`;
	let params = [data.filters.category]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.updateitems = function (data, imageupload, callback) {
	var cntxtDtls = "in updateitems";
	var QRY_TO_EXEC = `update z_all_items_t set category_id = ?,category_name = ?,sub_category_id = ?,sub_category_name = ?,item_name = ?,item_description = ?,item_image = ?,filter_one = ?,actual_price = ?,selling_price = ?,discount_percentage = ?,discount_amount = ? where id = ?;`;
	var params = [data.category_id, data.category_name, data.sub_category_id, data.sub_category_name, data.item_name, data.item_description, imageupload, data.filter_one, data.actual_price, data.selling_price, data.discount_percentage, data.discount_amount, data.id]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.updateitemsinsearch = function (data, imageupload, callback) {
	var cntxtDtls = "in updateitemsinsearch";
	var QRY_TO_EXEC = `Update search_type_t set search_text = ?,search_image = ?,search_table = ? where search_id = ? AND search_key_type = ? ;`;
	let params = [data.item_name, imageupload, data.table_name, data.id, '4']
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.deleteitems = function (data, callback) {
	var cntxtDtls = "in deleteitems";
	var MU_QRY_TO_EXEC = '';
	var QRY_TO_EXEC = '';
	var params = [];
	for (var j = 0; j < data.length; j++) {
		var QRY_TO_EXEC = `Update z_all_items_t set d_in=1 where id = ?;`
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

exports.getmatchedshops = function (callback) {
	var cntxtDtls = "in getmatchedshops";
	var QRY_TO_EXEC = `SELECT a.id,a.shop_unique_id, a.shop_name,a.shop_phone_number,a.shop_address,a.location_id,a.category_id,b.shop_items_tb_nm FROM shop_list_t as a LEFT JOIN category_tbl as b ON a.category_id = b.id WHERE a.d_in = 0 ORDER BY shop_name ASC;`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.getmatchedallshops = function (id, callback) {
	var cntxtDtls = "in getmatchedallshops";
	var QRY_TO_EXEC = `SELECT a.id,a.shop_unique_id,a.admin_percentage,a.shop_name,a.shop_address,a.shop_phone_number,a.location_id FROM shop_list_t as a WHERE a.category_id = ? AND a.d_in = 0 ORDER BY shop_name ASC;`;
	let params = [id]

	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.getmatchedshopitems = function (data, callback) {
	var cntxtDtls = "in getmatchedshopitems";
	var QRY_TO_EXEC = `SELECT a.id,a.item_name FROM ${data.table_name} as a WHERE a.shop_id = ? AND a.d_in = 0 ORDER BY item_name ASC;`;
	let params = [data.shop_id]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.getitemstoassign = function (data, callback) {
	var cntxtDtls = "in getitemstoassign";
	var QRY_TO_EXEC = `SELECT * FROM z_all_items_t AS a WHERE a.category_id = ? AND a.id NOT IN ( SELECT item_id FROM ${data.table_name} WHERE d_in = 0 AND category_id = ? AND shop_id = ?) ORDER BY sub_category_name ASC;`;
	let params = [data.category_id, data.category_id, data.shop_id]

	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.submitassignedproducts = function (data, callback) {
	var cntxtDtls = "in submitassignedproducts";
	var item = data.items
	var MU_QRY_TO_EXEC = '';
	var QRY_TO_EXEC = '';
	var params = [];
	for (var j = 0; j < item.length; j++) {
		var QRY_TO_EXEC = `INSERT INTO ${data.table_name} (shop_id,item_id,item_name,item_image,item_description,category_id,category_name,sub_category_id,sub_category_name,filter_one,actual_price,selling_price,discount_percentage,discount_amount,admin_percentage,entry_by) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`
		MU_QRY_TO_EXEC = MU_QRY_TO_EXEC + QRY_TO_EXEC;
		params.push(item[j].shop_id, item[j].item_id, item[j].item_name, item[j].item_image, item[j].item_description, item[j].category_id, item[j].category_name, item[j].sub_category_id, item[j].sub_category_name, item[j].filter_one, item[j].actual_price, item[j].selling_price, item[j].discount_percentage, item[j].discount_amount, item[j].admin_percentage, item[j].entry_by)
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

exports.getshopitems = function (data, callback) {
	var cntxtDtls = "in getshopitems";
	var QRY_TO_EXEC = `SELECT * FROM ${data.table_name} as a WHERE a.shop_id = ? AND a.d_in = 0 ORDER BY id DESC;;`;
	let params = [data.shop_id]

	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.updateshopitem = function (data, callback) {
	var cntxtDtls = "in updateshopitem";
	var QRY_TO_EXEC = `update ${data.table_name} set category_id = ?,category_name = ?,sub_category_id = ?,sub_category_name = ?,item_name = ?,item_description = ?,filter_one = ?,actual_price = ?,selling_price = ?,discount_percentage = ?,discount_amount = ? where id = ?;`;
	var params = [data.category_id, data.category_name, data.sub_category_id, data.sub_category_name, data.item_name, data.item_description, data.filter_one, data.actual_price, data.selling_price, data.discount_percentage, data.discount_amount, data.id]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.deleteshopitems = function (data, callback) {
	var cntxtDtls = "in deleteshopitems";
	var MU_QRY_TO_EXEC = '';
	var QRY_TO_EXEC = '';
	var params = [];
	for (var j = 0; j < data.ids.length; j++) {
		var QRY_TO_EXEC = `Update ${data.table_name} set d_in=1 where id = ?;`
		MU_QRY_TO_EXEC = MU_QRY_TO_EXEC + QRY_TO_EXEC;
		params.push(data.ids[j])
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

exports.addshopitemsinmaintbl = function (data, imageupload, callback) {
	var cntxtDtls = "in addshopitemsinmaintbl";
	var QRY_TO_EXEC = `INSERT INTO z_all_items_t (category_id,category_name,sub_category_id,sub_category_name,item_name,item_description,item_image,filter_one,actual_price,selling_price,discount_percentage,discount_amount,entry_by) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?);`;
	let params = [data.category_id, data.category_name, data.sub_category_id, data.sub_category_name, data.item_name, data.item_description, imageupload, data.filter_one, data.actual_price, data.selling_price, data.discount_percentage, data.discount_amount, data.entry_by]

	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.addshopitemsinctgytbl = function (insertid, data, imageupload, callback) {
	var cntxtDtls = "in addshopitemsinctgytbl";
	var QRY_TO_EXEC = `INSERT INTO ${data.table_name} (item_id,shop_id,category_id,category_name,sub_category_id,sub_category_name,item_name,item_description,item_image,filter_one,actual_price,selling_price,discount_percentage,discount_amount,admin_percentage,entry_by) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`;
	let params = [insertid, data.shop_id, data.category_id, data.category_name, data.sub_category_id, data.sub_category_name, data.item_name, data.item_description, imageupload, data.filter_one, data.actual_price, data.selling_price, data.discount_percentage, data.discount_amount, data.admin_percentage, data.entry_by]

	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

// ************* Products End **********//

// ************* Supplier and groceries Start **********//

exports.addslottiming = function (data, callback) {
	var cntxtDtls = "in addslottiming";
	let slot_timings = `${data.from_time} - ${data.to_time}`;
	let slot_range = parseInt(data.from_time.substring(0, 2), 10);
	var QRY_TO_EXEC = `INSERT INTO slot_timings_t (slot_timings,end_time,location_id,location_name,slot_range) VALUES (?,?,?,?,?);`;
	let params = [slot_timings, data.end_time, data.location_id, data.location_name, slot_range]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.getslottiming = function (callback) {
	var cntxtDtls = "in getslottiming";
	var QRY_TO_EXEC = `SELECT a.*, TRIM(SUBSTRING_INDEX(a.slot_timings, '-', 1)) AS from_time, TRIM(SUBSTRING_INDEX(a.slot_timings, '-', -1)) AS to_time FROM slot_timings_t AS a WHERE a.d_in = 0 ORDER BY a.id DESC;`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.updateslottiming = function (data, callback) {
	var cntxtDtls = "in updateslottiming";
	let slot_timings = `${data.from_time} - ${data.to_time}`;
	let slot_range = parseInt(data.from_time.substring(0, 2), 10);
	var QRY_TO_EXEC = `update slot_timings_t set slot_timings = ?,end_time = ?,location_id = ?,location_name = ?,slot_range = ? where id = ?;`;
	var params = [slot_timings, data.end_time, data.location_id, data.location_name, slot_range, data.id]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.deleteslottiming = function (data, callback) {
	var cntxtDtls = "in deleteslottiming";
	var MU_QRY_TO_EXEC = '';
	var QRY_TO_EXEC = '';
	var params = [];
	for (var j = 0; j < data.length; j++) {
		var QRY_TO_EXEC = `Update slot_timings_t set d_in=1 where id = ?;`
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

exports.addrack = function (data, callback) {
	var cntxtDtls = "in addrack";
	var createddate = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	var QRY_TO_EXEC = `INSERT INTO racks_list_t (location_id,location_name,racks_name,shop_id,entry_by) VALUES (?,?,?,?,?);`;
	let params = [data.location_id, data.location_name, data.racks_name, "0", data.entry_by]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.getrack = function (callback) {
	var cntxtDtls = "in getrack";
	var QRY_TO_EXEC = `SELECT a.* FROM racks_list_t as a WHERE a.d_in = 0 ORDER BY a.id DESC;`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.updaterack = function (data, callback) {
	var cntxtDtls = "in updaterack";
	var QRY_TO_EXEC = `update racks_list_t set location_id = ?,location_name = ?, racks_name = ?,shop_id = ? where id = ?;`;
	var params = [data.location_id, data.location_name, data.racks_name, "0", data.id]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.deleterack = function (data, callback) {
	var cntxtDtls = "in deleterack";
	var MU_QRY_TO_EXEC = '';
	var QRY_TO_EXEC = '';
	var params = [];
	for (var j = 0; j < data.length; j++) {
		var QRY_TO_EXEC = `Update racks_list_t set d_in=1 where id = ?;`
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

exports.addsubrack = function (data, callback) {
	var cntxtDtls = "in addsubrack";
	var createddate = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	var QRY_TO_EXEC = `INSERT INTO sub_racks_list_t (racks_id,racks_name,sub_rack_name,entry_by) VALUES (?,?,?,?);`;
	let params = [data.racks_id, data.racks_name, data.sub_rack_name, data.entry_by]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.getsubrack = function (callback) {
	var cntxtDtls = "in getsubrack";
	var QRY_TO_EXEC = `SELECT a.* FROM sub_racks_list_t as a WHERE a.d_in = 0 ORDER BY a.id DESC;`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.updatesubrack = function (data, callback) {
	var cntxtDtls = "in updatesubrack";
	var QRY_TO_EXEC = `update sub_racks_list_t set racks_id = ?, racks_name = ?,sub_rack_name = ? where id = ?;`;
	var params = [data.racks_id, data.racks_name, data.sub_rack_name, data.id]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.deletesubrack = function (data, callback) {
	var cntxtDtls = "in deletesubrack";
	var MU_QRY_TO_EXEC = '';
	var QRY_TO_EXEC = '';
	var params = [];
	for (var j = 0; j < data.length; j++) {
		var QRY_TO_EXEC = `Update sub_racks_list_t set d_in=1 where id = ?;`
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

exports.addshelf = function (data, callback) {
	var cntxtDtls = "in addshelf";
	var createddate = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	var QRY_TO_EXEC = `INSERT INTO shelf_rack_list_t (racks_id,racks_name,sub_rack_id,sub_rack_name,shelf_name,entry_by) VALUES (?,?,?,?,?,?);`;
	let params = [data.racks_id, data.racks_name, data.sub_rack_id, data.sub_rack_name, data.shelf_name, data.entry_by]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.getshelf = function (callback) {
	var cntxtDtls = "in getshelf";
	var QRY_TO_EXEC = `SELECT a.* FROM shelf_rack_list_t as a WHERE a.d_in = 0 ORDER BY a.id DESC;`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.updateshelf = function (data, callback) {
	var cntxtDtls = "in updateshelf";
	var QRY_TO_EXEC = `update shelf_rack_list_t set racks_id = ?, racks_name = ?,sub_rack_id = ?,sub_rack_name = ?,shelf_name = ? where id = ?;`;
	var params = [data.racks_id, data.racks_name, data.sub_rack_id, data.sub_rack_name, data.shelf_name, data.id]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.deleteshelf = function (data, callback) {
	var cntxtDtls = "in deleteshelf";
	var MU_QRY_TO_EXEC = '';
	var QRY_TO_EXEC = '';
	var params = [];
	for (var j = 0; j < data.length; j++) {
		var QRY_TO_EXEC = `Update shelf_rack_list_t set d_in=1 where id = ?;`
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

exports.addshelflocation = function (data, callback) {
	var cntxtDtls = "in addshelflocation";
	// const removeLeadingZeros = (str) => { return str.replace(/([A-Za-z]*)(0*)(\d+)/, '$1$3'); };
	// let rack_code = `${removeLeadingZeros(data.racks_name)}-${removeLeadingZeros(data.sub_rack_name)}-${removeLeadingZeros(data.shelf_name)}-${removeLeadingZeros(data.shelf_location_name)}`;
	var QRY_TO_EXEC = `INSERT INTO shelf_location_list_t (racks_name,sub_rack_name,shelf_name,shelf_location_name,rack_code,entry_by) VALUES (?,?,?,?,?,?);`;
	let params = [ data.racks_name,data.sub_rack_name,data.shelf_name, data.shelf_location_name, data.rack_code, data.entry_by]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.getshelflocation = function (callback) {
	var cntxtDtls = "in getshelflocation";
	var QRY_TO_EXEC = `SELECT a.* FROM shelf_location_list_t as a WHERE a.d_in = 0 ORDER BY a.id DESC;`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.updateshelflocation = function (data, callback) {
	var cntxtDtls = "in updateshelflocation";
	// const removeLeadingZeros = (str) => { return str.replace(/([A-Za-z]*)(0*)(\d+)/, '$1$3'); };
	// let rack_code = `${removeLeadingZeros(data.racks_name)}-${removeLeadingZeros(data.sub_rack_name)}-${removeLeadingZeros(data.shelf_name)}-${removeLeadingZeros(data.shelf_location_name)}`;
	var QRY_TO_EXEC = `update shelf_location_list_t set racks_name = ?,sub_rack_name = ?,shelf_name = ?,shelf_location_name = ?,rack_code = ? where id = ?;`;
	var params = [data.racks_name,data.sub_rack_name,data.shelf_name, data.shelf_location_name, data.rack_code, data.id]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.deleteshelflocation = function (data, callback) {
	var cntxtDtls = "in deleteshelflocation";
	var MU_QRY_TO_EXEC = '';
	var QRY_TO_EXEC = '';
	var params = [];
	for (var j = 0; j < data.length; j++) {
		var QRY_TO_EXEC = `Update shelf_location_list_t set d_in=1 where id = ?;`
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

exports.submitmeasurement = function (data, callback) {
	var cntxtDtls = "in submitmeasurement";
	var QRY_TO_EXEC = `INSERT INTO measurements_tbl (measurements) VALUES (?);`;
	let params = [data.measurements]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.getmeasurements = function (callback) {
	var cntxtDtls = "in getmeasurements";
	var QRY_TO_EXEC = `SELECT * FROM measurements_tbl WHERE d_in = 0 ORDER BY measurements ASC;`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.addgroceryitems = function (data, innerobjectdata, imageupload, entry_by, callback) {
	var cntxtDtls = "in addgroceryitems";

	var QRY_GET_LAST_ARTICLE = `SELECT article_code AS last_article FROM z_grocery_item_list_t ORDER BY id DESC LIMIT 1;`;

	dbutil.sqlinjection(sqldb.MySQLConPool, QRY_GET_LAST_ARTICLE, [], cntxtDtls, function (err, result) {
		if (err) {
			callback(err, null);
			return;
		}

		let lastArticleNumber = result.length > 0 ? parseInt(result[0].last_article.substring(3)) || 0 : 0;

		let nextArticleNumber = lastArticleNumber === 0 ? 1 : lastArticleNumber + 1;
		let newArticleCode = `789${String(nextArticleNumber).padStart(6, '0')}`;

		var QRY_TO_EXEC = `INSERT INTO z_grocery_item_list_t (article_code,ean_code,hsn_code,cgst,sgst,category_id, category_name, sub_category_id, sub_category_name,sub_total_category_id, sub_total_category_name, item_name, item_image,rack_name,sub_rack_name,shelf_name,shelf_location_name,rack_code, manufacturer_name, mbq, soh, supplier_code, supplier_name,entry_by, measurement_type, mrp_price, our_price,selling_price,discount_percentage, discount_amount,shop_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,? ,?, ?);`

		let params = [
			newArticleCode,
			data.ean_code,
			data.hsn_code,
			data.cgst,
			data.sgst,
			data.category_id,
			data.category_name,
			data.sub_category_id,
			data.sub_category_name,
			data.sub_total_category_id,
			data.sub_total_category_name,
			data.item_name,
			imageupload,
			data.rack_name,
			data.sub_rack_name,
			data.shelf_name,
			data.shelf_location_name,
			data.rack_code,
			data.manufacturer_name,
			data.mbq,
			data.soh,
			data.supplier_code,
			data.supplier_name, entry_by, innerobjectdata.measurement_type,
			innerobjectdata.mrp_price,
			innerobjectdata.our_price,
			innerobjectdata.selling_price,
			innerobjectdata.discount_percentage,
			innerobjectdata.discount_amount, "1"

		]
		// if (callback && typeof callback == "function") {
		// 	dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
		// 		callback(err, results);
		// 		return;
		// 	});
		// }
		// else
		// 	return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			if (callback && typeof callback == "function") {
				callback(err, results);
			}
		});
	});
};

exports.addgroceryitemintosearch = function (insertIds, data, imageupload, callback) {
	var cntxtDtls = "in addgroceryitemintosearch";
	var QRY_TO_EXEC = `INSERT INTO search_type_t (search_key_type, search_text, search_image, search_id, search_table) VALUES ?`;
	let values = insertIds.map((id, index) => ['4', data.form.item_name, imageupload, id, 'z_grocery_item_list_t']);

	if (callback && typeof callback === "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, [values], cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	} else {
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, [values], cntxtDtls);
	}
};

exports.getgroceryitems = function (data, callback) {
	var cntxtDtls = "in getgroceryitems";

	var QRY_TO_EXEC = `SELECT a.*, (a.soh / a.mbq) AS stock_ratio FROM z_grocery_item_list_t as a WHERE a.d_in = 0`;
	var params = [];

	if (data.filters.rack) {
		QRY_TO_EXEC += ` AND a.rack_name = ?`;
		params.push(data.filters.rack);
	}

	if (data.filters.category) {
		QRY_TO_EXEC += ` AND a.category_id = ?`;
		params.push(data.filters.category);
	}

	if (!data.filters.rack && !data.filters.category) {
		QRY_TO_EXEC += ` AND a.soh < (a.mbq * 0.6)`;
	}

	QRY_TO_EXEC += ` ORDER BY stock_ratio ASC, a.soh ASC`;

	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.updategroceryitems = function (data, imageupload, callback) {
	var cntxtDtls = "in updategroceryitems";
	var QRY_TO_EXEC = `UPDATE z_grocery_item_list_t 
        SET ean_code = ?, hsn_code = ?, category_id = ?, category_name = ?, 
            sub_category_id = ?, sub_category_name = ?,sub_total_category_id = ?, sub_total_category_name = ?, item_name = ?, item_image = ?,rack_name = ?,sub_rack_name = ?,shelf_name = ?,shelf_location_name = ?, rack_code = ?, manufacturer_name = ?, mbq = ?, soh = ?, supplier_code = ?, supplier_name = ?, measurement_type = ?, mrp_price = ?, our_price = ?, selling_price = ?, discount_percentage = ?, discount_amount = ?, cgst = ?, sgst = ? WHERE id = ?;`;

	var params = [data.ean_code, data.hsn_code,
	data.category_id, data.category_name,
	data.sub_category_id,
	data.sub_category_name, data.sub_total_category_id,
	data.sub_total_category_name,
	data.item_name, imageupload,
	data.rack_name,
	data.sub_rack_name,
	data.shelf_name, data.shelf_location_name,
	data.rack_code, data.manufacturer_name,
	data.mbq,
	data.soh, data.supplier_code, data.supplier_name, data.measurement_type,
	data.mrp_price, data.our_price,
	data.selling_price,
	data.discount_percentage,
	data.discount_amount,
	data.cgst,
	data.sgst,
	data.id]

	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.updategroceryitemsinsearch = function (data, imageupload, callback) {
	var cntxtDtls = "in updategroceryitemsinsearch";
	var QRY_TO_EXEC = `Update search_type_t set search_text = ?,search_image = ? where search_id = ?;`;
	let params = [data.item_name, imageupload, data.id]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.deletegroceryitems = function (data, callback) {
	var cntxtDtls = "in deletegroceryitems";
	var MU_QRY_TO_EXEC = '';
	var QRY_TO_EXEC = '';
	var params = [];
	for (var j = 0; j < data.length; j++) {
		var QRY_TO_EXEC = `Update z_grocery_item_list_t set d_in=1 where id = ?;`
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

exports.addgrocerycategory = function (data, imageupload, callback) {
	var cntxtDtls = "in addgrocerycategory";
	var QRY_TO_EXEC = `INSERT INTO grocery_category_tbl (category_name,category_image,entry_by) VALUES (?,?,?);`;
	let params = [data.category_name, imageupload, data.entry_by]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.addgrocerycategoryintosearch = function (insertId, data, imageupload, callback) {
	var cntxtDtls = "in addgrocerycategoryintosearch";
	var QRY_TO_EXEC = `INSERT INTO search_type_t (search_key_type,search_text,search_image,search_id,search_table) VALUES (?,?,?,?,?);`;
	let params = ['1', data.category_name, imageupload, insertId, 'grocery_category_tbl']
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.getgrocerycategory = function (callback) {
	var cntxtDtls = "in getgrocerycategory";
	var QRY_TO_EXEC = `SELECT * FROM grocery_category_tbl WHERE d_in = 0 ORDER BY id DESC;`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.updategrocerycategory = function (data, imageupload, callback) {
	var cntxtDtls = "in updategrocerycategory";
	var QRY_TO_EXEC = `update grocery_category_tbl set category_name = ?,category_image = ? where id = ?;`;
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

exports.updategrocerycategoryinsearch = function (data, imageupload, callback) {
	var cntxtDtls = "in updategrocerycategoryinsearch";
	var QRY_TO_EXEC = `Update search_type_t set search_text = ?,search_image = ? where search_id = ?;`;
	let params = [data.category_name, imageupload, data.id]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.deletegrocerycategory = function (data, callback) {
	var cntxtDtls = "in deletegrocerycategory";
	var MU_QRY_TO_EXEC = '';
	var QRY_TO_EXEC = '';
	var params = [];
	for (var j = 0; j < data.length; j++) {
		var QRY_TO_EXEC = `Update grocery_category_tbl set d_in=1 where id = ?;`
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

exports.addgrocerysubcategory = function (data, imageupload, callback) {
	var cntxtDtls = "in addgrocerysubcategory";
	var QRY_TO_EXEC = `INSERT INTO grocery_subcategory_tbl (category_id,category_name,sub_category_name,sub_category_image,entry_by) VALUES (?,?,?,?,?);`;
	let params = [data.category_id, data.category_name, data.sub_category_name, imageupload, data.entry_by]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.addgrocerysubcategoryintosearch = function (insertId, data, imageupload, callback) {
	var cntxtDtls = "in addgrocerysubcategoryintosearch";
	var QRY_TO_EXEC = `INSERT INTO search_type_t (search_key_type,search_text,search_image,search_id,search_table) VALUES (?,?,?,?,?);`;
	let params = ['2', data.sub_category_name, imageupload, insertId, 'grocery_subcategory_tbl']
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.getgrocerysubcategory = function (callback) {
	var cntxtDtls = "in getgrocerysubcategory";
	var QRY_TO_EXEC = `SELECT * FROM grocery_subcategory_tbl WHERE d_in = 0 ORDER BY id DESC;`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.updategrocerysubcategory = function (data, imageupload, callback) {
	var cntxtDtls = "in updategrocerysubcategory";
	var QRY_TO_EXEC = `update grocery_subcategory_tbl set category_id = ?,category_name = ?,sub_category_name = ?,sub_category_image = ? where id = ?;`;
	var params = [data.category_id, data.category_name, data.sub_category_name, imageupload, data.id]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.updategrocerysubcategoryinsearch = function (data, imageupload, callback) {
	var cntxtDtls = "in updategrocerysubcategoryinsearch";
	var QRY_TO_EXEC = `Update search_type_t set search_text = ?,search_image = ? where search_id = ?;`;
	let params = [data.sub_category_name, imageupload, data.id]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.deletegrocerysubcategory = function (data, callback) {
	var cntxtDtls = "in deletegrocerysubcategory";
	var MU_QRY_TO_EXEC = '';
	var QRY_TO_EXEC = '';
	var params = [];
	for (var j = 0; j < data.length; j++) {
		var QRY_TO_EXEC = `Update grocery_subcategory_tbl set d_in=1 where id = ?;`
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

exports.addsubtotalcategory = function (data, imageupload, callback) {
	var cntxtDtls = "in addsubtotalcategory";
	var QRY_TO_EXEC = `INSERT INTO grocery_sub_total_category_t (sub_category_id,sub_category_name,category_id,category_name,sub_total_category_name,sub_total_category_image) VALUES (?,?,?,?,?,?);`;
	let params = [data.sub_category_id, data.sub_category_name, data.category_id, data.category_name, data.sub_total_category, imageupload]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.addsubtotalctgryintosearch = function (insertId, data, imageupload, callback) {
	var cntxtDtls = "in addsubtotalctgryintosearch";
	var QRY_TO_EXEC = `INSERT INTO search_type_t (search_key_type,search_text,search_image,search_id,search_table) VALUES (?,?,?,?,?);`;
	let params = ['5', data.sub_total_category, imageupload, insertId, 'grocery_sub_total_category_t']
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.getsubtotalcategory = function (callback) {
	var cntxtDtls = "in getsubtotalcategory";
	var QRY_TO_EXEC = `SELECT * FROM grocery_sub_total_category_t WHERE d_in = 0 ORDER BY id DESC;`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.updatesubtotalcategory = function (data, imageupload, callback) {
	var cntxtDtls = "in updatesubtotalcategory";
	var QRY_TO_EXEC = `update grocery_sub_total_category_t set category_id = ?,category_name = ?,sub_category_name = ?,sub_category_id = ?,sub_total_category_name = ?,sub_total_category_image = ? where id = ?;`;
	var params = [data.category_id, data.category_name, data.sub_category_name, data.sub_category_id, data.sub_total_category, imageupload, data.id]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.updategrocerysubtotalctgryinsearch = function (data, imageupload, callback) {
	var cntxtDtls = "in updategrocerysubtotalctgryinsearch";
	var QRY_TO_EXEC = `Update search_type_t set search_text = ?,search_image = ? where search_id = ?;`;
	let params = [data.sub_total_category, imageupload, data.id]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.deletesubtotalcategory = function (data, callback) {
	var cntxtDtls = "in deletesubtotalcategory";
	var MU_QRY_TO_EXEC = '';
	var QRY_TO_EXEC = '';
	var params = [];
	for (var j = 0; j < data.length; j++) {
		var QRY_TO_EXEC = `Update grocery_sub_total_category_t set d_in=1 where id = ?;`
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

exports.getmatchedgrocerysubcategory = function (id, callback) {
	var cntxtDtls = "in getmatchedgrocerysubcategory";
	var QRY_TO_EXEC = `SELECT * FROM grocery_subcategory_tbl WHERE category_id = ? AND d_in = 0 ORDER BY sub_category_name ASC;`;
	let params = [id]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.getmatchedgrocerysubtotalcategory = function (id, callback) {
	var cntxtDtls = "in getmatchedgrocerysubtotalcategory";
	var QRY_TO_EXEC = `SELECT * FROM grocery_sub_total_category_t WHERE sub_category_id = ? AND d_in = 0 ORDER BY sub_total_category_name ASC;`;
	let params = [id]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.uploadExcel = function (data, callback) {
	var cntxtDtls = "in uploadExcel";
	var MU_QRY_TO_EXEC = '';
	var QRY_TO_EXEC = '';
	var params = [];

	var QRY_GET_LAST_ARTICLE = `SELECT article_code AS last_article FROM z_grocery_item_list_t ORDER BY id DESC LIMIT 1;`;

	dbutil.sqlinjection(sqldb.MySQLConPool, QRY_GET_LAST_ARTICLE, [], cntxtDtls, function (err, result) {
		if (err) {
			callback(err, null);
			return;
		}

		let lastArticleNumber = result.length > 0 ? parseInt(result[0].last_article.substring(3)) || 0 : 0;

		let nextArticleNumber = lastArticleNumber === 0 ? 1 : lastArticleNumber;
		let newArticleCode = `789${String(nextArticleNumber).padStart(6, '0')}`;

		for (var j = 0; j < data.length; j++) {
			newArticleCode++;
			
			var QRY_TO_EXEC = `INSERT INTO z_grocery_item_list_t 
        (article_code, ean_code, hsn_code, item_image, item_name,category_id, category_name,sub_category_id,sub_category_name, sub_total_category_id, sub_total_category_name, manufacturer_name, mbq,soh, measurement_type, mrp_price, our_price, selling_price, discount_percentage, discount_amount, cgst, sgst, rack_name,sub_rack_name,shelf_name, shelf_location_name,rack_code, supplier_code, supplier_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`
			MU_QRY_TO_EXEC = MU_QRY_TO_EXEC + QRY_TO_EXEC;
			params.push(newArticleCode, data[j].ean_code, data[j].hsn_code, data[j].item_image, data[j].item_name, data[j].category_id || '0', data[j].category_name, data[j].sub_category_id || '0', data[j].sub_category_name, data[j].sub_total_category_id || '0', data[j].sub_total_category_name, data[j].manufacturer_name, data[j].mbq, data[j].soh, data[j].measurement_type, data[j].mrp_price, data[j].our_price, data[j].selling_price, data[j].discount_percentage, data[j].discount_amount, data[j].cgst, data[j].sgst, data[j].rack_name, data[j].sub_rack_name, data[j].shelf_name, data[j].shelf_location_name, data[j].rack_code, data[j].supplier_code, data[j].supplier_name)
		}
		if (callback && typeof callback == "function") {
			dbutil.sqlinjection(sqldb.MySQLConPool, MU_QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
				callback(err, results);
				return;
			});
		}
		else
			return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
	})
};

exports.insertexcelitemsintosearch = function (insertIds, data, callback) {
	var cntxtDtls = "in insertexcelitemsintosearch";
	var MU_QRY_TO_EXEC = "";
	var params = [];

	for (let i = 0; i < insertIds.length; i++) {
		let QRY_TO_EXEC = `INSERT INTO search_type_t (search_key_type, search_text, search_image, search_id, search_table) VALUES (?, ?, ?, ?, ?);`;

		MU_QRY_TO_EXEC += QRY_TO_EXEC;
		params.push('4', data[i].item_name || "Unknown Item", data[i].item_image || "", insertIds[i], 'z_grocery_item_list_t');
	}
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, MU_QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, MU_QRY_TO_EXEC, params, cntxtDtls);
};

exports.getitemdata = function (code, callback) {
	var cntxtDtls = "in getitemdata";
	var QRY_TO_EXEC = `SELECT id,article_code,hsn_code,cgst,sgst,item_name,measurement_type,mbq,soh,(mbq - soh) AS item_quantity,mrp_price,our_price FROM z_grocery_item_list_t WHERE article_code LIKE ? OR item_name LIKE ? ;`;
	let params = [`%${code}%`, `%${code}%`]

	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.addpurchaserequest = function (data, callback) {
	var cntxtDtls = "in addpurchaserequest";
	var createddate = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");

	// Get the current year dynamically
	const currentYear = new Date().getFullYear();

	// Query to get the last inserted purchase order number for the current year
	var QRY_GET_LAST_ORDER = `SELECT COALESCE(MAX(SUBSTRING_INDEX(purchase_order_number, '-', -1)), 0) AS last_order 
                              FROM purchase_order_t 
                              WHERE purchase_order_number LIKE ?;`;

	let orderPrefix = `FZ-PO-${currentYear}-%`;

	dbutil.sqlinjection(sqldb.MySQLConPool, QRY_GET_LAST_ORDER, [orderPrefix], cntxtDtls, function (err, result) {
		if (err) {
			callback(err, null);
			return;
		}

		// Extract the last order number and increment it
		let lastOrderNumber = parseInt(result[0].last_order) || 0;
		let nextOrderNumber = lastOrderNumber + 1;

		// Format the new order number as "PO-YYYY-XXX" (e.g., PO-2025-001)
		let formattedOrderNumber = `FZ-PO-${currentYear}-${String(nextOrderNumber).padStart(3, '0')}`;

		// Insert new purchase order with the generated order number
		var QRY_TO_EXEC = `INSERT INTO purchase_order_t (purchase_order_number, supplier_id, purchase_request_date_time, purchase_total_items, purchase_sub_total_amount, purchase_total_tax_amount, purchase_total_amount, entry_by, purchase_discount_percentage, purchase_discount_amount) 
                           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

		let params = [formattedOrderNumber, data.form.supplier_id, createddate, data.purchase_total_items, data.form.total_basic_amount, data.form.total_tax, data.form.grand_total, data.entry_by, data.form.total_discount_percentage, data.form.total_discount_amount];

		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
		});
	});
};

exports.insertordereditems = function (lastid, data, callback) {
	var cntxtDtls = "in insertordereditems";
	var host = data.tasks;
	var QRY_TO_EXEC = '';
	var MU_QRY_TO_EXEC = '';
	let params = [];
	for (let i = 0; i < host.length; i++) {
		QRY_TO_EXEC = `insert into purchase_order_item_t (purchase_order_id, supplier_id, item_id,item_name,item_quantity,measurement_type,article_code,hsn_code,mrp_price,unit_rate,item_price,cgst,sgst,cgst_amount,sgst_amount,item_tax_amount,discount_percentage,discount_amount) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`;
		MU_QRY_TO_EXEC = MU_QRY_TO_EXEC + QRY_TO_EXEC;
		params.push(lastid, host[i].supplier_id, host[i].item_id, host[i].item_name, host[i].item_quantity, host[i].measurement_type, host[i].article_code, host[i].hsn_code, host[i].mrp_price, host[i].unit_rate, host[i].item_price, host[i].cgst, host[i].sgst, host[i].cgst_amount, host[i].sgst_amount, host[i].item_tax_amount, host[i].discount_percentage, host[i].discount_amount);
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

exports.getpurchaseinward = function (callback) {
	var cntxtDtls = "in getpurchaseinward";
	var QRY_TO_EXEC = `SELECT a.*,b.supplier_name,DATE_FORMAT(a.purchase_request_date_time, '%d-%m-%Y') AS requested_date FROM purchase_order_t as a LEFT JOIN supplier_t as b ON a.supplier_id = b.id WHERE a.d_in = 0 and a.order_status = 0 ORDER BY a.id DESC;`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.getinwarditems = function (data, callback) {
	var cntxtDtls = "in getinwarditems";
	var QRY_TO_EXEC = `select * from purchase_order_item_t where purchase_order_id = ? AND d_in = 0 ;`;
	var params = [data.id]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.updateinwardmaindata = function (data, callback) {
	var cntxtDtls = "in updateinwardmaindata";
	var QRY_TO_EXEC = `update purchase_order_t set purchase_total_items = ?,purchase_sub_total_amount = ?, purchase_total_tax_amount = ?, purchase_total_amount = ?,purchase_receive_date_time = ?,invoice_number = ?,order_status = ? where id = ?;`;
	var params = [data.purchase_total_items, data.purchase_sub_total_amount,
	data.purchase_total_tax_amount, data.purchase_total_amount, data.invoice_date, data.invoice_number, "1", data.id]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.editinwarditems = function (data, callback) {
	var cntxtDtls = "in editinwarditems";
	var host = data.updated_items;
	var QRY_TO_EXEC = '';
	var MU_QRY_TO_EXEC = '';
	var SOH_QRY_TO_EXEC = '';
	let params = [];
	let sohParams = [];

	for (let i = 0; i < host.length; i++) {
		// Update purchase_order_item_t
		QRY_TO_EXEC = `UPDATE purchase_order_item_t 
                       SET item_quantity = ?, mrp_price = ?, unit_rate = ?, item_price = ?, 
                           cgst = ?, sgst = ?, cgst_amount = ?, sgst_amount = ?, item_tax_amount = ? 
                       WHERE id = ?;`;
		MU_QRY_TO_EXEC += QRY_TO_EXEC;
		params.push(host[i].item_quantity, host[i].mrp_price, host[i].unit_rate, host[i].item_price,
			host[i].cgst, host[i].sgst, host[i].cgst_amount, host[i].sgst_amount,
			host[i].item_tax_amount, host[i].id);

		// Update soh in z_grocery_item_list_t (existing soh + new quantity)
		SOH_QRY_TO_EXEC += `UPDATE z_grocery_item_list_t 
                            SET soh = soh + ? 
                            WHERE id = ?; `;
		sohParams.push(host[i].item_quantity, host[i].item_id);
	}

	// Execute both queries together
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, MU_QRY_TO_EXEC + SOH_QRY_TO_EXEC, [...params, ...sohParams], cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	} else {
		return dbutil.sqlinjection(sqldb.MySQLConPool, MU_QRY_TO_EXEC + SOH_QRY_TO_EXEC, [...params, ...sohParams], cntxtDtls);
	}
};

exports.deleteinwarditems = function (data, callback) {
	var cntxtDtls = "in deleteinwarditems";
	var host = data.deleted_items;
	var QRY_TO_EXEC = '';
	var MU_QRY_TO_EXEC = '';
	let params = [];
	for (let i = 0; i < host.length; i++) {
		var QRY_TO_EXEC = `Update purchase_order_item_t set d_in=1 where id = ?;`
		MU_QRY_TO_EXEC = MU_QRY_TO_EXEC + QRY_TO_EXEC;
		params.push(host[i].id)
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


exports.addsupplierdetails = function (data, imageupload, callback) {
	var cntxtDtls = "in addsupplierdetails";

	// Get the last ID from supplier_t
	var GET_LAST_ID = `SELECT id FROM supplier_t ORDER BY id DESC LIMIT 1;`;

	dbutil.sqlinjection(sqldb.MySQLConPool, GET_LAST_ID, [], cntxtDtls, (err, results) => {
		if (err) return callback(err, null);

		// If no records exist, start with ID 1, else increment the last ID
		let lastId = results.length > 0 && results[0].id ? results[0].id : 0;
		let newId = lastId + 1;  // Next ID
		let newSupplierCode = `FZ-SUP-${String(newId).padStart(3, "0")}`;

		// Insert new supplier details along with generated supplier code
		var QRY_TO_EXEC = `INSERT INTO supplier_t (supplier_code, supplier_name, supplier_company_name, type_of_supply, supplier_address, supplier_phone_number, supplier_email, supplier_gst_number, supplier_trading_licence, supplier_bank_details, supplier_bank_details_image, entry_by)VALUES (?,?,?,?,?,?,?,?,?,?,?,?);`;

		let params = [newSupplierCode, data.supplier_name, data.supplier_company_name, data.type_of_supply, data.supplier_address, data.supplier_phone_number, data.supplier_email, data.supplier_gst_number, data.supplier_trading_licence, data.supplier_bank_details, imageupload, data.entry_by];

		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, callback);
	});
};

exports.getsupplierdetails = function (callback) {
	var cntxtDtls = "in getsupplierdetails";
	var QRY_TO_EXEC = `SELECT * FROM supplier_t WHERE d_in = 0 ORDER BY id DESC;`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.updatesupplierdetails = function (data, imageupload, callback) {
	var cntxtDtls = "in updatesupplierdetails";
	var QRY_TO_EXEC = `update supplier_t set supplier_name = ?,supplier_company_name = ?, type_of_supply = ?, supplier_address = ?,supplier_phone_number = ?, supplier_email = ?, supplier_gst_number = ?,  supplier_trading_licence = ?,  supplier_bank_details = ?, supplier_bank_details_image = ? where id = ?;`;
	var params = [data.supplier_name, data.supplier_company_name,
	data.type_of_supply, data.supplier_address, data.supplier_phone_number, data.supplier_email,
	data.supplier_gst_number, data.supplier_trading_licence, data.supplier_bank_details, imageupload, data.id]
	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

exports.deletesupplierdetails = function (data, callback) {
	var cntxtDtls = "in deletesupplierdetails";
	var MU_QRY_TO_EXEC = '';
	var QRY_TO_EXEC = '';
	var params = [];
	for (var j = 0; j < data.length; j++) {
		var QRY_TO_EXEC = `Update supplier_t set d_in=1 where id = ?;`
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

exports.getpurchaseinvoice = function (data, callback) {
	var cntxtDtls = "in getpurchaseinvoice";
	var QRY_TO_EXEC = `SELECT a.*,b.supplier_name,DATE_FORMAT(a.purchase_request_date_time, '%d-%m-%Y') AS requested_date,DATE_FORMAT(a.purchase_receive_date_time, '%d-%m-%Y') AS received_date,DATE_FORMAT(a.purchase_payment_date, '%d-%m-%Y') AS payment_date FROM purchase_order_t as a LEFT JOIN supplier_t as b ON a.supplier_id = b.id WHERE a.order_status = 1`;

	var params = [];

	// Check if 'fromdate' and 'todate' are provided
	if (data.filters.fromdate && data.filters.todate) {
		QRY_TO_EXEC += ` AND DATE(a.i_ts) BETWEEN ? AND ?`;
		params.push(data.filters.fromdate, data.filters.todate);
	}

	// Check if 'supplier' is provided
	if (data.filters.supplier) {
		QRY_TO_EXEC += ` AND a.supplier_id = ?`;
		params.push(data.filters.supplier);
	}

	if (params.length === 0) {
		return callback(null, []);
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

exports.updatepaymentstatus = function (data, callback) {
	var cntxtDtls = "in updatepaymentstatus";
	var QRY_TO_EXEC = `Update purchase_order_t set purchase_payment_status = ?,purchase_payment_date = ?,purchase_payment_mode = ?,purchase_payment_narration = ?,purchase_payment_proof = ? where id = ?;`;
	var params = [data.purchase_payment_status, data.purchase_payment_date, data.purchase_payment_mode, data.purchase_payment_narration, data.purchase_payment_proof, data.id];

	if (callback && typeof callback == "function") {
		dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.sqlinjection(sqldb.MySQLConPool, QRY_TO_EXEC, params, cntxtDtls);
};

// ************* Supplier and groceries End **********//


