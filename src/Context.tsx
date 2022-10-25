import React, {
  createContext,
  useState,
  useRef,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { io } from "socket.io-client";
import { Peer } from "peerjs";

interface ISocketContext {
  call: any;
  callAccepted: boolean;
  myVideo: any;
  userVideo: any;
  stream: MediaStream;
  name: string;
  setName: (name: string) => void;
  callEnded: boolean;
  clientId: string;
  callUser: (id: string) => void;
  leaveCall: () => void;
  answerCall: () => void;
  showVideo: (node: HTMLVideoElement) => void;
}

const SocketContext = createContext({} as ISocketContext);

const socket = io("http://localhost:3000");

const ContextProvider = ({ children }: any) => {
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState(new MediaStream());
  const [name, setName] = useState("");
  const [call, setCall] = useState<any>({
    isReceivingCall: false,
    from: "",
    name: "",
    signal: "",
  });
  const [clientId, setClientId] = useState("");

  const myVideo = useRef<HTMLVideoElement | null>(null);
  const userVideo = useRef<HTMLVideoElement | null>(null);
  const connectionRef = useRef<Peer | null>(null);

  const showVideo = useCallback((node: HTMLVideoElement) => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        console.log(currentStream);
        setStream(currentStream);
        if (node) {
          node.srcObject = currentStream;
        }
      });
    myVideo.current = node;

    socket.on("set-client-id", (id) => setClientId(id));

    socket.on("call-user", ({ from, name: callerName, signal }) => {
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });
  }, []);

  useEffect(() => {
    connectionRef.current = new Peer(clientId);
  }, [clientId]);

  const answerCall = () => {
    setCallAccepted(true);

    if (connectionRef.current) {
      connectionRef.current.on("call", (incomingCall) => {
        socket.emit("answer-call", { signal: incomingCall, to: call.from });

        call.answer(stream);

        call.on("stream", (currentStream: MediaStream) => {
          if (userVideo.current) {
            userVideo.current.srcObject = currentStream;
          }
        });
      });
    }
  };

  const callUser = useCallback(
    (id: any) => {
      if (connectionRef.current) {
        const call = connectionRef.current.call(id, stream);

        socket.emit("call-user", { userToCall: id, from: clientId, name });

        call.on("stream", (currentStream: MediaStream) => {
          if (userVideo.current) {
            userVideo.current.srcObject = currentStream;
          }
        });

        socket.on("call-accepted", (signal) => {
          setCallAccepted(true);
        });
      }
    },
    [clientId, name, stream],
  );

  const leaveCall = () => {
    setCallEnded(true);

    if (connectionRef.current) {
      connectionRef.current.destroy();
    }

    window.location.reload();
  };

  return (
    <SocketContext.Provider
      value={{
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
        showVideo,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export function useSocket() {
  return useContext(SocketContext);
}

export { ContextProvider, SocketContext };
