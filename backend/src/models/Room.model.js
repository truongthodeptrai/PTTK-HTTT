const { sql, pool } = require("../config/database");

class RoomModel {
  static async getAllRooms() {
    const db = await pool;
    const result = await db.request().query("SELECT * FROM Phong");
    return result.recordset;
  }
}

module.exports = RoomModel;
