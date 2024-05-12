import axios from 'axios';

export const callPrint = async (id) => {
  try {
    const response = await axios.post(
      `${process.env.APP_API}master/purchasing/print/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        responseType: 'arraybuffer',
      }
    );
    const arrayBuffer = await response.data; // No need for response.arrayBuffer() here
    return arrayBuffer;
  } catch (error) {
    console.error('Error fetching PDF:', error);
    throw error; // Rethrow the error or handle it as needed
  }
};
