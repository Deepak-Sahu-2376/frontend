import React, { useState } from 'react';

const VideoPlayer = ({
    src,
    poster,
    className = "",
    videoClassName = "",
    overlayClassName = "bg-black/20",
    children
}) => {
    const [videoLoaded, setVideoLoaded] = useState(false);

    return (
        <div className={`relative overflow-hidden ${className}`}>
            {/* Placeholder Image */}
            {poster && (
                <div
                    className={`absolute inset-0 z-20 transition-opacity duration-700 ease-in-out ${videoLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                >
                    <img
                        src={poster}
                        alt="Video Placeholder"
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            {/* Video Element */}
            <video
                className={`w-full h-full object-cover relative z-10 ${videoClassName}`}
                src={src}
                autoPlay
                loop
                muted
                playsInline
                onLoadedData={() => setVideoLoaded(true)}
            >
                <source src={src} type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Optional Overlay (like dark tint) */}
            <div className={`absolute inset-0 z-30 pointer-events-none transition-opacity duration-700 ${overlayClassName} ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}>
                {children}
            </div>
        </div>
    );
};

export default VideoPlayer;
