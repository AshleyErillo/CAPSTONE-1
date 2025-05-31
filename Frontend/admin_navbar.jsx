import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

import AdminNavbarProfile from '../popups/admin_navbar-profile.jsx';
import AdminNavbarNotifications, { getNotificationCount } from '../popups/admin_navbar-notifications.jsx';

import Logo from '/src/frontend/assets/smartsupport-logo.svg';
import { ChevronDown, Bell } from 'lucide-react';
import AdminProfileImage from '/src/frontend/admin/assets/admin-profile.jpg';

import './admin_navbar.css';

const AdminNavbar = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);

  const toggleDropdown = (menu) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  const toggleProfilePopup = () => {
    setShowProfilePopup(!showProfilePopup);
  };

  const toggleNotificationPopup = () => {
    setShowNotificationPopup(!showNotificationPopup);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle clicking outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeDropdown && !event.target.closest('.adminNavbar-menu-dropdown')) {
        setActiveDropdown(null);
      }
      if (showProfilePopup && !event.target.closest('.profile-container')) {
        setShowProfilePopup(false);
      }
      if (showNotificationPopup && !event.target.closest('.notification-container')) {
        setShowNotificationPopup(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdown, showProfilePopup, showNotificationPopup]);

  const formatDateTime = (date) => {
    const options = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    };

    const time = date.toLocaleTimeString('en-US', options);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();

    return `${month}/${day}/${year} | ${time}`;
  };

  return (
    <div className="adminNavbar">
      <div className="adminNavbar-left">
        <NavLink to="/admin/dashboard" className="adminNavbar-left-item">
          <img src={Logo} alt="Smart Support Logo" className="adminNavbar-logo" />
          <h2>Smart<span>Support</span></h2>
        </NavLink>
      </div>

      <div className="adminNavbar-menu">
        <div>
          <NavLink to="/admin/dashboard" className="adminNavbar-menu-item">Dashboard</NavLink>
        </div>

        {/* Dropdown for Ticket Management */}
        <div className="adminNavbar-menu-dropdown">
          <div className="adminNavbar-menu-trigger" onClick={() => toggleDropdown('ticket-management')}>
            <NavLink to="/admin/ticket-management/all-tickets" className="adminNavbar-menu-item">Ticket Management</NavLink>
            <ChevronDown size={18} />
          </div>
          {activeDropdown === 'ticket-management' && (
            <div className="dropdown-content">
              <NavLink to="/admin/ticket-management/all-tickets">All Tickets</NavLink>
              <NavLink to="/admin/ticket-management/new-tickets">New Tickets</NavLink>
              <NavLink to="/admin/ticket-management/open-tickets">Open Tickets</NavLink>
              <NavLink to="/admin/ticket-management/on-progress-tickets">On Progress Tickets</NavLink>
              <NavLink to="/admin/ticket-management/on-hold-tickets">On Hold Tickets</NavLink>
              <NavLink to="/admin/ticket-management/pending-tickets">Pending Tickets</NavLink>
              <NavLink to="/admin/ticket-management/rejected-tickets">Rejected Tickets</NavLink>
            </div>
          )}
        </div>

        {/* Dropdown for User Access */}
        <div className="adminNavbar-menu-dropdown">
          <div className="adminNavbar-menu-trigger" onClick={() => toggleDropdown('user-access')}>
            <NavLink to="/admin/user-access/all-users" className="adminNavbar-menu-item">User Access</NavLink>
            <ChevronDown size={18} />
          </div>
          {activeDropdown === 'user-access' && (
            <div className="dropdown-content">
              <NavLink to="/admin/user-access/all-users">All Users</NavLink>
              <NavLink to="/admin/user-access/users">Users</NavLink>
              <NavLink to="/admin/user-access/ticket-agents">Ticket Agents</NavLink>
              <NavLink to="/admin/user-access/system-admins">System Admins</NavLink>
              <NavLink to="/admin/user-access/for-approvals">For Approvals</NavLink>
            </div>
          )}
        </div>

        {/* Dropdown for Reports */}
        <div className="adminNavbar-menu-dropdown">
          <div className="adminNavbar-menu-trigger" onClick={() => toggleDropdown('reports')}>
            <NavLink to="/admin/reports/agent-performance-report" className="adminNavbar-menu-item">Reports</NavLink>
            <ChevronDown size={18}/>
          </div>
          {activeDropdown === 'reports' && (
            <div className="dropdown-content">
              <NavLink to="/admin/reports/agent-performance-report">Agent Performance Report</NavLink>
              <NavLink to="/admin/reports/department-report">Department Report</NavLink>
              <NavLink to="/admin/reports/sla-compliance-report">SLA Compliance Report</NavLink>
              <NavLink to="/admin/reports/ticket-reports">Ticket Reports</NavLink>
            </div>
          )}
        </div>
      </div>

      <div className="adminNavbar-right">
        {/* Notification Bell */}
        <div className="notification-container relative">
          <Bell
            size={18}
            className="notification-bell"
            onClick={toggleNotificationPopup}
          />
          {getNotificationCount() > 0 && (
            <span className="notification-badge">{getNotificationCount()}</span>
          )}
          {showNotificationPopup && <AdminNavbarNotifications />}
        </div>

        <div className="user-info">
          <span>Admin User</span>
          <br />
          <span>{formatDateTime(currentTime)}</span>
        </div>

        {/* Profile Avatar + Popup */}
        <div className="profile-container relative">
          <img
            src={AdminProfileImage}
            alt="Admin Profile"
            className="profile-avatar"
            onClick={toggleProfilePopup}
          />
          {showProfilePopup && ( <AdminNavbarProfile /> )}
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;