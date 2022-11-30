var express = require('express');
const { setProductTypePrice, getProductTypePrice } = require('../../controllers/local-admin/coldroom-product');
var router = express.Router();
const {SaveFarmerProduct,getFarmersProducts, getProductDetail, getProducts,getAllFarmerProduct,deleteFarmerProduct, editFarmerProduct}=require('../../controllers/local-admin/product');

router.post('/',  SaveFarmerProduct);
router.get('/',  getFarmersProducts);
router.get('/for-filter',  getProducts);
router.get('/history',  getAllFarmerProduct);
router.get('/:id',  getProductDetail);
router.put('/:id',  editFarmerProduct);
router.delete('/:id',  deleteFarmerProduct);
router.post('/set-price',  setProductTypePrice);
router.get('/get-price/:id',  getProductTypePrice);

module.exports=router 