import { useState } from 'react';

const testItems = [
  { id: 1, name: 'Fly Experience Menu', category: 'Combos & Salad', available: true },
  { id: 2, name: 'Fly Caesar', category: 'Combos & Salad', available: true },
  { id: 3, name: '4 Tenders', category: 'Fried Chicken Tenders', available: true },
  { id: 4, name: '8 Tenders', category: 'Fried Chicken Tenders', available: true },
  { id: 5, name: '5 Wings', category: 'Fried Chicken Wings', available: true },
  { id: 6, name: '10 Wings', category: 'Fried Chicken Wings', available: true },
];

export default function DebugFilter() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const categories = ['All', ...new Set(testItems.map(item => item.category))];
  const filteredItems = selectedCategory === 'All' 
    ? testItems.filter(item => item.available !== false)
    : testItems.filter(item => item.category === selectedCategory && item.available !== false);

  return (
    <div className="container">
      <header className="header">
        <h1>🔧 Debug Filter</h1>
        <p>Testing category filtering</p>
      </header>

      <main className="main" style={{ gridTemplateColumns: '1fr' }}>
        <div style={{ background: '#000', padding: '30px', borderRadius: '12px', border: '2px solid #ffd700' }}>
          <h2 style={{ color: '#ffd700' }}>Filter Test</h2>
          
          <div className="category-filter">
            {categories.map(category => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => {
                  console.log('Clicking category:', category);
                  setSelectedCategory(category);
                }}
              >
                {category}
              </button>
            ))}
          </div>
          
          <div style={{ margin: '20px 0', color: '#ffd700' }}>
            <p><strong>Debug Info:</strong></p>
            <p>Total items: {testItems.length}</p>
            <p>Available categories: {categories.join(', ')}</p>
            <p>Selected category: "{selectedCategory}"</p>
            <p>Filtered items: {filteredItems.length}</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
            {filteredItems.map(item => (
              <div key={item.id} style={{ 
                background: '#1a1a1a', 
                padding: '15px', 
                borderRadius: '8px', 
                border: '1px solid #ffd700',
                color: '#fff'
              }}>
                <h4 style={{ color: '#fff', marginBottom: '5px' }}>{item.name}</h4>
                <p style={{ color: '#ffd700', fontSize: '0.9rem' }}>{item.category}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}