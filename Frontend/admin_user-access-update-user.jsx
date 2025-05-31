import React, { useState } from 'react';
import './admin_user-access-update-user.css';

const UpdateModal = ({ user, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    middleName: user?.middleName || '',
    suffix: user?.suffix || '',
    companyId: user?.companyId || '',
    department: user?.department || '',
    accountStatus: user?.accountStatus || 'Active',
    email: user?.email || '',
  });

  if (!user) return null;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    const updatedUser = {
      ...user,
      ...formData,
    };
    if (onUpdate) onUpdate(updatedUser);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content update-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>×</button>

        <div className="update-header">
          <h1>Update Account</h1>
        </div>

        <div className="update-content">
          <div className="form-layout">
            {/* Avatar Section */}
            <div className="avatar-section">
              <div className="user-avatar">
                <img 
                  src={user.avatar || "/api/placeholder/80/80"} 
                  alt="User Avatar" 
                  className="avatar-image"
                />
              </div>
            </div>

            {/* Form Fields Section */}
            <div className="form-fields">
              {/* Name Row */}
              <div className="name-row">
                <div className="field-group">
                  <label>Last Name:</label>
                  <input 
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="form-input"
                    required 
                  />
                </div>
                <div className="field-group">
                  <label>First Name:</label>
                  <input 
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="form-input"
                    required 
                  />
                </div>
                <div className="field-group">
                  <label>Middle Name:</label>
                  <input 
                    value={formData.middleName}
                    onChange={(e) => handleInputChange('middleName', e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="field-group">
                  <label>Suffix:</label>
                  <input 
                    value={formData.suffix}
                    onChange={(e) => handleInputChange('suffix', e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Company and Department Row */}
              <div className="details-row">
                <div className="field-group">
                  <label>Company ID:</label>
                  <input 
                    value={formData.companyId}
                    onChange={(e) => handleInputChange('companyId', e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="field-group">
                  <label>Department:</label>
                  <input 
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Account Status and Email Row */}
              <div className="status-email-row">
                <div className="field-group">
                  <label>Account Status:</label>
                  <input 
                    value={formData.accountStatus}
                    onChange={(e) => handleInputChange('accountStatus', e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="field-group email-field">
                  <label>Email address:</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="form-input"
                    required 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="update-actions">
            <button type="button" className="reject-btn" onClick={onClose}>Reject</button>
            <button type="button" className="approve-btn" onClick={handleSubmit}>Approve</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateModal;