import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const token = localStorage.getItem('access_token');
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const fetchUser = async () => {
      try {
        const res = await api.get('/users/me');
        setUser(res.data);
      } catch (error) {
        localStorage.removeItem('access_token');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  } else {
    setLoading(false);
  }
}, []);

  const login = async (nama, password) => {
  const res = await api.post('/login', { nama, password });
  const { access_token, user } = res.data;
  localStorage.setItem('access_token', access_token);
  api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
  setUser(user);
  return user;
};

  const logout = async () => {
    await api.post('/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);