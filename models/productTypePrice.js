module.exports=(sequelize,DataTypes)=>{
    const productTypePrice=sequelize.define("ProductTypePrice",
    {
        // id:{
        //     type:DataTypes.INTEGER,
        //     autoIncrement: true,
        //     primaryKey: true
            
        // },
        
        price:{
            type:DataTypes.DOUBLE,

        },
    },
    {
        uniqueKeys:{
            actions_unique: {
                fields: ['productTypeId', 'coldRoomId']
            }
        }
    }
    

    );
    return productTypePrice;

}