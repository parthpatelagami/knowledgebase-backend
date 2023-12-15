const DBConfig = require('../configs/connection')

class TeamMstModel {
    async insertTeamMst(team_name, created_date, created_by) {
        return new Promise((resolve, reject) => {
            DBConfig.query(
                'INSERT INTO team_mst (team_name, created_date,created_by) VALUES (?, ?, ?)',
                [team_name, created_date, created_by],
                (error, results) => {
                    if (error) {
                        reject(error)
                    } else {
                        resolve(results.insertId)
                    }
                }
            )
        })
    }
}

module.exports = TeamMstModel
