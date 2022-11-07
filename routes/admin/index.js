var express = require('express');
var router = express.Router();

const EmployeeRouter=require('./employee');
const AuthRouter=require('./auth')
const ValidateToken = require('../../middelware/validation/validate-token');
const ProductRouter=require('./product');
const ColdRoomRouter=require('./coldRoom');
const AddressRouter=require('./address');
const FarmerRouter=require('./farmer');





//router.use('/employees',EmployeeRouter);
router.use('/employees',ValidateToken, EmployeeRouter);
router.use('/auth',AuthRouter);
router.use('/products',ProductRouter);
router.use('/coldRooms',ColdRoomRouter);
router.use('/address',AddressRouter);
router.use('/farmer',FarmerRouter);






module.exports =router;
