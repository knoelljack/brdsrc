interface ListingsSummaryProps {
  totalListings: number;
  activeCount: number;
  soldCount: number;
}

export default function ListingsSummary({
  totalListings,
  activeCount,
  soldCount,
}: ListingsSummaryProps) {
  return (
    <div className="mb-6">
      <p className="text-gray-600">
        {totalListings} listing{totalListings !== 1 ? 's' : ''} total •{' '}
        {activeCount} active • {soldCount} sold
      </p>
    </div>
  );
}
