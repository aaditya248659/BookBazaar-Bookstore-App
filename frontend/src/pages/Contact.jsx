import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    
    // Simulate sending message
    setTimeout(() => {
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSending(false);
    }, 1500);
  };

  return (
    <Container className="py-5">
      <Row className="mb-5">
        <Col>
          <h1 className="text-center mb-4">Contact Us</h1>
          <p className="lead text-center text-muted">
            Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </Col>
      </Row>

      <Row>
        <Col md={4} className="mb-4">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center p-4">
              <div className="mb-3" style={{ fontSize: '2.5rem' }}>📍</div>
              <h5>Visit Us</h5>
              <p className="text-muted mb-0">
                BookBazaar Headquarters<br />
                123 Book Street, Reading Corner<br />
                New Delhi - 110001<br />
                India
              </p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center p-4">
              <div className="mb-3" style={{ fontSize: '2.5rem' }}>📧</div>
              <h5>Email Us</h5>
              <p className="text-muted mb-2">
                <strong>General Inquiries:</strong><br />
                info@bookbazaar.com
              </p>
              <p className="text-muted mb-2">
                <strong>Support:</strong><br />
                support@bookbazaar.com
              </p>
              <p className="text-muted mb-0">
                <strong>Orders:</strong><br />
                orders@bookbazaar.com
              </p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center p-4">
              <div className="mb-3" style={{ fontSize: '2.5rem' }}>📞</div>
              <h5>Call Us</h5>
              <p className="text-muted mb-2">
                <strong>Customer Service:</strong><br />
                +91 1234567890
              </p>
              <p className="text-muted mb-2">
                <strong>Order Support:</strong><br />
                +91 0987654321
              </p>
              <p className="text-muted mb-0">
                <small>Mon-Sat: 9:00 AM - 6:00 PM IST</small>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col lg={8} className="mx-auto">
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <h3 className="mb-4">Send Us a Message</h3>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Your Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Your Email *</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Subject *</Form.Label>
                  <Form.Control
                    type="text"
                    name="subject"
                    placeholder="What is your message about?"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Message *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="message"
                    placeholder="Write your message here..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-100"
                  disabled={sending}
                >
                  {sending ? 'Sending...' : 'Send Message'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col>
          <Card className="bg-light border-0">
            <Card.Body className="p-4">
              <h4 className="mb-3">Frequently Asked Questions</h4>
              <Row>
                <Col md={6}>
                  <h6>What are your business hours?</h6>
                  <p className="text-muted">
                    Our online store is available 24/7. Customer support is available Monday to Saturday, 9:00 AM - 6:00 PM IST.
                  </p>
                </Col>
                <Col md={6}>
                  <h6>How long does delivery take?</h6>
                  <p className="text-muted">
                    Standard delivery takes 5-7 business days. Express delivery options are available at checkout.
                  </p>
                </Col>
                <Col md={6}>
                  <h6>What payment methods do you accept?</h6>
                  <p className="text-muted">
                    We accept Cash on Delivery (COD), Credit/Debit Cards, UPI, and NetBanking.
                  </p>
                </Col>
                <Col md={6}>
                  <h6>Can I return or exchange books?</h6>
                  <p className="text-muted">
                    Yes, we have a 7-day return and exchange policy for damaged or incorrect items.
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;
