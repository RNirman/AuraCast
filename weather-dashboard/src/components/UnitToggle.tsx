'use client';

import { useSearchParams, useRouter, usePathname } from "next/navigation";

export default function UnitToggle() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentUnit = searchParams.get("unit") || "metric";
  const isCelsius = currentUnit === "metric";

  const toggleUnit = () => {
    const newUnit = isCelsius ? "imperial" : "metric";

    const newParams = new URLSearchParams(searchParams as any);
    newParams.set('unit', newUnit);

    router.push(`${pathname}?${newParams.toString()}`);
  };

  return (
    <button
      onClick={toggleUnit}
      aria-pressed={!isCelsius}
      aria-label="Toggle temperature unit"
      className={`relative inline-flex items-center w-36 h-10 p-1 rounded-full transition-colors focus:outline-none ${isCelsius ? 'bg-blue-600' : 'bg-gray-300'}`}
    >
      {/* Labels (on top of the pill) */}
      <div className="flex-1 text-center text-xs font-medium text-white z-10">°C</div>
      <div className="flex-1 text-center text-xs font-medium text-white z-10">°F</div>

      {/* Knob */}
      <span
        className={`absolute top-1 left-1 w-8 h-8 bg-white rounded-full shadow-md transform transition-transform ${isCelsius ? 'translate-x-0' : 'translate-x-26'}`}
      />
    </button>
  );
}