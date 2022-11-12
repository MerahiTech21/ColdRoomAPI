var express = require('express');
var router = express.Router();
const farmerProfileController=require('../../controllers/farmer/farmer-profile');

router.get('/:id',  farmerProfileController.getProfile);




module.exports=router