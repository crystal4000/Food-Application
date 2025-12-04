import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { AddressFormData } from "../../utils/checkoutValidation";
import { US_STATES } from "../../utils/usStates";

interface StateSelectProps {
  register: UseFormRegister<AddressFormData>;
  errors?: FieldErrors<AddressFormData>;
  className?: string;
}

const StateSelect: React.FC<StateSelectProps> = ({
  register,
  errors,
  className = "",
}) => {
  return (
    <div className="w-full">
      <select
        {...register("state")}
        className={`w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-emerald-900 placeholder-emerald-700/50 appearance-none cursor-pointer ${className}`}
        defaultValue=""
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23064e3b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 0.75rem center",
          backgroundSize: "1rem",
        }}
      >
        <option value="" disabled className="text-emerald-700">
          Select State
        </option>
        {US_STATES.map((state) => (
          <option
            key={state.code}
            value={state.code}
            className="bg-white text-emerald-900"
          >
            {state.name}
          </option>
        ))}
      </select>
      {errors?.state && (
        <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
      )}
    </div>
  );
};

export default StateSelect;