var express = require('express');
var router = express.Router();

const WholeSalerRouter=require('./account')
const AuthRouter=require('./auth')
//const ValidateToken = require('../../middelware/validation/validate-token');

//router.use('/employees',EmployeeRouter);
router.use('/wholesalers', WholeSalerRouter);
router.use('/auth',AuthRouter);

module.exports =router;
