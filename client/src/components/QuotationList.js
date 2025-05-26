import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './QuotationList.css';

const QuotationList = () => {
  const [quotations, setQuotations] = useState([]);

  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        const response = await api.get('/quotations');
        setQuotations(response.data);
      } catch (error) {
        console.error('Error fetching quotations:', error);
      }
    };
    fetchQuotations();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this quotation?')) {
      try {
        await api.delete(`/quotations/${id}`);
        setQuotations(quotations.filter(quotation => quotation._id !== id));
      } catch (error) {
        console.error('Error deleting quotation:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="quotation-list-container">
      <h2 className="quotation-list-title">Quotation List</h2>
      <table className="quotation-table">
        <thead className="quotation-table-header">
          <tr>
            <th>Index No.</th>
            <th>Customer Name</th>
            <th>Mobile</th>
            <th>Date</th>
            <th>Product</th>
            <th>Total Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {quotations.map((quotation, index) => (
            <tr key={quotation._id} className="quotation-table-row">
              <td className="quotation-table-cell">{index + 1}</td>
              <td className="quotation-table-cell">{quotation.customerName}</td>
              <td className="quotation-table-cell">{quotation.customerMobile}</td>
              <td className="quotation-table-cell">{formatDate(quotation.createdAt)}</td>
              <td className="quotation-table-cell">{quotation.productName}</td>
              <td className="quotation-table-cell">₹{quotation.totalAmount.toFixed(2)}</td>
              <td className="quotation-table-cell">
                <Link to={`/quotation-view/${quotation._id}`} className="action-link">
                  View
                </Link>
                <Link to={`/quotation-edit/${quotation._id}`} className="action-link">
                  Edit
                </Link>
                <button 
                  onClick={() => handleDelete(quotation._id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuotationList;
