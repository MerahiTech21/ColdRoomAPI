module.exports=(sequelize,DataTypes)=>{
    const OrderPaymentLog=sequelize.define('orderPaymentLog',{
    
        paidAmount:{
        
            type:DataTypes.DOUBLE,
        },
        changedBy:{
            type:DataTypes.STRING,
        },

    
});
return OrderPaymentLog;
}