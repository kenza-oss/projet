import React, { useEffect, useState, useRef } from "react";
import { Users, Globe, Package, Map } from "lucide-react";
import first from "../../assets/first.mp4";
import second from "../../assets/second.mp4";
import labo from "../../assets/labo.jpeg";

export default function HeroSection() {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const videoRef = useRef(null);
  const timeoutRef = useRef(null);


  const mediaItems = [
    { type: "image", src: labo, alt: "Labo", duration: 3000 },
    { type: "video", src: first, alt: "First Video" },
    { type: "video", src: second, alt: "Second Video" },
  ];

  const currentMedia = mediaItems[currentMediaIndex];

  const goToNextMedia = () => {
    console.log('Going to next media from current index:', currentMediaIndex);
    setIsVisible(false);
    setTimeout(() => {
      setCurrentMediaIndex((prev) => {
        const nextIndex = prev === mediaItems.length - 1 ? 0 : prev + 1;
        console.log('Moving from index', prev, 'to index:', nextIndex, 'Media:', mediaItems[nextIndex]);
        return nextIndex;
      });
      setIsVisible(true);
    }, 500);
  };

  const clearExistingTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  useEffect(() => {
    console.log('Effect running for index:', currentMediaIndex, 'Type:', currentMedia.type, 'Alt:', currentMedia.alt);

    clearExistingTimeout();

    if (currentMedia.type === "image") {
      console.log('Setting timeout for image:', currentMedia.alt, 'Duration:', currentMedia.duration);
      timeoutRef.current = setTimeout(() => {
        console.log('Image timeout triggered for:', currentMedia.alt);
        goToNextMedia();
      }, currentMedia.duration || 3000);
    } else if (currentMedia.type === "video") {
      console.log('Setting up video:', currentMedia.alt);

      const setupVideo = () => {
        if (videoRef.current) {
          const video = videoRef.current;
          console.log('Video element ready for:', currentMedia.alt);

          const handleVideoError = (e) => {
            console.log('Video error for:', currentMedia.alt, e);
            setCurrentMediaIndex((prev) => {
              const nextIndex = prev === mediaItems.length - 1 ? 0 : prev + 1;
              console.log('Error - Moving from index', prev, 'to index:', nextIndex);
              return nextIndex;
            });
          };

          const handleVideoEnded = () => {
            console.log('Video ended:', currentMedia.alt);
            setCurrentMediaIndex((prev) => {
              const nextIndex = prev === mediaItems.length - 1 ? 0 : prev + 1;
              console.log('Video ended - Moving from index', prev, 'to index:', nextIndex);
              return nextIndex;
            });
          };

          video.onended = null;
          video.onerror = null;

          video.onended = handleVideoEnded;
          video.onerror = handleVideoError;

          video.currentTime = 0;
          video.play().then(() => {
            console.log('Video started playing:', currentMedia.alt);
          }).catch((err) => {
            console.warn("Video play error for:", currentMedia.alt, err);
            timeoutRef.current = setTimeout(() => {
              setCurrentMediaIndex((prev) => {
                const nextIndex = prev === mediaItems.length - 1 ? 0 : prev + 1;
                console.log('Fallback - Moving from index', prev, 'to index:', nextIndex);
                return nextIndex;
              });
            }, 5000);
          });
        }
      };

      setTimeout(setupVideo, 100);
    }

    return () => {
      clearExistingTimeout();
      if (videoRef.current) {
        videoRef.current.onended = null;
        videoRef.current.onerror = null;
      }
    };
  }, [currentMediaIndex, currentMedia]);

  console.log('Current render - Index:', currentMediaIndex, 'Media:', currentMedia.alt, 'Type:', currentMedia.type);

  return (
    <section className="relative h-[90vh] text-white flex items-center justify-center text-center overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full z-0">
        {currentMedia.type === "video" ? (
          <video
            ref={videoRef}
            className={`absolute w-full h-full object-cover transition-opacity duration-500 ${isVisible ? "opacity-100" : "opacity-0"
              }`}
            autoPlay
            muted
            playsInline
            loop={false}
            key={`video-${currentMediaIndex}`}
          >
            <source src={currentMedia.src} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            src={currentMedia.src}
            alt={currentMedia.alt}
            className={`absolute w-full h-full object-cover transition-opacity duration-500 ${isVisible ? "opacity-100" : "opacity-0"
              }`}
            key={`image-${currentMediaIndex}`}
          />
        )}
      </div>

      <div className="relative z-10 px-6">
        <h1 className="text-3xl font-bold mb-4">
          Connectez-vous aux meilleurs producteurs algériens
        </h1>
        <p className="text-xl mb-6">
          Plateforme B2B innovante pour des opportunités mondiales
        </p>


        <div className="flex flex-wrap justify-center gap-8 mb-8">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-orange-500" />
            <span className="text-lg font-semibold">+500 producteurs inscrits</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-orange-500" />
            <span className="text-lg font-semibold">10+ pays desservis</span>
          </div>
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-orange-500" />
            <span className="text-lg font-semibold">1000+ produits exportables</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-full transition shadow-md">
            Explorer les produits
          </button>
          <button className="bg-white text-black hover:bg-gray-100 font-semibold px-6 py-3 rounded-full transition shadow-md flex items-center gap-2">
            <Map className="w-5 h-5" />
            Carte interactive
          </button>
        </div>
      </div>
    </section>
  );
}