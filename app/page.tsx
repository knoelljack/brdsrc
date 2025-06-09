'use client';

import { useState, useMemo } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HeroSection from './components/ui/HeroSection';
import FilterBar from './components/ui/FilterBar';
import SurfboardGrid from './components/ui/SurfboardGrid';
import NearMeSection from './components/ui/NearMeSection';
import { surfboards } from './data/surfboards';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [lengthFilter, setLengthFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');

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
    let filtered = [...surfboards];

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
          case "Under 6'":
            return boardLength < 6;
          case "6' - 7'":
            return boardLength >= 6 && boardLength < 7;
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
        filtered.sort((a, b) => b.id - a.id); // Assuming higher ID = newer
    }

    return filtered;
  }, [searchTerm, locationFilter, lengthFilter, priceFilter, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />
      <HeroSection searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <NearMeSection />
        <div>
          <FilterBar
            locationFilter={locationFilter}
            lengthFilter={lengthFilter}
            priceFilter={priceFilter}
            sortBy={sortBy}
            onLocationChange={setLocationFilter}
            onLengthChange={setLengthFilter}
            onPriceChange={setPriceFilter}
            onSortChange={setSortBy}
            totalCount={filteredBoards.length}
            searchTerm={searchTerm}
          />
          <SurfboardGrid boards={filteredBoards} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
