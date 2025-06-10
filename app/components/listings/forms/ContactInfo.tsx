import FormInput from '../../ui/FormInput';

interface ContactData {
  contactName: string;
  contactEmail: string;
  contactPhone: string;
}

interface ContactInfoProps {
  data: Partial<ContactData>;
  onChange: (name: string, value: string) => void;
  isSubmitting?: boolean;
  showRequiredAsterisk?: boolean;
}

export default function ContactInfo({
  data,
  onChange,
  showRequiredAsterisk = true,
}: ContactInfoProps) {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Contact Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <FormInput
            id="contactName"
            label={`Your Name${showRequiredAsterisk ? ' *' : ''}`}
            name="contactName"
            type="text"
            value={data.contactName || ''}
            onChange={handleInputChange}
            placeholder="John Doe"
            required
          />
        </div>

        <FormInput
          id="contactEmail"
          label={`Email${showRequiredAsterisk ? ' *' : ''}`}
          name="contactEmail"
          type="email"
          value={data.contactEmail || ''}
          onChange={handleInputChange}
          placeholder="john@example.com"
          required
        />

        <FormInput
          id="contactPhone"
          label="Phone Number (Optional)"
          name="contactPhone"
          type="tel"
          value={data.contactPhone || ''}
          onChange={handleInputChange}
          placeholder="(555) 123-4567"
        />
      </div>
    </div>
  );
}
