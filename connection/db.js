// import postgress pool
const { Pool } = require('pg')

// setup connection pool
const dbPool = new Pool({
    database: 'personal-web-pagi',
    port: 5432,
    user: 'postgres',
    password: 'root' // based on your password config on postgre
})

// export db pool to be used for query
module.exports = dbPool
