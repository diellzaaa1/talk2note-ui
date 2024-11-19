import { createFolder, getFolderById, getFoldersByUserId } from '@/services/Folder/folder';

const state = {
  folders: [],
  currentFolder: null,
  error: null,
};

const getters = {
  allFolders: (state) => state.folders,
  folderById: (state) => state.currentFolder,
};

const actions = {
  async createFolder({ commit }, folderData) {
    try {
      const folder = await createFolder(folderData);
      commit('ADD_FOLDER', folder);
    } catch (error) {
      commit('SET_ERROR', error.message);
    }
  },

  async fetchFolderById({ commit }, folderId) {
    try {
      const folder = await getFolderById(folderId);
      commit('SET_CURRENT_FOLDER', folder);
    
    } catch (error) {
      commit('SET_ERROR', error.message);
    }
  },

  async fetchFoldersByUserId({ commit }, userId) {
    try {
      const folders = await getFoldersByUserId(userId);
      commit('SET_FOLDERS', folders);
      return folders;
    } catch (error) {
      commit('SET_ERROR', error.message);
    }
  },
};

const mutations = {
  ADD_FOLDER(state, folder) {
    state.folders.push(folder);
  },
  SET_CURRENT_FOLDER(state, folder) {
    state.currentFolder = folder;
  },
  SET_FOLDERS(state, folders) {
    state.folders = folders;
  },
  SET_ERROR(state, error) {
    state.error = error;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
