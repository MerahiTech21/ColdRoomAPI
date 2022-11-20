module.exports=(sequelize,DataTypes)=>{
    const employee=sequelize.define('employee',{
        id:{
            type:DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull:false,

        },
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

        },
        tokens:[{
            token:{
                type:String,
                required: true
            }
        }],

    });
    return employee;

}