import { userRegister, userLogin, userLogout, getUserById, changePassword } from '@/services/User/user';

export default {
    namespaced: true,
  state: {
    user: null,
    token: null,
    isAuthenticated: false,
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
      state.isAuthenticated = true;
    },
    LOGOUT(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    SET_TOKEN(state, token) {
      state.token = token;
    },
    SET_USER_PASSWORD(state, newPassword) {
      if (state.user) {
        state.user.password = newPassword; 
      }
    },
  },
  actions: {
    async registerUser({ commit }, userData) {
      try {
        const data = await userRegister(userData);
        commit('SET_USER', data.user);
        commit('SET_TOKEN', data.token);
        return data;
      } catch (error) {
        console.error('Error during registration:', error);
      }
    },
    async loginUser({ commit }, loginData) {
      try {
        const response = await userLogin(loginData);
        commit('SET_USER', response.user);
        commit('SET_TOKEN', response.token);
        return response.token; 
      } catch (error) {
        console.error('Error during login:', error);
      }
    },
    async logoutUser({ commit }) {
      try {
        await userLogout();
        commit('LOGOUT');
      } catch (error) {
        console.error('Error during logout:', error);
      }
    },
    async getUserById({ commit }, userId) {
      try {
        const user = await getUserById(userId);
        commit('SET_USER', user);
        return user;
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    },
    async changePassword({ commit }, changePasswordData) {
      try {
        const result = await changePassword(changePasswordData);
        if (result) {
          commit('SET_USER_PASSWORD', changePasswordData.newPassword);
        }
      } catch (error) {
        console.error('Error changing password:', error);
      }
    },
  },
  getters: {
    isAuthenticated: (state) => state.isAuthenticated,
    getUser: (state) => state.user,
    getToken: (state) => state.token,
  },
};
