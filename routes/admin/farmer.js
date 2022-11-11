const  FarmerController=require('../../controllers/admin/farmer');
const router=require('express').Router();

router.get('/',FarmerController.getFarmers);
router.get('/products/:id',FarmerController.getFarmerProducts);
router.get('/balances/:id',FarmerController.getFarmerBalance);
router.get('/rents/:id',FarmerController.getFarmerRent);
 

 module.exports = router;