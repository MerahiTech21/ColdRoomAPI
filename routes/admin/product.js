const  ProductController=require('../../controllers/admin/product.js');
 const router=require('express').Router();

 router.post('/',ProductController.create,ProductController.upload);


 module.exports = router;

