import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './table-pagination.css';

const TablePagination = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Changed default to 10

  const totalItems = 1340;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (e) => {
    const value = parseInt(e.target.value) || 10; // Also update fallback default here
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const renderPageNumbers = () => {
    if (totalPages <= 20) {
      const pages = [];
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`page-btn ${currentPage === i ? 'active' : ''}`}
          >
            {i}
          </button>
        );
      }
      return pages;
    }

    return (
      <span className="page-jump">
        Page&nbsp;
        <input
          type="text"
          min="1"
          max={totalPages}
          value={currentPage}
          onChange={(e) => handlePageChange(Number(e.target.value))}
        />
        &nbsp;of {totalPages}
      </span>
    );
  };

  return (
    <div className="table-controls-row">
      <div className="items-per-page">
        <label htmlFor="itemsPerPageInput">Show </label>
        <input
          type="text"
          id="itemsPerPageInput"
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          min="1"
          max="100"
        />
        <span> items per page</span>
      </div>

      <div className="pagination-wrapper">
        <div className="pagination-controls">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="nav-btn"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="page-numbers">{renderPageNumbers()}</div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="nav-btn"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="pagination-spacer" />
    </div>
  );
};

export default TablePagination;
