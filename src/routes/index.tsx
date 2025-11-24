import React, { useState, useEffect } from "react";
import "./DriverDashboard.css";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { kandyToColomboRoute } from "./routeData"; 
import { 
  FaBus, FaPlay, FaStop, FaSignOutAlt, 
  FaThLarge, FaClipboardList, FaQuestionCircle, FaCog, FaClock 
} from "react-icons/fa";

// --- Bus Icon ---
const busIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3448/3448620.png",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20]
});

// --- Map Auto Center Component ---
const MapUpdater = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, map.getZoom());
  }, [center, map]);
  return null;
};

const DriverDashboard: React.FC = () => {
  const [isTripActive, setIsTripActive] = useState<boolean>(false);
  const [location, setLocation] = useState<[number, number]>([7.2906, 80.6337]); 
  const [currentTime, setCurrentTime] = useState<string>(new Date().toLocaleTimeString());
  const [activeTab, setActiveTab] = useState<string>("dashboard"); // Navigation සදහා state එකක්

  // --- Live Clock Logic ---
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // --- GPS Logic (Simulated) ---
  useEffect(() => {
    let watchId: number;
    if (isTripActive) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          setLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => console.error(error),
        { enableHighAccuracy: true }
      );
    }
    return () => navigator.geolocation.clearWatch(watchId);
  }, [isTripActive]);

  const toggleTrip = () => setIsTripActive(!isTripActive);

  return (
    <div className="driver-container">
      
      {/* --- SIDEBAR --- */}
      <aside className="driver-sidebar">
        
        {/* 1. Enhanced Logo Area */}
        <div className="logo-area">
          <div className="logo-icon-bg"><FaBus /></div>
          <h1 className="logo-text">SL BUS <span className="dot">.</span></h1>
        </div>

        {/* 2. Navigation Menu */}
        <nav className="nav-menu">
          <div 
            className={`nav-item ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            <FaThLarge className="nav-icon"/> <span>Dashboard</span>
          </div>
          
          <div 
            className={`nav-item ${activeTab === "registration" ? "active" : ""}`}
            onClick={() => setActiveTab("registration")}
          >
            <FaClipboardList className="nav-icon"/> <span>Registration</span>
          </div>

          <div 
            className={`nav-item ${activeTab === "help" ? "active" : ""}`}
            onClick={() => setActiveTab("help")}
          >
            <FaQuestionCircle className="nav-icon"/> <span>Help</span>
          </div>

          <div 
            className={`nav-item ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            <FaCog className="nav-icon"/> <span>Settings</span>
          </div>
        </nav>

        {/* Driver Info & Logout */}
        <div className="bottom-section">
          <div className="driver-info">
            <div className="driver-avatar">👨‍✈️</div>
            <div className="driver-details">
              <p className="d-name">Kamal Perera</p>
              <p className="d-bus">NB-1234</p>
            </div>
          </div>
          <button className="logout-btn"><FaSignOutAlt /> Logout</button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="driver-content">
        
        {/* Header with Time */}
        <header className="top-bar">
          <div className="welcome-text">
            <h2>Welcome Back, Driver! 👋</h2>
            <p>Route: Kandy ➝ Colombo</p>
          </div>
          
          {/* 3. Real-time Clock Display */}
          <div className="header-right">
             <div className="live-clock">
                <FaClock /> {currentTime}
             </div>
             <div className={`status-badge ${isTripActive ? "on" : "off"}`}>
               {isTripActive ? "ONLINE" : "OFFLINE"}
             </div>
          </div>
        </header>

        <div className="map-dashboard-layout">
          {/* Map Box */}
          <div className="map-container-box">
            <MapContainer 
              center={location} zoom={13} scrollWheelZoom={true} 
              style={{ height: "100%", width: "100%", borderRadius: "15px" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Polyline positions={kandyToColomboRoute} color="#2563eb" weight={5} />
              <Marker position={location} icon={busIcon}>
                <Popup>My Bus</Popup>
              </Marker>
              <MapUpdater center={location} />
            </MapContainer>
          </div>

          {/* Controls Box */}
          <div className="controls-panel">
            <div className="card action-card">
              <h3>Trip Controls</h3>
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