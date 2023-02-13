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
    console.log(data, "dataaa");
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
