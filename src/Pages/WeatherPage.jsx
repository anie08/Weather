import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SearchBox from "../Components/SearchBox/SearchBox";
import UnitSelector from "../Components/UnitSelector/UnitSelector";
import CurrentWeather from "../Components/CurrentWeather/CurrentWeather";
import ForecastList from "../Components/ForecastList/ForecastList";

import "./WeatherPage.css";

function WeatherPage() {
  const { unit } = useParams();
  const navigate = useNavigate();
  const API_KEY = "a3b178a86aac45adaca203807260904";

  const [inputValue, setInputValue] = useState("");
  const [forecastDays, setForecastDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [cityName, setCityName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bgImage, setBgImage] = useState("");

  const updateBackground = (weatherText) => {
    const text = weatherText.toLowerCase();
    const images = {
      Clear: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?q=80&w=1965&auto=format&fit=crop",
      Clouds: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=1951&auto=format&fit=crop",
      Rain: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?q=80&w=1935&auto=format&fit=crop",
      Snow: "https://images.unsplash.com/photo-1491002052546-bf38f186af56?q=80&w=1816&auto=format&fit=crop",
      Default: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1774&auto=format&fit=crop",
    };

    if (text.includes("clear") || text.includes("sunny")) setBgImage(images.Clear);
    else if (text.includes("cloud") || text.includes("overcast") || text.includes("mist")) setBgImage(images.Clouds);
    else if (text.includes("rain") || text.includes("drizzle")) setBgImage(images.Rain);
    else if (text.includes("snow") || text.includes("blizzard")) setBgImage(images.Snow);
    else setBgImage(images.Default);
  };

  const fetchWeather = useCallback(async (city) => {
    const query = city || "Yerevan";
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${query}&days=7&aqi=no`
      );
      const data = await response.json();

      if (data.error) {
        setError("City not found");
        return;
      }

      setCityName(data.location.name);
      setForecastDays(data.forecast.forecastday);
      
      setSelectedDay({
        date: "Today",
        temp_c: data.current.temp_c,
        condition: data.current.condition,
        humidity: data.current.humidity,
      });

      updateBackground(data.current.condition.text);
      localStorage.setItem("city", query);
    } catch (err) {
      setError("Server connection error");
    } finally {
      setLoading(false);
    }
  }, [API_KEY]);

  useEffect(() => {
    const savedCity = localStorage.getItem("city") || "Yerevan";
    fetchWeather(savedCity);
  }, [fetchWeather]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      fetchWeather(inputValue.trim());
      setInputValue("");
    }
  };

  const handleDaySelect = (dayObj) => {
    setSelectedDay({
      date: dayObj.date,
      temp_c: dayObj.day.avgtemp_c,
      condition: dayObj.day.condition,
      humidity: dayObj.day.avghumidity,
    });
    updateBackground(dayObj.day.condition.text);
  };

  const formatTemp = (tempC) => {
    if (unit === "f") return `${Math.round((tempC * 9) / 5 + 32)}°F`;
    return `${Math.round(tempC)}°C`;
  };

  const getDayName = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { weekday: "long" });
  };

  return (
    <div className="weather-container" style={{ backgroundImage: `url(${bgImage})` }}>
      <SearchBox 
        inputValue={inputValue} 
        setInputValue={setInputValue} 
        onSearch={handleSearch} 
      />

      <UnitSelector 
        unit={unit} 
        onUnitChange={(targetUnit) => navigate(`/weather/${targetUnit}`)} 
      />

      {loading && <h2 className="loading-text">Loading...</h2>}
      {error && <h2 className="error-text">{error}</h2>}

      {selectedDay && !loading && !error && (
        <CurrentWeather 
          cityName={cityName} 
          selectedDay={selectedDay} 
          formatTemp={formatTemp} 
        />
      )}

      {forecastDays.length > 0 && !loading && !error && (
        <ForecastList 
          forecastDays={forecastDays}
          selectedDay={selectedDay}
          onDaySelect={handleDaySelect}
          getDayName={getDayName}
          formatTemp={formatTemp}
        />
      )}
    </div>
  );
}

export default WeatherPage;
