var express = require('express');
router = express.Router();
var sampleRoutes = require('../controllers/mainCtrl');
process.env.SECRET_KEY = "thisismysecretkey";



// ************* Login Start ************//

router.post('/getUserData', sampleRoutes.getUserDataCtrl);
router.post('/submituserslogin', sampleRoutes.submitusersloginctrl);
router.get('/getuserlist', sampleRoutes.getuserlistctrl);
router.post('/deleteuser', sampleRoutes.deleteuserctrl);
router.post('/getupdatemodules', sampleRoutes.getupdatemodulesctrl);
router.post('/postusermenulist', sampleRoutes.postusermenulistCtrl);

// ************* Login End **************//

//******************Website Contact Data******************//

router.post('/websitecontact', sampleRoutes.websitecontact);

//******************Website Contact Data******************//

// **************Profile Start ***********//

router.post('/getusersprofile', sampleRoutes.getusersprofilectrl);
router.post('/updateuserpassword', sampleRoutes.updateuserpassword);
router.post('/updateimage', sampleRoutes.updateimagectrl);

// *************Profile End ************//

// ************** Mainmodules Start ************//

router.post('/shop_registration', sampleRoutes.shop_registration);
router.post('/sendregistrationsuccessemail', sampleRoutes.sendregistrationsuccessemail);
router.post('/getshopreg', sampleRoutes.getshopreg);
router.post('/updateshopreg', sampleRoutes.updateshopreg);
router.post('/deleteshopreg', sampleRoutes.deleteshopreg);
router.post('/updateshopactivestatus', sampleRoutes.updateshopactivestatus);
router.post('/updateditemactivestatus', sampleRoutes.updateditemactivestatus);
router.get('/getgroupbyshop', sampleRoutes.getgroupbyshop);

// ************* Mainmodules End *************//

// ************* Masters start *************//

router.post('/addlocation', sampleRoutes.addlocation);
router.get('/getlocation', sampleRoutes.getlocation);
router.post('/updatelocation', sampleRoutes.updatelocation);
router.post('/deletelocation', sampleRoutes.deletelocation);

router.post('/addcategory', sampleRoutes.addcategory);
router.get('/getcategory', sampleRoutes.getcategory);
router.post('/updatecategory', sampleRoutes.updatecategory);
router.post('/deletecategory', sampleRoutes.deletecategory);

router.post('/addsubcategory', sampleRoutes.addsubcategory);
router.get('/getsubcategory', sampleRoutes.getsubcategory);
router.post('/updatesubcategory', sampleRoutes.updatesubcategory);
router.post('/deletesubcategory', sampleRoutes.deletesubcategory);

router.get('/getmatchedcategory/:id', sampleRoutes.getmatchedcategory);
router.post('/addmainfilter', sampleRoutes.addmainfilter);
router.get('/getmainfilter', sampleRoutes.getmainfilter);
router.post('/updatemainfilter', sampleRoutes.updatemainfilter);
router.post('/deletemainfilter', sampleRoutes.deletemainfilter);

router.post('/addbanner', sampleRoutes.addbanner);
router.post('/getbanner', sampleRoutes.getbanner);
router.post('/updatebanner', sampleRoutes.updatebanner);
router.post('/deletebanner', sampleRoutes.deletebanner);

router.post('/addnotifications', sampleRoutes.addnotifications);
router.post('/getnotifications', sampleRoutes.getnotifications);
router.post('/updatenotifications', sampleRoutes.updatenotifications);
router.post('/deletenotifications', sampleRoutes.deletenotifications);

router.post('/addcoupon', sampleRoutes.addcoupon);
router.post('/getcoupon', sampleRoutes.getcoupon);
router.post('/updatecoupon', sampleRoutes.updatecoupon);
router.post('/deletecoupon', sampleRoutes.deletecoupon);

router.post('/adddeliveryboy', sampleRoutes.adddeliveryboy);
router.get('/getdeliveryboy', sampleRoutes.getdeliveryboy);
router.post('/updatedeliveryboy', sampleRoutes.updatedeliveryboy);
router.post('/deletedeliveryboy', sampleRoutes.deletedeliveryboy);
router.post('/updatedeliveryboyactivestatus', sampleRoutes.updatedeliveryboyactivestatus);

router.post('/addfranchise', sampleRoutes.addfranchise);
router.get('/getfranchise', sampleRoutes.getfranchise);
router.post('/updatefranchise', sampleRoutes.updatefranchise);
router.post('/deletefranchise', sampleRoutes.deletefranchise);


// ************* Masters End *************//

// ************* customer Start *************//

router.post('/getcustomerlist', sampleRoutes.getcustomerlist);
router.post('/getuserwalletlist', sampleRoutes.getuserwalletlist);
router.post('/getwalletpayments', sampleRoutes.getwalletpayments);
router.post('/getsubscriptionlist', sampleRoutes.getsubscriptionlist);
router.post('/getsubscriptiondetails', sampleRoutes.getsubscriptiondetails);
router.post('/getsubscriptionstogenerate', sampleRoutes.getsubscriptionstogenerate);
router.post('/getsubscriptionstoreports', sampleRoutes.getsubscriptionstoreports);
router.post('/submitsubscriptionorders', sampleRoutes.submitsubscriptionorders);
router.post('/updatesinglesubscription', sampleRoutes.updatesinglesubscription);
router.get('/getdeliveryboyslist', sampleRoutes.getdeliveryboyslist);
router.post('/getorderslist', sampleRoutes.getorderslist);
router.post('/updateorderstatus', sampleRoutes.updateorderstatus);
router.post('/getorderdetails', sampleRoutes.getorderdetails);
router.post('/getcustomerorderdetails', sampleRoutes.getcustomerorderdetails);

