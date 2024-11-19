import httpClient from '@/api/httpClient';

export const getNoteToDosByUserId = async (userId) => {
  try {
    const response = await httpClient.get(`/NoteToDo/user/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || 'Failed to fetch NoteToDos');
  }
};

export const getNoteToDoById = async (id) => {
  try {
    const response = await httpClient.get(`/NoteToDo/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || 'Failed to fetch NoteToDo');
  }
};

export const createNoteToDo = async (noteToDoData) => {
  try {
    const response = await httpClient.post('/NoteToDo', noteToDoData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || 'Failed to create NoteToDo');
  }
};

export const updateNoteToDo = async (noteToDoData) => {
  try {
    await httpClient.put('/NoteToDo', noteToDoData);
  } catch (error) {
    throw new Error(error.response?.data || 'Failed to update NoteToDo');
  }
};

export const deleteNoteToDo = async (id) => {
  try {
    await httpClient.delete(`/NoteToDo/${id}`);
  } catch (error) {
    throw new Error(error.response?.data || 'Failed to delete NoteToDo');
  }
};

export const updateCompletionStatus = async (id, isCompleted) => {
  try {
    const response = await httpClient.patch(`/NoteToDo/${id}/complete`, isCompleted);
    console.log('API response:', response);
  } catch (error) {
    throw new Error(error.response?.data || 'Failed to update completion status');
  }
};



