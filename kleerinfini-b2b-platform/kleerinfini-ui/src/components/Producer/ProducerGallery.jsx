import React from 'react';

const ProducerGallery = ({ images }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {images.map((img, idx) => (
        <img
          key={idx}
          src={img}
          alt={`gallery-${idx}`}
          className="w-full h-40 object-cover rounded-xl shadow-sm hover:shadow-md transition"
        />
      ))}
    </div>
  );
};

export default ProducerGallery;
