import { useState } from 'react';

const menuItems = [
  { id: 1, name: 'Fly Experience Menu', price: 295, category: 'Combos & Salad', available: true, image: '🍗🍟' },
  { id: 2, name: 'Fly Caesar', price: 190, category: 'Combos & Salad', available: true, image: '🥗' },
  { id: 3, name: 'Fly Kids Menu', price: 105, category: 'Combos & Salad', available: true, image: '🧒' },
  { id: 4, name: '4 Tenders', price: 100, category: 'Fried Chicken Tenders', available: true, image: '🍗' },
  { id: 5, name: '8 Tenders', price: 180, category: 'Fried Chicken Tenders', available: true, image: '🍗' },
  { id: 6, name: '15 Tenders', price: 310, category: 'Fried Chicken Tenders', available: true, image: '🍗' },
  { id: 7, name: '5 Wings', price: 100, category: 'Fried Chicken Wings', available: true, image: '🍗' },
  { id: 8, name: '10 Wings', price: 175, category: 'Fried Chicken Wings', available: true, image: '🍗' },
  { id: 9, name: '30 Wings', price: 395, category: 'Fried Chicken Wings', available: true, image: '🍗' },
  { id: 10, name: 'Hot Wings (Spicy)', price: 130, category: 'Fried Chicken Wings', available: true, image: '🌶️' }
];

export default function SimpleHome() {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(menuItems.map(item => item.category))];
  const filteredItems = selectedCategory === 'All' 
    ? menuItems.filter(item => item.available !== false)
    : menuItems.filter(item => item.category === selectedCategory && item.available !== false);

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(cartItem => cartItem.id === item.id);
      if (existing) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="container">
      <header className="header">
        <div className="logo-section">
          <div className="logo-icon">🍗</div>
          <div className="logo-text">
            <h1>Fly Chicken</h1>
            <p>crispy fried chicken</p>
          </div>
        </div>
      </header>

      <main className="main">
        <section className="menu-section">
          <h2>Our Menu</h2>
          
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
          
          <div className="menu-grid">
            {filteredItems.map(item => (
              <div key={item.id} className="menu-card">
                <div className="menu-item-image">
                  <div className="emoji-fallback">{item.image}</div>
                </div>
                <div className="menu-item-info">
                  <h3>{item.name}</h3>
                  <p className="category">{item.category}</p>
                  <p className="price">{item.price} NOK</p>
                  <button 
                    className="btn-primary"
                    onClick={() => addToCart(item)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="cart-section">
          <h2>Your Order</h2>
          {cart.length === 0 ? (
            <p className="empty-cart">Your cart is empty</p>
          ) : (
            <>
              <div className="cart-items">
                {cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-info">
                      <span className="item-name">{item.name}</span>
                      <span className="item-price">{item.price} NOK</span>
                    </div>
                    <div className="quantity-controls">
                      <span className="quantity">{item.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="cart-total">
                <strong>Total: {total} NOK</strong>
              </div>
              <button className="btn-primary btn-large">
                Place Order
              </button>
            </>
          )}
        </section>
      </main>
    </div>
  );
}