const { sql, getPool } = require('../config/database');

const roomStatusMap = {
  0: 'available',
  1: 'full',
  2: 'maintenance',
};

const roomStatusValueMap = {
  available: 0,
  full: 1,
  maintenance: 2,
};

function mapRoom(row) {
  if (!row) return null;

  return {
    id: row.MaPhong,
    code: row.TenPhong,
    name: row.TenLoaiPhong
      ? `${row.TenPhong} - ${row.TenLoaiPhong}`
      : row.TenPhong,
    roomTypeId: row.MaLoaiPhong,
    roomTypeName: row.TenLoaiPhong,
    branchId: row.MaChiNhanh,
    capacity: row.SoNguoiToiDa ?? row.SoNguoi,
    available: row.SoNguoiConLai,
    fullRoomPrice: Number(row.GiaNguyenPhong),
    bedPrice: Number(row.GiaThueMotGiuong),
    price: Number(row.GiaThueMotGiuong),
    status: roomStatusMap[row.TrangThai] || 'unknown',
  };
}

class RoomModel {
  static async findAll() {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT p.MaPhong, p.TenPhong, p.GiaNguyenPhong, p.GiaThueMotGiuong,
             p.SoNguoiToiDa, p.SoNguoiConLai, p.TrangThai, p.MaChiNhanh,
             p.MaLoaiPhong, lp.TenLoaiPhong, lp.SoNguoi
      FROM Phong p
      INNER JOIN LoaiPhong lp ON lp.MaLoaiPhong = p.MaLoaiPhong
      ORDER BY p.MaPhong DESC
    `);

    return result.recordset.map(mapRoom);
  }

  static async findAvailable() {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT p.MaPhong, p.TenPhong, p.GiaNguyenPhong, p.GiaThueMotGiuong,
             p.SoNguoiToiDa, p.SoNguoiConLai, p.TrangThai, p.MaChiNhanh,
             p.MaLoaiPhong, lp.TenLoaiPhong, lp.SoNguoi
      FROM Phong p
      INNER JOIN LoaiPhong lp ON lp.MaLoaiPhong = p.MaLoaiPhong
      WHERE p.TrangThai = 0 AND ISNULL(p.SoNguoiConLai, 0) > 0
      ORDER BY p.MaPhong DESC
    `);

    return result.recordset.map(mapRoom);
  }

  static async findById(id) {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        SELECT p.MaPhong, p.TenPhong, p.GiaNguyenPhong, p.GiaThueMotGiuong,
               p.SoNguoiToiDa, p.SoNguoiConLai, p.TrangThai, p.MaChiNhanh,
               p.MaLoaiPhong, lp.TenLoaiPhong, lp.SoNguoi
        FROM Phong p
        INNER JOIN LoaiPhong lp ON lp.MaLoaiPhong = p.MaLoaiPhong
        WHERE p.MaPhong = @id
      `);

    return mapRoom(result.recordset[0]);
  }

  static async create(room) {
    const pool = await getPool();
    const result = await pool.request()
      .input('name', sql.NVarChar(20), room.code || room.name)
      .input('fullRoomPrice', sql.Decimal(19, 4), room.fullRoomPrice || room.price)
      .input('bedPrice', sql.Decimal(19, 4), room.bedPrice || room.price)
      .input('maxPeople', sql.Int, room.capacity)
      .input('remainingPeople', sql.Int, room.available ?? room.capacity)
      .input('status', sql.Int, roomStatusValueMap[room.status] ?? 0)
      .input('branchId', sql.Int, room.branchId)
      .input('roomTypeId', sql.Int, room.roomTypeId)
      .query(`
        INSERT INTO Phong (
          TenPhong, GiaNguyenPhong, GiaThueMotGiuong, SoNguoiToiDa,
          SoNguoiConLai, TrangThai, MaChiNhanh, MaLoaiPhong
        )
        OUTPUT INSERTED.MaPhong
        VALUES (
          @name, @fullRoomPrice, @bedPrice, @maxPeople,
          @remainingPeople, @status, @branchId, @roomTypeId
        )
      `);

    return this.findById(result.recordset[0].MaPhong);
  }

  static async update(id, room) {
    const current = await this.findById(id);
    if (!current) return null;

    const pool = await getPool();
    await pool.request()
      .input('id', sql.Int, id)
      .input('name', sql.NVarChar(20), room.code || room.name || current.code)
      .input('fullRoomPrice', sql.Decimal(19, 4), room.fullRoomPrice ?? current.fullRoomPrice)
      .input('bedPrice', sql.Decimal(19, 4), room.bedPrice ?? current.bedPrice)
      .input('maxPeople', sql.Int, room.capacity ?? current.capacity)
      .input('remainingPeople', sql.Int, room.available ?? current.available)
      .input('status', sql.Int, roomStatusValueMap[room.status] ?? roomStatusValueMap[current.status] ?? 0)
      .input('branchId', sql.Int, room.branchId ?? current.branchId)
      .input('roomTypeId', sql.Int, room.roomTypeId ?? current.roomTypeId)
      .query(`
        UPDATE Phong
        SET TenPhong = @name,
            GiaNguyenPhong = @fullRoomPrice,
            GiaThueMotGiuong = @bedPrice,
            SoNguoiToiDa = @maxPeople,
            SoNguoiConLai = @remainingPeople,
            TrangThai = @status,
            MaChiNhanh = @branchId,
            MaLoaiPhong = @roomTypeId
        WHERE MaPhong = @id
      `);

    return this.findById(id);
  }
}

module.exports = RoomModel;
