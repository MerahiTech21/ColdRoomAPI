var express = require('express');
const { getFarmers,getFarmerProduct, searchFarmer, editFarmer } = require('../../controllers/local-admin/farmer');
const { getFarmerBalance,withdrawBalance } = require('../../controllers/local-admin/farmer-balance')
// const { getFarmerRent } = require('../../controllers/local-admin/farmer-rent_dep')

var router = express.Router();

router.get('/',getFarmers)
router.put('/:id',editFarmer)
router.use('/balances/:id',getFarmerBalance)
router.use('/withdraw/:id',withdrawBalance)
// router.use('/rents/:id',getFarmerRent)
router.get('/products/:id',  getFarmerProduct);
router.get('/search',  searchFarmer);

module.exports=router