function ManagerPage() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold">Trang Quản Lý</h1>

      <p className="mt-4 text-xl">Xin chào: {user?.TenTaiKhoan}</p>
    </div>
  );
}

export default ManagerPage;
