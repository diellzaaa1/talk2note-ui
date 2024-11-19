import {
    getNoteToDosByUserId,
    getNoteToDoById,
    createNoteToDo,
    updateNoteToDo,
    deleteNoteToDo,
    updateCompletionStatus,
  } from '@/services/NoteToDo/noteToDo';
  
  const state = {
    noteToDos: [],
    currentNoteToDo: null,
    error: null,
    
  };
  
  const getters = {
    allNoteToDos: (state) => state.noteToDos,
    noteToDoById: (state) => state.currentNoteToDo,
  };
  
  const actions = {
    async fetchNoteToDosByUserId({ commit }, userId) {
      try {
        const noteToDos = await getNoteToDosByUserId(userId);
        console.log("here",noteToDos)
        commit('SET_NOTE_TODOS', noteToDos);
        return noteToDos;
      
      } catch (error) {
        commit('SET_ERROR', error.message);
      }
    },
  
    async fetchNoteToDoById({ commit }, id) {
      try {
        const noteToDo = await getNoteToDoById(id);
        commit('SET_CURRENT_NOTE_TODO', noteToDo);
      } catch (error) {
        commit('SET_ERROR', error.message);
      }
    },
  
    async createNoteToDo({ commit }, noteToDoData) {
      try {
        const newNoteToDo = await createNoteToDo(noteToDoData);
        commit('ADD_NOTE_TODO', newNoteToDo);
      } catch (error) {
        commit('SET_ERROR', error.message);
      }
    },
  
    async updateNoteToDo({ commit }, noteToDoData) {
      try {
        await updateNoteToDo(noteToDoData);
        commit('UPDATE_NOTE_TODO', noteToDoData);
      } catch (error) {
        commit('SET_ERROR', error.message);
      }
    },
  
    async deleteNoteToDo({ commit }, id) {
      try {
        await deleteNoteToDo(id);
        commit('REMOVE_NOTE_TODO', id);
      } catch (error) {
        commit('SET_ERROR', error.message);
      }
    },
  
    async updateCompletionStatus({ commit }, { id, isCompleted }) {
        try {
          await updateCompletionStatus(id, isCompleted); 
          commit('UPDATE_COMPLETION_STATUS', { id, isCompleted });
        } catch (error) {
          commit('SET_ERROR', error.message);
          console.error('Error updating completion status:', error);
        }
      }
      
}      
  
  const mutations = {
    SET_NOTE_TODOS(state, noteToDos) {
      state.noteToDos = noteToDos;
    },
    SET_CURRENT_NOTE_TODO(state, noteToDo) {
      state.currentNoteToDo = noteToDo;
    },
    ADD_NOTE_TODO(state, noteToDo) {
      state.noteToDos.push(noteToDo);
    },
    UPDATE_NOTE_TODO(state, updatedNoteToDo) {
      const index = state.noteToDos.findIndex((n) => n.id === updatedNoteToDo.id);
      if (index !== -1) {
        state.noteToDos.splice(index, 1, updatedNoteToDo);
      }
    },
    REMOVE_NOTE_TODO(state, id) {
      state.noteToDos = state.noteToDos.filter((n) => n.id !== id);
    },
    UPDATE_COMPLETION_STATUS(state, { id, isCompleted }) {
        const task = state.noteToDos.find(task => task.id === id);
        if (task) {
          task.isCompleted = isCompleted;
        }
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
  