import React from "react";

const Spinner = ({
  size = "", //spinner-border-sm, spinner-border-lg, ...
  colour = "", //text-primary, text-secondary, ...
  type = "spinner-grow",
}) => {
  return (
    <div className={`${type} ${colour} ${size}`} role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  );
};

export default Spinner;
