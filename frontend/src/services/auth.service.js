import API from './api';

class AuthService {
  login(username, password) {
    return API.post('/auth/login', { username, password }).then((res) => {
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }
      return res.data.user;
    });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return API.post('/auth/logout');
  }

  getCurrentUser() {
    return API.get('/auth/me');
  }

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
}

export default new AuthService();
