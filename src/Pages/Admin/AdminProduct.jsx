import React, { useState, useEffect, useCallback } from 'react';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', category: 'all', page: 1 });
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '', price: '', description: '', fragnance: '', category: '',
    ingredients: '', keyFeatures: '', img: '',
    isNewArrival: false, isBestSeller: false, salePercentage: 0,
    dimension: { height: '', weight: '' },
  });

  const token = localStorage.getItem('adminToken');
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
  const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: filters.page, limit: 12, ...(filters.search && { search: filters.search }), ...(filters.category !== 'all' && { category: filters.category }) });
      const res = await fetch(`${API}/admin/products?${params}`, { headers });
      const data = await res.json();
      if (data.success) { setProducts(data.data); setTotal(data.total); setTotalPages(data.totalPages); }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => {
    fetch(`${API}/categories?activeOnly=true`).then(r => r.json()).then(d => { if (d.data) setCategories(d.data); });
  }, []);

  const openCreate = () => {
    setEditProduct(null);
    setForm({ name: '', price: '', description: '', fragnance: '', category: categories[0]?._id || '', ingredients: '', keyFeatures: '', img: '', isNewArrival: false, isBestSeller: false, salePercentage: 0, dimension: { height: '', weight: '' } });
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditProduct(product);
    setForm({
      name: product.name || '', price: product.price || '', description: product.description || '',
      fragnance: product.fragnance || '', category: product.category?._id || '',
      ingredients: (product.ingredients || []).join(', '),
      keyFeatures: (product.keyFeatures || []).join(', '),
      img: (product.img || []).join(', '),
      isNewArrival: product.isNewArrival || false, isBestSeller: product.isBestSeller || false,
      salePercentage: product.salePercentage || 0,
      dimension: { height: product.dimension?.height || '', weight: product.dimension?.weight || '' },
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      ...form, price: Number(form.price), salePercentage: Number(form.salePercentage),
      ingredients: form.ingredients.split(',').map(s => s.trim()).filter(Boolean),
      keyFeatures: form.keyFeatures.split(',').map(s => s.trim()).filter(Boolean),
      img: form.img.split(',').map(s => s.trim()).filter(Boolean),
    };
    try {
      const url = editProduct ? `${API}/admin/products/${editProduct._id}` : `${API}/admin/products`;
      const method = editProduct ? 'PATCH' : 'POST';
      const res = await fetch(url, { method, headers, body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.success) { setModalOpen(false); fetchProducts(); }
      else alert(data.message || 'Failed to save');
    } catch { alert('Error saving product'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"?`)) return;
    try {
      const res = await fetch(`${API}/admin/products/${product._id}`, { method: 'DELETE', headers });
      const data = await res.json();
      if (data.success) fetchProducts();
      else alert(data.message);
    } catch { alert('Delete failed'); }
  };

  const handleToggle = async (product, field) => {
    try {
      await fetch(`${API}/admin/products/${product._id}/toggle`, { method: 'PATCH', headers, body: JSON.stringify({ field }) });
      fetchProducts();
    } catch (err) { console.error(err); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Montserrat:wght@400;500;600;700&display=swap');
        .prods { font-family: 'Montserrat', sans-serif; }

        .top-bar {
          display: flex; gap: 10px; align-items: center;
          flex-wrap: wrap; margin-bottom: 16px;
        }
        .search-input {
          padding: 10px 14px; border-radius: 12px; border: 1px solid #e5e7eb;
          font-family: 'Montserrat', sans-serif; font-size: 13px; background: #fff;
          flex: 1; min-width: 180px; outline: none;
        }
        .search-input:focus { border-color: #9333ea; box-shadow: 0 0 0 2px rgba(147,51,234,0.1); }
        .cat-select {
          padding: 10px 12px; border-radius: 12px; border: 1px solid #e5e7eb;
          font-family: 'Montserrat', sans-serif; font-size: 13px; background: #fff; outline: none;
        }
        .cat-select:focus { border-color: #9333ea; }
        .add-btn {
          padding: 10px 18px; border-radius: 12px;
          background: linear-gradient(135deg, #9333ea, #ec4899);
          color: #fff; border: none; font-family: 'Montserrat', sans-serif;
          font-size: 12px; font-weight: 700; letter-spacing: 0.06em; cursor: pointer;
          box-shadow: 0 4px 12px rgba(147,51,234,0.35); white-space: nowrap;
        }
        .add-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(147,51,234,0.4); }

        /* Products grid */
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 14px;
        }
        .prod-card { background: #fff; border-radius: 16px; border: 1px solid #ede9fe; overflow: hidden; transition: all 0.25s; }
        .prod-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(147,51,234,0.12); }
        .prod-img { width: 100%; aspect-ratio: 1; object-fit: cover; background: #faf5ff; }
        .prod-body { padding: 12px; }
        .prod-cat { font-size: 10px; font-weight: 700; color: #9333ea; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 4px; }
        .prod-name { font-family: 'Playfair Display', serif; font-size: 14px; font-weight: 700; color: #1a0533; margin-bottom: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .prod-price { font-size: 15px; font-weight: 700; color: #1a0533; }
        .prod-actions { display: flex; gap: 6px; margin-top: 10px; }
        .edit-btn { flex: 1; padding: 7px; border-radius: 8px; background: #faf5ff; border: 1px solid #ede9fe; color: #9333ea; font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 700; cursor: pointer; }
        .edit-btn:hover { background: #f5ebff; }
        .del-btn { padding: 7px 11px; border-radius: 8px; background: #fee2e2; border: none; color: #ef4444; font-size: 13px; cursor: pointer; }
        .toggle-chip { display: inline-flex; align-items: center; gap: 4px; padding: 3px 7px; border-radius: 20px; font-size: 10px; font-weight: 700; cursor: pointer; border: none; margin-right: 4px; margin-bottom: 4px; transition: all 0.2s; }

        /* Modal */
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 16px; }
        .modal { background: #fff; border-radius: 20px; width: 100%; max-width: 540px; max-height: 90vh; overflow-y: auto; }
        .modal-header { padding: 20px 22px 14px; border-bottom: 1px solid #f3f4f6; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; background: #fff; z-index: 1; }
        .modal-body { padding: 18px 22px; }
        .form-label { font-size: 11px; font-weight: 700; color: #6b7280; letter-spacing: 0.1em; text-transform: uppercase; display: block; margin-bottom: 6px; margin-top: 14px; }
        .form-input, .form-textarea, .form-select { width: 100%; padding: 10px 12px; border-radius: 10px; border: 1px solid #e5e7eb; font-family: 'Montserrat', sans-serif; font-size: 13px; color: #374151; outline: none; background: #faf5ff; box-sizing: border-box; }
        .form-input:focus, .form-textarea:focus, .form-select:focus { border-color: #9333ea; box-shadow: 0 0 0 2px rgba(147,51,234,0.1); }
        .form-textarea { min-height: 75px; resize: vertical; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .save-btn { width: 100%; padding: 12px; border-radius: 12px; background: linear-gradient(135deg, #9333ea, #ec4899); color: #fff; border: none; font-family: 'Montserrat', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; margin-top: 18px; letter-spacing: 0.06em; }
        .check-row { display: flex; gap: 16px; margin-top: 6px; flex-wrap: wrap; }
        .check-lbl { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #6b7280; cursor: pointer; }
        .page-info { color: #9ca3af; font-size: 12px; margin-top: 16px; text-align: center; }
        .pag-row { display: flex; gap: 6px; justify-content: center; margin-top: 10px; flex-wrap: wrap; }
        .pag-btn { width: 32px; height: 32px; border-radius: 8px; border: 1px solid #e5e7eb; background: #fff; cursor: pointer; font-size: 12px; font-weight: 600; }
        .pag-btn.active { background: linear-gradient(135deg, #9333ea, #ec4899); color: #fff; border-color: transparent; }
        .close-btn { background: none; border: none; font-size: 22px; cursor: pointer; color: #9ca3af; }

        @media (max-width: 767px) {
          .grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .modal { max-height: 95vh; border-radius: 16px 16px 0 0; align-self: flex-end; }
          .modal-overlay { align-items: flex-end; padding: 0; }
          .add-btn { width: 100%; }
          .top-bar { gap: 8px; }
          .search-input { min-width: 140px; }
        }

        @media (max-width: 480px) {
          .grid { grid-template-columns: repeat(2, 1fr); gap: 8px; }
          .prod-body { padding: 10px; }
          .prod-name { font-size: 13px; }
          .form-row { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="prods">
        <div className="top-bar">
          <input className="search-input" placeholder="🔍 Search products..." value={filters.search}
            onChange={e => setFilters(f => ({ ...f, search: e.target.value, page: 1 }))} />
          <select className="cat-select" value={filters.category} onChange={e => setFilters(f => ({ ...f, category: e.target.value, page: 1 }))}>
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
          </select>
          <button className="add-btn" onClick={openCreate}>+ Add Product</button>
        </div>

        <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 12 }}>{total} products found</div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#9ca3af' }}>Loading products...</div>
        ) : (
          <div className="grid">
            {products.map(product => (
              <div key={product._id} className="prod-card">
                <img className="prod-img" src={product.img?.[0] || 'https://images.unsplash.com/photo-1602874801006-64c78b297c86?w=400&h=400&fit=crop'}
                  alt={product.name} onError={e => e.target.src = 'https://images.unsplash.com/photo-1602874801006-64c78b297c86?w=400&h=400&fit=crop'} />
                <div className="prod-body">
                  <div className="prod-cat">{product.category?.name || 'Uncategorised'}</div>
                  <div className="prod-name">{product.name}</div>
                  <div style={{ marginBottom: 6 }}>
                    <button className="toggle-chip" style={{ background: product.isNewArrival ? '#e0e7ff' : '#f3f4f6', color: product.isNewArrival ? '#4338ca' : '#9ca3af' }}
                      onClick={() => handleToggle(product, 'isNewArrival')}>✨ New {product.isNewArrival ? '✓' : ''}</button>
                    <button className="toggle-chip" style={{ background: product.isBestSeller ? '#fef3c7' : '#f3f4f6', color: product.isBestSeller ? '#92400e' : '#9ca3af' }}
                      onClick={() => handleToggle(product, 'isBestSeller')}>⭐ Best {product.isBestSeller ? '✓' : ''}</button>
                    {product.salePercentage > 0 && (
                      <span className="toggle-chip" style={{ background: '#fee2e2', color: '#991b1b' }}>SALE {product.salePercentage}%</span>
                    )}
                  </div>
                  <div className="prod-price">₹{Number(product.price).toLocaleString('en-IN')}</div>
                  <div className="prod-actions">
                    <button className="edit-btn" onClick={() => openEdit(product)}>✏️ Edit</button>
                    <button className="del-btn" onClick={() => handleDelete(product)}>🗑️</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div>
            <div className="page-info">Page {filters.page} of {totalPages}</div>
            <div className="pag-row">
              <button className="pag-btn" onClick={() => setFilters(f => ({ ...f, page: Math.max(1, f.page - 1) }))}>‹</button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map(p => (
                <button key={p} className={`pag-btn ${filters.page === p ? 'active' : ''}`} onClick={() => setFilters(f => ({ ...f, page: p }))}>{p}</button>
              ))}
              <button className="pag-btn" onClick={() => setFilters(f => ({ ...f, page: Math.min(totalPages, f.page + 1) }))}>›</button>
            </div>
          </div>
        )}

        {/* Product Modal */}
        {modalOpen && (
          <div className="modal-overlay" onClick={() => setModalOpen(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 700, color: '#1a0533' }}>
                  {editProduct ? 'Edit Product' : 'Add New Product'}
                </span>
                <button className="close-btn" onClick={() => setModalOpen(false)}>×</button>
              </div>
              <div className="modal-body">
                <label className="form-label">Product Name *</label>
                <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Lavender Soy Candle" />

                <div className="form-row">
                  <div>
                    <label className="form-label">Price (₹) *</label>
                    <input className="form-input" type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="499" />
                  </div>
                  <div>
                    <label className="form-label">Sale % (0 = no sale)</label>
                    <input className="form-input" type="number" min="0" max="100" value={form.salePercentage} onChange={e => setForm(f => ({ ...f, salePercentage: e.target.value }))} />
                  </div>
                </div>

                <label className="form-label">Category *</label>
                <select className="form-select" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>

                <label className="form-label">Fragrance *</label>
                <input className="form-input" value={form.fragnance} onChange={e => setForm(f => ({ ...f, fragnance: e.target.value }))} placeholder="e.g. Lavender & Vanilla" />

                <div className="form-row">
                  <div>
                    <label className="form-label">Height (cm) *</label>
                    <input className="form-input" type="number" value={form.dimension.height} onChange={e => setForm(f => ({ ...f, dimension: { ...f.dimension, height: e.target.value } }))} placeholder="10" />
                  </div>
                  <div>
                    <label className="form-label">Weight (g) *</label>
                    <input className="form-input" type="number" value={form.dimension.weight} onChange={e => setForm(f => ({ ...f, dimension: { ...f.dimension, weight: e.target.value } }))} placeholder="200" />
                  </div>
                </div>

                <label className="form-label">Description</label>
                <textarea className="form-textarea" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Product description..." />

                <label className="form-label">Ingredients (comma-separated)</label>
                <input className="form-input" value={form.ingredients} onChange={e => setForm(f => ({ ...f, ingredients: e.target.value }))} placeholder="Soy wax, Lavender oil, Cotton wick" />

                <label className="form-label">Key Features (comma-separated)</label>
                <input className="form-input" value={form.keyFeatures} onChange={e => setForm(f => ({ ...f, keyFeatures: e.target.value }))} placeholder="Long burn time, Natural, Hand-poured" />

                <label className="form-label">Image URLs (comma-separated)</label>
                <textarea className="form-textarea" style={{ minHeight: 56 }} value={form.img} onChange={e => setForm(f => ({ ...f, img: e.target.value }))} placeholder="https://..." />

                <label className="form-label" style={{ marginTop: 14 }}>Flags</label>
                <div className="check-row">
                  <label className="check-lbl">
                    <input type="checkbox" checked={form.isNewArrival} onChange={e => setForm(f => ({ ...f, isNewArrival: e.target.checked }))} />
                    ✨ New Arrival
                  </label>
                  <label className="check-lbl">
                    <input type="checkbox" checked={form.isBestSeller} onChange={e => setForm(f => ({ ...f, isBestSeller: e.target.checked }))} />
                    ⭐ Best Seller
                  </label>
                </div>

                <button className="save-btn" onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving...' : editProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminProducts;   