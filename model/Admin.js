module.exports=(sequelize,DataTypes)=>{
    const admin = sequelize.define("Admin",{
        
       id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
       },

       name:{
        type:DataTypes.STRING,
        allowNull:false
       },

       email:{
        type:DataTypes.STRING,
        allowNull:false,
        
       },

       password:{
        type:DataTypes.STRING,
        allowNull:false
       }
    })
    return admin
}