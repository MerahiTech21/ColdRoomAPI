const jwt=require('jsonwebtoken')
ValidateToken=(req,res,next)=>{
    const authHeader=req.headers['authorization']
    // const token1=req.get('Authorization').split(' ')[1] //use try catch or if if no error with split
    if(!authHeader){
        res.status(401).json('UN Authorized')
    }
   const token=authHeader.split(' ')[1];
    if(token == null){
        res.status(400).json('Invalide Token')
    }
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,decoded)=>{
        if(err){
           return res.status(401).json('UN Authorized')
        } 
        req.user=decoded
        next()
    })
    
} 
module.exports=ValidateToken