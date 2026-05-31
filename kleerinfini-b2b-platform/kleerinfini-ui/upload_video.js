import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
  cloud_name: 'dptb2m02i', 
  api_key: '432596188994381', 
  api_secret: 'dHTbwxJTQ8DgiqzHhvt1P2mpLNY' 
});

console.log("Starting large video upload to Cloudinary...");

cloudinary.uploader.upload_large("C:\\Users\\DELL\\Downloads\\15747337_3840_2160_30fps (1) (1).mp4", 
  { resource_type: "video", folder: "kleerinfini/hero", timeout: 1800000 },
  function(error, result) {
    if (error) {
      console.error("Upload Error:", error);
    } else {
      console.log("Upload Success! URL:", result.secure_url);
    }
  });
