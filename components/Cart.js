import { useState } from 'react';

export default function Cart({ items, onRemoveItem, onUpdateQuantity, onPlaceOrder, isMobile = false }) {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const [isExpanded, setIsExpanded] = useState(false);

  // Don't render anything if cart is empty
  if (items.length === 0) {
    return null;
  }

  // Modern floating cart for all screen sizes (only when items exist)
  return (
    <div className="floating-cart">
      <div 
        className="cart-summary" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="cart-left">
          <span className="cart-count">
            {itemCount} item{itemCount !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="cart-right">
          <span className="cart-total">{total} NOK</span>
          <button 
            className="btn-success order-btn"
            onClick={(e) => {
              e.stopPropagation();
              onPlaceOrder();
            }}
          >
            Place Order
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="cart-items-expanded">
          {items.map(item => (
            <div key={item.id} className="cart-item-row">
              <div className="cart-item-info">
                <span className="item-name">{item.name}</span>
                <span className="item-price">{item.price} NOK each</span>
              </div>
              <div className="quantity-controls">
                <button 
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  className="btn-quantity"
                >
                  -
                </button>
                <span className="quantity">{item.quantity}</span>
                <button 
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  className="btn-quantity"
                >
                  +
                </button>
                <button 
                  onClick={() => onRemoveItem(item.id)}
                  className="btn-remove"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}