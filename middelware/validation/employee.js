const { check, validationResult } = require("express-validator");
const {db} = require("../../config/database");
Employee=db.employee
exports.ValidateEmployeeRegistration = [
  check("fName")
    .notEmpty()
    .withMessage("First Name Required")
    .isLength({ min: 3, max: 15 }).withMessage('First Name Length min 3, max 10'),
  check("lName")
    .notEmpty()
    .withMessage("Last Name Required")
    .isLength({ min: 3, max: 15 }).withMessage('Last Name Length min 3, max 10'),
  check("email").normalizeEmail().isEmail().withMessage("Email is Not Valid"),
  check("phoneNumber")
    .notEmpty()
    .withMessage("Phone Number Required")
   // .isMobilePhone("et-EE")
    //.withMessage("Invalide Phone Number")
    .custom((value, { req }) => {
          Employee.findOne({where:{phoneNumber:value}}).then((res)=>{
            if(res) return false
          })
         if (value.startsWith('+',0) && value.length === 11) {
        
       return false;
      }
      return true;
    }).withMessage('Duplicated '),
];

exports.ValidationResult = (req, res, next) => {
  let result = validationResult(req).array();

  if (!result.length) return next();

  const n=result.map((one)=>{
    return one.msg
  })
  let error = result[0].msg;
  res.json({ succes: false, message: n });
};
