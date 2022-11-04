const express=require('express')
const Router=express.Router()
const { placeOrder } = require('../../controllers/wholesaler/order')

Router.post('/',placeOrder)

module.exports = Router