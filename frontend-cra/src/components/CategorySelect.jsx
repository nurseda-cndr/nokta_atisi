import React from 'react';

const CATEGORIES = [
  'Yiyecek & İçecek',
  'Teknoloji & Elektronik',
  'Sağlık & Yaşam',
  'Eğitim',
  'Eğlence',
  'Ev & Yaşam',
  'Giyim & Moda',
  'Diğer'
];

const CategorySelect = ({ value, onChange }) => {
  return (
    <div className="form-group">
      <label htmlFor="category">Kategori</label>
      <select
        id="category"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      >
        <option value="" disabled>Kategori seç</option>
        {CATEGORIES.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
    </div>
  );
};

export default CategorySelect;
