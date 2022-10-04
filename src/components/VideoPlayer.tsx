import React, { useContext } from 'react';


import { SocketContext } from '../Context.js';


const VideoPlayer = () => {
  const { name, callAccepted, myVideo, userVideo, callEnded, stream, call } = useContext(SocketContext);

  return (
    <div>
      {stream && (
        <div>
            <h3>{name || 'Name'}</h3>
            <video playsInline muted ref={myVideo} autoPlay/>
        </div>
      )}
      {callAccepted && !callEnded && (
        <div>
          <div>
            <h4>{call.name || 'Name'}</h4>
            <video playsInline ref={userVideo} autoPlay/>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;