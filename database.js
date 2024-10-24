//Connect to database from the terminal

const mysql = require('mysql2')

//create connection to db
const db = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'MM69@milan',
    database: 'telemed'
})

//Connect to database
db.connect( (err) => {
    if(err) {
        console.log ('Error connecting to the database', err)
        return;
    }
    console.log('Successfully connected to the database')
})

//export the connection
module.exports = db