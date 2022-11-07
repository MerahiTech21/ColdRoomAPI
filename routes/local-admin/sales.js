const express=require('express')
const { getSales } = require('../../controllers/local-admin/sales')
const Router=express.Router()

Router.get('/',getSales)


module.exports = Router