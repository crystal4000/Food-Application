import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { AddressFormData } from "../../utils/checkoutValidation";

interface FullNameInputProps {
  register: UseFormRegister<AddressFormData>;
  errors?: FieldErrors<AddressFormData>;
  className?: string;
  placeholder?: string;
}

const FullNameInput: React.FC<FullNameInputProps> = ({
  register,
  errors,
  className = "",
  placeholder = "Full Name",
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter, space
    const allowedKeys = [
      "Backspace",
      "Delete",
      "Tab",
      "Escape",
      "Enter",
      " ",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Home",
      "End",
      "-",
      "'",
    ];

    if (allowedKeys.includes(e.key)) {
      return;
    }

    // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    if (e.ctrlKey || e.metaKey) {
      return;
    }

    // Block if not a letter
    if (!/^[a-zA-Z]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData("text");
    // Only allow paste if it contains valid characters
    if (!/^[a-zA-Z\s'-]+$/.test(pastedText)) {
      e.preventDefault();
    }
  };

  return (
    <div className="w-full">
      <input
        type="text"
        {...register("fullName")}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        placeholder={placeholder}
        autoComplete="name"
        className={`w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-emerald-900 placeholder-emerald-700/50 ${className}`}
      />
      {errors?.fullName && (
        <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
      )}
    </div>
  );
};

export default FullNameInput;