const {db}=require('../../config/database');
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken');
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
      const token= jwt.sign({id:employee.id,email},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'2h'})
    
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

module.exports={Login,Logout,myAccount}