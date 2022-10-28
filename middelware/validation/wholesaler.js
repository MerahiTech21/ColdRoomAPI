const { check, validationResult } = require("express-validator");
const { db } = require("../../config/database");

exports.ValidateWholeSalerRegistration = [
  check("fName")
    .notEmpty()
    .withMessage("First Name Required")
    .isLength({ min: 3, max: 15 })
    .withMessage("First Name Length min 3, max 10"),
  check("lName")
    .notEmpty()
    .withMessage("Last Name Required")
    .isLength({ min: 3, max: 15 })
    .withMessage("Last Name Length min 3, max 10"),
  check("phoneNumber").notEmpty().withMessage("Phone Number Required"),
  check("password")
    .notEmpty()
    .withMessage("Password Required")
    .isLength({ min: 3, max: 15 })
    .withMessage("Password Length Length min 3, max 10"),
];

exports.ValidationResult = (req, res, next) => {
  let result = validationResult(req).array();

  if (!result.length) return next();

  const n = result.map((one) => {
    return one.msg;
  });
  let error = result[0].msg;
  res.json({ succes: false, message: n });
};
