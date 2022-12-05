var express = require('express');
var router = express.Router();

const FarmerRouter=require('./account')
const AuthRouter=require('./auth')
const farmerHomeRouter=require('./farmer-home')
const farmerProfileRouter=require('./farmer-profile')


//const ValidateToken = require('../../middelware/validation/validate-token');

//router.use('/employees',EmployeeRouter);
router.use('/farmers', FarmerRouter);
router.use('/auth',AuthRouter);
//router.use('/auth/farmer',AuthRouter);
router.use('/farmerHome', farmerHomeRouter);
router.use('/farmerProfile', farmerProfileRouter);



module.exports =router;
