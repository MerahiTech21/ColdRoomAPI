const db = require("../config//database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Employee = db.employee;

const create = async (req, res) => {
  let userInfo = {
    fName: req.body.fName,
    lName: req.body.lName,
    phoneNumber: req.body.phoneNumber,
    sex: req.body.sex,
    email: req.body.email,
    role: "employee",
  };

  try {
    // check if user already exist
    // Validate if user exist in our database
    const oldEmployee = await Employee.findOne({
      where: { email: userInfo.email },
    });

    if (oldEmployee) {
      return res.status(409).json("User Already Exist. Please Login");
    }

    let accountId = createAccount(req);

    if (accountId) {
      userInfo.accountId = accountId;
      let user = await User.create(userInfo);
      res.status(200).json(user);
      console.log("user", JSON.stringify(user));
    }
  } catch (err) {
    console.log("error while creating user" + err);
    return;
  }
};

const createAccount = async (req) => {
  //Encrypt user password
  let encryptedPassword = await bcrypt.hash(req.lName + "1234", 10);

  try {
    account = await Account.create({
      email: req.email,
      password: encryptedPassword,
      type: "employee",
    });

    return account.id;
  } catch (err) {}
};
const getALl = async (req, res) => {
  try {
    let users = await User.findAll({ attributes: { exclude: ["password"] } });
    res.status(200).send(users);
    console.log(users);
  } catch (err) {
    console.log(err);
  }
};

const getOne = async (req, res) => {
  let id = req.params.id;
  let user = await User.findOne({ where: { id: id } });
  res.status(200).send(user);
  console.log(user);
};

//update user

const update = async (req, res) => {
  let id = req.params.id;
  let user = await User.update(req.body, { where: { id: id } });
  if (user) {
    res.status(200).send(await User.findOne({ where: { id: id } }));
  }
  console.log(user);
};

//delete user

const destroy = async (req, res) => {
  let id = req.params.id;
  await User.destroy({ where: { id: id } });
  res.status(200).send("deleted successfully");
  console.log("deleted");
};

module.exports = {
  create,
  getAll,
  getOne,
  update,
  destroy,
};
