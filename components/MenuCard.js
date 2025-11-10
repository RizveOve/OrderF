import { useState } from 'react';

export default function MenuCard({ item, onAddToCart, onItemClick }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="menu-card" onClick={() => onItemClick(item)}>
      <div className="menu-item-image">
        {!imageError && item.image && item.image.startsWith('http') ? (
          <img 
            src={item.image} 
            alt={item.name}
            onError={() => setImageError(true)}
            className="food-image"
          />
        ) : (
          <div className="emoji-fallback">
            {item.fallbackEmoji || item.image || '🍽️'}
          </div>
        )}
      </div>
      <div className="menu-item-info">
        <h3>{item.name}</h3>
        <p className="category">{item.category}</p>
        <p className="price">{item.price} NOK</p>
        <button 
          className="btn-primary"
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(item);
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}