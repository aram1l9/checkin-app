import React, { useState } from "react";

function Place(props) {
  const { onCheckin, title, id } = props;
  const [disabled, setDisabled] = useState(false);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
      <span style={{ minWidth: "120px" }}>{title}</span>
      <button
        disabled={disabled}
        onClick={() => {
          setDisabled(true);
          onCheckin(id, () => {
            setDisabled(false);
          });
        }}
      >
        Check in
      </button>
    </div>
  );
}

export default Place;
