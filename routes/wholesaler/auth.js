var express = require('express');
var router = express.Router();
const {Login, changePassword}=require('../../controllers/auth/wholesaler');
const ValidateToken = require('../../middelware/validation/validate-token');

router.post('/login',  Login);
router.post('/change-password/:id', changePassword);
module.exports=router      