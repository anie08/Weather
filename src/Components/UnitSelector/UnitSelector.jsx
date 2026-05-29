import React from "react";
import "./UnitSelector.css";

function UnitSelector({ unit, onUnitChange }) {
  return (
    <div className="unit-buttons">
      <button 
        className={`unit-btn ${unit === "c" ? "active" : ""}`} 
        onClick={() => onUnitChange("c")}
      >
        °C
      </button>
      <button 
        className={`unit-btn ${unit === "f" ? "active" : ""}`} 
        onClick={() => onUnitChange("f")}
      >
        °F
      </button>
    </div>
  );
}

export default UnitSelector;