import React, { useState, useEffect } from 'react';

const StatCard = ({ icon, label, value, sub, gradient, border }) => (
  <div style={{
    background: '#fff', borderRadius: 16, padding: '18px 20px',
    border: `1px solid ${border}`, boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
    display: 'flex', alignItems: 'flex-start', gap: 14,
    transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'default',
  }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.1)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.05)'; }}
  >
    <div style={{
      width: 44, height: 44, borderRadius: 12, flexShrink: 0,
      background: gradient,
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
    }}>{icon}</div>
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: 10, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: '#1a0533', fontFamily: "'Montserrat', sans-serif" }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: '#6b7280', marginTop: 3 }}>{sub}</div>}
    </div>
  </div>
);

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
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: c.bg, color: c.text,
      padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
      textTransform: 'capitalize',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.dot, display: 'inline-block' }} />
      {status}
    </span>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('adminToken');
  const headers = { Authorization: `Bearer ${token}` };
  const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          fetch(`${API}/admin/orders/stats?period=30`, { headers }),
          fetch(`${API}/admin/orders?page=1&limit=6&sortBy=createdAt&order=desc`, { headers }),
        ]);
        const [statsData, ordersData] = await Promise.all([statsRes.json(), ordersRes.json()]);
        if (statsData.success) setStats(statsData.data);
        if (ordersData.success) setRecentOrders(ordersData.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const fmt = (n) => n?.toLocaleString('en-IN') || '0';
  const fmtCurrency = (n) => `₹${fmt(Math.round(n || 0))}`;

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🕯️</div>
        <p style={{ color: '#9333ea', fontWeight: 600, fontSize: 13, letterSpacing: '0.08em' }}>LOADING DASHBOARD...</p>
      </div>
    </div>
  );

  const overall = stats?.overall || {};
  const recent = stats?.recent || {};

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Montserrat:wght@400;500;600;700&display=swap');
        .dash { font-family: 'Montserrat', sans-serif; }
        .section-title {
          font-family: 'Playfair Display', serif;
          font-size: 18px; font-weight: 700; color: #1a0533; margin: 0 0 16px;
        }
        .card { background: #fff; border-radius: 16px; border: 1px solid #ede9fe; overflow: hidden; }
        .table { width: 100%; border-collapse: collapse; }
        .table th {
          background: #faf5ff; padding: 12px 14px;
          text-align: left; font-size: 10px; font-weight: 700;
          color: #9333ea; letter-spacing: 0.12em; text-transform: uppercase;
          border-bottom: 1px solid #ede9fe; white-space: nowrap;
        }
        .table td {
          padding: 13px 14px; font-size: 12px; color: #374151;
          border-bottom: 1px solid #f5f3ff;
        }
        .table tr:last-child td { border-bottom: none; }
        .table tr:hover td { background: #faf5ff; }
        .period-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: linear-gradient(135deg, #9333ea15, #ec489915);
          border: 1px solid #9333ea30; border-radius: 20px;
          padding: 5px 12px; font-size: 11px; font-weight: 600; color: #7c3aed;
          margin-bottom: 20px; flex-wrap: wrap;
        }
        .bar {
          height: 8px; border-radius: 4px;
          background: linear-gradient(90deg, #9333ea, #ec4899);
          transition: width 1s ease;
        }

        /* Stats grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin-bottom: 24px;
        }

        /* Split grid */
        .split-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 24px;
        }

        @media (max-width: 1024px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 767px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .split-grid { grid-template-columns: 1fr; }
          .section-title { font-size: 16px; }

          /* Hide less critical table columns on mobile */
          .hide-mobile { display: none !important; }
        }

        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: 1fr 1fr; gap: 8px; }
        }
      `}</style>

      <div className="dash">
        <div className="period-badge">
          📅 Last 30 days — {fmtCurrency(recent.recentRevenue)} · {recent.recentOrders || 0} orders
        </div>

        {/* Stat cards */}
        <div className="stats-grid">
          <StatCard icon="💰" label="Total Revenue" value={fmtCurrency(overall.totalRevenue)} sub="All time" gradient="linear-gradient(135deg,#fef3c7,#fde68a)" border="#fde68a" />
          <StatCard icon="📦" label="Total Orders" value={fmt(overall.totalOrders)} sub="All time" gradient="linear-gradient(135deg,#dbeafe,#93c5fd)" border="#93c5fd" />
          <StatCard icon="⏳" label="Pending" value={fmt(overall.pendingCount)} sub="Needs attention" gradient="linear-gradient(135deg,#fef3c7,#fbbf24)" border="#fbbf24" />
          <StatCard icon="🚚" label="Shipped" value={fmt(overall.shippedCount)} sub="In transit" gradient="linear-gradient(135deg,#d1fae5,#6ee7b7)" border="#6ee7b7" />
          <StatCard icon="✅" label="Delivered" value={fmt(overall.deliveredCount)} sub="Completed" gradient="linear-gradient(135deg,#d1fae5,#34d399)" border="#34d399" />
          <StatCard icon="❌" label="Cancelled" value={fmt(overall.cancelledCount)} sub="" gradient="linear-gradient(135deg,#fee2e2,#fca5a5)" border="#fca5a5" />
        </div>

        {/* Payment split + Status bars */}
        <div className="split-grid">
          <div className="card" style={{ padding: '20px' }}>
            <h3 className="section-title" style={{ fontSize: 15, marginBottom: 18 }}>Payment Methods</h3>
            {[
              { label: 'COD Revenue', value: overall.codRevenue, color: '#9333ea', total: overall.totalRevenue },
              { label: 'Online Revenue', value: overall.onlineRevenue, color: '#ec4899', total: overall.totalRevenue },
            ].map(({ label, value, color, total }) => (
              <div key={label} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color }}>{fmtCurrency(value)}</span>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: '#f3f4f6', overflow: 'hidden' }}>
                  <div className="bar" style={{ width: `${total ? (value / total) * 100 : 0}%`, background: `linear-gradient(90deg, ${color}, ${color}aa)` }} />
                </div>
                <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 3 }}>
                  {total ? Math.round((value / total) * 100) : 0}% of total
                </div>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <h3 className="section-title" style={{ fontSize: 15, marginBottom: 18 }}>Order Status Breakdown</h3>
            {[
              { label: 'Pending',    count: overall.pendingCount,    color: '#f59e0b' },
              { label: 'Confirmed',  count: overall.confirmedCount,  color: '#3b82f6' },
              { label: 'Processing', count: overall.processingCount, color: '#6366f1' },
              { label: 'Shipped',    count: overall.shippedCount,    color: '#10b981' },
              { label: 'Delivered',  count: overall.deliveredCount,  color: '#059669' },
              { label: 'Cancelled',  count: overall.cancelledCount,  color: '#ef4444' },
            ].map(({ label, count, color }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 11, color: '#6b7280', width: 70, flexShrink: 0 }}>{label}</span>
                <div style={{ flex: 1, height: 6, borderRadius: 3, background: '#f3f4f6', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${overall.totalOrders ? (count / overall.totalOrders) * 100 : 0}%`, background: color, borderRadius: 3, transition: 'width 1s ease' }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#374151', width: 28, textAlign: 'right' }}>{count || 0}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="card" style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 18px 12px', flexWrap: 'wrap', gap: 8 }}>
            <h3 className="section-title" style={{ margin: 0 }}>Recent Orders</h3>
            <a href="/admin/orders" style={{ fontSize: 12, color: '#9333ea', fontWeight: 600, textDecoration: 'none' }}>View All →</a>
          </div>
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table className="table" style={{ minWidth: 560 }}>
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th className="hide-mobile">Items</th>
                  <th>Total</th>
                  <th className="hide-mobile">Payment</th>
                  <th>Status</th>
                  <th className="hide-mobile">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: '#9ca3af' }}>No orders yet</td></tr>
                ) : recentOrders.map((order) => (
                  <tr key={order._id} style={{ cursor: 'pointer' }} onClick={() => window.location.href = `/admin/orders/${order._id}`}>
                    <td style={{ fontWeight: 700, color: '#9333ea', fontSize: 12 }}>#{order.orderNumber}</td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{order.contactInfo?.firstName} {order.contactInfo?.lastName}</div>
                      <div style={{ fontSize: 11, color: '#9ca3af' }}>{order.contactInfo?.email}</div>
                    </td>
                    <td className="hide-mobile" style={{ color: '#6b7280' }}>{order.items?.length || 0} item(s)</td>
                    <td style={{ fontWeight: 700 }}>₹{order.pricing?.total?.toLocaleString('en-IN')}</td>
                    <td className="hide-mobile" style={{ textTransform: 'uppercase', fontSize: 11, fontWeight: 600, color: order.paymentMethod === 'online' ? '#059669' : '#d97706' }}>
                      {order.paymentMethod}
                    </td>
                    <td><StatusBadge status={order.orderStatus} /></td>
                    <td className="hide-mobile" style={{ color: '#9ca3af', fontSize: 12 }}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;