import React, { useState } from 'react';
import MapSelector from '../components/MapSelector';
import CategorySelect from '../components/CategorySelect';
import ResultCard from '../components/ResultCard';
import { getAnalysis } from '../services/api';

const SellerPanel = () => {
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('');
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState({ loading: false, message: '', error: false });

  const handleAnalyze = async () => {
    if (!city && !category) {
      setStatus({ loading: false, message: 'Please select a city or a category to analyze.', error: true });
      return;
    }

    setStatus({ loading: true, message: '', error: false });
    setResult(null);
    try {
      const data = await getAnalysis(city, category);
      setResult(data);
      setStatus({ loading: false, message: '', error: false });
    } catch (err) {
      setStatus({ loading: false, message: 'Failed to fetch analysis. Make sure the backend is running.', error: true });
    }
  };

  return (
    <div className="page-container fade-in">
      <div className="header-section seller-header">
        <h1>Market Analysis</h1>
        <p>Discover what consumers are demanding in your target areas.</p>
      </div>

      <div className="panel-content">
        <div className="map-section">
          <MapSelector selectedCity={city} onSelectCity={setCity} />
        </div>

        <div className="form-section glass-panel">
          <div className="analyze-controls">
            {city && (
              <div className="selected-city-display">
                Target Area: <strong>{city}</strong>
              </div>
            )}

            <CategorySelect value={category} onChange={setCategory} />

            <button
              type="button"
              className="primary-btn seller-btn"
              onClick={handleAnalyze}
              disabled={status.loading}
            >
              {status.loading ? 'Analyzing...' : 'Analyze Demand'}
            </button>

            {status.message && (
              <div className={`status-message ${status.error ? 'error' : 'success'}`}>
                {status.message}
              </div>
            )}
          </div>

          <div className="results-section">
            <ResultCard result={result} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerPanel;
