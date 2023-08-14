const {Sequelize,DataTypes}=require("sequelize")

const sequelize=new Sequelize({
    dialect:'sqlite',
    storage:'./db.db',
    logging:false
})

try {
    sequelize.authenticate()
    console.log("Database Connected Successfully")
} catch (error) {
    console.log(error)
}

const db={}
db.sequelize=sequelize
db.Sequelize=Sequelize
db.user=require('../User')(sequelize,DataTypes)
db.admin=require('../Admin')(sequelize,DataTypes)


db.sequelize.sync({})

module.exports=db