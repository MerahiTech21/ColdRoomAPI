const express=require('express')
const Router=express.Router()
const  OrderRoute  = require('../../controllers/wholesaler/order')

Router.post('/',OrderRoute.placeOrder);
Router.get('/OrderHistory/:id',OrderRoute.orderHistory);


module.exports = Router