import React from 'react';
import { EVENT_CATEGORIES } from '../../types';
import { Search, X, Filter } from 'lucide-react';

export default function FilterBar({
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  onReset,
}) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Category Filter */}
      <div className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
        <div className="flex items-center gap-2 min-w-max">
          <div className="hidden md:flex items-center gap-2 text-gray-500 mr-2">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filters:</span>
          </div>

          <button
            onClick={() => onCategoryChange(null)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${selectedCategory === null
              ? 'bg-gray-900 text-white shadow-md scale-105'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
              }`}
          >
            All
          </button>

          {EVENT_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${selectedCategory === cat
                ? 'bg-green-600 text-white shadow-md shadow-green-200 scale-105'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative w-full md:w-72 group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400 group-focus-within:text-green-600 transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="block w-full pl-10 pr-10 py-2 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 sm:text-sm"
        />
        {searchQuery && (
          <button
            onClick={onReset}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
          </button>
        )}
      </div>
    </div>
  );
}
