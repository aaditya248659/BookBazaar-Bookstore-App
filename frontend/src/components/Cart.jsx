import { useState } from 'react';
import { Button, Image } from 'react-bootstrap';
import { useCart } from '../context/CartContext';

const Cart = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  
  const getPlaceholder = () => {
    const svg = `<svg width="100" height="140" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="140" fill="#667eea"/>
      <text x="50%" y="50%" text-anchor="middle" fill="white" font-size="16" font-family="Arial">Book</text>
    </svg>`;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  const getValidImageUrl = (url) => {
    if (!url || url === '' || url === 'undefined' || url === 'null') {
      return getPlaceholder();
    }
    // Block all Amazon CDN URLs that cause CORS issues
    if (url.includes('images-na.ssl-images-amazon.com') || 
        url.includes('m.media-amazon.com') ||
        url.includes('images-amazon.com')) {
      return getPlaceholder();
    }
    return url;
  };

  const [imgSrc, setImgSrc] = useState(getValidImageUrl(item.image));

  const handleImageError = () => {
    setImgSrc(getPlaceholder());
  };

  return (
    <div className="cart-item">
      <div className="row align-items-center">
        <div className="col-md-2">
          <Image 
            src={imgSrc} 
            alt={item.title} 
            fluid 
            rounded 
            onError={handleImageError}
          />
        </div>
        <div className="col-md-3">
          <h5>{item.title}</h5>
          <p className="text-muted mb-0">{item.author}</p>
        </div>
        <div className="col-md-2">
          <h6>₹{item.price}</h6>
        </div>
        <div className="col-md-3">
          <div className="d-flex align-items-center gap-2">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => updateQuantity(item._id, item.quantity - 1)}
            >
              -
            </Button>
            <span className="mx-2">{item.quantity}</span>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => updateQuantity(item._id, item.quantity + 1)}
              disabled={item.quantity >= item.stock}
            >
              +
            </Button>
          </div>
        </div>
        <div className="col-md-2 text-end">
          <h6>₹{(item.price * item.quantity).toFixed(2)}</h6>
          <Button
            variant="danger"
            size="sm"
            onClick={() => removeFromCart(item._id)}
          >
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cart;