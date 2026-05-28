import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import WeatherPage from "./Pages/WeatherPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/weather/c" replace />} />
        
        <Route path="/weather/:unit" element={<WeatherPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;