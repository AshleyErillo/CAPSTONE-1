import "./admin_user-access-review-user.css";

const AdminUserAccountApproval = ({ user, onClose, onApprove, onReject }) => {
  if (!user) return null;

  const handleApprove = () => {
    if (onApprove) onApprove(user);
    onClose();
  };

  const handleReject = () => {
    if (onReject) onReject(user);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content approval-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          ×
        </button>

        <div className="approval-header">
          <h1>New Created Account Approval</h1>
        </div>

        <div className="approval-content">
          <div className="user-avatar">
            <img 
              src={user.avatar || "/api/placeholder/80/80"} 
              alt="User Avatar" 
              className="avatar-image"
            />
          </div>

          <div className="user-details">
            <div className="name-row">
              <div className="field-group">
                <label>Last Name:</label>
                <input type="text" value={user.lastName || ''} readOnly className="readonly-input" />
              </div>
              <div className="field-group">
                <label>First Name:</label>
                <input type="text" value={user.firstName || ''} readOnly className="readonly-input" />
              </div>
              <div className="field-group">
                <label>Middle Name:</label>
                <input type="text" value={user.middleName || ''} readOnly className="readonly-input" />
              </div>
              <div className="field-group">
                <label>Suffix:</label>
                <input type="text" value={user.suffix || ''} readOnly className="readonly-input" />
              </div>
            </div>

            <div className="details-row">
              <div className="field-group">
                <label>Company ID:</label>
                <input type="text" value={user.companyId || ''} readOnly className="readonly-input" />
              </div>
              <div className="field-group">
                <label>Department:</label>
                <input type="text" value={user.department || ''} readOnly className="readonly-input" />
              </div>
            </div>

            <div className="email-row">
              <div className="field-group full-width">
                <label>Email address:</label>
                <input type="email" value={user.email || ''} readOnly className="readonly-input" />
              </div>
            </div>
          </div>
        </div>

        <div className="approval-actions">
          <button className="reject-btn" onClick={handleReject}>Reject</button>
          <button className="approve-btn" onClick={handleApprove}>Approve</button>
        </div>
      </div>
    </div>
  );
};

export default AdminUserAccountApproval;
