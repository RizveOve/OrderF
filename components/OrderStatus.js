export default function OrderStatus({ orderId, status }) {
  const getStatusInfo = (status) => {
    switch (status) {
      case 'preparing':
        return { text: 'Preparing your delicious order', icon: '👨‍🍳🔥', color: '#FFA500' };
      case 'ready':
        return { text: 'Order ready for pickup!', icon: '✅🍗', color: '#28a745' };
      case 'completed':
        return { text: 'Order completed - Enjoy!', icon: '🎉😋', color: '#FFD700' };
      default:
        return { text: 'Processing your order...', icon: '⏳📋', color: '#6c757d' };
    }
  };

  const statusInfo = getStatusInfo(status);

  return (
    <div className="container">
      <header className="header">
        <div className="logo-section">
          <div className="logo-container">
            <img 
              src="https://cdn.prod.website-files.com/6307266e269e4a08d8b311b7/6307266e269e4a7d28b3122e_Flychicken_vanlig_RGB_HvitClucking_Web.png"
              alt="Fly Chicken Logo"
              className="brand-logo"
            />
          </div>
          <div className="logo-text">

          </div>
        </div>
      </header>

      <main className="main">
        <div className="order-status-card">
          <div className="status-icon" style={{ color: statusInfo.color }}>
            {statusInfo.icon}
          </div>
          <h2>Order #{orderId.slice(-6).toUpperCase()}</h2>
          <p className="status-text">{statusInfo.text}</p>
          
          {status === 'ready' && (
            <div className="ready-notification">
              <p>🔔 Your order is ready! Please come to the counter to collect it.</p>
            </div>
          )}
          
          <button 
            className="btn-secondary"
            onClick={() => window.location.reload()}
          >
            Place New Order
          </button>
        </div>
      </main>
    </div>
  );
}