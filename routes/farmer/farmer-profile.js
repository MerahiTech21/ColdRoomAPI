var express = require('express');
var router = express.Router();
const farmerProfileController=require('../../controllers/farmer/farmer-profile');

router.get('/:id',  farmerProfileController.getProfile);
router.put('/phoneNumber/:id',  farmerProfileController.changePhoneNumber);
router.put('/password/:id',  farmerProfileController.changePassword);


module.exports=router