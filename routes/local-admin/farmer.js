var express = require('express');
var router = express.Router();
const {SaveFarmerProduct,getFarmerProduct, getProductDetail}=require('../../controllers/local-admin/farmer-product');

router.post('/farmer_product',  SaveFarmerProduct);
router.get('/farmer_product',  getFarmerProduct);
router.get('/product_detail',  getProductDetail);
module.exports=router