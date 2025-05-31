import { useState } from "react";
import { Link } from "react-router-dom";
import CreateAccountForgotPasswordHeader from "../../components/headers/user_create-account-forgot-password-header.jsx";
import PrivacyPolicyAndTermsAndConditions from "../../components/modals/privacy-policy-and-terms-and-conditions.jsx";
import UploadedImagePreview from '../../components/modals/uploaded-image-preview.jsx';

import "./user_create-account.css";
import { Eye, EyeOff, Upload, X, ChevronDown } from "lucide-react";

function CreateAccount() {
  const [suffix, setSuffix] = useState("");
  const [department, setDepartment] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedUploadedImage, setSelectedUploadedImage] = useState("");
  const [showPrivacyPolicyModal, setShowPrivacyPolicyModal] = useState(false);
  const [showImagePreviewModal, setShowImagePreviewModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");

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
        setFormData((prevData) => ({
          ...prevData,
          image: file,
        }));
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

  const handleLabelClick = (e) => {
    e.preventDefault();
    setShowPrivacyPolicyModal(true);
  };

  const getPasswordErrorMessage = (password) => {
    const messages = [];
  
    const hasMinLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
    const missing = {
      upper: !hasUpper,
      lower: !hasLower,
      digit: !hasDigit,
      special: !hasSpecial,
    };
  
    const missingKeys = Object.entries(missing)
      .filter(([_, isMissing]) => isMissing)
      .map(([key]) => key);
  
    const descriptors = {
      upper: "uppercase",
      lower: "lowercase",
      digit: "number",
      special: "special character",
    };
  
    const buildList = (items) => {
      if (items.length === 1) return descriptors[items[0]];
      if (items.length === 2)
        return `${descriptors[items[0]]} and ${descriptors[items[1]]}`;
      return (
        items
          .slice(0, -1)
          .map((key) => descriptors[key])
          .join(", ") +
        ", and " +
        descriptors[items[items.length - 1]]
      );
    };
  
    if (!hasMinLength && missingKeys.length) {
      return `Password must be at least 8 characters long and include ${buildList(
        missingKeys
      )}.`;
    } else if (!hasMinLength) {
      return "Password must be at least 8 characters long.";
    } else if (missingKeys.length) {
      return `Password must include ${buildList(missingKeys)}.`;
    }
  
    return null; // No error
  };  

  const validateForm = () => {
    const newErrors = {};
  
    if (!uploadedImage) {
      newErrors.image = "Image is required.";
    }
  
    const passwordMessage = getPasswordErrorMessage(password);
    if (passwordMessage) {
      newErrors.password = passwordMessage;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Password didn't matched";
    }
  
    if (!/^\d{4}$/.test(companyId)) {
      newErrors.companyId = "Company ID must be a 4-digit number.";
    }
  
    if (!email.endsWith("@gmail.com")) {
      newErrors.email = "Only Gmail addresses are allowed.";
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
    formData.append("email", email);
    formData.append("password", password);
    formData.append("image", uploadedImage);
    formData.append("confirm_password", confirmPassword);
  
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
            formattedErrors.companyId = "Invalid Company ID"; // 👈 custom message
          }
          if (errorJson.email) {
            formattedErrors.email = "Invalid Email"; // 👈 optional customization
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
      alert("Account created successfully!");
    } catch (error) {
      console.error("🚨 Network error:", error);
      alert("Network error. Please try again.");
    }
  };  

  return (
    <>
      <CreateAccountForgotPasswordHeader />
      <div className="create-account-form-container">
        <h2>Create Account</h2>
        <hr />
        <form onSubmit={handleSubmit}>
          {/* Name fields */}
          <div className="create-account-form-group">
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
          </div>

          <div className="create-account-form-group">
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
          </div>

          <div className="create-account-form-group">
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

          <div className="create-account-form-group">
            <label htmlFor="suffix">Suffix</label>
            <div className="select-wrapper">
            <select
                id="suffix"
                name="suffix"
                className="suffix-select"
                value={suffix}
                onChange={(e) => setSuffix(e.target.value)}
                style={{ color: suffix === "" ? "#7e7e7e" : "#0C0C0C" }}
              >
                <option value="" disabled hidden>
                  Suffix
                </option>
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
              <div className="select-separator"></div>
              <div className="select-chevron">
                <ChevronDown size={18} />
              </div>
              {suffix && (
                <div className="clear-suffix" onClick={() => setSuffix("")}>
                  <X size={14} />
                </div>
              )}
            </div>
          </div>

          <div className="create-account-form-group">
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

          <div className="create-account-form-group">
            <label htmlFor="department">Department</label>
            <div className="select-wrapper">
            <select
                id="department"
                name="department"
                className="suffix-select"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                style={{ color: department === "" ? "#7e7e7e" : "#0C0C0C" }}
              >
                <option value="" disabled hidden>
                  Department
                </option>
                <option value="IT Department">IT Department</option>
                <option value="Asset Management">Asset Management</option>
                <option value="Document Control">Document Control</option>
                <option value="Finance & Budgeting">Finance & Budgeting</option>
                <option value="Operations">Operations</option>
                <option value="Facilities & Maintenance">Facilities & Maintenance</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Administration">Administration</option>
              </select>
              <div className="select-separator"></div>
              <div className="select-chevron">
                <ChevronDown size={18} />
              </div>
              {department && (
                <div className="clear-department" onClick={() => setDepartment("")}>
                  <X size={14} />
                </div>
              )}
            </div>
          </div>

          {/* Upload image */}
          <div className="create-account-form-group">
            <label htmlFor="upload-label">Upload Image</label>
            <div className="file-upload-container">
              <label
                htmlFor="image"
                className={`file-upload-btn full-clickable ${uploadedImage ? "disabled" : ""}`}
                style={uploadedImage ? { cursor: "not-allowed", opacity: 0.6 } : {}}
              >
                <Upload size={18} />
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                  disabled={!!uploadedImage}
                />
              </label>

              <span
                className={`file-name ${selectedUploadedImage ? "has-file" : ""}`}
                style={{ color: "#7e7e7e" }}
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
                {selectedUploadedImage || "Upload Image"}
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

            {/* ✅ Error message placed correctly here */}
            {errors.image && <p className="error-message">{errors.image}</p>}
          </div>

          {/* Email and password fields */}
          <div className="create-account-form-group">
            <label htmlFor="email">Email Address</label>
            <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                pattern="^[a-zA-Z0-9._%+-]+@gmail\.com$"
                title="Only Gmail addresses are allowed"
              />
              {errors.email && <p className="error-message">{errors.email}</p>}
          </div>

          <div className="create-account-form-group">
            <label htmlFor="password">Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Password"
                value={password}
                autoComplete="new-password"
                onChange={(e) => setPassword(e.target.value)}
              />
              
              <span
                className="password-icon"
                data-tooltip={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword(!showPassword)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setShowPassword(!showPassword);
                }}
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </span>
            </div>
            {errors.password && <p className="error-message">{errors.password}</p>}
          </div>

          <div className="create-account-form-group">
            <label htmlFor="confirm-password">Confirm Password</label>
            <div className="password-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirm-password"
                name="confirm_password"
                placeholder="Confirm Password"
                value={confirmPassword}
                autoComplete="new-password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              
              <span
                className="password-icon"
                data-tooltip={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setShowConfirmPassword(!showConfirmPassword);
                }}
              >
                {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </span>
            </div>
            {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
          </div>

          {/* Checkbox and modal */}
          <div className="create-account-checkbox-group">
            <label htmlFor="checkbox" className="checkbox-label">
              <input
                type="checkbox"
                id="privacypolicy_termsandconditions"
                name="privacypolicy_termsandconditions"
                required
              />
              I agree to the{" "}
              <span
                className="privacy-link"
                onClick={handleLabelClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handleLabelClick(e);
                }}
              >
                Privacy Policy and Terms and Conditions
              </span>
            </label>
          </div>

           <PrivacyPolicyAndTermsAndConditions
            showModal={showPrivacyPolicyModal}
            closeModal={() => setShowPrivacyPolicyModal(false)}
          />

          <button type="submit" className="btn-signup">
            Sign Up
          </button>

          <div className="login-link">
            Already have an account? <Link to="/login/employee">Log In</Link>
          </div>
        </form>
      </div>
    </>
  );
}

export default CreateAccount;
