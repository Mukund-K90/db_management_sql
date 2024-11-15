const { pool } = require('../config/db');


// //insert User
exports.insert = async (req, res) => {
    try {
        const params = req.body;
        pool.getConnection((err, connection) => {
            if (err) throw err;
            connection.query('INSERT INTO umsData SET ?', params, (err, row) => {
                connection.release();
                if (err) {
                    return res.status(500).json({
                        message: "DATABASE QUERY ERROR",
                        status: 500
                    })

                }
                res.redirect('/');
            });
        });
    } catch (error) {
        return res.status(500).json({
            message: "SOMETHING WENT WRONG",
            status: 500
        })
    }
}

//user List
exports.viewData = async (req, res) => {
    try {
        /* -- Connect to DB -- */
        pool.getConnection((err, connection) => {
            if (err) throw err; //not connected!

            // user the connection
            connection.query(
                "SELECT * FROM umsData",
                (err, rows) => {
                    connection.release();

                    if (err) {
                        return res.status(500).json({
                            message: "DATABASE QUERY ERROR",
                            status: 500
                        })

                    }
                    if (!rows || rows.length == 0) {
                        return res.status(401).json({
                            message: "USERS NOT FOUND",
                            status: 401
                        })
                    }
                    const formatdUser = rows.map(row => ({
                        id: row.id,
                        name: row.name,
                        email: row.email,
                        mobile: row.mobile,
                        gender: row.gender
                    }));

                    return res.status(200).json({
                        message: "GET ALL USERS LIST SHOW SUCCESSFULLY",
                        status: 200,
                        totalUser: rows.length,
                        data: formatdUser
                    })
                }
            );
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            status: 500
        })
    }
};

//view User
exports.viewUser = async (req, res) => {
    try {
        pool.getConnection((err, connection) => {
            if (err) throw err;

            connection.query(
                "SELECT * FROM umsData WHERE id = ?", [req.params.id], (err, row) => {
                    connection.release();
                    if (err) {
                        return res.status(500).json({
                            message: "DATABASE QUERY ERROR",
                            status: 500
                        })
                    }
                    return res.status(200).json({
                        message: "GET USER DETAILS SHOW SUCCESSFULLY",
                        status: 200,
                        data: row[0]
                    });
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

//update user
exports.updateUser = async (req, res) => {
    try {
        const params = req.body;
        pool.getConnection((err, connection) => {
            if (err) throw err;
            connection.query(
                "UPDATE umsData SET ? WHERE id = ?", [params, req.params.id], (err, row) => {
                    connection.release();
                    if (err) {
                        return res.status(500).json({
                            message: "DATABASE QUERY ERROR",
                            status: 500
                        })
                    }
                    res.redirect('/');
                }
            )
        })

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: error.message,
            status: 500
        })
    }
}

//delete user
exports.deleteUser = async (req, res) => {
    try {
        pool.getConnection((err, connection) => {
            if (err) throw err;
            connection.query(
                "DELETE FROM umsData WHERE id = ?", [req.params.id], (err, row) => {
                    connection.release();
                    if (err) {
                        return res.status(500).json({
                            message: "DATABASE QUERY ERROR",
                            status: 500
                        });
                    }
                    return res.status(200).json({
                        message: "User deleted successfully",
                        status: 200
                    });
                }
            );
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            status: 500
        });
    }
};


