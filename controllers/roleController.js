const express = require('express')
const DBConfig = require('../configs/connection')
const Role = require('../models/roleModel')
const RoleUpdate = require('../models/roleModelUpdate')

async function createRole(req, res) {
    try {
        const { role_name, permissions, created_date, created_by } = req.body

        const permissionArray = [] // Use a different variable name to avoid conflict

        for (const permission of permissions) {
            const role = {
                page: permission.page,
                permission: permission.permission
            }
            permissionArray.push(role) // Store the Role instance in the array
        }

        const role = new Role(role_name, permissionArray, created_date, created_by)

        const result = await role.insert()
        res.status(201).json({
            success: true,
            message: 'Role created successfully',
            role: result,
        })
    } catch (error) {
        console.error('Error:', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        })
    }
}

async function checkRoleByName(req, res) {
    const { role_name } = req.body

    const sql = 'SELECT * FROM role_mst WHERE role_name = ?'

    DBConfig.query(sql, [role_name], (err, results) => {
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
                    message: 'Role Already Exists.',
                })
            } else {
                res.status(200).json({
                    success: false,
                    message: 'Role Does Not Exists.',
                })
            }
        }
    })
}

async function deleteRole(req, res) {
    try {

        const { role_name } = req.body
        const sql = "update role_mst set isdeleted ='Y' where role_name = ?"

        DBConfig.query(sql, [role_name], (err, results) => {
            if (err) {
                console.error('Error updating user:', err)
                return res.status(500).json({
                    success: false,
                    message: 'Failed to role fetch',
                })
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Role not found',
                })
            }

            res.status(200).json({
                success: true,
                message: 'Role Deleted successfully',
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

async function editRole(req, res) {
    try {

        const { role_id, role_name, permissions, updated_date, updated_by } = req.body

        const permissionArray = [] // Use a different variable name to avoid conflict

        for (const permission of permissions) {
            const role = {
                page: permission.page,
                permission: permission.permission
            }
            permissionArray.push(role) // Store the Role instance in the array
        }

        const role = new RoleUpdate(role_id, role_name, permissionArray, updated_date, updated_by)

        const result = await role.update()

        res.status(200).json({
            success: true,
            message: 'Role updated successfully'
        })
    } catch (error) {
        console.error('Error:', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        })
    }
}


module.exports = { createRole, checkRoleByName, deleteRole, editRole }
