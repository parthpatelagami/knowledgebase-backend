const DBConfig = require("../configs/connection");

class Category {
  constructor(
    category_id,
    name,
    description,
    status,
    created_date,
    created_by
  ) {
    this.category_id = category_id;
    this.name = name;
    this.description = description;
    this.status = status;
    this.created_date = created_date;
    this.created_by = created_by;
  }

  insert() {
    return new Promise((resolve, reject) => {
      const sql = "INSERT INTO category_mst SET ?";
      const categoryData = {
        name: this.name,
        description: this.description,
        status: this.status,
        created_date: this.created_date,
        created_by: this.created_by,
      };

      DBConfig.query(sql, categoryData, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }
}

module.exports = Category;
