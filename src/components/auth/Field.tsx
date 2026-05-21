interface FieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  defaultValue?: string;
}

export function Field({
  label,
  name,
  type = "text",
  placeholder,
  required = true,
  autoComplete,
  defaultValue,
}: FieldProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-escuro">
        {label}
      </span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        className="w-full rounded border border-black/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-azul"
      />
    </label>
  );
}
