import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const StatusBadge = ({ status }) => {
  const colors = {
    pending:      { bg: '#fef3c7', text: '#92400e', dot: '#f59e0b' },
    confirmed:    { bg: '#dbeafe', text: '#1e40af', dot: '#3b82f6' },
    processing:   { bg: '#e0e7ff', text: '#3730a3', dot: '#6366f1' },
    shipped:      { bg: '#d1fae5', text: '#065f46', dot: '#10b981' },
    delivered:    { bg: '#d1fae5', text: '#065f46', dot: '#059669' },
    cancelled:    { bg: '#fee2e2', text: '#991b1b', dot: '#ef4444' },
    ndr:          { bg: '#fef3c7', text: '#92400e', dot: '#f59e0b' },
    rto:          { bg: '#fee2e2', text: '#991b1b', dot: '#ef4444' },
    rto_complete: { bg: '#fee2e2', text: '#991b1b', dot: '#ef4444' },
  };
  const c = colors[status] || { bg: '#f3f4f6', text: '#6b7280', dot: '#9ca3af' };
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:5, background:c.bg, color:c.text, padding:'5px 12px', borderRadius:20, fontSize:12, fontWeight:600, textTransform:'capitalize' }}>
      <span style={{ width:7, height:7, borderRadius:'50%', background:c.dot, display:'inline-block' }} />
      {status}
    </span>
  );
};

