var express = require('express');
var router = express.Router();
const Dashboard =require('../../controllers/admin/dashboard');

router.use('/data',Dashboard.getData)
router.use('/bar',Dashboard.bargraphData)
router.use('/pie',Dashboard.pichartData)

module.exports=router