var express = require('express');
const { getFarmers } = require('../../controllers/local-admin/farmer');
var router = express.Router();

router.get('/',getFarmers)
module.exports=router