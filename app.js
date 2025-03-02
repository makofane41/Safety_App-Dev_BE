
const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql');
const Connection = require('mysql/lib/Connection');

const app = express()
const port = process.env.PORT || 5001

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//mySql connection 
const pool = mysql.createPool({
    connectionLimit   :10,
    host              : 'localhost',
    user              : 'root',
    password          : '',
    database          : 'GBV'

})
//get all reported incident

app.get('/viewreport/', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log('connected as id ' + connection.threadId)
        connection.query('SELECT * from Incident', (err, rows) => {
            connection.release() // return the connection to pool

            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }

            // optional
            console.log('The data from reported incident table are: \n', rows)
        })
    })
})

//report an incident

app.post('/reportincident/', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        
        const params = req.body
        connection.query('INSERT INTO Incident SET ?', params, (err, rows) => {
        connection.release() // return the connection to pool
        if (!err) {
            res.send(`Successfully reported incident type` + params.name)
        } else {
            console.log(err)
        }
        
        //optional
        console.log('Rported Incident:11 \n', rows)

        })
    })
});




//listing port
app.listen(port,()=> console.log('listen on port '+ port))