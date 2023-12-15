
const DBConfig = require('../configs/connection')

class TeamDetailsModelUpdate {
    async insertTeamDetails(user_id, team_id) {
        return new Promise((resolve, reject) => {
            DBConfig.query(
                'INSERT INTO team_details (user_id, team_id) VALUES (?, ?)',
                [user_id, team_id],
                (error, results) => {
                    if (error) {
                        reject(error)
                    } else {
                        resolve(results)
                    }
                }
            )
        })
    }

    async delete(team_id) {
        return new Promise((resolve, reject) => {
            DBConfig.query(
                'DELETE FROM team_details WHERE team_id = ?',
                [team_id],
                (error, results) => {
                    if (error) {
                        reject(error)
                    } else {
                        resolve(results)
                    }
                }
            )
        })
    }
}

module.exports = TeamDetailsModelUpdate