module.exports=(sequelize,DataTypes)=>{
    const employee=sequelize.define('employee',{
        fname:{
            type:DataTypes.STRING,
            allowNull:false

        },
        lname:{
            type:DataTypes.STRING,
            allowNull:false

        },
        phoneNumber:{
            type:DataTypes.STRING,
            allowNull:false,
            unique:true,

        },
        sex:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        role:{
            type:DataTypes.STRING,

        }

    });
    return employee;

}