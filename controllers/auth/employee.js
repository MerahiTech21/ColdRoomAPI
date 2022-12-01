const {db}=require('../../config/database');
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken');
const employee = require('../../models/employee');
const Employee = db.employee;
const ColdRoom = db.coldRoom;

require('dotenv').config()

const Login=async (req,res)=>{
  let email=req.body.email;
  let password=req.body.password;

  try{
  const employee=await Employee.findOne({where:{email}});
    if(!employee){
      throw  'No Such Account Exist !'
    }
    //decrept password and compare
    const valide=await bcrypt.compare(password,employee.password)
  //  res.json(valide);
     if(! valide ){
        res.status(401).json("Email or Password Incorrect!")
    }
    if(employee.role === 'admin'){
      const token= jwt.sign({id:employee.id,email},process.env.ACCESS_TOKEN_SECRET)
    
      res.status(200).json({id:employee.id,email:employee.email,token:token})
    }else{
      const coldRoom=await ColdRoom.findOne({where:{employeeId:employee.id}})
      if(coldRoom){
         
      const token= jwt.sign({id:employee.id,email,coldRoomId:employee.coldRoomId},process.env.ACCESS_TOKEN_SECRET)
      // employee.tokens=employee.tokens.concat({token})
      //  await employee.save();

      res.status(200).json({id:employee.id,email:employee.email,token:token})
      }else{
        res.status(403).json("Un Authorized!")

      } 
  
    }
  

  }catch(err){
    res.status(403).json("Error "+err) 
    console.log('eror ',err)
  }
}

const myAccount=async(req,res)=>{
  try{
    console.log('user',req.user)
  const employee=await db.employee.findByPk(req.user.id,{
    attributes:{exclude:['password']}
  });
  res.json(employee)
  }catch(error){
       res.status(400).json('Error '+error)
  }

}

const LocalAdminMyAccount=async(req,res)=>{
  try{
    console.log('user',req.user)
  const employee=await db.employee.findByPk(req.user.id,{
    attributes:{exclude:['password']},
    include:[{
     model:ColdRoom
    }]
  });
  res.json(employee)
  }catch(error){
       res.status(400).json('Error '+error)
  }

}
const Logout=async(req,res)=>{
  // const authHeader = req.headers["authorization"];
  // const token=authHeader.split(' ')[1];
  // jwt.sign(token, " ", { expiresIn: "1s" } , (logout, err) => {
  // if (logout) {
  // res.send({msg : 'You have been Logged Out '+logout });
  // } else {
  // res.send({msg:'Error'});
  // }
  // });
  try {

    const user=await db.employee.findByPk(req.user.id);
   // res.json(user.tokens)

    user.tokens = user.tokens.filter((token) =>{
     return token.token !== req.token 
    })
    await user.save()
    // res.json()
} catch (error) {
    res.status(500).json("Erro "+error)
}
} 

const changePassword=async(req,res)=>{

  let newPassword=req.body.newPassword;
  let oldPassword=req.body.oldPassword;

  try{
    
    const employee=await Employee.findByPk(req.params.id)

    if(!employee){
      res.status(401).json("No Such Account Exist")
      return
    }
    //decrept password and compare
    const valide=await bcrypt.compare(oldPassword,employee.password)
  //  res.json(valide);
     if(! valide ){
        res.status(401).json("Old Password Incorrect!")
        return
    }
    let encryptedPassword = await bcrypt.hash(newPassword, 10);
    employee.password=encryptedPassword
    await employee.save()
    res.status(200).json("Successfully Changed") 


  }catch(err){
    res.status(401).json("Internal Server Error") 
    console.log('eror ',err)
  }
  


}
 const forgotPassword = async (req, res, next) => {
  try {
    const email = req.body.email;
    const user = await Employee.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ msg: `User not found with email=${email}` });
    }
    const token = Math.floor(100000 + Math.random() * 900000);
    Employee.resetToken = token;
    await Employee.save();

    await sendEmail(user.email, "Password Reset", `${token}`);
    // await sendSMS('+251975752668',"Here we go")
    res.status(200).send(`We have sent email to ${user.email}`);
  } catch (e) {
    res.status(400).send(e.toString());
  }

};

const verifyToken = async (req, res, next) => {
  const { tokenCode, email } = req.body;
  const user = await Employee.findOne({ where: { email } });
  if (!user) {
    return res.status(404).json({ msg: `User not found with email=${email}` });
  }
  //it should be compared by jwt
  if (!tokenCode === Employee.resetToken) {
    return res.status(400).json({ msg: 'invalid or expired token' })
  }
   user.resetToken='';
  await user.save();
  const token = jwt.sign({ ...user.dataValues }, process.env.Access_TOKEN_SECURE);
  res.status(200).json({ token, name: user.name, email: user.email, phoneNo: user.phoneNo })
  // let it loign 
};


const resetForgotPassword = async (req, res, next) => {
  try{
    const { newPassword } = req.body;
  const user = await Employee.findByPk(req.user.id);
  if(!user) return res.status(404).json({msg:"faild", user: req.user});
  bcrypt.hash(newPassword, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({ error: err.toString() })
    } else {
      user.password = hash;
      user.save().then((user) => {
        return res.status(200).json({ msg:"Password is changed successfully"});
      });

    }
  })
  }catch(e){
   res.status(400).json({error:e})
  }

};




module.exports={Login,Logout,myAccount,LocalAdminMyAccount,changePassword,forgotPassword,resetForgotPassword,verifyToken};
