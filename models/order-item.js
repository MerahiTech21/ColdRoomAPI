module.exports=(sequelize,DataTypes)=>{
    const OrderItem=sequelize.define('orderItem',{
        id:{
            type:DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull:false,

        },
        quantity:{
            type:DataTypes.STRING,
        },
    
        price:{
            type:DataTypes.DOUBLE,
        },
    
});
return OrderItem;
}