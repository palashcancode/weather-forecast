import React from 'react';
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm } from 'react-icons/wi';

const WeatherDisplay = ({ city, data, unit }) => {
  const getWeatherIcon = (iconCode) => {
    switch (iconCode) {
      case '01d': case '01n': return <WiDaySunny className="weather-icon" />;
      case '02d': case '02n': case '03d': case '03n': case '04d': case '04n': return <WiCloudy className="weather-icon" />;
      case '09d': case '09n': case '10d': case '10n': return <WiRain className="weather-icon" />;
      case '13d': case '13n': return <WiSnow className="weather-icon" />;
      case '11d': case '11n': return <WiThunderstorm className="weather-icon" />;
      default: return <WiDaySunny className="weather-icon" />;
    }
  };

  const convertTemperature = (temp) => {
    if (unit === 'fahrenheit') {
      return Math.round((temp * 9/5) + 32);
    }
    return Math.round(temp);
  };

  return (
    <div className="weather-display">
      <h2>{city}</h2>
      {getWeatherIcon(data.weather[0].icon)}
      <p className="temperature">
        {convertTemperature(data.main.temp)}°{unit === 'celsius' ? 'C' : 'F'}
      </p>
      <p className="description">{data.weather[0].description}</p>
      <p>Humidity: {data.main.humidity}%</p>
      <p>Wind: {Math.round(data.wind.speed * 3.6)} km/h</p>
    </div>
  );
};

export default WeatherDisplay;