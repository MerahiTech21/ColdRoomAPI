
module.exports =(sequelize,Datatypes)=>{
    return sequelize.define('Product',{
         name:{
           type:Datatypes.STRING,
           allowNull:false
         },
         imageUrl:{
            type:Datatypes.STRING,
            allowNull:false
         }
    })
}