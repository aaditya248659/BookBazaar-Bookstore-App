import { useState } from 'react';
import { Modal, Form, Button, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';

const PaymentModal = ({ show, onHide, amount, onPaymentSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('Card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('');

  const handleChange = (e) => {
    let value = e.target.value;
    const name = e.target.name;

    // Format card number with spaces
    if (name === 'cardNumber') {
      value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (value.length > 19) return;
    }

    // Format expiry as MM/YY
    if (name === 'expiry') {
      value = value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
      }
      if (value.length > 5) return;
    }

    // Limit CVV to 3 digits
    if (name === 'cvv') {
      value = value.replace(/\D/g, '').slice(0, 3);
    }

    setCardDetails({ ...cardDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      onPaymentSuccess({
        method: selectedMethod,
        cardDetails: selectedMethod === 'Card' ? cardDetails : null,
        upiId: selectedMethod === 'UPI' ? upiId : null,
        bank: selectedMethod === 'NetBanking' ? selectedBank : null,
      });
      onHide();
    }, 2000);
  };

  const getPaymentIcon = () => {
    switch (selectedMethod) {
      case 'Card':
        return '💳';
      case 'UPI':
        return '📱';
      case 'NetBanking':
        return '🏦';
      default:
        return '💰';
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {getPaymentIcon()} Payment
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center mb-4">
          <h2 className="text-primary">₹{amount?.toFixed(2) || '0.00'}</h2>
          <small className="text-muted">Amount to pay</small>
        </div>

        <div className="alert alert-warning small mb-4">
          ⚠️ This is a demo payment gateway for development purposes
        </div>

        {/* Payment Method Selector */}
        <div className="mb-4">
          <Form.Label>Select Payment Method</Form.Label>
          <div className="btn-group w-100" role="group">
            <Button
              variant={selectedMethod === 'Card' ? 'primary' : 'outline-primary'}
              onClick={() => setSelectedMethod('Card')}
            >
              💳 Card
            </Button>
            <Button
              variant={selectedMethod === 'UPI' ? 'primary' : 'outline-primary'}
              onClick={() => setSelectedMethod('UPI')}
            >
              📱 UPI
            </Button>
            <Button
              variant={selectedMethod === 'NetBanking' ? 'primary' : 'outline-primary'}
              onClick={() => setSelectedMethod('NetBanking')}
            >
              🏦 NetBanking
            </Button>
          </div>
        </div>

        {selectedMethod === 'Card' && (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Card Number</Form.Label>
              <Form.Control
                type="text"
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={cardDetails.cardNumber}
                onChange={handleChange}
                required
              />
              <Form.Text className="text-muted">
                Test: 4111 1111 1111 1111
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Cardholder Name</Form.Label>
              <Form.Control
                type="text"
                name="cardName"
                placeholder="John Doe"
                value={cardDetails.cardName}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <div className="row">
              <div className="col-6">
                <Form.Group className="mb-3">
                  <Form.Label>Expiry Date</Form.Label>
                  <Form.Control
                    type="text"
                    name="expiry"
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-6">
                <Form.Group className="mb-3">
                  <Form.Label>CVV</Form.Label>
                  <Form.Control
                    type="password"
                    name="cvv"
                    placeholder="123"
                    value={cardDetails.cvv}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </div>
            </div>

            <Button
              variant="primary"
              type="submit"
              className="w-100"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Processing...
                </>
              ) : (
                `Pay ₹${amount?.toFixed(2) || '0.00'}`
              )}
            </Button>
          </Form>
        )}

        {selectedMethod === 'UPI' && (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>UPI ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="username@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                required
              />
              <Form.Text className="text-muted">
                Test: test@upi
              </Form.Text>
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Processing...
                </>
              ) : (
                `Pay ₹${amount?.toFixed(2) || '0.00'}`
              )}
            </Button>
          </Form>
        )}

        {selectedMethod === 'NetBanking' && (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Select Your Bank</Form.Label>
              <Form.Select 
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                required
              >
                <option value="">Choose...</option>
                <option value="sbi">State Bank of India</option>
                <option value="hdfc">HDFC Bank</option>
                <option value="icici">ICICI Bank</option>
                <option value="axis">Axis Bank</option>
              </Form.Select>
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Processing...
                </>
              ) : (
                `Pay ₹${amount?.toFixed(2) || '0.00'}`
              )}
            </Button>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default PaymentModal;
