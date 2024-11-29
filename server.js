const express = require('express');
const { CONFIG } = require('./config/config');
const app = express();
const path = require('path');
const { pool } = require('./config/db')
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');


//parse body data 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//set cookie-session for flash
app.use(cookieParser('NotSoSecret'));
app.use(session({
    secret: 'something',
    cookie: { maxAge: 60000 },
    resave: true,
    saveUninitialized: true
}));
app.use(flash());

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
    connection.release();
});

app.get("/", (req, res) => {
    return res.render("login", { messages: req.flash() });
});

app.get("/dashboard", (req, res) => {
    const searchQuery = req.query.name || '';  // Get search query from request (default is empty string)

    // Create the search URL, including the query parameter
    const searchUrl = `${CONFIG.baseURL}/user/list?name=${searchQuery}`;

    fetch(searchUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            res.render('home', {
                userData: data.data,
                messages: req.flash(),
                searchQuery: searchQuery  // Pass search query to the view
            });
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
            res.status(500).send('Error fetching data');
        });
});


//define user route
const userRoute = require('./routes/userRoutes');
app.use('/user', userRoute);

//define admin route
const adminRoute = require('./routes/adminRoutes');
app.use('/admin', adminRoute);

//listen server
const PORT = CONFIG.port || 8080;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));