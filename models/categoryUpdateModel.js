const DBConfig = require("../configs/connection");

class CategoryUpdate {
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

  update() {
    return new Promise((resolve, reject) => {
      const sql = "UPDATE category_mst SET ? WHERE category_id = ?";
      const categoryData = {
        name: this.name,
      };
      console.log("DATA ", categoryData);
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
