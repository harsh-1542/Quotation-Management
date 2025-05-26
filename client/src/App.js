// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import QuotationForm from './components/QuotationForm';
import QuotationList from './components/QuotationList';
import QuotationView from './components/QuotationView';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ width: '85%' }}>
          <Routes>
            <Route path="/quotation-form" element={<QuotationForm />} />
            <Route path="/quotation-list" element={<QuotationList />} />
            <Route path="/quotation-view/:id" element={<QuotationView />} />
            <Route path="/quotation-edit/:id" element={<QuotationForm />} />
            <Route path="/" element={<QuotationList />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
