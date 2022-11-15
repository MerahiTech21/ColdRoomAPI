var express = require('express');
var router = express.Router();

const EmployeeRouter=require('./employee');
const AuthRouter=require('./auth')
const ValidateToken = require('../../middelware/validation/validate-token');
const ProductRouter=require('./product');
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
router.use('/employees'/*,ValidateToken*/, EmployeeRouter);
router.use('/auth',AuthRouter);
router.use('/products',ProductRouter);
router.use('/coldRooms',ColdRoomRouter);
router.use('/address',AddressRouter);
router.use('/farmers',FarmerRouter);
router.use('/wholesalers',WholeSalerRouter)

router.use('/revenues',RevenueRouter)
router.use('/sales',SalesRouter)

router.use('/orders',OrderRouter);
router.use('/coldroom-products',CRoomProductRouter);

router.use('/dashboard',DashboardRouter)
router.use('/coldRoomNames',getAllColdroomName)



module.exports =router;
