import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Spinner, Button } from 'react-bootstrap';
import { booksAPI } from '../services/api';
import BookCard from '../components/BookCard';
import { toast } from 'react-toastify';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = [
    'All',
    'Fiction',
    'Non-Fiction',
    'Science',
    'Technology',
    'Biography',
    'History',
    'Self-Help',
    'Fantasy',
    'Mystery',
    'Romance',
    'Other',
  ];

  useEffect(() => {
    fetchBooks();
  }, [search, category, page]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 12,
      };

      if (search) params.search = search;
      if (category && category !== 'All') params.category = category;

      const { data } = await booksAPI.getAllBooks(params);
      setBooks(data.books);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setPage(1);
  };

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1 className="text-center mb-4">Welcome to BookBazaar</h1>
          <p className="text-center text-muted">
            Discover your next favorite book from our collection
          </p>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={8}>
          <Form.Control
            type="text"
            placeholder="Search books by title or author..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </Col>
        <Col md={4}>
          <Form.Select
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {loading ? (
        <div className="loading-spinner">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          {books.length === 0 ? (
            <div className="text-center py-5">
              <h3>No books found</h3>
              <p className="text-muted">Try adjusting your search or filters</p>
            </div>
          ) : (
            <>
              <Row>
                {books.map((book) => (
                  <Col key={book._id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                    <BookCard book={book} />
                  </Col>
                ))}
              </Row>

              {totalPages > 1 && (
                <Row className="mt-4">
                  <Col className="d-flex justify-content-center gap-2">
                    <Button
                      variant="outline-primary"
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                    >
                      Previous
                    </Button>
                    <span className="d-flex align-items-center mx-3">
                      Page {page} of {totalPages}
                    </span>
                    <Button
                      variant="outline-primary"
                      disabled={page === totalPages}
                      onClick={() => setPage(page + 1)}
                    >
                      Next
                    </Button>
                  </Col>
                </Row>
              )}
            </>
          )}
        </>
      )}
    </Container>
  );
};

export default Home;