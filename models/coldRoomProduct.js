
module.exports=(sequelize,DataTypes)=>{
    const coldRoomProduct= sequelize.define(
        "coldRoomProduct",
        {
         
         coldRoomId:{
             type:DataTypes.INTEGER,
             references:{
                 model:'coldRoom',
                 key:id,
             }

         },
         productTypeId:{
             type:DataTypes.INTEGER,
             references:{
                 model:'productType',
                 key:id,

             },
             price:{
                type:DataTypes.DOUBLE,
            },

         }
         
        }
    );
    return coldRoomProduct;


}