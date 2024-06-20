import axios from 'axios';

export const handleLogout = async () => {
  try {
    const response = await axios.post('http://localhost:8000/logout', {}, { withCredentials: true });
    return response.data.message;
  } catch (error) {
    console.error('Logout failed:', error);
    return 'Logout failed';
  }
};

