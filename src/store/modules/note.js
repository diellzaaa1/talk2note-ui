import {
    createNote,
    getNoteById,
    getNotesByUserId,
    getArchivedNotesByUserId,
    getLockedNotesByUserId,
    getNotesByFolderId,
    deleteNote,
    updateNote,
    updateNoteFolder,
    archiveNote,
    addTagToNote,
    lockNote,
    unlockNote,
    exportNoteAsPdf,
    shareNote
  } from '@/services/Note/note';
  
  const state = {
    notes: [],
    currentNote: null,
    selectedNote: null,  

    error: null
  };
  
  const getters = {
    allNotes: (state) => state.notes,
    currentNote: (state) => state.currentNote,
    error: (state) => state.error,
    getSelectedNote(state) {
      return state.selectedNote;
    }
  };
  
  const mutations = {
    ADD_NOTE(state, note) {
      state.notes.push(note);
    },
    SET_NOTE(state, note) {
      state.currentNote = note;
    },
    SET_NOTES(state, notes) {
      state.notes = notes;
    },
    UPDATE_NOTE_STATUS(state, { noteId, status }) {
      const note = state.notes.find((n) => n.id === noteId);
      if (note) {
        note.status = status;
      }
    },
    UPDATE_NOTE_TAGS(state, { noteId, tagData }) {
      const note = state.notes.find((n) => n.id === noteId);
      if (note) {
        note.tags.push(tagData);
      }
    },
    UPDATE_NOTE_LOCK(state, { noteId, locked }) {
      const note = state.notes.find((n) => n.id === noteId);
      if (note) {
        note.locked = locked;
      }
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    setSelectedNote(state, note) {
      state.selectedNote = note;
    },
  };
  
  const actions = {
    async createNote({ commit }, { noteData, userId }) {
      try {
        const note = await createNote(noteData, userId);
        commit('ADD_NOTE', note);
      } catch (error) {
        commit('SET_ERROR', error.message);
      }
    },
  
    async fetchNoteById({ commit }, noteId) {
      try {
        const note = await getNoteById(noteId);
        commit('SET_NOTE', note);
         return note;
      } catch (error) {
        commit('SET_ERROR', error.message);
      }
    },
  
    async fetchNotesByUserId({ commit }, userId) {
      try {
        const notes = await getNotesByUserId(userId);
        commit('SET_NOTES', notes);
        return notes;
      } catch (error) {
        commit('SET_ERROR', error.message);
      }
    },
  
    async fetchArchivedNotesByUserId({ commit }, userId) {
        try {
          const notes = await getArchivedNotesByUserId(userId);
          console.log('Archived Notes:', notes); 
          commit('SET_NOTES', notes); 
          return notes; 
        } catch (error) {
          console.error('Error fetching archived notes:', error.message);
          commit('SET_ERROR', error.message);
          throw error; 
        }
      }
      ,
      
    async fetchLockedNotesByUserId({ commit }, userId) {
      try {
        const notes = await getLockedNotesByUserId(userId);
        console.log('Locked Notes:', notes);
        commit('SET_NOTES', notes); 
        return notes; 
      } catch (error) {
        console.error('Error fetching locked notes:', error.message);
        commit('SET_ERROR', error.message);
        throw error; 
      }
    },
    async fetchNotesByFolderId({ commit }, folderId) {
        try {
          const notes = await getNotesByFolderId(folderId);
          console.log('Notes received in Vuex action:', notes);  
          commit('SET_NOTES', notes);
          return notes;
        } catch (error) {
          console.error('Error in Vuex action:', error);
          commit('SET_ERROR', error.message);
          throw error;
        }
      }
      
,      
                   
  
    async deleteNoteAsync({ commit }, noteId) {
      try {
        await deleteNote(noteId);
        commit('SET_NOTES', state.notes.filter((note) => note.id !== noteId));
      } catch (error) {
        commit('SET_ERROR', error.message);
      }
    },
  
    async updateNoteAsync({ commit }, { noteId, updatedNoteData }) {
      try {
        const updatedNote = await updateNote(noteId, updatedNoteData);
        commit('SET_NOTE', updatedNote);
      } catch (error) {
        commit('SET_ERROR', error.message);
      }
    },
  
    async updateNoteFolderAsync({ commit }, { noteId, folderId }) {
      try {
        const updatedNote = await updateNoteFolder(noteId, folderId);
        commit('SET_NOTE', updatedNote);
      } catch (error) {
        commit('SET_ERROR', error.message);
      }
    },
  
    async archiveNoteAsync({ commit }, noteId) {
      try {
        await archiveNote(noteId);
        commit('UPDATE_NOTE_STATUS', { noteId, status: 'archived' });
      } catch (error) {
        commit('SET_ERROR', error.message);
      }
    },
  
    async addTagToNoteAsync({ commit }, { noteId, tagData }) {
      try {
        await addTagToNote(noteId, tagData);
        commit('UPDATE_NOTE_TAGS', { noteId, tagData });
      } catch (error) {
        commit('SET_ERROR', error.message);
      }
    },
  
    async lockNoteAsync({ commit }, { noteId, password }) {
      try {
        await lockNote(noteId, password); 
        commit('UPDATE_NOTE_LOCK', { noteId, locked: true });
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw new Error(error.message); 
      }
    },
  
    async unlockNoteAsync({ commit }, { noteId, password }) {
      try {
        const response = await unlockNote(noteId, password);
        commit('UPDATE_NOTE_LOCK', { noteId, locked: false });
        return response;
      } catch (error) {
        if (error.response && error.response.status === 401) {
          return { status: 401, message: 'Invalid password' };
        }
        throw error; 
      }
    },    
  
    async exportNoteAsPdfAsync({ commit }, noteId) {
      try {
        const pdfContent = await exportNoteAsPdf(noteId);
        
        const pdfBlob = new Blob([pdfContent], { type: 'application/pdf' });
        const pdfURL = URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = pdfURL;
        a.download = `note_${noteId}.pdf`;
        a.click();
        
        URL.revokeObjectURL(pdfURL);
      } catch (error) {
        commit('SET_ERROR', error.message);
      }
    },
  
    async shareNoteAsync({ commit }, { userId, noteId, toEmail }) {
      try {
        const shareResponse = await shareNote(userId, noteId, toEmail);
        console.log(shareResponse); 
      } catch (error) {
        commit('SET_ERROR', error.message);
      }
    }
  };
  
  export default {
    namespaced: true,  
    state,
    getters,
    mutations,
    actions
  };
  