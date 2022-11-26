const Router=require('express').Router()
const WholeSalerController=require('../../controllers/wholesaler/account')
Router.post('/',WholeSalerController.create);
Router.get('/:id',WholeSalerController.getAccount);
Router.put('/:id',WholeSalerController.update);
Router.get('/profile/:id',WholeSalerController.getWholeSaler);


module.exports=Router