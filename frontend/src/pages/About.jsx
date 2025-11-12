import { Container, Row, Col, Card } from 'react-bootstrap';

const About = () => {
  return (
    <Container className="py-5">
      <Row className="mb-5">
        <Col>
          <h1 className="text-center mb-4">About BookBazaar</h1>
          <p className="lead text-center text-muted">
            Your trusted online destination for books of all genres
          </p>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col md={6}>
          <h2>Our Story</h2>
          <p>
            Founded in 2025, BookBazaar was born out of a passion for reading and a desire to make quality books accessible to everyone. We started as a small online bookstore and have grown into a comprehensive platform serving thousands of book lovers across the country.
          </p>
          <p>
            Our mission is simple: to connect readers with the books they love and help them discover new favorites along the way. Whether you're looking for the latest bestseller, a timeless classic, or a hidden gem, BookBazaar has something for every reader.
          </p>
        </Col>
        <Col md={6}>
          <h2>Why Choose Us?</h2>
          <ul className="list-unstyled">
            <li className="mb-3">
              <strong>📚 Vast Collection:</strong> Over 10,000+ titles across all genres including Fiction, Non-Fiction, Technology, Business, Self-Help, and more.
            </li>
            <li className="mb-3">
              <strong>💰 Best Prices:</strong> Competitive pricing with regular discounts and offers to make reading affordable.
            </li>
            <li className="mb-3">
              <strong>🚚 Fast Delivery:</strong> Quick and reliable shipping to ensure your books reach you on time.
            </li>
            <li className="mb-3">
              <strong>🔒 Secure Payments:</strong> Multiple payment options including COD, Card, UPI, and NetBanking with secure checkout.
            </li>
            <li className="mb-3">
              <strong>⭐ Quality Assurance:</strong> All books are carefully inspected before shipping to ensure you receive only the best.
            </li>
          </ul>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col>
          <h2 className="text-center mb-4">Our Values</h2>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col md={4}>
          <Card className="h-100 text-center p-4 border-0 shadow-sm">
            <Card.Body>
              <div className="mb-3" style={{ fontSize: '3rem' }}>📖</div>
              <h4>Promote Reading</h4>
              <p className="text-muted">
                We believe in the power of books to educate, inspire, and transform lives. Our goal is to make reading accessible to everyone.
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 text-center p-4 border-0 shadow-sm">
            <Card.Body>
              <div className="mb-3" style={{ fontSize: '3rem' }}>🤝</div>
              <h4>Customer First</h4>
              <p className="text-muted">
                Your satisfaction is our priority. We're committed to providing excellent service and support at every step of your journey.
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 text-center p-4 border-0 shadow-sm">
            <Card.Body>
              <div className="mb-3" style={{ fontSize: '3rem' }}>🌱</div>
              <h4>Sustainable Growth</h4>
              <p className="text-muted">
                We're committed to sustainable practices in packaging and operations to minimize our environmental impact.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="bg-primary text-white text-center p-5">
            <Card.Body>
              <h2>Join Our Reading Community</h2>
              <p className="lead mb-0">
                With thousands of satisfied customers, BookBazaar has become a trusted name in online book shopping. Start your reading journey with us today!
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default About;
