const {db} = require("../../config/database");
const bcrypt = require("bcrypt");

const Employee = db.employee;

const create = async (req, res) => {
  var userInfo = {
    fName: req.body.fName,
    lName: req.body.lName,
    phoneNumber: req.body.phoneNumber,
    sex: req.body.sex,
    email: req.body.email,
    sex: req.body.sex,
    role: req.body.role,
  };

  try {
    // Validate if user exist in our database
    const oldEmployee = await Employee.findOne({
      where: { email: userInfo.email },
    });

    const oldEmployeePhone = await Employee.findOne({
        where: { phoneNumber: userInfo.phoneNumber },
      });
  
    if (oldEmployee || oldEmployeePhone) {
      return res.status(409).json("User Already Exist. Please Login");
    }
   let password=`${userInfo.lName}1234`;
   password=password.trim()
   //res.json(password)
    let encryptedPassword = await bcrypt.hash(password, 10);

    // let accountId =await createAccount(userInfo.email,userInfo.lName);

  
      userInfo.password = encryptedPassword;
         // res.json(userInfo.encryptedPassword)

      let employee = await Employee.create(userInfo)
     // const {password,...others}=employee
      res.status(200).json(employee);
      console.log("employee", JSON.stringify(employee));
    
  } catch (err) {
    console.log("error while creating employee" + err);
    return;
  }
};


const getAll = async (req, res) => {
  try {
    let employees = await Employee.findAll({ attributes: { exclude: ["password"] } });
    res.status(200).json(employees);
    console.log(employees);
  } catch (err) {
    console.log(err);
  }
};

const getOne = async (req, res) => {
  let id = req.params.id;
  let employee = await Employee.findOne({ where: { id: id } });
  if(! employee){
    res.status(404).json('Employee Not FOund')
  }
  res.status(200).json(employee);
  console.log(employee);
};

//update user

const update = async (req, res) => {
  let id = req.params.id;
  let employee = await Employee.update(req.body, { where: { id: id } });
  if (employee) {
    res.status(200).send(await Employee.findOne({ where: { id: id } }));
  }
  console.log(employee);
};

//delete user

const destroy = async (req, res) => {
  let id = req.params.id;
  await Employee.destroy({ where: { id: id } });
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
