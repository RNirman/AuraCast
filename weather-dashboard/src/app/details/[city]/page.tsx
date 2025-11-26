import Link from 'next/link';
import UnitToggle from '@/components/UnitToggle';
import { weatherClassMap } from '@/utils/weather-styles';

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
    main: string;
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
    const weatherMain = weatherData.weather[0].main;
    const weatherStyle = weatherClassMap[weatherMain] || weatherClassMap['default'];
    
    return (
      <main className={`flex min-h-screen flex-col items-center justify-center p-8 ${weatherStyle} transition-all duration-500`}>
        <div className="flex justify-end mb-4 max-w-xl mx-auto w-full">
          <UnitToggle />
        </div>
        <h1 className="text-4xl font-bold mb-8 drop-shadow-lg">Weather Details for {weatherData.name}</h1>

        <div className="text-center">
          <p className="text-6xl font-extrabold mb-4 drop-shadow-lg">{Math.round(weatherData.main.temp)}{unitSymbol}</p>
          <p className="text-xl capitalize mb-6 drop-shadow">{weatherData.weather[0].description}</p>

          <div className="mt-6 space-y-2 mb-6 bg-white/10 dark:bg-black/20 backdrop-blur-md p-6 rounded-lg border border-white/20">
            <p className="text-lg drop-shadow">Feels Like: {Math.round(weatherData.main.feels_like)}{unitSymbol}</p>
            <p className="text-lg drop-shadow">Humidity: {weatherData.main.humidity}%</p>
            <p className="text-lg drop-shadow">Pressure: {weatherData.main.pressure} hPa</p>
            <p className="text-lg drop-shadow">Wind Speed: {weatherData.wind.speed} m/s</p>
          </div>

          <Link
            href="/"
            className="mt-6 bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-lg hover:bg-white/30 transition-all duration-200 font-semibold drop-shadow-lg border border-white/30"
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