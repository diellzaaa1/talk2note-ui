import httpClient from '@/api/httpClient';
import { getUserIdFromToken } from '@/utils/authUtils';

export const createFolder = async (folderData) => {
  
  const userId = getUserIdFromToken(); 
  console.log('User ID:', userId);

  const folderDataWithUserId = { ...folderData, userId }; 
  
  try {
    const response = await httpClient.post('Folder', folderDataWithUserId);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || 'Failed to create folder');
  }
};

export const getFolderById = async (folderId) => {
  try {
    const response = await httpClient.get(`/Folder/${folderId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || 'Failed to fetch folder');
  }
};

export const getFoldersByUserId = async (userId) => {
  try {
    const response = await httpClient.get(`/Folder/user/${userId}`);
    console.log(response);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || 'Failed to fetch folders by user ID');
  }
};
