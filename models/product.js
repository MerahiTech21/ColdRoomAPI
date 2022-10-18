
module.exports =(sequelize,Datatypes)=>{
    const product= sequelize.define('Product',{
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