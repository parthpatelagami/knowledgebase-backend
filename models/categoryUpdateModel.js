const DBConfig = require("../configs/connection");

class CategoryUpdate {
  constructor(
    category_id,
    name,
    description,
    status,
    updated_date,
    updated_by
  ) {
    this.category_id = category_id;
    this.name = name;
    this.description = description;
    this.status = status;
    this.updated_date = updated_date;
    this.updated_by = updated_by;
  }

  update() {
    return new Promise((resolve, reject) => {
      const sql = "UPDATE category_mst SET ? WHERE category_id = ?";
      const categoryData = {
        name: this.name,
        description: this.description,
        status: this.status,
        updated_date: this.updated_date,
        updated_by: this.updated_by,
      };
      const categoryId = this.category_id;

      DBConfig.query(sql, [categoryData, categoryId], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }
}

module.exports = CategoryUpdate;
