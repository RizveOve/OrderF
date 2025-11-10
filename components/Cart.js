export default function Cart({ items, onRemoveItem, onUpdateQuantity, onPlaceOrder, isMobile = false }) {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  if (isMobile) {
    // Mobile sticky cart at bottom
    return (
      <div className="mobile-cart-sticky">
        <div className="mobile-cart-summary" onClick={() => {}}>
          <div className="cart-info">
            <span className="cart-count">{itemCount} items</span>
            <span className="cart-total-mobile">{total} NOK</span>
          </div>
          <button 
            className="btn-success mobile-order-btn"
            onClick={onPlaceOrder}
            disabled={items.length === 0}
          >
            Place Order
          </button>
        </div>
        
        {items.length > 0 && (
          <div className="mobile-cart-items">
            {items.map(item => (
              <div key={item.id} className="mobile-cart-item">
                <div className="mobile-cart-item-info">
                  <span className="mobile-item-name">{item.name}</span>
                  <span className="mobile-item-price">{item.price} NOK</span>
                </div>
                <div className="mobile-quantity-controls">
                  <button 
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    className="btn-quantity-mobile"
                  >
                    -
                  </button>
                  <span className="mobile-quantity">{item.quantity}</span>
                  <button 
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className="btn-quantity-mobile"
                  >
                    +
                  </button>
                  <button 
                    onClick={() => onRemoveItem(item.id)}
                    className="btn-remove-mobile"
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

  // Desktop cart (original)
  if (items.length === 0) {
    return (
      <section className="cart-section">
        <h2>Your Order</h2>
        <p className="empty-cart">Your cart is empty</p>
      </section>
    );
  }

  return (
    <section className="cart-section">
      <h2>Your Order</h2>
      <div className="cart-items">
        {items.map(item => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-info">
              <span className="item-name">{item.name}</span>
              <span className="item-price">{item.price} NOK</span>
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
      <div className="cart-total">
        <strong>Total: {total} NOK</strong>
      </div>
      <button 
        className="btn-success btn-large"
        onClick={onPlaceOrder}
      >
        Place Order
      </button>
    </section>
  );
}