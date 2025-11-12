import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const BookCard = ({ book }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  
  // Simple SVG placeholder as data URI
  const getPlaceholder = (text) => {
    const svg = `<svg width="300" height="400" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="400" fill="#667eea"/>
      <text x="50%" y="50%" text-anchor="middle" fill="white" font-size="20" font-family="Arial">
        ${text}
      </text>
    </svg>`;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  const [imgSrc, setImgSrc] = useState(book.image || getPlaceholder(book?.title?.substring(0, 20) || 'Book'));

  const handleAddToCart = () => {
    addToCart(book);
  };

  const handleImageError = () => {
    // Fallback to placeholder with book title
    setImgSrc(getPlaceholder(book?.title?.substring(0, 20) || 'Book'));
  };

  return (
    <Card className="book-card">
      <Card.Img 
        variant="top" 
        src={imgSrc} 
        alt={book.title}
        onError={handleImageError}
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title>{book.title}</Card.Title>
        <Card.Text className="text-muted">{book.author}</Card.Text>
        <Card.Text>
          <small className="text-muted">{book.category}</small>
        </Card.Text>
        <Card.Text className="text-truncate" style={{ maxHeight: '48px' }}>
          {book.description}
        </Card.Text>
        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0 text-primary">₹{book.price}</h5>
            <small className="text-muted">
              {book.stock > 0 ? `${book.stock} in stock` : 'Out of stock'}
            </small>
          </div>
          <div className="d-flex gap-2">
            <Button
              variant="primary"
              className="flex-grow-1"
              as={Link}
              to={`/books/${book._id}`}
            >
              View Details
            </Button>
            {isAuthenticated && book.stock > 0 && (
              <Button
                variant="success"
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default BookCard;