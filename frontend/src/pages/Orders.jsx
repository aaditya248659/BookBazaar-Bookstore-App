import { useState, useEffect } from 'react';
import { Container, Card, Badge, Spinner, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import { toast } from 'react-toastify';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await ordersAPI.getUserOrders();
      setOrders(data);
    } catch (error) {
      toast.error('Failed to load orders');
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

  if (loading) {
    return (
      <div className="loading-spinner">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Container className="py-5">
      <h1 className="mb-4">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-5">
          <h3>No orders yet</h3>
          <p className="text-muted mb-4">Start shopping to see your orders here</p>
          <Button as={Link} to="/" variant="primary">
            Browse Books
          </Button>
        </div>
      ) : (
        orders.map((order) => (
          <Card key={order._id} className="order-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h5>Order #{order._id.slice(-8).toUpperCase()}</h5>
                  <small className="text-muted">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </small>
                </div>
                <Badge bg={getStatusBadge(order.status)} className={`bg-${order.status}`}>
                  {order.status.toUpperCase()}
                </Badge>
              </div>

              <div className="mb-3">
                <strong>Items:</strong>
                {order.items.map((item, index) => (
                  <div key={index} className="text-muted">
                    • {item.title} x {item.quantity} - ₹{item.price}
                  </div>
                ))}
              </div>

              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>Total Amount: ₹{order.totalAmount.toFixed(2)}</strong>
                  <div>
                    <small className="text-muted">
                      Payment: {order.paymentMethod}
                      {order.isPaid ? ' (Paid)' : ' (Not Paid)'}
                    </small>
                  </div>
                </div>
                <div>
                  <Button
                    as={Link}
                    to={`/orders/${order._id}`}
                    variant="outline-primary"
                    className="me-2"
                  >
                    View Details
                  </Button>
                  {order.isPaid && (
                    <Button
                      as={Link}
                      to={`/receipt/${order._id}`}
                      variant="outline-success"
                    >
                      View Receipt
                    </Button>
                  )}
                </div>
              </div>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
};

export default Orders;