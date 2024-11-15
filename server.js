const express = require('express');
const { CONFIG } = require('./config/config');
const app = express();
const path = require('path');
const { pool } = require('./config/db')

//parse body data 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//set ejs as view engine and directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views/pages'));

//Connect Db
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        return;
    }
    console.log('Connected to the database!');
    connection.release(); // Release the connection back to the pool
});

app.get("/", (req, res) => {
    fetch('http://localhost:1000/user/list')
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            res.render('home', { userData: data.data }); // Render the page with fetched data
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
            res.status(500).send('Error fetching data');
        });
});

//define user route
const userRoute = require('./routes/userRoutes');
app.use('/user', userRoute);

//listen server
const PORT = CONFIG.port || 8080;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));