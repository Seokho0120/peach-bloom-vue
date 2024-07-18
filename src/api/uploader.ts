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
    const transformedUrl = url.replace('/upload/', '/upload/w_500,ar_1:1,f_auto/');

    return transformedUrl;
  } catch (error) {
    console.error('이미지 업로드 에러 발생 🚨', error);
    throw error;
  }
};
