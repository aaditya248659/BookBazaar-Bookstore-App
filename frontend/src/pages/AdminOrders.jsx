import { useState, useEffect } from 'react';
import {
  Container,
  Table,
  Badge,
  Button,
  Spinner,
  Modal,
  Form,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import { toast } from 'react-toastify';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [trackingDetails, setTrackingDetails] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await ordersAPI.getAllOrders();
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

  const handleShowModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setTrackingDetails(order.trackingDetails || '');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
    setNewStatus('');
    setTrackingDetails('');
  };

  const handleUpdateStatus = async () => {
    try {
      await ordersAPI.updateOrderStatus(selectedOrder._id, { 
        status: newStatus,
        trackingDetails: trackingDetails 
      });
      toast.success('Order status updated successfully');
      handleCloseModal();
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update order status');
    }
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
      <h1 className="mb-4">Manage Orders</h1>

      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>#{order._id.slice(-8).toUpperCase()}</td>
                <td>
                  <div>{order.user?.name || 'N/A'}</div>
                  <small className="text-muted">
                    {order.user?.email || 'N/A'}
                  </small>
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>{order.items.length}</td>
                <td>₹{order.totalAmount.toFixed(2)}</td>
                <td>
                  <div>{order.paymentMethod}</div>
                  <Badge bg={order.isPaid ? 'success' : 'warning'}>
                    {order.isPaid ? 'Paid' : 'Not Paid'}
                  </Badge>
                </td>
                <td>
                  <Badge bg={getStatusBadge(order.status)} className={`bg-${order.status}`}>
                    {order.status.toUpperCase()}
                  </Badge>
                </td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => handleShowModal(order)}
                  >
                    Update Status
                  </Button>
                  <Button
                    variant="info"
                    size="sm"
                    as={Link}
                    to={`/orders/${order._id}`}
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update Order Status & Tracking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>
                Order: #{selectedOrder?._id.slice(-8).toUpperCase()}
              </Form.Label>
              <Form.Select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Tracking Details</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="e.g., Package dispatched from Delhi warehouse. Expected delivery by Dec 15. Tracking ID: TRK123456789"
                value={trackingDetails}
                onChange={(e) => setTrackingDetails(e.target.value)}
              />
              <Form.Text className="text-muted">
                Add shipping updates, tracking ID, or location details for customer
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateStatus}>
            Update Order
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminOrders;