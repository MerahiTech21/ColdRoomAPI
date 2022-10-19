var express = require('express');
var router = express.Router();
const EmployeeController=require('../../controllers/admin/employee');
router.get('/',  EmployeeController.getAll);
router.get('/:id',  EmployeeController.getOne);
router.post('/',EmployeeController.create);
router.put('/:id',EmployeeController.update);
router.delete('/:id',EmployeeController.destroy);


module.exports = router;
