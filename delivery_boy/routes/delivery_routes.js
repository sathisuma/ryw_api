var express = require('express');
router = express.Router();
// var jwt = require('jsonwebtoken');
var sampleRoutes = require('../controllers/delivery_mainCtrl');
process.env.SECRET_KEY = "thisismysecretkey";




//delivery_boy//

router.post('/logincheck', sampleRoutes.logincheckCtrl);//login
router.post('/getcurrentorders', sampleRoutes.getcurrentordersCtrl);//current orders
router.post('/getnewcurrentorders', sampleRoutes.getnewcurrentordersCtrl);
router.post('/getorderdetails', sampleRoutes.getorderdetailsCtrl);//each orderdetailed
router.post('/acceptorderstatus', sampleRoutes.updateorderstatusCtrl);//deliveryboy accepted
router.post('/checkdeliveryacceptstatus', sampleRoutes.checkdeliveryacceptstatusCtrl);
router.post('/updatedeliverylatlng', sampleRoutes.updatedeliverylatlngCtrl);//update latlongs while login
router.post('/updatedeliveryotp', sampleRoutes.updatedeliveryotpCtrl);// update delivery
router.post('/completedorder', sampleRoutes.completedorderCtrl);// order completion
router.post('/getprofiledata', sampleRoutes.getprofiledataCtrl); // profile data
router.post('/updateprofiledata', sampleRoutes.updateprofiledataCtrl);//update profile
router.post('/updateoderstatdata', sampleRoutes.updateoderstatdataCtrl);// update initial order received from vendor
router.post('/updatelatlongsdata', sampleRoutes.updatelatlongsdataCtrl); // every 30sec latlongs update
router.post('/getordersdatewise', sampleRoutes.getordersdatewiseCtrl); // every 30sec latlongs update
router.post('/updateplayerid', sampleRoutes.updateplayeridCtrl); //  player id update 

router.post('/getordercounts', sampleRoutes.getordercounts);
router.post('/getordercountsdetails', sampleRoutes.getordercountsdetails);

router.post('/deliveryboypayments', sampleRoutes.deliveryboypayments); 
router.post('/getdeliveryboyincentivesamount', sampleRoutes.getdeliveryboyincentivesamount);

router.post('/deliveryboypaymentreports', sampleRoutes.deliveryboypaymentreports); 
router.post('/getdelboypaymentincentiveshistory', sampleRoutes.getdelboypaymentincentiveshistory);
router.post('/postplayer_id', sampleRoutes.postplayer_idctrl);
router.post('/deliveryboyactivestatus', sampleRoutes.deliveryboyactivestatus);



module.exports = router;


