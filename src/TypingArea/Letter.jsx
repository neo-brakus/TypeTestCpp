import React from "react";
import './Letter.css'

function Letter({ char, status = "" }) {
  return (
    <span className={`letter ${status}`.trim()}>
      {char}
    </span>
  );
}

export default React.memo(Letter);