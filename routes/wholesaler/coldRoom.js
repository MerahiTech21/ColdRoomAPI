const express=require('express')
const Router=express.Router()
const ColdRoomRouter  = require('../../controllers/wholesaler/coldRoom')

Router.get('/',ColdRoomRouter.getColdRoom);

module.exports = Router