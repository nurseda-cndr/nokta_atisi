import React from 'react';

const MOCK_CITIES = [
  { id: 1, name: 'Istanbul', x: 20, y: 30 },
  { id: 2, name: 'Ankara', x: 45, y: 40 },
  { id: 3, name: 'Izmir', x: 10, y: 55 },
  { id: 4, name: 'Antalya', x: 35, y: 80 },
  { id: 5, name: 'Bursa', x: 25, y: 40 },
  { id: 6, name: 'Adana', x: 65, y: 80 },
  { id: 7, name: 'Trabzon', x: 80, y: 25 },
  { id: 8, name: 'Gaziantep', x: 75, y: 75 },
  { id: 9, name: 'Diyarbakir', x: 85, y: 65 },
  { id: 10, name: 'Erzurum', x: 85, y: 35 }
];

const MapSelector = ({ selectedCity, onSelectCity }) => {
  return (
    <div className="map-container">
      <h3>Select a City from Map</h3>
      <div className="mock-map">
        {MOCK_CITIES.map(city => (
          <button
            key={city.id}
            type="button"
            className={`city-pin ${selectedCity === city.name ? 'selected' : ''}`}
            style={{ left: `${city.x}%`, top: `${city.y}%` }}
            onClick={() => onSelectCity(city.name)}
          >
            <div className="pin-dot"></div>
            <span className="city-name">{city.name}</span>
          </button>
        ))}
      </div>
      <p className="map-help-text">Click on a city pin on the mock map to select it.</p>
    </div>
  );
};

export default MapSelector;
