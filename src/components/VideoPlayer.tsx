import React, { useContext } from 'react';


import { useSocket } from '../Context.js';


const VideoPlayer = () => {
  const { name, callAccepted, showVideo, callEnded, stream, call } = useSocket();

  return (
    <div>
      {stream && (
        <div>
            <h3>{name || 'Name'}</h3>
            <video playsInline muted ref={showVideo} autoPlay/>
        </div>
      )}
      {callAccepted && !callEnded && (
        <div>
          <div>
            <h4>{call.name || 'Name'}</h4>
            <video playsInline ref={showVideo} autoPlay/>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;