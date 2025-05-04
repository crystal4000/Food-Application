import React from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  itemsPerPageOptions?: number[];
  showItemsPerPage?: boolean;
  showResultsInfo?: boolean;
  containerClassName?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems = 0,
  itemsPerPage = 8,
  onItemsPerPageChange,
  itemsPerPageOptions = [4, 8, 12, 16],
  showItemsPerPage = true,
  showResultsInfo = true,
  containerClassName = "",
}) => {
  // Calculate the range of items being displayed
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage + 1;
  const indexOfLastItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Handle previous/next page navigation
  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Show at most 5 page numbers

    if (totalPages <= maxPagesToShow) {
      // If total pages are less than max pages to show, display all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);

      // Calculate start and end of middle pages
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if at the beginning or end
      if (currentPage <= 2) {
        endPage = 3;
      } else if (currentPage >= totalPages - 1) {
        startPage = totalPages - 2;
      }

      // Add ellipsis if needed
      if (startPage > 2) {
        pageNumbers.push("...");
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push("...");
      }

      // Always show last page
      if (totalPages > 1) {
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  // Handle change in items per page
  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (onItemsPerPageChange) {
      onItemsPerPageChange(Number(e.target.value));
    }
  };

  // Don't render if there's only 1 page
  if (totalPages <= 1 && !showResultsInfo && !showItemsPerPage) {
    return null;
  }

  return (
    <div className={`${containerClassName}`}>
      {/* Results Info and Items Per Page */}
      {(showResultsInfo || showItemsPerPage) && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          {showResultsInfo && totalItems > 0 && (
            <div className="text-emerald-900 mb-2 sm:mb-0">
              Showing {indexOfFirstItem}-{indexOfLastItem} of {totalItems}{" "}
              results
            </div>
          )}

          {showItemsPerPage && onItemsPerPageChange && (
            <div className="flex items-center">
              <label htmlFor="itemsPerPage" className="text-emerald-900 mr-2">
                Items per page:
              </label>
              <select
                id="itemsPerPage"
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="p-2 rounded-lg bg-white/50 backdrop-blur-sm border border-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                {itemsPerPageOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 space-x-2">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`p-2 rounded-md flex items-center justify-center ${
              currentPage === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-emerald-500/80 text-white hover:bg-emerald-600/80"
            }`}
            aria-label="Previous page"
          >
            <HiChevronLeft className="w-5 h-5" />
          </button>

          {getPageNumbers().map((page, index) =>
            typeof page === "number" ? (
              <button
                key={index}
                onClick={() => onPageChange(page)}
                className={`w-10 h-10 rounded-md flex items-center justify-center ${
                  currentPage === page
                    ? "bg-emerald-500 text-white"
                    : "bg-white/50 text-emerald-900 hover:bg-white/70"
                }`}
                aria-label={`Page ${page}`}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </button>
            ) : (
              <span key={index} className="text-emerald-900" aria-hidden="true">
                {page}
              </span>
            )
          )}

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-md flex items-center justify-center ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-emerald-500/80 text-white hover:bg-emerald-600/80"
            }`}
            aria-label="Next page"
          >
            <HiChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Pagination;
