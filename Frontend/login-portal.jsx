import { useNavigate } from 'react-router-dom';
import LoginPortalImage from '/src/frontend/authentication/assets/login-portal/login-portal.png';
import Logo from '/src/frontend/assets/smartsupport-logo.svg';

import './login-portal.css';

const LoginPortal = () => {
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    const route = role === 'employee' ? '/login/employee' : '/login/admin';
    navigate(route);
  };

  return (
    <div className="login-portal-wrapper">
      <main className="login-portal-content">
          <section className="login-portal-text">
            <div className="login-portal-logo">
              <img src={Logo} alt="Smart Support Logo" className="login-header-logo" />
              <span className="logo-text">
                  <span className="logo-smart">Smart</span>
                  <span className="logo-support">Support</span>
              </span>
              </div>

            <h1>Smart Ticketing</h1>
            <h2>for Better Support</h2>
            <p>“From submission to resolution, we've got your workflow covered.”</p>
            <div className="login-portal-buttons">
              <button onClick={() => handleRoleSelection('employee')}>Employee</button>
              <button onClick={() => handleRoleSelection('admin')}>Admin</button>
            </div>
          </section>

        <section className="login-portal-image-wrapper">
          <img
            src={LoginPortalImage}
            alt="Login portal illustration"
            className="login-portal-image"
          />
        </section>
      </main>
    </div>
  );
};

export default LoginPortal;
