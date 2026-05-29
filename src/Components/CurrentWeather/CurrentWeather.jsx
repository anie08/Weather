import React from "react";
import "./CurrentWeather.css";

function CurrentWeather({ cityName, selectedDay, formatTemp }) {
  return (
    <div className="weather-card">
      <h2 className="city-name">{cityName}</h2>
      <p className="weather-date">{selectedDay.date}</p>
      
      <img className="weather-icon" src={`https:${selectedDay.condition.icon}`} alt="weather icon" />
      
      <h1 className="temperature">{formatTemp(selectedDay.temp_c)}</h1>
      <p className="condition-text">🌥 {selectedDay.condition.text}</p>
      <p className="humidity-text">💧 Humidity: {selectedDay.humidity}%</p>
    </div>
  );
}

export default CurrentWeather;