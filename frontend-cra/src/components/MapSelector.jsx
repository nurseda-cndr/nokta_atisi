import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function MapSelector({ selectedCity, onSelectCity }) {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/turkey.geojson')
      .then(response => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then(data => {
        console.log("GeoJSON loaded");
        console.log(data);
        setGeoJsonData(data);
      })
      .catch(err => {
        console.error("Fetch GeoJSON error:", err);
        setError(true);
      });
  }, []);

  // Base styling for the polygons
  const baseStyle = (feature) => {
    const cityName = feature?.properties?.name || feature?.properties?.NAME_1 || feature?.properties?.il_adi || "Unknown";
    const isSelected = selectedCity === cityName;

    return {
      fillColor: isSelected ? '#8b5cf6' : '#1e293b',
      color: "#6366f1",
      weight: 1,
      opacity: 1,
      fillOpacity: isSelected ? 0.7 : 0.3,
    };
  };

  const onEachFeature = (feature, layer) => {
    try {
      const cityName = feature?.properties?.name || feature?.properties?.NAME_1 || feature?.properties?.il_adi || "Unknown";

      layer.on({
        mouseover: (e) => {
          const l = e.target;
          l.setStyle({
            fillOpacity: 0.8,
            weight: 2,
            color: '#818cf8',
          });
          l.bringToFront();
        },
        mouseout: (e) => {
          const l = e.target;
          l.setStyle(baseStyle(feature));
        },
        click: () => {
          console.log("Şehir:", cityName);
          if (onSelectCity) onSelectCity(cityName);
        },
      });

      layer.bindTooltip(cityName, { sticky: true, className: 'map-tooltip' });
    } catch (err) {
      console.error("Feature error:", err);
    }
  };

  return (
    <div className="map-container leaflet-wrapper fade-in">
      <h3>Haritadan Şehir Seç</h3>
      <div className="map-frame glass-panel" style={{ height: "400px", width: "100%", position: "relative", overflow: "hidden", borderRadius: "16px" }}>

        <MapContainer
          center={[39, 35]}
          zoom={5}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={false}
        >
          {/* Base map ALWAYS renders */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* SAFE RENDER: Only render GeoJSON if loaded and valid */}
          {geoJsonData && Array.isArray(geoJsonData.features) && (
            <GeoJSON
              data={geoJsonData}
              style={baseStyle}
              onEachFeature={onEachFeature}
            />
          )}

        </MapContainer>

        {/* Fallback UI if fetch completely failed */}
        {error && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1000, background: 'rgba(2, 6, 23, 0.9)', padding: '10px 20px', borderRadius: '8px', border: '1px solid #ef4444', color: '#ef4444' }}>
            Harita yüklenemedi
          </div>
        )}

      </div>
      <p className="map-help-text">Seçmek için bir ilin üzerine tıklayın.</p>

      <style>{`
        .leaflet-container {
          background: #020617 !important;
          width: 100%;
          height: 100%;
        }
        .map-tooltip {
          background: #0f172a !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          color: #f8fafc !important;
          border-radius: 4px;
          font-weight: 600;
          padding: 4px 8px;
        }
        .map-frame {
          padding: 0 !important;
          border: none !important;
          background: #020617;
        }
      `}</style>
    </div>
  );
}