import React, {useEffect, useState} from 'react'
import {getPlaces, setCheckin} from './api/guestApi'
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [places,setPlaces] = useState([])
  useEffect(() => {
    async function fechPlaces(){
      const {data} = await getPlaces()
      setPlaces(data)
    }

    fechPlaces()
  
    localStorage.setItem('guestId', uuidv4())

    return () => {
      localStorage.setItem('guestId', null)
    }
  }, [])


  
  const handleCheckin = async (id) => {
    const {data} = await handleCheckin({placeId:id, userId: localStorage.getItem('guestId')})
    console.log(data, "dataaa")
  }

  return (
    <div className="App">
      {places.map(el => {
        return (
          <div key={el.id}>
            <span>{el.title}</span>
            <button onClick={() => handleCheckin(el.id)}>Check in</button>
          </div>
        )
      })}
    </div>
  );
}

export default App;
