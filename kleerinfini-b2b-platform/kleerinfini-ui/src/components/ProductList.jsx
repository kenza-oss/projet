import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { getProductImage } from '../utils/utils';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('products/')
      .then((res) => {
        const data = res.data.results || res.data || [];
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching products:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>📦 Product List</h2>
      {products.length === 0 ? (
        <p>No products found. Add some products in Django admin first.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {products.map(product => (
            <li key={product.id} style={{
              marginBottom: '20px',
              padding: '15px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              backgroundColor: '#f9f9f9'
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{product.name}</h3>
              {(product.images && product.images.length > 0) || product.image ? (
                <div style={{ margin: '10px 0' }}>
                  <img
                    src={getProductImage(product.images?.[0] || product.image, 0, product)}
                    alt={product.name}
                    style={{
                      width: '200px',
                      height: '150px',
                      objectFit: 'cover',
                      borderRadius: '4px'
                    }}
                  />
                </div>
              ) : (
                <div style={{ 
                  width: '200px', 
                  height: '150px', 
                  backgroundColor: '#eee', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  borderRadius: '4px',
                  color: '#999',
                  fontSize: '12px'
                }}>
                  No Image
                </div>
              )}
              <p style={{ margin: '5px 0' }}>{product.desc_courte}</p>
              <p style={{ margin: '5px 0' }}><strong>Views:</strong> {product.views}</p>
              <p style={{ margin: '5px 0' }}><strong>Category:</strong> {product.category_name || `ID: ${product.category_id}`}</p>
              <p style={{ margin: '5px 0' }}><strong>Created:</strong> {new Date(product.created_at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductList;