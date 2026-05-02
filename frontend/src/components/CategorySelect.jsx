import React from 'react';

const CATEGORIES = [
  'Food & Dining',
  'Technology & Electronics',
  'Health & Wellness',
  'Education',
  'Entertainment',
  'Home & Living',
  'Clothing & Fashion',
  'Other'
];

const CategorySelect = ({ value, onChange }) => {
  return (
    <div className="form-group">
      <label htmlFor="category">Category</label>
      <select
        id="category"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      >
        <option value="" disabled>Select a category</option>
        {CATEGORIES.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
    </div>
  );
};

export default CategorySelect;
