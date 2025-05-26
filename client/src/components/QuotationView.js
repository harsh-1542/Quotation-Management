import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import styled from 'styled-components';
import './QuotationView.css';

// Styled components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const QuotationCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  padding: 2.5rem;
  max-width: 900px;
  margin: 0 auto 2rem;
  border: 1px solid #e0e6ed;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  color: #2c3e50;
  font-family: 'Playfair Display', serif;
  position: relative;
  
  &::after {
    content: '';
    display: block;
    width: 100px;
    height: 4px;
    background: linear-gradient(90deg, #3498db, #9b59b6);
    margin: 0.5rem auto 0;
    border-radius: 2px;
  }
`;

const DetailsSection = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const DetailsBox = styled.div`
  flex: 1;
  min-width: 250px;
  
  h3 {
    color: #3498db;
    margin-bottom: 0.75rem;
    font-size: 1.1rem;
    border-bottom: 2px solid #f0f0f0;
    padding-bottom: 0.5rem;
  }
  
  p {
    margin: 0.5rem 0;
    color: #555;
  }
  
  strong {
    color: #333;
    min-width: 120px;
    display: inline-block;
  }
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const TableHeader = styled.thead`
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  color: white;
`;

const TableCell = styled.td`
  padding: 12px 15px;
  border: 1px solid #e0e6ed;
  color: #555;
  
  ${props => props.alignRight && 'text-align: right;'}
  ${props => props.bold && 'font-weight: bold;'}
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9fafc;
  }
  
  &:last-child {
    ${TableCell} {
      border-bottom: 2px solid #e0e6ed;
    }
  }
`;

const SignatureSection = styled.div`
  text-align: right;
  margin-top: 3rem;
  
  p {
    margin: 0.5rem 0;
    color: #555;
  }
  
  p:first-child {
    margin-bottom: 2.5rem;
  }
  
  p:nth-child(2) {
    margin-top: 3rem;
    color: #333;
  }
`;

const DownloadButton = styled.button`
  display: block;
  margin: 2rem auto;
  padding: 12px 24px;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const QuotationView = () => {
  const { id } = useParams();
  const [quotation, setQuotation] = useState(null);
  const printRef = useRef();

  useEffect(() => {
    const fetchQuotation = async () => {
      try {
        const response = await api.get(`/quotations/${id}`);
        setQuotation(response.data);
      } catch (error) {
        console.error('Error fetching quotation:', error);
      }
    };
    fetchQuotation();
  }, [id]);

  const handleDownloadPdf = () => {
    const input = printRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`quotation_${quotation._id}.pdf`);
    });
  };

  if (!quotation) return <div>Loading...</div>;

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  return (
    <Container>
      <QuotationCard ref={printRef}>
        <Title>Quotation Bill</Title>
        
        <DetailsSection>
          <DetailsBox>
            <h3>Customer Details</h3>
            <p><strong>Name:</strong> {quotation.customerName}</p>
            <p><strong>Mobile:</strong> {quotation.customerMobile}</p>
          </DetailsBox>
          <DetailsBox>
            <h3>Quotation Info</h3>
            <p><strong>Date:</strong> {formatDate(quotation.createdAt)}</p>
            <p><strong>Quotation Number:</strong> {quotation.quotationNumber || 'N/A'}</p>
          </DetailsBox>
        </DetailsSection>

        <DetailsBox style={{ marginBottom: '2rem' }}>
          <h3>Product Details</h3>
          <p><strong>Product:</strong> {quotation.productName}</p>
          <p><strong>Brand:</strong> {quotation.brand || 'N/A'}</p>
          <p><strong>Size:</strong> {quotation.size || 'N/A'}</p>
        </DetailsBox>

        <StyledTable>
          <TableHeader>
            <tr>
              <TableCell>Description</TableCell>
              <TableCell alignRight>Amount</TableCell>
            </tr>
          </TableHeader>
          <tbody>
            <TableRow>
              <TableCell>Rate per Sq. Ft</TableCell>
              <TableCell alignRight>₹{quotation.ratePerSqft.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Total Sq. Ft</TableCell>
              <TableCell alignRight>{quotation.totalSqft.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Base Price</TableCell>
              <TableCell alignRight>₹{quotation.price.toFixed(2)}</TableCell>
            </TableRow>
            {quotation.withGST && (
              <TableRow>
                <TableCell>GST (18%)</TableCell>
                <TableCell alignRight>₹{(quotation.totalAmount - quotation.price).toFixed(2)}</TableCell>
              </TableRow>
            )}
            <TableRow>
              <TableCell>Transportation Charge</TableCell>
              <TableCell alignRight>₹{(quotation.transportationCharge || 0).toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Labour Charge</TableCell>
              <TableCell alignRight>₹{(quotation.labourCharge || 0).toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell bold>Total Amount</TableCell>
              <TableCell alignRight bold>₹{quotation.totalAmount.toFixed(2)}</TableCell>
            </TableRow>
          </tbody>
        </StyledTable>

        <SignatureSection>
          <p>For Interior Designer</p>
          <p>_________________________</p>
          <p>Authorized Signature</p>
        </SignatureSection>
      </QuotationCard>

      <DownloadButton onClick={handleDownloadPdf}>
        Download PDF Bill
      </DownloadButton>
    </Container>
  );
};

export default QuotationView;