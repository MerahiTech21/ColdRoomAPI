const  ColdRoomProductController=require('../../controllers/admin/coldroom-product');
 const router=require('express').Router();

 router.get('/:id',ColdRoomProductController.getColdroomProducts)
 router.get('/product/:id',ColdRoomProductController.getProductDetail)

 module.exports=router