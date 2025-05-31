import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import './admin_user-access-search-and-create-user.css'; 

const UserAccessSearchAndCreateUser = () => {
  const navigate = useNavigate();

  const handleCreateUserClick = () => {
    navigate('/admin/user-access/register-user');
  };

  return (
    <div className="user-access-search-create-bar">
      <div className="search-container">
        <Search className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search"
        />
      </div>
      <button className="create-user-button" onClick={handleCreateUserClick}>
        Add New User
      </button>
    </div>
  );
};

export default UserAccessSearchAndCreateUser;
