const express=require('express')
const Router=express.Router()
const productRouter  = require('../../controllers/wholesaler/product')



Router.get('/',productRouter.getProduct);
Router.get('/:id',productRouter.getProductDetail)

module.exports = Router