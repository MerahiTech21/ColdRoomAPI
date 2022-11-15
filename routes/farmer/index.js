var express = require('express');
var router = express.Router();

const FarmerRouter=require('./account')
const AuthRouter=require('./auth')
//const ValidateToken = require('../../middelware/validation/validate-token');

//router.use('/employees',EmployeeRouter);
router.use('/farmers', FarmerRouter);
router.use('/auth',AuthRouter);

module.exports =router;
