import { useAuth } from '../../context/AuthContext';

export default function Navbar({ title }) {
  const { logout } = useAuth();

  const handleLogout = async () => {
    if (window.confirm('Đăng xuất khỏi hệ thống?')) {
      await logout();
      window.location.href = '/login';
    }
  };

  return (
    <header className="bg-white border-b px-4 py-4 sm:px-6 lg:px-8 lg:py-5 flex justify-between items-center gap-4 sticky top-0 z-10">
      <h1 className="min-w-0 truncate text-xl sm:text-2xl font-semibold text-gray-800">{title}</h1>
      <button
        onClick={handleLogout}
        className="cursor-pointer shrink-0 flex items-center gap-2 text-red-600 hover:text-red-700 transition"
      >
        <i className="fas fa-sign-out-alt"></i> Đăng xuất
      </button>
    </header>
  );
}
