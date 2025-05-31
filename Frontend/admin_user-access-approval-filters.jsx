import { useState, useEffect } from 'react';
import { ChevronDown, ArrowUp, ArrowDown } from 'lucide-react';
import './admin_user-access-approval-filters.css';
import DateFilter from '../../components/shared/date-filter.jsx';

const SORT_OPTIONS = {
  companyId: 'Company ID',
  lastName: 'Last Name',
  firstName: 'First Name',
  middleName: 'Middle Name',
  dateCreated: 'Date Created',
};

const ApprovalsFilters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    department: '',
    role: '',
    status: 'Pending',
    date: '',
  });

  const [sortBy, setSortBy] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showDateFilter, setShowDateFilter] = useState(false);

  useEffect(() => {
    onFilterChange?.({ ...filters, sortBy, sortDirection });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...filters, [name]: value, status: 'Pending' };
    setFilters(updated);
    onFilterChange?.({ ...updated, sortBy, sortDirection });
  };

  const toggleSortDirection = () => {
    const newDir = sortDirection === 'asc' ? 'desc' : 'asc';
    setSortDirection(newDir);
    onFilterChange?.({ ...filters, sortBy, sortDirection: newDir });
  };

  const handleSortSelect = (value) => {
    setSortBy(value);
    setShowSortMenu(false);
    onFilterChange?.({ ...filters, sortBy: value, sortDirection });
  };

  return (
    <div className="user-access-approval-toolbar">
      {/* Filters */}
      <div className="user-access-approval-filter-section">
        <span className="user-access-approval-filter-label">Filter by:</span>

        {/* Department */}
        <div className="user-access-approval-filter-dropdown">
          <select
            name="department"
            value={filters.department}
            onChange={handleChange}
            className="user-access-approval-filter-select"
          >
            <option value="">Department</option>
            <option value="Finance Department">Finance Department</option>
            <option value="Human Resources">Human Resources</option>
            <option value="IT Department">IT Department</option>
            <option value="Technical Support">Technical Support</option>
            <option value="Customer Service">Customer Service</option>
            <option value="Operations">Operations</option>
          </select>
          <ChevronDown className="user-access-approval-filter-dropdown-icon" size={16} />
        </div>

        {/* Role */}
        <div className="user-access-approval-filter-dropdown">
          <select
            name="role"
            value={filters.role}
            onChange={handleChange}
            className="user-access-approval-filter-select"
          >
            <option value="">Role</option>
            <option value="User">User</option>
            <option value="Ticket Agent">Ticket Agent</option>
            <option value="System Admin">System Admin</option>
          </select>
          <ChevronDown className="user-access-approval-filter-dropdown-icon" size={16} />
        </div>

        {/* Date */}
        <div className="user-access-approval-filter-dropdown date-filter-wrapper">
          <button
            onClick={() => setShowDateFilter((prev) => !prev)}
            className="user-access-date-filter-button"
          >
            <span>Date</span>
            <ChevronDown size={16} />
          </button>
          {showDateFilter && (
            <DateFilter
              value={filters.date}
              onChange={(value) => {
                const updated = { ...filters, date: value, status: 'Pending' };
                setFilters(updated);
                onFilterChange?.({ ...updated, sortBy, sortDirection });
              }}
            />
          )}
        </div>
      </div>

      {/* Sort */}
      <div className="user-access-approval-sort-section">
        <span className="user-access-approval-sort-label">Sort by:</span>
        <div className="user-access-approval-sort-dropdown">
          <button
            className="user-access-approval-custom-select-button"
            onClick={() => setShowSortMenu((prev) => !prev)}
          >
            <span>
              {sortBy ? SORT_OPTIONS[sortBy] : 'Select'}
              {sortBy && (
                <span
                  className="user-access-approval-sort-arrow-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSortDirection();
                  }}
                >
                  {sortDirection === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                </span>
              )}
            </span>
            <ChevronDown size={16} />
          </button>

          {showSortMenu && (
            <ul className="user-access-approval-custom-dropdown-menu">
              {Object.entries(SORT_OPTIONS).map(([key, label]) => (
                <li key={key} onClick={() => handleSortSelect(key)}>
                  {label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApprovalsFilters;
