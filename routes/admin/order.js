const express=require('express')
const Router=express.Router()
const { getOrder,getOrders, updateOrderStatus, updatePaymentStatus, } = require('../../controllers/admin/order')

Router.get('/',getOrders)
Router.get('/:id',getOrder)
Router.put('/:id',updateOrderStatus)
Router.put('/payment/:id',updatePaymentStatus)

module.exports = Router