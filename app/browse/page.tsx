'use client';

import Link from 'next/link';
import { useState } from 'react';
import Footer from '../components/layout/Footer';
import Header from '../components/layout/Header';
import FilterBar from '../components/ui/FilterBar';
import LocationFeedback from '../components/ui/LocationFeedback';
import SurfboardGrid from '../components/ui/SurfboardGrid';
import { useGeolocation } from '../hooks/useGeolocation';
import { useSurfboardFilters } from '../hooks/useSurfboardFilters';
import { useSurfboards } from '../hooks/useSurfboards';
import { getBoardCategories } from '../utils/boardCategories';
import { isBoardNew } from '../utils/dateUtils';

export default function Browse() {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [lengthFilter, setLengthFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [conditionFilter, setConditionFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Use custom hooks
  const { allSurfboards, isLoading } = useSurfboards();
  const {
    userLocation,
    locationError,
    isLoading: locationLoading,
  } = useGeolocation(locationFilter === 'near-me');

  // Get categories based on board lengths
  const categories = getBoardCategories(allSurfboards);

  // Apply filters
  const filteredBoards = useSurfboardFilters(allSurfboards, {
    searchTerm,
    locationFilter,
    lengthFilter,
    priceFilter,
    conditionFilter,
    sortBy,
    selectedCategory,
    userLocation,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Browse Surfboards
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover quality surfboards from surfers worldwide. Filter by
              location, size, price, and more.
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search surfboards, brands, locations..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
            />
            <button
              onClick={() => setSearchTerm('')}
              className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium cursor-pointer"
            >
              {searchTerm ? 'Clear' : 'Search'}
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Categories & View Options */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Categories
              </h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors cursor-pointer ${
                      selectedCategory === category.id
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span>{category.name}</span>
                    <span className="text-xs opacity-75">
                      ({category.count})
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* View Mode Toggle - Hidden on mobile */}
            <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">View</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                    viewMode === 'list'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  List
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <FilterBar
              locationFilter={locationFilter}
              lengthFilter={lengthFilter}
              priceFilter={priceFilter}
              conditionFilter={conditionFilter}
              sortBy={sortBy}
              onLocationChange={setLocationFilter}
              onLengthChange={setLengthFilter}
              onPriceChange={setPriceFilter}
              onConditionChange={setConditionFilter}
              onSortChange={setSortBy}
              totalCount={filteredBoards.length}
              searchTerm={searchTerm}
              allSurfboards={allSurfboards}
            />

            <LocationFeedback
              locationFilter={locationFilter}
              userLocation={userLocation}
              locationError={locationError}
              isLoading={locationLoading}
            />

            {/* Results */}
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading surfboards...</p>
              </div>
            ) : (
              <>
                {/* Mobile always shows grid view */}
                <div className="lg:hidden">
                  <SurfboardGrid boards={filteredBoards} />
                </div>

                {/* Desktop shows selected view mode */}
                <div className="hidden lg:block">
                  {viewMode === 'grid' ? (
                    <SurfboardGrid boards={filteredBoards} />
                  ) : (
                    <div className="space-y-4">
                      {filteredBoards.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <svg
                              className="w-8 h-8 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                              />
                            </svg>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            No surfboards found
                          </h3>
                          <p className="text-gray-600">
                            Try adjusting your filters to see more results.
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="mb-6">
                            <p className="text-sm text-gray-600">
                              Showing {filteredBoards.length} surfboard
                              {filteredBoards.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                          {filteredBoards.map(board => (
                            <div
                              key={board.id}
                              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                            >
                              <div className="flex flex-col sm:flex-row gap-6">
                                {/* Image placeholder */}
                                <div className="sm:w-48 h-32 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <svg
                                    className="w-12 h-12 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={1}
                                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                  </svg>
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                  <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                      <h3 className="text-xl font-semibold text-gray-900">
                                        {board.title}
                                      </h3>
                                      {isBoardNew(board.createdAt) && (
                                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                          New
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-2xl font-bold text-gray-900">
                                      ${board.price}
                                    </span>
                                  </div>

                                  <p className="text-gray-600 mb-2">
                                    {board.brand} • {board.length} •{' '}
                                    {board.condition}
                                  </p>

                                  <p className="text-sm text-gray-500 mb-3">
                                    📍 {board.city}, {board.state}
                                  </p>

                                  <p className="text-gray-700 mb-4">
                                    {board.description}
                                  </p>

                                  <Link
                                    href={`/boards/${board.id}`}
                                    className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium inline-block cursor-pointer"
                                  >
                                    View Details
                                  </Link>
                                </div>
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
