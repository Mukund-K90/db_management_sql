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
                req.flash('success', 'User added successfully!');
                res.redirect('/dashboard');
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
        // Get the search query if provided
        const srchValue = req.query.name;

        // Set up the query to fetch all users by default
        let query = "SELECT * FROM umsData";
        let queryParams = [];

        // If there's a search value, filter users by name
        if (srchValue) {
            query += " WHERE name LIKE ?";
            queryParams.push('%' + srchValue + '%');
        }

        // Get a database connection
        pool.getConnection((err, connection) => {
            if (err) throw err;

            // Query the database
            connection.query(query, queryParams, (err, rows) => {
                connection.release();

                if (err) {
                    return res.status(500).json({
                        message: "DATABASE QUERY ERROR",
                        status: 500
                    });
                }

                if (!rows || rows.length === 0) {
                    return res.status(401).json({
                        message: "USERS NOT FOUND",
                        status: 401
                    });
                }

                // Format the user data
                const formattedUsers = rows.map(row => ({
                    id: row.id,
                    name: row.name,
                    email: row.email,
                    mobile: row.mobile,
                    gender: row.gender
                }));

                // Return the response with the data
                return res.status(200).json({
                    message: "Users fetched successfully",
                    status: 200,
                    totalUsers: rows.length,
                    data: formattedUsers
                });
            });
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error.message,
            status: 500
        });
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
                        req.flash('error', 'User update failed!');
                        return res.redirect('/dashboard');
                        // return res.status(500).json({
                        //     message: "DATABASE QUERY ERROR",
                        //     status: 500
                        // })
                    }
                    req.flash('success', 'User updated successfully!');
                    return res.redirect('/dashboard');
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
                    req.flash('error', 'User Deleted successfully!');

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


//serch by value

// exports.searchUser = async (req, res) => {
//     try {
//         const srchValue = req.query.name;
//         console.log(srchValue);
        
//         pool.getConnection((err, connection) => {
//             if (err) throw err;
//             connection.query("SELECT * FROM umsData WHERE name LIKE ?", ['%' + srchValue + '%'], (err, row) => {
//                 connection.release();
//                 if (err) {
//                     return res.status(500).json({
//                         message: "DATABASE QUERY ERROR",
//                         status: 500
//                     });
//                 }
//                 return res.status(200).json(row);
//             })
//         })
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             message: "Internal server error",
//             status: 500
//         });
//     }
// }


