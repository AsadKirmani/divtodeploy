import { format } from "date-fns";
import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(Draggable);

export const WeeklyCarousel = ({
  viewMode,
  carouselDates,
  currentIndex,
}: {
  viewMode: string;
  carouselDates: Date[];
  currentIndex: number;
}) => {
  const carouselRef = useRef(null);
  const dateRefs = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    if (viewMode !== "weekly" || !carouselRef.current) return;
    const ctx = gsap.context(() => {
      const initialX = -(currentIndex * 56);
      gsap.set(carouselRef.current, { x: 0 });

      const updateArc = () => {
        const containerCenterX = window.innerWidth / 2;
        dateRefs.current.forEach((item) => {
          if (!item) return;
          const rect = item.getBoundingClientRect();
          const distance = Math.abs(
            containerCenterX - (rect.left + rect.width / 2),
          );
          const normalized = Math.min(distance / 168, 1);

          gsap.set(item, {
            y: normalized * normalized * 10,
            opacity: Math.max(0.3, 1 - normalized * 0.4),
          });
          const numberSpan = item.querySelector(".date-number");
          if (numberSpan)
            gsap.set(numberSpan, { scale: 1 - normalized * 0.35 });
          const activeBg = item.querySelector(".active-bg");
          if (activeBg)
            gsap.to(activeBg, {
              opacity: distance < 28 ? 1 : 0,
              duration: 0.2,
            });
        });
      };
      updateArc();

      const tl = gsap.timeline({
        onComplete: () => {
          Draggable.create(carouselRef.current, {
            type: "x",
            inertia: true,
            edgeResistance: 0.8,
            bounds: { minX: -((carouselDates.length - 1) * 56), maxX: 0 },
            onDrag: updateArc,
            onThrowUpdate: updateArc,
          });
        },
      });
      tl.to(carouselRef.current, {
        x: initialX,
        duration: 1.5,
        ease: "power3.inOut",
        onUpdate: updateArc,
      });
    });
    return () => ctx.revert();
  }, [carouselDates, viewMode, currentIndex]);

  return (
    <div className="absolute inset-0 w-full flex items-center justify-start overflow-hidden animate-in fade-in duration-500 [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
      <div
        ref={carouselRef}
        className="relative z-10 flex items-center w-max cursor-grab active:cursor-grabbing px-[calc(50%-28px)]"
      >
        {carouselDates.map((date, index) => (
          <div
            key={index}
            ref={(el) => {
              dateRefs.current[index] = el;
            }}
            className="flex flex-col items-center justify-center shrink-0 w-[56px] date-item relative"
          >
            <span className="text-white/60 text-xs font-medium mb-2">
              {format(date, "EEE")}
            </span>
            <div className="relative flex justify-center items-center w-12 h-12">
              <div className="active-bg absolute inset-0 bg-white/20 shadow-inner rounded-full opacity-0 backdrop-blur-sm"></div>
              <span className="date-number relative z-10 text-white text-3xl font-semibold">
                {format(date, "d")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
