import axios from './axios';

export const createEstimate = async (data) => {
    // data: { product_id, message, quantity }
    const response = await axios.post('estimates/', data);
    return response.data;
};

export const getEstimates = async () => {
    const response = await axios.get('estimates/');
    return response.data;
};
