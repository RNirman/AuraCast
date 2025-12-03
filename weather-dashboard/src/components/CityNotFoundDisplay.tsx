import SearchInput from './SearchInput';

interface CityNotFoundProps {
  city: string;
}

export default function CityNotFoundDisplay({ city }: CityNotFoundProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-linear-to-br from-rose-800 to-rose-900 text-white transition-colors duration-300">
      <div className="w-full max-w-lg bg-white/10 dark:bg-black/30 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl p-8 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-rose-100 drop-shadow-lg">City Not Found 🌍</h1>
        <p className="text-lg md:text-xl mb-4 text-white/90">
          We couldn't find weather data for <strong className="font-semibold">"{city}"</strong>.
        </p>
        <p className="text-sm md:text-base mb-6 text-white/80">
          Please check the spelling or try a different city name.
        </p>

        <div className="mx-auto max-w-md">
          <SearchInput />
        </div>

        <p className="text-sm mt-4 text-white/70">
          Note: OpenWeatherMap requires the city name to be accurate.
        </p>
      </div>
    </main>
  );
}