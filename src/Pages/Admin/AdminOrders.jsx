import React, { useState, useEffect, useCallback } from 'react';

const StatusBadge = ({ status }) => {
  const colors = {
    pending:    { bg: '#fef3c7', text: '#92400e', dot: '#f59e0b' },
    confirmed:  { bg: '#dbeafe', text: '#1e40af', dot: '#3b82f6' },
    processing: { bg: '#e0e7ff', text: '#3730a3', dot: '#6366f1' },
    shipped:    { bg: '#d1fae5', text: '#065f46', dot: '#10b981' },
    delivered:  { bg: '#d1fae5', text: '#065f46', dot: '#059669' },
    cancelled:  { bg: '#fee2e2', text: '#991b1b', dot: '#ef4444' },
  };
  const c = colors[status] || { bg: '#f3f4f6', text: '#6b7280', dot: '#9ca3af' };
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: c.bg, color: c.text, padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, textTransform: 'capitalize' }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.dot, display: 'inline-block' }} />
      {status}
    </span>
  );
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: 'all', paymentMethod: 'all', search: '', page: 1 });
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [notifyCustomer, setNotifyCustomer] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const token = localStorage.getItem('adminToken');
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
  const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: filters.page, limit: 15,
        ...(filters.status !== 'all' && { status: filters.status }),
        ...(filters.paymentMethod !== 'all' && { paymentMethod: filters.paymentMethod }),
        ...(filters.search && { search: filters.search }),
        sortBy: 'createdAt', order: 'desc',
      });
      const res = await fetch(`${API}/admin/orders?${params}`, { headers });
      const data = await res.json();
      if (data.success) {
        setOrders(data.data); setTotal(data.total);
        setTotalPages(data.totalPages); setSummary(data.summary);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const openOrderModal = async (orderId) => {
    try {
      const res = await fetch(`${API}/admin/orders/${orderId}`, { headers });
      const data = await res.json();
      if (data.success) { setSelectedOrder(data.data); setNewStatus(data.data.orderStatus); setModalOpen(true); }
    } catch (err) { console.error(err); }
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    setUpdatingStatus(true);
    try {
      const res = await fetch(`${API}/admin/orders/${selectedOrder._id}/status`, {
        method: 'PATCH', headers,
        body: JSON.stringify({ orderStatus: newStatus, notifyCustomer }),
      });
      const data = await res.json();
      if (data.success) { setModalOpen(false); fetchOrders(); }
      else alert(data.message);
    } catch { alert('Failed to update status'); }
    finally { setUpdatingStatus(false); }
  };

  const handleCancelOrder = async () => {
    if (!selectedOrder || !window.confirm('Cancel this order?')) return;
    try {
      const res = await fetch(`${API}/admin/orders/${selectedOrder._id}/cancel`, {
        method: 'PATCH', headers,
        body: JSON.stringify({ reason: cancelReason, notifyCustomer }),
      });
      const data = await res.json();
      if (data.success) { setModalOpen(false); fetchOrders(); }
      else alert(data.message);
    } catch { alert('Failed to cancel order'); }
  };

  const statuses = ['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Montserrat:wght@400;500;600;700&display=swap');
        .orders { font-family: 'Montserrat', sans-serif; }
        .card { background: #fff; border-radius: 16px; border: 1px solid #ede9fe; }

        /* Summary pills */
        .summary-pills {
          display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px;
        }
        .summary-pill {
          background: #fff; border-radius: 12px; padding: '10px 16px';
          display: flex; align-items: center; gap: 8px;
          flex: 1 1 auto; min-width: 80px;
        }

        /* Filter bar */
        .filter-bar {
          display: flex; gap: 10px; flex-wrap: wrap; align-items: center;
          padding: 14px 16px; border-bottom: 1px solid #f5f3ff;
        }
        .select, .search-input {
          padding: 9px 12px; border-radius: 10px; border: 1px solid #e5e7eb;
          font-family: 'Montserrat', sans-serif; font-size: 12px; font-weight: 500;
          color: #374151; outline: none; background: #faf5ff;
        }
        .search-input { flex: 1; min-width: 160px; }
        .select:focus, .search-input:focus { border-color: #9333ea; box-shadow: 0 0 0 2px rgba(147,51,234,0.1); }

        /* Status pills */
        .status-pills { display: flex; gap: 5px; flex-wrap: wrap; }
        .tab-pill {
          padding: 6px 12px; border-radius: 20px; border: 1px solid #e5e7eb;
          background: #fff; font-size: 11px; font-weight: 600; cursor: pointer;
          transition: all 0.2s; color: #6b7280; white-space: nowrap;
        }
        .tab-pill.active { background: linear-gradient(135deg, #9333ea, #ec4899); border-color: transparent; color: #fff; }
        .tab-pill:hover:not(.active) { border-color: #9333ea; color: #9333ea; }

        /* Table */
        .table { width: 100%; border-collapse: collapse; }
        .table th { background: #faf5ff; padding: 11px 14px; text-align: left; font-size: 10px; font-weight: 700; color: #9333ea; letter-spacing: 0.12em; text-transform: uppercase; border-bottom: 1px solid #ede9fe; white-space: nowrap; }
        .table td { padding: 12px 14px; font-size: 12px; color: #374151; border-bottom: 1px solid #f9f5ff; }
        .table tr:last-child td { border-bottom: none; }
        .table tr:hover td { background: #fdfaff; }
        .view-btn { padding: 6px 12px; border-radius: 8px; background: linear-gradient(135deg, #9333ea, #ec4899); color: #fff; border: none; font-size: 11px; font-weight: 700; cursor: pointer; }

        /* Pagination */
        .page-btn { width: 32px; height: 32px; border-radius: 8px; border: 1px solid #e5e7eb; background: #fff; cursor: pointer; font-size: 12px; font-weight: 600; color: #6b7280; }
        .page-btn.active { background: linear-gradient(135deg, #9333ea, #ec4899); color: #fff; border-color: transparent; }
        .page-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        /* Modal */
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 16px; }
        .modal { background: #fff; border-radius: 20px; width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto; box-shadow: 0 32px 80px rgba(0,0,0,0.2); }
        .modal-header { padding: 20px 22px 14px; border-bottom: 1px solid #f3f4f6; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; background: #fff; z-index: 1; }
        .modal-body { padding: 18px 22px; }
        .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f9f5ff; font-size: 13px; gap: 10px; }
        .detail-label { color: #9ca3af; font-weight: 500; flex-shrink: 0; }
        .detail-val { color: #1f2937; font-weight: 600; text-align: right; word-break: break-all; }
        .section-head { font-size: 11px; font-weight: 700; color: #9333ea; letter-spacing: 0.12em; text-transform: uppercase; margin: 16px 0 8px; }
        .status-select { padding: 10px 14px; border-radius: 10px; border: 1px solid #e5e7eb; font-family: 'Montserrat', sans-serif; font-size: 13px; color: #374151; width: 100%; background: #faf5ff; }
        .update-btn { padding: 11px 20px; border-radius: 10px; background: linear-gradient(135deg, #9333ea, #ec4899); color: #fff; border: none; font-family: 'Montserrat', sans-serif; font-size: 12px; font-weight: 700; cursor: pointer; }
        .cancel-btn { padding: 11px 18px; border-radius: 10px; background: #fee2e2; color: #991b1b; border: none; font-family: 'Montserrat', sans-serif; font-size: 12px; font-weight: 700; cursor: pointer; }
        .close-btn { background: none; border: none; font-size: 22px; cursor: pointer; color: #9ca3af; line-height: 1; }
        .check-label { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #6b7280; cursor: pointer; }

        .hide-mobile { display: table-cell; }

        @media (max-width: 767px) {
          .hide-mobile { display: none !important; }
          .filter-bar { padding: 12px; gap: 8px; }
          .modal { max-height: 95vh; border-radius: 16px 16px 0 0; align-self: flex-end; }
          .modal-overlay { align-items: flex-end; padding: 0; }
        }

        @media (max-width: 480px) {
          .tab-pill { padding: 5px 9px; font-size: 10px; }
        }
      `}</style>

      <div className="orders">
        {/* Summary pills */}
        <div className="summary-pills">
          {[
            { label: 'Total', value: summary.totalOrders, color: '#9333ea' },
            { label: 'Pending', value: summary.pendingOrders, color: '#f59e0b' },
            { label: 'Shipped', value: summary.shippedOrders, color: '#10b981' },
            { label: 'Delivered', value: summary.deliveredOrders, color: '#059669' },
            { label: 'Cancelled', value: summary.cancelledOrders, color: '#ef4444' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: '#fff', border: `1px solid ${color}30`, borderRadius: 12, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8, flex: '1 1 auto', minWidth: 80 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: '#6b7280', fontWeight: 600 }}>{label}</span>
              <span style={{ fontSize: 17, fontWeight: 700, color: '#1a0533' }}>{value || 0}</span>
            </div>
          ))}
        </div>

        <div className="card" style={{ overflow: 'hidden' }}>
          {/* Filters */}
          <div className="filter-bar">
            <input className="search-input" placeholder="🔍 Search name, email..." value={filters.search}
              onChange={e => setFilters(f => ({ ...f, search: e.target.value, page: 1 }))} />
            <select className="select" value={filters.paymentMethod} onChange={e => setFilters(f => ({ ...f, paymentMethod: e.target.value, page: 1 }))}>
              <option value="all">All Payments</option>
              <option value="cod">COD</option>
              <option value="online">Online</option>
            </select>
            <div className="status-pills">
              {statuses.map(s => (
                <button key={s} className={`tab-pill ${filters.status === s ? 'active' : ''}`}
                  onClick={() => setFilters(f => ({ ...f, status: s, page: 1 }))}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#9ca3af' }}>Loading orders...</div>
          ) : (
            <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <table className="table" style={{ minWidth: 500 }}>
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th className="hide-mobile">Items</th>
                    <th>Total</th>
                    <th className="hide-mobile">Method</th>
                    <th>Status</th>
                    <th className="hide-mobile">Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>No orders found</td></tr>
                  ) : orders.map(order => (
                    <tr key={order._id}>
                      <td style={{ fontWeight: 700, color: '#9333ea', fontSize: 12 }}>#{order.orderNumber}</td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{order.contactInfo?.firstName} {order.contactInfo?.lastName}</div>
                        <div style={{ fontSize: 11, color: '#9ca3af' }}>{order.contactInfo?.phone}</div>
                      </td>
                      <td className="hide-mobile" style={{ color: '#6b7280' }}>{order.items?.length || 0}</td>
                      <td style={{ fontWeight: 700 }}>₹{order.pricing?.total?.toLocaleString('en-IN')}</td>
                      <td className="hide-mobile" style={{ fontSize: 11, fontWeight: 700, color: order.paymentMethod === 'online' ? '#059669' : '#d97706', textTransform: 'uppercase' }}>
                        {order.paymentMethod}
                      </td>
                      <td><StatusBadge status={order.orderStatus} /></td>
                      <td className="hide-mobile" style={{ color: '#9ca3af', fontSize: 12 }}>
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                      </td>
                      <td>
                        <button className="view-btn" onClick={() => openOrderModal(order._id)}>View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderTop: '1px solid #f5f3ff', flexWrap: 'wrap', gap: 8 }}>
            <span style={{ fontSize: 12, color: '#9ca3af' }}>Showing {orders.length} of {total}</span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="page-btn" onClick={() => setFilters(f => ({ ...f, page: Math.max(1, f.page - 1) }))} disabled={filters.page <= 1}>‹</button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                <button key={p} className={`page-btn ${filters.page === p ? 'active' : ''}`} onClick={() => setFilters(f => ({ ...f, page: p }))}>{p}</button>
              ))}
              <button className="page-btn" onClick={() => setFilters(f => ({ ...f, page: Math.min(totalPages, f.page + 1) }))} disabled={filters.page >= totalPages}>›</button>
            </div>
          </div>
        </div>

        {/* Order Detail Modal */}
        {modalOpen && selectedOrder && (
          <div className="modal-overlay" onClick={() => setModalOpen(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 700, color: '#1a0533' }}>
                    Order #{selectedOrder.orderNumber}
                  </div>
                  <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 3 }}>
                    {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}
                  </div>
                </div>
                <button className="close-btn" onClick={() => setModalOpen(false)}>×</button>
              </div>
              <div className="modal-body">
                <div className="section-head">Customer Info</div>
                {[
                  ['Name', `${selectedOrder.contactInfo?.firstName} ${selectedOrder.contactInfo?.lastName}`],
                  ['Email', selectedOrder.contactInfo?.email],
                  ['Phone', selectedOrder.contactInfo?.phone],
                  ['Address', `${selectedOrder.shippingAddress?.address}<br />${selectedOrder.shippingAddress?.city}, ${selectedOrder.shippingAddress?.state} - ${selectedOrder.shippingAddress?.pincode}`],
                ].map(([l, v]) => (
                  <div className="detail-row" key={l}>
                    <span className="detail-label">{l}</span>
                    <span className="detail-val" dangerouslySetInnerHTML={{ __html: v || '—' }} />
                  </div>
                ))}

                <div className="section-head">Items</div>
                {selectedOrder.items?.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f9f5ff', gap: 8 }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#1f2937' }}>{item.productId?.name || item.name}</div>
                      <div style={{ fontSize: 11, color: '#9ca3af' }}>Qty: {item.quantity} × ₹{item.price?.toLocaleString('en-IN')}</div>
                    </div>
                    <div style={{ fontWeight: 700, color: '#1a0533', flexShrink: 0 }}>₹{(item.quantity * item.price)?.toLocaleString('en-IN')}</div>
                  </div>
                ))}

                <div className="section-head">Pricing</div>
                {[
                  ['Subtotal', `₹${selectedOrder.pricing?.subtotal?.toLocaleString('en-IN')}`],
                  ['Shipping', `₹${selectedOrder.pricing?.shipping?.toLocaleString('en-IN') || 0}`],
                  ['Discount', `−₹${selectedOrder.pricing?.discount?.toLocaleString('en-IN') || 0}`],
                  ['Total', `₹${selectedOrder.pricing?.total?.toLocaleString('en-IN')}`],
                ].map(([l, v]) => (
                  <div className="detail-row" key={l} style={{ fontWeight: l === 'Total' ? 700 : 400 }}>
                    <span className="detail-label">{l}</span>
                    <span className="detail-val" style={{ color: l === 'Total' ? '#9333ea' : undefined }}>{v}</span>
                  </div>
                ))}

                {selectedOrder.nimbusAwb && (
                  <>
                    <div className="section-head">Shipment</div>
                    <div className="detail-row"><span className="detail-label">AWB</span><span className="detail-val">{selectedOrder.nimbusAwb}</span></div>
                    <div className="detail-row"><span className="detail-label">Courier</span><span className="detail-val">{selectedOrder.nimbusCourier || '—'}</span></div>
                  </>
                )}

                <div className="section-head">Update Status</div>
                <select className="status-select" value={newStatus} onChange={e => setNewStatus(e.target.value)} style={{ marginBottom: 10 }}>
                  {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>

                {newStatus === 'cancelled' && (
                  <input style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #e5e7eb', fontFamily: 'Montserrat, sans-serif', fontSize: 13, marginBottom: 10, boxSizing: 'border-box' }}
                    placeholder="Cancellation reason (optional)" value={cancelReason} onChange={e => setCancelReason(e.target.value)} />
                )}

                <label className="check-label" style={{ marginBottom: 14 }}>
                  <input type="checkbox" checked={notifyCustomer} onChange={e => setNotifyCustomer(e.target.checked)} />
                  Notify customer via email
                </label>

                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {newStatus === 'cancelled'
                    ? <button className="cancel-btn" onClick={handleCancelOrder}>Cancel Order</button>
                    : <button className="update-btn" onClick={handleUpdateStatus} disabled={updatingStatus}>
                        {updatingStatus ? 'Updating...' : 'Update Status'}
                      </button>
                  }
                  <button onClick={() => setModalOpen(false)} style={{ padding: '11px 18px', borderRadius: 10, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', fontSize: 12, fontWeight: 600 }}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminOrders;