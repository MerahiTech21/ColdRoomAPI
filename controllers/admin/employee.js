const {db} = require("../../config/database");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");

const Employee = db.employee;

const create = async (req, res) => {
  //decrease  
  var userInfo = {
    fName: req.body.fName,
    lName: req.body.lName,
    phoneNumber:req.body.phoneNumber,
    // sex: req.body.sex,
    email: req.body.email,
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
    let employees = await Employee.findAll({
      where:{role:{[Op.ne]:'admin'}},
      attributes: { exclude: ["password"] },
    include:[
      {
       model:db.coldRoom,
        attributes:['id','name']
      }
    ]
  });
    res.status(200).json(employees);
    console.log(employees);
  } catch (err) {
    console.log(err);
  }
};

const getOne = async (req, res) => {
  let id = req.params.id;
  let employee = await Employee.findOne({ where: { id: id } ,
    include:[
      {
       model:db.coldRoom,
        attributes:['id','name']
      }
    ]

  });
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
    res.status(200).send(await Employee.findOne({ where: { id: id } ,
      include:[
        {
         model:db.coldRoom,
          attributes:['id','name']
        }
      ]
    }));
  }
  console.log(employee);
};

//delete user

const updateStatus = async (req, res) => {
  let id = req.params.id; 
  const employee =await Employee.findByPk(id); 
  employee.status=req.body.status
  employee.save()

  res.status(200).json(employee);
  console.log("status updated");
};

module.exports = {
  create,
  getAll,
  getOne,
  update,
  updateStatus,
};
