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

// **************Profile Start ***********//

router.post('/getusersprofile', sampleRoutes.getusersprofilectrl);
router.post('/updateuserpassword', sampleRoutes.updateuserpassword);
router.post('/updateimage', sampleRoutes.updateimagectrl);

// *************Profile End ************//

router.post('/addlocation', sampleRoutes.addlocation);
router.get('/getlocation', sampleRoutes.getlocation);
router.post('/updatelocation', sampleRoutes.updatelocation);
router.post('/deletelocation', sampleRoutes.deletelocation);

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

router.post('/addsize', sampleRoutes.addsize);
router.get('/getsize', sampleRoutes.getsize);
router.post('/updatesize', sampleRoutes.updatesize);
router.post('/deletesize', sampleRoutes.deletesize);

router.post('/addcategory', sampleRoutes.addcategory);
router.get('/getcategory', sampleRoutes.getcategory);
router.post('/updatecategory', sampleRoutes.updatecategory);
router.post('/deletecategory', sampleRoutes.deletecategory);
router.post('/updatecategoryactivestatus', sampleRoutes.updatecategoryactivestatus);

router.post('/addproduct', sampleRoutes.addproduct);
router.get('/getproduct', sampleRoutes.getproduct);
router.post('/updateproduct', sampleRoutes.updateproduct);
router.post('/deleteproduct', sampleRoutes.deleteproduct);















module.exports = router;
