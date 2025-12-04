import React, { useState, useEffect } from "react";
import { UseFormRegister, UseFormSetValue, FieldErrors } from "react-hook-form";
import { AddressFormData } from "../../utils/checkoutValidation";
import { formatPhoneForDisplay } from "../../utils/checkoutValidation";

interface PhoneInputProps {
  register: UseFormRegister<AddressFormData>;
  setValue: UseFormSetValue<AddressFormData>;
  errors?: FieldErrors<AddressFormData>;
  defaultValue?: string;
  className?: string;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  register,
  setValue,
  errors,
  defaultValue = "",
  className = "",
}) => {
  const [displayValue, setDisplayValue] = useState("");

  // Initialize display value from default
  useEffect(() => {
    if (defaultValue) {
      const digits = defaultValue.replace(/\D/g, "");
      setDisplayValue(formatPhoneForDisplay(digits));
    }
  }, [defaultValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    // Extract only digits from input
    const digits = input.replace(/\D/g, "");

    // Limit to 10 digits
    const limitedDigits = digits.slice(0, 10);

    // Format for display
    const formatted = formatPhoneForDisplay(limitedDigits);
    setDisplayValue(formatted);

    // Set the raw digits value for form submission
    setValue("phoneNumber", limitedDigits, { shouldValidate: true });
  };

  // Register the field but we'll handle value manually
  const { ref, name } = register("phoneNumber");

  return (
    <div className="w-full">
      <div className="relative">
        {/* Static +1 prefix */}
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-900 font-medium select-none">
          +1
        </span>
        <input
          type="tel"
          ref={ref}
          name={name}
          value={displayValue}
          onChange={handleChange}
          placeholder="(555) 123-4567"
          className={`w-full pl-12 pr-4 py-2 rounded-lg bg-white/20 border border-white/30 text-emerald-900 placeholder-emerald-700/50 ${className}`}
          autoComplete="tel-national"
        />
      </div>
      {errors?.phoneNumber && (
        <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>
      )}
    </div>
  );
};

export default PhoneInput;