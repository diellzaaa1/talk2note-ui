import httpClient from '@/api/httpClient';

export const createNote = async (noteData, userId) => {
  const noteDataWithUserId = { ...noteData, userId };
  try {
    const response = await httpClient.post('Notes', noteDataWithUserId);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || 'Failed to create note');
  }
};

export const getNoteById = async (noteId) => {
  try {
    const response = await httpClient.get(`/Notes/${noteId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || 'Failed to fetch note');
  }
};

export const getAllNotes = async () => {
  try {
    const response = await httpClient.get('Notes');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || 'Failed to fetch notes');
  }
};

export const getNotesByUserId = async (userId) => {
  try {
    const response = await httpClient.get(`/Notes/user/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || 'Failed to fetch notes for the user');
  }
};

export const getArchivedNotesByUserId = async (userId) => {
  try {
    const response = await httpClient.get(`/Notes/user/${userId}/archived`);
    console.log(response);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || 'Failed to fetch archived notes for the user');
  }
};
export const getLockedNotesByUserId = async (userId) => {
  try {
    const response = await httpClient.get(`/Notes/user/${userId}/locked`);
    console.log(response);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || 'Failed to fetch locked notes for the user');
  }
};
export const getNotesByFolderId = async (folderId) => {
    try {
      const response = await httpClient.get(`/Notes/folder/${folderId}`);
      console.log('Fetched Notes:', response.data);  
      return response.data;
    } catch (error) {
      console.error('Error fetching notes:', error);
      throw new Error(error.response?.data || 'Failed to fetch notes for the folder');
    }
  };
  

export const deleteNote = async (noteId) => {
  try {
    const response = await httpClient.delete(`/Notes/${noteId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || 'Failed to delete note');
  }
};

export const updateNote = async (noteId, updatedNoteData) => {
  try {
    const response = await httpClient.put(`/Notes/${noteId}`, updatedNoteData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || 'Failed to update note');
  }
};

export const updateNoteFolder = async (noteId, folderId) => {
  try {
    const response = await httpClient.patch(`/Notes/${noteId}/folder`, { folderId });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || 'Failed to update note folder');
  }
};

export const archiveNote = async (noteId) => {
  try {
    const response = await httpClient.post(`/Notes/${noteId}/archive`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || 'Failed to archive note');
  }
};

export const addTagToNote = async (noteId, tagData) => {
  try {
    const response = await httpClient.post(`/Notes/${noteId}/add-tag`, tagData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || 'Failed to add tag');
  }
};

export const lockNote = async (noteId, password) => {
  try {
    const response = await httpClient.post(`/Notes/lock/${noteId}`, { password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || 'Failed to lock note');
  }
};

export const unlockNote = async (noteId, password) => {
  try {
    const response = await httpClient.post(`/Notes/unlock/${noteId}`, { password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || 'Failed to unlock note');
  }
};

export const exportNoteAsPdf = async (noteId) => {
  try {
    const response = await httpClient.get(`/Notes/notes/${noteId}/export`, { responseType: 'blob' });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || 'Failed to export note as PDF');
  }
};

export const shareNote = async (userId, noteId, toEmail) => {
  try {
    console.log(userId,noteId,toEmail)
    const response = await httpClient.post(`/Notes/share`, null, {
      params: {
        userId,
        noteId,
        toEmail,
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || 'Failed to share note');
  }
};


