import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import styled from 'styled-components';

const QuotationForm = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerMobile: '',
    productName: '',
    brand: '',
    size: '',
    ratePerSqft: 0,
    withGST: false,
    totalQuantity: 0,
    totalSqft: 0,
    price: 0,
    sgst: 0,
    cgst: 0,
    transportationCharge: 0,
    labourCharge: 0,
    totalAmount: 0
  });

  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch predefined products from backend
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    // Calculate totalSqft based on size (format "width x height") and totalQuantity
    const sizeStr = formData.size.trim();
    const totalQuantityNum = parseInt(formData.totalQuantity, 10);
    let area = 0;
    if (sizeStr) {
      const parts = sizeStr.toLowerCase().split('x').map(s => parseFloat(s.trim()));
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        area = parts[0] * parts[1];
      }
    }
    const totalSqft = (!isNaN(area) && !isNaN(totalQuantityNum)) ? area * totalQuantityNum : 0;

    // Calculate price, GST amounts and total amount including transportation and labour charges
    const price = formData.ratePerSqft * totalSqft;
    const sgst = formData.withGST ? price * 0.09 : 0;
    const cgst = formData.withGST ? price * 0.09 : 0;
    const transportationCharge = parseFloat(formData.transportationCharge) || 0;
    const labourCharge = parseFloat(formData.labourCharge) || 0;
    const totalAmount = price + sgst + cgst + transportationCharge + labourCharge;
    
    setFormData(prev => ({
      ...prev,
      totalSqft: totalSqft,
      price: parseFloat(price.toFixed(2)),
      sgst: parseFloat(sgst.toFixed(2)),
      cgst: parseFloat(cgst.toFixed(2)),
      totalAmount: parseFloat(totalAmount.toFixed(2))
    }));
  }, [formData.ratePerSqft, formData.size, formData.totalQuantity, formData.withGST, formData.transportationCharge, formData.labourCharge]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let val = value;
    if (name === 'transportationCharge' || name === 'labourCharge') {
      val = parseFloat(value);
      if (isNaN(val)) val = 0;
    }
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : val
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Parse transportationCharge and labourCharge as floats before sending
      const payload = {
        ...formData,
        transportationCharge: parseFloat(formData.transportationCharge) || 0,
        labourCharge: parseFloat(formData.labourCharge) || 0,
      };
      const response = await api.post('/quotations', payload);
      alert('Quotation created successfully!');
      navigate(`/quotation-view/${response.data._id}`);
    } catch (error) {
      console.error('Error creating quotation:', error);
      alert('Failed to create quotation');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Create New Quotation</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Customer Name:</label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Customer Mobile:</label>
          <input
            type="tel"
            name="customerMobile"
            value={formData.customerMobile}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Product Name:</label>
          <select
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="">Select Product</option>
            <option value="25mm PLYWOOD">25mm PLYWOOD</option>
            <option value="18mm PLYWOOD">18mm PLYWOOD</option>
            <option value="12mm PLYWOOD">12mm PLYWOOD</option>
            <option value="8mm PLYWOOD">8mm PLYWOOD</option>
            <option value="6mm PLYWOOD">6mm PLYWOOD</option>
            <option value="4mm PLYWOOD">4mm PLYWOOD</option>
            {products.map(product => (
              <option key={product._id} value={product.name}>{product.name}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Brand:</label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Size:</label>
          <input
            type="text"
            name="size"
            value={formData.size}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Rate per Sq. Ft:</label>
          <input
            type="number"
            name="ratePerSqft"
            value={formData.ratePerSqft}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>
            <input
              type="checkbox"
              name="withGST"
              checked={formData.withGST}
              onChange={handleChange}
            />
            Include GST (18%)
          </label>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Total Quantity:</label>
          <input
            type="number"
            name="totalQuantity"
            value={formData.totalQuantity}
            onChange={handleChange}
            required
            min="1"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Total Sq. Ft:</label>
          <input
            type="number"
            name="totalSqft"
            value={formData.totalSqft}
            readOnly
            style={{ width: '100%', padding: '8px', backgroundColor: '#f0f0f0' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Price:</label>
          <input
            type="text"
            value={formData.price}
            readOnly
            style={{ width: '100%', padding: '8px', backgroundColor: '#f0f0f0' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>SGST (9%):</label>
          <input
            type="text"
            value={formData.sgst}
            readOnly
            style={{ width: '100%', padding: '8px', backgroundColor: '#f0f0f0' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>CGST (9%):</label>
          <input
            type="text"
            value={formData.cgst}
            readOnly
            style={{ width: '100%', padding: '8px', backgroundColor: '#f0f0f0' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Transportation Charge:</label>
          <input
            type="number"
            name="transportationCharge"
            value={formData.transportationCharge}
            onChange={handleChange}
            min="0"
            step="0.01"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Labour Charge:</label>
          <input
            type="number"
            name="labourCharge"
            value={formData.labourCharge}
            onChange={handleChange}
            min="0"
            step="0.01"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Total Amount:</label>
          <input
            type="text"
            value={formData.totalAmount}
            readOnly
            style={{ width: '100%', padding: '8px', backgroundColor: '#f0f0f0' }}
          />
        </div>

        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
          Create Quotation
        </button>
      </form>
    </div>
  );
};

export default QuotationForm;