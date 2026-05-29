import React from "react";
import ForecastCard from "../ForecastCard/ForecastCard";
import "./ForecastList.css";

function ForecastList({ forecastDays, selectedDay, onDaySelect, getDayName, formatTemp }) {
  return (
    <div className="forecast-container">
      {forecastDays.map((day, index) => {
        const isActive = selectedDay && (selectedDay.date === day.date || (index === 0 && selectedDay.date === "Today"));
        
        return (
          <ForecastCard
            key={day.date}
            day={day}
            index={index}
            isActive={isActive}
            onClick={() => onDaySelect(day)}
            getDayName={getDayName}
            formatTemp={formatTemp}
          />
        );
      })}
    </div>
  );
}

export default ForecastList;