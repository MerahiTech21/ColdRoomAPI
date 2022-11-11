const express=require('express')
const { getSales } = require('../../controllers/admin/sales')
const Router=express.Router()

Router.get('/',getSales)


module.exports = Router