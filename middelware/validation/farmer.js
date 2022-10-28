const { check, validationResult } = require("express-validator");
const {db} = require("../../config/database");
Farmer=db.farmer
exports.ValidateFarmerRegistration = [
  check("fName")
    .notEmpty()
    .withMessage("First Name Required")
    .isLength({ min: 3, max: 15 }).withMessage('First Name Length min 3, max 10'),
  check("lName")
    .notEmpty()
    .withMessage("Last Name Required")
    .isLength({ min: 3, max: 15 }).withMessage('Last Name Length min 3, max 10'),
  check("phoneNumber")
    .notEmpty()
    .withMessage("Phone Number Required"),
   // .isMobilePhone("et-EE")
    // .withMessage("Invalide Phone Number")
    check("password")
    //.notEmpty()
    //.withMessage("Password Required")
    .isLength({ min: 3, max: 15 }).withMessage('Password Length Length min 3, max 10'),
    check(["address.region","address.kebele","address.woreda"])
    .notEmpty()
    .withMessage("Address Required"),
];

exports.ValidationResult = (req, res, next) => {
  let result = validationResult(req).array();

  if (!result.length) return next();

  const n=result.map((one)=>{
    return one.msg
  })
  let error = result[0].msg;
  res.status(400).json({ succes: false, message: n });
};
