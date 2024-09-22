import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const CitySearch = ({ onSelectCity }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [cities, setCities] = useState([]);
  const dropdownRef = useRef(null);

  const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
  
  // Use the debounce hook
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      if (debouncedSearchTerm) {
        try {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${debouncedSearchTerm}&appid=${API_KEY}&units=metric`
          );
          // Assuming the API returns the city name in response.data.name
          setCities([response.data.name]); // Replace with an array of suggestions if available
          setIsOpen(true); // Show dropdown if there are results
        } catch (error) {
          console.error('Error fetching city data:', error);
          setCities([]); // Clear cities if an error occurs
        }
      } else {
        setCities([]);
        setIsOpen(false); // Close dropdown if search term is empty
      }
    };

    fetchCities();
  }, [debouncedSearchTerm]);

  const handleSelectCity = (city) => {
    onSelectCity(city);
    setSearchTerm(city);
    setIsOpen(false);
  };

  return (
    <div className="city-search" ref={dropdownRef}>
      <input
        type="text"
        placeholder="Search for a city..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setIsOpen(true)} // Show dropdown on focus
      />
      {isOpen && (
        <ul className="city-list">
          {cities.length > 0 ? (
            cities.map((city, index) => (
              <li key={index} onClick={() => handleSelectCity(city)}>
                {city}
              </li>
            ))
          ) : (
            <li>No cities found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default CitySearch;

