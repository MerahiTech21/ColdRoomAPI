var express = require('express');
var router = express.Router();
const FarmerProductRouter=require('./product')
const OrderRouter=require('./order')
const FarmerBalanceRouter=require('./farmer-balance')
// const FarmerRentRouter=require('./farmer-rent')
const FarmerRouter=require('./farmer')
const RevenueRouter=require('./revenue')
const SalesRouter=require('./sales')
const WholeSalerRouter=require('./whole-saler');
const DashboardRouter=require('./dashboard');

const { LocalAdminMyAccount } = require('../../controllers/auth/employee');
const ValidateToken = require('../../middelware/validation/validate-token');

router.use('/products', FarmerProductRouter);
router.use('/orders',OrderRouter)
router.use('/dashboard',ValidateToken,DashboardRouter)

router.use('/farmers',ValidateToken,FarmerRouter)
router.use('/wholesalers',ValidateToken,WholeSalerRouter)
router.use('/revenues',ValidateToken,RevenueRouter)
router.use('/sales',ValidateToken,SalesRouter)
router.use('/auth/my-account',ValidateToken,LocalAdminMyAccount)
module.exports=router 