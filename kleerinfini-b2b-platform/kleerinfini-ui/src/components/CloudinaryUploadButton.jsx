import React, { useState, useRef } from 'react';
import { uploadToCloudinary } from '../api/cloudinary';
import { FaCloudUploadAlt, FaTrashAlt, FaFilePdf, FaVideo, FaFileAlt, FaSpinner } from 'react-icons/fa';

/**
 * Reusable Cloudinary Direct Upload Component
 * 
 * @param {string} value - Current file URL
 * @param {string} folder - Destination folder on Cloudinary (e.g., 'products', 'categories')
 * @param {function} onUploaded - Callback when upload completes: (url, publicId) => {}
 * @param {function} onClear - Callback when file is deleted/cleared
 * @param {string} accept - Accept attribute for input (e.g., 'image/*', '.pdf', 'video/*')
 * @param {string} label - Label for the upload zone
 * @param {string} helperText - Small instruction text below
 * @param {boolean} isVideo - Flag to treat/display file as video preview
 * @param {boolean} isPdf - Flag to treat/display file as PDF preview
 */
export default function CloudinaryUploadButton({
  value,
  folder = 'general',
  onUploaded,
  onClear,
  accept = 'image/*',
  label = 'Télécharger un fichier',
  helperText = 'Formats acceptés: JPG, PNG, WEBP.',
  isVideo = false,
  isPdf = false,
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Optional client-side size check (max 5MB for images, 100MB for video)
    const isLargeVideo = file.type.startsWith('video/') && file.size > 100 * 1024 * 1024;
    const isLargeImage = file.type.startsWith('image/') && file.size > 10 * 1024 * 1024;
    const isLargeFile = !file.type.startsWith('video/') && !file.type.startsWith('image/') && file.size > 20 * 1024 * 1024;

    if (isLargeVideo || isLargeImage || isLargeFile) {
      setError("Le fichier sélectionné est trop lourd. Veuillez choisir un fichier plus léger.");
      return;
    }

    setIsUploading(true);
    setProgress(0);
    setError(null);

    try {
      const result = await uploadToCloudinary(file, folder, (percent) => {
        setProgress(percent);
      });
      if (onUploaded) {
        onUploaded(result.secure_url, result.public_id);
      }
    } catch (err) {
      setError(err.message || "Erreur de chargement. Veuillez réessayer.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    if (isUploading) return;

    const file = e.dataTransfer.files[0];
    if (!file) return;

    // Check if accept type matches
    const acceptedTypes = accept.split(',').map(type => type.trim());
    const matchesAccept = acceptedTypes.some(type => {
      if (type.endsWith('/*')) {
        const category = type.split('/')[0];
        return file.type.startsWith(category + '/');
      }
      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type.toLowerCase());
      }
      return file.type === type;
    });

    if (!matchesAccept) {
      setError("Type de fichier non supporté pour cette zone.");
      return;
    }

    setIsUploading(true);
    setProgress(0);
    setError(null);

    try {
      const result = await uploadToCloudinary(file, folder, (percent) => {
        setProgress(percent);
      });
      if (onUploaded) {
        onUploaded(result.secure_url, result.public_id);
      }
    } catch (err) {
      setError(err.message || "Erreur de chargement. Veuillez réessayer.");
    } finally {
      setIsUploading(false);
    }
  };

  const getFileNameFromUrl = (url) => {
    if (!url) return '';
    try {
      const parts = url.split('/');
      return decodeURIComponent(parts[parts.length - 1]);
    } catch (e) {
      return 'Fichier téléchargé';
    }
  };

  return (
    <div className="w-full">
      {value ? (
        // Preview and clear state
        <div className="border border-gray-200 rounded-2xl p-4 bg-white shadow-sm flex flex-col items-center justify-between gap-4 transition-all hover:shadow-md">
          <div className="w-full flex items-center gap-4">
            {/* Visual Preview */}
            {!isVideo && !isPdf && value.match(/\.(jpeg|jpg|gif|png|webp|svg)/i) ? (
              <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 flex-shrink-0">
                <img src={value} alt="Preview" className="w-full h-full object-cover" />
              </div>
            ) : isVideo || value.match(/\.(mp4|webm|mov)/i) ? (
              <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-100 bg-black flex-shrink-0 flex items-center justify-center text-white">
                <FaVideo size={20} className="text-blue-400" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-xl border border-gray-100 bg-blue-50 flex-shrink-0 flex items-center justify-center text-blue-500">
                <FaFilePdf size={24} />
              </div>
            )}

            {/* File Info */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-800 truncate">
                {getFileNameFromUrl(value)}
              </p>
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-blue-500 hover:text-blue-600 font-bold uppercase tracking-wider inline-block mt-1"
              >
                Voir le fichier en ligne
              </a>
            </div>

            {/* Clear Button */}
            {onClear && (
              <button
                type="button"
                onClick={onClear}
                className="p-3 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition duration-200"
                title="Supprimer"
              >
                <FaTrashAlt size={14} />
              </button>
            )}
          </div>
        </div>
      ) : (
        // Upload state
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3
            ${isUploading 
              ? 'border-blue-300 bg-blue-50/20 cursor-wait' 
              : 'border-gray-200 bg-slate-50/50 hover:bg-blue-50/30 hover:border-blue-500'
            }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={accept}
            className="hidden"
            disabled={isUploading}
          />

          {isUploading ? (
            <div className="flex flex-col items-center gap-3 py-2">
              <FaSpinner className="animate-spin text-blue-600" size={32} />
              <div className="w-48 bg-gray-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs font-bold text-blue-600">Chargement... {progress}%</p>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-blue-500 transition duration-300 group-hover:scale-105">
                <FaCloudUploadAlt size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">{label}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">{helperText}</p>
              </div>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="mt-2 text-xs text-red-500 font-medium pl-1 flex items-center gap-1">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
}
