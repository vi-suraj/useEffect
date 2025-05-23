import { useState, useEffect } from "react";

export default function Progressbar({timer}) {
  const [remaningTime, setRemainingTime] = useState(timer);

  useEffect(() => {
    const progressBar = setInterval(() => {
      setRemainingTime((prevTimer) => prevTimer - 10);
    }, 10);
    return () => {
      clearInterval(progressBar);
    };
  }, []);

  return <progress value={remaningTime} max={timer} />;
}
