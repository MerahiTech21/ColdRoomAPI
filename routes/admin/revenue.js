const express=require('express')
const { getRevenue } = require('../../controllers/admin/revenue')
const Router=express.Router()

Router.get('/',getRevenue)


module.exports = Router