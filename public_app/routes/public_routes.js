var express = require('express');
router = express.Router();
// var jwt = require('jsonwebtoken');
var sampleRoutes = require('../controllers/public_mainCtrl');
process.env.SECRET_KEY = "thisismysecretkey";

router.post('/generateorderid', sampleRoutes.generateorderidCtrl);
router.get('/getserviceslist', sampleRoutes.getserviceslistCtrl);
router.post('/getuserlocation', sampleRoutes.getuserlocationCtrl);
router.post('/getlocationctgrylist', sampleRoutes.getlocationctgrylistCtrl);
router.post('/getshopsubcategorylist', sampleRoutes.getshopsubcategorylistCtrl);
router.post('/getbannerslist', sampleRoutes.getbannerslistCtrl);
router.post('/getcategorybannerslist', sampleRoutes.getcategorybannerslistCtrl);

router.post('/getshoplist', sampleRoutes.getshoplistCtrl);
router.post('/getitemslist', sampleRoutes.getitemslistCtrl);
router.post('/getrelateditemslist', sampleRoutes.getrelateditemslistCtrl);
router.post('/coupon_list', sampleRoutes.coupon_listCtrl);
router.post('/notificationslist', sampleRoutes.notificationslistCtrl);
router.post('/orderplaced', sampleRoutes.orderplacedCtrl);
router.post('/getuserloginotp', sampleRoutes.getuserloginotpCtrl);
router.post('/customerlogin', sampleRoutes.customerloginCtrl);
router.post('/getslot_booking', sampleRoutes.getslot_bookingCtrl);
router.post('/getorderdetails', sampleRoutes.getorderdetailsCtrl);
router.post('/getorderlist', sampleRoutes.getorderlistCtrl);

router.post('/updatepaymetdetails', sampleRoutes.updatepaymetdetails);


router.post('/getgrocery_sub_total_categories', sampleRoutes.getgrocery_sub_total_categoriesCtrl);
router.post('/getgroucery_category_items_list', sampleRoutes.getgroucery_category_items_listCtrl);
router.post('/getgroucery_search_items_list', sampleRoutes.getgroucery_search_items_listCtrl);
router.post('/get_subscription_timeline', sampleRoutes.get_subscription_timelineCtrl);
router.post('/get_wallet_amounts', sampleRoutes.get_wallet_amountsCtrl);
router.post('/user_wallet_payment', sampleRoutes.user_wallet_paymentCtrl);
router.post('/update_user_wallet_payment', sampleRoutes.update_user_wallet_paymentCtrl);
router.post('/get_user_wallet_amount_details', sampleRoutes.get_user_wallet_amount_detailsCtrl);
router.post('/subscription_order_placed', sampleRoutes.subscription_order_placedCtrl);
router.post('/getsubscripitioin_orders', sampleRoutes.getsubscripitioin_ordersCtrl);
router.post('/getrecieved_subscripitioin_order_itemCtrl', sampleRoutes.getrecieved_subscripitioin_order_itemCtrl);
router.post('/getwalletdeduction', sampleRoutes.getwalletdeductionCtrl);
router.post('/getsubcategoryall', sampleRoutes.getsubcategoryallctrl);
router.post('/search_allitems', sampleRoutes.search_allitemsctrl);
// router.post('/search_grocery_items', sampleRoutes.search_grocery_itemsCtrl);
router.post('/searchitemsfull', sampleRoutes.searchitemsfullctrl);

router.post('/postplayer_id', sampleRoutes.postplayer_idctrl);
router.post('/post_customer_delivery_address', sampleRoutes.post_customer_delivery_addressCtrl);
router.post('/get_customer_delivery_address', sampleRoutes.get_customer_delivery_addressCtrl);
router.post('/delete_customer_address', sampleRoutes.delete_customer_addressCtrl);

router.get('/checksamplenotification', sampleRoutes.checksamplenotificationCtrl);
router.post('/application_common_api', sampleRoutes.application_common_apiCtrl);
router.post('/getprofile', sampleRoutes.getprofileCtrl);
router.post('/update_customer_profile', sampleRoutes.update_customer_profileCtrl);
router.post('/get_related_products', sampleRoutes.get_related_productsCtrl);
router.get('/getappversions', sampleRoutes.getappversionsCtrl);
router.post('/bannertgetproducts', sampleRoutes.bannertgetproductsCtrl);
router.post('/cancleorder', sampleRoutes.cancleorderCtrl);
router.post('/postapprating', sampleRoutes.postapprating);
router.post('/postorderrating', sampleRoutes.postorderrating);

router.post('/getsearchshoplist', sampleRoutes.getsearchshoplistCtrl);
router.post('/getsingleshopdetails', sampleRoutes.getsingleshopdetailsCtrl);
router.post('/getsearchcategoriesshoplist', sampleRoutes.getsearchcategoriesshoplistCtrl);
router.post('/getsearchsubcategoriesshoplist', sampleRoutes.getsearchsubcategoriesshoplistCtrl);
router.post('/getsearchgroceryitemslist', sampleRoutes.getsearchgroceryitemslistCtrl);

router.post('/addwishlist', sampleRoutes.addwishlistCtrl);
router.post('/deletewishlist', sampleRoutes.deletewishlistCtrl);
router.post('/getuserwishlist', sampleRoutes.getuserwishlistCtrl);
router.post('/sameshopoutlets', sampleRoutes.sameshopoutletsCtrl);
router.post('/getslotdates', sampleRoutes.getslotdatesCtrl);
router.post('/getcategorydetails', sampleRoutes.getcategorydetailsCtrl);
router.post('/delivery_instructions', sampleRoutes.delivery_instructionsCtrl);
router.post('/getmerchentratings', sampleRoutes.getmerchentratingsCtrl);
router.post('/getshop_offercelist', sampleRoutes.getshop_offercelistCtrl);
router.post('/checkshop_slot_timings', sampleRoutes.checkshop_slot_timingsCtrl);
router.post('/get_offer_banners', sampleRoutes.get_offer_bannersCtrl);
router.post('/recomrecommended_for_you_shops', sampleRoutes.recomrecommended_for_you_shopsCtrl);
router.post('/getuserwishlistfulldata', sampleRoutes.getuserwishlistfulldata);
router.post('/deleteaccount', sampleRoutes.deleteaccountCtrl);
router.post('/public_complaits', sampleRoutes.public_complaitsCtrl);

router.get('/generateslottimeing', sampleRoutes.generateslottimeingCtrl);
router.post('/getbanneritemslist', sampleRoutes.getbanneritemslistCtrl);
router.get('/checksockets', sampleRoutes.checksocketsCtrl);
router.get('/getversion', sampleRoutes.getversion);


router.post('/updatename', sampleRoutes.updatename);
router.post('/razorpaypaymentsuccess', sampleRoutes.razorpaypaymentsuccessCtrl);


module.exports = router;