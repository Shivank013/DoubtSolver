// ScreenShare.js
import React, { useEffect, useRef } from 'react';

const ScreenShare = ({ stream }) => {
  const videoRef = useRef();

  useEffect(() => {
    const setStreamOnVideo = () => {
      if (videoRef.current && stream && stream instanceof MediaStream) {
        videoRef.current.srcObject = stream;
      }
    };

    setStreamOnVideo();

    return () => {
      // Clean up the video element when the component unmounts
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [stream]);

  return (
    <div className="screen-share-container">
      <video ref={videoRef} autoPlay playsInline />
    </div>
  );
};

export default ScreenShare;
