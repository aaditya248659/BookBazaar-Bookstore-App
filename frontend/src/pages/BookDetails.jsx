import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card, Spinner, Badge } from 'react-bootstrap';
import { booksAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [imgSrc, setImgSrc] = useState('');
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchBook();
  }, [id]);

  const getPlaceholder = (text) => {
    const svg = `<svg width="300" height="400" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="400" fill="#667eea"/>
      <text x="50%" y="50%" text-anchor="middle" fill="white" font-size="20" font-family="Arial">
        ${text}
      </text>
    </svg>`;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  const getValidImageUrl = (url, title) => {
    if (!url || url === '' || url === 'undefined' || url === 'null') {
      return getPlaceholder(title?.substring(0, 20) || 'Book');
    }
    // Block all Amazon CDN URLs that cause CORS issues
    if (url.includes('images-na.ssl-images-amazon.com') || 
        url.includes('m.media-amazon.com') ||
        url.includes('images-amazon.com')) {
      return getPlaceholder(title?.substring(0, 20) || 'Book');
    }
    return url;
  };

  const fetchBook = async () => {
    try {
      setLoading(true);
      const { data } = await booksAPI.getBook(id);
      setBook(data);
      setImgSrc(getValidImageUrl(data.image, data.title));
    } catch (error) {
      toast.error('Failed to load book details');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    addToCart(book, quantity);
  };

  const handleImageError = () => {
    setImgSrc(getPlaceholder(book?.title?.substring(0, 20) || 'Book'));
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!book) {
    return (
      <Container className="py-5">
        <h3>Book not found</h3>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Button variant="outline-secondary" className="mb-4" onClick={() => navigate(-1)}>
        ← Back
      </Button>

      <Row>
        <Col md={5}>
          <Card>
            <Card.Img 
              variant="top" 
              src={imgSrc} 
              alt={book.title}
              onError={handleImageError}
            />
          </Card>
        </Col>
        <Col md={7}>
          <h1>{book.title}</h1>
          <h4 className="text-muted mb-3">by {book.author}</h4>
          
          <div className="mb-3">
            <Badge bg="primary" className="me-2">
              {book.category}
            </Badge>
            {book.stock > 0 ? (
              <Badge bg="success">In Stock: {book.stock}</Badge>
            ) : (
              <Badge bg="danger">Out of Stock</Badge>
            )}
          </div>

          <h2 className="text-primary mb-4">₹{book.price}</h2>

          <div className="mb-4">
            <h5>Description</h5>
            <p className="text-muted">{book.description}</p>
          </div>

          {book.publisher && (
            <div className="mb-3">
              <strong>Publisher:</strong> {book.publisher}
            </div>
          )}

          {book.publishedDate && (
            <div className="mb-3">
              <strong>Published:</strong>{' '}
              {new Date(book.publishedDate).toLocaleDateString()}
            </div>
          )}

          {book.isbn && (
            <div className="mb-3">
              <strong>ISBN:</strong> {book.isbn}
            </div>
          )}

          {book.rating > 0 && (
            <div className="mb-4">
              <strong>Rating:</strong> ⭐ {book.rating.toFixed(1)} / 5
            </div>
          )}

          {book.stock > 0 && (
            <div className="mb-4">
              <Row className="align-items-center">
                <Col md={3}>
                  <label className="mb-2">Quantity:</label>
                  <div className="d-flex align-items-center gap-2">
                    <Button
                      variant="outline-secondary"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </Button>
                    <span className="mx-2 fw-bold">{quantity}</span>
                    <Button
                      variant="outline-secondary"
                      onClick={() => setQuantity(Math.min(book.stock, quantity + 1))}
                    >
                      +
                    </Button>
                  </div>
                </Col>
                <Col md={9}>
                  <Button
                    variant="success"
                    size="lg"
                    onClick={handleAddToCart}
                    className="w-100"
                  >
                    Add to Cart
                  </Button>
                </Col>
              </Row>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default BookDetails;