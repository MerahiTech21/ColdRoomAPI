const express=require('express')
const { getFarmerBalance } = require('../../controllers/local-admin/farmer-balance')
const Router=express.Router()

Router.get('/:id',getFarmerBalance)


module.exports = Router