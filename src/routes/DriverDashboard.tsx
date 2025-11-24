import React, { useState, useEffect } from "react";
import "./DriverDashboard.css";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { kandyToColomboRoute } from "./routeData"; // අර කලින් හදාගත්ත file එක import කරන්න
import { FaPlay, FaStop, FaSignOutAlt } from "react-icons/fa";

// --- 1. Bus Icon එක ලස්සනට හදාගමු ---
const busIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3448/3448620.png", // Bus Image
  iconSize: [40, 40], // Size
  iconAnchor: [20, 20], // Center point
  popupAnchor: [0, -20]
});

// --- 2. Map එක Bus එක යන පැත්තට Auto Move වෙන්න පොඩි Component එකක් ---
const MapUpdater = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, map.getZoom());
  }, [center, map]);
  return null;
};

const DriverDashboard: React.FC = () => {
  const [isTripActive, setIsTripActive] = useState<boolean>(false);
  const [location, setLocation] = useState<[number, number]>([7.2906, 80.6337]); // Default: Kandy
  const [watchId, setWatchId] = useState<number | null>(null);

  // --- 3. GPS Tracking Logic ---
  useEffect(() => {
    if (isTripActive) {
      // Trip එක පටන් ගත්තම GPS On වෙනවා
      const id = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Updated Location:", latitude, longitude);
          setLocation([latitude, longitude]);
          
          // TODO: මෙතනදි තමයි Backend එකට location එක යවන්නේ (Socket.io)
          // socket.emit("updateLocation", { lat: latitude, lng: longitude });
        },
        (error) => console.error("GPS Error:", error),
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );
      setWatchId(id);
    } else {
      // Trip එක නැවැත්තුවාම GPS Off වෙනවා
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        setWatchId(null);
      }
    }
    // Cleanup
    return () => {
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
    };
  }, [isTripActive]);

  const toggleTrip = () => {
    setIsTripActive(!isTripActive);
  };

  return (
    <div className="driver-container">
      {/* Sidebar (කලින් තිබුන එකමයි - කෙටි කරලා දැම්මේ) */}
      <aside className="driver-sidebar">
        <div className="logo-area"><h2>SL Bus 🚍</h2></div>
        <div className="driver-info"><p>NB-1234</p></div>
        <button className="logout-btn"><FaSignOutAlt /> Logout</button>
      </aside>

      <main className="driver-content">
        {/* Header Panel */}
        <header className="top-bar">
          <h1>Route: Kandy ➝ Colombo</h1>
          <div className="status-pill">
             Status: <span className={isTripActive ? "online" : "offline"}>
               {isTripActive ? "🟢 Live Tracking" : "🔴 Stopped"}
             </span>
          </div>
        </header>

        {/* --- MAP & CONTROLS SECTION --- */}
        <div className="map-dashboard-layout">
          
          {/* 1. The Map (Lankawe Map eka) */}
          <div className="map-container-box">
            <MapContainer 
              center={location} 
              zoom={13} 
              scrollWheelZoom={true} 
              style={{ height: "100%", width: "100%", borderRadius: "15px" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* A. Route Path (නිල් පාට ඉර) */}
              <Polyline positions={kandyToColomboRoute} color="blue" weight={5} />

              {/* B. Driver's Live Bus Marker */}
              <Marker position={location} icon={busIcon}>
                <Popup>Current Location</Popup>
              </Marker>

              {/* C. Auto Center Map */}
              <MapUpdater center={location} />
            </MapContainer>
          </div>

          {/* 2. Controls (Start/Stop Button) */}
          <div className="controls-panel">
            <div className="card action-card">
              <h3>Driver Controls</h3>
              <div className={`indicator-ring ${isTripActive ? "pulsing" : ""}`}>
                <button 
                  className={`trip-btn ${isTripActive ? "stop-btn" : "start-btn"}`}
                  onClick={toggleTrip}
                >
                  {isTripActive ? <FaStop size={30} /> : <FaPlay size={30} />}
                  <span>{isTripActive ? "END" : "START"}</span>
                </button>
              </div>
              <p className="speed-text">Speed: {isTripActive ? "45 km/h" : "0 km/h"}</p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default DriverDashboard;