var express = require('express');
var router = express.Router();
const {SaveFarmerProduct,getFarmersProducts, getProductDetail, getProducts}=require('../../controllers/local-admin/product');

router.post('/',  SaveFarmerProduct);
router.get('/',  getFarmersProducts);
router.get('/:id',  getProductDetail);
router.get('for-filter',  getProducts);
module.exports=router 