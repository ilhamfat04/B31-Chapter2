// Pemanggilan package express
const express = require('express')

// import db connection
const db = require('./connection/db')

// Penggunaan package express
const app = express()

// set up template engine
app.set('view engine', 'hbs')

app.use('/public', express.static(__dirname + '/public'))
app.use(express.urlencoded({ extended: false }))

const isLogin = true

const blogs = [
    {
        title: "Pasar Coding di Indonesia Dinilai Masih Menjanjikan",
        content: "Ketimpangan sumber daya manusia (SDM) di sektor digital masih menjadi isu yang belum terpecahkan. Berdasarkan penelitian ManpowerGroup, ketimpangan SDM global, termasuk Indonesia, meningkat dua kali lipat dalam satu dekade terakhir",
        author: "Ichsan Emrald Alamsyah",
        posted_at: '12 Jul 2021 22:30 WIB'
    }
]

const month = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'Desember'
]

// Membuat endpoint
app.get('/', function (req, res) {
    res.render('index')
})

app.get('/home', function (req, res) {
    res.render('index')
})

app.get('/blog', function (req, res) {

    let query = 'SELECT * FROM tb_blog'

    db.connect(function (err, client, done) {
        if (err) throw err

        client.query(query, function (err, result) {
            done()

            if (err) throw err

            let data = result.rows

            console.log(data);
        })
    })

    let dataBlogs = blogs.map(function (data) {
        return {
            ...data,
            isLogin: isLogin
        }
    })

    res.render('blog', {
        isLogin: isLogin,
        blogs: dataBlogs
    })
})

app.get('/add-blog', function (req, res) {
    res.render('form-blog')
})

app.post('/blog', function (req, res) {
    let title = req.body.title
    let content = req.body.content

    let blog = {
        title: title,
        content,
        author: 'Ichsan Emrald Alamsyah',
        posted_at: getFullTime(new Date())
    }

    blogs.push(blog)

    res.redirect('/blog')
})

app.get('/blog/:id', function (req, res) {
    let id = req.params.id
    console.log(`Id postingan : ${id}`);

    res.render('blog-detail', { id: id })
})

app.get('/delete-blog/:index', function (req, res) {
    let index = req.params.index

    console.log(`Index deleted : ${index} `)

    blogs.splice(index, 1)
    res.redirect('/blog')
})

// app.get('/update-blog', function(req,res){
//     res.render('update-blog')
// })

// app.post('/update/:id', function(req, res){
//     map
// })


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

function getFullTime(time) {

    const date = time.getDate()
    const monthIndex = time.getMonth()
    const year = time.getFullYear()

    let hours = time.getHours()
    let minutes = time.getMinutes()

    if (hours < 10) {
        hours = `0${hours}`
    }

    if (minutes < 10) {
        minutes = `0${minutes}`
    }

    return `${date} ${month[monthIndex]} ${year} ${hours}:${minutes} WIB`
}
