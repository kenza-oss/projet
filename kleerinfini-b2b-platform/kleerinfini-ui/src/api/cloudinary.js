import axios from 'axios';

const CLOUD_NAME = 'dptb2m02i';
const UPLOAD_PRESET = 'kleerinfini_unsigned';

/**
 * Uploads a file directly to Cloudinary using unsigned upload preset.
 * 
 * @param {File} file - The file object to upload
 * @param {string} folder - The destination folder on Cloudinary (e.g., 'products', 'categories')
 * @param {function} onProgress - Callback function for upload progress tracking: (percentage) => {}
 * @returns {Promise<{secure_url: string, public_id: string, resource_type: string}>}
 */
export async function uploadToCloudinary(file, folder, onProgress) {
  // Determine resource type based on file type
  let resourceType = 'auto'; // default to auto-detect
  if (file.type.startsWith('video/')) {
    resourceType = 'video';
  } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
    // Note: Cloudinary expects PDF to be uploaded as 'image' or 'raw' depending on settings,
    // but 'auto' is usually best because Cloudinary handles it. We can stick to 'auto' or use 'image'/'raw'.
    resourceType = 'auto';
  }

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  if (folder) {
    formData.append('folder', folder);
  }

  try {
    const response = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    });

    return {
      secure_url: response.data.secure_url,
      public_id: response.data.public_id,
      resource_type: response.data.resource_type,
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.error?.message || 
      'Erreur lors du chargement du fichier vers le serveur de stockage.'
    );
  }
}
