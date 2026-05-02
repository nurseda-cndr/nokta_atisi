import React, { useState } from 'react';
import MapSelector from '../components/MapSelector';
import CategorySelect from '../components/CategorySelect';
import { sendRequest } from '../services/api';

const UserPanel = () => {
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState('');
  const [missingProduct, setMissingProduct] = useState('');
  const [status, setStatus] = useState({ loading: false, message: '', error: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!city || !category || !missingProduct) {
      setStatus({ loading: false, message: 'Lütfen tüm zorunlu alanları doldurun.', error: true });
      return;
    }

    setStatus({ loading: true, message: '', error: false });
    try {
      await sendRequest({
        city,
        address,
        category,
        product: missingProduct
      });
      setStatus({ loading: false, message: 'Talebiniz başarıyla gönderildi!', error: false });
      setMissingProduct('');
      setAddress('');
      // Keep city and category for convenience, or clear them if preferred
    } catch (err) {
      setStatus({ loading: false, message: 'Talep gönderilemedi. Lütfen tekrar deneyin.', error: true });
    }
  };

  return (
    <div className="page-container fade-in">
      <div className="header-section">
        <h1>Eksik Ürün Bildir</h1>
        <p>Satıcıların şehrinizin neye ihtiyacı olduğunu anlamalarına yardımcı olun.</p>
      </div>

      <div className="panel-content">
        <div className="map-section">
          <MapSelector selectedCity={city} onSelectCity={setCity} />
        </div>

        <div className="form-section glass-panel">
          <form onSubmit={handleSubmit}>
            {city && (
              <div className="selected-city-display">
                Seçilen Şehir: <strong>{city}</strong>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="address">Adres (İsteğe Bağlı)</label>
              <input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Örn. Mahalle veya sokak adı girin"
              />
            </div>

            <CategorySelect value={category} onChange={setCategory} />

            <div className="form-group">
              <label htmlFor="missingProduct">Burada ne eksik? *</label>
              <input
                type="text"
                id="missingProduct"
                value={missingProduct}
                onChange={(e) => setMissingProduct(e.target.value)}
                placeholder="Örn. 7/24 Eczane, Vegan Restoran"
                required
              />
            </div>

            <button type="submit" className="primary-btn" disabled={status.loading}>
              {status.loading ? 'Gönderiliyor...' : 'Talep Gönder'}
            </button>

            {status.message && (
              <div className={`status-message ${status.error ? 'error' : 'success'}`}>
                {status.message}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserPanel;
