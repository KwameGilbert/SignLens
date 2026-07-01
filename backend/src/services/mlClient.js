import axios from 'axios';
import config from '../config/index.js';

export const mlClient = {
  async predictImage(fileBuffer, originalName, mimeType) {
    try {
      const formData = new FormData();
      // Node.js >= 18 supports native FormData and Blob
      const blob = new Blob([fileBuffer], { type: mimeType });
      formData.append('file', blob, originalName);

      const url = `${config.mlModelUrl}/api/v1/predict?type=image`;
      
      const response = await axios.post(url, formData, {
        headers: {
          'X-API-Key': config.mlModelApiKey,
        },
      });

      return response.data; // Expected format: { prediction: 'A', confidence: 0.98 }
    } catch (err) {
      console.error('Error communicating with ML server:', err.message);
      if (err.response) {
        throw new Error(`ML Server Error (${err.response.status}): ${JSON.stringify(err.response.data)}`);
      }
      throw new Error(`ML server connection failed: ${err.message}`);
    }
  }
};

export default mlClient;
