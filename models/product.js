
module.exports =(sequelize,Datatypes)=>{
    const product= sequelize.define('product',{
         name:{
           type:Datatypes.STRING,
           allowNull:false
         },
         imageUrl:{
            type:Datatypes.STRING,
            allowNull:false,
            get() {
              const rawValue = this.getDataValue('imageUrl')
              return rawValue ? process.env.BASE_URL+'/images/'+rawValue : null;
            }

         }
         
    });
    return product;
}