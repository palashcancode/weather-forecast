import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import WeatherDisplay from '../src/components/WeatherDisplay';
import ForecastCard from '../src/components/ForecastCard';
import CitySearch from '../src/components/CitySearch';
import './App.css';

const App = () => {
  const [city, setCity] = useState('Gurgaon'); // Default city
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [unit, setUnit] = useState('celsius');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchWeatherData = async (cityName) => {
    setIsLoading(true);
    setError(null);
    try {
      const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      setWeatherData(response.data.list[0]);
      setForecast(response.data.list.filter((item, index) => index % 8 === 0).slice(1, 6));
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePullToRefresh = useCallback(() => {
    if (window.scrollY === 0 && !isLoading) {
      fetchWeatherData(city);
    }
  }, [city, isLoading]);

  useEffect(() => {
    fetchWeatherData(city);
    const handleScroll = () => handlePullToRefresh();
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [city]);

  const toggleUnit = () => {
    setUnit((prevUnit) => (prevUnit === 'celsius' ? 'fahrenheit' : 'celsius'));
  };

  const handleRefresh = () => {
    fetchWeatherData(city);
  };

  return (
    <div className="App">
      <h1>Weather Forecast</h1>
      <CitySearch onSelectCity={setCity} />
      <div className="unit-toggle">
        <button onClick={toggleUnit}>
          {unit === 'celsius' ? '°C / °F' : '°F / °C'}
        </button>
      </div>
      <button onClick={handleRefresh}>Refresh</button>

      {isLoading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}

      {weatherData && (
        <div>
          <WeatherDisplay city={city} data={weatherData} unit={unit} />
          <h2>5-Day Forecast</h2>
          <div className="forecast-container">
            {forecast.map((day, index) => (
              <ForecastCard key={index} data={day} unit={unit} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
