import './admin_dashboard.css'; // Import the CSS file for styling
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const AdminDashboard = () => {
  const navigate = useNavigate();
  // Sample data for approval requests
  const approvalRequests = [
    { id: '14086', subject: 'Printer not working', department: 'IT Department', category: 'Hardware', subCategory: 'Printer Issue' },
    { id: '14083', subject: 'Unable to connect to Wi-Fi', department: 'Operations', category: 'Network', subCategory: 'Wi-Fi' },
    { id: '14081', subject: 'Request for additional RAM', department: 'Finance & Budgeting', category: 'Hardware Upgrade', subCategory: 'Memory' },
    { id: '14076', subject: 'Incorrect budget report in system', department: 'Finance & Budgeting', category: 'Software', subCategory: 'Reporting' },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome <span className="user-name">Bogart</span>,</h1>
      </div>

      <div className="ticket-status-cards">
        <div className="status-card">
          <h2>00</h2>
          <p className="open">Open</p>
        </div>
        <div className="status-card">
          <h2>00</h2>
          <p className="on-process">On Process</p>
        </div>
        <div className="status-card">
          <h2>00</h2>
          <p className="pending">Pending</p>
        </div>
        <div className="status-card">
          <h2>00</h2>
          <p className="resolved">Resolved</p>
        </div>
        <div className="status-card blue">
          <h2>00</h2>
          <p>Total Tickets</p>
        </div>
      </div>

      <div className="approval-section">
        <div className="approval-header">
          
          <h2>Approval Requests</h2>
          <button className="manage-button" onClick={() => navigate('/admin/ticket-management-all-tickets')}>Manage Approvals</button>
        </div>

        <div className="approval-table-container">
          <table className="approval-table">
            <thead>
              <tr>
                <th>Ticket Number</th>
                <th>Subject</th>
                <th>Department</th>
                <th>Category</th>
                <th>Sub Category</th>
              </tr>
            </thead>
            <tbody>
              {approvalRequests.map((request) => (
                <tr key={request.id}>
                  <td>{request.id}</td>
                  <td>{request.subject}</td>
                  <td>{request.department}</td>
                  <td>{request.category}</td>
                  <td>{request.subCategory}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-card">
          <h3>Tickets per Category</h3>
          <div className="donut-chart">
            {/* Placeholder for donut chart */}
            <div className="donut-placeholder"></div>
          </div>
        </div>
        <div className="chart-card">
          <h3>Tickets per Priority Level</h3>
          <div className="bar-chart">
            {/* Placeholder for bar chart */}
            <div className="bar-placeholder"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
