import React from 'react';

const ResultCard = ({ result }) => {
  if (!result) return <p>Henüz analiz yapılmadı</p>;

  const demandPercent = Math.min((result.supply || 0) * 5, 100);
  const supplyPercent = result.avgRating ? result.avgRating * 20 : 0;

  return (
    <div className="result-card glass-panel fade-in">
      <h2>Pazar Analizi Sonuçları</h2>

      <div className="stats-container">
        <div className="stat-item">
          <h3>Toplam İşletme</h3>
          <p>{result && result.supply !== undefined ? result.supply : 0}</p>
        </div>

        <div className="stat-item">
          <h3>Ortalama Puan</h3>
          <p>{result && result.avgRating !== undefined ? result.avgRating : 'Yok'}</p>
        </div>

        <div className="stat-item">
          <h3>En Popüler Yer</h3>
          <p>{result && result.topPlace ? result.topPlace : 'Yok'}</p>
        </div>
      </div>

      <div className="percentages">
        <p>Talep Seviyesi: %{demandPercent}</p>
        <p>Kalite Seviyesi: %{supplyPercent}</p>
      </div>

      <style>{`
        .result-card {
          margin-top: 1.5rem;
          padding: 1.5rem;
          border-left: 4px solid #10b981;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .stats-container {
          display: flex;
          gap: 2rem;
          flex-wrap: wrap;
        }
        .stat-item {
          background: rgba(15, 23, 42, 0.4);
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          min-width: 120px;
        }
        .stat-item h3 {
          margin: 0 0 0.5rem 0;
          color: #94a3b8;
          font-size: 0.85rem;
          text-transform: uppercase;
        }
        .stat-item p {
          font-size: 1.5rem;
          font-weight: bold;
          color: #f8fafc;
          margin: 0;
        }
        .percentages {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.2);
          padding: 1rem;
          border-radius: 8px;
        }
        .percentages p {
          margin: 0.5rem 0;
          font-size: 1.1rem;
          color: #34d399;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default ResultCard;
