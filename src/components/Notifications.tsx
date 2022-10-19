import React from "react";

import { useSocket } from "../Context";

const Notifications = () => {
  const { answerCall, call, callAccepted } = useSocket();

  return (
    <div>
      {call.isReceivingCall && !callAccepted && (
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <h1>{call.name} is calling:</h1>
          <button type="button" color="primary" onClick={answerCall}>
            Answer
          </button>
        </div>
      )}
    </div>
  );
};

export default Notifications;
