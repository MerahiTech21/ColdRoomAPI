module.exports=(sequelize,DataTypes)=>{
    const order=sequelize.define('order',{
        orderStatus:{
            type:DataTypes.STRING,
        },
        paymentStatus:{
            type:DataTypes.STRING,
        },
        paidAmount:{
            type:DataTypes.DOUBLE
        },
        totalPrice:{
            type:DataTypes.DOUBLE,
        },
    
});
return order;
}