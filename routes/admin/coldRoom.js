const  ColdRommController=require('../../controllers/admin/coldRoom.js');
 const router=require('express').Router();

 router.post('/',ColdRommController.create);


 module.exports = router;
