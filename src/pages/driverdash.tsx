import React, { useState, useEffect } from "react";
import "./DriverDashboard.css";
import { 
  FaBus, 
  FaMapMarkerAlt, 
  FaPlay, 
  FaStop, 
  FaSignOutAlt, 
  FaTachometerAlt, 
  FaUsers 
} from "react-icons/fa";

// 1. Types define කරගමු (TypeScript වල වැදගත්ම කොටස)
interface RouteData {
  id: string;
  name: string;
}

const DriverDashboard: React.FC = () => {
  // 2. State Variables
  const [isTripActive, setIsTripActive] = useState<boolean>(false);
  const [selectedRoute, setSelectedRoute] = useState<string>("");
  const [currentTime, setCurrentTime] = useState<string>(new Date().toLocaleTimeString());

  // Mock Data for Routes (Backend එකෙන් එන්න ඕන දත්ත)
  const routes: RouteData[] = [
    { id: "138", name: "138 - Pettah to Maharagama" },
    { id: "177", name: "177 - Kaduwela to Kollupitiya" },
    { id: "17", name: "17 - Panadura to Kandy" },
    { id: "1", name: "01 - Colombo to Kandy" },
  ];

  // Clock update effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle Trip Start/End
  const toggleTrip = () => {
    if (!selectedRoute && !isTripActive) {
      alert("Please select a route first! 🛑");
      return;
    }

    if (!isTripActive) {
      // Trip Starting Logic
      console.log("Trip Started on Route:", selectedRoute);
      // TODO: Backend call -> socket.emit('start-trip', ...)
    } else {
      // Trip Ending Logic
      console.log("Trip Ended");
      // TODO: Backend call -> socket.emit('end-trip', ...)
    }
    setIsTripActive(!isTripActive);
  };

  const handleLogout = () => {
    console.log("Logging out...");
    // window.location.href = "/login";
  };

  return (
    <div className="driver-container">
      {/* --- Sidebar / Navbar --- */}
      <aside className="driver-sidebar">
        <div className="logo-area">
          <FaBus size={40} />
          <h2>SL Bus</h2>
        </div>
        <div className="driver-info">
          <div className="avatar">👨‍✈️</div>
          <p>Driver: <strong>Kamal Perera</strong></p>
          <p className="bus-no">NB-1234</p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      {/* --- Main Content --- */}
      <main className="driver-content">
        
        {/* Top Header */}
        <header className="top-bar">
          <h1>Driver Dashboard</h1>
          <div className="status-pill">
             Status: <span className={isTripActive ? "online" : "offline"}>
               {isTripActive ? "🟢 Online (Broadcasting)" : "🔴 Offline"}
             </span>
          </div>
          <div className="clock">{currentTime}</div>
        </header>

        {/* Dashboard Grid */}
        <div className="dashboard-grid">
          
          {/* 1. Route Selector Card */}
          <div className="card route-card">
            <h3><FaMapMarkerAlt /> Select Route</h3>
            <select 
              value={selectedRoute} 
              onChange={(e) => setSelectedRoute(e.target.value)}
              disabled={isTripActive} // Trip එක යනකොට route මාරු කරන්න බෑ
              className="route-select"
            >
              <option value="">-- Select Your Route --</option>
              {routes.map((route) => (
                <option key={route.id} value={route.id}>
                  {route.name}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Main Action Card (Start/Stop) */}
          <div className="card action-card">
            <div className={`indicator-ring ${isTripActive ? "pulsing" : ""}`}>
              <button 
                className={`trip-btn ${isTripActive ? "stop-btn" : "start-btn"}`}
                onClick={toggleTrip}
              >
                {isTripActive ? <FaStop size={40} /> : <FaPlay size={40} />}
                <span>{isTripActive ? "END TRIP" : "START TRIP"}</span>
              </button>
            </div>
            <p className="hint-text">
              {isTripActive 
                ? "GPS Location is being shared live..." 
                : "Select a route and press START to share location"}
            </p>
          </div>

          {/* 3. Stats Card (Optional) */}
          <div className="card stats-card">
            <div className="stat-item">
              <FaTachometerAlt className="stat-icon" />
              <div>
                <h4>Speed</h4>
                <p>{isTripActive ? "45 km/h" : "0 km/h"}</p>
              </div>
            </div>
            <div className="stat-item">
              <FaUsers className="stat-icon" />
              <div>
                <h4>Passengers</h4>
                <p>Active</p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default DriverDashboard;