import httpClient from '@/api/httpClient';

export const userRegister = async (userData) => {
  try {
    const response = await httpClient.post('/User/register', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || 'Failed to register user');
  }
};

export const userLogin = async (loginData) => {
  try {
    const response = await httpClient.post('/User/login', loginData);
    console.log(response);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || 'Failed to login');
  }
};

export const userLogout = async () => {
  try {
    const response = await httpClient.post('/User/logout');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || 'Failed to logout');
  }
};
export const getUserById = async (userId) => {
    try {
      const response = await httpClient.get(`/User/${userId}`);
      console.log(response.data)
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Failed to fetch user');
    }
  };
  
  export const changePassword = async (changePasswordData) => {
    try {
      const response = await httpClient.post('/User/change-password', changePasswordData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Failed to change password');
    }
  };
// export const googleLogin = async () => {
//   try {
//     const response = await httpClient.get('/api/user/google');
//     return response.data;
//   } catch (error) {
//     throw new Error(error.response?.data || 'Failed to initiate Google login');
//   }
// };

// export const googleCallback = async () => {
//   try {
//     const response = await httpClient.get('/api/user/google/callback');
//     return response.data;
//   } catch (error) {
//     throw new Error(error.response?.data || 'Failed to handle Google callback');
//   }
//};
