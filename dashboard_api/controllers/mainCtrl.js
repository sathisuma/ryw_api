var moment = require('moment');
var express = require('express');
router = express.Router();
var http = require("https");
var fs = require('fs');
process.env.SECRET_KEY = "thisismysecretkey";
var appmdl = require('../models/mainModel')

var noticationsfile = require('../../notification/notification')

var request = require('request'); //for otp
var unirest = require('unirest'); //for whtsapp

// SDK initialization
var ImageKit = require("imagekit");
const fetch = require('node-fetch');
const sharp = require('sharp');

var imagekit = new ImageKit({
    publicKey: "public_pkZOmkdOudLBk26n1df+mIOEp8Y=", // ✅ Safe for frontend
    privateKey: "private_tSgQ97HQM0wvSQnsO+nzCMwVyIA=", // ✅ Required for server-side only
    urlEndpoint: "https://ik.imagekit.io/qav8ubo2v" // ✅ Customize to your folder structure if needed
});

function uploadShopImageFromURLAndUpdateDB(imageUrl, insertedShopId, folderPath, fileName, updateFn, res) {
    // const fileName = `${insertedShopId}_${Date.now()}.jpg`;
    fetch(imageUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch image: ${response.statusText}`);
            }
            return response.buffer(); // Get raw image buffer
        })
        .then(imageBuffer => {
            return sharp(imageBuffer).jpeg({ quality: 70 }).toBuffer(); // Return buffer for upload
        })
        .then(compressedBuffer => {
            // 3. Upload to ImageKit using direct buffer
            imagekit.upload({
                file: compressedBuffer,   // No base64, direct binary upload
                fileName: fileName,
                folder: folderPath
            }, function (err, result) {
                if (err) {
                    console.error("❌ ImageKit upload failed:", err);
                    res.send({ status: 500, message: "ImageKit upload failed" });
                } else {
                    const imagekitUrl = result.url;
                    updateFn(imagekitUrl, insertedShopId, function (err, dbResult) {
                        if (err) {
                            res.send({ status: 500, data: dbResult });
                        } else {
                            res.send({ status: 200, data: dbResult });
                        }
                    });
                }
            });
        })
        .catch(error => {
            console.error("❌ Error in image fetch/compress/upload:", error.message);
            res.send({ status: 500, message: error.message });
        });
}

// ************** Login Start ***************

exports.getUserDataCtrl = function (req, res) {
    var phone = req.body.number;
    var usr_pwd = req.body.password;
    appmdl.checkUserExistMdl(phone, usr_pwd, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": "Server Error" });
            return;
        }
        if (results && results.length > 0) {
            appmdl.getUserDataMdl(results[0].id, function (err, usrMenu) {
                if (err) {
                    res.send({ "status": 500, "msg": err });
                    return;
                }
                usrMenu[1].map(res => {
                    res.children = [];
                })
                usrMenu[0].map(res => {
                    var subdata = usrMenu[1].filter(obj => {
                        obj.active = false;
                        return obj.module_id == res.id;
                    })
                    if (subdata.length) {
                        res.children = subdata;
                    } else {
                        res.children = [];
                    }
                })
                //
                res.send({ 'status': 200, 'data': usrMenu[0], 'usr_data': results });
            });
        } else {
            res.send({ "status": 202, "message": 'invalid UserName or Password' });
        }
    });
}

exports.getupdatemodulesctrl = function (req, res) {
    //console.log(req.body);

    appmdl.getupdatemodulesmdl(req.body, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.submitusersloginctrl = function (req, res) {
    appmdl.checkNumbermdl(req.body, function (err, results) {
        if (results.length > 0) {
            res.send({ 'status': 300 })
        }
        else {
            appmdl.submitusersloginmdl(req.body, function (err, results) {
                if (results) {
                    appmdl.submitpermissions(results.insertId, req.body, function (err, results) {
                        if (results) {
                            res.send({ 'status': 200 });
                        } else {
                            res.send({ 'status': 500 })
                        }
                    });
                } else {
                    res.send({ 'status': 500 });
                }
            });
        }
    })
}

exports.getuserlistctrl = function (req, res) {
    appmdl.getuserlistmdl(function (err, results) {
        if (err) {
            res.send(500, "Server Error");
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.postusermenulistCtrl = function (req, res) {
    var modulesData = req.body.modules;
    var employeeDetails = req.body.employeeDetails;
    var module_id = modulesData[0].module_id;
    var user_id = modulesData[0].user_id;

    var formattedModulesData = modulesData.map(obj => {
        return [obj.user_id, obj.module_id, obj.id];
    });

    var formattedEmployeeDetails = [
        employeeDetails.name,
        employeeDetails.number,
        employeeDetails.email,
        employeeDetails.pwd,
    ];
    appmdl.postusermenulistMdl(formattedModulesData, module_id, user_id, formattedEmployeeDetails, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}


exports.deleteuserctrl = function (req, res) {
    appmdl.deleteusermdl(req.body, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}


// *************************************************** Login End ****************************************************************************


// ***************************************************App Users Start****************************************************************************


exports.getusersprofilectrl = function (req, res) {
    appmdl.getusersprofilemdl(req.body, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.updateuserpassword = function (req, res) {
    var data = req.body;
    appmdl.updateuserpassword(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.updateimagectrl = function (req, res) {
    var data = req.body
    if (data.profile == undefined) {
        imageupload = data.profile
    }
    else {
        var reviewImgArr = data.profile;
        var image_url = reviewImgArr[0].reviewimg;
        var array = image_url.split(',');
        var base64Data = array[1];
        var datetimestamp = Date.now();
        var random_number = Math.floor(100000 + Math.random() * 900000);
        var unicnumber = random_number + '' + datetimestamp;
        var filetype = reviewImgArr[0].filetype;

        fs.writeFile("../public_html/control.freshozapcart.com/uploaded_images/all/" + unicnumber + "." + filetype, base64Data, 'base64', function (err) {
        });
        imageupload = "https://control.freshozapcart.com/uploaded_images/all/" + unicnumber + '.' + filetype;
    }

    appmdl.updateimagemdl(req.body, imageupload, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

// ***************************************************App Users End ****************************************************************************


exports.addlocation = function (req, res) {
    var data = req.body;
    appmdl.addlocation(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.getlocation = function (req, res) {
    appmdl.getlocation(function (err, results) {
        if (err) {
            res.send(500, "Server Error");
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.updatelocation = function (req, res) {
    var data = req.body
    appmdl.updatelocation(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.deletelocation = function (req, res) {
    appmdl.deletelocation(req.body, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.addbanner = function (req, res) {
    var data = req.body;
    var reviewImgArr = data.imagesData
    //console.log(data, "ctrlfdhgfhjjg");
    if (reviewImgArr.length != 0) {
        var image_url = reviewImgArr[0].reviewimg;
        var array = image_url.split(',');
        var base64Data = array[1];
        var datetimestamp = Date.now();
        var random_number = Math.floor(100000 + Math.random() * 900000);
        var unicnumber = random_number + '' + datetimestamp;
        var filetype = reviewImgArr[0].filetype;
        fs.writeFile("../public_html/control.freshozapcart.com/freshozapcart_images/" + unicnumber + "." + filetype, base64Data, 'base64', function (err) { });
        imageupload = "https://control.freshozapcart.com/freshozapcart_images/" + unicnumber + '.' + filetype;
    }
    else {
        var imageupload = ' '
    }
    appmdl.addbanner(req.body, imageupload, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.getbanner = function (req, res) {
    appmdl.getbanner(req.body, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.updatebanner = function (req, res) {
    var data = req.body
    if (data.imagesData == undefined) {
        imageupload = data.banner_image
    }
    else {
        var reviewImgArr = data.imagesData;
        var image_url = reviewImgArr[0].reviewimg;
        var array = image_url.split(',');
        var base64Data = array[1];
        var datetimestamp = Date.now();
        var random_number = Math.floor(100000 + Math.random() * 900000);
        var unicnumber = random_number + '' + datetimestamp;
        var filetype = reviewImgArr[0].filetype;

        fs.writeFile("../public_html/control.freshozapcart.com/freshozapcart_images/" + unicnumber + "." + filetype, base64Data, 'base64', function (err) {
        });
        imageupload = "https://control.freshozapcart.com/freshozapcart_images/" + unicnumber + '.' + filetype;
    }
    appmdl.updatebanner(req.body, imageupload, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.deletebanner = function (req, res) {
    appmdl.deletebanner(req.body, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.addnotifications = function (req, res) {
    appmdl.addnotifications(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.getnotifications = function (req, res) {
    appmdl.getnotifications(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.updatenotifications = function (req, res) {
    appmdl.updatenotifications(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.deletenotifications = function (req, res) {
    appmdl.deletenotifications(req.body, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.addcoupon = function (req, res) {
    appmdl.addcoupon(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.getcoupon = function (req, res) {
    appmdl.getcoupon(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.updatecoupon = function (req, res) {
    appmdl.updatecoupon(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.deletecoupon = function (req, res) {
    appmdl.deletecoupon(req.body, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.addsize = function (req, res) {
    appmdl.addsize(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.getsize = function (req, res) {
    appmdl.getsize(function (err, results) {
        if (err) {
            res.send(500, "Server Error");
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.updatesize = function (req, res) {
    appmdl.updatesize(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.deletesize = function (req, res) {
    appmdl.deletesize(req.body, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.addcategory = function (req, res) {
    var data = req.body;
    var reviewImgArr = data.imagesData
    //console.log(data, "ctrlfdhgfhjjg");
    if (reviewImgArr.length != 0) {
        var image_url = reviewImgArr[0].reviewimg;
        var array = image_url.split(',');
        var base64Data = array[1];
        var datetimestamp = Date.now();
        var random_number = Math.floor(100000 + Math.random() * 900000);
        var unicnumber = random_number + '' + datetimestamp;
        var filetype = reviewImgArr[0].filetype;
        fs.writeFile("../public_html/control.freshozapcart.com/freshozapcart_images/" + unicnumber + "." + filetype, base64Data, 'base64', function (err) { });
        imageupload = "https://control.freshozapcart.com/freshozapcart_images/" + unicnumber + '.' + filetype;
    }
    else {
        var imageupload = ' '
    }
    appmdl.addcategory(req.body, imageupload, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.getcategory = function (req, res) {
    appmdl.getcategory(function (err, results) {
        if (err) {
            res.send(500, "Server Error");
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.updatecategory = function (req, res) {
    var data = req.body
    if (data.imagesData == undefined) {
        imageupload = data.category_image
    }
    else {
        var reviewImgArr = data.imagesData;
        var image_url = reviewImgArr[0].reviewimg;
        var array = image_url.split(',');
        var base64Data = array[1];
        var datetimestamp = Date.now();
        var random_number = Math.floor(100000 + Math.random() * 900000);
        var unicnumber = random_number + '' + datetimestamp;
        var filetype = reviewImgArr[0].filetype;

        fs.writeFile("../public_html/control.freshozapcart.com/freshozapcart_images/" + unicnumber + "." + filetype, base64Data, 'base64', function (err) {
        });
        imageupload = "https://control.freshozapcart.com/freshozapcart_images/" + unicnumber + '.' + filetype;
    }
    appmdl.updatecategory(req.body, imageupload, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.deletecategory = function (req, res) {
    appmdl.deletecategory(req.body, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.updatecategoryactivestatus = function (req, res) {
    appmdl.updatecategoryactivestatus(req.body, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

// exports.addproduct = function (req, res) {
//     var data = req.body;
//     var reviewImgArr = data.imagesData
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
//     appmdl.addproduct(req.body, imageupload, function (err, results) {
//         if (err) {
//             res.send({ "status": 500, "msg": err });
//             return;
//         }
//         res.send({ 'status': 200, 'data': results });
//     });
// }

exports.addproduct = function (req, res) {
    const data = req.body;
    const { product_name, product_description, category_id, variants } = data;

    appmdl.insertProduct({ product_name, product_description, category_id }, function (err, productResult) {
        if (err) {
            res.send({ status: 500, msg: "Error inserting product" });
            return;
        }

        const product_id = productResult.insertId;
        let variantIndex = 0;

        function processNextVariant() {
            if (variantIndex >= variants.length) {
                res.send({ status: 200, msg: "Product added successfully!" });
                return;
            }

            const variant = variants[variantIndex++];
            const { color_name, color_code, images, sizes } = variant;

            const variantData = { product_id, color_name, color_code };
            appmdl.insertVariant(variantData, function (err, variantResult) {
                if (err) {
                    console.log("Variant error:", err);
                    processNextVariant();
                    return;
                }

                const variant_id = variantResult.insertId;
                let imageIndex = 0;

                function processNextImage() {
                    if (imageIndex >= images.length) {
                        processNextSize(); // After images, go to sizes
                        return;
                    }

                    const imgBase64 = images[imageIndex++];
                    const array = imgBase64.split(',');
                    const base64Data = array[1];
                    const datetimestamp = Date.now();
                    const random_number = Math.floor(100000 + Math.random() * 900000);
                    const unicnumber = random_number + '' + datetimestamp;
                    const filetype = 'png';
                    const filepath = `../rywapi/images/${unicnumber}.${filetype}`;
                    const image_url = `https://localhost:2410/rywapi/images/${unicnumber}.${filetype}`;

                    fs.writeFile(filepath, base64Data, 'base64', function (imgErr) {
                        if (imgErr) {
                            console.log("Image error:", imgErr);
                            processNextImage(); // Continue anyway
                            return;
                        }
                        // const variantIdData = { product_id, variant_id };
                        appmdl.insertVariantImage({ product_id, variant_id }, image_url , function () {
                            processNextImage(); // Process next image
                        });
                    });
                }

                let sizeIndex = 0;
                function processNextSize() {
                    if (sizeIndex >= sizes.length) {
                        processNextVariant(); // After sizes, process next variant
                        return;
                    }

                    const sizeObj = sizes[sizeIndex++];
                    const { size, price } = sizeObj;

                    appmdl.insertVariantSize({ product_id, variant_id, size, price }, function () {
                        processNextSize(); // Next size
                    });
                }

                processNextImage(); // Start processing images
            });
        }

        processNextVariant(); // Start processing variants
    });
};


exports.getproduct = function (req, res) {
    appmdl.getproduct(function (err, results) {
        if (err) {
            res.send(500, "Server Error");
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.updateproduct = function (req, res) {
    var data = req.body
    if (data.imagesData == undefined) {
        imageupload = data.product_image
    }
    else {
        var reviewImgArr = data.imagesData;
        var image_url = reviewImgArr[0].reviewimg;
        var array = image_url.split(',');
        var base64Data = array[1];
        var datetimestamp = Date.now();
        var random_number = Math.floor(100000 + Math.random() * 900000);
        var unicnumber = random_number + '' + datetimestamp;
        var filetype = reviewImgArr[0].filetype;

        fs.writeFile("../public_html/control.freshozapcart.com/freshozapcart_images/" + unicnumber + "." + filetype, base64Data, 'base64', function (err) {
        });
        imageupload = "https://control.freshozapcart.com/freshozapcart_images/" + unicnumber + '.' + filetype;
    }
    appmdl.updateproduct(req.body, imageupload, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.deleteproduct = function (req, res) {
    appmdl.deleteproduct(req.body, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}














