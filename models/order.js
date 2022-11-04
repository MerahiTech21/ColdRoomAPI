module.exports=(sequelize,DataTypes)=>{
    const order=sequelize.define('order',{
        orderCode:{
            type:DataTypes.STRING,
            unique:true
        },
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