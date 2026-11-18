import { useState } from "react";
import StackedCards from "../StackedCards";
import FloatingInput from "../FloatingInput";
import {
  email,
  required,
  minLength,
  type ValidationRules,
} from "../../utils/formValidation";
import { useForm } from "../../hooks/useForm";
import { FiUser, FiMail, FiLock, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

interface SignupFormProps {
  onSwitch: () => void;
}

type SignupFormData = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
};

const INITIAL_DATA: SignupFormData = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  acceptedTerms: false,
};

const REGISTER_RULES: ValidationRules<SignupFormData> = {
  fullName: (value) =>
    required("Please enter your full name.")(value) ??
    minLength(3, "Name must be at least 3 characters.")(value as string),
  email: (value) =>
    required("Please enter your email address.")(value) ??
    email("Please enter a valid email address.")(value),
  password: required("Please enter a password."),
  confirmPassword: (value, values) => {
    if (!value) return "Please confirm your password.";
    if (value.length > values.password.length) {
      return "Your confirmation password is longer than your password.";
    }
    if (value !== values.password) return "Passwords don't match.";
    return undefined;
  },
  acceptedTerms: required(
    "Please accept the Terms of Service and Privacy Policy.",
  ),
};

export default function SignupForm({ onSwitch }: SignupFormProps) {
  const { formData, errors, handleChange, validateStep, validateAll } = useForm(
    INITIAL_DATA,
    REGISTER_RULES,
  );
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const STEP_FIELDS: (keyof SignupFormData)[][] = [
    ["fullName"],
    ["email"],
    ["password"],
    ["confirmPassword", "acceptedTerms"],
  ];

  const passwordsMatch =
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword;

  const passwordsExceeded =
    formData.confirmPassword.length > formData.password.length;

  const isNameValid =
    formData.fullName.length > 0 &&
    !REGISTER_RULES.fullName?.(formData.fullName, formData);
  const isEmailValid =
    formData.email.length > 0 &&
    !REGISTER_RULES.email?.(formData.email, formData);

  const handleNext = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isLoading) return;

    const currentFields = STEP_FIELDS[step];
    const isStepValid =
      currentFields && currentFields.length > 0
        ? validateStep(currentFields)
        : true;

    if (isStepValid && step < 3) {
      setStep(step + 1);
    } else if (step === 3 || (isStepValid && step === 3)) {
      if (validateAll()) {
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
          navigate("/home", { state: { user: formData } });
        }, 1500);
      }
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="w-full">
      <form
        className="auth-form w-full flex flex-col items-center"
        noValidate
        onSubmit={handleNext}
      >
        <div className="form-group relative w-full mb-6">
          <StackedCards currentIndex={step}>
            <FloatingInput
              name="fullName"
              label="Full name"
              type="text"
              startIcon={<FiUser size={20} />}
              autoComplete="name"
              value={formData.fullName}
              onChange={handleChange}
              error={errors.fullName}
              required
              isActive={step === 0}
              onWrapperClick={() => step > 0 && setStep(0)}
              validationStatus={
                errors.fullName ? "mismatch" : isNameValid ? "match" : null
              }
            />

            <FloatingInput
              name="email"
              label="Email address"
              type="email"
              startIcon={<FiMail size={20} />}
              autoComplete="email"
              isActive={step === 1}
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
              onWrapperClick={() => step > 1 && setStep(1)}
              validationStatus={
                errors.email ? "mismatch" : isEmailValid ? "match" : null
              }
            />

            <FloatingInput
              name="password"
              label="Password"
              type="password"
              startIcon={<FiLock size={20} />}
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              isActive={step === 2}
              highlightAgainst={formData.confirmPassword}
              error={errors.password}
              required
              onWrapperClick={() => step > 2 && setStep(2)}
            />

            <FloatingInput
              name="confirmPassword"
              label="Confirm password"
              type="password"
              startIcon={<FiLock size={20} />}
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              isActive={step === 3}
              error={errors.confirmPassword}
              validationStatus={
                passwordsMatch ? "match" : passwordsExceeded ? "mismatch" : null
              }
              required
              onWrapperClick={() => step > 3 && setStep(3)}
            />
          </StackedCards>
        </div>

        {step === 3 && (
          <div className="w-full mb-6 mt-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <label className="flex cursor-pointer select-none items-start gap-2.5">
              <input
                type="checkbox"
                name="acceptedTerms"
                checked={formData.acceptedTerms}
                onChange={handleChange}
                className="mt-0.5 size-[18px] shrink-0 cursor-pointer appearance-none rounded-[5px] border border-gray-300 bg-white transition-all duration-200 checked:border-neutral-900 checked:bg-neutral-900 checked:after:flex checked:after:items-center checked:after:justify-center checked:after:text-xs checked:after:text-white checked:after:content-['✓'] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
              />
              <span className="text-sm leading-5 text-gray-600">
                I agree to the{" "}
                <a
                  href="#"
                  className="font-medium text-[#0d6efd] transition-colors hover:text-blue-700"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="font-medium text-[#0d6efd] transition-colors hover:text-blue-700"
                >
                  Privacy Policy
                </a>
                .
              </span>
            </label>
            {errors.acceptedTerms && (
              <p className="mt-1.5 text-xs text-red-500" role="alert">
                {errors.acceptedTerms}
              </p>
            )}
          </div>
        )}

        <div className="flex w-full items-center gap-3 h-[48px] transition-all duration-300">
          {step > 0 && (
            <button
              type="button"
              onClick={handleBack}
              className="flex h-full shrink-0 w-[48px] items-center justify-center rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              aria-label="Go back"
            >
              <FiArrowLeft size={20} />
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 h-full flex items-center justify-center gap-2 rounded-xl bg-[#0d6efd] border-2 border-blue-500 px-8 text-[15px] font-medium text-white transition-transform active:scale-[0.98] hover:bg-blue-700 shadow-sm"
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : step === 3 ? (
              "Create Account"
            ) : (
              "Continue"
            )}
          </button>
        </div>
      </form>

      <p className="auth-footer mt-8 text-center text-sm text-gray-500">
        Already have an account?
        <button
          type="button"
          onClick={onSwitch}
          className="ml-1 font-semibold text-[#0d6efd] transition-colors hover:text-blue-700"
        >
          Login
        </button>
      </p>
    </div>
  );
}
