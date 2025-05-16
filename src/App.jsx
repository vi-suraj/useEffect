import { useEffect, useRef, useState } from "react";

import Places from "./components/Places.jsx";
import { AVAILABLE_PLACES } from "./data.js";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";
import { sortPlacesByDistance } from "./loc.js";

const storedId = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
const storedPlaces = storedId.map((id) => AVAILABLE_PLACES.find((place) => place.id === id));

function App() {
  const selectedPlace = useRef();
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [modelIsOpen, setModelIsOpen] = useState(false);
  const [pickedPlaces, setPickedPlaces] = useState(storedPlaces);

  function handleStartRemovePlace(id) {
    setModelIsOpen(true);
    selectedPlace.current = id;
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const sortedPlaces = sortPlacesByDistance(AVAILABLE_PLACES, position.coords.latitude, position.coords.longitude);
      setAvailablePlaces(sortedPlaces);
    });
  }, []);

  function handleStopRemovePlace() {
    setModelIsOpen(false);
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });

    const storedId = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
    if (!storedId.includes(id)) {
      localStorage.setItem("selectedPlaces", JSON.stringify([id, ...storedId]));
    }
  }

  function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) => prevPickedPlaces.filter((place) => place.id !== selectedPlace.current));
    setModelIsOpen(false);

    const storedId = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
    localStorage.setItem("selectedPlaces", JSON.stringify(storedId.filter((id) => id !== selectedPlace.current)));
  }

  return (
    <>
      <Modal open={modelIsOpen}>
        <DeleteConfirmation onCancel={handleStopRemovePlace} onConfirm={handleRemovePlace} />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>Create your personal collection of places you would like to visit or you have visited.</p>
      </header>
      <main>
        <Places title="I'd like to visit ..." fallbackText={"Select the places you would like to visit below."} places={pickedPlaces} onSelectPlace={handleStartRemovePlace} />
        <Places title="Available Places" places={availablePlaces} fallbackText={"Sorting place as per your location..."} onSelectPlace={handleSelectPlace} />
      </main>
    </>
  );
}

export default App;
