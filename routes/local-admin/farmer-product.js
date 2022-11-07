var express = require('express');
const { getFarmerProductHistory } = require('../../controllers/local-admin/farmer');
var router = express.Router();
const {SaveFarmerProduct,getFarmersProducts, getProductDetail}=require('../../controllers/local-admin/farmer-product');

router.post('/',  SaveFarmerProduct);
router.get('/',  getFarmersProducts);
router.get('/:id',  getProductDetail);
router.get('/farmer/:id',  getFarmerProductHistory);
module.exports=router