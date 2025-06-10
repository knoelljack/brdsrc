import {
  ListingFormProps,
  LISTING_CONDITION_OPTIONS,
  LISTING_STATUS_OPTIONS,
} from '../types/listing';

interface BoardConditionStatusProps extends ListingFormProps {
  showStatus?: boolean;
  statusValue?: string;
  onStatusChange?: (name: string, value: string) => void;
}

export default function BoardConditionStatus({
  data,
  onChange,
  showRequiredAsterisk = true,
  showStatus = false,
  statusValue,
  onStatusChange,
}: BoardConditionStatusProps) {
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'status' && onStatusChange) {
      onStatusChange(name, value);
    } else {
      onChange(name, value);
    }
  };

  const selectClassName =
    'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label
          htmlFor="condition"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Condition{showRequiredAsterisk ? ' *' : ''}
        </label>
        <select
          id="condition"
          name="condition"
          value={data.condition || ''}
          onChange={handleSelectChange}
          required
          className={selectClassName}
        >
          <option value="">Select condition</option>
          {LISTING_CONDITION_OPTIONS.map(condition => (
            <option key={condition} value={condition}>
              {condition}
            </option>
          ))}
        </select>
      </div>

      {showStatus && (
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            value={statusValue || 'active'}
            onChange={handleSelectChange}
            className={selectClassName}
          >
            {LISTING_STATUS_OPTIONS.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
