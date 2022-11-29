module.exports=(sequelize,DataTypes)=>{
    const account=sequelize.define('account',{
        email:{
            type:DataTypes.STRING,
        },
        password:{
            type:DataTypes.STRING,
        },
        type:{
            type:DataTypes.STRING,

        }

    }
       
 
    )
    return account;

};