
module.exports =(sequelize,Datatypes)=>{
    const product= sequelize.define('product',{
         name:{
           type:Datatypes.STRING,
           allowNull:false
         },
         imageUrl:{
            type:Datatypes.STRING,
            allowNull:false
         }
    });
    return product;
}