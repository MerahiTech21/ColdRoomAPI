var express = require('express');
var router = express.Router();

const EmployeeRouter=require('./employee')
const AuthRouter=require('./auth')
const ValidateToken = require('../../middelware/validation/validate-token');

//router.use('/employees',EmployeeRouter);
router.use('/employees',ValidateToken, EmployeeRouter);
router.use('/auth',AuthRouter);

module.exports =router;
