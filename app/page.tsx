'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HeroSection from './components/ui/HeroSection';
import FilterBar from './components/ui/FilterBar';
import SurfboardGrid from './components/ui/SurfboardGrid';
import NearMeSection from './components/ui/NearMeSection';
import { surfboards as dummySurfboards, Surfboard } from './data/surfboards';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [lengthFilter, setLengthFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [conditionFilter, setConditionFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [displayCount, setDisplayCount] = useState(9);
  const [realSurfboards, setRealSurfboards] = useState<Surfboard[]>([]);

  const availableBoardsRef = useRef<HTMLDivElement>(null);

  // Combine dummy and real surfboards
  const allSurfboards = useMemo(() => {
    // Add offset to dummy board IDs to avoid conflicts
    const adjustedDummyBoards = dummySurfboards.map(board => ({
      ...board,
      id: (board.id as number) + 10000,
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
      }
    };

    fetchSurfboards();
  }, []);

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
        // For now, sort by location alphabetically (we could implement actual distance later)
        filtered.sort((a, b) => a.location.localeCompare(b.location));
        break;
      default: // newest
        filtered.sort((a, b) => {
          // For numeric IDs (dummy data), sort numerically
          if (typeof a.id === 'number' && typeof b.id === 'number') {
            return b.id - a.id;
          }
          // For string IDs, use string comparison
          return String(b.id).localeCompare(String(a.id));
        });
    }

    return filtered;
  }, [
    allSurfboards,
    searchTerm,
    locationFilter,
    lengthFilter,
    priceFilter,
    conditionFilter,
    sortBy,
  ]);

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
