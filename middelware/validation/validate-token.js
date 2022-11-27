const jwt=require('jsonwebtoken');
const { db } = require('../../config/database');

const ValidateToken=async(req,res,next)=>{

    
    try {
 
    const authHeader=req.headers['authorization'] ?req.headers['authorization'] : null
    // const token1=req.get('Authorization').split(' ')[1] //use try catch or if if no error with split
    if(! authHeader || authHeader === null ){
        res.status(401).json('UN Authorized')
    }
   const token=authHeader.split(' ')[1];
    if(token == null){
        res.status(400).json('Invalide Token')
    }
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,async (err,decoded)=>{
        if(err){
           return res.status(401).json('UN Authorized')
        } 
        

        //const user  = await db.employee.findOne({ id:decoded.id})

        // if(!user){
        //     throw ('User Not Found')
        // }
        req.user=decoded
        req.token=token
        next()
    })
   
} catch (error) {
    
     res.status(404).json("Error "+error)
} 
}
module.exports=ValidateToken