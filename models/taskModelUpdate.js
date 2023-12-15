const DBConfig = require('../configs/connection')

class Task_Update {
    constructor(
        task_id,
        task_user_id,
        title,
        description,
        due_date,
        priority,
        status,
        updated_date,
        updated_by,
        file
    ) {
        this.task_id = task_id
        this.task_user_id = task_user_id
        this.title = title
        this.description = description
        this.due_date = due_date
        this.priority = priority
        this.status = status
        this.updated_date = updated_date
        this.updated_by = updated_by
        this.file = file
    }

    updateTaskFunction() {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE task_mst SET ? WHERE task_id = ?'
            const taskData = {
                task_user_id: this.task_user_id,
                title: this.title,
                description: this.description,
                due_date: this.due_date,
                priority: this.priority,
                status: this.status,
                updated_date: this.updated_date,
                updated_by: this.updated_by,
                file: this.file
            }

            DBConfig.query(sql, [taskData, this.task_id], (err, results) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(results)
                }
            })
        })
    }
}

module.exports = Task_Update