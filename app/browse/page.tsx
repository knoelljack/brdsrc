'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import Footer from '../components/layout/Footer';
import Header from '../components/layout/Header';
import FilterBar from '../components/ui/FilterBar';
import SurfboardGrid from '../components/ui/SurfboardGrid';
import { surfboards as dummySurfboards, Surfboard } from '../data/surfboards';
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
  const [realSurfboards, setRealSurfboards] = useState<Surfboard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Combine dummy and real surfboards
  const allSurfboards = useMemo(() => {
    // For now, we'll show dummy data with higher IDs to avoid conflicts
    const adjustedDummyBoards = dummySurfboards.map(board => ({
      ...board,
      id: (board.id as number) + 10000, // Add offset to avoid ID conflicts
    }));

    return [...realSurfboards, ...adjustedDummyBoards];
  }, [realSurfboards]);

  // Fetch real surfboards from API
  useEffect(() => {
    const fetchSurfboards = async () => {
      try {
        const response = await fetch('/api/surfboards/browse');
        if (response.ok) {
          const data = await response.json();
          setRealSurfboards(data.surfboards);
        } else {
          console.error('Failed to fetch surfboards');
        }
      } catch (error) {
        console.error('Error fetching surfboards:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSurfboards();
  }, []);

  // Parse length from string (e.g. "9'6"" -> 9.5)
  const parseLength = (lengthStr: string): number => {
    const match = lengthStr.match(/(\d+)'(\d*)/);
    if (match) {
      const feet = parseInt(match[1]);
      const inches = match[2] ? parseInt(match[2]) : 0;
      return feet + inches / 12;
    }
    return 0;
  };

  // Get categories based on board lengths
  const categories = [
    { id: '', name: 'All Boards', count: allSurfboards.length },
    {
      id: 'longboards',
      name: "Longboards (9'+)",
      count: allSurfboards.filter((b: Surfboard) => parseLength(b.length) >= 9)
        .length,
    },
    {
      id: 'midlength',
      name: "Mid-length (7'-9')",
      count: allSurfboards.filter((b: Surfboard) => {
        const l = parseLength(b.length);
        return l >= 7 && l < 9;
      }).length,
    },
    {
      id: 'shortboards',
      name: "Shortboards (Under 7')",
      count: allSurfboards.filter((b: Surfboard) => parseLength(b.length) < 7)
        .length,
    },
  ];

  // Filter and sort surfboards
  const filteredBoards = useMemo(() => {
    let filtered = [...allSurfboards];

    // Search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(board => {
        return (
          board.title.toLowerCase().includes(searchLower) ||
          board.brand.toLowerCase().includes(searchLower) ||
          board.location.toLowerCase().includes(searchLower) ||
          board.city.toLowerCase().includes(searchLower) ||
          board.state.toLowerCase().includes(searchLower) ||
          board.description.toLowerCase().includes(searchLower) ||
          board.condition.toLowerCase().includes(searchLower) ||
          board.length.toLowerCase().includes(searchLower)
        );
      });
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(board => {
        const boardLength = parseLength(board.length);
        switch (selectedCategory) {
          case 'longboards':
            return boardLength >= 9;
          case 'midlength':
            return boardLength >= 7 && boardLength < 9;
          case 'shortboards':
            return boardLength < 7;
          default:
            return true;
        }
      });
    }

    // Location filter
    if (locationFilter && locationFilter !== 'near-me') {
      filtered = filtered.filter(board => {
        const [city, state] = locationFilter.split(',');
        return board.city === city && board.state === state;
      });
    }

    // Length filter
    if (lengthFilter && lengthFilter !== 'All Lengths') {
      filtered = filtered.filter(board => {
        const boardLength = parseLength(board.length);
        switch (lengthFilter) {
          case "Under 7'":
            return boardLength < 7;
          case "7' - 9'":
            return boardLength >= 7 && boardLength < 9;
          case "Over 9'":
            return boardLength >= 9;
          default:
            return true;
        }
      });
    }

    // Price filter
    if (priceFilter && priceFilter !== 'All Prices') {
      filtered = filtered.filter(board => {
        switch (priceFilter) {
          case 'Under $400':
            return board.price < 400;
          case '$400 - $600':
            return board.price >= 400 && board.price <= 600;
          case 'Over $600':
            return board.price > 600;
          default:
            return true;
        }
      });
    }

    // Condition filter
    if (conditionFilter && conditionFilter !== 'All Conditions') {
      filtered = filtered.filter(board => board.condition === conditionFilter);
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'length-short':
        filtered.sort((a, b) => parseLength(a.length) - parseLength(b.length));
        break;
      case 'distance':
        filtered.sort((a, b) => a.location.localeCompare(b.location));
        break;
      default: // newest
        filtered.sort((a, b) => {
          // For newest sorting, use createdAt if available, otherwise fall back to ID comparison
          if (a.createdAt && b.createdAt) {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          }
          // Fallback to ID comparison for dummy data (numbers)
          if (typeof a.id === 'number' && typeof b.id === 'number') {
            return b.id - a.id;
          }
          // For string IDs, use string comparison (newest first)
          return String(b.id).localeCompare(String(a.id));
        });
    }

    return filtered;
  }, [
    allSurfboards,
    searchTerm,
    selectedCategory,
    locationFilter,
    lengthFilter,
    priceFilter,
    conditionFilter,
    sortBy,
  ]);

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
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors cursor-pointer ${selectedCategory === category.id
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
                  className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${viewMode === 'grid'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${viewMode === 'list'
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
                                    {board.brand} • {board.length} • {board.condition}
                                  </p>

                                  <p className="text-sm text-gray-500 mb-3">
                                    📍 {board.location}
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
