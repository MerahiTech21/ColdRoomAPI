var express = require('express');
var router = express.Router();
const FarmerProductRouter=require('./farmer')

router.use('/',  FarmerProductRouter);

module.exports=router