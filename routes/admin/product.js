const  ProductController=require('../../controllers/admin/product.js');
const router=require('express').Router();

 router.post('/',ProductController.upload,ProductController.create);


 module.exports = router;

