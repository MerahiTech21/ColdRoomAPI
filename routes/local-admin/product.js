var express = require('express');
var router = express.Router();
const {SaveFarmerProduct,getFarmersProducts, getProductDetail}=require('../../controllers/local-admin/product');

router.post('/',  SaveFarmerProduct);
router.get('/',  getFarmersProducts);
router.get('/:id',  getProductDetail);
module.exports=router 