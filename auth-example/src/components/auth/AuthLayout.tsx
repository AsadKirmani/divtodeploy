
import { useLayoutEffect, useRef } from "react";
import type { ReactNode } from "react";
import gsap from "gsap";

import abstractIllustration from "../../assets/Vivid Abstract Color Motif.png";

interface AuthLayoutProps {
  children: ReactNode;
}

function AuthLayout({ children }: AuthLayoutProps) {
  const layoutRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLElement>(null);
  const illustrationRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const intro = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      intro.from(cardRef.current, {
        opacity: 0,
        scale: 0.97,
        y: 24,
        duration: 0.8,
      });

      intro.from(
        illustrationRef.current,
        {
          opacity: 0,
          x: -35,
          duration: 0.8,
        },
        "-=0.5"
      );
    }, layoutRef);

    return () => ctx.revert();
  }, []);

  return (
    <main
      ref={layoutRef}
      className="min-h-screen w-full flex items-center justify-center bg-gray-50"
    >
      <section
        ref={cardRef}
        className="w-full max-w-5xl flex flex-col md:flex-row items-start gap-6 rounded-xl bg-white"
      >
        <div className="w-full md:w-1/2">
          {children}
        </div>
        <div
          ref={illustrationRef}
          className="hidden md:block md:w-1/2 h-[664px] shrink-0 overflow-hidden rounded-r-xl"
        >
          <img
            ref={imageRef}
            src={abstractIllustration}
            alt="Abstract 3D illustration"
            className="w-full h-full object-cover"
          />
        </div>

      </section>
    </main>
  );
}

export default AuthLayout;
