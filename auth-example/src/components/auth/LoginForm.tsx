import React, { useState } from "react";
import {
  email,
  required,
  type ValidationRules,
} from "../../utils/formValidation";
import { useForm } from "../../hooks/useForm";
import FloatingInput from "../FloatingInput";
import StackedCards from "../StackedCards";
import { FiMail, FiLock, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

interface LoginFormProps {
  onSwitch: () => void;
}

type LoginFormData = {
  email: string;
  password: string;
  rememberMe: boolean;
};

const INITIAL_DATA: LoginFormData = {
  email: "",
  password: "",
  rememberMe: false,
};

const LOGIN_RULES: ValidationRules<LoginFormData> = {
  email: (value) =>
    required("Please enter your email address.")(value) ??
    email("Please enter a valid email address.")(value as string),
  password: required("Please enter your password."),
};

const STEP_FIELDS: (keyof LoginFormData)[][] = [["email"], ["password"], []];

export default function LoginForm({ onSwitch }: LoginFormProps) {
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {
    formData,
    setFormData,
    errors,
    handleChange,
    validateStep,
    validateAll,
  } = useForm(INITIAL_DATA, LOGIN_RULES);

  const isEmailValid =
    formData.email.length > 0 && !LOGIN_RULES.email?.(formData.email, formData);

  const handleNext = (e?: React.FormEvent) => {
    if (isLoading) return;
    if (e) e.preventDefault();

    const currentFields = STEP_FIELDS[step];
    const isStepValid =
      currentFields && currentFields.length > 0
        ? validateStep(currentFields)
        : true;

    if (isStepValid && step < 2) {
      setStep(step + 1);
    } else if (step === 2 || (isStepValid && step === 2)) {
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
    <section className="auth-container w-full relative">
      <form
        onSubmit={handleNext}
        className="auth-form w-full flex flex-col items-center"
        noValidate
      >
        <div className="form-group w-full mb-6">
          <StackedCards currentIndex={step}>
            <FloatingInput
              name="email"
              label="Email address"
              type="email"
              startIcon={<FiMail size={20} />}
              required
              isActive={step === 0}
              value={formData.email}
              onChange={handleChange}
              disabled={step !== 0}
              error={errors.email}
              onWrapperClick={() => step > 0 && setStep(0)}
              validationStatus={
                errors.email ? "mismatch" : isEmailValid ? "match" : null
              }
            />

            <FloatingInput
              name="password"
              label="Password"
              type="password"
              startIcon={<FiLock size={20} />}
              required={step >= 1}
              isActive={step === 1}
              value={formData.password}
              onChange={handleChange}
              disabled={step !== 1}
              error={errors.password}
              onWrapperClick={() => step > 1 && setStep(1)}
            />

            <div
              className="bg-white border-2 border-gray-200 rounded-xl h-full flex items-center justify-between px-5 cursor-pointer"
              onClick={() => step > 2 && setStep(2)}
            >
              <span className="text-gray-600 font-medium select-none text-sm">
                Remember me for 30 days
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFormData({
                    ...formData,
                    rememberMe: !formData.rememberMe,
                  });
                }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                  formData.rememberMe ? "bg-[#0d6efd]" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${
                    formData.rememberMe ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </StackedCards>
        </div>
        {step === 1 && (
          <p className="absolute top-[55px] my-2 text-xs right-1 underline truncate text-gray-500">
            <a href="#">Forgot Password</a>
          </p>
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
            ) : step === 2 ? (
              <>Login</>
            ) : (
              <>Continue</>
            )}
          </button>
        </div>
      </form>
      <p className="auth-footer mt-8 text-center text-sm text-gray-500">
        Don't have an account?
        <button
          type="button"
          onClick={onSwitch}
          className="ml-1 font-semibold text-[#0d6efd] transition-colors hover:text-blue-700"
        >
          Signup
        </button>
      </p>
    </section>
  );
}
