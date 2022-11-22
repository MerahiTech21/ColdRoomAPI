var express = require('express');
const { route } = require('..');
var router = express.Router();

const WholeSalerRouter=require('./account')
const AuthRouter=require('./auth')
const OrderRouter=require('./order')
const ProductRouter=require('./product')
const ColdRoomRouter=require('./coldRoom')

//const ValidateToken = require('../../middelware/validation/validate-token');

//router.use('/employees',EmployeeRouter);
router.use('/wholesalers', WholeSalerRouter);
router.use('/auth',AuthRouter);
router.use('/orders',OrderRouter);
router.use('/wholesalerProduct',ProductRouter);
router.use('/coldRoom',ColdRoomRouter);


module.exports =router;
