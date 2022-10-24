module.exports=(sequelize,DataTypes)=>{
    const employee=sequelize.define('employee',{
        fName:{
            type:DataTypes.STRING,
            allowNull:false

        },
        lName:{
            type:DataTypes.STRING,
            allowNull:false

        },
        phoneNumber:{
            type:DataTypes.STRING,
            allowNull:false,
            unique:true,

        },
        email:{
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
            allowNull:false,

        },
        password:{
            type:DataTypes.STRING,
           allowNull:false,

        }

    });
    return employee;

}