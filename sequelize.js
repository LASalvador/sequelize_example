const Sequelize = require('sequelize')
const UserModel = require('./models/user')
const BlogModel = require('./models/blog')
const TagModel = require('./models/tag')


const sequelize = new Sequelize('teste', 'root','epsoft123', {
    host:  'dev.kanban360.com.br',
    dialect: 'mysql',
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
})

const User = UserModel(sequelize, Sequelize)

const Blogtag = sequelize.define('blog_tag',{})
const Blog = BlogModel(sequelize,Sequelize)
const Tag = TagModel(sequelize,Sequelize)

Blog.belongsToMany(Tag, {through: Blogtag, unique: false})
Tag.belongsToMany(Blog, {through: Blogtag, unique: false})
Blog.belongsTo(User);

sequelize.sync({force: true})
    .then( () => {
        console.log('Database & tables created!!')
    })

module.exports = {
    User,
    Blog,
    Tag
}