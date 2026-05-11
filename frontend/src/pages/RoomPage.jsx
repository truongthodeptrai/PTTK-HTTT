
import { useState, useEffect } from 'react';


const PAGE_SIZE = 6;

function TrangSoDoPhong() {
  const [danhSachPhong, setDanhSachPhong] = useState([]);
  const [tuKhoa, setTuKhoa] = useState('');
  const [loaiPhong, setLoaiPhong] = useState('');
  const [tieuChi, setTieuChi] = useState('');
  const [mucGia, setMucGia] = useState('');
  const [page, setPage] = useState(1);
  useEffect(() => {
    const layDuLieuTuBackend = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/rooms');
        const data = await response.json();
        
        setDanhSachPhong(data);
      } catch (error) {
        console.error("Không thể kết nối với Backend:", error);
      }
    };

    layDuLieuTuBackend();
  }, []); // [] có nghĩa là chỉ chạy 1 lần duy nhất khi mở trang


  // Logic lọc dữ liệu đa trường
  const danhSachDaLoc = danhSachPhong.filter((phong) => {
    // Lọc theo từ khóa mã phòng hoặc tên phòng
    if (
      !phong.TenPhong.toLowerCase().includes(tuKhoa.toLowerCase()) &&
      !(phong.MaPhong + '').includes(tuKhoa)
    ) return false;

    // Lọc theo loại phòng (theo MaLoaiPhong hoặc có thể fetch thêm tên loại phòng nếu cần)
    if (loaiPhong && String(phong.MaLoaiPhong) !== loaiPhong) return false;

    // Lọc theo tiêu chí tình trạng (trạng thái)
    if (tieuChi) {
      if (tieuChi === 'conTrong' && phong.TrangThai !== 0) return false;
      if (tieuChi === 'daDay' && phong.TrangThai !== 1) return false;
      if (tieuChi === 'giaThap' && !(Number(phong.GiaNguyenPhong) <= 5000000)) return false;
      if (tieuChi === 'giaCao' && !(Number(phong.GiaNguyenPhong) > 5000000)) return false;
    }

    // Lọc theo mức giá
    if (mucGia) {
      const gia = Number(phong.GiaNguyenPhong);
      if (mucGia === 'duoi5tr' && !(gia <= 5000000)) return false;
      if (mucGia === '5-6tr' && !(gia > 5000000 && gia <= 6000000)) return false;
      if (mucGia === 'tren6tr' && !(gia > 6000000)) return false;
    }

    return true;
  });

  const totalPages = Math.ceil(danhSachDaLoc.length / PAGE_SIZE);
  const danhSachHienTai = danhSachDaLoc.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  return (
    <div style={styles.container}>
      <div style={styles.filterSection}>
        <div style={styles.filterRow}>
          <input
            type="text"
            placeholder="Tìm phòng"
            style={styles.searchInput}
            value={tuKhoa}
            onChange={(e) => {
              setTuKhoa(e.target.value);
              setPage(1);
            }}
          />
          <select
            style={styles.selectBox}
            value={loaiPhong}
            onChange={e => {
              setLoaiPhong(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Loại phòng</option>
            <option value="KTX Nam">KTX Nam</option>
            <option value="KTX Nữ">KTX Nữ</option>
          </select>
          <select
            style={styles.selectBox}
            value={tieuChi}
            onChange={e => {
              setTieuChi(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Tiêu chí</option>
            <option value="giaThap">Giá thấp</option>
            <option value="giaCao">Giá cao</option>
          </select>
        </div>
        <div style={styles.filterRow}>
          <select
            style={styles.selectBox}
            value={tieuChi}
            onChange={e => {
              setTieuChi(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Tình trạng</option> 
            <option value="conTrong">Còn trống</option>
            <option value="daDay">Đã đầy</option>
          </select>
          <select
            style={styles.selectBox}
            value={mucGia}
            onChange={e => {
              setMucGia(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Mức giá</option>
            <option value="duoi5tr">Dưới 5 triệu</option>
            <option value="5-6tr">Từ 5 - 6 triệu</option>
            <option value="tren6tr">Trên 6 triệu</option>
          </select>
        </div>
      </div>
      <div style={styles.gridContainer}>
        {danhSachHienTai.map((phong) => (
          <div key={phong.MaPhong} style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={{ ...styles.statusDot, backgroundColor: phong.TrangThai === 0 ? '#4caf50' : phong.TrangThai === 1 ? '#f44336' : '#ffeb3b' }}></div>
              <strong>{phong.TenPhong}</strong>
            </div>
            <div style={styles.cardContent}>
              <p>Giá nguyên phòng: <span style={{ fontWeight: 600 }}>{Number(phong.GiaNguyenPhong).toLocaleString('vi-VN')} đ</span></p>
              <p>Giá giường: <span style={{ fontWeight: 600 }}>{Number(phong.GiaThueMotGiuong).toLocaleString('vi-VN')} đ</span></p>
              <p>Số người tối đa: <span style={{ fontWeight: 600 }}>{phong.SoNguoiToiDa}</span></p>
              <p>Số người còn lại: <span style={{ fontWeight: 600 }}>{phong.SoNguoiConLai}</span></p>
              <p>Trạng thái: <span style={{ fontWeight: 600 }}>
                {phong.TrangThai === 0 ? 'Trống' : phong.TrangThai === 1 ? 'Đã đầy' : 'Bảo trì'}
              </span></p>
            </div>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div style={styles.paginationBar}>
          <button
            style={{ ...styles.pageButton, ...(page === 1 ? styles.pageButtonDisabled : {}) }}
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            &lt;
          </button>
          {/* Hiển thị tối đa 5 nút số trang, có ... nếu nhiều trang */}
          {(() => {
            const pages = [];
            if (totalPages <= 5) {
              for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
              }
            } else {
              if (page <= 3) {
                pages.push(1, 2, 3, 4, '...', totalPages);
              } else if (page >= totalPages - 2) {
                pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
              } else {
                pages.push(1, '...', page - 1, page, page + 1, '...', totalPages);
              }
            }
            return pages.map((p, idx) =>
              p === '...'
                ? <span key={"ellipsis-" + idx} style={{ padding: '0 8px', color: '#888', fontWeight: 600 }}>...</span>
                : <button
                    key={p}
                    style={{
                      ...styles.pageButton,
                      ...(page === p ? styles.pageButtonActive : {})
                    }}
                    onClick={() => handlePageChange(p)}
                  >
                    {p}
                  </button>
            );
          })()}
          <button
            style={{ ...styles.pageButton, ...(page === totalPages ? styles.pageButtonDisabled : {}) }}
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'Segoe UI, sans-serif',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
    padding: '40px 0',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  filterSection: {
    backgroundColor: '#2196f3',
    padding: '28px 32px 18px 32px',
    borderRadius: '16px 16px 0 0',
    boxShadow: '0 4px 16px rgba(33,150,243,0.08)',
    width: 'min(1200px, 95vw)',
    marginBottom: '0',
  },
  filterRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '35px',
    marginBottom: '20px',
  },
  searchInput: {
    padding: '12px 20px',
    borderRadius: '24px',
    border: 'none',
    width: '220px',
    outline: 'none',
    fontSize: '16px',
    background: 'white',
    color: '#333', // Ép chữ màu xám đen để nổi trên nền trắng
    minWidth: '150px', // Cho các ô select có độ rộng tương đối bằng nhau
    fontWeight: 'bold',
    boxShadow: '0 2px 8px rgba(33,150,243,0.04)',
    transition: 'box-shadow 0.2s',
  },
  selectBox: {
    padding: '12px 35px',
    borderRadius: '24px',
    border: 'none',
    outline: 'none',
    cursor: 'pointer',
    backgroundColor: 'white',
    color: '#333', // Ép chữ màu xám đen để nổi trên nền trắng
    minWidth: '150px', // Cho các ô select có độ rộng tương đối bằng nhau
    fontWeight: 'bold',
    fontSize: '16px',
    boxShadow: '0 2px 8px rgba(33,150,243,0.04)',
    transition: 'box-shadow 0.2s',
    appearance: 'none', 
    backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23333333%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 15px top 50%', // Căn mũi tên cách lề phải 15px, ở giữa theo chiều dọc
    backgroundSize: '12px auto',
  },
  gridContainer: {
    backgroundColor: '#2196f3',
    padding: '0 32px 36px 32px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
    gap: '28px',
    borderRadius: '0 0 16px 16px',
    width: 'min(1200px, 95vw)',
    minHeight: '320px',
    boxShadow: '0 4px 16px rgba(33,150,243,0.08)',
  },
  card: {
    backgroundColor: '#f5f5f5',
    border: '1.5px solid #90caf9',
    padding: '22px 18px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(33,150,243,0.08)',
    borderRadius: '12px',
    transition: 'transform 0.15s',
    cursor: 'pointer',
    minHeight: '180px',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
    fontSize: '18px',
    color: '#1565c0',
    letterSpacing: '0.5px',
  },
  statusDot: {
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    border: '2.5px solid #1565c0',
    boxShadow: '0 1px 4px rgba(33,150,243,0.10)',
  },
  cardContent: {
    textAlign: 'center',
    lineHeight: '1.7',
    fontSize: '15px',
    color: '#333',
    margin: 0,
  },
  paginationBar: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
    marginTop: '24px',
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(33,150,243,0.08)',
    padding: '10px 24px',
    width: 'min(900px, 95vw)',
  },
  pageButton: {
    border: 'none',
    background: '#e3f2fd',
    color: '#1565c0',
    fontWeight: 600,
    fontSize: '16px',
    borderRadius: '8px',
    padding: '7px 16px',
    cursor: 'pointer',
    transition: 'background 0.2s, color 0.2s',
  },
  pageButtonActive: {
    background: '#1565c0',
    color: '#fff',
  },
  pageButtonDisabled: {
    background: '#e0e0e0',
    color: '#bdbdbd',
    cursor: 'not-allowed',
  },
};

export default TrangSoDoPhong;