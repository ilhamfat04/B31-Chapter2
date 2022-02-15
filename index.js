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
    let query = 'SELECT id, title, content, post_at FROM tb_blog'

    db.connect(function (err, client, done) {
        if (err) throw err
        client.query(query, function (err, result) {
            done()

            if (err) throw err
            let data = result.rows

            data = data.map((blog) => {
                return {
                    ...blog,
                    post_at: getFullTime(blog.post_at),
                    post_age: getDistanceTime(blog.post_at),
                    isLogin: isLogin
                }
            })

            res.render('blog', {
                isLogin: isLogin,
                blogs: data
            })
        })
    })
})

app.get('/add-blog', function (req, res) {
    res.render('form-blog')
})

app.post('/blog', function (req, res) {
    // let title = req.body.title
    // let content = req.body.content

    let { title, content } = req.body

    let blog = {
        title: title,
        content,
        image: 'image.png'
    }

    db.connect((err, client, done) => {
        query = `INSERT INTO tb_blog(title, content, image) VALUES
                ('${blog.title}', '${blog.content}','${blog.image}')`

        if (err) throw err

        client.query(query, (err, result) => {
            done()
            if (err) throw err

            res.redirect('/blog')
        })
    })
})

app.get('/blog/:id', function (req, res) {
    let id = req.params.id

    let query = `SELECT * FROM tb_blog WHERE id = ${id} `
    db.connect((err, client, done) => {
        if (err) throw err

        client.query(query, (err, result) => {
            done()
            if (err) throw err

            result = result.rows[0]

            res.render('blog-detail', { blog: result })
        })
    })
})

app.get('/delete-blog/:id', function (req, res) {
    let { id } = req.params

    let query = `DELETE FROM tb_blog WHERE id = ${id} `

    db.connect((err, client, done) => {
        if (err) throw err

        client.query(query, (err, result) => {
            done()
            if (err) throw err

            res.redirect('/blog')
        })
    })
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

function getDistanceTime(time) {
    const distance = new Date() - new Date(time)

    // convert to day
    const miliseconds = 1000
    const secondInMinute = 60
    const minutesInHour = 60
    const secondsInHour = secondInMinute * minutesInHour
    const hoursInDay = 23

    let dayDistance = distance / (miliseconds * secondsInHour * hoursInDay)

    if (dayDistance >= 1) {
        const time = Math.floor(dayDistance) + ' a day ago'
        return time
    } else {
        // Convert to hour
        let hourDistance = Math.floor(distance / (miliseconds * secondsInHour))
        // hourDistance = 0.1
        if (hourDistance > 0) {
            return hourDistance + ' hour ago'
        } else {
            // convert to minute
            const minuteDistance = Math.floor(distance / (miliseconds * secondInMinute))
            return minuteDistance + ' minute ago'
        }
    }

}
