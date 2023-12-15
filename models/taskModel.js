const DBConfig = require('../configs/connection')

class Task {
    constructor(
        task_user_id,
        title,
        description,
        due_date,
        priority,
        status,
        created_date,
        created_by,
        file
    ) {
        this.task_user_id = task_user_id
        this.title = title
        this.description = description
        this.due_date = due_date
        this.priority = priority
        this.status = status
        this.created_date = created_date
        this.created_by = created_by,
        this.file = file
    }

    insertNewTask() {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO task_mst SET ?'
            const taskData = {
                task_user_id: this.task_user_id,
                title: this.title,
                description: this.description,
                due_date: this.due_date,
                priority: this.priority,
                status: this.status,
                created_date: this.created_date,
                created_by: this.created_by,
                file: this.file
            }

            DBConfig.query(sql, taskData, (err, results) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(results)
                }
            })
        })
    }
}

module.exports = Task