const AdminOrderDetail = () => {
  const { id: orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState('');
  const [notifyCustomer, setNotifyCustomer] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [tracking, setTracking] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Shipment status (Direct Ship visibility)
  const [shipmentStatus, setShipmentStatus] = useState(null);
  const [refreshingStatus, setRefreshingStatus] = useState(false);
  const [fetchingLabel, setFetchingLabel] = useState(false);
  const [fetchingInvoice, setFetchingInvoice] = useState(false);

  const token = localStorage.getItem('adminToken');
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
  const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const refreshShipmentStatus = async () => {
    setRefreshingStatus(true);
    try {
      const res = await fetch(`${API}/admin/orders/${orderId}/refresh-shipment`, { headers });
      const data = await res.json();
      if (data.success) setShipmentStatus(data.data);
    } catch (err) {
      console.error('Failed to refresh shipment status', err);
    } finally {
      setRefreshingStatus(false);
    }
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`${API}/admin/orders/${orderId}`, { headers });
        const data = await res.json();
        if (data.success) { setOrder(data.data); setNewStatus(data.data.orderStatus); }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchOrder();
    refreshShipmentStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const handleUpdateStatus = async () => {
    setUpdating(true); setMessage({ type: '', text: '' });
    try {
      const res = await fetch(`${API}/admin/orders/${orderId}/status`, {
        method: 'PATCH', headers,
        body: JSON.stringify({ orderStatus: newStatus, notifyCustomer }),
      });
      const data = await res.json();
      if (data.success) { setOrder(data.data); setMessage({ type: 'success', text: 'Status updated successfully!' }); }
      else setMessage({ type: 'error', text: data.message });
    } catch { setMessage({ type: 'error', text: 'Failed to update status.' }); }
    finally { setUpdating(false); }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Cancel this order?')) return;
    try {
      const res = await fetch(`${API}/admin/orders/${orderId}/cancel`, {
        method: 'PATCH', headers,
        body: JSON.stringify({ reason: 'Cancelled by admin', notifyCustomer }),
      });
      const data = await res.json();
      if (data.success) { setOrder(data.data); setMessage({ type: 'success', text: 'Order cancelled.' }); }
      else setMessage({ type: 'error', text: data.message });
    } catch { setMessage({ type: 'error', text: 'Failed to cancel.' }); }
  };

  // Shiprocket's /courier/track response shape:
  // { tracking_data: { shipment_track: [{ awb_code, courier_name, current_status, edd, ... }],
  //                    shipment_track_activities: [{ date, status, activity, location }] } }
  const handleTrack = async () => {
    setTrackingLoading(true);
    try {
      const res = await fetch(`${API}/admin/orders/${orderId}/track`, { headers });
      const data = await res.json();
      if (data.success) setTracking(data.data.tracking);
      else setMessage({ type: 'error', text: data.message });
    } catch { setMessage({ type: 'error', text: 'Tracking unavailable.' }); }
    finally { setTrackingLoading(false); }
  };

  const handleGetLabel = async () => {
    setFetchingLabel(true);
    try {
      const res = await fetch(`${API}/admin/orders/${orderId}/label`, { headers });
      const data = await res.json();
      if (data.success && data.data.label_url) {
        window.open(data.data.label_url, '_blank');
      } else {
        setMessage({ type: 'error', text: data.message || 'Label not ready yet.' });
      }
    } catch { setMessage({ type: 'error', text: 'Failed to fetch label.' }); }
    finally { setFetchingLabel(false); }
  };

  const handleGetInvoice = async () => {
    setFetchingInvoice(true);
    try {
      const res = await fetch(`${API}/admin/orders/${orderId}/invoice`, { headers });
      const data = await res.json();
      if (data.success && data.data.invoice_url) {
        window.open(data.data.invoice_url, '_blank');
      } else {
        setMessage({ type: 'error', text: data.message || 'Invoice not available yet.' });
      }
    } catch { setMessage({ type: 'error', text: 'Failed to fetch invoice.' }); }
    finally { setFetchingInvoice(false); }
  };

  if (loading) return <div style={{ textAlign:'center', padding:80, color:'#9ca3af', fontFamily:'Montserrat,sans-serif' }}>Loading order...</div>;
  if (!order) return <div style={{ textAlign:'center', padding:80, color:'#ef4444', fontFamily:'Montserrat,sans-serif' }}>Order not found.</div>;

  const trackSummary = tracking?.tracking_data?.shipment_track?.[0];
  const trackActivities = tracking?.tracking_data?.shipment_track_activities || [];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Montserrat:wght@400;500;600;700&display=swap');
        .od { font-family:'Montserrat',sans-serif; max-width:960px; }
        .back-btn { display:inline-flex; align-items:center; gap:6px; background:none; border:none; color:#9333ea; font-family:'Montserrat',sans-serif; font-size:13px; font-weight:600; cursor:pointer; margin-bottom:16px; padding:0; }
        .back-btn:hover { opacity:0.7; }
        .card { background:#fff; border-radius:16px; border:1px solid #ede9fe; padding:20px; margin-bottom:14px; }
        .card-title { font-size:11px; font-weight:700; color:#9333ea; letter-spacing:0.12em; text-transform:uppercase; margin-bottom:14px; display:flex; align-items:center; justify-content:space-between; }
        .detail-row { display:flex; justify-content:space-between; gap:10px; padding:8px 0; border-bottom:1px solid #f9f5ff; font-size:13px; }
        .detail-row:last-child { border-bottom:none; }
        .dl { color:#9ca3af; font-weight:500; flex-shrink:0; }
        .dv { color:#1f2937; font-weight:600; text-align:right; word-break:break-all; }
        .grid2 { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:14px; }
        .status-select { width:100%; padding:11px 14px; border-radius:10px; border:1px solid #e5e7eb; font-family:'Montserrat',sans-serif; font-size:13px; background:#faf5ff; outline:none; margin-bottom:10px; box-sizing:border-box; }
        .status-select:focus { border-color:#9333ea; }
        .update-btn { padding:10px 20px; border-radius:10px; background:linear-gradient(135deg,#9333ea,#ec4899); color:#fff; border:none; font-family:'Montserrat',sans-serif; font-size:12px; font-weight:700; cursor:pointer; }
        .update-btn:disabled { opacity:0.6; cursor:not-allowed; }
        .cancel-btn { padding:10px 16px; border-radius:10px; background:#fee2e2; color:#991b1b; border:none; font-family:'Montserrat',sans-serif; font-size:12px; font-weight:700; cursor:pointer; }
        .track-btn { padding:10px 16px; border-radius:10px; background:#e0e7ff; color:#3730a3; border:none; font-family:'Montserrat',sans-serif; font-size:12px; font-weight:700; cursor:pointer; }
        .refresh-btn { font-size:11px; background:none; border:1px solid #e5e7eb; border-radius:8px; padding:4px 10px; cursor:pointer; color:#9333ea; font-weight:600; }
        .refresh-btn:disabled { opacity:0.6; cursor:not-allowed; }
        .status-pending-banner { font-size:12px; color:#d97706; background:#fef3c7; padding:10px 12px; border-radius:10px; margin-bottom:10px; }
        .alert { padding:12px 16px; border-radius:10px; font-size:13px; margin-bottom:12px; }
        .alert-s { background:#d1fae5; color:#065f46; border:1px solid #6ee7b7; }
        .alert-e { background:#fee2e2; color:#991b1b; border:1px solid #fca5a5; }
        .check-label { display:flex; align-items:center; gap:8px; font-size:12px; color:#6b7280; cursor:pointer; margin-bottom:12px; }
        .item-row { display:flex; align-items:center; gap:12px; padding:12px 0; border-bottom:1px solid #f9f5ff; }
        .item-img { width:48px; height:48px; border-radius:10px; object-fit:cover; background:#faf5ff; flex-shrink:0; }
        .page-header { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:18px; flex-wrap:wrap; gap:10px; }
        .action-buttons { display:flex; gap:8px; flex-wrap:wrap; }
        .track-summary { display:grid; grid-template-columns:repeat(3, 1fr); gap:8px; margin-bottom:14px; }
        @media (max-width: 767px) {
          .grid2 { grid-template-columns:1fr; }
          .track-summary { grid-template-columns:repeat(2, 1fr); }
          .page-header { flex-direction:column; }
          .action-buttons { width:100%; }
          .update-btn, .cancel-btn, .track-btn { flex:1; text-align:center; }
        }
        @media (max-width: 480px) {
          .card { padding:16px; }
          .track-summary { grid-template-columns:1fr 1fr; }
        }
      `}</style>

      <div className="od">
        <button className="back-btn" onClick={() => navigate('/admin/orders')}>← Back to Orders</button>

        <div className="page-header">
          <div>
            <h1 style={{ fontFamily:'Playfair Display,serif', fontSize:24, fontWeight:700, color:'#1a0533', margin:'0 0 6px' }}>
              Order #{order.orderNumber}
            </h1>
            <div style={{ fontSize:12, color:'#9ca3af' }}>
              Placed on {new Date(order.createdAt).toLocaleString('en-IN')}
            </div>
          </div>
          <StatusBadge status={order.orderStatus} />
        </div>

        {message.text && (
          <div className={`alert ${message.type === 'success' ? 'alert-s' : 'alert-e'}`}>
            {message.type === 'success' ? '✅' : '⚠️'} {message.text}
          </div>
        )}

        <div className="grid2">
          <div className="card">
            <div className="card-title">👤 Customer Info</div>
            {[
              ['Name', `${order.contactInfo?.firstName} ${order.contactInfo?.lastName}`],
              ['Email', order.contactInfo?.email],
              ['Phone', order.contactInfo?.phone],
            ].map(([l, v]) => (
              <div className="detail-row" key={l}><span className="dl">{l}</span><span className="dv">{v || '—'}</span></div>
            ))}
          </div>

          <div className="card">
            <div className="card-title">📍 Shipping Address</div>
            {[
              ['Street', order.shippingAddress?.address],
              ['City', order.shippingAddress?.city],
              ['State', order.shippingAddress?.state],
              ['Pincode', order.shippingAddress?.pincode],
            ].map(([l, v]) => (
              <div className="detail-row" key={l}><span className="dl">{l}</span><span className="dv">{v || '—'}</span></div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-title">🕯️ Order Items</div>
          {order.items?.map((item, i) => (
            <div className="item-row" key={i}>
              <img className="item-img"
                src={item.productId?.img?.[0] || 'https://images.unsplash.com/photo-1602874801006-64c78b297c86?w=100&h=100&fit=crop'}
                alt={item.productId?.name || item.name}
                onError={e => e.target.src = 'https://images.unsplash.com/photo-1602874801006-64c78b297c86?w=100&h=100&fit=crop'}
              />
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:600, fontSize:13, color:'#1f2937' }}>{item.productId?.name || item.name}</div>
                <div style={{ fontSize:12, color:'#9ca3af', marginTop:2 }}>
                  {item.productId?.fragnance && `${item.productId.fragnance} · `}
                  Qty: {item.quantity} × ₹{item.price?.toLocaleString('en-IN')}
                </div>
              </div>
              <div style={{ fontWeight:700, fontSize:14, color:'#1a0533', flexShrink:0 }}>
                ₹{(item.quantity * item.price)?.toLocaleString('en-IN')}
              </div>
            </div>
          ))}

          <div style={{ marginTop:14, paddingTop:14, borderTop:'2px solid #f3f4f6' }}>
            {[
              ['Subtotal', `₹${order.pricing?.subtotal?.toLocaleString('en-IN')}`],
              ['Shipping', `₹${(order.pricing?.shipping || 0).toLocaleString('en-IN')}`],
              ['Discount', `−₹${(order.pricing?.discount || 0).toLocaleString('en-IN')}`],
            ].map(([l, v]) => (
              <div key={l} style={{ display:'flex', justifyContent:'space-between', fontSize:13, color:'#6b7280', marginBottom:6 }}>
                <span>{l}</span><span>{v}</span>
              </div>
            ))}
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:16, fontWeight:700, color:'#1a0533', marginTop:8, paddingTop:8, borderTop:'1px solid #f3f4f6' }}>
              <span>Total</span>
              <span style={{ color:'#9333ea' }}>₹{order.pricing?.total?.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        <div className="grid2">
          <div className="card">
            <div className="card-title">💳 Payment</div>
            {[
              ['Method', order.paymentMethod?.toUpperCase()],
              ['Status', order.paymentStatus],
              ['Order Date', order.orderDate ? new Date(order.orderDate).toLocaleDateString('en-IN') : 'Not yet'],
            ].map(([l, v]) => (
              <div className="detail-row" key={l}><span className="dl">{l}</span><span className="dv">{v || '—'}</span></div>
            ))}
          </div>

          {/* Shipment card — Shiprocket fields + Direct Ship live status */}
          <div className="card">
            <div className="card-title">
              <span>🚚 Shipment (Direct Ship)</span>
              <button className="refresh-btn" onClick={refreshShipmentStatus} disabled={refreshingStatus}>
                {refreshingStatus ? 'Checking...' : '↻ Refresh'}
              </button>
            </div>

            {!shipmentStatus ? (
              <div style={{ fontSize:12, color:'#9ca3af', padding:'8px 0' }}>Checking shipment status...</div>
            ) : !shipmentStatus.synced ? (
              <div className="status-pending-banner">⏳ {shipmentStatus.reason}</div>
            ) : (
              <>
                <div className="detail-row">
                  <span className="dl">Courier Assigned</span>
                  <span className="dv" style={{ color: shipmentStatus.courierAssigned ? '#059669' : '#d97706' }}>
                    {shipmentStatus.courierAssigned ? `✓ ${shipmentStatus.courier || 'Yes'}` : '⏳ Pending'}
                  </span>
                </div>
                <div className="detail-row"><span className="dl">AWB</span><span className="dv">{shipmentStatus.awb || order.srAwb || 'Not assigned yet'}</span></div>
                <div className="detail-row"><span className="dl">Shiprocket Status</span><span className="dv">{shipmentStatus.shiprocketStatus || '—'}</span></div>
                <div className="detail-row"><span className="dl">Pickup Scheduled</span><span className="dv">{shipmentStatus.pickupScheduledDate || 'Not yet'}</span></div>
              </>
            )}
            <div className="detail-row"><span className="dl">Delivered At</span><span className="dv">{order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString('en-IN') : '—'}</span></div>
          </div>
        </div>

        {/* Update Status + Actions */}
        <div className="card">
          <div className="card-title">⚡ Update Order</div>

          <select className="status-select" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
            {['pending','confirmed','processing','shipped','delivered','cancelled','ndr','rto','rto_complete'].map(s => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>

          <label className="check-label">
            <input type="checkbox" checked={notifyCustomer} onChange={e => setNotifyCustomer(e.target.checked)} />
            Notify customer via email
          </label>

          <div className="action-buttons">
            <button className="update-btn" onClick={handleUpdateStatus} disabled={updating}>
              {updating ? 'Updating...' : '✅ Update Status'}
            </button>
            {order.orderStatus !== 'cancelled' && order.orderStatus !== 'delivered' && (
              <button className="cancel-btn" onClick={handleCancelOrder}>❌ Cancel Order</button>
            )}
            <button className="update-btn" onClick={handleGetLabel} disabled={fetchingLabel}>
              {fetchingLabel ? 'Fetching...' : '📄 Get Label'}
            </button>
            <button className="update-btn" onClick={handleGetInvoice} disabled={fetchingInvoice}>
              {fetchingInvoice ? 'Fetching...' : '🧾 Get Invoice'}
            </button>
            <button className="track-btn" onClick={handleTrack} disabled={trackingLoading}>
              {trackingLoading ? 'Tracking...' : '🔍 Track Shipment'}
            </button>
          </div>

          {tracking && (
            <div style={{ marginTop:16, background:'#f9f5ff', borderRadius:12, padding:16 }}>
              <div style={{ fontWeight:700, color:'#9333ea', marginBottom:12, fontSize:13 }}>📦 Tracking Info</div>

              {!trackSummary ? (
                <div style={{ fontSize:12, color:'#9ca3af' }}>No tracking data available yet.</div>
              ) : (
                <div className="track-summary">
                  {[
                    { label: 'AWB', value: trackSummary.awb_code },
                    { label: 'Courier', value: trackSummary.courier_name },
                    { label: 'Status', value: trackSummary.current_status },
                    { label: 'Origin', value: trackSummary.origin },
                    { label: 'Destination', value: trackSummary.destination },
                    { label: 'EDD', value: trackSummary.edd || 'Not set' },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ background:'#fff', borderRadius:10, padding:'10px 12px', border:'1px solid #ede9fe' }}>
                      <div style={{ fontSize:10, color:'#9ca3af', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:4 }}>{label}</div>
                      <div style={{ fontSize:12, fontWeight:600, color:'#1f2937', textTransform:'capitalize', wordBreak:'break-all' }}>{value || '—'}</div>
                    </div>
                  ))}
                </div>
              )}

              {trackActivities.length > 0 && (
                <div>
                  <div style={{ fontSize:11, fontWeight:700, color:'#9333ea', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:10 }}>History</div>
                  <div style={{ position:'relative', paddingLeft:20 }}>
                    <div style={{ position:'absolute', left:7, top:0, bottom:0, width:2, background:'#ede9fe', borderRadius:2 }} />
                    {trackActivities.map((h, i) => (
                      <div key={i} style={{ position:'relative', marginBottom:10, paddingLeft:16 }}>
                        <div style={{ position:'absolute', left:-6, top:4, width:10, height:10, borderRadius:'50%', background: i === 0 ? '#9333ea' : '#d8b4fe', border:'2px solid #fff', boxShadow:'0 0 0 2px #ede9fe' }} />
                        <div style={{ background:'#fff', borderRadius:10, padding:'10px 12px', border:'1px solid #ede9fe' }}>
                          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:6 }}>
                            <span style={{ fontSize:12, fontWeight:600, color:'#1f2937' }}>{h.activity}</span>
                            <div style={{ fontSize:11, color:'#9ca3af', flexShrink:0 }}>
                              {h.date ? new Date(h.date).toLocaleString('en-IN', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' }) : '—'}
                            </div>
                          </div>
                          {h.location && <div style={{ fontSize:11, color:'#6b7280', marginTop:4 }}>📍 {h.location}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminOrderDetail;