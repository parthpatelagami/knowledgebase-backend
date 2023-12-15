class user_mst {
    constructor(email, firstName, lastName, companyName, profile, permissions, role, isSuspended, user_id, created_date, created_by, updated_date, updated_by) {
        this.email = email
        this.firstName = firstName
        this.lastName = lastName
        this.companyName = companyName
        this.profile = profile
        this.permissions = permissions
        this.role = role
        this.isSuspended = isSuspended
        this.user_id = user_id
        this.created_date = created_date
        this.created_by = created_by
        this.updated_date = updated_date
        this.updated_by = updated_by
    }
}

module.exports = user_mst