const Router=require('express').Router()
const FarmerController=require('../../controllers/farmer/account');
const { ValidateFarmerRegistration, ValidationResult } = require('../../middelware/validation/farmer');
const ValidateToken =require('../../middelware/validation/validate-token')
Router.post('/',ValidateFarmerRegistration,ValidationResult, FarmerController.create);
Router.get('/:id', FarmerController.getAccount);
Router.put('/:id',ValidateToken,FarmerController.update);
Router.get('/restPassword', FarmerController.resetForgotPassword);
Router.post('/verifyToken', FarmerController.verifyToken);
Router.post('/forgotPassword/:phoneNumber', FarmerController.forgotPassword);

module.exports=Router;