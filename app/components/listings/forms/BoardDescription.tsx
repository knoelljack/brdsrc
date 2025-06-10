import FormInput from '../../ui/FormInput';
import { ListingFormProps } from '../types/listing';

interface BoardDescriptionProps extends ListingFormProps {
  mode?: 'create' | 'edit';
  rows?: number;
}

export default function BoardDescription({
  data,
  onChange,
  mode = 'edit',
  rows = 5,
}: BoardDescriptionProps) {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  const getPlaceholder = () => {
    if (mode === 'create') {
      return "Describe the surfboard's features, any damage, why you're selling, etc.";
    }
    return "Describe the surfboard's condition, history, and any notable features...";
  };

  const getHelpText = () => {
    if (mode === 'create') {
      return 'Be honest about the condition and include any relevant details buyers should know.';
    }
    return 'Provide details about dings, repairs, performance, etc.';
  };

  const getLabel = () => {
    if (mode === 'create') {
      return 'Tell us about your surfboard';
    }
    return 'Description';
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
      <FormInput
        id="description"
        label={getLabel()}
        name="description"
        type="textarea"
        value={data.description || ''}
        onChange={handleInputChange}
        placeholder={getPlaceholder()}
        helpText={getHelpText()}
        rows={rows}
        required={mode === 'create'}
      />
    </div>
  );
}
