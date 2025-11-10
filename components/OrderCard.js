export default function OrderCard({ order, onUpdateStatus }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'preparing': return '#ff9800';
      case 'ready': return '#4caf50';
      case 'completed': return '#2196f3';
      default: return '#757575';
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    return timestamp.toDate().toLocaleTimeString();
  };

  return (
    <div className="order-card">
      <div className="order-header">
        <h3>Order #{order.id.slice(-6).toUpperCase()}</h3>
        <span className="order-time">{formatTime(order.timestamp)}</span>
      </div>
      
      <div className="order-details">
        <p><strong>Table:</strong> {order.tableNumber}</p>
        <p><strong>Total:</strong> {order.total} NOK</p>
        
        <div className="order-items">
          <h4>Items:</h4>
          {order.items?.map((item, index) => (
            <div key={index} className="order-item">
              <span>{item.quantity}x {item.name}</span>
              <span>{(item.price * item.quantity)} NOK</span>
            </div>
          ))}
        </div>
      </div>

      <div className="order-status">
        <span 
          className="status-badge"
          style={{ backgroundColor: getStatusColor(order.status) }}
        >
          {order.status?.toUpperCase()}
        </span>
      </div>

      <div className="order-actions">
        {order.status === 'preparing' && (
          <button 
            className="btn-success"
            onClick={() => onUpdateStatus(order.id, 'ready')}
          >
            Mark Ready
          </button>
        )}
        {order.status === 'ready' && (
          <button 
            className="btn-primary"
            onClick={() => onUpdateStatus(order.id, 'completed')}
          >
            Complete Order
          </button>
        )}
      </div>
    </div>
  );
}