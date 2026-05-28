import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

    if (text.includes("clear") || text.includes("sunny")) {
      setBgImage(images.Clear);
    } else if (text.includes("cloud") || text.includes("overcast") || text.includes("mist")) {
      setBgImage(images.Clouds);
    } else if (text.includes("rain") || text.includes("drizzle")) {
      setBgImage(images.Rain);
    } else if (text.includes("snow") || text.includes("blizzard")) {
      setBgImage(images.Snow);
    } else {
      setBgImage(images.Default);
    }
  };

  const fetchWeather = async (city) => {
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
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedCity = localStorage.getItem("city") || "Yerevan";
    fetchWeather(savedCity);
  }, []);

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
    if (unit === "f") {
      return `${Math.round((tempC * 9) / 5 + 32)}°F`;
    }
    return `${Math.round(tempC)}°C`;
  };

  const getDayName = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  return (
    <div className="weather-container" style={{ backgroundImage: `url(${bgImage})` }}>
      <form className="search-box" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter city name..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <div className="unit-buttons">
        <button className={`unit-btn ${unit === "c" ? "active" : ""}`} onClick={() => navigate("/weather/c")}>°C</button>
        <button className={`unit-btn ${unit === "f" ? "active" : ""}`} onClick={() => navigate("/weather/f")}>°F</button>
      </div>

      {loading && <h2 className="loading-text">Loading...</h2>}
      {error && <h2 className="error-text">{error}</h2>}

      {selectedDay && !loading && !error && (
        <div className="weather-card">
          <h2 style={{ color: "gold" }}>{cityName}</h2>
          <p style={{ fontSize: "14px", opacity: 0.8 }}>{selectedDay.date}</p>

          <img src={`https:${selectedDay.condition.icon}`} alt="weather icon" />

          <h1>{formatTemp(selectedDay.temp_c)}</h1>
          <p>🌥 {selectedDay.condition.text}</p>
          <p>💧 Humidity: {selectedDay.humidity}%</p>
        </div>
      )}

      {forecastDays.length > 0 && !loading && !error && (
        <div className="forecast-container" style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "20px", flexWrap: "wrap" }}>
          {forecastDays.map((day, index) => (
            <div
              key={index}
              className="forecast-mini-card"
              onClick={() => handleDaySelect(day)}
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(5px)",
                padding: "10px",
                borderRadius: "10px",
                textAlign: "center",
                cursor: "pointer",
                width: "80px",
                transition: "transform 0.2s"
              }}
            >
              <p style={{ fontWeight: "bold", margin: "0" }}>{index === 0 ? "Today" : getDayName(day.date)}</p>
              <img src={`https:${day.day.condition.icon}`} alt="mini icon" style={{ width: "40px" }} />
              <p style={{ margin: "0", fontSize: "14px" }}>{formatTemp(day.day.avgtemp_c)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WeatherPage;