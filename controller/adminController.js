const { render } = require("ejs");
const { pool } = require("../config/db");


//view User
exports.adminLogin = async (req, res) => {
    try {
        pool.getConnection((err, connection) => {
            if (err) throw err;

            connection.query(
                "SELECT * FROM admin WHERE email = ? AND password = ?", [req.body.email, req.body.password], (err, row) => {
                    connection.release();
                    if (err || row.length === 0) {
                        req.flash('error', 'Access denied. Unauthorized user.');
                        return res.redirect('/');
                    }
                    
                    return res.redirect('/dashboard',)
                }
            )
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            status: 500
        })
    }
}