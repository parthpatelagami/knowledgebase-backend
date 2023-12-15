const express = require('express')
const User = require('../models/userModel')
const UserUpdate = require('../models/userModelUpdate')
const { userStatusLoginModel, userStatusLogoutModel } = require('../models/userStatusModel')
const DBConfig = require('../configs/connection')

async function createUser(req, res) {
    try {
        const { user_id, firstName, lastName, email, password, role_id, created_date, created_by } = req.body

        const user = new User(user_id, firstName, lastName, email, password, role_id, created_date, created_by)
        const result = await user.insert()
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: result,
        })
    } catch (error) {
        console.error('Error:', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        })
    }
}

// Retrieve list of users
// async function getUsers(req, res) {
//     try {
//         const { pagination } = req.body
//         const { page_size, page_number } = pagination

//         // Calculate the offset based on page_size and page_number
//         const offset = page_size * page_number

//         const sql = `SELECT u.*, r.role_name, GROUP_CONCAT(tm.team_name) AS team_name, us.login_time as login_time, us.logout_time as logout_time FROM user_mst u
//             LEFT JOIN role_mst r ON u.role_id = r.role_id
//             LEFT JOIN team_details td ON u.user_id = td.user_id
//             LEFT JOIN team_mst tm ON td.team_id = tm.team_id AND tm.isdeleted = 'N'
//             LEFT JOIN user_status us ON us.user_id = u.user_id
//             WHERE u.isdeleted = 'N'
//             GROUP BY u.user_id, u.role_id, r.role_name, us.login_time, us.logout_time
//             LIMIT ${page_size} OFFSET ${offset}`

//         const countSql = "SELECT u.*, r.role_name, GROUP_CONCAT(tm.team_name) AS team_name FROM user_mst u " +
//             "LEFT JOIN role_mst r ON u.role_id = r.role_id " +
//             "LEFT JOIN team_details td ON u.user_id = td.user_id " +
//             "LEFT JOIN team_mst tm ON td.team_id = tm.team_id AND tm.isdeleted = 'N' " +
//             "WHERE u.isdeleted = 'N' " +
//             "GROUP BY u.user_id, u.role_id, r.role_name"

//         // Execute the SQL query to get paginated results
//         DBConfig.query(sql, (err, results) => {
//             if (err) {
//                 console.error('Error:', err)
//                 res.status(500).json({
//                     success: false,
//                     message: 'Oops! Something Went Wrong.',
//                 })
//             } else {
//                 // Execute the SQL query to get the total count
//                 DBConfig.query(countSql, (countErr, countResult) => {
//                     if (countErr) {
//                         console.error('Error:', countErr)
//                         res.status(500).json({
//                             success: false,
//                             message: 'Oops! Something Went Wrong.',
//                         })
//                     } else {

//                         res.status(200).json({
//                             success: true,
//                             message: 'Users Send Successfully',
//                             users: results,
//                             total_users: countResult.length,
//                         })
//                     }
//                 })
//             }
//         })
//     } catch (error) {
//         console.error('Error:', error)
//         res.status(500).json({
//             success: false,
//             message: 'Internal server error',
//         })
//     }
// }

async function getUsers(req, res) {
    try {
        const { } = req.body

        const sql = `SELECT u.*, r.role_name, GROUP_CONCAT(tm.team_name) AS team_name, GROUP_CONCAT(us.login_time) as login_time, GROUP_CONCAT(us.logout_time) as logout_time FROM user_mst u
                     LEFT JOIN role_mst r ON u.role_id = r.role_id
                     LEFT JOIN team_details td ON u.user_id = td.user_id
                     LEFT JOIN team_mst tm ON td.team_id = tm.team_id AND tm.isdeleted = 'N'
                     LEFT JOIN user_status us ON us.user_id = u.user_id
                     WHERE u.isdeleted = 'N'
                     GROUP BY u.user_id, u.role_id, r.role_name`

        // Execute the SQL query
        DBConfig.query(sql, (err, results) => {
            console.log(results)

            if (err) {
                console.error('Error:', err)
                res.status(500).json({
                    success: false,
                    message: 'Oops! Something Went Wrong.',
                })
            } else {
                res.status(200).json({
                    success: true,
                    message: 'Users Send Successfully',
                    users: results
                })
            }
        })
    } catch (error) {
        console.error('Error:', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        })
    }
}



// Example function to check email existence in the database
async function checkEmail(req, res) {
    const { email } = req.body

    const sql = 'SELECT * FROM user_mst WHERE email = ?'

    DBConfig.query(sql, [email], (err, results) => {
        if (err) {
            console.error('Error:', err)
            res.status(500).json({
                success: false,
                message: 'Oops! Something Went Wrong.',
            })
        } else {
            if (results.length > 0) {
                res.status(200).json({
                    success: true,
                    message: 'Email Already Exists.',
                })
            } else {
                res.status(200).json({
                    success: false,
                    message: 'Email Does Not Exists.',
                })
            }
        }
    })
}

// Example function to check role existence in the database
async function checkRole(req, res) {
    try {
        const { } = req.body

        const sql = "SELECT * FROM role_mst where isdeleted = 'N'"

        DBConfig.query(sql, (err, results) => {
            if (err) {
                console.error('Error:', err)
                res.status(500).json({
                    success: false,
                    message: 'Oops! Something Went Wrong.',
                })
            } else {
                res.status(200).json({
                    success: true,
                    message: 'Role Send Successfully',
                    role: results
                })
            }
        })
    } catch (error) {
        console.error('Error:', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        })
    }
}

// Edited User
async function editUsers(req, res) {
    try {
        const { user_id, firstName, lastName, email, password, role_id, updated_date, updated_by } = req.body
        const user = new UserUpdate(user_id, firstName, lastName, password, role_id, updated_date, updated_by)

        const result = await user.update()

        res.status(200).json({
            success: true,
            message: 'User updated successfully'
        })
    }
    catch (error) {
        console.error('Error:', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        })
    }
}

// Delete User
async function deleteUsers(req, res) {
    try {
        const { user_id } = req.body
        const sql = "update user_mst set isdeleted ='Y' where user_id = ?"

        DBConfig.query(sql, [user_id], (err, results) => {
            if (err) {
                console.error('Error updating user:', err)
                return res.status(500).json({
                    success: false,
                    message: 'Failed to update user',
                })
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found',
                })
            }

            res.status(200).json({
                success: true,
                message: 'User Deleted successfully',
            })
        })
    } catch (error) {
        console.error('Error:', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        })
    }
}

async function userSuspended(req, res) {
    try {
        const { user_id } = req.body
        const selectQuery = "SELECT isSuspended FROM user_mst WHERE user_id = ?"
        const updateQuery = "UPDATE user_mst SET isSuspended = ? WHERE user_id = ?"

        const checkUserSuspension = () => {
            return new Promise((resolve, reject) => {
                DBConfig.query(selectQuery, [user_id], (err, results) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(results[0].isSuspended)
                    }
                })
            })
        }

        const currentIsSuspended = await checkUserSuspension()
        const newIsSuspended = currentIsSuspended === 'Y' ? 'N' : 'Y'

        DBConfig.query(updateQuery, [newIsSuspended, user_id], (err, results) => {
            if (err) {
                console.error('Error updating user:', err)
                return res.status(500).json({
                    success: false,
                    message: 'Failed to suspend user',
                })
            }
            res.status(200).json({
                success: true,
                message: 'User Suspension Status Updated Successfully.',
            })
        })
    } catch (error) {
        console.error('Error:', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        })
    }
}

async function userCheckIn(req, res) {
    try {
        const { user_id, login_time } = req.body
        const userStatus = new userStatusLoginModel(user_id, login_time)
        const user_status_id = await userStatus.insertUserStatus()
        res.status(200).json({
            success: true,
            message: 'User Check In successfully',
            user_status_id
        })
    } catch (error) {
        console.error('Error:', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        })
    }
}

async function userCheckOut(req, res) {
    try {
        const { user_id, logout_time } = req.body
        const userStatusSQL = "SELECT user_status_id FROM user_status WHERE user_id = ? ORDER BY user_status_id DESC LIMIT 1"

        DBConfig.query(userStatusSQL, [user_id], (error, results) => {
            if (error) {
                console.error('Error:', error)
                res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                })
            } else {

                if (results.length === 0) {
                    res.status(404).json({
                        success: false,
                        message: 'No user status found for the specified user_id',
                    })
                } else {
                    const user_status_id = results[0].user_status_id
                    const userStatus = new userStatusLogoutModel(user_status_id, user_id, logout_time)

                    userStatus.updateUserStatus()
                        .then(result => {
                            res.status(200).json({
                                success: true,
                                message: 'User Check Out successfully',
                                status: result
                            })
                        })
                        .catch(error => {
                            console.error('Error:', error)
                            res.status(500).json({
                                success: false,
                                message: 'Internal server error',
                            })
                        })
                }

            }
        })
    } catch (error) {
        console.error('Error:', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        })
    }
}

async function userCheckInOutStatus(req, res) {
    try {
        const { user_id } = req.body
        const selectQuery = "select login_time, logout_time from user_status WHERE user_id = ?"

        DBConfig.query(selectQuery, [user_id], (err, results) => {
            if (err) {
                console.error('Error while getting user status:', err)
                return res.status(500).json({
                    success: false,
                    message: 'Failed to get user status',
                })
            }

            const userStatusObj = results.map(row => ({
                login_time: row.login_time,
                logout_time: row.logout_time,
            }))

            res.status(200).json({
                success: true,
                message: 'User Status send Successfully',
                userStatus: userStatusObj
            })
        })
    } catch (error) {
        console.error('Error:', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        })
    }
}


module.exports = { createUser, getUsers, checkEmail, checkRole, editUsers, deleteUsers, userSuspended, userCheckIn, userCheckOut, userCheckInOutStatus }