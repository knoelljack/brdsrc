import FormInput from '../../ui/FormInput';
import { ListingFormProps, US_STATES } from '../types/listing';

interface LocationInfoProps extends ListingFormProps {
  mode?: 'create' | 'edit';
  showLocationField?: boolean;
  showCityState?: boolean;
}

export default function LocationInfo({
  data,
  onChange,
  showRequiredAsterisk = true,
  mode = 'edit',
  showLocationField = true,
  showCityState = true,
}: LocationInfoProps) {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  const selectClassName =
    'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500';

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>

      {showLocationField && mode === 'edit' && (
        <div className="mb-6">
          <FormInput
            id="location"
            label={`Location${showRequiredAsterisk ? ' *' : ''}`}
            name="location"
            type="text"
            value={data.location || ''}
            onChange={handleInputChange}
            placeholder="e.g., San Diego, CA"
            helpText="Where is the board located for pickup/viewing?"
            required
          />
        </div>
      )}

      {showCityState && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            id="city"
            label={`City${showRequiredAsterisk && mode === 'create' ? ' *' : ''}`}
            name="city"
            type="text"
            value={data.city || ''}
            onChange={handleInputChange}
            placeholder="e.g., San Diego"
            required={mode === 'create'}
          />

          <div>
            <label
              htmlFor="state"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              State{showRequiredAsterisk && mode === 'create' ? ' *' : ''}
            </label>
            <select
              id="state"
              name="state"
              value={data.state || ''}
              onChange={handleSelectChange}
              required={mode === 'create'}
              className={selectClassName}
            >
              <option value="">Select state</option>
              {US_STATES.map(state => (
                <option key={state.value} value={state.value}>
                  {state.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
