const Router=require('express').Router()
const FarmerController=require('../../controllers/farmer/account');
const { ValidateFarmerRegistration, ValidationResult } = require('../../middelware/validation/farmer');
const ValidateToken =require('../../middelware/validation/validate-token')
Router.post('/',ValidateFarmerRegistration,ValidationResult, FarmerController.create);
Router.get('/:id', FarmerController.getAccount);
Router.put('/:id',ValidateToken,FarmerController.update);
Router.post('/resetPassword/:id', FarmerController.resetForgotPassword);
Router.post('/verifyToken/:phoneNumber', FarmerController.verifyToken);
Router.get('/forgotPassword/:phoneNumber', FarmerController.forgotPassword);

module.exports=Router;