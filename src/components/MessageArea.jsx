// src/components/MessageArea.js
import React from "react";
import "./MessageArea.css";

// type can be 'info', 'error', 'success'
function MessageArea({ message, type = "info" }) {
  if (!message) {
    // Render an empty div to maintain layout space if desired,
    // or return null to render nothing. Let's maintain space.
    return <div className="message-area placeholder"></div>;
  }

  return <div className={`message-area ${type}`}>{message}</div>;
}

export default MessageArea;
