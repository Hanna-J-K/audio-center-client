import React, { useState } from "react";

import { useSocket } from "../Context";

const Sidebar = ({ children }) => {
  const {
    clientId,
    callAccepted,
    name,
    setName,
    callEnded,
    leaveCall,
    callUser,
  } = useSocket();
  const [idToCall, setIdToCall] = useState("");

  return (
    <>
      <div>
        <form noValidate autoComplete="off">
          <div>
            <h5>Account Info</h5>
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <h6>{clientId}</h6>
            <h4>Make a call</h4>
            <label>ID to call</label>
            <input
              type="text"
              value={idToCall}
              onChange={(e) => setIdToCall(e.target.value)}
            />
            {callAccepted && !callEnded ? (
              <button type="button" onClick={leaveCall}>
                Hang Up
              </button>
            ) : (
              <button type="button" onClick={() => callUser(idToCall)}>
                Call
              </button>
            )}
          </div>
        </form>
        {children}
      </div>
    </>
  );
};

export default Sidebar;
