import { useState } from 'react';

const testMenuItems = [
  { id: 1, name: 'Fly Experience Menu', price: 295, category: 'Combos & Salad', available: true },
  { id: 2, name: 'Fly Caesar', price: 190, category: 'Combos & Salad', available: true },
  { id: 3, name: '4 Tenders', price: 100, category: 'Fried Chicken Tenders', available: true },
  { id: 4, name: '8 Tenders', price: 180, category: 'Fried Chicken Tenders', available: true },
  { id: 5, name: '5 Wings', price: 100, category: 'Fried Chicken Wings', available: true }
];

export default function TestMenu() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const categories = ['All', ...new Set(testMenuItems.map(item => item.category))];
  const filteredItems = selectedCategory === 'All' 
    ? testMenuItems.filter(item => item.available !== false)
    : testMenuItems.filter(item => item.category === selectedCategory && item.available !== false);

  return (
    <div className="container">
      <header className="header">
        <h1>🍗 Test Menu</h1>
        <p>Testing menu display</p>
      </header>

      <main className="main" style={{ gridTemplateColumns: '1fr' }}>
        <section className="menu-section">
          <h2>Test Menu ({testMenuItems.length} items)</h2>
          
          <div className="category-filter">
            {categories.map(category => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
          
          <div style={{ margin: '20px 0', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
            <p><strong>Debug Info:</strong></p>
            <p>Total items: {testMenuItems.length}</p>
            <p>Filtered items: {filteredItems.length}</p>
            <p>Selected category: {selectedCategory}</p>
            <p>Categories: {categories.join(', ')}</p>
          </div>
          
          <div className="menu-grid">
            {filteredItems.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                <p>No items found for category: {selectedCategory}</p>
              </div>
            ) : (
              filteredItems.map(item => (
                <div key={item.id} className="menu-card">
                  <div className="menu-item-image">🍗</div>
                  <div className="menu-item-info">
                    <h3>{item.name}</h3>
                    <p className="category">{item.category}</p>
                    <p className="price">{item.price} NOK</p>
                    <button className="btn-primary">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}