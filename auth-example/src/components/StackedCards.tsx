import React from "react";

interface StackedCardsProps {
  currentIndex: number;
  children: React.ReactNode[];
  containerHeightClass?: string;
}

export default function StackedCards({
  currentIndex,
  children,
  containerHeightClass = "h-[60px]",
}: StackedCardsProps) {
  
  const getStackClasses = (index: number) => {
    const diff = currentIndex - index;
    const baseTransition =
      "absolute h-full inset-x-0 bottom-0 origin-bottom transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] rounded-xl";

    if (diff === 0) {
      return `${baseTransition} translate-y-0 scale-100 opacity-100 z-30 shadow-[0_4px_20px_rgb(0,0,0,0.05)] pointer-events-auto`;
    } else if (diff === 1) {
      return `${baseTransition} -translate-y-[12px] scale-[0.93] opacity-100 z-20 pointer-events-auto cursor-pointer`;
    } else if (diff === 2) {
      return `${baseTransition} -translate-y-[24px] scale-[0.86] opacity-100 z-10 pointer-events-auto cursor-pointer`;
    } else if (diff >= 3) {
      return `${baseTransition} -translate-y-[36px] scale-[0.79] opacity-100 z-10 pointer-events-auto cursor-pointer`;
    }

    return `${baseTransition} translate-y-[20px] scale-[0.95] opacity-0 z-0 pointer-events-none`;
  };

  return (
    <div className={`relative w-full ${containerHeightClass}`}>
      {React.Children.map(children, (child, index) => {
        return (
          <div key={index} className={getStackClasses(index)}>
            {child}
          </div>
        );
      })}
    </div>
  );
}