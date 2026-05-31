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
/**
 * Helper to compress image client-side using Canvas.
 * @param {File} file 
 * @returns {Promise<File>}
 */
function compressImage(file, maxWidth = 1600, maxHeight = 1600, quality = 0.75) {
  return new Promise((resolve) => {
    // If it's not a compressable image format, skip compression
    if (!file.type.startsWith('image/') || file.type === 'image/gif' || file.type === 'image/svg+xml') {
      return resolve(file);
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const exportType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        canvas.toBlob((blob) => {
          if (!blob) {
            return resolve(file);
          }
          const compressedFile = new File([blob], file.name, {
            type: exportType,
            lastModified: Date.now(),
          });

          if (compressedFile.size < file.size) {
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        }, exportType, quality);
      };
      img.onerror = () => resolve(file);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads a file directly to Cloudinary using unsigned upload preset.
 * 
 * @param {File} file - The file object to upload
 * @param {string} folder - The destination folder on Cloudinary (e.g., 'products', 'categories')
 * @param {function} onProgress - Callback function for upload progress tracking: (percentage) => {}
 * @returns {Promise<{secure_url: string, public_id: string, resource_type: string}>}
 */
export async function uploadToCloudinary(file, folder, onProgress) {
  let processedFile = file;

  // 1. If it's an image, compress it first
  if (file.type.startsWith('image/')) {
    try {
      processedFile = await compressImage(file);
      console.log(`Image compressed: original size = ${(file.size / 1024 / 1024).toFixed(2)}MB, new size = ${(processedFile.size / 1024 / 1024).toFixed(2)}MB`);
    } catch (e) {
      console.warn("Failed to compress image, using original file:", e);
    }
  }

  // 2. Enforce 10MB size limit (Cloudinary free tier limit for raw/images/unsigned uploads)
  const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
  if (processedFile.size > MAX_SIZE_BYTES) {
    throw new Error(
      `Le fichier "${processedFile.name}" est trop volumineux (${(processedFile.size / 1024 / 1024).toFixed(2)} Mo). La taille maximale autorisée est de 10 Mo pour l'abonnement gratuit.`
    );
  }

  // Determine resource type based on file type
  let resourceType = 'auto'; // default to auto-detect
  if (processedFile.type.startsWith('video/')) {
    resourceType = 'video';
  } else if (processedFile.type === 'application/pdf' || processedFile.name.endsWith('.pdf')) {
    resourceType = 'auto';
  }

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`;

  const formData = new FormData();
  formData.append('file', processedFile);
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

