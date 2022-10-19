var express = require('express');
var router = express.Router();

const EmployeeRouter=require('./employee')
const validateToken = require('../../middleware/validation/validate-token');

router.use('/employees',EmployeeRouter);
//router.use('/employees',validateToken,EmployeeRouter);

module.exports =router;
