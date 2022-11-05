const  ColdRommController=require('../../controllers/admin/coldRoom.js');
 const router=require('express').Router();

 router.post('/',ColdRommController.create);
 router.put('/:id',ColdRommController.update);



 module.exports = router;
