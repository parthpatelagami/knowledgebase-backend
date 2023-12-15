const DBConfig = require('../configs/connection')

class userStatusLoginModel {

    constructor(user_id, login_time) {
        this.user_id = user_id
        this.login_time = login_time
    }

    async insertUserStatus() {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO user_status set ?'

            const userStatus = {
                user_id: this.user_id,
                login_time: this.login_time
            }

            DBConfig.query(sql, userStatus, (error, results) => {
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

class userStatusLogoutModel {
    constructor(user_status_id, user_id, logout_time) {
        this.user_status_id = user_status_id;
        this.user_id = user_id;
        this.logout_time = logout_time;
    }

    async updateUserStatus() {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE user_status SET logout_time = ? WHERE user_id = ? AND user_status_id = ?';

            const userStatus = [this.logout_time, this.user_id, this.user_status_id];

            DBConfig.query(sql, userStatus, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }
}

module.exports = { userStatusLoginModel, userStatusLogoutModel }
