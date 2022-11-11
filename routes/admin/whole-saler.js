var express = require('express');
const { getWholeSalers,getWholeSalerOrders } = require('../../controllers/admin/wholesaler');

var router = express.Router();

router.get('/',getWholeSalers)
router.use('/orders/:id',getWholeSalerOrders)


module.exports=router