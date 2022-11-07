var express = require('express');
var router = express.Router();
const FarmerProductRouter=require('./farmer-product')
const OrderRouter=require('./order')
const FarmerBalanceRouter=require('./farmer-balance')
const FarmerRentRouter=require('./farmer-rent')
const FarmerRouter=require('./farmer')
const RevenueRouter=require('./revenue')
const SalesRouter=require('./sales')
router.use('/farmer-product', FarmerProductRouter);
router.use('/orders',OrderRouter)
router.use('/farmer-balance',FarmerBalanceRouter)
router.use('/farmer-rent',FarmerRentRouter)
router.use('/farmers',FarmerRouter)
router.use('/revenues',RevenueRouter)
router.use('/sales',SalesRouter)

module.exports=router