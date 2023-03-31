import React from "react";

interface ICustomInputPropType {
  label: string;
  name: string;
  errorText: string;
  type: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  onFocus?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomInput: React.FC<ICustomInputPropType> = ({
  label,
  name,
  errorText,
  type,
  onChange,
  value,
  onFocus,
  onBlur,
}) => (
  <>
    <p>{label}</p>
    <input
      className="border border-black focus:outline-none rounded-sm"
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
    />
    <p className="text-red-500 text-left text-sm">{errorText}</p>
  </>
);

export default CustomInput;
