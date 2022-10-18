
module.exports=(sequelize,DataTypes)=>{
    const coldRoomProduct= sequelize.define(
        "coldRoomProduct",
        {
        //  coldRoomId:{
        //      type:DataTypes.INTEGER,
        //      references:{
        //          model:'coldRooms',
        //          key:'id',
        //          allowNull:false,
        //      },

        //  },
        //  productTypeId:{
        //      type:DataTypes.INTEGER,
        //      references:{
        //          model:'productTypes',
        //          key:'id',
        //          allowNull:false,


        // //      }
        //     },
         price:{
                type:DataTypes.DOUBLE,
            },

         
         
        }
    );
    return coldRoomProduct;


}