var moment = require('moment');
var express = require('express');
router = express.Router();
var http = require("https");
var fs = require('fs');
process.env.SECRET_KEY = "thisismysecretkey";
var appmdl = require('../models/mainModel')

var noticationsfile = require('../notification/notification')

var request = require('request'); //for otp
var unirest = require('unirest'); //for whtsapp 

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

//******************Website Contact Data******************//

exports.websitecontact = function (req, res) {
    appmdl.websitecontact(req.body, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

//******************Website Contact Data******************//



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
    appmdl.updateuserpassword(req.body, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
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

        fs.writeFile("../public_html/control.freshozapcart.com/freshozapcart_images/" + unicnumber + "." + filetype, base64Data, 'base64', function (err) {
        });
        imageupload = "https://control.freshozapcart.com/freshozapcart_images/" + unicnumber + '.' + filetype;
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

// *************************************************** Mainmodules Start ****************************************************************************

exports.shop_registration = function (req, res) {
    var data = req.body;
    var reviewImgArr = data.imagesData
    var imageUploadbank = '';
    var imageUploadagreement = '';
    var imageUploadshop = '';
    var imageUploadk1 = '';
    var imageUploadk2 = '';
    var imageUploadk3 = '';
    var imageUrl = '';
    if (reviewImgArr.length != 0) {
        let type3Images = [];

        reviewImgArr.forEach((img, index) => {

            var image_url = img.reviewimg;
            var array = image_url.split(',');

            var base64Data = array[1];
            var datetimestamp = Date.now();
            var random_number = Math.floor(100000 + Math.random() * 900000);
            var unicnumber = random_number + '' + datetimestamp;
            var filetype = img.filetype;

            var filePath = `../public_html/control.freshozapcart.com/freshozapcart_images/${unicnumber}.${filetype}`;
            imageUrl = `https://control.freshozapcart.com/freshozapcart_images/${unicnumber}.${filetype}`;

            fs.writeFile(filePath, base64Data, 'base64', function (err) {
                if (err) {
                    //console.error(`Error saving image${index + 1}:`, err);
                }
            });

            if (img.type === 1) {
                imageUploadbank = imageUrl;
            } else if (img.type === 2) {
                imageUploadagreement = imageUrl;
            } else if (img.type === 4) {
                imageUploadshop = imageUrl;
            } else if (img.type === 3) {
                type3Images.push(imageUrl);
            }
        });

        imageUploadk1 = type3Images[0] || '';
        imageUploadk2 = type3Images[1] || '';
        imageUploadk3 = type3Images[2] || '';
    }

    if (!imageUploadagreement && data.shop_agreement_copy) {
        imageUploadagreement = data.shop_agreement_copy;
    }
    appmdl.shop_registration(req.body, imageUploadbank, imageUploadagreement, imageUploadk1, imageUploadk2, imageUploadk3, imageUploadshop, function (err, results) {
        if (results) {
            appmdl.insertshopsubcategory(results.insertId, req.body, function (err, resultsa) {
                if (resultsa) {
                    appmdl.insertshopfilter(results.insertId, req.body, function (err, resultb) {
                        if (resultb) {
                            appmdl.insertshopintosearchkey(results.insertId, req.body, imageUploadshop, function (err, resultc) {
                                if (resultc) {
                                    appmdl.addshopdatainuserstbl(results.insertId, req.body, function (err, resultd) {
                                        if (resultd) {
                                            appmdl.addshoppermissions(resultd.insertId, req.body, function (err, resultse) {
                                                if (resultse && data.shop_unique_id == '' || data.shop_type == '1') {
                                                    appmdl.updateshopid(results.insertId, function (err, resultsf) {
                                                        if (resultsf) {
                                                            res.send({ 'status': 200, 'data': results });
                                                            appmdl.sendregistrationsuccessemail(req.body, function (err, results) {
                                                                if (err) {
                                                                    res.send({ 'status': 500, 'data': results });
                                                                    return;
                                                                } 
                                                            }); 
                                                        }else{
                                                            res.send({ 'status': 500, 'data': results }); 
                                                        }
                                                    });
                                                } else {
                                                    if (resultse) {
                                                        res.send({ 'status': 200, 'data': results });
                                                        appmdl.sendregistrationsuccessemail(req.body, function (err, results) {
                                                            if (err) {
                                                                res.send({ 'status': 500, 'data': results });
                                                                return;
                                                            }

                                                        }); 
                                                    }else{
                                                        res.send({ 'status': 500, 'data': results }); 
                                                    }
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
        } else {
            res.send({ 'status': 500 });
        }
    });
}

exports.sendregistrationsuccessemail = function (req, res) {
    appmdl.sendregistrationsuccessemail(req.body, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.getshopreg = function (req, res) {
    appmdl.getshopreg(req.body, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.getgroupbyshop = function (req, res) {
    appmdl.getgroupbyshop(function (err, results) {
        if (err) {
            res.send(500, "Server Error");
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.updateshopreg = function (req, res) {
    var data = req.body;
    var reviewImgArr = data.imagesData || []
    var imageUploadbank = '';
    var imageUploadagreement = '';
    var imageUploadshop = '';
    var imageUploadk1 = '';
    var imageUploadk2 = '';
    var imageUploadk3 = '';
    var imageUrl = '';
    let type3Images = [];

    if (reviewImgArr.length > 0) {

        reviewImgArr.forEach((img, index) => {

            var image_url = img.reviewimg;
            var array = image_url.split(',');

            var base64Data = array[1];
            var datetimestamp = Date.now();
            var random_number = Math.floor(100000 + Math.random() * 900000);
            var unicnumber = random_number + '' + datetimestamp;
            var filetype = img.filetype;

            var filePath = `../public_html/control.freshozapcart.com/freshozapcart_images/${unicnumber}.${filetype}`;
            imageUrl = `https://control.freshozapcart.com/freshozapcart_images/${unicnumber}.${filetype}`;

            fs.writeFile(filePath, base64Data, 'base64', function (err) {
                if (err) {
                    //console.error(`Error saving image${index + 1}:`, err);
                }
            });

            if (img.type === 1) {
                imageUploadbank = imageUrl;
            } else if (img.type === 2) {
                imageUploadagreement = imageUrl;
            } else if (img.type === 4) {
                imageUploadshop = imageUrl;
            } else if (img.type === 3) {
                type3Images.push(imageUrl);
                //console.log(123, type3Images.length);
            }
        });

        imageUploadk1 = type3Images[0] || '';
        imageUploadk2 = type3Images[1] || '';
        imageUploadk3 = type3Images[2] || '';
    }

    imageUploadagreement = imageUploadagreement || data.shop_agreement_copy || '';
    imageUploadbank = imageUploadbank || data.shop_bank_details || '';
    imageUploadshop = imageUploadshop || data.shop_image || '';


    if (type3Images.length == 0) {
        imageUploadk1 = data.shop_interiors_image1 || '';
        imageUploadk2 = data.shop_interiors_image2 || '';
        imageUploadk3 = data.shop_interiors_image3 || '';
    }

    appmdl.updateshopreg(req.body, imageUploadbank, imageUploadagreement, imageUploadshop, imageUploadk1, imageUploadk2, imageUploadk3, function (err, results) {
        if (results) {
            appmdl.updateshopsubcategory(req.body, function (err, resultsa) {
                if (resultsa) {
                    appmdl.updateshopfilter(req.body, function (err, resultb) {
                        if (resultb) {
                            appmdl.updateshopintosearchkey(req.body,imageUploadshop, function (err, resultc) {
                                if (err) {
                                    res.send({ "status": 500, "msg": err });
                                    return;
                                }
                                res.send({ 'status': 200, 'data': results });
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

exports.deleteshopreg = function (req, res) {
    appmdl.deleteshopreg(req.body, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.updateshopactivestatus = function (req, res) {
    appmdl.updateshopactivestatus(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.updateditemactivestatus = function (req, res) {
    appmdl.updateditemactivestatus(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}


// *************** Mainmodules End *************

// *************** Masters Start **************

exports.addlocation = function (req, res) {
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
    appmdl.addlocation(req.body, imageupload, function (err, results) {
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
    if (data.imagesData == undefined) {
        imageupload = data.location_image
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
    appmdl.updatelocation(req.body, imageupload, function (err, results) {
        if (results) {
            appmdl.updatelocationnameintables(req.body, function (err, resultb) {
                if (err) {
                    res.send({ "status": 500, "msg": err });
                    return;
                }
                res.send({ 'status': 200, 'data': results });
            });
        } else {
            res.send({ 'status': 500 });
        }
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
        if (results) {
            appmdl.addcategoryintosearch(results.insertId, req.body, imageupload, function (err, resulta) {
                if (err) {
                    res.send({ "status": 500, "msg": err });
                    return;
                }
                res.send({ 'status': 200, 'data': results });
            });
        } else {
            res.send({ 'status': 500 });
        }
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
        if (results) {
            appmdl.updatecategoryinsearch(req.body, imageupload, function (err, resulta) {
                if (err) {
                    res.send({ "status": 500, "msg": err });
                    return;
                }
                res.send({ 'status': 200, 'data': results });
            });
        } else {
            res.send({ 'status': 500 });
        }
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

exports.addsubcategory = function (req, res) {
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
    appmdl.addsubcategory(req.body, imageupload, function (err, results) {
        if (results) {
            appmdl.addsubcategoryintosearch(results.insertId, req.body, imageupload, function (err, resulta) {
                if (err) {
                    res.send({ "status": 500, "msg": err });
                    return;
                }
                res.send({ 'status': 200, 'data': results });
            });
        } else {
            res.send({ 'status': 500 });
        }
    });
}

exports.getsubcategory = function (req, res) {
    appmdl.getsubcategory(function (err, results) {
        if (err) {
            res.send(500, "Server Error");
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.updatesubcategory = function (req, res) {
    var data = req.body
    if (data.imagesData == undefined) {
        imageupload = data.sub_category_image
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
    appmdl.updatesubcategory(req.body, imageupload, function (err, results) {
        if (results) {
            appmdl.updatesubcategoryinsearch(req.body, imageupload, function (err, resulta) {
                if (err) {
                    res.send({ "status": 500, "msg": err });
                    return;
                }
                res.send({ 'status': 200, 'data': results });
            });
        } else {
            res.send({ 'status': 500 });
        }
    });
}

exports.deletesubcategory = function (req, res) {
    appmdl.deletesubcategory(req.body, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.getmatchedcategory = function (req, res) {
    var id = req.params.id
    appmdl.getmatchedcategory(id, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.addmainfilter = function (req, res) {
    appmdl.addmainfilter(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.getmainfilter = function (req, res) {
    appmdl.getmainfilter(function (err, results) {
        if (err) {
            res.send(500, "Server Error");
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.updatemainfilter = function (req, res) {
    appmdl.updatemainfilter(req.body, function (err, results) {
        if (results) {
            appmdl.updatefiltersintables(req.body, function (err, resulta) {
                if (err) {
                    res.send({ "status": 500, "msg": err });
                    return;
                }
                res.send({ 'status': 200, 'data': results });
            });
        } else {
            res.send({ 'status': 500 });
        }
    });
}

exports.deletemainfilter = function (req, res) {
    appmdl.deletemainfilter(req.body, function (err, results) {
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
    appmdl.getnotifications(req.body,function (err, results) {
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
    appmdl.getcoupon(req.body,function (err, results) {
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

exports.adddeliveryboy = function (req, res) {
    appmdl.adddeliveryboy(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.getdeliveryboy = function (req, res) {
    appmdl.getdeliveryboy(function (err, results) {
        if (err) {
            res.send(500, "Server Error");
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.updatedeliveryboy = function (req, res) {
    appmdl.updatedeliveryboy(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.deletedeliveryboy = function (req, res) {
    appmdl.deletedeliveryboy(req.body, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.updatedeliveryboyactivestatus = function (req, res) {
    appmdl.updatedeliveryboyactivestatus(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.addfranchise = function (req, res) {
    appmdl.addfranchise(req.body, function (err, results) {
        if (results) {
            appmdl.updatefranchiseidintolocation(results.insertId, req.body, function (err, resulta) {
                if (resulta) {
                    appmdl.addfranchisedatainuserstbl(results.insertId, req.body, function (err, resultd) {
                        if (resultd) {
                            appmdl.addfranchisepermissions(resultd.insertId, req.body, function (err, resultsc) {
                                if (err) {
                                    res.send(500, "Server Error");
                                    return;
                                }
                                res.send({ 'status': 200, 'data': results });
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

exports.getfranchise = function (req, res) {
    appmdl.getfranchise(function (err, results) {
        if (err) {
            res.send(500, "Server Error");
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.updatefranchise = function (req, res) {
    appmdl.updatefranchise(req.body, function (err, results) {
        if (results) {
            appmdl.editfranchiseidinlocation(req.body, function (err, resulta) {
                if (err) {
                    res.send({ "status": 500, "msg": err });
                    return;
                }
                res.send({ 'status': 200, 'data': results });
            });
        } else {
            res.send({ 'status': 500 });
        }
    });
}

exports.deletefranchise = function (req, res) {
    appmdl.deletefranchise(req.body, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

// *************** Masters End **************

// *************** customer Start **************


exports.getcustomerlist = function (req, res) {
    appmdl.getcustomerlist(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.getuserwalletlist = function (req, res) {
    appmdl.getuserwalletlist(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.getsubscriptionlist = function (req, res) {
    appmdl.getsubscriptionlist(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.getwalletpayments = function (req, res) {
    appmdl.getwalletpayments(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.getsubscriptiondetails = function (req, res) {
    appmdl.getsubscriptiondetails(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.getsubscriptionstogenerate = function (req, res) {
    appmdl.getsubscriptionstogenerate(req.body,function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.getsubscriptionstoreports = function (req, res) {
    appmdl.getsubscriptionstoreports(req.body,function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.submitsubscriptionorders = function (req, res) {
    appmdl.submitsubscriptionorders(req.body,function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.updatesinglesubscription = function (req, res) {
    appmdl.updatesinglesubscription(req.body,function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.getdeliveryboyslist = function (req, res) {
    appmdl.getdeliveryboyslist(function (err, results) {
        if (err) {
            res.send(500, "Server Error");
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.getorderslist = function (req, res) {
    appmdl.getorderslist(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.updateorderstatus = function (req, res) {
    appmdl.updateorderstatus(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.getorderdetails = function (req, res) {
    appmdl.getorderdetails(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.getcustomerorderdetails = function (req, res) {
    appmdl.getcustomerorderdetails(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.getshopsforpayments = function (req, res) {
    appmdl.getshopsforpayments(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.submitpaymentdetails = function (req, res) {
    appmdl.submitpaymentdetails(req.body, function (err, results) {
        if (results) {
            appmdl.updatevendorpaymentstatus(req.body, function (err, resulta) {
                if (resulta) {
                    appmdl.updatepaymentotp(req.body, function (err, resultb) {
                        if (err) {
                            res.send({ "status": 500, "msg": err });
                            return;
                        }
                        res.send({ 'status': 200, 'data': results });
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

exports.getpaymenthistory = function (req, res) {
    appmdl.getpaymenthistory(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

// *************** customer End **************

// *************** Supplier and Grocery Start **************

exports.addslottiming = function (req, res) {
    appmdl.addslottiming(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.getslottiming = function (req, res) {
    appmdl.getslottiming(function (err, results) {
        if (err) {
            res.send(500, "Server Error");
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.updateslottiming = function (req, res) {
    appmdl.updateslottiming(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.deleteslottiming = function (req, res) {
    appmdl.deleteslottiming(req.body, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}


exports.addrack = function (req, res) {
    appmdl.addrack(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.getrack = function (req, res) {
    appmdl.getrack(function (err, results) {
        if (err) {
            res.send(500, "Server Error");
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.updaterack = function (req, res) {
    appmdl.updaterack(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.deleterack = function (req, res) {
    appmdl.deleterack(req.body, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.addsubrack = function (req, res) {
    appmdl.addsubrack(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.getsubrack = function (req, res) {
    appmdl.getsubrack(function (err, results) {
        if (err) {
            res.send(500, "Server Error");
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.updatesubrack = function (req, res) {
    appmdl.updatesubrack(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.deletesubrack = function (req, res) {
    appmdl.deletesubrack(req.body, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.addshelf = function (req, res) {
    appmdl.addshelf(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.getshelf = function (req, res) {
    appmdl.getshelf(function (err, results) {
        if (err) {
            res.send(500, "Server Error");
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.updateshelf = function (req, res) {
    appmdl.updateshelf(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.deleteshelf = function (req, res) {
    appmdl.deleteshelf(req.body, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.addshelflocation = function (req, res) {
    appmdl.addshelflocation(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.getshelflocation = function (req, res) {
    appmdl.getshelflocation(function (err, results) {
        if (err) {
            res.send(500, "Server Error");
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.updateshelflocation = function (req, res) {
    appmdl.updateshelflocation(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.deleteshelflocation = function (req, res) {
    appmdl.deleteshelflocation(req.body, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.submitmeasurement = function (req, res) {
    appmdl.submitmeasurement(req.body, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.getmeasurements = function (req, res) {
    appmdl.getmeasurements(function (err, results) {
        if (err) {
            res.send(500, "Server Error");
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.addgroceryitems = function (req, res) {
    var data = req.body;

    var reviewImgArr = data.form.imagesData;
    var imageupload = ' ';

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

    let insertIds = [];
    let totalItems = data.grouplistArr.length;
    let processedItems = 0;

    for (let y = 0; y < totalItems; y++) {
        const innerobjectdata = data.grouplistArr[y];

        appmdl.addgroceryitems(data.form, innerobjectdata, imageupload, data.entry_by, function (err, results) {
            if (err) {
                res.send({ "status": 500, "msg": err });
                return;
            }

            if (results && results.insertId) {
                insertIds.push(results.insertId);
            }

            processedItems++;

            if (processedItems === totalItems) {
                appmdl.addgroceryitemintosearch(insertIds, req.body, imageupload, function (err, resulta) {
                    if (err) {
                        res.send({ "status": 500, "msg": err });
                        return;
                    }
                    res.send({ 'status': 200, 'data': insertIds });
                });
            }
        });
    }
};


exports.getgroceryitems = function (req, res) {
    appmdl.getgroceryitems(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.updategroceryitems = function (req, res) {
    var data = req.body
    if (data.imagesData == undefined) {
        imageupload = data.item_image
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
    appmdl.updategroceryitems(req.body, imageupload, function (err, results) {
        if (results) {
            appmdl.updategroceryitemsinsearch(req.body, imageupload, function (err, resulta) {
                if (err) {
                    res.send({ "status": 500, "msg": err });
                    return;
                }
                res.send({ 'status': 200, 'data': results });
            });
        } else {
            res.send({ 'status': 500 });
        }
    });
}

exports.deletegroceryitems = function (req, res) {
    appmdl.deletegroceryitems(req.body, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.addgrocerycategory = function (req, res) {
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
    appmdl.addgrocerycategory(req.body, imageupload, function (err, results) {
        if (results) {
            appmdl.addgrocerycategoryintosearch(results.insertId, req.body, imageupload, function (err, resulta) {
                if (err) {
                    res.send({ "status": 500, "msg": err });
                    return;
                }
                res.send({ 'status': 200, 'data': results });
            });
        } else {
            res.send({ 'status': 500 });
        }
    });
}

exports.getgrocerycategory = function (req, res) {
    appmdl.getgrocerycategory(function (err, results) {
        if (err) {
            res.send(500, "Server Error");
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.updategrocerycategory = function (req, res) {
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
    appmdl.updategrocerycategory(req.body, imageupload, function (err, results) {
        if (results) {
            appmdl.updategrocerycategoryinsearch(req.body, imageupload, function (err, resulta) {
                if (err) {
                    res.send({ "status": 500, "msg": err });
                    return;
                }
                res.send({ 'status': 200, 'data': results });
            });
        } else {
            res.send({ 'status': 500 });
        }
    });
}

exports.deletegrocerycategory = function (req, res) {
    appmdl.deletegrocerycategory(req.body, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.addgrocerysubcategory = function (req, res) {
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
    appmdl.addgrocerysubcategory(req.body, imageupload, function (err, results) {
        if (results) {
            appmdl.addgrocerysubcategoryintosearch(results.insertId, req.body, imageupload, function (err, resulta) {
                if (err) {
                    res.send({ "status": 500, "msg": err });
                    return;
                }
                res.send({ 'status': 200, 'data': results });
            });
        } else {
            res.send({ 'status': 500 });
        }
    });
}

exports.getgrocerysubcategory = function (req, res) {
    appmdl.getgrocerysubcategory(function (err, results) {
        if (err) {
            res.send(500, "Server Error");
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.updategrocerysubcategory = function (req, res) {
    var data = req.body
    if (data.imagesData == undefined) {
        imageupload = data.sub_category_image
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
    appmdl.updategrocerysubcategory(req.body, imageupload, function (err, results) {
        if (results) {
            appmdl.updategrocerysubcategoryinsearch(req.body, imageupload, function (err, resulta) {
                if (err) {
                    res.send({ "status": 500, "msg": err });
                    return;
                }
                res.send({ 'status': 200, 'data': results });
            });
        } else {
            res.send({ 'status': 500 });
        }
    });
}

exports.deletegrocerysubcategory = function (req, res) {
    appmdl.deletegrocerysubcategory(req.body, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.addsubtotalcategory = function (req, res) {
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
    appmdl.addsubtotalcategory(req.body, imageupload, function (err, results) {
        if (results) {
            appmdl.addsubtotalctgryintosearch(results.insertId, req.body, imageupload, function (err, resulta) {
                if (err) {
                    res.send({ "status": 500, "msg": err });
                    return;
                }
                res.send({ 'status': 200, 'data': results });
            });
        } else {
            res.send({ 'status': 500 });
        }
    });
}

exports.getsubtotalcategory = function (req, res) {
    appmdl.getsubtotalcategory(function (err, results) {
        if (err) {
            res.send(500, "Server Error");
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.updatesubtotalcategory = function (req, res) {
    var data = req.body
    if (data.imagesData == undefined) {
        imageupload = data.subtotal_category_image
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
    appmdl.updatesubtotalcategory(req.body, imageupload, function (err, results) {
        if (results) {
            appmdl.updategrocerysubtotalctgryinsearch(req.body, imageupload, function (err, resulta) {
                if (err) {
                    res.send({ "status": 500, "msg": err });
                    return;
                }
                res.send({ 'status': 200, 'data': results });
            });
        } else {
            res.send({ 'status': 500 });
        }
    });
}

exports.deletesubtotalcategory = function (req, res) {
    appmdl.deletesubtotalcategory(req.body, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.getmatchedgrocerysubcategory = function (req, res) {
    var id = req.params.id
    appmdl.getmatchedgrocerysubcategory(id, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.getmatchedgrocerysubtotalcategory = function (req, res) {
    var id = req.params.id
    appmdl.getmatchedgrocerysubtotalcategory(id, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.uploadExcel = function (req, res) {
    appmdl.uploadExcel(req.body, (err, results) => {
        if (err) return res.status(500).send({ status: 500, error: err });

        // Ensure results is an array, if not, wrap it in an array
        const insertResults = Array.isArray(results) ? results : [results];

        // Extract insert IDs, filtering out undefined/null values
        let insertIds = insertResults.map(r => r.insertId).filter(id => id);

        if (!insertIds.length) return res.status(400).send({ status: 400, message: "No valid insert IDs" });

        appmdl.insertexcelitemsintosearch(insertIds, req.body, (err) => {
            res.send({ status: err ? 500 : 200 });
        });
    });
};


exports.getitemdata = function (req, res) {
    var code = req.params.code
    appmdl.getitemdata(code, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.addpurchaserequest = function (req, res) {
    appmdl.addpurchaserequest(req.body, function (err, results) {
        if (results) {
            appmdl.insertordereditems(results.insertId, req.body, function (err, results) {
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

exports.getpurchaseinward = function (req, res) {
    appmdl.getpurchaseinward(function (err, results) {
        if (err) {
            res.send(500, "Server Error");
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.getinwarditems = function (req, res) {
    appmdl.getinwarditems(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}


//--------------------------------------------------------------------------------------------------------------------------

exports.updatepurchaseinward = function (req, res) {
    var data = req.body;
    appmdl.updateinwardmaindata(req.body, function (err, resultsa) {
        if (resultsa) {
            if (data.deleted_items.length == 0) {
                if (data.updated_items.length != 0) {
                    appmdl.editinwarditems(req.body, function (err, resultsu) {
                        if (err) {
                            res.send({ "status": 500, "msg": err });
                            return;
                        }
                        res.send({ 'status': 200, 'data': resultsu });
                    });
                } else {
                    res.send({ 'status': 200 });
                }
            } else {
                appmdl.deleteinwarditems(req.body, function (err, resultsd) {
                    if (resultsd) {
                        if (data.updated_items.length != 0) {
                            appmdl.editinwarditems(req.body, function (err, resultsu) {
                                if (err) {
                                    res.send({ "status": 500, "msg": err });
                                    return;
                                }
                                res.send({ 'status': 200, 'data': resultsu });
                            });
                        } else {
                            res.send({ "status": 200 });
                        }
                    } else {
                        res.send({ "status": 500 });
                    }

                });

            }
        }
    });
}

exports.getpurchaseinvoice = function (req, res) {
    appmdl.getpurchaseinvoice(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.updatepaymentstatus = function (req, res) {
    appmdl.updatepaymentstatus(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

//--------------------------------------------------------------------------------------------------------------------------

exports.addsupplierdetails = function (req, res) {
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
    appmdl.addsupplierdetails(req.body, imageupload, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.getsupplierdetails = function (req, res) {
    appmdl.getsupplierdetails(function (err, results) {
        if (err) {
            res.send(500, "Server Error");
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.updatesupplierdetails = function (req, res) {
    var data = req.body
    if (data.imagesData == undefined) {
        imageupload = data.supplier_image
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
    appmdl.updatesupplierdetails(req.body, imageupload, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.deletesupplierdetails = function (req, res) {
    appmdl.deletesupplierdetails(req.body, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}


// *************** Supplier and Grocery End **************


// *************** products Start **************

exports.getmatchedfilter = function (req, res) {
    var id = req.params.id
    appmdl.getmatchedfilter(id, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.additems = function (req, res) {
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
    appmdl.additems(req.body, imageupload, function (err, results) {
        if (results) {
            appmdl.additemintosearch(results.insertId, req.body, imageupload, function (err, resulta) {
                if (err) {
                    res.send({ "status": 500, "msg": err });
                    return;
                }
                res.send({ 'status': 200, 'data': results });
            });
        } else {
            res.send({ 'status': 500 });
        }
    });
}

exports.getitems = function (req, res) {
    appmdl.getitems(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.updateitems = function (req, res) {
    var data = req.body
    if (data.imagesData == undefined) {
        imageupload = data.item_image
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
    appmdl.updateitems(req.body, imageupload, function (err, results) {
        if (results) {
            appmdl.updateitemsinsearch(req.body, imageupload, function (err, resulta) {
                if (err) {
                    res.send({ "status": 500, "msg": err });
                    return;
                }
                res.send({ 'status': 200, 'data': results });
            });
        } else {
            res.send({ 'status': 500 });
        }
    });
}

exports.deleteitems = function (req, res) {
    appmdl.deleteitems(req.body, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.getmatchedshops = function (req, res) {
    appmdl.getmatchedshops(function (err, results) {
        if (err) {
            res.send(500, "Server Error");
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.getmatchedallshops = function (req, res) {
    var id = req.params.id
    appmdl.getmatchedallshops(id, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.getmatchedshopitems = function (req, res) {
    appmdl.getmatchedshopitems(req.body, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.getitemstoassign = function (req, res) {
    appmdl.getitemstoassign(req.body, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.submitassignedproducts = function (req, res) {
    appmdl.submitassignedproducts(req.body, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.getshopitems = function (req, res) {
    appmdl.getshopitems(req.body, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.updateshopitem = function (req, res) {
    appmdl.updateshopitem(req.body, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": err });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.deleteshopitems = function (req, res) {
    appmdl.deleteshopitems(req.body, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

// exports.addshopitems = function (req, res) {
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
//     appmdl.addshopitems(req.body, imageupload, function (err, results) {
//         if (err) {
//             res.send({ "status": 500, "msg": err });
//             return;
//         }
//         res.send({ 'status': 200, 'data': results });
//     });
// }

exports.addshopitems = function (req, res) {
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
    appmdl.addshopitemsinmaintbl(data, imageupload, function (err, results) {
        if (results) {
            appmdl.addshopitemsinctgytbl(results.insertId, data, imageupload, function (err, results) {
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

// *************** products End **************





















