import { startTranscription, stopTranscription, getTranscription } from '@/services/Transcription/transcription.js';

const state = {
  transcriptionText: '',
  error: null,
  isTranscribing: false,
};

const getters = {
  transcriptionText: (state) => state.transcriptionText,
  isTranscribing: (state) => state.isTranscribing,
  error: (state) => state.error,
};

const actions = {
  async beginTranscription({ commit }, language) {
    try {
      console.log('heree',language)
      commit('SET_ERROR', null);  
      commit('SET_IS_TRANSCRIBING', true);
      await startTranscription(language);
      commit('SET_IS_TRANSCRIBING', true);
    } catch (error) {
      commit('SET_ERROR', error.message);
    }
  },

  async endTranscription({ commit }) {
    try {
      await stopTranscription();
      commit('SET_IS_TRANSCRIBING', false);
    } catch (error) {
      commit('SET_ERROR', error.message);
    }
  },

  async fetchTranscription({ commit }) {
    try {
      const transcription = await getTranscription();
      commit('SET_TRANSCRIPTION_TEXT', transcription);
    } catch (error) {
      commit('SET_ERROR', error.message);
    }
  },
};

const mutations = {
  SET_TRANSCRIPTION_TEXT(state, transcription) {
    state.transcriptionText = transcription;
  },
  SET_IS_TRANSCRIBING(state, isTranscribing) {
    state.isTranscribing = isTranscribing;
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
