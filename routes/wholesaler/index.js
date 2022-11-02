var express = require('express');
var router = express.Router();

const WholeSalerRouter=require('./account')
const AuthRouter=require('./auth')
const OrderRouter=require('./order')
//const ValidateToken = require('../../middelware/validation/validate-token');

//router.use('/employees',EmployeeRouter);
router.use('/wholesalers', WholeSalerRouter);
router.use('/auth',AuthRouter);
router.use('/orders',OrderRouter);

module.exports =router;
