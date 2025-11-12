import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Row, Col, Badge, Spinner, Button, Modal } from 'react-bootstrap';
import { ordersAPI, paymentAPI } from '../services/api';
import { toast } from 'react-toastify';
import PaymentModal from '../components/PaymentModal';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const { data } = await ordersAPI.getOrder(id);
      setOrder(data);
    } catch (error) {
      toast.error('Failed to load order details');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'warning',
      processing: 'info',
      shipped: 'primary',
      delivered: 'success',
      cancelled: 'danger',
    };
    return badges[status] || 'secondary';
  };

  const handlePaymentSuccess = async (paymentData) => {
    try {
      const { data } = await paymentAPI.processPayment({
        orderId: order._id,
        amount: order.totalAmount,
        paymentMethod: paymentData.method,
        paymentDetails: paymentData
      });

      if (data.success) {
        toast.success('Payment successful!');
        setShowPaymentModal(false);
        fetchOrder(); // Refresh order to show updated payment status
        navigate(`/receipt/${order._id}`);
      } else {
        toast.error('Payment failed. Please try again.');
      }
    } catch (error) {
      toast.error('Payment processing failed');
    }
  };

  const handleCancelRequest = async () => {
    try {
      setCancelling(true);
      await ordersAPI.cancelOrder(order._id);
      toast.success('Order cancelled successfully');
      setShowCancelModal(false);
      fetchOrder(); // Refresh order to show updated status
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <Container className="py-5">
        <h3>Order not found</h3>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Button variant="outline-secondary" className="mb-4" onClick={() => navigate(-1)}>
        ← Back to Orders
      </Button>

      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h3>Order #{order._id.slice(-8).toUpperCase()}</h3>
                  <small className="text-muted">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </small>
                </div>
                <Badge bg={getStatusBadge(order.status)} className={`bg-${order.status}`}>
                  {order.status.toUpperCase()}
                </Badge>
              </div>

              <h5 className="mb-3">Order Items</h5>
              {order.items.map((item, index) => {
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

                return (
                  <div key={index} className="border-bottom pb-3 mb-3">
                    <Row className="align-items-center">
                      <Col md={2}>
                        {item.book?.image && (
                          <img
                            src={getValidImageUrl(item.book.image)}
                            alt={item.title}
                            className="img-fluid rounded"
                            onError={(e) => {
                              e.target.src = getPlaceholder();
                            }}
                          />
                        )}
                      </Col>
                    <Col md={6}>
                      <h6>{item.title}</h6>
                      <small className="text-muted">Quantity: {item.quantity}</small>
                    </Col>
                    <Col md={4} className="text-end">
                      <strong>₹{(item.price * item.quantity).toFixed(2)}</strong>
                    </Col>
                  </Row>
                </div>
                );
              })}

              <div className="text-end mt-4">
                <h5>Total: ₹{order.totalAmount.toFixed(2)}</h5>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <h5 className="mb-3">Shipping Address</h5>
              <p className="mb-1">{order.shippingAddress.address}</p>
              <p className="mb-1">{order.shippingAddress.city}</p>
              <p className="mb-1">{order.shippingAddress.postalCode}</p>
              <p className="mb-0">{order.shippingAddress.country}</p>
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Body>
              <h5 className="mb-3">Payment Information</h5>
              <div className="mb-2">
                <strong>Method:</strong> {order.paymentMethod}
              </div>
              <div className="mb-2">
                <strong>Status:</strong>{' '}
                <Badge bg={order.isPaid ? 'success' : 'warning'}>
                  {order.isPaid ? 'Paid' : 'Not Paid'}
                </Badge>
              </div>
              {order.paidAt && (
                <div>
                  <strong>Paid At:</strong>{' '}
                  {new Date(order.paidAt).toLocaleDateString()}
                </div>
              )}
              {order.paymentDetails?.transactionId && (
                <div className="mt-2">
                  <strong>Transaction ID:</strong>{' '}
                  <small className="text-muted">{order.paymentDetails.transactionId}</small>
                </div>
              )}
              
              {/* Payment and Receipt Buttons */}
              {!order.isPaid && order.status !== 'cancelled' && (
                <Button 
                  variant="success" 
                  className="w-100 mt-3"
                  onClick={() => setShowPaymentModal(true)}
                >
                  💳 Pay Now
                </Button>
              )}
              {order.isPaid && (
                <Button 
                  variant="primary" 
                  className="w-100 mt-3"
                  onClick={() => navigate(`/receipt/${order._id}`)}
                >
                  🧾 View Receipt
                </Button>
              )}
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <h5 className="mb-3">Delivery Status</h5>
              <div className="mb-2">
                <strong>Status:</strong>{' '}
                <Badge bg={order.isDelivered ? 'success' : 'warning'}>
                  {order.isDelivered ? 'Delivered' : 'Not Delivered'}
                </Badge>
              </div>
              {order.deliveredAt && (
                <div className="mb-2">
                  <strong>Delivered At:</strong>{' '}
                  {new Date(order.deliveredAt).toLocaleDateString()}
                </div>
              )}
              
              {/* Tracking Details */}
              {order.trackingDetails && (
                <div className="mt-3 p-3 bg-light rounded">
                  <strong className="d-block mb-2">📍 Tracking Updates:</strong>
                  <p className="mb-0 text-muted small">{order.trackingDetails}</p>
                </div>
              )}
              
              {/* Cancel Order Button */}
              {!order.isDelivered && order.status !== 'cancelled' && (
                <Button 
                  variant="danger" 
                  className="w-100 mt-3"
                  onClick={() => setShowCancelModal(true)}
                >
                  ❌ Cancel Order
                </Button>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Payment Modal */}
      <PaymentModal
        show={showPaymentModal}
        onHide={() => setShowPaymentModal(false)}
        onPaymentSuccess={handlePaymentSuccess}
        amount={order.totalAmount}
      />

      {/* Cancel Confirmation Modal */}
      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Cancel Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to cancel this order?</p>
          <p className="text-muted small">Order ID: #{order._id.slice(-8).toUpperCase()}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
            No, Keep Order
          </Button>
          <Button 
            variant="danger" 
            onClick={handleCancelRequest}
            disabled={cancelling}
          >
            {cancelling ? 'Cancelling...' : 'Yes, Cancel Order'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default OrderDetails;