router.post('/getshopsforpayments', sampleRoutes.getshopsforpayments);
router.post('/submitpaymentdetails', sampleRoutes.submitpaymentdetails);
router.post('/getpaymenthistory', sampleRoutes.getpaymenthistory);


// ************* customer End *************//

// ************* Products Start *************//

router.get('/getmatchedfilter/:id', sampleRoutes.getmatchedfilter);
router.post('/additems', sampleRoutes.additems);
router.post('/getitems', sampleRoutes.getitems);
router.post('/updateitems', sampleRoutes.updateitems);
router.post('/deleteitems', sampleRoutes.deleteitems);

router.get('/getmatchedshops', sampleRoutes.getmatchedshops);
router.get('/getmatchedallshops/:id', sampleRoutes.getmatchedallshops);
router.post('/getmatchedshopitems', sampleRoutes.getmatchedshopitems);
router.post('/getitemstoassign', sampleRoutes.getitemstoassign);

router.post('/submitassignedproducts', sampleRoutes.submitassignedproducts);
router.post('/getshopitems', sampleRoutes.getshopitems);
router.post('/updateshopitem', sampleRoutes.updateshopitem);
router.post('/deleteshopitems', sampleRoutes.deleteshopitems);
router.post('/addshopitems', sampleRoutes.addshopitems);

// ************* Products End *************//

// ************* Supplier and Grocery Start *************//

router.post('/addslottiming', sampleRoutes.addslottiming);
router.get('/getslottiming', sampleRoutes.getslottiming);
router.post('/updateslottiming', sampleRoutes.updateslottiming);
router.post('/deleteslottiming', sampleRoutes.deleteslottiming);

router.post('/addrack', sampleRoutes.addrack);
router.get('/getrack', sampleRoutes.getrack);
router.post('/updaterack', sampleRoutes.updaterack);
router.post('/deleterack', sampleRoutes.deleterack);

router.post('/addsubrack', sampleRoutes.addsubrack);
router.get('/getsubrack', sampleRoutes.getsubrack);
router.post('/updatesubrack', sampleRoutes.updatesubrack);
router.post('/deletesubrack', sampleRoutes.deletesubrack);

router.post('/addshelf', sampleRoutes.addshelf);
router.get('/getshelf', sampleRoutes.getshelf);
router.post('/updateshelf', sampleRoutes.updateshelf);
router.post('/deleteshelf', sampleRoutes.deleteshelf);

router.post('/addshelflocation', sampleRoutes.addshelflocation);
router.get('/getshelflocation', sampleRoutes.getshelflocation);
router.post('/updateshelflocation', sampleRoutes.updateshelflocation);
router.post('/deleteshelflocation', sampleRoutes.deleteshelflocation);

router.post('/submitmeasurement', sampleRoutes.submitmeasurement);
router.get('/getmeasurements', sampleRoutes.getmeasurements);
router.post('/addgroceryitems', sampleRoutes.addgroceryitems);
router.post('/getgroceryitems', sampleRoutes.getgroceryitems);
router.post('/updategroceryitems', sampleRoutes.updategroceryitems);
router.post('/deletegroceryitems', sampleRoutes.deletegroceryitems);

router.post('/addgrocerycategory', sampleRoutes.addgrocerycategory);
router.get('/getgrocerycategory', sampleRoutes.getgrocerycategory);
router.post('/updategrocerycategory', sampleRoutes.updategrocerycategory);
router.post('/deletegrocerycategory', sampleRoutes.deletegrocerycategory);

router.post('/addgrocerysubcategory', sampleRoutes.addgrocerysubcategory);
router.get('/getgrocerysubcategory', sampleRoutes.getgrocerysubcategory);
router.post('/updategrocerysubcategory', sampleRoutes.updategrocerysubcategory);
router.post('/deletegrocerysubcategory', sampleRoutes.deletegrocerysubcategory);

router.post('/addsubtotalcategory', sampleRoutes.addsubtotalcategory);
router.get('/getsubtotalcategory', sampleRoutes.getsubtotalcategory);
router.post('/updatesubtotalcategory', sampleRoutes.updatesubtotalcategory);
router.post('/deletesubtotalcategory', sampleRoutes.deletesubtotalcategory);

router.get('/getmatchedgrocerysubcategory/:id', sampleRoutes.getmatchedgrocerysubcategory);
router.get('/getmatchedgrocerysubtotalcategory/:id', sampleRoutes.getmatchedgrocerysubtotalcategory);

router.post('/uploadExcel', sampleRoutes.uploadExcel);

router.get('/getitemdata/:code', sampleRoutes.getitemdata);

router.post('/addpurchaserequest', sampleRoutes.addpurchaserequest);
router.get('/getpurchaseinward', sampleRoutes.getpurchaseinward);
router.post('/getinwarditems', sampleRoutes.getinwarditems);

router.post('/addsupplierdetails', sampleRoutes.addsupplierdetails);
router.get('/getsupplierdetails', sampleRoutes.getsupplierdetails);
router.post('/updatesupplierdetails', sampleRoutes.updatesupplierdetails);
router.post('/deletesupplierdetails', sampleRoutes.deletesupplierdetails);

router.post('/updatepurchaseinward', sampleRoutes.updatepurchaseinward);
router.post('/getpurchaseinvoice', sampleRoutes.getpurchaseinvoice);
router.post('/updatepaymentstatus', sampleRoutes.updatepaymentstatus);


// ************* Supplier and Grocery End *************//





module.exports = router;
