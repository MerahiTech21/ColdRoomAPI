var express = require('express');
var router = express.Router();
const FarmerProductRouter=require('./product')
const OrderRouter=require('./order')
const FarmerBalanceRouter=require('./farmer-balance')
const FarmerRentRouter=require('./farmer-rent')
const FarmerRouter=require('./farmer')
const RevenueRouter=require('./revenue')
const SalesRouter=require('./sales')
const WholeSalerRouter=require('./whole-saler')

router.use('/products', FarmerProductRouter);
router.use('/orders',OrderRouter)

router.use('/farmers',FarmerRouter)
router.use('/wholesalers',WholeSalerRouter)
router.use('/revenues',RevenueRouter)
router.use('/sales',SalesRouter)

module.exports=router