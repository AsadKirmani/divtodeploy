import { useLayoutEffect, useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import LoginForm from "../../components/auth/LoginForm";
import SignupForm from "../../components/auth/SignupForm";
import { AuthDivider } from "../../components/auth/AuthDivider";
import SocialLogin from "../../components/SocialAuth";

type AuthMode = "login" | "signup";

function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialMode: AuthMode = location.pathname === "/signp" ? "signup" : "login";
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const formRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentMode = location.pathname === "/signup" ? "signup" : "login";
    if (mode !== currentMode) {
      setMode(currentMode);
    }
  }, [location.pathname]);

  useLayoutEffect(() => {
    const indicator = indicatorRef.current;
    if (!indicator) return;

    const moveIndicator = gsap.quickTo(indicator, "xPercent", {
      duration: 0.55,
      ease: "power3.inOut",
    });

    moveIndicator(mode === "signup" ? 100 : 0);

    return () => {
      gsap.killTweensOf(indicator);
    };
  }, [mode]);
  useLayoutEffect(() => {
    const container = formRef.current;
    if (!container) return;

    const context = gsap.context(() => {
      const animatedElements = document.querySelectorAll(
        ".auth-heading, .auth-form, .auth-divider, .social-auth" 
      );

      gsap.fromTo(
        animatedElements,
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          clearProps: "all",
        }
      );
    }, container);

    return () => context.revert();
  }, [mode]);

  const handleModeSwitch = (newMode: AuthMode) => {
    if (mode !== newMode) {
      setMode(newMode);
      navigate(`/${newMode}`);
    }
  };

  return (
    <AuthLayout>
      <section className="mx-auto flex w-full max-w-[380px] flex-col justify-center min-h-[500px] p-6 sm:p-10">
        <header className="mb-10 text-center">
          <a href="/" className="text-2xl font-bold tracking-tight text-neutral-900">
            aura<span className="text-violet-500">.</span>
          </a>
        </header>

        {mode === "login" ? (
          <div className="auth-heading mb-8 text-center">
            <h1 className="my-0 text-3xl font-semibold tracking-tight text-neutral-900">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Enter your details below.
            </p>
          </div>
        ) : (
          <div className="auth-heading mb-8 text-center">
            <h1 className="my-0 text-3xl font-semibold tracking-tight text-neutral-900">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Join us today. It only takes a few minutes.
            </p>
          </div>
        )}

        <div className="relative mb-4 flex rounded-xl bg-gray-100 p-1">
          <div
            ref={indicatorRef}
            className="absolute bottom-1 left-1 top-1 w-[calc(50%-4px)] rounded-xl bg-white border-2 border-gray-50 shadow-sm"
          />

          <button
            type="button"
            onClick={() => handleModeSwitch("login")}
            aria-pressed={mode === "login"}
            className={`relative z-10 w-1/2 py-2.5 text-sm font-medium transition-colors duration-300 ${
              mode === "login" ? "text-black" : "text-gray-500"
            }`}
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => handleModeSwitch("signup")}
            aria-pressed={mode === "signup"}
            className={`relative z-10 w-1/2 py-2.5 text-sm font-medium transition-colors duration-300 ${
              mode === "signup" ? "text-black" : "text-gray-500"
            }`}
          >
            Signup
          </button>
        </div>

        <div ref={formRef} key={mode} className="w-full">
          {mode === "login" ? (
            <LoginForm onSwitch={() => handleModeSwitch("signup")} />
          ) : (
            <SignupForm onSwitch={() => handleModeSwitch("login")} />
          )}
        </div>
        <AuthDivider />
        <SocialLogin />
      </section>
    </AuthLayout>
  );
}

export default AuthPage;