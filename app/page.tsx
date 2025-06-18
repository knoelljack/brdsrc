'use client';

import { useRef, useState } from 'react';
import Footer from './components/layout/Footer';
import Header from './components/layout/Header';
import FilterBar from './components/ui/FilterBar';
import HeroSection from './components/ui/HeroSection';
import LocationFeedback from './components/ui/LocationFeedback';
import NearMeSection from './components/ui/NearMeSection';
import SurfboardGrid from './components/ui/SurfboardGrid';
import { useGeolocation } from './hooks/useGeolocation';
import { useSurfboardFilters } from './hooks/useSurfboardFilters';
import { useSurfboards } from './hooks/useSurfboards';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [lengthFilter, setLengthFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [conditionFilter, setConditionFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [displayCount, setDisplayCount] = useState(9);

  const availableBoardsRef = useRef<HTMLDivElement>(null);

  // Use custom hooks
  const { allSurfboards } = useSurfboards();
  const {
    userLocation,
    locationError,
    isLoading: locationLoading,
  } = useGeolocation(locationFilter === 'near-me');

  // Apply filters
  const filteredBoards = useSurfboardFilters(allSurfboards, {
    searchTerm,
    locationFilter,
    lengthFilter,
    priceFilter,
    conditionFilter,
    sortBy,
    userLocation,
  });

  // Handle text input change (no scroll)
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    resetDisplayCount();
  };

  // Handle search action with scroll (Enter or Search button)
  const handleSearch = () => {
    if (searchTerm.trim() && availableBoardsRef.current) {
      availableBoardsRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  // Get boards to display (limited by displayCount)
  const displayedBoards = filteredBoards.slice(0, displayCount);
  const hasMoreBoards = filteredBoards.length > displayCount;

  // Load more boards
  const loadMoreBoards = () => {
    setDisplayCount(prev => prev + 9);
  };

  // Reset display count when filters change
  const resetDisplayCount = () => {
    setDisplayCount(9);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />
      <HeroSection
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onSearch={handleSearch}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <NearMeSection />
        <div ref={availableBoardsRef}>
          <FilterBar
            locationFilter={locationFilter}
            lengthFilter={lengthFilter}
            priceFilter={priceFilter}
            conditionFilter={conditionFilter}
            sortBy={sortBy}
            onLocationChange={value => {
              setLocationFilter(value);
              resetDisplayCount();
            }}
            onLengthChange={value => {
              setLengthFilter(value);
              resetDisplayCount();
            }}
            onPriceChange={value => {
              setPriceFilter(value);
              resetDisplayCount();
            }}
            onConditionChange={value => {
              setConditionFilter(value);
              resetDisplayCount();
            }}
            onSortChange={value => {
              setSortBy(value);
              resetDisplayCount();
            }}
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

          <SurfboardGrid boards={displayedBoards} />
          {hasMoreBoards && (
            <div className="text-center mt-8">
              <button
                onClick={loadMoreBoards}
                className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Load More Boards ({filteredBoards.length - displayCount}{' '}
                remaining)
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
