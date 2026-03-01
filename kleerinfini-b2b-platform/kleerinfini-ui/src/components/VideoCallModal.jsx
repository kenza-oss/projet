import React, { useState } from 'react';
import { X, Minimize2, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VideoCallModal = ({ isOpen, onClose, roomName, displayName }) => {
    const [isMinimized, setIsMinimized] = useState(false);

    if (!isOpen) return null;

    const jitsiUrl = `https://meet.jit.si/${roomName}#config.startWithAudioMuted=false&config.startWithVideoMuted=false&userInfo.displayName="${displayName}"`;

    const containerVariants = {
        full: {
            width: '100vw',
            height: '100vh',
            maxWidth: '1200px',
            maxHeight: '800px',
            bottom: 'auto',
            right: 'auto',
            borderRadius: '2.5rem',
            scale: 1,
            transition: { type: 'spring', damping: 25, stiffness: 200 }
        },
        minimized: {
            width: '320px',
            height: '240px',
            maxWidth: 'none',
            maxHeight: 'none',
            bottom: '24px',
            right: '24px',
            borderRadius: '1.5rem',
            scale: 1,
            transition: { type: 'spring', damping: 25, stiffness: 200 }
        }
    };

    return (
        <AnimatePresence>
            <div className={`fixed z-[200] ${isMinimized ? '' : 'inset-0 flex items-center justify-center p-4 md:p-10'}`}>
                {!isMinimized && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />
                )}
                <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={isMinimized ? "minimized" : "full"}
                    variants={containerVariants}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className={`relative bg-white overflow-hidden shadow-2xl flex flex-col border border-gray-100 ${isMinimized ? 'fixed bottom-6 right-6' : ''}`}
                >
                    {/* Header */}
                    <div className={`${isMinimized ? 'p-3' : 'p-6'} bg-white border-b border-gray-100 flex justify-between items-center z-10`}>
                        <div className="flex items-center gap-3">
                            <div className={`${isMinimized ? 'w-6 h-6' : 'w-10 h-10'} bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg`}>
                                <div className="animate-pulse w-2 h-2 bg-red-400 rounded-full" />
                            </div>
                            {!isMinimized && (
                                <div>
                                    <h2 className="text-sm font-black text-gray-900 uppercase tracking-tighter">Appel Live</h2>
                                    <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">En cours...</p>
                                </div>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsMinimized(!isMinimized)}
                                className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-all active:scale-95"
                                title={isMinimized ? "Agrandir" : "Réduire"}
                            >
                                {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                            </button>
                            <button
                                onClick={onClose}
                                className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all active:scale-95"
                                title="Raccrocher"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Jitsi Iframe */}
                    <div className="flex-1 bg-gray-900 relative">
                        <iframe
                            allow="camera; microphone; fullscreen; display-capture; autoplay"
                            src={jitsiUrl}
                            style={{ width: '100%', height: '100%', border: '0' }}
                            title="Jitsi Meeting"
                        />
                        {isMinimized && <div className="absolute inset-0 bg-transparent cursor-pointer" onClick={() => setIsMinimized(false)} />}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default VideoCallModal;
