import React from 'react';
import { EVENT_CATEGORIES } from '../../types';

/**
 * A reusable filter and search bar for the MSA Event Calendar.
 * 
 * Props:
 *  - selectedCategory: string | null
 *  - onCategoryChange: function(category)
 *  - searchQuery: string
 *  - onSearchChange: function(query)
 *  - onReset: function()
 */
export default function FilterBar({
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  onReset,
}) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white shadow-sm rounded-lg p-4 mb-4">
      {/* Category Filter */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => onCategoryChange(null)}
          className={`px-3 py-1.5 rounded-md border ${
            selectedCategory === null
              ? 'bg-blue-600 text-white border-blue-600'
              : 'border-gray-300 text-gray-700 hover:bg-gray-100'
          }`}
        >
          All
        </button>

        {EVENT_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`px-3 py-1.5 rounded-md border ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2 w-full md:w-1/3">
        <input
          type="text"
          placeholder="Search by title or location..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={onReset}
          className="px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
