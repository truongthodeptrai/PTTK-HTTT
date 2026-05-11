import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [username, setUsername] = useState('sale01');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(username, password);
      // Redirect based on role
      navigate(`/${user.role}/dashboard`);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (role) => {
    const credentials = {
      sales: { username: 'sale01', password: '123456' },
      accountant: { username: 'account01', password: '123456' },
      manager: { username: 'manager01', password: '123456' },
    };

    const cred = credentials[role];
    setUsername(cred.username);
    setPassword(cred.password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-500">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-blue-700 text-white p-10 text-center">
          <i className="fas fa-home text-6xl mb-4 block"></i>
          <h1 className="text-3xl font-bold">HomeStay Dorm</h1>
          <p className="mt-2 opacity-90">Ký túc xá tư nhân</p>
        </div>

        {/* Form */}
        <div className="p-10">
          <h2 className="text-2xl font-semibold text-center mb-8">Đăng nhập hệ thống</h2>

          {error && (
            <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl mb-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl mb-6 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-4 rounded-2xl font-semibold text-lg transition"
            >
              {loading ? 'Đang đăng nhập...' : 'ĐĂNG NHẬP'}
            </button>
          </form>

          {/* Quick Login */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p className="mb-3 font-medium">Tài khoản demo:</p>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <button
                onClick={() => handleQuickLogin('sales')}
                className="cursor-pointer bg-gray-100 hover:bg-gray-200 p-3 rounded-xl transition"
              >
                Kinh doanh
              </button>
              <button
                onClick={() => handleQuickLogin('accountant')}
                className="cursor-pointer bg-gray-100 hover:bg-gray-200 p-3 rounded-xl transition"
              >
                Kế toán
              </button>
              <button
                onClick={() => handleQuickLogin('manager')}
                className="cursor-pointer bg-gray-100 hover:bg-gray-200 p-3 rounded-xl transition"
              >
                Quản lý
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
