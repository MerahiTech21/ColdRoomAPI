const {db}=require('../../config/database');
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken');
const Employee = db.employee;
const Account = db.account;
require('dotenv').config()

const Login=async (req,res)=>{
  let email=req.body.email;
  let password=req.body.password;

  try{
  const employee=await Employee.findOne({where:{email}});
    if(!employee){
      throw new Error('User Not Found !')
    }
    //decrept password and compare
    const valide=await bcrypt.compare(password,employee.password)
  //  res.json(valide);
     if(! valide ){
        res.status(401).json(" or Password Incorrect!")
    }

    const token= jwt.sign({id:employee.id,email},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'2h'})
    res.status(200).json({id:employee.id,email:employee.email,token:token})

  }catch(err){
    res.json(err) 
    console.log('eror ',err)
  }
}

const Logout=(req,res)=>{
    
}

module.exports={Login,Logout}