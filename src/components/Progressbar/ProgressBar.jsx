// ProgressBar.js

import React from "react";

const ProgressBar = ({ progress }) => {
  return (
    <div className="progress-bar" style={{width:"50%"}}>
      <div
        className="progress"
        style={{ width: `${progress}%`, height: "20px", backgroundColor: "royalblue", borderRadius:"20px" }}
      ></div>
    </div>
  );
};

export default ProgressBar;
