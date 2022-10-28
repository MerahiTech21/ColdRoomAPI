const Router=require('express').Router()
const FarmerController=require('../../controllers/farmer/account');
const { ValidateFarmerRegistration, ValidationResult } = require('../../middelware/validation/farmer');
const ValidateToken =require('../../middelware/validation/validate-token')
Router.post('/',ValidateFarmerRegistration,ValidationResult, FarmerController.create);
Router.get('/:id',ValidateToken, FarmerController.getAccount);
Router.put('/:id',ValidateToken,FarmerController.update);

module.exports=Router