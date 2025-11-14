import { useState } from "react";

export default function ItemModal({ item, isOpen, onClose, onAddToCart }) {
  const [imageError, setImageError] = useState(false);

  if (!isOpen || !item) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <div className="modal-image">
          {!imageError && item.image && item.image.startsWith("http") ? (
            <img
              src={item.image}
              alt={item.name}
              onError={() => setImageError(true)}
              className="modal-food-image"
            />
          ) : (
            <div className="modal-emoji-fallback">
              {item.fallbackEmoji || item.image || "🍽️"}
            </div>
          )}
        </div>

        <div className="modal-info">
          <h2>{item.name}</h2>
          <p className="modal-category">{item.category}</p>
          <p className="modal-price">{item.price} NOK</p>
          {item.description && (
            <p className="modal-description">{item.description}</p>
          )}

          <button
            className="btn-primary modal-add-btn"
            onClick={() => {
              onAddToCart(item);
              onClose();
            }}
          >
            Add to Cart - {item.price} NOK
          </button>
        </div>
      </div>
    </div>
  );
}
