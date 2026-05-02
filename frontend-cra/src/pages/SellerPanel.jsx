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

  // Mock trending data for UI showcase
  const trendingCities = [
    { name: 'İstanbul', demand: 'Yüksek', product: 'Akıllı Telefonlar' },
    { name: 'Ankara', demand: 'Yüksek', product: 'Dizüstü Bilgisayarlar' },
    { name: 'İzmir', demand: 'Orta', product: 'Fritözler' },
  ];

  const handleAnalyze = async () => {
    if (!city && !category) {
      setStatus({ loading: false, message: 'Lütfen analiz etmek için bir şehir veya kategori seçin.', error: true });
      return;
    }

    setStatus({ loading: true, message: '', error: false });
    setResult(null);
    try {
      const data = await getAnalysis(city, category);
      console.log("API DATA:", data);
      setResult(data);
      setStatus({ loading: false, message: '', error: false });
    } catch (err) {
      setStatus({ loading: false, message: 'Analiz alınamadı. API bağlantısını veya kimlik doğrulama token\'ını kontrol edin.', error: true });
    }
  };

  return (
    <div className="page-container fade-in">
      <div className="header-section seller-header">
        <h1>Pazar Analizi</h1>
        <p>Hedef bölgelerinizdeki talep öngörülerini yapay zeka ile keşfedin.</p>
      </div>

      {/* Trending Section */}
      <div className="trending-section">
        <h3><span className="icon">🔥</span> Trend Bölgeler</h3>
        <div className="trending-grid">
          {trendingCities.map((c, i) => (
            <div key={i} className="trending-card glass-panel" onClick={() => setCity(c.name)}>
              <h4>{c.name}</h4>
              <p className="trend-stat">Talep: <span className="highlight">{c.demand}</span></p>
              <p className="trend-stat">Popüler: <span>{c.product}</span></p>
            </div>
          ))}
        </div>
      </div>

      {/* 2-Column Layout */}
      <div className="panel-content two-column-layout">

        {/* Left Column: Map */}
        <div className="map-column glass-panel">
          <div className="column-header">
            <h3><span className="icon">🗺️</span> Bölge Seç</h3>
          </div>
          <div className="map-wrapper">
            <MapSelector selectedCity={city} onSelectCity={setCity} />
          </div>
        </div>

        {/* Right Column: Analysis Controls */}
        <div className="analysis-column glass-panel">
          <div className="column-header">
            <h3><span className="icon">⚙️</span> Analiz Parametreleri</h3>
          </div>

          <div className="analyze-controls">
            {city ? (
              <div className="selected-city-display success-border">
                Hedef Bölge: <strong>{city}</strong>
              </div>
            ) : (
              <div className="selected-city-display warning-border">
                Lütfen haritadan bir hedef bölge seçin.
              </div>
            )}

            <div className="input-group">
              <CategorySelect value={category} onChange={setCategory} />
            </div>

            <button
              type="button"
              className={`primary-btn seller-btn ${status.loading ? 'loading' : ''}`}
              onClick={handleAnalyze}
              disabled={status.loading || (!city && !category)}
            >
              {status.loading ? (
                <>
                  <span className="spinner">⏳</span> YZ İşleniyor...
                </>
              ) : 'Yapay Zeka Analizini Çalıştır'}
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

      <style>{`
        /* Typography Improvements */
        .seller-header h1 {
          font-size: 2.5rem;
          background: linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* Trending Section */
        .trending-section {
          margin-bottom: 2rem;
        }
        .trending-section h3 {
          color: #f8fafc;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .trending-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }
        .trending-card {
          padding: 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          border-left: 3px solid #ef4444;
        }
        .trending-card:hover {
          transform: translateY(-2px);
          background: rgba(30, 41, 59, 0.8);
          border-left-color: #f87171;
        }
        .trending-card h4 {
          margin: 0 0 0.5rem 0;
          color: #f8fafc;
        }
        .trend-stat {
          margin: 0;
          font-size: 0.85rem;
          color: #94a3b8;
        }
        .trend-stat .highlight {
          color: #ef4444;
          font-weight: 600;
        }

        /* 2-Column Layout */
        .two-column-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          align-items: start;
        }
        @media (max-width: 900px) {
          .two-column-layout {
            grid-template-columns: 1fr;
          }
        }

        .map-column, .analysis-column {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .column-header h3 {
          margin: 0;
          color: #f8fafc;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.25rem;
        }

        .map-wrapper {
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .selected-city-display {
          padding: 0.75rem 1rem;
          background: rgba(15, 23, 42, 0.6);
          border-radius: 8px;
          font-size: 0.95rem;
          color: #cbd5e1;
        }
        .success-border { border-left: 3px solid #10b981; }
        .warning-border { border-left: 3px solid #f59e0b; }

        .input-group {
          margin: 1rem 0;
        }

        .seller-btn {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.1rem;
        }
        .seller-btn.loading {
          background: #475569;
          cursor: not-allowed;
        }
        
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
        .spinner {
          display: inline-block;
          animation: spin 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default SellerPanel;
