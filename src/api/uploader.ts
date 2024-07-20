import axios from 'axios';

export const uploadImage = async (file: File) => {
  const data = new FormData();

  data.append('file', file);
  data.append('upload_preset', import.meta.env.VITE_CLOUDINANRY_PRESET || '');

  try {
    const response = await axios({
      method: 'POST',
      url: import.meta.env.VITE_CLOUDINANRY_URL,
      data: data,
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    const url = response.data.secure_url;

    return url;
  } catch (error) {
    console.error('Image Upload Error', error);
    throw error;
  }
};
