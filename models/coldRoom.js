module.exports=(sequelize,DataTypes)=>{

    const coldRoom=sequelize.define('coldRoom',{

        name:{
            type:DataTypes.STRING,
            allowNull:false,

        },
        longitude:{
            type:DataTypes.DOUBLE,
            allowNull:false,
        },
        latitude:{
            type:DataTypes.DOUBLE,
            allowNull:false,
        },



    });


}