// Update the ScreenShare component
import React, { useEffect, useRef } from 'react';

const ScreenShare = ({ socket }) => {
  const videoRef = useRef();

  useEffect(() => {
    const handleScreenShareScreenshot = ({ screenshot }) => {
      if (videoRef.current && screenshot) {
        videoRef.current.src = screenshot;
      }
    };

    socket.on("screen-share-screenshot", handleScreenShareScreenshot);

    return () => {
      socket.off("screen-share-screenshot", handleScreenShareScreenshot);
    };
  }, [socket]);

  return (
    <div className="screen-share-container">
      <video ref={videoRef} autoPlay playsInline />
    </div>
  );
};

export default ScreenShare;
