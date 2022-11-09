const  FarmerController=require('../../controllers/admin/farmer');
const router=require('express').Router();

 router.get('/',FarmerController.getfarmer);


 module.exports = router;