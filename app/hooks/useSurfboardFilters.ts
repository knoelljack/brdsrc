import { useMemo } from 'react';
import { Surfboard, calculateDistance } from '../data/surfboards';

interface FilterOptions {
    searchTerm: string;
    locationFilter: string;
    lengthFilter: string;
    priceFilter: string;
    conditionFilter: string;
    sortBy: string;
    selectedCategory?: string;
    userLocation?: { lat: number; lng: number } | null;
}

interface SurfboardWithDistance extends Surfboard {
    distance?: number;
}

// Parse length from string (e.g. "9'6"" -> 9.5)
export const parseLength = (lengthStr: string): number => {
    const match = lengthStr.match(/(\d+)'(\d*)/);
    if (match) {
        const feet = parseInt(match[1]);
        const inches = match[2] ? parseInt(match[2]) : 0;
        return feet + inches / 12;
    }
    return 0;
};

// Apply search filter
const applySearchFilter = (
    boards: Surfboard[],
    searchTerm: string
): Surfboard[] => {
    if (!searchTerm.trim()) return boards;

    const searchLower = searchTerm.toLowerCase().trim();
    return boards.filter(board => {
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
};

// Apply category filter (for browse page)
const applyCategoryFilter = (
    boards: Surfboard[],
    selectedCategory: string
): Surfboard[] => {
    if (!selectedCategory) return boards;

    return boards.filter(board => {
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
};

// Apply location filter
const applyLocationFilter = (
    boards: Surfboard[],
    locationFilter: string,
    userLocation?: { lat: number; lng: number } | null
): SurfboardWithDistance[] => {
    if (!locationFilter) return boards;

    if (locationFilter === 'near-me' && userLocation) {
        // Filter boards within 50 miles of user location
        return boards
            .filter(board => board.coordinates) // Only boards with coordinates
            .map(board => ({
                ...board,
                distance: board.coordinates
                    ? calculateDistance(
                        userLocation.lat,
                        userLocation.lng,
                        board.coordinates.lat,
                        board.coordinates.lng
                    )
                    : undefined,
            }))
            .filter(board => (board.distance || 0) <= 50) // Within 50 miles
            .sort((a, b) => (a.distance || 0) - (b.distance || 0)); // Sort by distance
    }

    // Regular city/state filter
    const [city, state] = locationFilter.split(',');
    return boards.filter(board => board.city === city && board.state === state);
};

// Apply length filter
const applyLengthFilter = (
    boards: SurfboardWithDistance[],
    lengthFilter: string
): SurfboardWithDistance[] => {
    if (!lengthFilter || lengthFilter === 'All Lengths') return boards;

    return boards.filter(board => {
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
};

// Apply price filter
const applyPriceFilter = (
    boards: SurfboardWithDistance[],
    priceFilter: string
): SurfboardWithDistance[] => {
    if (!priceFilter || priceFilter === 'All Prices') return boards;

    return boards.filter(board => {
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
};

// Apply condition filter
const applyConditionFilter = (
    boards: SurfboardWithDistance[],
    conditionFilter: string
): SurfboardWithDistance[] => {
    if (!conditionFilter || conditionFilter === 'All Conditions') return boards;

    return boards.filter(board => board.condition === conditionFilter);
};

// Apply sorting
const applySorting = (
    boards: SurfboardWithDistance[],
    sortBy: string
): SurfboardWithDistance[] => {
    const sortedBoards = [...boards];

    switch (sortBy) {
        case 'price-low':
            return sortedBoards.sort((a, b) => a.price - b.price);
        case 'price-high':
            return sortedBoards.sort((a, b) => b.price - a.price);
        case 'length-short':
            return sortedBoards.sort(
                (a, b) => parseLength(a.length) - parseLength(b.length)
            );
        case 'distance':
            return sortedBoards.sort((a, b) => a.location.localeCompare(b.location));
        default: // newest
            return sortedBoards.sort((a, b) => {
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
};

export const useSurfboardFilters = (
    allSurfboards: Surfboard[],
    filters: FilterOptions
): SurfboardWithDistance[] => {
    return useMemo(() => {
        let filtered = [...allSurfboards];

        // Apply filters in sequence
        filtered = applySearchFilter(filtered, filters.searchTerm);

        if (filters.selectedCategory) {
            filtered = applyCategoryFilter(filtered, filters.selectedCategory);
        }

        const locationFiltered = applyLocationFilter(
            filtered,
            filters.locationFilter,
            filters.userLocation
        );
        const lengthFiltered = applyLengthFilter(
            locationFiltered,
            filters.lengthFilter
        );
        const priceFiltered = applyPriceFilter(lengthFiltered, filters.priceFilter);
        const conditionFiltered = applyConditionFilter(
            priceFiltered,
            filters.conditionFilter
        );
        const sorted = applySorting(conditionFiltered, filters.sortBy);

        return sorted;
    }, [
        allSurfboards,
        filters.searchTerm,
        filters.locationFilter,
        filters.lengthFilter,
        filters.priceFilter,
        filters.conditionFilter,
        filters.sortBy,
        filters.selectedCategory,
        filters.userLocation,
    ]);
};
