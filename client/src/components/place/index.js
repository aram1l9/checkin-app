import React, { useState } from "react";

function Place(props) {
  const { onCheckin, title, id, user_names, ischecked } = props;
  const [disabled, setDisabled] = useState(false);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
      <span style={{ minWidth: "120px" }}>{title}</span>
      <button
        disabled={disabled || ischecked === "true"}
        onClick={() => {
          setDisabled(true);
          onCheckin(id, () => {
            setDisabled(false);
          });
        }}
      >
        {ischecked === "true" ? "Checked in" : "Check in"}
      </button>
      <span>
        {user_names ? user_names.length : 0}{" "}
        {user_names && user_names.length == 1 ? "user" : "users"} checked in
        here
      </span>
      {ischecked === "true" && user_names && user_names.length > 0 && (
        <div>
          {user_names
            .filter(
              (user) => !user.name.includes(localStorage.getItem("guestId"))
            )
            .map((user, idx, arr) => (
              <span key={user.id}>
                {user.name}
                {idx !== arr.length - 1 && ","}
              </span>
            ))}
          {user_names.filter(
            (user) => !user.name.includes(localStorage.getItem("guestId"))
          ).length > 0 && (
            <>
              {user_names.filter(
                (user) => !user.name.includes(localStorage.getItem("guestId"))
              ).length === 1
                ? " is"
                : " are"}{" "}
              also checked in here.
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Place;
