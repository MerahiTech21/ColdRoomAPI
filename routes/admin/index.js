var express = require('express');
var router = express.Router();

const EmployeeRouter=require('./employee');
const AuthRouter=require('./auth')
const ValidateToken = require('../../middelware/validation/validate-token');
const ProductRouter=require('./product');
const ProductTypeRouter=require('./product-type');

const ColdRoomRouter=require('./coldRoom');
const AddressRouter=require('./address');
const FarmerRouter=require('./farmer');
const OrderRouter=require('./order')
const CRoomProductRouter=require('./coldroom-product')
const WholeSalerRouter=require('./whole-saler')

const RevenueRouter=require('./revenue')
const SalesRouter=require('./sales')
const DashboardRouter=require('./dashboard');
const { getAllColdroomName } = require('../../controllers/admin/coldRoom');

//router.use('/employees',EmployeeRouter);
router.use('/employees',ValidateToken, EmployeeRouter);
router.use('/auth',AuthRouter);
router.use('/products',ProductRouter);
router.use('/product-types',ValidateToken,ProductTypeRouter);
router.use('/coldRooms',ValidateToken,ColdRoomRouter);
router.use('/address',ValidateToken,AddressRouter);
router.use('/farmers',ValidateToken,FarmerRouter);
router.use('/wholesalers',ValidateToken,WholeSalerRouter)
 
router.use('/revenues',ValidateToken,RevenueRouter)
router.use('/sales',ValidateToken,SalesRouter)

router.use('/orders',OrderRouter);
router.use('/coldroom-products',ValidateToken,CRoomProductRouter);

router.use('/dashboard',ValidateToken,DashboardRouter)
router.use('/coldRoomNames',ValidateToken,getAllColdroomName)



module.exports =router;
