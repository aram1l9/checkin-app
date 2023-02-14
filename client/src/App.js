import React, { useEffect, useState } from "react";
import { getPlaces, setCheckin } from "./api/guestApi";
import Place from "./components/place";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [places, setPlaces] = useState([]);
  useEffect(() => {
    if (!localStorage.getItem("guestId")) {
      localStorage.setItem("guestId", uuidv4());
    }

    async function fechPlaces() {
      const { data } = await getPlaces(localStorage.getItem("guestId"));
      setPlaces(data);
    }

    fechPlaces();
  }, []);

  const handleCheckin = async (id, cb) => {
    const { data } = await setCheckin({
      placeId: id,
      userId: localStorage.getItem("guestId"),
    });

    cb();

    const newPlaces = [...places].map((el) => {
      let newUserObj = {
        id: data[0].user_id,
        name: `User ${localStorage.getItem("guestId")}`,
      };
      if (el.id === id) {
        return {
          ...el,
          ischecked: "true",
          user_names: el.user_names
            ? [...el.user_names, newUserObj]
            : [newUserObj],
        };
      }
      return el;
    });

    setPlaces(newPlaces);
  };

  return (
    <div className="App">
      {places.map((el) => {
        return <Place onCheckin={handleCheckin} key={el.id} {...el} />;
      })}
    </div>
  );
}

export default App;
