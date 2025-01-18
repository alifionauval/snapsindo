// utils/token.js

// Simpan token ke localStorage
export const saveToken = (token) => {
    localStorage.setItem('token', token);
  };
  
  // Ambil token dari localStorage
  export const getToken = () => {
    return localStorage.getItem('token');
  };
  
  // Hapus token dari localStorage (misalnya saat logout)
  export const removeToken = () => {
    localStorage.removeItem('token');
  };
  