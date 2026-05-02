import React from 'react';

const ResultCard = ({ result }) => {
  if (!result) return null;

  return (
    <div className="result-card">
      <h3>Analysis Result</h3>
      <div className="result-stat">
        <span className="result-label">Top Requested:</span>
        <span className="result-value highlight">{result.topRequested || 'N/A'}</span>
      </div>
      <div className="result-stat">
        <span className="result-label">Demand Score:</span>
        <span className="result-value score">{result.demandScore || 0}/100</span>
      </div>
      <div className="result-suggestion">
        <p><strong>Suggestion:</strong> {result.suggestionMessage || 'No sufficient data to provide a suggestion yet.'}</p>
      </div>
    </div>
  );
};

export default ResultCard;
