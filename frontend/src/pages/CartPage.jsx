import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersAPI, paymentAPI } from '../services/api';
import Cart from '../components/Cart';
import PaymentModal from '../components/PaymentModal';
import { toast } from 'react-toastify';

const CartPage = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: 'India',
    paymentMethod: 'COD',
  });

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please login to proceed');
      navigate('/login');
      return;
    }
    setShowCheckout(true);
  };

  const handleInputChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    if (!shippingInfo.address || !shippingInfo.city || !shippingInfo.postalCode) {
      toast.error('Please fill all shipping details');
      return;
    }

    try {
      setLoading(true);
      const orderData = {
        items: cartItems.map((item) => ({
          book: item._id,
          quantity: item.quantity,
        })),
        shippingAddress: {
          address: shippingInfo.address,
          city: shippingInfo.city,
          postalCode: shippingInfo.postalCode,
          country: shippingInfo.country,
        },
        paymentMethod: shippingInfo.paymentMethod,
      };

      // Create order in database first
      const { data: order } = await ordersAPI.createOrder(orderData);
      setCurrentOrder(order);

      // If payment method is online, show payment modal
      if (shippingInfo.paymentMethod !== 'COD') {
        setShowPaymentModal(true);
      } else {
        // COD - direct success
        toast.success('Order placed successfully!');
        clearCart();
        navigate(`/orders/${order._id}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      // Process payment
      await paymentAPI.processPayment({
        orderId: currentOrder._id,
        paymentMethod: shippingInfo.paymentMethod,
      });

      toast.success('Order placed successfully!');
      clearCart();
      navigate(`/orders/${currentOrder._id}`);
    } catch (error) {
      toast.error('Payment processing failed');
    }
  };

  if (cartItems.length === 0) {
    return (
      <Container className="py-5 text-center">
        <h2>Your Cart is Empty</h2>
        <p className="text-muted mb-4">Start adding some books to your cart!</p>
        <Button as={Link} to="/" variant="primary">
          Browse Books
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h1 className="mb-4">Shopping Cart</h1>
      
      {!showCheckout ? (
        <Row>
          <Col md={8}>
            {cartItems.map((item) => (
              <Cart key={item._id} item={item} />
            ))}
          </Col>
          <Col md={4}>
            <Card>
              <Card.Body>
                <h4>Order Summary</h4>
                <hr />
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <span>₹{getCartTotal().toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping:</span>
                  <span>₹50.00</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-3">
                  <strong>Total:</strong>
                  <strong>₹{(getCartTotal() + 50).toFixed(2)}</strong>
                </div>
                <Button
                  variant="primary"
                  className="w-100"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col md={7}>
            <Card>
              <Card.Body>
                <h4 className="mb-4">Shipping Information</h4>
                <form onSubmit={handlePlaceOrder}>
                  <div className="mb-3">
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your full address"
                    />
                  </div>
                  <Row>
                    <Col md={6}>
                      <div className="mb-3">
                        <label className="form-label">City</label>
                        <input
                          type="text"
                          className="form-control"
                          name="city"
                          value={shippingInfo.city}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-3">
                        <label className="form-label">Postal Code</label>
                        <input
                          type="text"
                          className="form-control"
                          name="postalCode"
                          value={shippingInfo.postalCode}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </Col>
                  </Row>
                  <div className="mb-3">
                    <label className="form-label">Country</label>
                    <input
                      type="text"
                      className="form-control"
                      name="country"
                      value={shippingInfo.country}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Payment Method</label>
                    <select
                      className="form-select"
                      name="paymentMethod"
                      value={shippingInfo.paymentMethod}
                      onChange={handleInputChange}
                    >
                      <option value="COD">Cash on Delivery</option>
                      <option value="Card">Credit/Debit Card</option>
                      <option value="UPI">UPI</option>
                      <option value="NetBanking">Net Banking</option>
                    </select>
                  </div>
                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowCheckout(false)}
                    >
                      Back to Cart
                    </Button>
                    <Button
                      variant="success"
                      type="submit"
                      className="flex-grow-1"
                      disabled={loading}
                    >
                      {loading ? 'Placing Order...' : 'Place Order'}
                    </Button>
                  </div>
                </form>
              </Card.Body>
            </Card>
          </Col>
          <Col md={5}>
            <Card>
              <Card.Body>
                <h4>Order Summary</h4>
                <hr />
                {cartItems.map((item) => (
                  <div key={item._id} className="d-flex justify-content-between mb-2">
                    <small>
                      {item.title} x {item.quantity}
                    </small>
                    <small>₹{(item.price * item.quantity).toFixed(2)}</small>
                  </div>
                ))}
                <hr />
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <span>₹{getCartTotal().toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping:</span>
                  <span>₹50.00</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <strong>Total:</strong>
                  <strong>₹{(getCartTotal() + 50).toFixed(2)}</strong>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      <PaymentModal
        show={showPaymentModal}
        onHide={() => setShowPaymentModal(false)}
        amount={currentOrder ? currentOrder.totalAmount : 0}
        onPaymentSuccess={handlePaymentSuccess}
        paymentMethod={shippingInfo.paymentMethod}
      />
    </Container>
  );
};

export default CartPage;