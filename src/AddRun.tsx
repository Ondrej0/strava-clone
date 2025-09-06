import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './AddRun.css';

const AddRun = () => {
  const [map, setMap] = useState<L.Map | null>(null);
  const [route, setRoute] = useState<[number, number][]>([]);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [distance, setDistance] = useState<number>(0);
  const [tracking, setTracking] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0); 
  const [runFinished, setRunFinished] = useState<boolean>(false); // new state
  const navigate = useNavigate();

  const BIN_ID = "68bb4696ae596e708fe3f137";
  const MASTER_KEY = "$2a$10$Nm3KfsWepRLgzqkGmoZxGODIbXuck65ARDGAichqW1i1d2ab9/ta2";
  const BIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

  // Timer logic
  useEffect(() => {
    let timer: number | null = null;
    if (tracking) {
      timer = window.setInterval(() => setTime((t) => t + 1), 1000);
    }
    return () => {
      if (timer !== null) window.clearInterval(timer);
    };
  }, [tracking]);

  // Map initialization
  useEffect(() => {
    const newMap = L.map('map').setView([51.505, -0.09], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(newMap);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          newMap.setView([latitude, longitude], 16);
          const marker = L.marker([latitude, longitude]).addTo(newMap)
            .bindPopup('You are here!')
            .openPopup();
          setMap(newMap);
          (newMap as any)._initialMarker = marker;
        },
        (err) => console.error(err),
        { enableHighAccuracy: true }
      );
    } else {
      setMap(newMap);
    }
  }, []);

  // Start run
  const startRun = () => {
    if (!map || !navigator.geolocation) return;
    setTime(0);
    setDistance(0);
    setTracking(true);
    setRunFinished(false); // reset so Save button hides

    if ((map as any)._initialMarker) {
      map.removeLayer((map as any)._initialMarker);
    }

    const newRoute: [number, number][] = [];
    let totalDistance = 0;
    let polyline: L.Polyline | null = null;
    let liveMarker: L.Marker | null = null;

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const newPoint: [number, number] = [latitude, longitude];
        newRoute.push(newPoint);

        if (liveMarker) map.removeLayer(liveMarker);

        const arrowIcon = L.divIcon({
          className: 'arrow-icon',
          html: `<div class="arrow"></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        liveMarker = L.marker(newPoint, { icon: arrowIcon }).addTo(map);

        if (polyline) map.removeLayer(polyline);
        polyline = L.polyline(newRoute, { color: 'blue' }).addTo(map);

        map.setView(newPoint, 18);

        if (newRoute.length > 1) {
          const prevPoint = L.latLng(newRoute[newRoute.length - 2]);
          const currPoint = L.latLng(newPoint);
          totalDistance += prevPoint.distanceTo(currPoint);
        }

        setDistance(totalDistance);
        setRoute([...newRoute]);
      },
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );

    setWatchId(id);
  };

  // Stop run
  const stopRun = () => {
    if (watchId) navigator.geolocation.clearWatch(watchId);
    setTracking(false);
    setRunFinished(true); // show Save button now
  };

  // Save run to JSON Bin
  const saveRun = async () => {
    try {
      const response = await fetch(`${BIN_URL}/latest`, {
        headers: { "X-Master-Key": MASTER_KEY }
      });
      const data = await response.json();

      const newRun = {
        distance: Math.round(distance),
        time,
        date: new Date().toISOString()
      };

      const updatedRuns = [...(data.record.runs || []), newRun];

      await fetch(BIN_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Master-Key": MASTER_KEY
        },
        body: JSON.stringify({ runs: updatedRuns })
      });

      alert("Run saved successfully!");
      setRunFinished(false); // hide Save button after saving
    } catch (error) {
      console.error("Error saving run:", error);
      alert("Failed to save run.");
    }
  };

  // Format time to mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="map-container">
      <div id="map" className="map"></div>
      <div className="buttons">
        {!tracking && <button onClick={startRun}>Start Run</button>}
        {tracking && <button onClick={stopRun}>Stop Run</button>}
        {runFinished && <button onClick={saveRun}>Save Run</button>}
      </div>
      <div className='stats'>
        <p>Distance: {(distance / 1000).toFixed(2)} km</p>
        <p>Time: {formatTime(time)}</p>
      </div>
      <button onClick={() => navigate('/')}>⬅ Back Home</button>
    </div>
  );
};

export default AddRun;
