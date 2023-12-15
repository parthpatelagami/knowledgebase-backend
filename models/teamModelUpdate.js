const DBConfig = require('../configs/connection')

class TeamMstModelUpdate {
    constructor(
        team_id,
        team_name,
        updated_date,
        updated_by
    ) {
        this.team_id = team_id
        this.team_name = team_name
        this.updated_date = updated_date
        this.updated_by = updated_by
    }

    update() {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE team_mst SET ? WHERE team_id = ?'
            const teamData = {
                team_name: this.team_name,
                updated_date: this.updated_date,
                updated_by: this.updated_by
            }
            const teamId = this.team_id

            DBConfig.query(sql, [teamData, teamId], (err, results) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(teamId)
                }
            })
        })
    }
}

module.exports = TeamMstModelUpdate
