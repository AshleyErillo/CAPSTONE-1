import { useState } from "react";
import AdminUploadedImagePreview from "../../components/modals/admin_uploaded-image-preview.jsx";
import './admin_user-access-register-user.css';

import { Upload, X, ChevronDown } from "lucide-react";

function CreateAccount() {
  // Form field states
  const [email, setEmail] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");
  
  // UI states
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedUploadedImage, setSelectedUploadedImage] = useState("");
  const [showImagePreviewModal, setShowImagePreviewModal] = useState(false);
  const [department, setDepartment] = useState('');
  const [suffix, setSuffix] = useState('');
  const [role, setRole] = useState('');
  const [errors, setErrors] = useState({});

  // NEW: Confirmation modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState('');

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 2 * 1024 * 1024; // 2MB
  
    // Clear previous image errors
    setErrors(prev => ({ ...prev, image: null }));
  
    if (!validTypes.includes(file.type)) {
      setErrors(prev => ({
        ...prev,
        image: 'Only JPG, JPEG, and PNG formats are allowed.',
      }));
      return;
    }
  
    if (file.size > maxSize) {
      setErrors(prev => ({
        ...prev,
        image: 'Image must not exceed 2MB.',
      }));
      return;
    }
  
    const img = new Image();
    img.onload = () => {
      if (img.width !== 1024 || img.height !== 1024) {
        setErrors(prev => ({
          ...prev,
          image: 'Image must be exactly 1024x1024 pixels.',
        }));
      } else {
        setErrors(prev => ({ ...prev, image: null }));
        setSelectedUploadedImage(file.name);
        setUploadedImage(file);
      }
    };
    img.onerror = () => {
      setErrors(prev => ({
        ...prev,
        image: 'Could not read image. Please upload a valid file.',
      }));
    };
    img.src = URL.createObjectURL(file);
  };

  const validateForm = () => {
    const newErrors = {};
  
    if (!uploadedImage) {
      newErrors.image = "Profile image is required.";
    }
    
    if (!firstName) {
      newErrors.firstName = "First name is required.";
    }
    
    if (!lastName) {
      newErrors.lastName = "Last name is required.";
    }
  
    if (!/^\d{4}$/.test(companyId)) {
      newErrors.companyId = "Company ID must be a 4-digit number.";
    }
  
    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      newErrors.email = "Invalid email format.";
    }
    
    if (!department) {
      newErrors.department = "Department is required.";
    }
    
    if (!role) {
      newErrors.role = "User role is required.";
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!validateForm()) return;
  
    const formData = new FormData();
    formData.append("last_name", lastName);
    formData.append("first_name", firstName);
    formData.append("middle_name", middleName);
    formData.append("suffix", suffix);
    formData.append("company_id", `MA${companyId}`);
    formData.append("department", department);
    formData.append("role", role);
    formData.append("email", email);
    formData.append("image", uploadedImage);
  
    try {
      const response = await fetch("http://localhost:8000/api/create_employee/", {
        method: "POST",
        body: formData,
      });
  
      console.log("🔍 Status:", response.status);
  
      const contentType = response.headers.get("content-type");
  
      if (!response.ok) {
        if (contentType && contentType.includes("application/json")) {
          const errorJson = await response.json();
          console.error("❌ JSON error:", errorJson);
      
          const formattedErrors = {};
          if (errorJson.company_id) {
            formattedErrors.companyId = "Invalid Company ID";
          }
          if (errorJson.email) {
            formattedErrors.email = "Invalid Email";
          }
      
          setErrors(formattedErrors);
        } else {
          const errorText = await response.text();
          console.error("❌ Text error:", errorText);
          alert(`Error: ${errorText}`);
        }
        return;
      }
  
      const data = await response.json();
      console.log("✅ Success:", data);
      alert("User registered successfully!");
      
      // Reset form after successful submission
      setFirstName("");
      setLastName("");
      setMiddleName("");
      setSuffix("");
      setCompanyId("");
      setDepartment("");
      setRole("");
      setEmail("");
      setUploadedImage(null);
      setSelectedUploadedImage("");
    } catch (error) {
      console.error("🚨 Network error:", error);
      alert("Network error. Please try again.");
    }
  };

  // NEW: Handle cancel with confirmation
  const handleCancel = () => {
    setConfirmMessage('All unsaved changes will be lost.');
    setConfirmAction(() => () => {
      // Reset form
      setFirstName("");
      setLastName("");
      setMiddleName("");
      setSuffix("");
      setCompanyId("");
      setDepartment("");
      setRole("");
      setEmail("");
      setUploadedImage(null);
      setSelectedUploadedImage("");
      setErrors({});
      setShowConfirmModal(false);
    });
    setShowConfirmModal(true);
  };

  // NEW: Handle register with confirmation
  const handleRegister = (event) => {
    event.preventDefault();
    
    if (!validateForm()) return;
    
    setConfirmMessage('Are you sure you want to register this user? Please verify all information is correct.');
    setConfirmAction(() => () => {
      setShowConfirmModal(false);
      handleSubmit(event);
    });
    setShowConfirmModal(true);
  };

  // NEW: Confirmation Modal Component
  const ConfirmationModal = () => {
    if (!showConfirmModal) return null;

    return (
      <div className="confirmation-modal-overlay">
        <div className="confirmation-modal">
          <div className="confirmation-modal-header">
            <h3>Save Progress?</h3>
          </div>
          <div className="confirmation-modal-body">
            <p>{confirmMessage}</p>
          </div>
          <div className="confirmation-modal-footer">
            <button 
              type="button" 
              className="btn-confirm-cancel"
              onClick={() => setShowConfirmModal(false)}
            >
              Cancel
            </button>
            <button 
              type="button" 
              className="btn-confirm-proceed"
              onClick={confirmAction}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="register-user-form-container">
      <h2>Register New User Account</h2>
      <hr />
      <form onSubmit={handleRegister}>
        {/* Name fields */}
        <div className="register-user-form-group">
          <label htmlFor="last-name">Last Name</label>
          <input 
            type="text" 
            id="last-name" 
            name="last_name" 
            required 
            placeholder="Last Name" 
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          {errors.lastName && <p className="error-message">{errors.lastName}</p>}
        </div>

        <div className="register-user-form-group">
          <label htmlFor="first-name">First Name</label>
          <input 
            type="text" 
            id="first-name" 
            name="first_name" 
            required 
            placeholder="First Name" 
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          {errors.firstName && <p className="error-message">{errors.firstName}</p>}
        </div>

        <div className="register-user-form-group">
          <label htmlFor="middle-name">Middle Name</label>
          <input 
            type="text" 
            id="middle-name" 
            name="middle_name" 
            placeholder="Middle Name" 
            value={middleName}
            onChange={(e) => setMiddleName(e.target.value)}
          />
        </div>
        
        <div className="register-user-form-group">
          <label htmlFor="suffix">Suffix</label>
          <div className="register-user-select-wrapper">
            <select
              id="suffix"
              name="suffix"
              value={suffix}
              onChange={(e) => setSuffix(e.target.value)}
              className="register-user-suffix-select"
              style={{ color: suffix === '' ? '#7e7e7e' : '#0C0C0C' }}
            >
              <option value="" disabled hidden>Suffix</option>
              <option value="Jr.">Jr.</option>
              <option value="Sr.">Sr.</option>
              <option value="III">III</option>
              <option value="IV">IV</option>
              <option value="V">V</option>
              <option value="VI">VI</option>
              <option value="VII">VII</option>
              <option value="VIII">VIII</option>
              <option value="IX">IX</option>
              <option value="X">X</option>
            </select>

            <div className="register-user-select-separator"></div>

            <div className="register-user-select-chevron">
              <ChevronDown size={18} />
            </div>

            {suffix && (
              <div
                className="register-user-clear-suffix"
                onClick={() => setSuffix('')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setSuffix('');
                  }
                }}
              >
                <X size={14} />
              </div>
            )}
          </div>
        </div>

        <div className="register-user-form-group">
          <label htmlFor="department">Department</label>
          <div className="register-user-select-wrapper">
            <select
              id="department"
              name="department"
              required
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="suffix-select"
              style={{ color: department === '' ? '#7e7e7e' : '#0C0C0C' }}
            >
              <option value="" disabled hidden>Department</option>
              <option value="IT Department">IT Department</option>
              <option value="Asset Management">Asset Management</option>
              <option value="Document Control">Document Control</option>
              <option value="Finance & Budgeting">Finance & Budgeting</option>
              <option value="Operations">Operations</option>
              <option value="Facilities & Maintenance">Facilities & Maintenance</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Administration">Administration</option>
            </select>

            <div className="register-user-select-separator"></div>

            <div className="register-user-select-chevron">
              <ChevronDown size={18} />
            </div>

            {department && (
              <div
                className="register-user-clear-department"
                onClick={() => setDepartment('')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setDepartment('');
                  }
                }}
              >
                <X size={14} />
              </div>
            )}
          </div>
          {errors.department && <p className="error-message">{errors.department}</p>}
        </div>
        
        <div className="register-user-form-group">
          <label htmlFor="company-id">Company ID</label>
          <div className="company-id-wrapper">
            <span className="company-id-prefix">MA</span>
            <div className="company-id-separator"></div>
            <input
              type="text"
              id="company-id"
              name="company_id"
              placeholder="XXXX"
              value={companyId}
              autoComplete="off"
              onChange={(e) => {
                const numeric = e.target.value.replace(/\D/g, "");
                if (numeric.length <= 4) {
                  setCompanyId(numeric);
                }
              }}
              maxLength={4}
              inputMode="numeric"
              className="company-id-input"
            />
          </div>

          {errors.companyId && <p className="error-message">{errors.companyId}</p>}
        </div>

        <div className="register-user-form-group">
          <label htmlFor="role-selection">User Role</label>
          <div className="register-user-select-wrapper">
            <select
              id="role-selection"
              name="role"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="register-user-suffix-select"
              style={{ color: role === '' ? '#7e7e7e' : '#0C0C0C' }}
            >
              <option value="" disabled hidden>User Role</option>
              <option value="Employee">Employee</option>
              <option value="Ticket Agent">Ticket Coordinator</option>
              <option value="System Admin">System Admin</option>
            </select>

            <div className="register-user-select-separator"></div>

            <div className="register-user-select-chevron">
              <ChevronDown size={18} />
            </div>

            {role && (
              <div
                className="register-user-clear-role"
                onClick={() => setRole('')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setRole('');
                  }
                }}
              >
                <X size={14} />
              </div>
            )}
          </div>
          {errors.role && <p className="error-message">{errors.role}</p>}
        </div>

        {/* Image Upload */}
        <div className="register-user-form-group">
          <label htmlFor="image-upload">Upload Profile Picture</label>
          <div className="register-user-file-upload-container">
            <label
              htmlFor="image"
              className={`register-user-file-upload-btn full-clickable ${uploadedImage ? "disabled" : ""}`}
              style={uploadedImage ? { cursor: "not-allowed", opacity: 0.6 } : {}}
            >
              <Upload size={18} className="upload-icon" />
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                required
                onChange={handleImageUpload}
                style={{ display: "none" }}
                disabled={!!uploadedImage}
              />
            </label>

            <span
              className={`register-user-file-name ${selectedUploadedImage ? "has-file" : ""}`}
              style={{ color: '#7e7e7e' }}
              onClick={() => {
                if (uploadedImage) {
                  setShowImagePreviewModal(true);
                } else {
                  const fileInput = document.getElementById("image");
                  if (fileInput) fileInput.click();
                }
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  if (uploadedImage) {
                    setShowImagePreviewModal(true);
                  } else {
                    const fileInput = document.getElementById("image");
                    if (fileInput) fileInput.click();
                  }
                }
              }}
            >
              {selectedUploadedImage || "Upload Profile Picture"}

              {selectedUploadedImage && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setUploadedImage(null);
                    setSelectedUploadedImage("");
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.stopPropagation();
                      setUploadedImage(null);
                      setSelectedUploadedImage("");
                    }
                  }}
                >
                  <X size={18} />
                </span>
              )}
            </span>
          </div>
          {errors.image && <p className="error-message">{errors.image}</p>}
        </div>

        <AdminUploadedImagePreview
          showModal={showImagePreviewModal}
          imageSrc={uploadedImage ? URL.createObjectURL(uploadedImage) : null}
          closeModal={() => setShowImagePreviewModal(false)}
        />

        <div className="register-user-form-group">
          <label htmlFor="email">Email Address</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            required 
            placeholder="Email Address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>

        <div className="register-user-button-group">
          <button type="button" className="btn-cancel-register-user" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className="btn-register-user">
            Register
          </button>
        </div>

      </form>

      {/* NEW: Confirmation Modal */}
      <ConfirmationModal />
    </div>
  );
}

export default CreateAccount;