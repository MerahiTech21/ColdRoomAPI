var express = require('express');
var router = express.Router();
const farmerHomeController=require('../../controllers/farmer/farmer-home');

router.get('/:id',  farmerHomeController.getData);
router.get('/farmerProduct/:id',  farmerHomeController.getFarmerProduct);
router.get('/farmerWithDraw/:id',  farmerHomeController.getWithDraw);
router.get('/soldProduct/:id',  farmerHomeController.getSoldProduct);
router.post('/productType/:id',  farmerHomeController.getProductType);



module.exports=router