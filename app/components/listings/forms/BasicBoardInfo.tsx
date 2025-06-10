import FormInput from '../../ui/FormInput';
import { ListingFormProps } from '../types/listing';

interface BasicBoardInfoProps extends ListingFormProps {
  showPrice?: boolean;
  pricePrefix?: string;
}

export default function BasicBoardInfo({
  data,
  onChange,
  showRequiredAsterisk = true,
  showPrice = true,
  pricePrefix = '$',
}: BasicBoardInfoProps) {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Basic Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          id="title"
          label={`Board Title${showRequiredAsterisk ? ' *' : ''}`}
          name="title"
          type="text"
          value={data.title || ''}
          onChange={handleInputChange}
          placeholder="e.g., Used 6'2 Shortboard"
          required
        />

        <FormInput
          id="brand"
          label={`Brand${showRequiredAsterisk ? ' *' : ''}`}
          name="brand"
          type="text"
          value={data.brand || ''}
          onChange={handleInputChange}
          placeholder="e.g., Lost, DHD, Firewire"
          required
        />

        <FormInput
          id="length"
          label={`Length${showRequiredAsterisk ? ' *' : ''}`}
          name="length"
          type="text"
          value={data.length || ''}
          onChange={handleInputChange}
          placeholder="e.g., 6'2"
          required
        />

        {showPrice && (
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Price (USD){showRequiredAsterisk ? ' *' : ''}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                {pricePrefix}
              </span>
              <FormInput
                id="price"
                name="price"
                type="number"
                value={data.price || ''}
                onChange={handleInputChange}
                placeholder="0"
                required
                min="1"
                className="pl-8"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
