interface LocationFeedbackProps {
    locationFilter: string;
    userLocation: { lat: number; lng: number } | null;
    locationError: string | null;
    isLoading: boolean;
}

export default function LocationFeedback({
    locationFilter,
    userLocation,
    locationError,
    isLoading,
}: LocationFeedbackProps) {
    if (locationFilter !== 'near-me') return null;

    if (isLoading || (!userLocation && !locationError)) {
        return (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
                    <p className="text-blue-800">
                        Requesting your location to show nearby surfboards...
                    </p>
                </div>
            </div>
        );
    }

    if (locationError) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800">{locationError}</p>
            </div>
        );
    }

    return null;
}
