import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

interface ISocketContext {
  call: any;
  callAccepted: boolean,
  myVideo: any,
  userVideo: any,
  stream: MediaStream,
  name: string,
  setName: (name: string) => void,
  callEnded: boolean,
  clientId: string,
  callUser: (id: string) => void,
  leaveCall: () => void,
  answerCall: () => void,
}

const SocketContext = createContext({} as ISocketContext);

const socket = io('http://localhost:3000');

const ContextProvider = ({ children }: any) => {
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState(new MediaStream());
  const [name, setName] = useState('');
  const [call, setCall] = useState<any>();
  const [clientId, setClientId] = useState('');

  const myVideo = useRef<HTMLVideoElement>(new HTMLVideoElement());
  const userVideo = useRef<HTMLVideoElement>(new HTMLVideoElement());
  const connectionRef = useRef<Peer.Instance>(new Peer);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);

        myVideo.current.srcObject = currentStream;
      });

    socket.on('set-client-id', (id) => setClientId(id));

    socket.on('call-user', ({ from, name: callerName, signal }) => {
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });
  }, []);

  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on('signal', (data: any) => {
      socket.emit('answer-call', { signal: data, to: call.from });
    });

    peer.on('stream', (currentStream: MediaStream) => {
      userVideo.current.srcObject = currentStream;
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
  };

  const callUser = (id: any) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on('signal', (data: any) => {
      socket.emit('call-user', { userToCall: id, signalData: data, from: clientId, name });
    });

    peer.on('stream', (currentStream: any) => {
      userVideo.current.srcObject = currentStream;
    });

    socket.on('call-accepted', (signal) => {
      setCallAccepted(true);

      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);

    connectionRef.current.destroy();

    window.location.reload();
  };

  return (
    <SocketContext.Provider value={{
      call,
      callAccepted,
      myVideo,
      userVideo,
      stream,
      name,
      setName,
      callEnded,
      clientId,
      callUser,
      leaveCall,
      answerCall,
    }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };