import { useEffect, useState } from 'react';
import './admin_ticket-management-review-ticket.css';

const AdminTicketManagementReviewNewTicket = ({ onClose }) => {
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [priority, setPriority] = useState('Low');
  const [department, setDepartment] = useState('IT Support');
  const [approvalNotes, setApprovalNotes] = useState('');

  // Sample ticket data
  const ticketData = {
    employeeName: 'John Smith',
    companyId: 'EMP-2024-001',
    employeeDepartment: 'Marketing',
    subject: 'Request for personal app installation',
    category: 'Software',
    subCategory: 'Unauthorized App',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    hasFile: true
  };

  const handleOpenTicket = () => {
    setShowApprovalModal(true);
  };

  const handleRejectTicket = () => {
    setShowRejectionModal(true);
  };

  const handleCloseModal = () => {
    setShowRejectionModal(false);
    setShowApprovalModal(false);
    setRejectionReason('');
    setApprovalNotes('');
  };

  const handleCloseAll = () => {
    handleCloseModal();
    onClose();
  };

  const submitRejection = () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection.');
      return;
    }
    alert('Rejection Submitted:\n' + rejectionReason);
    handleCloseAll();
  };

  const submitApproval = () => {
    alert(
      `Approval Submitted:\nPriority: ${priority}\nDepartment: ${department}\nNotes: ${
        approvalNotes || 'None'
      }`
    );
    handleCloseAll();
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (showRejectionModal || showApprovalModal) {
          handleCloseModal();
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, showRejectionModal, showApprovalModal]);

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('admin-ticket-modal-overlay') || 
        e.target.classList.contains('secondary-modal-overlay')) {
      if (showRejectionModal || showApprovalModal) {
        handleCloseModal();
      } else {
        onClose();
      }
    }
  };

  return (
    <div>
      <div
        className={`admin-ticket-modal-overlay active`}
        onClick={handleOverlayClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-ticket-title"
      >
        {!showRejectionModal && !showApprovalModal && (
          <div className="admin-ticket-modal-content">
            <div className="admin-ticket-modal-header">
              <h2 id="review-ticket-title" className="admin-ticket-modal-title">
                Review New Ticket
              </h2>
              <button
                className="admin-ticket-modal-close-btn"
                onClick={onClose}
                aria-label="Close review ticket modal"
              >
                &times;
              </button>
            </div>

            <div className="admin-ticket-modal-body">
              <h3 className="employee-request-title"> Employee Information & Request </h3>

              <div className="employee-info-section">
                <div className="form-row">
                  <div className="form-group half-width">
                    <label className="form-label">Employee Name:</label>
                    <input
                      type="text"
                      value={ticketData.employeeName}
                      readOnly
                      className="form-input readonly"
                    />
                  </div>
                  <div className="form-group half-width">
                    <label className="form-label">Company ID:</label>
                    <input
                      type="text"
                      value={ticketData.companyId}
                      readOnly
                      className="form-input readonly"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Department:</label>
                  <input
                    type="text"
                    value={ticketData.employeeDepartment}
                    readOnly
                    className="form-input readonly"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Subject:</label>
                <input
                  type="text"
                  value={ticketData.subject}
                  readOnly
                  className="form-input readonly"
                />
              </div>

              <div className="form-row">
                <div className="form-group half-width">
                  <label className="form-label">Category:</label>
                  <select value={ticketData.category} disabled className="form-select readonly">
                    <option>{ticketData.category}</option>
                  </select>
                </div>
                <div className="form-group half-width">
                  <label className="form-label">Sub-Category:</label>
                  <select value={ticketData.subCategory} disabled className="form-select readonly">
                    <option>{ticketData.subCategory}</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description:</label>
                <textarea
                  value={ticketData.description}
                  readOnly
                  rows={6}
                  className="form-textarea readonly"
                />
              </div>

              {ticketData.hasFile && (
                <div className="form-group">
                  <label className="form-label">File Upload</label>
                  <div className="file-attachment">
                    📎 Attached File
                  </div>
                </div>
              )}

              <div className="admin-ticket-modal-actions">
                <button className="reject-ticket-btn" onClick={handleRejectTicket}>
                  Reject
                </button>
                <button className="approve-ticket-btn" onClick={handleOpenTicket}>
                  Approve
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rejection Modal */}
        {showRejectionModal && (
          <div className="secondary-modal-overlay" onClick={handleOverlayClick}>
            <div className="secondary-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="secondary-modal-header">
                <h3 className="secondary-modal-title">Reject Ticket</h3>
                <button
                  className="admin-ticket-modal-close-btn"
                  onClick={handleCloseModal}
                  aria-label="Close rejection modal"
                >
                  &times;
                </button>
              </div>
              
              <div className="secondary-modal-body">
                <p>
                  <strong>Are you sure you want to reject this ticket?</strong>
                </p>

                <div className="form-group">
                  <label className="form-label" htmlFor="rejectionReason">
                    Reason for Rejection <span style={{color: '#dc3545'}}>*</span>
                  </label>
                  <textarea
                    id="rejectionReason"
                    className="form-textarea"
                    placeholder="Please provide a detailed reason for rejection..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <div className="secondary-modal-actions">
                  <button className="btn secondary-btn" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button className="btn reject-btn" onClick={submitRejection}>
                    Submit Rejection
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Approval Modal */}
        {showApprovalModal && (
          <div className="secondary-modal-overlay" onClick={handleOverlayClick}>
            <div className="secondary-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="secondary-modal-header">
                <h3 className="secondary-modal-title">Approve Ticket</h3>
                <button
                  className="admin-ticket-modal-close-btn"
                  onClick={handleCloseModal}
                  aria-label="Close approval modal"
                >
                  &times;
                </button>
              </div>
              
              <div className="secondary-modal-body">
                <p>
                  <strong>Are you sure you want to approve this ticket?</strong>
                </p>

                <div className="form-group">
                  <label className="form-label" htmlFor="priority">Priority Level</label>
                  <select
                    id="priority"
                    className="form-select"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="department">Assign to Department</label>
                  <select
                    id="department"
                    className="form-select"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  >
                    <option>IT Support</option>
                    <option>Network</option>
                    <option>Security</option>
                    <option>Development</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="approvalNotes">Additional Notes (Optional)</label>
                  <textarea
                    id="approvalNotes"
                    className="form-textarea"
                    placeholder="Enter any notes..."
                    value={approvalNotes}
                    onChange={(e) => setApprovalNotes(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="secondary-modal-actions">
                  <button className="btn secondary-btn" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button className="btn approve-btn" onClick={submitApproval}>
                    Submit Approval
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTicketManagementReviewNewTicket;