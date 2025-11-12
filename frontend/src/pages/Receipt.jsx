import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Table } from 'react-bootstrap';
import { ordersAPI } from '../services/api';
import { toast } from 'react-toastify';

const Receipt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const { data } = await ordersAPI.getOrder(id);
      setOrder(data);
    } catch (error) {
      toast.error('Failed to load receipt');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    window.print();
  };

  if (loading || !order) {
    return <Container className="py-5 text-center">Loading...</Container>;
  }

  return (
    <Container className="py-5">
      <div className="receipt-container">
        <Card className="receipt-card">
          <Card.Body>
            {/* Header */}
            <div className="text-center mb-4 pb-4 border-bottom">
              <h1 className="text-primary mb-0">📚 BookBazaar</h1>
              <p className="text-muted mb-0">Your Online Bookstore</p>
              <p className="small text-muted">www.bookbazaar.com | support@bookbazaar.com</p>
            </div>

            {/* Receipt Title */}
            <div className="text-center mb-4">
              <h2 className="mb-1">PAYMENT RECEIPT</h2>
              <p className="text-muted">Invoice #{order._id.slice(-8).toUpperCase()}</p>
            </div>

            {/* Receipt Details */}
            <div className="row mb-4">
              <div className="col-6">
                <h6 className="text-muted mb-2">Receipt Details:</h6>
                <p className="mb-1"><strong>Order ID:</strong> {order._id.slice(-8).toUpperCase()}</p>
                <p className="mb-1"><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                <p className="mb-1"><strong>Time:</strong> {new Date(order.createdAt).toLocaleTimeString()}</p>
                {order.paymentDetails?.transactionId && (
                  <p className="mb-1"><strong>Transaction ID:</strong> {order.paymentDetails.transactionId}</p>
                )}
              </div>
              <div className="col-6 text-end">
                <h6 className="text-muted mb-2">Bill To:</h6>
                <p className="mb-1"><strong>{order.user?.name || 'Customer'}</strong></p>
                <p className="mb-1">{order.shippingAddress.address}</p>
                <p className="mb-1">{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                <p className="mb-1">{order.shippingAddress.country}</p>
              </div>
            </div>

            {/* Items Table */}
            <Table bordered className="mb-4">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Book Title</th>
                  <th className="text-center">Quantity</th>
                  <th className="text-end">Price</th>
                  <th className="text-end">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.title}</td>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-end">₹{item.price.toFixed(2)}</td>
                    <td className="text-end">₹{(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* Totals */}
            <div className="row">
              <div className="col-6 offset-6">
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <span>₹{(order.totalAmount - 50).toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping:</span>
                  <span>₹50.00</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-2">
                  <strong>Total Amount:</strong>
                  <strong className="text-primary">₹{order.totalAmount.toFixed(2)}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Payment Method:</span>
                  <span>{order.paymentMethod}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Payment Status:</span>
                  <span className={order.isPaid ? 'text-success' : 'text-warning'}>
                    <strong>{order.isPaid ? '✓ PAID' : 'PENDING'}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-5 pt-4 border-top">
              <p className="text-muted small mb-1">Thank you for shopping with BookBazaar!</p>
              <p className="text-muted small">For any queries, contact us at support@bookbazaar.com</p>
            </div>

            {/* Action Buttons - Hidden in Print */}
            <div className="text-center mt-4 no-print">
              <Button variant="primary" onClick={handlePrint} className="me-2">
                🖨️ Print Receipt
              </Button>
              <Button variant="outline-primary" onClick={handleDownload}>
                📥 Download PDF
              </Button>
              <Button variant="outline-secondary" onClick={() => navigate('/orders')} className="ms-2">
                ← Back to Orders
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .receipt-container, .receipt-container * {
            visibility: visible;
          }
          .receipt-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
          .receipt-card {
            border: none !important;
            box-shadow: none !important;
          }
        }
        .receipt-card {
          max-width: 800px;
          margin: 0 auto;
        }
      `}</style>
    </Container>
  );
};

export default Receipt;
