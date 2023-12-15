const express = require('express')
const DBConfig = require('../configs/connection')
const TeamMstModel = require('../models/teamModel')
const TeamDetailsModel = require('../models/teamDetailsModel')
const TeamMstModelUpdate = require('../models/teamModelUpdate')
const TeamDetailsModelUpdate = require('../models/teamDetailsModelUpdate')

async function createTeam(req, res) {
    try {
        const { team_name, team_members, team_managers, created_date, created_by } = req.body

        const teamMstModel = new TeamMstModel()
        const teamDetailsModel = new TeamDetailsModel()

        const lastTeamId = await teamMstModel.insertTeamMst(team_name, created_date, created_by)

        for (let i = 0; i < team_members.length; i++) {
            await teamDetailsModel.insertTeamDetails(team_members[i], lastTeamId)
        }

        for (let i = 0; i < team_managers.length; i++) {
            await teamDetailsModel.insertTeamDetails(team_managers[i], lastTeamId)
        }

        res.status(201).json({
            success: true,
            message: 'Team created successfully'
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
async function getTeam(req, res) {
    try {
        const { } = req.body

        const sql = "SELECT * FROM team_details td " +
            "INNER JOIN user_mst um ON td.user_id = um.user_id " +
            "INNER JOIN role_mst rm ON um.role_id = rm.role_id " +
            "INNER JOIN team_mst tm ON tm.team_id = td.team_id " +
            "WHERE tm.isdeleted = 'N' AND um.isdeleted = 'N'"

        // Execute the SQL query
        DBConfig.query(sql, (err, results) => {
            console.log("results", results)

            const teamInfo = []

            results.forEach((item) => {
                const { team_id, role_name, team_name, user_id, firstName, lastName, created_date, created_by, updated_date, updated_by } = item

                if (!teamInfo[team_id]) {
                    teamInfo[team_id] = {
                        team_id,
                        team_name,
                        created_date,
                        created_by,
                        updated_date,
                        updated_by,
                        managers: [],
                        members: [],
                        total_members: 0
                    }
                }

                // Based on role_name, add the user to the appropriate category
                const user = { user_id, name: `${firstName} ${lastName}` }
                if (role_name === "Manager") {
                    teamInfo[team_id].managers.push(user)
                } else if (role_name === "Employee") {
                    teamInfo[team_id].members.push(user)
                }

                teamInfo[team_id].total_members = teamInfo[team_id].managers.length + teamInfo[team_id].members.length
            })

            if (err) {
                console.error('Error:', err)
                res.status(500).json({
                    success: false,
                    message: 'Oops! Something Went Wrong.',
                })
            } else {

                res.status(200).json({
                    success: true,
                    message: 'Teams Send Successfully',
                    Team: teamInfo
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

// async function getTeam(req, res) {
//     try {
//         const { pagination } = req.body
//         const { page_size, page_number } = pagination

//         const sql = `
//             SELECT * FROM team_details td
//             INNER JOIN user_mst um ON td.user_id = um.user_id
//             INNER JOIN role_mst rm ON um.role_id = rm.role_id
//             INNER JOIN team_mst tm ON tm.team_id = td.team_id
//             WHERE tm.isdeleted = 'N' AND um.isdeleted = 'N'
//         `

//         // Execute the SQL query
//         DBConfig.query(sql, (err, results) => {
//             console.log("results", results)

//             const teamInfo = []

//             results.forEach((item) => {
//                 const { team_id, role_name, team_name, user_id, firstName, lastName, created_date, created_by, updated_date, updated_by } = item

//                 if (!teamInfo[team_id]) {
//                     teamInfo[team_id] = {
//                         team_id,
//                         team_name,
//                         created_date,
//                         created_by,
//                         updated_date,
//                         updated_by,
//                         managers: [],
//                         members: [],
//                         total_members: 0,
//                     }
//                 }

//                 // Based on role_name, add the user to the appropriate category
//                 const user = { user_id, name: `${firstName} ${lastName}` }
//                 if (role_name === "Manager") {
//                     teamInfo[team_id].managers.push(user)
//                 } else if (role_name === "Employee") {
//                     teamInfo[team_id].members.push(user)
//                 }

//                 teamInfo[team_id].total_members = teamInfo[team_id].managers.length + teamInfo[team_id].members.length
//             })

//             // Filter out null values from the teamInfo array
//             const filteredTeamInfo = teamInfo.filter((item) => item !== null)

//             if (err) {
//                 console.error('Error:', err)
//                 res.status(500).json({
//                     success: false,
//                     message: 'Oops! Something Went Wrong.',
//                 })
//             } else {
//                 // Calculate the start and end indices for pagination
//                 const start = page_size * page_number
//                 const end = start + page_size

//                 // Slice the filtered array to return the paginated results
//                 const paginatedTeamInfo = filteredTeamInfo.slice(start, end)

//                 res.status(200).json({
//                     success: true,
//                     message: 'Teams Send Successfully',
//                     Team: paginatedTeamInfo,
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

async function getUserByEmployee(req, res) {
    try {
        const { } = req.body // Assuming you expect an employeeId in req.body

        // Replace with your actual SQL query with a WHERE clause to filter by employeeId
        const sql = "SELECT um.user_id, um.role_id, um.firstName, um.lastName, um.isdeleted, rm.role_name FROM user_mst um " +
            "LEFT JOIN role_mst rm ON um.role_id = rm.role_id where um.role_id = 2 AND um.isdeleted = 'N'"

        DBConfig.query(sql, (err, results) => {
            if (err) {
                console.error('Error:', err)
                res.status(500).json({
                    success: false,
                    message: 'Oops! Something Went Wrong.',
                })
            } else {

                const usersWithFullNames = results.map((user) => {
                    const user_id = user.user_id
                    const role_id = user.role_id
                    const fullName = `${user.firstName} ${user.lastName}`
                    const roleName = user.role_name
                    return { user_id, role_id, fullName, roleName }
                })

                res.status(200).json({
                    success: true,
                    message: 'Employee Data retrieved successfully',
                    Employees: usersWithFullNames
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

async function getUserByManager(req, res) {
    try {
        const { } = req.body // Assuming you expect an employeeId in req.body

        // Replace with your actual SQL query with a WHERE clause to filter by employeeId
        const sql = "SELECT  um.user_id, um.role_id, um.firstName, um.lastName, um.isdeleted, rm.role_name FROM user_mst um " +
            "LEFT JOIN role_mst rm ON um.role_id = rm.role_id where um.role_id = 3 AND um.isdeleted = 'N'"

        DBConfig.query(sql, (err, results) => {
            if (err) {
                console.error('Error:', err)
                res.status(500).json({
                    success: false,
                    message: 'Oops! Something Went Wrong.',
                })
            } else {
                const usersWithFullNames = results.map((user) => {
                    const user_id = user.user_id
                    const role_id = user.role_id
                    const fullName = `${user.firstName} ${user.lastName}`
                    const roleName = user.role_name
                    return { user_id, role_id, fullName, roleName }
                })

                res.status(200).json({
                    success: true,
                    message: 'Manager Data retrieved successfully',
                    Manager: usersWithFullNames,
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

async function getAllUsers(req, res) {
    try {
        const { } = req.body // Assuming you expect an employeeId in req.body

        // Replace with your actual SQL query with a WHERE clause to filter by employeeId
        const sql = "SELECT um.user_id, um.role_id, um.firstName, um.lastName, um.isdeleted, rm.role_name FROM user_mst um " +
            "LEFT JOIN role_mst rm ON um.role_id = rm.role_id where um.isdeleted = 'N'"

        DBConfig.query(sql, (err, results) => {
            if (err) {
                console.error('Error:', err)
                res.status(500).json({
                    success: false,
                    message: 'Oops! Something Went Wrong.',
                })
            } else {

                const usersWithFullNames = results.map((user) => {
                    const user_id = user.user_id
                    const role_id = user.role_id
                    const fullName = `${user.firstName} ${user.lastName}`
                    const roleName = user.role_name
                    return { user_id, role_id, fullName, roleName }
                })

                res.status(200).json({
                    success: true,
                    message: 'All User Data retrieved successfully',
                    Employees: usersWithFullNames
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

// Delete Team
async function deleteTeam(req, res) {
    try {
        const { team_id } = req.body
        const sql = "update team_mst set isdeleted ='Y' where team_id = ?"

        DBConfig.query(sql, [team_id], (err, results) => {
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
                    message: 'Team Is not found',
                })
            }

            res.status(200).json({
                success: true,
                message: 'Team Deleted successfully',
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

//Edit Team
async function editTeam(req, res) {
    try {

        const { team_id, team_name, team_members, team_managers, updated_date, updated_by } = req.body

        const teamDetailsModelUpdate = new TeamDetailsModelUpdate()

        const team = new TeamMstModelUpdate(team_id, team_name, updated_date, updated_by)

        const result = await team.update()

        // Delete existing team members and managers for this team
        await teamDetailsModelUpdate.delete(result)

        // Insert updated team members
        for (let i = 0; i < team_members.length; i++) {
            await teamDetailsModelUpdate.insertTeamDetails(team_members[i], result)
        }

        // Insert updated team managers
        for (let i = 0; i < team_managers.length; i++) {
            await teamDetailsModelUpdate.insertTeamDetails(team_managers[i], result)
        }

        res.status(200).json({
            success: true,
            message: 'Team updated successfully'
        })
    } catch (error) {
        console.error('Error:', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

module.exports = { createTeam, getUserByEmployee, getUserByManager, getAllUsers, getTeam, deleteTeam, editTeam }
