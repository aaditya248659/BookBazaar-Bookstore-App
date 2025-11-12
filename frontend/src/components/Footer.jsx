import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col md={4}>
            <h5>📚 BookBazaar</h5>
            <p style={{ color: '#adb5bd' }}>
              Your one-stop destination for all your reading needs.
            </p>
          </Col>
          <Col md={4}>
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/about">About Us</a>
              </li>
              <li>
                <a href="/contact">Contact</a>
              </li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Contact Us</h5>
            <p style={{ color: '#adb5bd' }} className="mb-1">
              <strong>Email:</strong> info@bookbazaar.com
            </p>
            <p style={{ color: '#adb5bd' }} className="mb-1">
              <strong>Phone:</strong> +91 1234567890
            </p>
            <p style={{ color: '#adb5bd' }} className="mb-0">
              <strong>Address:</strong> New Delhi, India
            </p>
          </Col>
        </Row>
        <hr className="bg-light" />
        <Row>
          <Col className="text-center">
            <p style={{ color: '#adb5bd' }} className="mb-0">
              &copy; {new Date().getFullYear()} BookBazaar. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;