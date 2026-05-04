import { useAuth } from '../context/AuthContext';

export default function Sidebar({ onNavigate, activeSection, roleConfig }) {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    if (window.confirm('Đăng xuất khỏi hệ thống?')) {
      await logout();
      window.location.href = '/login';
    }
  };

  return (
    <div className="w-72 bg-white shadow-xl flex flex-col">
      {/* Header */}
      <div className="p-6 border-b flex items-center gap-3">
        <i className="fas fa-home text-4xl text-blue-600"></i>
        <div>
          <h1 className="text-2xl font-bold">HomeStay Dorm</h1>
          <p className="text-xs text-gray-500">Nhân viên {roleConfig?.title || 'Hệ thống'}</p>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 p-4 space-y-1">
        {roleConfig?.navItems?.map((item) => (
          <div
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`nav-item flex items-center gap-3 px-5 py-4 rounded-2xl cursor-pointer transition ${
              activeSection === item.id
                ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                : 'hover:bg-gray-100'
            }`}
          >
            <i className={`${item.icon} w-5`}></i>
            <span className="font-medium">{item.label}</span>
          </div>
        ))}
      </div>

      {/* User Profile */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-2xl">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${roleConfig?.avatarBg || 'bg-blue-100'}`}>
            {user?.name?.split(' ')[0]?.[0]}
          </div>
          <div className="flex-1">
            <div className="font-medium text-sm">{user?.name}</div>
            <div className="text-xs text-green-600">Đang online</div>
          </div>
          <button
            onClick={handleLogout}
            className="text-red-600 hover:text-red-700 text-sm"
            title="Đăng xuất"
          >
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
