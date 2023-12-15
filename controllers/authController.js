const express = require('express')
const userService = require('../service/authService')

exports.loginController = async (req, res) => {
    try {
        const { email, firstName, lastName, profile, created_date, created_by } = req.body

        // Check if the user already exists
        const existingUser = await userService.getUserByEmail(email)

        const transformedPermissions = existingUser?.permissions.map(item => ({
            [item.page]: item.permission
        }))

        if (existingUser === null || existingUser === "null") {
            const newUser = {
                email: email,
                firstName: firstName,
                lastName: lastName,
                profile: profile,
                created_date: created_date,
                created_by: created_by
            }
            await userService.createUser(newUser)

            return res.status(201).json({
                success: true,
                message: "New user registered and logged in successfully",
                firstName: firstName,
                lastName: lastName,
                profile: profile,
                email: email,
                created_date: created_date,
                created_by: created_by,
                permissions: [
                    { Dashboard: 'Editor' },
                    { History: 'Editor' },
                    { Task: 'Editor' },
                    { Team: 'None' },
                    { Users: 'None' },
                    { Permissions: 'None' }
                ],
                role: "Employee"
            })
        } else {
            // Return the user details upon successful login
            return res.status(200).json({
                success: true,
                message: 'Login Was Successful',
                firstName: existingUser?.firstName,
                lastName: existingUser?.lastName,
                profile: existingUser?.profile,
                email: existingUser?.email,
                permissions: transformedPermissions,
                role: existingUser?.role,
                created_date: existingUser?.created_date,
                created_by: existingUser?.created_by,
                isSuspended: existingUser?.isSuspended,
                user_id: existingUser?.user_id
            })
        }
    } catch (error) {
        console.error('Error:', error)
        return res.status(500).json({
            message: 'Internal server error',
        })
    }
}
