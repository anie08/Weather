import React from "react";
import "./ForecastCard.css";

function ForecastCard({ day, index, isActive, onClick, getDayName, formatTemp }) {
  return (
    <div
      className={`forecast-mini-card ${isActive ? "active-card" : ""}`}
      onClick={onClick}
    >
      <p className="forecast-day-name">
        {index === 0 ? "Today" : getDayName(day.date)}
      </p>
      <img className="forecast-mini-icon" src={`https:${day.day.condition.icon}`} alt="mini icon" />
      <p className="forecast-temp">{formatTemp(day.day.avgtemp_c)}</p>
    </div>
  );
}

export default ForecastCard;