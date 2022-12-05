const express=require('express')
const { getFarmerRent } = require('../../controllers/local-admin/farmer-rent_dep')
const Router=express.Router()

Router.get('/:id',getFarmerRent)


module.exports = Router