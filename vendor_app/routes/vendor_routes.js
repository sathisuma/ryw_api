var express = require('express');
router = express.Router();
// var jwt = require('jsonwebtoken');
var sampleRoutes = require('../controllers/vendor_mainCtrl');
process.env.SECRET_KEY = "thisismysecretkey";


// router.post('/submitvendorlogin', sampleRoutes.submitvendorloginCtrl);
// router.post('/getcurrentorders', sampleRoutes.getcurrentordersCtrl);
// router.post('/newgetorderdetails', sampleRoutes.newgetorderdetailsCtrl);
// router.post('/updateorderstatus', sampleRoutes.updateorderstatusCtrl);
// router.post('/getdashboardorders', sampleRoutes.getdashboardordersCtrl);
// //1703
// router.post('/getshoplist', sampleRoutes.getshoplistCtrl);
// router.post('/getbillinginformation', sampleRoutes.getbillinginformationCtrl);
// router.post('/updateshopstatus', sampleRoutes.updateshopstatusCtrl);
// router.post('/updatevendorspassword', sampleRoutes.updatevendorspasswordCtrl);
// router.post('/updatepromocode', sampleRoutes.updatepromocodeCtrl);
// router.post('/getpromocodes', sampleRoutes.getpromocodesCtrl);
// router.post('/deletepromocode', sampleRoutes.deletepromocodeCtrl);
// router.post('/promocodeactive', sampleRoutes.promocodeactiveCtrl);
// router.post('/getproductslistdata', sampleRoutes.getproductslistdataCtrl);
// router.post('/updateshopproducts', sampleRoutes.updateshopproductsCtrl);
// router.post('/postmain_player_id', sampleRoutes.postmain_player_id);
// router.post('/updateproductactive', sampleRoutes.updateproductactiveCtrl);

// //29032025//
// router.post('/getshopsforpayments', sampleRoutes.getshopsforpayments);
// router.post('/getpaymenthistory', sampleRoutes.getpaymenthistory);
// //04-04-2025//

// router.post('/getuserssubcatgry', sampleRoutes.getuserssubcatgry);

// router.post('/additemsdetails', sampleRoutes.additemsdetails);
// router.post('/addsupportfromvendor', sampleRoutes.addsupportfromvendor);

//multitesting api//

router.post('/submitvendorlogin', sampleRoutes.submitvendorloginCtrl);
router.post('/getcurrentorders', sampleRoutes.getcurrentordersCtrl);
router.post('/newgetorderdetails', sampleRoutes.newgetorderdetailsCtrl);
router.post('/updateorderstatus', sampleRoutes.updateorderstatusCtrl);
router.post('/getdashboardorders', sampleRoutes.getdashboardordersCtrl);
//1703
router.post('/getshoplist', sampleRoutes.getshoplistCtrl);
router.post('/getbillinginformation', sampleRoutes.getbillinginformationCtrl);
router.post('/updateshopstatus', sampleRoutes.updateshopstatusCtrl);
router.post('/updatevendorspassword', sampleRoutes.updatevendorspasswordCtrl);
router.post('/updatepromocode', sampleRoutes.updatepromocodeCtrl);
router.post('/getpromocodes', sampleRoutes.getpromocodesCtrl);
router.post('/deletepromocode', sampleRoutes.deletepromocodeCtrl);
router.post('/promocodeactive', sampleRoutes.promocodeactiveCtrl);
router.post('/getproductslistdata', sampleRoutes.getproductslistdataCtrl);
router.post('/updateshopproducts', sampleRoutes.updateshopproductsCtrl);
router.post('/postmain_player_id', sampleRoutes.postmain_player_id);
router.post('/updateproductactive', sampleRoutes.updateproductactiveCtrl);

//29032025//
router.post('/getshopsforpayments', sampleRoutes.getshopsforpayments);
router.post('/getpaymenthistory', sampleRoutes.getpaymenthistory);
//04-04-2025//

router.post('/getuserssubcatgry', sampleRoutes.getuserssubcatgry);

router.post('/additemsdetails', sampleRoutes.additemsdetails);
router.post('/addsupportfromvendor', sampleRoutes.addsupportfromvendor);

router.post('/getshopidsdata', sampleRoutes.getshopidsdata);
router.post('/getcurrentordersbyid', sampleRoutes.getcurrentordersbyidCtrl);


//2605
router.post('/getdateresultsbydate', sampleRoutes.getdateresultsbydate);
router.post('/addshopitems', sampleRoutes.addshopitems);
//2705
router.post('/extraitems', sampleRoutes.extraitems);
router.get('/checkdeliveryboynotification', sampleRoutes.checkdeliveryboynotificationCtrl);
router.post('/getextaritemsdata', sampleRoutes.getextaritemsdata);
router.post('/updateshopitems', sampleRoutes.updateshopitems);

router.post('/getshopdetailstitle', sampleRoutes.getshopdetailstitle);
router.post('/getsubcategoriestoclose', sampleRoutes.getsubcategoriestoclose);
router.get('/getversion', sampleRoutes.getversion);
module.exports = router;


