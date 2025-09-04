import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Chip,
  IconButton,
} from "@material-tailwind/react";
import { PlusIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { GovInvoiceModal } from "@/features/invoice/GovInvoiceModal";
import { submitGovInvoice, fetchGovInvoices } from "@/services/govSubmit";

export function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openGovModal, setOpenGovModal] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [error, setError] = useState(null);

  // Fetch invoices on component mount
  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const result = await fetchGovInvoices();
      
      if (result.ok) {
        setInvoices(result.data || []);
        setError(null);
      } else {
        setError(result.error || 'Failed to load invoices');
        console.error('Error loading invoices:', result.error);
      }
    } catch (err) {
      setError('Network error while loading invoices');
      console.error('Error loading invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenGovModal = () => setOpenGovModal(true);
  const handleCloseGovModal = () => setOpenGovModal(false);

  const handleGovInvoiceSubmit = async (data) => {
    try {
      const result = await submitGovInvoice(data);
      
      if (result.ok) {
        console.log("Government Invoice submitted successfully:", result.data);
        setShowSuccessAlert(true);
        setTimeout(() => {
          setShowSuccessAlert(false);
        }, 5000);
        
        // Reload invoices to show the new one
        await loadInvoices();
        handleCloseGovModal();
      } else {
        console.error("Failed to submit invoice:", result.error);
        setError(result.error || 'Failed to submit invoice');
        // Show error for 5 seconds
        setTimeout(() => {
          setError(null);
        }, 5000);
      }
    } catch (err) {
      console.error("Error submitting invoice:", err);
      setError('Network error while submitting invoice');
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted':
        return 'blue';
      case 'approved':
        return 'green';
      case 'rejected':
        return 'red';
      case 'draft':
        return 'gray';
      default:
        return 'gray';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'submitted':
        return 'Submitted';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      case 'draft':
        return 'Draft';
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return '0.00';
    return parseFloat(amount).toFixed(2);
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      {/* Success Alert */}
      {showSuccessAlert && (
        <div className="bg-green-500 text-white px-6 py-4 rounded-lg flex items-center gap-3">
          <CheckCircleIcon className="h-6 w-6" />
          <span className="font-medium">Invoice submitted successfully!</span>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="bg-red-500 text-white px-6 py-4 rounded-lg flex items-center gap-3">
          <span className="font-medium">Error: {error}</span>
        </div>
      )}

      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <div>
          <Typography variant="h2" color="blue-gray" className="mb-2">
            Invoices
          </Typography>
          <Typography variant="paragraph" color="gray" className="font-normal">
            Manage and track all your invoices in one place.
          </Typography>
        </div>
        <Button
          className="flex items-center gap-2 bg-black text-white hover:bg-gray-800"
          onClick={handleOpenGovModal}
        >
          <PlusIcon className="h-4 w-4" />
          Add Invoice
        </Button>
      </div>

      {/* Invoices Table */}
      <Card>
        <CardHeader variant="gradient" color="blue-gray" className="mb-8 p-6" style={{ backgroundColor: "black" }}>
          <Typography variant="h6" color="white">
            Invoices Table
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Typography variant="paragraph" color="gray">
                Loading invoices...
              </Typography>
            </div>
          ) : invoices.length === 0 ? (
            <div className="flex justify-center items-center py-8">
              <Typography variant="paragraph" color="gray">
                No invoices found. Create your first invoice!
              </Typography>
            </div>
          ) : (
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {[
                    "Invoice Type",
                    "Date",
                    "Seller",
                    "Buyer", 
                    "Total Amount",
                    "Status",
                    "Created"
                  ].map((el) => (
                    <th
                      key={el}
                      className="border-b border-blue-gray-50 py-3 px-6 text-left"
                    >
                      <Typography
                        variant="small"
                        className="text-[11px] font-medium uppercase text-blue-gray-400"
                      >
                        {el}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice, key) => {
                  const className = `py-3 px-6 ${
                    key === invoices.length - 1 ? "" : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={invoice._id}>
                      <td className={className}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {invoice.invoiceType}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {formatDate(invoice.invoiceDate)}
                        </Typography>
                      </td>
                      <td className={className}>
                        <div className="flex flex-col">
                          <Typography variant="small" color="blue-gray" className="font-normal">
                            {invoice.sellerBusinessName}
                          </Typography>
                          <Typography variant="small" color="blue-gray" className="font-normal opacity-70">
                            {invoice.sellerNTNCNIC}
                          </Typography>
                        </div>
                      </td>
                      <td className={className}>
                        <div className="flex flex-col">
                          <Typography variant="small" color="blue-gray" className="font-normal">
                            {invoice.buyerBusinessName}
                          </Typography>
                          <Typography variant="small" color="blue-gray" className="font-normal opacity-70">
                            {invoice.buyerNTNCNIC}
                          </Typography>
                        </div>
                      </td>
                      <td className={className}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          Rs. {formatCurrency(invoice.totalAmount || 0)}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Chip
                          variant="gradient"
                          color={getStatusColor(invoice.status)}
                          value={getStatusText(invoice.status)}
                          className="py-0.5 px-2 text-[11px] font-medium"
                        />
                      </td>
                      <td className={className}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {formatDate(invoice.createdAt)}
                        </Typography>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>

      {/* Government Invoice Modal */}
      <GovInvoiceModal
        open={openGovModal}
        onClose={handleCloseGovModal}
        onSubmit={handleGovInvoiceSubmit}
      />
    </div>
  );
}

export default Invoices; 