import { useState, useRef, useEffect } from "react";
import {
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiXCircle,
} from "react-icons/fi";
import type { InputHTMLAttributes, ReactNode } from "react";

interface FloatingInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  showPasswordToggle?: boolean;
  startIcon?: ReactNode;
  highlightAgainst?: string;
  validationStatus?: "match" | "mismatch" | null;
  wrapperClassName?: string;
  onWrapperClick?: () => void;
  error?: string;
  isActive: boolean,
}

function FloatingInput({
  label,
  type = "text",
  name,
  required = false,
  showPasswordToggle = true,
  startIcon = "",
  highlightAgainst,
  validationStatus,
  wrapperClassName = "",
  onWrapperClick,
  error,
  isActive,
  ...inputProps
}: FloatingInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;
  const value = String(inputProps.value ?? "");
  const inputRef = useRef<HTMLInputElement>(null)

  const showHighlights =
    isPassword &&
    highlightAgainst !== undefined &&
    !showPassword &&
    value.length > 0 &&
    highlightAgainst.length > 0;

    useEffect(() => {
      if(isActive && inputRef.current) {
        const timer = setTimeout(() => inputRef.current?.focus(), 300)
        return () => clearTimeout(timer)
      }
    }, [isActive])

  return (
    <div
      className={`relative w-full h-full rounded-xl border-2 bg-white transition-colors flex items-center border-gray-200 ${
        error 
          ? "border-red-500 focus-within:border-red-600" 
          : "border-gray-200 focus-within:border-blue-500"
      } ${wrapperClassName}`}
      onClick={onWrapperClick}
    >
      {startIcon && (
        <div className="flex h-full items-center justify-center pl-4 pr-3 text-gray-400">
          {startIcon}
        </div>
      )}

      {startIcon && (
        <div className="h-6 w-[1px] bg-gray-200" />
      )}
      <div className="relative flex-1 h-full">
        <input
          {...inputProps}
          id={name}
          name={name}
          type={inputType}
          ref={inputRef}
          placeholder=""
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${name}-error` : undefined}
          className={`peer h-full w-full bg-transparent pl-3 pr-2 pt-[18px] pb-1 text-[15px] font-medium text-gray-900 outline-none focus:outline-none focus:ring-0 border-none ${
            showHighlights ? "text-transparent caret-neutral-900" : ""
          }`}
        />

        {showHighlights && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-[26px] whitespace-nowrap text-lg leading-none"
          >
            {value.split("").map((character, index) => {
              const isCompared = index < highlightAgainst.length;
              const matches = character === highlightAgainst[index];
              const isLastComparedCharacter =
                index === value.length - 1 &&
                value.length === highlightAgainst.length;

              return (
                <span
                  key={index}
                  className={
                    isCompared
                      ? `${matches ? "bg-green-200" : "bg-red-200"} ${
                          index === 0 ? "rounded-l-md" : ""
                        } ${isLastComparedCharacter ? "rounded-r-md" : ""}`
                      : ""
                  }
                >
                  •
                </span>
              );
            })}
          </div>
        )}

        <label
          htmlFor={name}
          className="pointer-events-none absolute left-3 top-1.5 max-w-[calc(100%-12px)] truncate text-[10px] font-bold tracking-wider text-gray-400 transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-focus:top-1.5 peer-focus:-translate-y-0 peer-focus:text-[10px] peer-focus:font-bold"
        >
          {label}
        </label>
      </div>

      <div className="flex h-full items-center gap-2 pr-4">
        {validationStatus && (
          <span>
            {validationStatus === "match" ? (
              <FiCheckCircle className="text-emerald-500" size={18} />
            ) : (
              <FiXCircle className="text-red-500" size={18} />
            )}
          </span>
        )}

        {isPassword && showPasswordToggle && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowPassword((current) => !current);
            }}
            className="text-gray-400 transition-colors hover:text-gray-800"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FiEye size={18} /> : <FiEyeOff size={18} />}
          </button>
        )}
      </div>

      {error && (
        <p id={`${name}-error`} className="absolute -bottom-5 left-1 text-[11px] text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default FloatingInput;