import Link from 'next/link';
import UnitToggle from '@/components/UnitToggle';

export const dynamic = 'force-dynamic';

interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
}

interface WeatherDetailsPageProps {
  params: {
    city: string;
  };
  searchParams?: {
    unit?: 'metric' | 'imperial';
  };
}

export default async function WeatherDetailsPage({ params, searchParams }: WeatherDetailsPageProps) {
  const API_KEY = process.env.OPENWEATHERMAP_API_KEY;
  
  const param = await params;
  const city = param.city;

  const u = await searchParams;
  const unit = u?.unit || "metric";

  if (!API_KEY) {
    return <div className="text-center p-8">API Key is missing!</div>;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${unit}`;
  
  const unitSymbol = unit === 'metric' ? '°C' : '°F';
  
  try {
    const res = await fetch(url, { cache: 'no-store' });

    if (!res.ok) {
      return <div className="text-center p-8">Error fetching data for {city}. City not found.</div>;
    }

    const weatherData: WeatherData = await res.json();
    
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-100 dark:bg-[#111113] transition-colors duration-200">
        <div className="flex justify-end mb-4 max-w-xl mx-auto">
          <UnitToggle />
        </div>
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-gray-100">Weather Details for {weatherData.name}</h1>

        <div className="text-center">
          <p className="text-6xl font-extrabold mb-4 text-gray-800 dark:text-gray-100">{Math.round(weatherData.main.temp)}{unitSymbol}</p>
          <p className="text-xl capitalize mb-6 text-gray-700 dark:text-gray-300">{weatherData.weather[0].description}</p>

          <div className="mt-6 space-y-2 mb-6">
            <p className="text-lg text-gray-700 dark:text-gray-300">Feels Like: {Math.round(weatherData.main.feels_like)}{unitSymbol}</p>
            <p className="text-lg text-gray-700 dark:text-gray-300">Humidity: {weatherData.main.humidity}%</p>
            <p className="text-lg text-gray-700 dark:text-gray-300">Pressure: {weatherData.main.pressure} hPa</p>
            <p className="text-lg text-gray-700 dark:text-gray-300">Wind Speed: {weatherData.wind.speed} m/s</p>
          </div>

          <Link
            href="/"
            className="mt-6 bg-blue-600 dark:bg-blue-700 text-white p-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </main>
    );
  } catch (error) {
    return <div className="text-center p-8">An unexpected error occurred.</div>;
  }
}