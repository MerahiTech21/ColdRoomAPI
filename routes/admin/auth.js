var express = require('express');
var router = express.Router();
const {Login,Logout, myAccount, changePassword}=require('../../controllers/auth/employee');
const ValidateToken = require('../../middelware/validation/validate-token');

router.post('/login',  Login);
router.post('/logout',ValidateToken,  Logout);
router.get('/my-account',ValidateToken,  myAccount);
router.put('/change-password/:id',ValidateToken,  changePassword);

module.exports=router