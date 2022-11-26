
const  AddressController=require('../../controllers/admin/address');
 const router=require('express').Router();

 router.get('/',AddressController.findAll);


 module.exports = router; 