import httpClient from '@/api/httpClient';

export const startTranscription = async (language) => {
  try {
    console.log('hereee',language);
    const response = await httpClient.post(`http://localhost:5207/api/Transcription/start-transcription?language=${language}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || 'Failed to start transcription');
  }
};



export const stopTranscription = async () => {
  try {
    const response = await httpClient.post('Transcription/stop');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || 'Failed to stop transcription');
  }
};

export const getTranscription = async () => {
  try {
    const response = await httpClient.get('Transcription/get-transcription');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || 'Failed to fetch transcription');
  }
};
