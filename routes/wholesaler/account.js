const Router=require('express').Router()
const WholeSalerController=require('../../controllers/wholesaler/account')
Router.post('/',WholeSalerController.create);
Router.get('/:id',WholeSalerController.getAccount);
Router.put('/:id',WholeSalerController.update);
Router.get('/profile/:id',WholeSalerController.getWholeSaler);
Router.get('/email',WholeSalerController.emailSend);
Router.post('/resetPassword/:id', WholeSalerController.resetForgotPassword);
Router.post('/verifyToken/:phoneNumber', WholeSalerController.verifyToken);
Router.get('/forgotPassword/:phoneNumber', WholeSalerController.forgotPassword);



module.exports=Router