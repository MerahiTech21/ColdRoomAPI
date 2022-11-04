module.exports=(sequelize,DataTypes)=>{
    const OrderLog=sequelize.define('orderLog',{
        changedFrom:{
            type:DataTypes.STRING,
        },
        changedTo:{
        
            type:DataTypes.STRING,
        },
        changedBy:{
            type:DataTypes.STRING,
        },

    
});
return OrderLog;
}