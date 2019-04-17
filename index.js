const express = require('express')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())



// dependencies

const {User, Blog, Tag} =  require('./sequelize')

app.post('/api/users', (req, res) => {
    User.create(req.body)
        .then(user => res.json(user))
})

app.get('/api/users', (req, res) => {
    User.findAll().then(users => res.json(users))
})

app.get('/api/blogs', (req, res) => {
    const body = req.body

    const tags = body.tag.map(tag => Tag.findOrCreate({ where: {name: tag.name}, defaults: {name: tag.name}}).spread((tag, created) => tag))


    User.findById(body.userId)
        .then(() => Blog.create(body))
        .then(blog => Promisse.all(tags).then(storedTag)).then(() => blog)
        .then(blog => Blog.findOne({ where: {id: blog.id}, include: [User, Tag]}))
        .then(bloWithAssociations => res.json(bloWithAssociations))
        .catch(err => res.status(400).json({err: `User with id = [${body.userId}] does not exist.`}))


})

app.get('/api/blogs/:userId?', (req, res) => {
    let query
    if(req.param.userId) {
        query = Blog.findAll({ include: [
            {model: User, where : {id: req.params.userId} },
            {model: Tag }
        ]})
    } else {
        query = Blog.findAll({include: [Tag, User]})
    }

    return query.then(blogs => res.json(blogs))
})

app.get('/api/blogs/:tag/tag', (req, res) => {
    Blog.findAll({
        include: [
            { model: Tag, where: {name: req.params.tag}}
        ]
    })
    .then(blogs => res.json(blogs))
})


// API ENDPOINTS
const port = 3000
app.listen(port, () => {
    console.log(`Running on http://localhost:${port}`)
})