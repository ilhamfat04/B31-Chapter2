// Pemanggilan package express
const express = require('express')

// Penggunaan package express
const app = express()

// set up template engine
app.set('view engine', 'hbs')

app.use('/public', express.static(__dirname + '/public'))
app.use(express.urlencoded({ extended: false }))

const isLogin = true

// Membuat endpoint
app.get('/', function (req, res) {
    res.send("Hello World")
})

app.get('/home', function (req, res) {
    res.render('index')
})

app.get('/blog', function (req, res) {
    res.render('blog', { isLogin: isLogin })
})

app.get('/add-blog', function (req, res) {
    res.render('form-blog')
})

app.post('/blog', function (req, res) {
    let title = req.body.title
    let content = req.body.content

    res.send(`<script> alert('title : ${title}, content : ${content}') </script>`)
})

app.get('/blog/:id', function (req, res) {
    let id = req.params.id
    console.log(`Id postingan : ${id}`);

    res.render('blog-detail', { id: id })
})

app.get('/contact-me', function (req, res) {
    res.render('contact')
})

// Konfigurasi port application
const port = 5000
// app.listen(port, function () {
//     console.log(`server running on PORT ${port}`);
// })

app.listen(port, () => {
    console.log(`server running on PORT ${port}`);
})
