// Pemanggilan package express
const express = require('express')

// Penggunaan package express
const app = express()

// Membuat endpoint
app.get('/', function (req, res) {
    res.send("Hello World")
})

// Konfigurasi port application
const port = 5000
// app.listen(port, function () {
//     console.log(`server running on PORT ${port}`);
// })

app.listen(port, () => {
    console.log(`server running on PORT ${port}`);
})
